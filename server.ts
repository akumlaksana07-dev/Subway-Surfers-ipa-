import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type GameMode = 'marathon' | 'sprint' | 'topic';
type HeroClassId = 'alkemis' | 'ksatria' | 'penjelajah';

interface LeaderboardEntry {
  id: string;
  name: string;
  className: string;
  heroClass: HeroClassId;
  level: number;
  victory: boolean;
  mode: GameMode;
  topicFilter: string | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  maxStreak: number;
  avgTimeMs: number;
  createdAt: string;
}

interface ActivePlayer {
  sessionId: string;
  name: string;
  className: string;
  heroClass: HeroClassId;
  level: number;
  hp: number;
  maxHp: number;
  mode: GameMode;
  score: number;
  streak: number;
  currentIndex: number;
  totalQuestions: number;
  correctCount: number;
  updatedAt: number;
}

const DATA_DIR = path.resolve(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'leaderboard.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function parseHeroClass(value: unknown): HeroClassId {
  if (value === 'ksatria' || value === 'penjelajah') return value;
  return 'alkemis';
}

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      heroClass: parseHeroClass(item?.heroClass),
      level: typeof item?.level === 'number' ? item.level : 1,
      victory: typeof item?.victory === 'boolean' ? item.victory : true,
    }));
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist leaderboard:', err);
  }
}

function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    if (a.avgTimeMs !== b.avgTimeMs) return a.avgTimeMs - b.avgTimeMs;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function clampInt(value: unknown, min: number, max: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, Math.round(num)));
}

function parseMode(value: unknown): GameMode {
  if (value === 'sprint' || value === 'topic') return value;
  return 'marathon';
}

