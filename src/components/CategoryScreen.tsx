"use client";

import type { PlayerProgress } from "@/types/game";
import { categoryStyle } from "@/lib/categoryStyle";
import { masteryTier, MASTERY_BADGES } from "@/lib/mastery";
import BackButton from "./BackButton";

interface Props {
  categories: string[];
  categoryTotals: Record<string, number>;
  subcategoriesByCategory: Record<string, string[]>;
  progress: PlayerProgress;
  onPick: (category: string, subcategory?: string) => void;
  onPlayMixed: () => void;
  onBack: () => void;
}

export default function CategoryScreen({
  categories,
  categoryTotals,
  subcategoriesByCategory,
  progress,
  onPick,
  onPlayMixed,
  onBack,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-xl font-extrabold text-slate-100">What do you want to play?</h1>
      </div>

      {categories.length > 0 && (
        <button
          type="button"
          onClick={onPlayMixed}
          className="flex w-full items-center gap-2.5 rounded-xl bg-sky-400 px-3 py-2.5 text-left shadow-md transition hover:bg-sky-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
        >
          <span aria-hidden="true" className="text-2xl">
            🎲
          </span>
          <span className="min-w-0 flex-1 text-base font-extrabold text-navy-950">
            A Bit of It All
          </span>
        </button>
      )}

      {categories.length === 0 && (
        <p className="rounded-2xl bg-amber-400/15 px-4 py-3 text-center font-semibold text-amber-300">
          We couldn&apos;t find any questions yet. Check the question data file.
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {categories.map((category) => {
          const style = categoryStyle(category);
          const stats = progress.categoryStats[category];
          const answered = stats?.questionsAnswered ?? 0;
          const correct = stats?.correctAnswers ?? 0;
          const tier = masteryTier(answered, correct);
          const count = categoryTotals[category] ?? 0;
          const subcategories = subcategoriesByCategory[category] ?? [];
          return (
            <li
              key={category}
              className={`rounded-xl border-2 bg-navy-800 px-3 py-2.5 shadow-sm ${style.button}`}
            >
              <button
                type="button"
                onClick={() => onPick(category)}
                disabled={count === 0}
                aria-label={`Play all ${category}`}
                className="flex w-full items-center gap-2.5 rounded-lg text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70 disabled:opacity-50"
              >
                <span aria-hidden="true" className="text-2xl">
                  {style.emoji}
                </span>
                <span className="min-w-0 flex-1 truncate text-base font-bold text-slate-100">
                  {category}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.chip}`}
                  aria-label={`Mastery: ${tier}`}
                >
                  {MASTERY_BADGES[tier]} {tier}
                </span>
              </button>
              {subcategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      type="button"
                      onClick={() => onPick(category, subcategory)}
                      aria-label={`Play ${subcategory}`}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition hover:brightness-95 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70 ${style.chip}`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
