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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-extrabold text-slate-900">What do you want to play?</h1>
      </div>

      {categories.length > 0 && (
        <button
          type="button"
          onClick={onPlayMixed}
          className="flex w-full items-center gap-3 rounded-2xl bg-sky-500 p-4 text-left shadow-md transition hover:bg-sky-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <span aria-hidden="true" className="text-3xl">
            🎲
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-extrabold text-white">Everything</span>
            <span className="block text-xs font-semibold text-sky-100">
              A mix of questions from all categories
            </span>
          </span>
        </button>
      )}

      {categories.length === 0 && (
        <p className="rounded-2xl bg-amber-100 px-4 py-3 text-center font-semibold text-amber-900">
          We couldn&apos;t find any questions yet. Check the question data file.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {categories.map((category) => {
          const style = categoryStyle(category);
          const stats = progress.categoryStats[category];
          const answered = stats?.questionsAnswered ?? 0;
          const correct = stats?.correctAnswers ?? 0;
          const tier = masteryTier(answered, correct);
          const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
          const count = categoryTotals[category] ?? 0;
          const subcategories = subcategoriesByCategory[category] ?? [];
          return (
            <li
              key={category}
              className={`rounded-2xl border-2 bg-white p-3 shadow-sm ${style.button}`}
            >
              <button
                type="button"
                onClick={() => onPick(category)}
                disabled={count === 0}
                aria-label={`Play all ${category}`}
                className="flex w-full items-center gap-3 rounded-xl text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 disabled:opacity-50"
              >
                <span aria-hidden="true" className="text-3xl">
                  {style.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-slate-900">{category}</span>
                  <span className="block text-xs font-medium text-slate-500">
                    {count} questions
                    {accuracy !== null && ` · ${accuracy}% accuracy`}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${style.chip}`}
                  aria-label={`Mastery: ${tier}`}
                >
                  {MASTERY_BADGES[tier]} {tier}
                </span>
              </button>
              {subcategories.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      type="button"
                      onClick={() => onPick(category, subcategory)}
                      aria-label={`Play ${subcategory}`}
                      className={`min-h-[38px] rounded-full px-3.5 py-1.5 text-sm font-bold transition hover:brightness-95 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${style.chip}`}
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
