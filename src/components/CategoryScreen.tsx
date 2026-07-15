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
  onPick: (category: string) => void;
  onBack: () => void;
}

export default function CategoryScreen({
  categories,
  categoryTotals,
  subcategoriesByCategory,
  progress,
  onPick,
  onBack,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-extrabold text-slate-900">Pick a Category</h1>
      </div>

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
            <li key={category}>
              <button
                type="button"
                onClick={() => onPick(category)}
                disabled={count === 0}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 disabled:opacity-50 ${style.button}`}
              >
                <span aria-hidden="true" className="text-3xl">
                  {style.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-slate-900">{category}</span>
                  {subcategories.length > 0 && (
                    <span className="block truncate text-sm font-semibold text-slate-600">
                      {subcategories.join(" · ")}
                    </span>
                  )}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
