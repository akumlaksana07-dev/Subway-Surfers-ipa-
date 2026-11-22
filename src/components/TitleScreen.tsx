import { useEffect, useState } from 'react';
import { BookOpen, Heart, Play, Shield, Shuffle, Sparkles, Swords, Volume2, VolumeX, Zap } from 'lucide-react';
import { HERO_CLASSES, TOPICS } from '../data/questions';
import type { ActivePlayer, GameMode, HeroClassId, LeaderboardEntry, TopicId } from '../types/game';
import { LeaderboardPanel } from './LeaderboardPanel';

interface TitleScreenProps {
  playerName: string;
  playerClass: string;
  heroClass: HeroClassId;
  mode: GameMode;
  selectedTopic: TopicId;
  shuffleQuestions: boolean;
  isMuted: boolean;
  leaderboard: LeaderboardEntry[];
  activePlayers: ActivePlayer[];
  isConnected: boolean;
  onlineCount: number;
  isLoadingLeaderboard: boolean;
  latestEntryId: string | null;
  onChangeName: (name: string) => void;
  onChangeClass: (cls: string) => void;
  onChangeHeroClass: (hero: HeroClassId) => void;
  onChangeMode: (mode: GameMode) => void;
  onChangeTopic: (topic: TopicId) => void;
  onToggleShuffle: () => void;
  onToggleMute: () => void;
  onStartGame: () => void;
}

const CLASS_OPTIONS = ['8A', '8B', '8C', '8D', '8E', '8F', 'Umum'];

