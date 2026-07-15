import rawQuestions from "@/data/questions.json";
import { validateQuestions } from "./questionValidator";

const result = validateQuestions(rawQuestions);

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  console.groupCollapsed(
    `[Trivia Quest] Loaded ${result.valid.length} valid questions` +
      (result.warnings.length > 0 ? ` (${result.warnings.length} skipped)` : "")
  );
  console.table(result.categoryTotals);
  for (const warning of result.warnings) console.warn(warning);
  console.groupEnd();
}

export const questions = result.valid;
export const questionWarnings = result.warnings;
export const categoryTotals = result.categoryTotals;
/** Category names in data order, deduplicated. */
export const categories = [...new Set(questions.map((q) => q.category))];
