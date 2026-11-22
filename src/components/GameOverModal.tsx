import { useMemo, useState } from 'react';
import { Award, CheckCircle2, Home, RotateCcw, ShieldAlert, XCircle } from 'lucide-react';
import { HERO_CLASSES, TOPICS } from '../data/questions';
import type { ActivePlayer, AnswerRecord, HeroClassId, LeaderboardEntry } from '../types/game';
import { LeaderboardPanel } from './LeaderboardPanel';

interface GameOverModalProps {
  playerName: string;
  playerClass: string;
  heroClass: HeroClassId;
  level: number;
  hp: number;
  maxHp: number;
  victory: boolean;
  score: number;
  maxStreak: number;
  records: AnswerRecord[];
  submittedRank: number | null;
  leaderboard: LeaderboardEntry[];
  activePlayers: ActivePlayer[];
  isConnected: boolean;
  onlineCount: number;
  latestEntryId: string | null;
  onPlayAgain: () => void;
  onReturnMenu: () => void;
}

export function GameOverModal({
  playerName,
  playerClass,
  heroClass,
  level,
  hp,
  maxHp,
  victory,
  score,
  maxStreak,
  records,
  submittedRank,
  leaderboard,
  activePlayers,
  isConnected,
  onlineCount,
  latestEntryId,
  onPlayAgain,
  onReturnMenu,
}: GameOverModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'leaderboard'>('summary');
  const [emblemFailed, setEmblemFailed] = useState(false);

  const heroMeta = HERO_CLASSES.find((h) => h.id === heroClass) || HERO_CLASSES[0];
  const correctCount = records.filter((r) => r.isCorrect).length;
  const totalCount = records.length || 1;
  const accuracy = Math.round((correctCount / totalCount) * 100);

  const topicStats = useMemo(() => {
    return TOPICS.map((topic) => {
      const items = records.filter((r) => r.topic === topic.id);
      const correct = items.filter((r) => r.isCorrect).length;
      return {
        ...topic,
        total: items.length,
        correct,
        pct: items.length > 0 ? Math.round((correct / items.length) * 100) : null,
      };
    }).filter((t) => t.total > 0);
  }, [records]);

  const headline = victory
    ? accuracy >= 85
      ? 'Kemenangan Sempurna di Arena!'
      : 'Semua Penjaga Wilayah Ditaklukkan!'
    : 'Hero Tumbang di Medan Sains';

  const emblemSrc = victory
    ? '/src/assets/images/quiz_trophy_emblem_1795323401119.jpg'
    : '/src/assets/images/rpg_boss_titan_1795324123868.jpg';

  return (
    <div className="min-h-screen bg-[#0B1522] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700/80 bg-[#111E30] shadow-2xl overflow-hidden">
        {/* Hero Summary Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-[#12243A] to-[#0E1A2A]">
          <div
            className={`w-24 h-24 rounded-2xl overflow-hidden border bg-slate-900 shrink-0 flex items-center justify-center ${
              victory ? 'border-amber-400/50' : 'border-rose-500/50'
            }`}
          >
            {!emblemFailed ? (
              <img
                src={emblemSrc}
                alt={victory ? 'Medali Kemenangan Arena Sains' : 'Penjaga Arena Sains'}
                referrerPolicy="no-referrer"
                onError={() => setEmblemFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : victory ? (
              <Award className="w-10 h-10 text-amber-400" />
            ) : (
              <ShieldAlert className="w-10 h-10 text-rose-400" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs text-slate-400 mb-1">
              <span>{playerName}</span>
              <span aria-hidden="true"> · </span>
              <span>{heroMeta.name}</span>
              <span aria-hidden="true"> · </span>
              <span>Kelas {playerClass}</span>
              {submittedRank && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="text-amber-300 font-semibold font-mono-num">
                    Peringkat #{submittedRank} Global
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{headline}</h1>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                <div className="text-[11px] text-slate-400">Skor RPG</div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono-num">
                  {score.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                <div className="text-[11px] text-slate-400">Level & Sisa HP</div>
                <div className="text-lg font-extrabold text-white font-mono-num">
                  Lv.{level} · {hp}/{maxHp}
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                <div className="text-[11px] text-slate-400">Akurasi</div>
                <div className="text-lg font-extrabold text-sky-300 font-mono-num">
                  {accuracy}% ({correctCount}/{totalCount})
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                <div className="text-[11px] text-slate-400">Kombo Terbaik</div>
                <div className="text-lg font-extrabold text-amber-300 font-mono-num">×{maxStreak}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: 'summary', label: 'Penguasaan Wilayah' },
              { id: 'review', label: `Pembahasan (${records.length})` },
              { id: 'leaderboard', label: 'Papan Peringkat' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[380px] overflow-y-auto">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {topicStats.map((topic) => (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-200">{topic.label}</span>
                    <span className="font-mono-num text-xs text-slate-300">
                      {topic.correct}/{topic.total} benar ({topic.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (topic.pct ?? 0) >= 75
                          ? 'bg-emerald-500'
                          : (topic.pct ?? 0) >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${topic.pct ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              {records.map((rec, idx) => (
                <div
                  key={`${rec.questionId}-${idx}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      <span className="font-mono-num text-slate-400 mr-2">#{rec.questionId}</span>
                      {rec.question}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
                        rec.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {rec.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{rec.damageDealt} DMG</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>
                            Salah ({rec.selected} → {rec.correctAnswer})
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardPanel
              leaderboard={leaderboard}
              activePlayers={activePlayers}
              isConnected={isConnected}
              onlineCount={onlineCount}
              isLoading={false}
              latestEntryId={latestEntryId}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReturnMenu}
            className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
