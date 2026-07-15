import { describe, expect, it } from "vitest";
import { questionScore, streakMultiplier } from "../scoring";

describe("streakMultiplier", () => {
  it("covers every boundary: 1x, 1.5x at 3+, 2x at 7+", () => {
    expect(streakMultiplier(0)).toBe(1.0);
    expect(streakMultiplier(1)).toBe(1.0);
    expect(streakMultiplier(2)).toBe(1.0);
    expect(streakMultiplier(3)).toBe(1.5);
    expect(streakMultiplier(6)).toBe(1.5);
    expect(streakMultiplier(7)).toBe(2.0);
    expect(streakMultiplier(15)).toBe(2.0);
  });
});

describe("questionScore", () => {
  it("applies speed bonus and streak multiplier: 12s left on a 4 streak", () => {
    // (100 + 60) * 1.5
    expect(questionScore(12, 4)).toBe(240);
  });

  it("awards base score only with no time left and no streak", () => {
    expect(questionScore(0, 0)).toBe(100);
    expect(questionScore(0, 2)).toBe(100);
  });

  it("rounds the multiplied score", () => {
    // (100 + 15) * 1.5 = 172.5 → 173
    expect(questionScore(3, 3)).toBe(173);
  });

  it("caps out at max speed bonus and max multiplier", () => {
    // (100 + 100) * 2.0
    expect(questionScore(20, 7)).toBe(400);
  });

  it("ignores negative and fractional seconds", () => {
    expect(questionScore(-5, 0)).toBe(100);
    expect(questionScore(7.9, 0)).toBe(135);
  });
});
