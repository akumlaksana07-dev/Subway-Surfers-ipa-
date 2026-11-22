export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type TopicId =
  | 'zat-aditif'
  | 'gerak-newton'
  | 'usaha-pesawat'
  | 'tumbuhan'
  | 'rangka';

export type HeroClassId = 'alkemis' | 'ksatria' | 'penjelajah';

export type GameMode = 'marathon' | 'sprint' | 'topic';

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface HeroClassMeta {
  id: HeroClassId;
  name: string;
  roleTitle: string;
  maxHp: number;
  baseDamage: number;
  startingPotions: number;
  startingFifty: number;
  startingHints: number;
  startingDoubles: number;
  perkLabel: string;
  suitColorHex: number;
  accentColorHex: number;
}

export interface BossMeta {
  topicId: TopicId;
  regionName: string;
  bossName: string;
  bossTitle: string;
  accentColor: string;
  gateColorHex: number;
}

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

export interface QuizQuestion {
  id: number;
  topic: TopicId;
  topicLabel: string;
  question: string;
  options: QuestionOption[];
  answer: OptionKey;
  hint: string;
  explanation: string;
  diagram?:
    | 'distance-displacement'
    | 'resultant-force'
    | 'lever'
    | 'pulley'
    | 'inclined-plane'
    | 'plant-tissue'
    | 'skull-joint';
}

export interface TopicMeta {
  id: TopicId;
  label: string;
  shortLabel: string;
  description: string;
  questionCount: number;
}

export interface AnswerRecord {
  questionId: number;
  question: string;
  topic: TopicId;
  topicLabel: string;
  selected: OptionKey;
  correctAnswer: OptionKey;
  isCorrect: boolean;
  pointsEarned: number;
  damageDealt: number;
  damageTaken: number;
  timeTakenMs: number;
  explanation: string;
  options: QuestionOption[];
}

export interface LeaderboardEntry {
  id: string;
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
  accuracy: number;
  maxStreak: number;
  avgTimeMs: number;
  createdAt: string;
}

export interface ActivePlayer {
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

export interface LifelinesState {
  fiftyFifty: number;
  hint: number;
  doublePoints: number;
  potion: number;
}
