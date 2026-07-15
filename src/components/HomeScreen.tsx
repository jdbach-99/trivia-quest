"use client";

import type { PlayerProgress, Screen } from "@/types/game";
import { xpNeededForNextLevel } from "@/lib/progression";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: PlayerProgress;
  dailyBonusAvailable: boolean;
  onQuickPlay: () => void;
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ progress, dailyBonusAvailable, onQuickPlay, onNavigate }: Props) {
  const xpNeeded = xpNeededForNextLevel(progress.level);
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          <span aria-hidden="true">🧠 </span>Trivia Quest
        </h1>
      </header>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-900">
            Level {progress.level}
          </span>
          <span className="text-lg font-bold text-amber-600" aria-label={`${progress.stars} stars available`}>
            ⭐ {progress.stars}
          </span>
        </div>
        <ProgressBar
          value={progress.xp}
          max={xpNeeded}
          label={`XP progress: ${progress.xp} of ${xpNeeded}`}
          barClassName="bg-sky-500"
        />
        <p className="mt-1 text-right text-xs font-medium text-slate-500">
          {progress.xp} / {xpNeeded} XP to level {progress.level + 1}
        </p>
      </section>

      <p
        className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
          dailyBonusAvailable ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
        }`}
      >
        {dailyBonusAvailable
          ? "🎁 Daily bonus: complete a round today to earn 2 extra stars!"
          : "✅ Daily bonus earned — see you tomorrow!"}
      </p>

      <button
        type="button"
        onClick={onQuickPlay}
        className="w-full rounded-3xl bg-sky-500 py-6 text-2xl font-extrabold text-white shadow-lg transition hover:bg-sky-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        ▶ Quick Play
      </button>

      <button
        type="button"
        onClick={() => onNavigate("categories")}
        className="w-full rounded-3xl border-2 border-violet-300 bg-white py-4 text-lg font-bold text-violet-900 shadow-sm transition hover:bg-violet-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
      >
        🗂️ Category Play
      </button>

      <nav aria-label="More" className="grid grid-cols-3 gap-3">
        {(
          [
            ["trophies", "🏆", "Trophies"],
            ["stats", "📊", "Stats"],
            ["settings", "⚙️", "Settings"],
          ] as const
        ).map(([screen, emoji, label]) => (
          <button
            key={screen}
            type="button"
            onClick={() => onNavigate(screen)}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <span aria-hidden="true" className="text-2xl">
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
