import { describe, expect, it } from "vitest";
import type { Question, RoundState } from "@/types/game";
import { applyRoundResults } from "../rounds";
import { defaultProgress } from "../storage";

const TODAY = "2026-07-15";

function makeRound(correctCount: number, options: Partial<RoundState> = {}): RoundState {
  const questions: Question[] = Array.from({ length: 10 }, (_, i) => ({
    id: `q-${i}`,
    category: "Science",
    question: `Question ${i}?`,
    answers: ["A", "B", "C", "D"],
    correctAnswer: "A",
  }));
  return {
    mode: "category",
    category: "Science",
    questions,
    currentQuestionIndex: 9,
    score: correctCount * 100,
    correctCount,
    currentStreak: 0,
    bestStreak: Math.min(correctCount, 10),
    answers: questions.map((q, i) => ({
      questionId: q.id,
      category: q.category,
      selectedAnswer: i < correctCount ? "A" : "B",
      correct: i < correctCount,
      pointsEarned: i < correctCount ? 100 : 0,
    })),
    startedAt: 0,
    ...options,
  };
}

describe("applyRoundResults", () => {
  it("awards accuracy stars plus the daily bonus on the first round of the day", () => {
    const outcome = applyRoundResults(defaultProgress(), makeRound(6), TODAY);
    expect(outcome.starsFromAccuracy).toBe(2);
    expect(outcome.dailyBonusStars).toBe(2);
    expect(outcome.starsEarned).toBe(4);
    expect(outcome.progress.stars).toBe(4);
    expect(outcome.progress.lastDailyBonusDate).toBe(TODAY);
  });

  it("awards the daily bonus only once per day", () => {
    const first = applyRoundResults(defaultProgress(), makeRound(6), TODAY);
    const second = applyRoundResults(first.progress, makeRound(6), TODAY);
    expect(second.dailyBonusStars).toBe(0);
    expect(second.starsEarned).toBe(2);
  });

  it("awards the daily bonus again on a new day without resetting anything", () => {
    const first = applyRoundResults(defaultProgress(), makeRound(6), TODAY);
    const nextWeek = applyRoundResults(first.progress, makeRound(6), "2026-07-22");
    expect(nextWeek.dailyBonusStars).toBe(2);
    expect(nextWeek.progress.daysPlayed).toEqual([TODAY, "2026-07-22"]);
  });

  it("adds the perfect round star and XP bonus", () => {
    const outcome = applyRoundResults(defaultProgress(), makeRound(10), TODAY);
    expect(outcome.perfectBonusStar).toBe(true);
    expect(outcome.starsFromAccuracy).toBe(3);
    expect(outcome.starsEarned).toBe(6); // 3 + 1 perfect + 2 daily
    expect(outcome.xpEarned).toBe(125);
    expect(outcome.progress.stats.perfectRounds).toBe(1);
  });

  it("levels the player up when XP crosses the threshold", () => {
    const progress = { ...defaultProgress(), xp: 90 };
    const outcome = applyRoundResults(progress, makeRound(6), TODAY); // +60 XP
    expect(outcome.progress.level).toBe(2);
    expect(outcome.progress.xp).toBe(50);
    expect(outcome.levelsGained).toBe(1);
  });

  it("flags a new high score only when the score is beaten", () => {
    const first = applyRoundResults(defaultProgress(), makeRound(6), TODAY);
    expect(first.newHighScore).toBe(true);
    const lower = applyRoundResults(first.progress, makeRound(3), TODAY);
    expect(lower.newHighScore).toBe(false);
    expect(lower.progress.stats.highestScore).toBe(600);
  });

  it("updates category stats, three-star rounds, and the recent-question history", () => {
    const outcome = applyRoundResults(defaultProgress(), makeRound(9), TODAY);
    const cs = outcome.progress.categoryStats.Science;
    expect(cs.questionsAnswered).toBe(10);
    expect(cs.correctAnswers).toBe(9);
    expect(cs.highestScore).toBe(900);
    expect(cs.threeStarRounds).toBe(1);
    expect(outcome.progress.recentQuestionIds).toHaveLength(10);
  });

  it("attributes mixed-round answers to each question's category without a round score", () => {
    const round = makeRound(10, { mode: "mixed", category: undefined });
    round.answers[0] = { ...round.answers[0], category: "History" };
    const outcome = applyRoundResults(defaultProgress(), round, TODAY);
    expect(outcome.progress.categoryStats.History.questionsAnswered).toBe(1);
    expect(outcome.progress.categoryStats.Science.questionsAnswered).toBe(9);
    expect(outcome.progress.categoryStats.Science.highestScore).toBe(0);
  });

  it("caps the recent-question history at 100 ids", () => {
    let progress = defaultProgress();
    for (let i = 0; i < 12; i++) {
      const round = makeRound(5);
      round.questions = round.questions.map((q, j) => ({ ...q, id: `r${i}-q${j}` }));
      progress = applyRoundResults(progress, round, TODAY).progress;
    }
    expect(progress.recentQuestionIds).toHaveLength(100);
    expect(progress.recentQuestionIds[99]).toBe("r11-q9");
  });
});
