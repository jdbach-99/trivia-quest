"use client";

import type { PlayerProgress } from "@/types/game";
import { categoryStyle } from "@/lib/categoryStyle";
import { masteryTier, MASTERY_BADGES } from "@/lib/mastery";
import BackButton from "./BackButton";

interface Props {
  progress: PlayerProgress;
  onBack: () => void;
}

export default function StatsScreen({ progress, onBack }: Props) {
  const { stats } = progress;
  const accuracy =
    stats.questionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
      : 0;

  const rows: [string, string | number][] = [
    ["Rounds played", stats.roundsPlayed],
    ["Questions answered", stats.questionsAnswered],
    ["Correct answers", stats.correctAnswers],
    ["Accuracy", `${accuracy}%`],
    ["Highest round score", stats.highestScore],
    ["Longest streak", `🔥 ×${stats.longestStreak}`],
    ["Perfect rounds", stats.perfectRounds],
    ["Total stars earned", `⭐ ${stats.totalStarsEarned}`],
    ["Current level", progress.level],
    ["Days played", progress.daysPlayed.length],
  ];

  const categories = Object.entries(progress.categoryStats);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-extrabold text-slate-100">Statistics</h1>
      </div>

      <section className="rounded-3xl border-2 border-navy-700 bg-navy-800 p-4 shadow-sm">
        <ul className="divide-y divide-navy-700">
          {rows.map(([label, value]) => (
            <li key={label} className="flex items-center justify-between py-2 text-sm">
              <span className="font-semibold text-slate-400">{label}</span>
              <span className="font-bold text-slate-100">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="text-lg font-extrabold text-slate-100">Categories</h2>
      {categories.length === 0 ? (
        <p className="rounded-2xl bg-navy-800 px-4 py-3 text-center text-sm font-semibold text-slate-400">
          Play a round to start tracking category stats!
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {categories.map(([category, cs]) => {
            const style = categoryStyle(category);
            const tier = masteryTier(cs.questionsAnswered, cs.correctAnswers);
            const catAccuracy =
              cs.questionsAnswered > 0
                ? Math.round((cs.correctAnswers / cs.questionsAnswered) * 100)
                : 0;
            return (
              <li
                key={category}
                className="rounded-3xl border-2 border-navy-700 bg-navy-800 p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold text-slate-100">
                    <span aria-hidden="true">{style.emoji} </span>
                    {category}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.chip}`}>
                    {MASTERY_BADGES[tier]} {tier}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-400">
                  {cs.correctAnswers} / {cs.questionsAnswered} correct · {catAccuracy}% accuracy
                </p>
                <p className="text-sm font-medium text-slate-400">
                  Best round: {cs.highestScore} · 3-star rounds: {cs.threeStarRounds}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
