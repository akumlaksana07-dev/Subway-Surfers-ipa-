import { useCallback, useEffect, useRef, useState } from 'react';
import { GameOverModal } from './components/GameOverModal';
import { GameplayArena } from './components/GameplayArena';
import { TitleScreen } from './components/TitleScreen';
import { HERO_CLASSES, QUESTIONS, REGION_BOSSES } from './data/questions';
import { useRealtimeLeaderboard } from './hooks/useRealtimeLeaderboard';
import type {
  AnswerRecord,
  GameMode,
  GameState,
  HeroClassId,
  LifelinesState,
  OptionKey,
  QuizQuestion,
  TopicId,
} from './types/game';
import { soundEngine } from './utils/sound';

function buildSessionDeck(mode: GameMode, selectedTopic: TopicId, shuffle: boolean): QuizQuestion[] {
  let pool = mode === 'topic' ? QUESTIONS.filter((q) => q.topic === selectedTopic) : [...QUESTIONS];

  if (mode === 'sprint') {
    pool = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 25);
  } else if (shuffle) {
    pool = [...pool].sort(() => Math.random() - 0.5);
  }

  return pool;
}

function buildInitialBossMap(deck: QuizQuestion[]): Record<TopicId, { current: number; max: number }> {
  const counts: Record<TopicId, number> = {
    'zat-aditif': 0,
    'gerak-newton': 0,
    'usaha-pesawat': 0,
    tumbuhan: 0,
    rangka: 0,
  };
  for (const q of deck) {
    counts[q.topic] += 1;
  }
  return {
    'zat-aditif': { current: Math.max(1, counts['zat-aditif']) * 30, max: Math.max(1, counts['zat-aditif']) * 30 },
    'gerak-newton': { current: Math.max(1, counts['gerak-newton']) * 30, max: Math.max(1, counts['gerak-newton']) * 30 },
    'usaha-pesawat': {
      current: Math.max(1, counts['usaha-pesawat']) * 30,
      max: Math.max(1, counts['usaha-pesawat']) * 30,
    },
    tumbuhan: { current: Math.max(1, counts.tumbuhan) * 30, max: Math.max(1, counts.tumbuhan) * 30 },
    rangka: { current: Math.max(1, counts.rangka) * 30, max: Math.max(1, counts.rangka) * 30 },
  };
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('arena_sains_name') || '';
    } catch {
      return '';
    }
  });
  const [playerClass, setPlayerClass] = useState<string>(() => {
    try {
      return localStorage.getItem('arena_sains_class') || '8A';
    } catch {
      return '8A';
    }
  });
  const [heroClass, setHeroClass] = useState<HeroClassId>(() => {
    try {
      const saved = localStorage.getItem('arena_sains_hero');
      if (saved === 'ksatria' || saved === 'penjelajah') return saved;
      return 'alkemis';
    } catch {
      return 'alkemis';
    }
  });

  const [mode, setMode] = useState<GameMode>('marathon');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('zat-aditif');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.isMuted());

  // Active Runner + RPG State
  const [sessionId, setSessionId] = useState<string>('');
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [hp, setHp] = useState<number>(100);
  const [maxHp, setMaxHp] = useState<number>(100);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [bossHpMap, setBossHpMap] = useState<Record<TopicId, { current: number; max: number }>>(() =>
    buildInitialBossMap(QUESTIONS),
  );
  const [combatLog, setCombatLog] = useState<string>('Berlari menuju Gerbang Portal Soal!');
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [lifelines, setLifelines] = useState<LifelinesState>({
    fiftyFifty: 2,
    hint: 2,
    doublePoints: 2,
    potion: 2,
  });
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [lastQuizOutcomeSeq, setLastQuizOutcomeSeq] = useState<number>(0);
  const [lastQuizOutcomeCorrect, setLastQuizOutcomeCorrect] = useState<boolean>(true);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const [victory, setVictory] = useState<boolean>(true);
  const runEndedRef = useRef<boolean>(false);
  const latestStatsRef = useRef({
    hp: 100,
    maxHp: 100,
    score: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    records: [] as AnswerRecord[],
    currentIndex: 0,
    sessionId: '',
  });
  latestStatsRef.current = {
    hp,
    maxHp,
    score,
    level,
    streak,
    maxStreak,
    records,
    currentIndex,
    sessionId,
  };

  const {
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
  } = useRealtimeLeaderboard();

  const handleChangeName = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('arena_sains_name', name);
    } catch {
      // Ignore storage errors
    }
  };

  const handleChangeClass = (cls: string) => {
    setPlayerClass(cls);
    try {
      localStorage.setItem('arena_sains_class', cls);
    } catch {
      // Ignore storage errors
    }
  };

  const handleChangeHeroClass = (hero: HeroClassId) => {
    soundEngine.playClick();
    setHeroClass(hero);
    try {
      localStorage.setItem('arena_sains_hero', hero);
    } catch {
      // Ignore storage errors
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    soundEngine.setMuted(next);
    setIsMuted(next);
    if (!next) soundEngine.playClick();
  };

  const startNewRun = useCallback(() => {
    const cleanName = playerName.trim() || 'Siswa IPA';
    const heroMeta = HERO_CLASSES.find((h) => h.id === heroClass) || HERO_CLASSES[0];
    const nextDeck = buildSessionDeck(mode, selectedTopic, shuffleQuestions);
    const nextSessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    runEndedRef.current = false;
    setSessionId(nextSessionId);
    setDeck(nextDeck);
    setCurrentIndex(0);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setMaxStreak(0);
    setHp(heroMeta.maxHp);
    setMaxHp(heroMeta.maxHp);
    setXp(0);
    setLevel(1);
    setBossHpMap(buildInitialBossMap(nextDeck));
    setCombatLog(`Berlari di ${REGION_BOSSES[nextDeck[0].topic].regionName}!`);
    setRecords([]);
    setLifelines({
      fiftyFifty: heroMeta.startingFifty,
      hint: heroMeta.startingHints,
      doublePoints: heroMeta.startingDoubles,
      potion: heroMeta.startingPotions,
    });
    setIsQuizOpen(false);
    setLastQuizOutcomeSeq(0);
    setLastQuizOutcomeCorrect(true);
    setSubmittedRank(null);
    setVictory(true);
    setGameState('PLAYING');

    soundEngine.playClick();
    sendJoin({
      sessionId: nextSessionId,
      name: cleanName,
      className: playerClass,
      heroClass,
      level: 1,
      hp: heroMeta.maxHp,
      maxHp: heroMeta.maxHp,
      mode,
      totalQuestions: nextDeck.length,
    });
  }, [playerName, playerClass, heroClass, mode, selectedTopic, shuffleQuestions, sendJoin]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (sessionId && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
        sendLeave(sessionId);
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [sessionId, gameState, sendLeave]);

  const finishRun = useCallback(
    async (
      finalVictory: boolean,
      finalScore: number,
      finalLevel: number,
      finalRecords: AnswerRecord[],
      bestStreak: number,
    ) => {
      runEndedRef.current = true;
      setIsQuizOpen(false);
      setVictory(finalVictory);
      setGameState('GAME_OVER');

      if (finalVictory) {
        soundEngine.playVictory();
      } else {
        soundEngine.playWrong();
      }

      const correctCount = finalRecords.filter((r) => r.isCorrect).length;
      const totalMs = finalRecords.reduce((sum, r) => sum + r.timeTakenMs, 0);
      const avgTimeMs = finalRecords.length > 0 ? Math.round(totalMs / finalRecords.length) : 5000;

      const result = await submitScore({
        sessionId,
        name: playerName.trim() || 'Siswa IPA',
        className: playerClass,
        heroClass,
        level: finalLevel,
        victory: finalVictory,
        mode,
        topicFilter: mode === 'topic' ? selectedTopic : null,
        score: finalScore,
        correctCount,
        totalQuestions: deck.length,
        maxStreak: bestStreak,
        avgTimeMs,
      });

      if (result?.rank) {
        setSubmittedRank(result.rank);
      }
    },
    [sessionId, playerName, playerClass, heroClass, mode, selectedTopic, deck.length, submitScore],
  );

  useEffect(() => {
    if (gameState === 'PLAYING' && !isQuizOpen && hp <= 0 && !runEndedRef.current) {
      void finishRun(false, score, level, records, maxStreak);
    }
  }, [gameState, isQuizOpen, hp, score, level, records, maxStreak, finishRun]);

  const handleCollectCoin = useCallback(() => {
    setCoins((c) => c + 1);
    setScore((s) => s + 15);
    setXp((prevXp) => {
      const nextXp = prevXp + 5;
      const nextLv = 1 + Math.floor(nextXp / 250);
      setLevel(nextLv);
      return nextXp;
    });
  }, []);

  const handleCollectHeal = useCallback(() => {
    const s = latestStatsRef.current;
    if (runEndedRef.current) return;
    const nextHp = Math.min(s.maxHp, s.hp + 12);
    s.hp = nextHp;
    setHp(nextHp);
    setCombatLog(`Mengambil Labu Bio! HP pulih +12 (${nextHp}/${s.maxHp})`);
    sendProgress({
      sessionId: s.sessionId,
      score: s.score,
      streak: s.streak,
      currentIndex: s.currentIndex + 1,
      correctCount: s.records.filter((r) => r.isCorrect).length,
      level: s.level,
      hp: nextHp,
    });
  }, [sendProgress]);

  const handleObstacleHit = useCallback(() => {
    const s = latestStatsRef.current;
    if (runEndedRef.current) return;
    const nextHp = Math.max(0, s.hp - 15);
    s.hp = nextHp;
    s.streak = 0;
    setStreak(0);
    setHp(nextHp);
    setCombatLog(`Menabrak rintangan rel! -15 HP (Sisa ${nextHp}/${s.maxHp})`);
    sendProgress({
      sessionId: s.sessionId,
      score: s.score,
      streak: 0,
      currentIndex: s.currentIndex + 1,
      correctCount: s.records.filter((r) => r.isCorrect).length,
      level: s.level,
      hp: nextHp,
    });
  }, [sendProgress]);

  const handleReachQuizPortal = useCallback(() => {
    if (!isQuizOpen && gameState === 'PLAYING' && !runEndedRef.current) {
      soundEngine.playPowerup();
      setIsQuizOpen(true);
    }
  }, [isQuizOpen, gameState]);

  const handleSelectAnswer = (
    key: OptionKey,
    timeTakenMs: number,
    speedBonus: number,
    usedDouble: boolean,
  ) => {
    const currentQuestion = deck[currentIndex];
    const heroMeta = HERO_CLASSES.find((h) => h.id === heroClass) || HERO_CLASSES[0];
    const bossMeta = REGION_BOSSES[currentQuestion.topic];
    const isCorrect = key === currentQuestion.answer;

    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextMaxStreak = Math.max(maxStreak, nextStreak);
    const streakBonus = isCorrect ? Math.min(nextStreak - 1, 5) * 15 : 0;
    const rawPoints = isCorrect ? 100 + speedBonus + streakBonus : 0;
    const pointsEarned = usedDouble ? rawPoints * 2 : rawPoints;
    const nextScore = score + pointsEarned;

    const speedDamage = Math.round((speedBonus / 50) * 14);
    const rawDamage = isCorrect ? heroMeta.baseDamage + speedDamage + (nextStreak - 1) * 3 : 0;
    const damageDealt = usedDouble ? rawDamage * 2 : rawDamage;
    const damageTaken = isCorrect ? 0 : 20;

    let nextHp = Math.max(0, hp - damageTaken);
    let logNote = '';

    if (isCorrect && heroClass === 'penjelajah' && nextStreak > 0 && nextStreak % 3 === 0 && nextHp < maxHp) {
      nextHp = Math.min(maxHp, nextHp + 8);
      logNote = ' · Regenerasi +8 HP!';
    }

    const xpGain = isCorrect ? 30 + Math.round(speedBonus / 2) + Math.min(nextStreak, 5) * 5 : 5;
    const nextXp = xp + xpGain;
    const nextLevel = 1 + Math.floor(nextXp / 250);
    const leveledUp = nextLevel > level;

    if (leveledUp) {
      nextHp = Math.min(maxHp, nextHp + 15);
      soundEngine.playLevelUp();
      logNote += ` · Naik ke Lv.${nextLevel}! (+15 HP)`;
    } else if (isCorrect) {
      soundEngine.playCorrect(nextStreak);
    } else {
      soundEngine.playWrong();
    }

    if (isCorrect) {
      setBossHpMap((prev) => {
        const entry = prev[currentQuestion.topic];
        const nextBossHp = Math.max(0, entry.current - Math.max(30, damageDealt));
        return {
          ...prev,
          [currentQuestion.topic]: { ...entry, current: nextBossHp },
        };
      });
      setCombatLog(`Turbo Dash! ${bossMeta.bossName} terkena ${damageDealt} DMG${logNote}`);
    } else {
      setCombatLog(`${bossMeta.bossName} membalas (-${damageTaken} HP). Waspadai rintangan!`);
    }

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      topic: currentQuestion.topic,
      topicLabel: currentQuestion.topicLabel,
      selected: key,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      pointsEarned,
      damageDealt,
      damageTaken,
      timeTakenMs,
      explanation: currentQuestion.explanation,
      options: currentQuestion.options,
    };

    const nextRecords = [...records, record];
    setScore(nextScore);
    setStreak(nextStreak);
    setMaxStreak(nextMaxStreak);
    setHp(nextHp);
    setXp(nextXp);
    setLevel(nextLevel);
    setRecords(nextRecords);

    const correctCount = nextRecords.filter((r) => r.isCorrect).length;
    sendProgress({
      sessionId,
      score: nextScore,
      streak: nextStreak,
      currentIndex: currentIndex + 1,
      correctCount,
      level: nextLevel,
      hp: nextHp,
    });

    return { isCorrect, pointsEarned, damageDealt, damageTaken };
  };

  const handleNextQuestion = async () => {
    soundEngine.playClick();
    const lastRec = records[records.length - 1];
    setLastQuizOutcomeCorrect(Boolean(lastRec?.isCorrect));
    setLastQuizOutcomeSeq((s) => s + 1);

    if (hp <= 0) {
      await finishRun(false, score, level, records, maxStreak);
      return;
    }

    if (currentIndex + 1 < deck.length) {
      setIsQuizOpen(false);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    await finishRun(true, score, level, records, maxStreak);
  };

  const handleUsePotion = () => {
    if (lifelines.potion <= 0 || hp >= maxHp) return;
    soundEngine.playHeal();
    const nextHp = Math.min(maxHp, hp + 35);
    setHp(nextHp);
    setLifelines((prev) => ({ ...prev, potion: Math.max(0, prev.potion - 1) }));
    setCombatLog(`Meminum Ramuan Sains! HP pulih menjadi ${nextHp}/${maxHp}.`);
    sendProgress({
      sessionId,
      score,
      streak,
      currentIndex: currentIndex + 1,
      correctCount: records.filter((r) => r.isCorrect).length,
      level,
      hp: nextHp,
    });
  };

  const handleQuitToMenu = () => {
    if (sessionId) {
      sendLeave(sessionId);
    }
    setIsQuizOpen(false);
    setGameState('TITLE_MENU');
  };

  const lastAnswerRecord =
    records.length > 0 && deck[currentIndex] && records[records.length - 1].questionId === deck[currentIndex].id
      ? records[records.length - 1]
      : null;

  if (gameState === 'TITLE_MENU') {
    return (
      <TitleScreen
        playerName={playerName}
        playerClass={playerClass}
        heroClass={heroClass}
        mode={mode}
        selectedTopic={selectedTopic}
        shuffleQuestions={shuffleQuestions}
        isMuted={isMuted}
        leaderboard={leaderboard}
        activePlayers={activePlayers}
        isConnected={isConnected}
        onlineCount={onlineCount}
        isLoadingLeaderboard={isLoading}
        latestEntryId={latestEntryId}
        onChangeName={handleChangeName}
        onChangeClass={handleChangeClass}
        onChangeHeroClass={handleChangeHeroClass}
        onChangeMode={(m) => {
          soundEngine.playClick();
          setMode(m);
        }}
        onChangeTopic={setSelectedTopic}
        onToggleShuffle={() => {
          soundEngine.playClick();
          setShuffleQuestions((prev) => !prev);
        }}
        onToggleMute={handleToggleMute}
        onStartGame={startNewRun}
      />
    );
  }

  if (gameState === 'GAME_OVER') {
    return (
      <GameOverModal
        playerName={playerName.trim() || 'Siswa IPA'}
        playerClass={playerClass}
        heroClass={heroClass}
        level={level}
        hp={hp}
        maxHp={maxHp}
        victory={victory}
        score={score}
        maxStreak={maxStreak}
        records={records}
        submittedRank={submittedRank}
        leaderboard={leaderboard}
        activePlayers={activePlayers}
        isConnected={isConnected}
        onlineCount={onlineCount}
        latestEntryId={latestEntryId}
        onPlayAgain={startNewRun}
        onReturnMenu={handleQuitToMenu}
      />
    );
  }

  return (
    <GameplayArena
      playerName={playerName.trim() || 'Siswa IPA'}
      playerClass={playerClass}
      heroClass={heroClass}
      sessionId={sessionId}
      questions={deck}
      currentIndex={currentIndex}
      score={score}
      coins={coins}
      streak={streak}
      hp={hp}
      maxHp={maxHp}
      xp={xp}
      level={level}
      bossHpMap={bossHpMap}
      lifelines={lifelines}
      isPaused={gameState === 'PAUSED'}
      isQuizOpen={isQuizOpen}
      isMuted={isMuted}
      leaderboard={leaderboard}
      activePlayers={activePlayers}
      isConnected={isConnected}
      onlineCount={onlineCount}
      latestEntryId={latestEntryId}
      combatLog={combatLog}
      lastQuizOutcomeSeq={lastQuizOutcomeSeq}
      lastQuizOutcomeCorrect={lastQuizOutcomeCorrect}
      onCollectCoin={handleCollectCoin}
      onCollectHeal={handleCollectHeal}
      onObstacleHit={handleObstacleHit}
      onReachQuizPortal={handleReachQuizPortal}
      onSelectAnswer={handleSelectAnswer}
      onNextQuestion={handleNextQuestion}
      onUseFiftyFifty={() => {
        soundEngine.playPowerup();
        setLifelines((prev) => ({ ...prev, fiftyFifty: Math.max(0, prev.fiftyFifty - 1) }));
      }}
      onUseHint={() => {
        soundEngine.playPowerup();
        setLifelines((prev) => ({ ...prev, hint: Math.max(0, prev.hint - 1) }));
      }}
      onUseDoublePoints={() => {
        soundEngine.playPowerup();
        setLifelines((prev) => ({ ...prev, doublePoints: Math.max(0, prev.doublePoints - 1) }));
      }}
      onUsePotion={handleUsePotion}
      onTogglePause={() => {
        soundEngine.playClick();
        setGameState((prev) => (prev === 'PAUSED' ? 'PLAYING' : 'PAUSED'));
      }}
      onToggleMute={handleToggleMute}
      onQuitToMenu={handleQuitToMenu}
      lastAnswerRecord={lastAnswerRecord}
    />
  );
}
