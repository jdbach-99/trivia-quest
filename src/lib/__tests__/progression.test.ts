import { describe, expect, it } from "vitest";
import {
  applyXp,
  isPerfectRound,
  starsForRound,
  xpForRound,
  xpNeededForNextLevel,
} from "../progression";

describe("starsForRound", () => {
  it("awards stars by accuracy band", () => {
    expect(starsForRound(0)).toBe(1);
    expect(starsForRound(4)).toBe(1);
    expect(starsForRound(5)).toBe(2);
    expect(starsForRound(7)).toBe(2);
    expect(starsForRound(8)).toBe(3);
    expect(starsForRound(10)).toBe(3);
  });
});

describe("isPerfectRound", () => {
  it("only 10 of 10 is perfect", () => {
    expect(isPerfectRound(10, 10)).toBe(true);
    expect(isPerfectRound(9, 10)).toBe(false);
    expect(isPerfectRound(7, 7)).toBe(false);
  });
});

describe("xpForRound", () => {
  it("awards 10 XP per correct plus perfect bonus", () => {
    expect(xpForRound(7, false)).toBe(70);
    expect(xpForRound(10, true)).toBe(125);
    expect(xpForRound(0, false)).toBe(0);
  });
});

describe("xpNeededForNextLevel", () => {
  it("matches the design document examples", () => {
    expect(xpNeededForNextLevel(1)).toBe(100);
    expect(xpNeededForNextLevel(2)).toBe(125);
    expect(xpNeededForNextLevel(3)).toBe(150);
  });
});

describe("applyXp", () => {
  it("carries XP over on level up", () => {
    expect(applyXp(1, 90, 20)).toEqual({ level: 2, xp: 10, levelsGained: 1 });
  });

  it("supports gaining multiple levels at once", () => {
    // 90 + 200 = 290 → level 2 (190 left) → level 3 (65 left)
    expect(applyXp(1, 90, 200)).toEqual({ level: 3, xp: 65, levelsGained: 2 });
  });

  it("does not level up below the threshold", () => {
    expect(applyXp(1, 0, 99)).toEqual({ level: 1, xp: 99, levelsGained: 0 });
  });
});