async function startServer(): Promise<void> {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  app.use(express.json({ limit: '16kb' }));

  let leaderboard: LeaderboardEntry[] = sortLeaderboard(loadLeaderboard());
  const activePlayers = new Map<string, ActivePlayer>();
  const socketToSession = new Map<WebSocket, string>();

  function getActiveList(): ActivePlayer[] {
    const now = Date.now();
    for (const [sid, player] of activePlayers.entries()) {
      if (now - player.updatedAt > 15 * 60 * 1000) {
        activePlayers.delete(sid);
      }
    }
    return Array.from(activePlayers.values()).sort((a, b) => b.score - a.score);
  }

  function broadcast(payload: unknown): void {
    const raw = JSON.stringify(payload);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }
  }

  function addScoreEntry(body: Record<string, unknown>): LeaderboardEntry | null {
    const name = sanitizeText(body.name, 28);
    if (!name) return null;
    const className = sanitizeText(body.className, 12) || '8A';
    const heroClass = parseHeroClass(body.heroClass);
    const level = clampInt(body.level, 1, 50);
    const victory = body.victory !== false;
    const mode = parseMode(body.mode);
    const topicFilter = typeof body.topicFilter === 'string' ? sanitizeText(body.topicFilter, 24) : null;
    const totalQuestions = clampInt(body.totalQuestions, 1, 80);
    const correctCount = clampInt(body.correctCount, 0, totalQuestions);
    const maxStreak = clampInt(body.maxStreak, 0, totalQuestions);
    const score = clampInt(body.score, 0, 150000);
    const avgTimeMs = clampInt(body.avgTimeMs, 200, 300000);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const entry: LeaderboardEntry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      className,
      heroClass,
      level,
      victory,
      mode,
      topicFilter,
      score,
      correctCount,
      totalQuestions,
      accuracy,
      maxStreak,
      avgTimeMs,
      createdAt: new Date().toISOString(),
    };

    leaderboard = sortLeaderboard([...leaderboard, entry]).slice(0, 100);
    saveLeaderboard(leaderboard);
    return entry;
  }

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, connectedClients: wss.clients.size });
  });

  app.get('/api/leaderboard', (req, res) => {
    const modeFilter = typeof req.query.mode === 'string' ? req.query.mode : 'all';
    const filtered =
      modeFilter === 'all'
        ? leaderboard
        : leaderboard.filter((entry) => entry.mode === modeFilter);

    res.json({
      leaderboard: filtered.slice(0, 50),
      activePlayers: getActiveList(),
    });
  });

  app.post('/api/scores', (req, res) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const entry = addScoreEntry(body);
    if (!entry) {
      res.status(400).json({ error: 'Nama pemain wajib diisi.' });
      return;
    }

    const sessionId = sanitizeText(body.sessionId, 64);
    if (sessionId && activePlayers.has(sessionId)) {
      activePlayers.delete(sessionId);
      broadcast({ type: 'presence:update', activePlayers: getActiveList() });
    }

    broadcast({
      type: 'leaderboard:update',
      leaderboard: leaderboard.slice(0, 50),
      latestEntry: entry,
    });

    const rank = leaderboard.findIndex((item) => item.id === entry.id) + 1;
    res.status(201).json({ entry, rank, leaderboard: leaderboard.slice(0, 50) });
  });

  wss.on('connection', (ws) => {
    ws.send(
      JSON.stringify({
        type: 'init',
        leaderboard: leaderboard.slice(0, 50),
        activePlayers: getActiveList(),
        onlineCount: wss.clients.size,
      }),
    );

    broadcast({ type: 'online:count', onlineCount: wss.clients.size });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString()) as { type?: string; payload?: Record<string, unknown> };
        const payload = msg.payload || {};

        if (msg.type === 'player:join') {
          const sessionId = sanitizeText(payload.sessionId, 64);
          const name = sanitizeText(payload.name, 28);
          if (!sessionId || !name) return;

          const maxHp = clampInt(payload.maxHp, 50, 200);
          socketToSession.set(ws, sessionId);
          activePlayers.set(sessionId, {
            sessionId,
            name,
            className: sanitizeText(payload.className, 12) || '8A',
            heroClass: parseHeroClass(payload.heroClass),
            level: clampInt(payload.level, 1, 50),
            hp: clampInt(payload.hp, 0, maxHp),
            maxHp,
            mode: parseMode(payload.mode),
            score: 0,
            streak: 0,
            currentIndex: 1,
            totalQuestions: clampInt(payload.totalQuestions, 1, 80),
            correctCount: 0,
            updatedAt: Date.now(),
          });

          broadcast({ type: 'presence:update', activePlayers: getActiveList() });
        } else if (msg.type === 'player:progress') {
          const sessionId = sanitizeText(payload.sessionId, 64);
          if (!sessionId) return;
          const existing = activePlayers.get(sessionId);
          if (!existing) return;

          const totalQuestions = existing.totalQuestions;
          activePlayers.set(sessionId, {
            ...existing,
            score: clampInt(payload.score, 0, 150000),
            streak: clampInt(payload.streak, 0, totalQuestions),
            currentIndex: clampInt(payload.currentIndex, 1, totalQuestions),
            correctCount: clampInt(payload.correctCount, 0, totalQuestions),
            level: clampInt(payload.level, 1, 50),
            hp: clampInt(payload.hp, 0, existing.maxHp),
            updatedAt: Date.now(),
          });

          broadcast({ type: 'presence:update', activePlayers: getActiveList() });
        } else if (msg.type === 'player:leave') {
          const sessionId = sanitizeText(payload.sessionId, 64) || socketToSession.get(ws);
          if (sessionId && activePlayers.has(sessionId)) {
            activePlayers.delete(sessionId);
            broadcast({ type: 'presence:update', activePlayers: getActiveList() });
          }
        }
      } catch {
        // Ignore malformed messages
      }
    });

    ws.on('close', () => {
      const sid = socketToSession.get(ws);
      socketToSession.delete(ws);
      if (sid && activePlayers.has(sid)) {
        activePlayers.delete(sid);
        broadcast({ type: 'presence:update', activePlayers: getActiveList() });
      }
      broadcast({ type: 'online:count', onlineCount: wss.clients.size });
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Arena Sains RPG server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