export function TitleScreen({
  playerName,
  playerClass,
  heroClass,
  mode,
  selectedTopic,
  shuffleQuestions,
  isMuted,
  leaderboard,
  activePlayers,
  isConnected,
  onlineCount,
  isLoadingLeaderboard,
  latestEntryId,
  onChangeName,
  onChangeClass,
  onChangeHeroClass,
  onChangeMode,
  onChangeTopic,
  onToggleShuffle,
  onToggleMute,
  onStartGame,
}: TitleScreenProps) {
  const [nameError, setNameError] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);
  const [heroPortraitFailed, setHeroPortraitFailed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onStartGame();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON') {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!playerName.trim()) {
          setNameError(true);
          document.getElementById('player-name')?.focus();
          return;
        }
        setNameError(false);
        onStartGame();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playerName, onStartGame]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0A131F] text-slate-100 flex flex-col justify-between">
      {/* Atmospheric RPG Sanctum Key-Art Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {!backdropFailed ? (
          <img
            src="/src/assets/images/rpg_dungeon_arena_1795324123273.jpg"
            alt="Arena rel petualangan 3D sains RPG"
            referrerPolicy="no-referrer"
            onError={() => setBackdropFailed(true)}
            className="w-full h-full object-cover object-center opacity-45"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0A131F] via-[#102438] to-[#0B2220]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A131F] via-[#0A131F]/88 to-[#0A131F]/68" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A131F] via-transparent to-[#0A131F]/75" />
      </div>

      {/* Minimal Top Utility Bar */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 pt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Subway Runner RPG 3D</span>
          <span aria-hidden="true">·</span>
          <span>IPA Kelas VIII SMP</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">80 Soal · 5 Boss Jalur</span>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Nyalakan efek suara' : 'Bisukan efek suara'}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/80 bg-slate-900/75 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? 'Suara Mati' : 'Suara Aktif'}</span>
        </button>
      </div>

      {/* Main Two-Column Setup & Live Leaderboard Stage */}
      <main className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-5 lg:py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-start">
          {/* Left Hero Identity & Runner RPG Setup */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-emerald-400/50 bg-slate-900 shrink-0 shadow-lg">
                {!heroPortraitFailed ? (
                  <img
                    src="/src/assets/images/rpg_hero_scholar_1795324123744.jpg"
                    alt="Potret Hero Pelari Sains"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroPortraitFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-950">
                    <Swords className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                  Subway Sains RPG
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
                  Berlari di lintasan rel 3D, hindari kereta & rintangan, kumpulkan koin atom, dan serang 5 Boss Wilayah lewat 80 soal IPA Kelas VIII di setiap Gerbang Portal.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-700/70 bg-[#111E30]/94 p-5 sm:p-6 shadow-2xl space-y-5 max-w-2xl"
            >
              {/* Player Name & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="player-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Pelari
                  </label>
                  <input
                    id="player-name"
                    type="text"
                    maxLength={28}
                    value={playerName}
                    onChange={(e) => {
                      onChangeName(e.target.value);
                      if (nameError && e.target.value.trim()) setNameError(false);
                    }}
                    placeholder="Masukkan nama kamu..."
                    className={`w-full h-11 px-3.5 rounded-xl bg-slate-900/90 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 ${
                      nameError ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {nameError && (
                    <p className="text-xs text-rose-400 mt-1">
                      Silakan isi nama terlebih dahulu sebelum berlari di lintasan.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="player-class" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kelas
                  </label>
                  <select
                    id="player-class"
                    value={playerClass}
                    onChange={(e) => onChangeClass(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/70 cursor-pointer"
                  >
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        Kelas {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hero Class Selection */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2">
                  Pilih Karakter Pelari RPG
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {HERO_CLASSES.map((hero) => {
                    const selected = heroClass === hero.id;
                    return (
                      <button
                        key={hero.id}
                        type="button"
                        onClick={() => onChangeHeroClass(hero.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-amber-500/12 border-amber-400 text-white'
                            : 'bg-slate-900/75 border-slate-700/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold truncate">{hero.name}</span>
                          {hero.id === 'alkemis' && <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {hero.id === 'ksatria' && <Shield className="w-4 h-4 text-amber-400 shrink-0" />}
                          {hero.id === 'penjelajah' && <Heart className="w-4 h-4 text-rose-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{hero.roleTitle}</div>
                        <div className="text-[11px] font-mono-num text-emerald-300 mt-2">
                          {hero.maxHp} HP · {hero.baseDamage} DMG
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{hero.perkLabel}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adventure Mode Selector */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2">
                  Mode Lari & Kuis
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangeMode('marathon')}
                    className={`min-h-[58px] px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      mode === 'marathon'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white'
                        : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold whitespace-nowrap">Petualangan 80</span>
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">80 soal · 5 Boss Jalur</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeMode('sprint')}
                    className={`min-h-[58px] px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      mode === 'sprint'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white'
                        : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold whitespace-nowrap">Ekspedisi 25</span>
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">25 soal acak cepat</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeMode('topic')}
                    className={`min-h-[58px] px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      mode === 'topic'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white'
                        : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold whitespace-nowrap">Dungeon Bab</span>
                      <span className="text-xs font-mono-num text-sky-400 shrink-0">5 Jalur</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Fokus 1 materi bab</p>
                  </button>
                </div>
              </div>

              {mode === 'topic' && (
                <div>
                  <label htmlFor="topic-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pilih Jalur / Bab Materi
                  </label>
                  <select
                    id="topic-select"
                    value={selectedTopic}
                    onChange={(e) => onChangeTopic(e.target.value as TopicId)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/70 cursor-pointer"
                  >
                    {TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.questionCount} soal)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bottom Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onToggleShuffle}
                  disabled={mode === 'sprint'}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mode === 'sprint' || shuffleQuestions
                      ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-slate-200'
                  } ${mode === 'sprint' ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>
                    {mode === 'sprint'
                      ? 'Urutan Acak Otomatis'
                      : shuffleQuestions
                        ? 'Acak Soal: Aktif'
                        : 'Urutan Jalur 1–80'}
                  </span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-sm tracking-tight shadow-lg shadow-emerald-950/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Mulai Berlari</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Real-Time Leaderboard */}
          <div className="lg:col-span-5">
            <LeaderboardPanel
              leaderboard={leaderboard}
              activePlayers={activePlayers}
              isConnected={isConnected}
              onlineCount={onlineCount}
              isLoading={isLoadingLeaderboard}
              latestEntryId={latestEntryId}
            />
          </div>
        </div>
      </main>

      {/* Single Flat Control-Hint Footer */}
      <footer className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 pb-5 pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>←/→ atau A/D Pindah Jalur · ↑/W/Spasi Lompat · ↓/S Seluncur · Q Portal Soal · R Ramuan HP</span>
        <span className="font-mono-num">Jawab Benar = Turbo Dash + Serang Boss</span>
      </footer>
    </div>
  );
}
