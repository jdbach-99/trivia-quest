"use client";

import type { RoundOutcome } from "@/lib/rounds";
import { xpNeededForNextLevel } from "@/lib/progression";
import { TROPHIES } from "@/data/trophies";
import ProgressBar from "./ProgressBar";

interface Props {
  outcome: RoundOutcome;
  onPlayAgain: () => void;
  onChooseCategory: () => void;
  onTrophies: () => void;
  onHome: () => void;
}

export default function ResultsScreen({ outcome, onPlayAgain, onChooseCategory, onTrophies, onHome }: Props) {
  const { progress } = outcome;
  const xpNeeded = xpNeededForNextLevel(progress.level);
  const nextTrophy = TROPHIES.find((t) => !progress.unlockedTrophies.includes(t.id));

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2 text-center">
        {outcome.perfectBonusStar ? (
          <p className="pop-in text-2xl font-extrabold text-amber-600">🎉 PERFECT ROUND! 🎉</p>
        ) : (
          <p className="text-2xl font-extrabold text-slate-900">Round Complete!</p>
        )}
      </header>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-5 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Final score</p>
        <p className="text-5xl font-extrabold text-sky-600">{outcome.finalScore}</p>
        {outcome.newHighScore && (
          <p className="pop-in mt-1 font-bold text-amber-600">🏅 New high score!</p>
        )}
        <div
          className="mt-3 text-3xl"
          aria-label={`${outcome.starsEarned} stars earned`}
        >
          {Array.from({ length: outcome.starsEarned }, (_, i) => (
            <span key={i} className="star-pop inline-block" style={{ animationDelay: `${i * 120}ms` }} aria-hidden="true">
              ⭐
            </span>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-sm font-semibold text-slate-600">
          <li>
            {outcome.correctCount} of {outcome.totalQuestions} correct ·{" "}
            {Math.round(outcome.accuracy * 100)}% accuracy
          </li>
          <li>Best streak: 🔥 ×{outcome.bestStreak}</li>
          <li>
            {outcome.starsFromAccuracy} star{outcome.starsFromAccuracy !== 1 && "s"} for accuracy
            {outcome.perfectBonusStar && " · +1 perfect round"}
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm font-bold">
          <span className="text-slate-700">
            +{outcome.xpEarned} XP
            {outcome.levelsGained > 0 && (
              <span className="ml-2 text-violet-700">
                ⬆ Level up{outcome.levelsGained > 1 ? ` ×${outcome.levelsGained}` : ""}!
              </span>
            )}
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900">Level {progress.level}</span>
        </div>
        <ProgressBar
          value={progress.xp}
          max={xpNeeded}
          label={`XP progress: ${progress.xp} of ${xpNeeded}`}
          barClassName="bg-sky-500"
        />
        {nextTrophy && (
          <div className="mt-3">
            <p className="mb-1 text-sm font-bold text-slate-700">
              {nextTrophy.emoji} {nextTrophy.name}:{" "}
              {progress.stars >= nextTrophy.cost
                ? "ready to unlock!"
                : `${progress.stars} / ${nextTrophy.cost} ⭐`}
            </p>
            <ProgressBar
              value={progress.stars}
              max={nextTrophy.cost}
              label={`Progress toward ${nextTrophy.name}: ${progress.stars} of ${nextTrophy.cost} stars`}
              barClassName="bg-amber-400"
              heightClassName="h-2"
            />
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={onPlayAgain}
        className="w-full rounded-3xl bg-sky-500 py-4 text-xl font-extrabold text-white shadow-lg transition hover:bg-sky-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        ▶ Play Again
      </button>
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            [onChooseCategory, "🗂️", "Categories"],
            [onTrophies, "🏆", "Trophies"],
            [onHome, "🏠", "Home"],
          ] as const
        ).map(([handler, emoji, label]) => (
          <button
            key={label}
            type="button"
            onClick={handler}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <span aria-hidden="true" className="text-2xl">
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
