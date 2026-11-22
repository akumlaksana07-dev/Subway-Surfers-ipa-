import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  FlaskConical,
  Heart,
  Lightbulb,
  Pause,
  Scissors,
  ShieldAlert,
  Sparkles,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { HERO_CLASSES, REGION_BOSSES } from '../data/questions';
import type {
  ActivePlayer,
  AnswerRecord,
  HeroClassId,
  LeaderboardEntry,
  LifelinesState,
  OptionKey,
  QuizQuestion,
  TopicId,
} from '../types/game';
import { LeaderboardPanel } from './LeaderboardPanel';
import { SubwayRunnerCanvas } from './SubwayRunnerCanvas';
import { TopicIllustration } from './TopicIllustration';

interface GameplayArenaProps {
  playerName: string;
  playerClass: string;
  heroClass: HeroClassId;
  sessionId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  coins: number;
  streak: number;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  bossHpMap: Record<TopicId, { current: number; max: number }>;
  lifelines: LifelinesState;
  isPaused: boolean;
  isQuizOpen: boolean;
  isMuted: boolean;
  leaderboard: LeaderboardEntry[];
  activePlayers: ActivePlayer[];
  isConnected: boolean;
  onlineCount: number;
  latestEntryId: string | null;
  combatLog: string;
  lastQuizOutcomeSeq: number;
  lastQuizOutcomeCorrect: boolean;
  onCollectCoin: () => void;
  onCollectHeal: () => void;
  onObstacleHit: () => void;
  onReachQuizPortal: () => void;
  onSelectAnswer: (
    key: OptionKey,
    timeTakenMs: number,
    speedBonus: number,
    usedDouble: boolean,
  ) => {
    isCorrect: boolean;
    pointsEarned: number;
    damageDealt: number;
    damageTaken: number;
  };
  onNextQuestion: () => void;
  onUseFiftyFifty: () => void;
  onUseHint: () => void;
  onUseDoublePoints: () => void;
  onUsePotion: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onQuitToMenu: () => void;
  lastAnswerRecord: AnswerRecord | null;
}

const SPEED_BONUS_SECONDS = 25;

