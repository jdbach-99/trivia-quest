import type { Question } from "@/types/game";

export interface ValidationResult {
  valid: Question[];
  warnings: string[];
  categoryTotals: Record<string, number>;
}

/**
 * Validates raw (untrusted) question data. Invalid records are skipped and
 * reported as warnings; the game keeps running with whatever is valid.
 */
export function validateQuestions(raw: unknown): ValidationResult {
  const valid: Question[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  if (!Array.isArray(raw)) {
    return { valid, warnings: ["Question data is not an array."], categoryTotals: {} };
  }

  raw.forEach((entry, index) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      warnings.push(`Entry at index ${index} is not an object; skipped.`);
      return;
    }
    const q = entry as Record<string, unknown>;
    const label = typeof q.id === "string" && q.id.trim() !== "" ? `"${q.id}"` : `at index ${index}`;

    if (typeof q.id !== "string" || q.id.trim() === "") {
      warnings.push(`Question at index ${index} is missing an id; skipped.`);
      return;
    }
    if (seenIds.has(q.id)) {
      warnings.push(`Question ${label} has a duplicate id; skipped.`);
      return;
    }
    if (typeof q.category !== "string" || q.category.trim() === "") {
      warnings.push(`Question ${label} is missing a category; skipped.`);
      return;
    }
    if (typeof q.question !== "string" || q.question.trim() === "") {
      warnings.push(`Question ${label} is missing question text; skipped.`);
      return;
    }
    if (
      !Array.isArray(q.answers) ||
      q.answers.length !== 4 ||
      !q.answers.every((a): a is string => typeof a === "string" && a.trim() !== "")
    ) {
      warnings.push(`Question ${label} does not have exactly 4 answer choices; skipped.`);
      return;
    }
    const answers = q.answers as string[];
    const normalized = new Set(answers.map((a) => a.trim().toLowerCase()));
    if (normalized.size !== 4) {
      warnings.push(`Question ${label} has duplicate answer choices; skipped.`);
      return;
    }
    if (typeof q.correctAnswer !== "string" || !answers.includes(q.correctAnswer)) {
      warnings.push(`Question ${label} has a correct answer that does not match an answer choice; skipped.`);
      return;
    }

    seenIds.add(q.id);
    valid.push({
      id: q.id,
      category: q.category,
      subcategory: typeof q.subcategory === "string" ? q.subcategory : undefined,
      difficulty: typeof q.difficulty === "string" ? q.difficulty : undefined,
      question: q.question,
      answers,
      correctAnswer: q.correctAnswer,
      explanation: typeof q.explanation === "string" && q.explanation.trim() !== "" ? q.explanation : undefined,
    });
  });

  const categoryTotals: Record<string, number> = {};
  for (const q of valid) {
    categoryTotals[q.category] = (categoryTotals[q.category] ?? 0) + 1;
  }
  return { valid, warnings, categoryTotals };
}
