export type MasteryTier = "Beginner" | "Explorer" | "Expert" | "Master";

export function masteryTier(questionsAnswered: number, correctAnswers: number): MasteryTier {
  const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  if (questionsAnswered >= 100 && accuracy >= 0.8) return "Master";
  if (questionsAnswered >= 50 && accuracy >= 0.7) return "Expert";
  if (questionsAnswered >= 20 && accuracy >= 0.6) return "Explorer";
  return "Beginner";
}

export const MASTERY_BADGES: Record<MasteryTier, string> = {
  Beginner: "🌱",
  Explorer: "🧭",
  Expert: "🎓",
  Master: "🏅",
};
