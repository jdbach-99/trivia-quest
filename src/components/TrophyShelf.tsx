"use client";

import { useEffect, useState } from "react";
import type { PlayerProgress } from "@/types/game";
import { TROPHIES, type Trophy } from "@/data/trophies";
import BackButton from "./BackButton";

interface Props {
  progress: PlayerProgress;
  /** Returns true when the unlock succeeded. */
  onUnlock: (trophyId: string) => boolean;
  onBack: () => void;
}

export default function TrophyShelf({ progress, onUnlock, onBack }: Props) {
  const [celebrating, setCelebrating] = useState<Trophy | null>(null);

  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(null), 2000);
    return () => clearTimeout(timer);
  }, [celebrating]);

  const handleUnlock = (trophy: Trophy) => {
    if (onUnlock(trophy.id)) setCelebrating(trophy);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="flex-1 text-2xl font-extrabold text-slate-900">Trophy Shelf</h1>
        <span className="text-lg font-bold text-amber-600" aria-label={`${progress.stars} stars available`}>
          ⭐ {progress.stars}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {TROPHIES.map((trophy) => {
          const unlocked = progress.unlockedTrophies.includes(trophy.id);
          const affordable = progress.stars >= trophy.cost;
          return (
            <li
              key={trophy.id}
              className={`flex flex-col items-center gap-1 rounded-3xl border-2 p-4 text-center shadow-sm ${
                unlocked ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
              }`}
            >
              <span
                aria-hidden="true"
                className={`text-4xl ${unlocked ? "" : "opacity-40 grayscale"}`}
              >
                {trophy.emoji}
              </span>
              <span className="text-sm font-bold text-slate-900">{trophy.name}</span>
              {unlocked ? (
                <span className="text-xs font-bold text-amber-700">Unlocked!</span>
              ) : (
                <>
                  <span className="text-xs font-semibold text-slate-500">⭐ {trophy.cost}</span>
                  {affordable ? (
                    <button
                      type="button"
                      onClick={() => handleUnlock(trophy)}
                      className="mt-1 rounded-xl bg-amber-400 px-4 py-1.5 text-sm font-extrabold text-amber-950 shadow transition hover:bg-amber-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
                    >
                      Unlock
                    </button>
                  ) : (
                    <span className="mt-1 text-xs font-medium text-slate-400">Keep earning stars!</span>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      {celebrating && (
        <div
          role="status"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setCelebrating(null)}
        >
          <div className="pop-in flex flex-col items-center gap-2 rounded-3xl bg-white p-8 shadow-xl">
            <span aria-hidden="true" className="star-pop text-7xl">
              {celebrating.emoji}
            </span>
            <p className="text-xl font-extrabold text-slate-900">{celebrating.name}</p>
            <p className="font-bold text-amber-600">Unlocked! 🎉</p>
          </div>
        </div>
      )}
    </div>
  );
}
