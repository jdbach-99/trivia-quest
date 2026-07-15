import type { CategoryStats, PlayerProgress } from "@/types/game";

export const STORAGE_KEY = "trivia-quest-progress";
export const CURRENT_VERSION = 1;

export function defaultProgress(): PlayerProgress {
  return {
    version: CURRENT_VERSION,
    level: 1,
    xp: 0,
    stars: 0,
    unlockedTrophies: [],
    recentQuestionIds: [],
    lastDailyBonusDate: null,
    daysPlayed: [],
    settings: {
      soundEnabled: true,
      timerEnabled: true,
      reducedMotion: false,
    },
    stats: {
      roundsPlayed: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      highestScore: 0,
      longestStreak: 0,
      perfectRounds: 0,
      totalStarsEarned: 0,
    },
    categoryStats: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeNumber(value: unknown, fallback: number, min = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= min ? value : fallback;
}

function safeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function safeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/**
 * Coerces unknown parsed data into a valid PlayerProgress, falling back to
 * defaults field-by-field so old or partial data keeps whatever is usable.
 */
export function sanitizeProgress(data: unknown): PlayerProgress {
  const base = defaultProgress();
  if (!isRecord(data)) return base;

  const settings = isRecord(data.settings) ? data.settings : {};
  const stats = isRecord(data.stats) ? data.stats : {};

  const categoryStats: Record<string, CategoryStats> = {};
  if (isRecord(data.categoryStats)) {
    for (const [category, value] of Object.entries(data.categoryStats)) {
      if (!isRecord(value)) continue;
      categoryStats[category] = {
        questionsAnswered: safeNumber(value.questionsAnswered, 0),
        correctAnswers: safeNumber(value.correctAnswers, 0),
        highestScore: safeNumber(value.highestScore, 0),
        threeStarRounds: safeNumber(value.threeStarRounds, 0),
      };
    }
  }

  return {
    version: CURRENT_VERSION,
    level: Math.floor(safeNumber(data.level, base.level, 1)),
    xp: safeNumber(data.xp, base.xp),
    stars: safeNumber(data.stars, base.stars),
    unlockedTrophies: safeStringArray(data.unlockedTrophies),
    recentQuestionIds: safeStringArray(data.recentQuestionIds),
    lastDailyBonusDate: typeof data.lastDailyBonusDate === "string" ? data.lastDailyBonusDate : null,
    daysPlayed: safeStringArray(data.daysPlayed),
    settings: {
      soundEnabled: safeBoolean(settings.soundEnabled, base.settings.soundEnabled),
      timerEnabled: safeBoolean(settings.timerEnabled, base.settings.timerEnabled),
      reducedMotion: safeBoolean(settings.reducedMotion, base.settings.reducedMotion),
    },
    stats: {
      roundsPlayed: safeNumber(stats.roundsPlayed, 0),
      questionsAnswered: safeNumber(stats.questionsAnswered, 0),
      correctAnswers: safeNumber(stats.correctAnswers, 0),
      highestScore: safeNumber(stats.highestScore, 0),
      longestStreak: safeNumber(stats.longestStreak, 0),
      perfectRounds: safeNumber(stats.perfectRounds, 0),
      totalStarsEarned: safeNumber(stats.totalStarsEarned, 0),
    },
    categoryStats,
  };
}

export function loadProgress(): PlayerProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return sanitizeProgress(JSON.parse(raw));
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private mode, quota) — play on without saving
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
