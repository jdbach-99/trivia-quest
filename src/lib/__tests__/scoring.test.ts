import { describe, expect, it } from "vitest";
import { questionScore, streakMultiplier } from "../scoring";

describe("streakMultiplier", () => {
  it("covers every boundary", () => {
    expect(streakMultiplier(0)).toBe(1.0);
    expect(streakMultiplier(1)).toBe(1.0);
    expect(streakMultiplier(2)).toBe(1.1);
    expect(streakMultiplier(3)).toBe(1.1);
    expect(streakMultiplier(4)).toBe(1.25);
    expect(streakMultiplier(5)).toBe(1.25);
    expect(streakMultiplier(6)).toBe(1.5);
    expect(streakMultiplier(7)).toBe(1.5);
    expect(streakMultiplier(8)).toBe(1.75);
    expect(streakMultiplier(9)).toBe(1.75);
    expect(streakMultiplier(10)).toBe(2.0);
    expect(streakMultiplier(15)).toBe(2.0);
  });
});

describe("questionScore", () => {
  it("matches the design document example: 12s left on a 4 streak = 200", () => {
    expect(questionScore(12, 4)).toBe(200);
  });

  it("awards base score only with no time left and no streak", () => {
    expect(questionScore(0, 0)).toBe(100);
    expect(questionScore(0, 1)).toBe(100);
  });

  it("rounds the multiplied score", () => {
    // (100 + 15) * 1.1 = 126.5 → 127
    expect(questionScore(3, 2)).toBe(127);
  });

  it("caps out at max speed bonus and max multiplier", () => {
    // (100 + 100) * 2.0
    expect(questionScore(20, 10)).toBe(400);
  });

  it("ignores negative and fractional seconds", () => {
    expect(questionScore(-5, 0)).toBe(100);
    expect(questionScore(7.9, 0)).toBe(135);
  });
});