export function GameplayArena({
  playerName,
  playerClass,
  heroClass,
  sessionId,
  questions,
  currentIndex,
  score,
  coins,
  streak,
  hp,
  maxHp,
  xp,
  level,
  bossHpMap,
  lifelines,
  isPaused,
  isQuizOpen,
  isMuted,
  leaderboard,
  activePlayers,
  isConnected,
  onlineCount,
  latestEntryId,
  combatLog,
  lastQuizOutcomeSeq,
  lastQuizOutcomeCorrect,
  onCollectCoin,
  onCollectHeal,
  onObstacleHit,
  onReachQuizPortal,
  onSelectAnswer,
  onNextQuestion,
  onUseFiftyFifty,
  onUseHint,
  onUseDoublePoints,
  onUsePotion,
  onTogglePause,
  onToggleMute,
  onQuitToMenu,
  lastAnswerRecord,
}: GameplayArenaProps) {
  const question = questions[currentIndex];
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [portalMetersLeft, setPortalMetersLeft] = useState(115);
  const [triggerPortalSeq, setTriggerPortalSeq] = useState(0);

  const [timeLeft, setTimeLeft] = useState(SPEED_BONUS_SECONDS);
  const [eliminatedKeys, setEliminatedKeys] = useState<OptionKey[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [doubleActive, setDoubleActive] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [bossImgFailed, setBossImgFailed] = useState(false);

  const answered = lastAnswerRecord !== null && lastAnswerRecord.questionId === question?.id;
  const heroMeta = HERO_CLASSES.find((h) => h.id === heroClass) || HERO_CLASSES[0];
  const bossMeta = question ? REGION_BOSSES[question.topic] : REGION_BOSSES['zat-aditif'];
  const bossState = question ? bossHpMap[question.topic] : { current: 100, max: 100 };

  const quizOpenStartRef = useRef<number>(Date.now());

  useEffect(() => {
    setDistanceMeters(0);
    setPortalMetersLeft(115);
  }, [sessionId]);

  useEffect(() => {
    if (isQuizOpen) {
      setTimeLeft(SPEED_BONUS_SECONDS);
      setEliminatedKeys([]);
      setHintRevealed(false);
      setDoubleActive(false);
      quizOpenStartRef.current = Date.now();
    }
  }, [isQuizOpen, question?.id, currentIndex]);

  useEffect(() => {
    if (!isQuizOpen || isPaused || answered || !question) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? Math.max(0, Number((prev - 0.1).toFixed(1))) : 0));
    }, 100);
    return () => window.clearInterval(interval);
  }, [isQuizOpen, isPaused, answered, question]);

  const handleAnswer = (key: OptionKey) => {
    if (!isQuizOpen || answered || isPaused || eliminatedKeys.includes(key) || !question) return;
    const elapsedMs = Date.now() - quizOpenStartRef.current;
    const speedBonus = Math.round((timeLeft / SPEED_BONUS_SECONDS) * 50);
    onSelectAnswer(key, elapsedMs, speedBonus, doubleActive);
  };

  const handleTriggerFiftyFifty = () => {
    if (!isQuizOpen || answered || isPaused || lifelines.fiftyFifty <= 0 || eliminatedKeys.length > 0 || !question) {
      return;
    }
    const wrongKeys = question.options.filter((o) => o.key !== question.answer).map((o) => o.key);
    const shuffledWrong = [...wrongKeys].sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedKeys(shuffledWrong);
    onUseFiftyFifty();
  };

  const handleTriggerHint = () => {
    if (!isQuizOpen || answered || isPaused || lifelines.hint <= 0 || hintRevealed) return;
    setHintRevealed(true);
    onUseHint();
  };

  const handleTriggerDouble = () => {
    if (!isQuizOpen || answered || isPaused || lifelines.doublePoints <= 0 || doubleActive) return;
    setDoubleActive(true);
    onUseDoublePoints();
  };

  const handleTriggerPotion = () => {
    if (isPaused || lifelines.potion <= 0 || hp >= maxHp) return;
    onUsePotion();
  };

  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (boardOpen) {
        setBoardOpen(false);
      } else {
        onTogglePause();
      }
      return;
    }
    if (isPaused || boardOpen) return;

    const upper = e.key.toUpperCase();
    if (upper === 'R') {
      handleTriggerPotion();
      return;
    }

    if (!isQuizOpen) {
      if (upper === 'Q') {
        e.preventDefault();
        setTriggerPortalSeq((s) => s + 1);
      }
      return;
    }

    if (answered) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNextQuestion();
      }
      return;
    }

    if (e.key === '1' || upper === 'A') handleAnswer('A');
    else if (e.key === '2' || upper === 'B') handleAnswer('B');
    else if (e.key === '3' || upper === 'C') handleAnswer('C');
    else if (e.key === '4' || upper === 'D') handleAnswer('D');
    else if (upper === 'H') handleTriggerHint();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const heroHpPct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  const bossHpPct = Math.max(0, Math.min(100, Math.round((bossState.current / Math.max(1, bossState.max)) * 100)));
  const timerPct = Math.round((timeLeft / SPEED_BONUS_SECONDS) * 100);

  if (!question) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#091322] text-slate-100 select-none">
      {/* Isolated Full-Viewport 3D Three.js Subway Runner */}
      <SubwayRunnerCanvas
        key={sessionId}
        heroClass={heroClass}
        activeTopic={question.topic}
        isPaused={isPaused || boardOpen}
        isQuizOpen={isQuizOpen}
        triggerPortalSeq={triggerPortalSeq}
        lastQuizOutcomeSeq={lastQuizOutcomeSeq}
        lastQuizOutcomeCorrect={lastQuizOutcomeCorrect}
        onCollectCoin={onCollectCoin}
        onCollectHeal={onCollectHeal}
        onObstacleHit={onObstacleHit}
        onReachQuizPortal={onReachQuizPortal}
        onDistanceTick={(meters, left) => {
          setDistanceMeters(meters);
          setPortalMetersLeft(left);
        }}
      />

      {/* Perimeter HUD Overlay (pointer-events-none wrapper, NO backdrop-blur over WebGL!) */}
      <div className="pointer-events-none relative z-10 w-full h-full flex flex-col justify-between p-3 sm:p-5">
        {/* Top Perimeter Status Clusters */}
        <div className="flex items-start justify-between gap-3">
          {/* Top-Left Hero & Score Cluster */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-[#0B1626]/92 px-3.5 py-2.5 shadow-lg">
            <button
              type="button"
              onClick={onTogglePause}
              aria-label="Jeda permainan"
              className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 cursor-pointer shrink-0"
            >
              <Pause className="w-4 h-4" />
            </button>

            <div className="min-w-[140px] sm:min-w-[180px] space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-white truncate">
                  {playerName} · <span className="font-mono-num text-amber-300">Lv.{level}</span>
                </span>
                <span className="font-mono-num text-emerald-300 font-semibold">
                  {hp}/{maxHp}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    heroHpPct > 50 ? 'bg-emerald-500' : heroHpPct > 25 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${heroHpPct}%` }}
                />
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-mono-num text-slate-300">
                <span className="text-emerald-300 font-bold">{score.toLocaleString('id-ID')} pts</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Coins className="w-3 h-3" />
                  {coins}
                </span>
                <span aria-hidden="true">·</span>
                <span>{distanceMeters}m</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 text-amber-300">
                  <Flame className="w-3 h-3" />×{streak}
                </span>
              </div>
            </div>
          </div>

          {/* Top-Center Compact Region & Boss Strip (Desktop Only) */}
          {!isQuizOpen && (
            <div className="hidden xl:flex flex-col items-center justify-center rounded-2xl border border-slate-700/75 bg-[#0B1626]/90 px-4 py-2 shadow-lg min-w-[230px]">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                <span className="truncate max-w-[160px]">{bossMeta.regionName}</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="font-mono-num text-rose-300">
                  {bossState.current}/{bossState.max} HP
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1.5">
                <div
                  className="h-full bg-rose-500 transition-all duration-200"
                  style={{ width: `${bossHpPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Top-Right Portal Progress, Quick-Warp & Utility Cluster */}
          <div className="pointer-events-auto flex items-center gap-2">
            {!isQuizOpen && (
              <button
                type="button"
                onClick={() => setTriggerPortalSeq((s) => s + 1)}
                className="h-10 px-3.5 rounded-xl border border-emerald-400/50 bg-[#0D2329]/95 hover:bg-emerald-900/80 text-xs font-bold text-emerald-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  Portal Soal {currentIndex + 1}/{questions.length}
                </span>
                <span className="hidden sm:inline font-mono-num text-emerald-300">
                  ({portalMetersLeft}m · Q)
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTriggerPotion}
              disabled={lifelines.potion <= 0 || hp >= maxHp}
              title="Minum Ramuan +35 HP (R)"
              className="h-10 px-3 rounded-xl border border-slate-700/80 bg-[#0B1626]/92 hover:bg-slate-800 disabled:opacity-45 disabled:cursor-not-allowed text-xs font-semibold text-emerald-300 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg"
            >
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Ramuan</span>
              <span className="font-mono-num">({lifelines.potion})</span>
            </button>

            <button
              type="button"
              onClick={() => setBoardOpen(true)}
              aria-label="Buka Papan Peringkat Real-Time"
              className="h-10 px-3 rounded-xl border border-slate-700/80 bg-[#0B1626]/92 hover:bg-slate-800 text-xs font-semibold text-amber-300 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Peringkat</span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
              className="w-10 h-10 rounded-xl border border-slate-700/80 bg-[#0B1626]/92 hover:bg-slate-800 flex items-center justify-center text-slate-200 cursor-pointer shadow-lg"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Bottom Area: Either Flat Runner Hint OR Quiz Boss Encounter Card */}
        {!isQuizOpen ? (
          <div className="flex flex-col items-center gap-2 pb-1">
            <div className="rounded-xl border border-slate-700/70 bg-[#0B1626]/88 px-4 py-1.5 text-xs text-slate-300 text-center">
              <span>{combatLog}</span>
              <span className="hidden sm:inline text-slate-500"> · </span>
              <span className="hidden sm:inline text-slate-400">
                A/D Jalur · W/Spasi Lompat · S Seluncur · Q Masuk Portal Soal
              </span>
            </div>
          </div>
        ) : (
          <div className="pointer-events-auto w-full max-w-3xl mx-auto rounded-2xl border border-slate-700/90 bg-[#0E1B2D]/96 p-4 sm:p-6 shadow-2xl">
            {/* Boss Encounter Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-400/50 bg-slate-900 shrink-0">
                  {!bossImgFailed ? (
                    <img
                      src="/src/assets/images/rpg_boss_titan_1795324123868.jpg"
                      alt={bossMeta.bossName}
                      referrerPolicy="no-referrer"
                      onError={() => setBossImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-950">
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-300 truncate">{bossMeta.bossName}</span>
                    <span className="text-slate-400 truncate">· {question.topicLabel}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-32 sm:w-44 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 transition-all duration-200"
                        style={{ width: `${bossHpPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono-num text-rose-300">
                      {bossState.current}/{bossState.max} HP
                    </span>
                  </div>
                </div>
              </div>

              {/* Speed Bonus Timer + RPG Skills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono-num text-sky-300 mr-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.ceil(timeLeft)}d
                </span>

                <button
                  type="button"
                  onClick={handleTriggerFiftyFifty}
                  disabled={answered || lifelines.fiftyFifty <= 0 || eliminatedKeys.length > 0}
                  className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Scissors className="w-3 h-3 text-sky-400" />
                  <span>50:50 ({lifelines.fiftyFifty})</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerHint}
                  disabled={answered || lifelines.hint <= 0 || hintRevealed}
                  className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Petunjuk ({lifelines.hint})</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerDouble}
                  disabled={answered || lifelines.doublePoints <= 0 || doubleActive}
                  className={`h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                    doubleActive
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>2× ({lifelines.doublePoints})</span>
                </button>
              </div>
            </div>

            {/* Timer progress bar */}
            <div className="h-1 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div
                className={`h-full transition-transform duration-100 origin-left ${
                  timeLeft > 8 ? 'bg-sky-400' : 'bg-amber-400'
                }`}
                style={{ transform: `scaleX(${Math.max(0, timerPct / 100)})` }}
              />
            </div>

            {/* Question Stem */}
            <div className="text-xs font-mono-num text-slate-400 mb-1">
              Portal Soal {currentIndex + 1}/{questions.length} · Bank #{question.id} · {heroMeta.name}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white leading-snug text-balance">
              {question.question}
            </h2>

            {question.diagram && (
              <div className="max-h-28 overflow-hidden">
                <TopicIllustration diagram={question.diagram} />
              </div>
            )}

            {hintRevealed && !answered && (
              <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 flex items-start gap-2 text-xs sm:text-sm text-amber-100">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{question.hint}</span>
              </div>
            )}

            {/* Answer Choices */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.options.map((opt) => {
                const isEliminated = eliminatedKeys.includes(opt.key);
                const isSelected = answered && lastAnswerRecord?.selected === opt.key;
                const isCorrectChoice = answered && question.answer === opt.key;
                const isWrongSelected = answered && isSelected && !lastAnswerRecord?.isCorrect;

                let cardStyle =
                  'border-slate-700 bg-slate-900/90 hover:border-emerald-400/70 hover:bg-slate-800 text-slate-100';
                if (isEliminated) {
                  cardStyle = 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-40 cursor-not-allowed';
                } else if (answered) {
                  if (isCorrectChoice) {
                    cardStyle = 'border-emerald-400 bg-emerald-500/20 text-white';
                  } else if (isWrongSelected) {
                    cardStyle = 'border-rose-500 bg-rose-500/20 text-rose-100';
                  } else {
                    cardStyle = 'border-slate-800 bg-slate-900/60 text-slate-400 opacity-75';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={answered || isEliminated}
                    onClick={() => handleAnswer(opt.key)}
                    className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono-num shrink-0 ${
                          isCorrectChoice
                            ? 'bg-emerald-500 text-slate-950'
                            : isWrongSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-sm font-medium leading-snug">{opt.text}</span>
                    </div>

                    {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                    {isWrongSelected && <XCircle className="w-4 h-4 text-rose-300 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Feedback & Resume Running Button */}
            {answered && lastAnswerRecord && (
              <div
                className={`mt-4 rounded-xl border p-3.5 sm:p-4 ${
                  lastAnswerRecord.isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/45'
                    : 'border-rose-500/50 bg-rose-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    {lastAnswerRecord.isCorrect ? (
                      <Swords className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>
                      {lastAnswerRecord.isCorrect
                        ? `Serangan Tepat! ${lastAnswerRecord.damageDealt} DMG · +${lastAnswerRecord.pointsEarned} Poin · Turbo Dash Aktif!`
                        : `Serangan Balik (-${lastAnswerRecord.damageTaken} HP) · Jawaban Benar: ${question.answer}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onNextQuestion}
                    className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>
                      {hp <= 0
                        ? 'Lihat Hasil Akhir'
                        : currentIndex + 1 >= questions.length
                          ? 'Selesaikan Petualangan'
                          : 'Lanjut Berlari (Enter)'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-Time Leaderboard Modal Drawer */}
      {boardOpen && (
        <div className="fixed inset-0 z-40 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setBoardOpen(false)}
                className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Lanjut Main</span>
              </button>
            </div>
            <LeaderboardPanel
              leaderboard={leaderboard}
              activePlayers={activePlayers}
              isConnected={isConnected}
              onlineCount={onlineCount}
              isLoading={false}
              currentSessionId={sessionId}
              latestEntryId={latestEntryId}
              compact
            />
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-[#111E30] p-6 shadow-2xl space-y-5 text-center">
            <div>
              <h2 className="text-xl font-bold text-white">Petualangan Dijeda</h2>
              <p className="text-sm text-slate-400 mt-1 font-mono-num">
                Lv.{level} · HP {hp}/{maxHp} · Jarak {distanceMeters}m · Skor {score.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onTogglePause}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Lanjutkan Berlari
              </button>
              <button
                type="button"
                onClick={onQuitToMenu}
                className="w-full h-11 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Keluar ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
