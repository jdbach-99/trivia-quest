import type { CategoryStats, PlayerProgress, RoundState } from "@/types/game";
import { RECENT_QUESTION_LIMIT } from "./constants";
import {
  applyXp,
  isPerfectRound,
  localDateString,
  starsForRound,
  xpForRound,
} from "./progression";

export interface RoundOutcome {
  finalScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  starsFromAccuracy: number;
  perfectBonusStar: boolean;
  starsEarned: number;
  xpEarned: number;
  levelsGained: number;
  newHighScore: boolean;
  progress: PlayerProgress;
}

const EMPTY_CATEGORY_STATS: CategoryStats = {
  questionsAnswered: 0,
  correctAnswers: 0,
  highestScore: 0,
  threeStarRounds: 0,
};

/**
 * Folds a completed round into player progress. Pure: returns the reward
 * breakdown plus a new progress object; the caller persists it.
 */
export function applyRoundResults(
  progress: PlayerProgress,
  round: RoundState,
  today: string = localDateString()
): RoundOutcome {
  const totalQuestions = round.questions.length;
  const correctCount = round.correctCount;
  const perfect = isPerfectRound(correctCount, totalQuestions);
  const starsFromAccuracy = starsForRound(correctCount);
  const starsEarned = starsFromAccuracy + (perfect ? 1 : 0);
  const xpEarned = xpForRound(correctCount, perfect);
  const leveled = applyXp(progress.level, progress.xp, xpEarned);
  const newHighScore = round.score > progress.stats.highestScore && round.score > 0;

  const categoryStats: Record<string, CategoryStats> = { ...progress.categoryStats };
  for (const answer of round.answers) {
    const existing = categoryStats[answer.category] ?? EMPTY_CATEGORY_STATS;
    categoryStats[answer.category] = {
      ...existing,
      questionsAnswered: existing.questionsAnswered + 1,
      correctAnswers: existing.correctAnswers + (answer.correct ? 1 : 0),
    };
  }
  if (round.mode === "category" && round.category) {
    const existing = categoryStats[round.category] ?? EMPTY_CATEGORY_STATS;
    categoryStats[round.category] = {
      ...existing,
      highestScore: Math.max(existing.highestScore, round.score),
      threeStarRounds: existing.threeStarRounds + (starsFromAccuracy === 3 ? 1 : 0),
    };
  }

  const recentQuestionIds = [
    ...progress.recentQuestionIds,
    ...round.questions.map((q) => q.id),
  ].slice(-RECENT_QUESTION_LIMIT);

  const updated: PlayerProgress = {
    ...progress,
    level: leveled.level,
    xp: leveled.xp,
    stars: progress.stars + starsEarned,
    recentQuestionIds,
    daysPlayed: progress.daysPlayed.includes(today)
      ? progress.daysPlayed
      : [...progress.daysPlayed, today],
    stats: {
      roundsPlayed: progress.stats.roundsPlayed + 1,
      questionsAnswered: progress.stats.questionsAnswered + totalQuestions,
      correctAnswers: progress.stats.correctAnswers + correctCount,
      highestScore: Math.max(progress.stats.highestScore, round.score),
      longestStreak: Math.max(progress.stats.longestStreak, round.bestStreak),
      perfectRounds: progress.stats.perfectRounds + (perfect ? 1 : 0),
      totalStarsEarned: progress.stats.totalStarsEarned + starsEarned,
    },
    categoryStats,
  };

  return {
    finalScore: round.score,
    correctCount,
    totalQuestions,
    accuracy: totalQuestions > 0 ? correctCount / totalQuestions : 0,
    bestStreak: round.bestStreak,
    starsFromAccuracy,
    perfectBonusStar: perfect,
    starsEarned,
    xpEarned,
    levelsGained: leveled.levelsGained,
    newHighScore,
    progress: updated,
  };
}
