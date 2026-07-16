"use client";

import { useState } from "react";
import type { PlayerProgress } from "@/types/game";
import { categoryStyle } from "@/lib/categoryStyle";
import { masteryTier, MASTERY_BADGES } from "@/lib/mastery";
import BackButton from "./BackButton";
import Modal from "./Modal";

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
  const [infoCategory, setInfoCategory] = useState<string | null>(null);
  const infoSubcategories = infoCategory ? (subcategoriesByCategory[infoCategory] ?? []) : [];
  const infoStyle = infoCategory ? categoryStyle(infoCategory) : null;

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
          className="flex w-full items-center gap-2.5 rounded-2xl bg-sky-400 px-3 py-3 text-left shadow-[0_4px_0_0_rgba(2,132,199,0.9)] transition hover:bg-sky-300 active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
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
          const hasSubcategories = (subcategoriesByCategory[category] ?? []).length > 0;
          return (
            <li
              key={category}
              className={`relative rounded-2xl border-[3px] bg-navy-800 px-3 pb-9 pt-3 transition-transform active:translate-y-[2px] ${style.button}`}
            >
              <button
                type="button"
                onClick={() => onPick(category)}
                disabled={count === 0}
                aria-label={`Play ${category}`}
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
              {hasSubcategories && (
                <button
                  type="button"
                  onClick={() => setInfoCategory(category)}
                  aria-label={`What's in ${category}?`}
                  className={`absolute bottom-2 left-3 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold transition hover:brightness-125 active:scale-[0.9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70 ${style.chip}`}
                >
                  ?
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Modal
        open={infoCategory !== null}
        title={infoCategory ? `${infoStyle?.emoji} ${infoCategory}` : ""}
        onClose={() => setInfoCategory(null)}
      >
        <p className="mb-3 text-sm font-medium text-slate-400">
          Tap a topic to play just that, or close and tap the card to play them all.
        </p>
        <ul className="flex flex-col gap-2">
          {infoSubcategories.map((subcategory) => (
            <li key={subcategory}>
              <button
                type="button"
                onClick={() => {
                  setInfoCategory(null);
                  if (infoCategory) onPick(infoCategory, subcategory);
                }}
                className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold transition hover:brightness-125 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70 ${infoStyle?.chip ?? ""}`}
              >
                {subcategory}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
