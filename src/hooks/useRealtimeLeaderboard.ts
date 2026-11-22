import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActivePlayer, GameMode, HeroClassId, LeaderboardEntry, TopicId } from '../types/game';

interface SubmitScorePayload {
  sessionId: string;
  name: string;
  className: string;
  heroClass: HeroClassId;
  level: number;
  victory: boolean;
  mode: GameMode;
  topicFilter?: TopicId | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxStreak: number;
  avgTimeMs: number;
}

export function useRealtimeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [latestEntryId, setLatestEntryId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const pendingMessagesRef = useRef<string[]>([]);

  const fetchInitial = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) return;
      const data = (await res.json()) as {
        leaderboard?: LeaderboardEntry[];
        activePlayers?: ActivePlayer[];
      };
      if (Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
      if (Array.isArray(data.activePlayers)) {
        setActivePlayers(data.activePlayers);
      }
    } catch {
      // Ignore network failure during initial hydration; WebSocket retry will sync
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsLoading(false);
      while (pendingMessagesRef.current.length > 0) {
        const queued = pendingMessagesRef.current.shift();
        if (queued) ws.send(queued);
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as {
          type: string;
          leaderboard?: LeaderboardEntry[];
          activePlayers?: ActivePlayer[];
          onlineCount?: number;
          latestEntry?: LeaderboardEntry;
        };

        if (msg.type === 'init') {
          if (Array.isArray(msg.leaderboard)) setLeaderboard(msg.leaderboard);
          if (Array.isArray(msg.activePlayers)) setActivePlayers(msg.activePlayers);
          if (typeof msg.onlineCount === 'number') setOnlineCount(msg.onlineCount);
          setIsLoading(false);
        } else if (msg.type === 'leaderboard:update') {
          if (Array.isArray(msg.leaderboard)) setLeaderboard(msg.leaderboard);
          if (msg.latestEntry?.id) setLatestEntryId(msg.latestEntry.id);
        } else if (msg.type === 'presence:update') {
          if (Array.isArray(msg.activePlayers)) setActivePlayers(msg.activePlayers);
        } else if (msg.type === 'online:count') {
          if (typeof msg.onlineCount === 'number') setOnlineCount(msg.onlineCount);
        }
      } catch {
        // Ignore malformed packets
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = window.setTimeout(() => {
        connect();
      }, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    fetchInitial();
    connect();
    return () => {
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchInitial, connect]);

  const sendWs = useCallback((type: string, payload: Record<string, unknown>) => {
    const serialized = JSON.stringify({ type, payload });
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(serialized);
    } else {
      pendingMessagesRef.current.push(serialized);
      if (pendingMessagesRef.current.length > 10) {
        pendingMessagesRef.current.shift();
      }
    }
  }, []);

  const sendJoin = useCallback(
    (params: {
      sessionId: string;
      name: string;
      className: string;
      heroClass: HeroClassId;
      level: number;
      hp: number;
      maxHp: number;
      mode: GameMode;
      totalQuestions: number;
    }) => {
      sendWs('player:join', params);
    },
    [sendWs],
  );

  const sendProgress = useCallback(
    (params: {
      sessionId: string;
      score: number;
      streak: number;
      currentIndex: number;
      correctCount: number;
      level: number;
      hp: number;
    }) => {
      sendWs('player:progress', params);
    },
    [sendWs],
  );

  const sendLeave = useCallback(
    (sessionId: string) => {
      sendWs('player:leave', { sessionId });
    },
    [sendWs],
  );

  const submitScore = useCallback(
    async (payload: SubmitScorePayload): Promise<{ rank: number; entry: LeaderboardEntry } | null> => {
      try {
        const res = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as {
          entry: LeaderboardEntry;
          rank: number;
          leaderboard?: LeaderboardEntry[];
        };
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
        if (data.entry?.id) {
          setLatestEntryId(data.entry.id);
        }
        return { rank: data.rank, entry: data.entry };
      } catch {
        return null;
      }
    },
    [],
  );

  return {
    leaderboard,
    activePlayers,
    isConnected,
    onlineCount,
    isLoading,
    latestEntryId,
    sendJoin,
    sendProgress,
    sendLeave,
    submitScore,
  };
}
