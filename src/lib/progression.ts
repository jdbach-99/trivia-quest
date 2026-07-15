export const XP_PER_CORRECT = 10;
export const PERFECT_ROUND_XP_BONUS = 25;
export const PERFECT_ROUND_SIZE = 10;

export function starsForRound(correctCount: number): number {
  if (correctCount >= 8) return 3;
  if (correctCount >= 5) return 2;
  return 1;
}

/** A perfect round is 10 of 10; shorter rounds never qualify. */
export function isPerfectRound(correctCount: number, totalQuestions: number): boolean {
  return totalQuestions === PERFECT_ROUND_SIZE && correctCount === PERFECT_ROUND_SIZE;
}

export function xpForRound(correctCount: number, perfect: boolean): number {
  return correctCount * XP_PER_CORRECT + (perfect ? PERFECT_ROUND_XP_BONUS : 0);
}

export function xpNeededForNextLevel(level: number): number {
  return 100 + (level - 1) * 25;
}

export function applyXp(
  level: number,
  xp: number,
  gained: number
): { level: number; xp: number; levelsGained: number } {
  let newLevel = level;
  let newXp = xp + gained;
  let levelsGained = 0;
  while (newXp >= xpNeededForNextLevel(newLevel)) {
    newXp -= xpNeededForNextLevel(newLevel);
    newLevel += 1;
    levelsGained += 1;
  }
  return { level: newLevel, xp: newXp, levelsGained };
}

/** Local calendar date as YYYY-MM-DD, used for the days-played stat. */
export function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
