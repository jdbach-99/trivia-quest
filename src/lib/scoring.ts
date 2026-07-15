export const BASE_SCORE = 100;
export const SPEED_BONUS_PER_SECOND = 5;

/** Kid-legible brackets: 3 in a row = 1.5x, 7 in a row = 2x. */
export function streakMultiplier(streak: number): number {
  if (streak >= 7) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

/**
 * Points for a correct answer.
 *
 * @param remainingSeconds whole seconds left on the timer; pass 0 when the
 *   timer is disabled (no speed bonus without time pressure)
 * @param streak the player's streak counting this correct answer
 */
export function questionScore(remainingSeconds: number, streak: number): number {
  const speedBonus = Math.max(0, Math.floor(remainingSeconds)) * SPEED_BONUS_PER_SECOND;
  return Math.round((BASE_SCORE + speedBonus) * streakMultiplier(streak));
}
