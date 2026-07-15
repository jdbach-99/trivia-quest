import { describe, expect, it } from "vitest";
import { masteryTier } from "../mastery";

describe("masteryTier", () => {
  it("stays Beginner below the answer minimums regardless of accuracy", () => {
    expect(masteryTier(0, 0)).toBe("Beginner");
    expect(masteryTier(19, 19)).toBe("Beginner");
  });

  it("promotes at each tier boundary", () => {
    expect(masteryTier(20, 12)).toBe("Explorer"); // exactly 60%
    expect(masteryTier(20, 11)).toBe("Beginner"); // 55%
    expect(masteryTier(50, 35)).toBe("Expert"); // exactly 70%
    expect(masteryTier(50, 34)).toBe("Explorer"); // 68%
    expect(masteryTier(100, 80)).toBe("Master"); // exactly 80%
    expect(masteryTier(100, 79)).toBe("Expert"); // 79%
  });
});
