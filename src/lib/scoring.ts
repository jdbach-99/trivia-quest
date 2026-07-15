export const BASE_SCORE = 100;
export const SPEED_BONUS_PER_SECOND = 5;

export function streakMultiplier(streak: number): number {
  if (streak >= 10) return 2.0;
  if (streak >= 8) return 1.75;
  if (streak >= 6) return 1.5;
  if (streak >= 4) return 1.25;
  if (streak >= 2) return 1.1;
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
