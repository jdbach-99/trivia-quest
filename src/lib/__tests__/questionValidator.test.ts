import { describe, expect, it } from "vitest";
import { validateQuestions } from "../questionValidator";

const good = (overrides: Record<string, unknown> = {}) => ({
  id: "test-001",
  category: "Science",
  question: "Which planet is known as the Red Planet?",
  answers: ["Venus", "Mars", "Jupiter", "Mercury"],
  correctAnswer: "Mars",
  ...overrides,
});

describe("validateQuestions", () => {
  it("accepts a valid question", () => {
    const result = validateQuestions([good()]);
    expect(result.valid).toHaveLength(1);
    expect(result.warnings).toHaveLength(0);
    expect(result.categoryTotals).toEqual({ Science: 1 });
  });

  it("rejects non-array data", () => {
    const result = validateQuestions({ not: "an array" });
    expect(result.valid).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
  });

  it("skips a question with a missing id", () => {
    const result = validateQuestions([good({ id: undefined })]);
    expect(result.valid).toHaveLength(0);
    expect(result.warnings[0]).toMatch(/missing an id/);
  });

  it("skips duplicate ids but keeps the first", () => {
    const result = validateQuestions([good(), good()]);
    expect(result.valid).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/duplicate id/);
  });

  it("skips missing category and missing question text", () => {
    const result = validateQuestions([
      good({ id: "a", category: "" }),
      good({ id: "b", question: "  " }),
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.warnings).toHaveLength(2);
  });

  it("skips wrong answer counts and duplicate answers", () => {
    const result = validateQuestions([
      good({ id: "a", answers: ["Venus", "Mars", "Jupiter"] }),
      good({ id: "b", answers: ["Mars", "mars ", "Jupiter", "Venus"] }),
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.warnings).toHaveLength(2);
  });

  it("skips a correct answer that matches no choice", () => {
    const result = validateQuestions([good({ correctAnswer: "Pluto" })]);
    expect(result.valid).toHaveLength(0);
    expect(result.warnings[0]).toMatch(/correct answer/);
  });

  it("keeps valid questions when invalid ones are mixed in", () => {
    const result = validateQuestions([good(), good({ id: "bad", answers: [] }), good({ id: "test-002" })]);
    expect(result.valid.map((q) => q.id)).toEqual(["test-001", "test-002"]);
    expect(result.categoryTotals).toEqual({ Science: 2 });
  });
});
