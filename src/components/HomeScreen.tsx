"use client";

import type { PlayerProgress, Screen } from "@/types/game";
import { xpNeededForNextLevel } from "@/lib/progression";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: PlayerProgress;
  onPlay: () => void;
  onNavigate: (screen: Screen) => void;
  onHowToPlay: () => void;
}

export default function HomeScreen({ progress, onPlay, onNavigate, onHowToPlay }: Props) {
  const xpNeeded = xpNeededForNextLevel(progress.level);
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
          <span aria-hidden="true">🧠 </span>Trivia Quest
        </h1>
      </header>

      <section className="rounded-3xl border-2 border-navy-700 bg-navy-800 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-sky-400/20 px-3 py-1 text-sm font-bold text-sky-300">
            Level {progress.level}
          </span>
          <span className="text-lg font-bold text-amber-400" aria-label={`${progress.stars} stars available`}>
            ⭐ {progress.stars}
          </span>
        </div>
        <ProgressBar
          value={progress.xp}
          max={xpNeeded}
          label={`XP progress: ${progress.xp} of ${xpNeeded}`}
          barClassName="bg-sky-400"
        />
        <p className="mt-1 text-right text-xs font-medium text-slate-400">
          {progress.xp} / {xpNeeded} XP to level {progress.level + 1}
        </p>
      </section>

      <button
        type="button"
        onClick={onPlay}
        className="w-full rounded-3xl bg-sky-400 py-8 text-3xl font-extrabold text-navy-950 shadow-lg transition hover:bg-sky-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
      >
        ▶ Play
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
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-navy-700 bg-navy-800 py-3 text-sm font-bold text-slate-300 shadow-sm transition hover:border-navy-500 hover:bg-navy-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
          >
            <span aria-hidden="true" className="text-2xl">
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={onHowToPlay}
        className="mx-auto rounded-full px-4 py-1.5 text-sm font-bold text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
      >
        ❓ How to play
      </button>
    </div>
  );
}
