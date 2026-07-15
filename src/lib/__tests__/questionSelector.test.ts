import { describe, expect, it } from "vitest";
import type { Question } from "@/types/game";
import { selectQuestions, shuffle } from "../questionSelector";

/** Deterministic RNG so selection tests are reproducible. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeQuestion(id: string, category: string): Question {
  return {
    id,
    category,
    question: `Question ${id}?`,
    answers: ["A", "B", "C", "D"],
    correctAnswer: "A",
  };
}

function makePool(categories: string[], perCategory: number): Question[] {
  return categories.flatMap((c) =>
    Array.from({ length: perCategory }, (_, i) => makeQuestion(`${c}-${i}`, c))
  );
}

describe("shuffle", () => {
  it("keeps the same elements", () => {
    const items = [1, 2, 3, 4, 5];
    expect([...shuffle(items, mulberry32(1))].sort()).toEqual(items);
  });
});

describe("selectQuestions", () => {
  it("never repeats a question in a round", () => {
    const picked = selectQuestions(makePool(["A", "B"], 30), {
      mode: "mixed",
      random: mulberry32(42),
    });
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((q) => q.id)).size).toBe(10);
  });

  it("only picks from the requested category", () => {
    const picked = selectQuestions(makePool(["A", "B"], 30), {
      mode: "category",
      category: "B",
      random: mulberry32(7),
    });
    expect(picked).toHaveLength(10);
    expect(picked.every((q) => q.category === "B")).toBe(true);
  });

  it("returns everything available when the pool is smaller than the round", () => {
    const picked = selectQuestions(makePool(["A"], 6), {
      mode: "category",
      category: "A",
      random: mulberry32(3),
    });
    expect(picked).toHaveLength(6);
  });

  it("returns an empty round for an unknown category", () => {
    expect(
      selectQuestions(makePool(["A"], 6), { mode: "category", category: "Nope" })
    ).toHaveLength(0);
  });

  it("distributes mixed rounds evenly across categories", () => {
    const picked = selectQuestions(makePool(["A", "B", "C", "D", "E"], 20), {
      mode: "mixed",
      random: mulberry32(99),
    });
    const counts = new Map<string, number>();
    for (const q of picked) counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
    expect([...counts.values()]).toEqual([2, 2, 2, 2, 2]);
  });

  it("prefers questions that were not shown recently", () => {
    const pool = makePool(["A"], 20);
    const recentIds = pool.slice(0, 10).map((q) => q.id);
    const picked = selectQuestions(pool, {
      mode: "category",
      category: "A",
      recentIds,
      random: mulberry32(5),
    });
    expect(picked.every((q) => !recentIds.includes(q.id))).toBe(true);
  });

  it("falls back to recent questions when the pool is too small", () => {
    const pool = makePool(["A"], 12);
    const recentIds = pool.map((q) => q.id); // everything is recent
    const picked = selectQuestions(pool, {
      mode: "category",
      category: "A",
      recentIds,
      random: mulberry32(5),
    });
    expect(picked).toHaveLength(10);
  });

  it("shuffles answers but keeps the same four choices", () => {
    const picked = selectQuestions(makePool(["A"], 10), {
      mode: "category",
      category: "A",
      random: mulberry32(11),
    });
    for (const q of picked) {
      expect([...q.answers].sort()).toEqual(["A", "B", "C", "D"]);
      expect(q.answers).toContain(q.correctAnswer);
    }
  });
});
