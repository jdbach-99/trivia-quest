export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
}

export type GameMode = "mixed" | "category";

export interface RoundAnswer {
  questionId: string;
  category: string;
  /** null when the timer ran out before an answer was chosen */
  selectedAnswer: string | null;
  correct: boolean;
  pointsEarned: number;
}

export interface RoundState {
  mode: GameMode;
  category?: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  answers: RoundAnswer[];
  startedAt: number;
}

export interface Settings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  reducedMotion: boolean;
}

export interface Stats {
  roundsPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  highestScore: number;
  longestStreak: number;
  perfectRounds: number;
  totalStarsEarned: number;
}

export interface CategoryStats {
  questionsAnswered: number;
  correctAnswers: number;
  highestScore: number;
  threeStarRounds: number;
}

export interface PlayerProgress {
  version: number;
  level: number;
  xp: number;
  stars: number;
  unlockedTrophies: string[];
  recentQuestionIds: string[];
  lastDailyBonusDate: string | null;
  daysPlayed: string[];
  settings: Settings;
  stats: Stats;
  categoryStats: Record<string, CategoryStats>;
}

export type Screen =
  | "home"
  | "categories"
  | "playing"
  | "results"
  | "trophies"
  | "stats"
  | "settings";
