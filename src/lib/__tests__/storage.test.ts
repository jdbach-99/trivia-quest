import { describe, expect, it } from "vitest";
import { defaultProgress, sanitizeProgress } from "../storage";

describe("sanitizeProgress", () => {
  it("returns defaults for garbage input", () => {
    expect(sanitizeProgress(null)).toEqual(defaultProgress());
    expect(sanitizeProgress("corrupted")).toEqual(defaultProgress());
    expect(sanitizeProgress([1, 2, 3])).toEqual(defaultProgress());
  });

  it("keeps valid fields from partial data and fills in the rest", () => {
    const result = sanitizeProgress({ level: 4, stars: 12, settings: { timerEnabled: false } });
    expect(result.level).toBe(4);
    expect(result.stars).toBe(12);
    expect(result.settings.timerEnabled).toBe(false);
    expect(result.settings.soundEnabled).toBe(true);
    expect(result.stats.roundsPlayed).toBe(0);
  });

  it("rejects invalid field types and negative numbers", () => {
    const result = sanitizeProgress({
      level: "ninety-nine",
      stars: -5,
      unlockedTrophies: [1, "crystal", null],
      categoryStats: { Science: { questionsAnswered: "many" }, Junk: "nope" },
    });
    expect(result.level).toBe(1);
    expect(result.stars).toBe(0);
    expect(result.unlockedTrophies).toEqual(["crystal"]);
    expect(result.categoryStats.Science.questionsAnswered).toBe(0);
    expect(result.categoryStats.Junk).toBeUndefined();
  });
});
