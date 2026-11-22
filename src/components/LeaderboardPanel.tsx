import { useMemo, useState } from 'react';
import { Award, Radio, Trophy, Users } from 'lucide-react';
import type { ActivePlayer, GameMode, HeroClassId, LeaderboardEntry } from '../types/game';

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[];
  activePlayers: ActivePlayer[];
  isConnected: boolean;
  onlineCount: number;
  isLoading: boolean;
  currentSessionId?: string | null;
  latestEntryId?: string | null;
  compact?: boolean;
}

const MODE_LABELS: Record<GameMode, string> = {
  marathon: 'Petualangan 80',
  sprint: 'Ekspedisi 25',
  topic: 'Dungeon Bab',
};

const HERO_LABELS: Record<HeroClassId, string> = {
  alkemis: 'Alkemis',
  ksatria: 'Ksatria',
  penjelajah: 'Penjelajah',
};

export function LeaderboardPanel({
  leaderboard,
  activePlayers,
  isConnected,
  onlineCount,
  isLoading,
  currentSessionId,
  latestEntryId,
  compact = false,
}: LeaderboardPanelProps) {
  const [filterMode, setFilterMode] = useState<'all' | GameMode>('all');

  const filteredEntries = useMemo(() => {
    const base = filterMode === 'all' ? leaderboard : leaderboard.filter((item) => item.mode === filterMode);
    return base.slice(0, compact ? 10 : 12);
  }, [leaderboard, filterMode, compact]);

  return (
    <aside className="flex flex-col rounded-2xl border border-slate-700/70 bg-[#111E30]/95 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100 truncate">
            Papan Peringkat Real-Time
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-mono-num">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-500'}`}
              aria-hidden="true"
            />
            <span>{isConnected ? 'Live' : 'Sinkron'}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-mono-num">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{onlineCount}</span>
          </span>
        </div>
      </div>

      {/* Live Active Players Strip */}
      {activePlayers.length > 0 && (
        <div className="px-4 py-3 border-b border-slate-700/60 bg-emerald-950/25">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-2">
            <span className="inline-flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bertarung Live ({activePlayers.length})</span>
            </span>
            <span className="text-slate-400">Skor & HP</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {activePlayers.map((player) => {
              const isMe = currentSessionId && player.sessionId === currentSessionId;
              return (
                <div
                  key={player.sessionId}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                    isMe
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-800/70 text-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {player.name}{' '}
                      <span className="font-mono-num text-amber-300">Lv.{player.level}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {HERO_LABELS[player.heroClass]} · {player.className} · Soal {player.currentIndex}/
                      {player.totalQuestions}
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono-num">
                    <div className="font-bold text-emerald-300">{player.score}</div>
                    <div className="text-[11px] text-rose-300">
                      HP {player.hp}/{player.maxHp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-1 border-b border-slate-800/80 overflow-x-auto">
        {(
          [
            { id: 'all', label: 'Semua' },
            { id: 'marathon', label: 'Petualangan 80' },
            { id: 'sprint', label: 'Ekspedisi 25' },
            { id: 'topic', label: 'Dungeon Bab' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterMode(tab.id)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              filterMode === tab.id
                ? 'bg-slate-700/90 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/70 max-h-[380px]">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-400">Memuat papan peringkat...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-6 text-center">
            <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">Belum ada petualang tercatat</p>
            <p className="text-xs text-slate-400 mt-1">
              Kalahkan penunggu laboratorium untuk mencatatkan namamu di papan peringkat kelas.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const rank = idx + 1;
            const isHighlighted = latestEntryId === entry.id;
            return (
              <div
                key={entry.id}
                className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                  isHighlighted ? 'bg-amber-500/10' : 'hover:bg-slate-800/35'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono-num shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : rank === 2
                          ? 'bg-slate-300/15 text-slate-200 border border-slate-400/30'
                          : rank === 3
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                            : 'text-slate-400 bg-slate-800/60'
                    }`}
                  >
                    {rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-100 truncate">
                      <span className="truncate">{entry.name}</span>
                      <span className="text-xs font-mono-num text-amber-300 shrink-0">
                        Lv.{entry.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <span>{HERO_LABELS[entry.heroClass]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.className}</span>
                      <span aria-hidden="true">·</span>
                      <span>{MODE_LABELS[entry.mode]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{entry.accuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-300 font-mono-num">
                    {entry.score.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono-num">
                    {entry.correctCount}/{entry.totalQuestions} · {entry.victory ? 'Menang' : 'Gugur'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
