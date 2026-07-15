import type { GameMode, Question } from "@/types/game";
import { ROUND_SIZE } from "./constants";

export type Random = () => number;

/** Fisher-Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface SelectOptions {
  mode: GameMode;
  category?: string;
  roundSize?: number;
  /** Question ids shown recently; avoided unless the pool is too small. */
  recentIds?: readonly string[];
  random?: Random;
}

/** Shuffled copy of the list with not-recently-seen questions first. */
function orderPreferringFresh(list: Question[], recent: Set<string>, random: Random): Question[] {
  const fresh = shuffle(list.filter((q) => !recent.has(q.id)), random);
  const stale = shuffle(list.filter((q) => recent.has(q.id)), random);
  return [...fresh, ...stale];
}

/**
 * Picks up to roundSize unique questions for a round, shuffles their order,
 * and shuffles each question's answer choices. In mixed mode questions are
 * spread across categories as evenly as the pool allows.
 */
export function selectQuestions(pool: Question[], options: SelectOptions): Question[] {
  const { mode, category, roundSize = ROUND_SIZE, recentIds = [], random = Math.random } = options;
  const recent = new Set(recentIds);
  const available = mode === "category" ? pool.filter((q) => q.category === category) : pool;
  const target = Math.min(roundSize, available.length);

  let picked: Question[];
  if (mode === "category") {
    picked = orderPreferringFresh(available, recent, random).slice(0, target);
  } else {
    const byCategory = new Map<string, Question[]>();
    for (const q of available) {
      const list = byCategory.get(q.category);
      if (list) list.push(q);
      else byCategory.set(q.category, [q]);
    }
    const queues = shuffle(
      [...byCategory.values()].map((list) => orderPreferringFresh(list, recent, random)),
      random
    );
    picked = [];
    while (picked.length < target) {
      let tookAny = false;
      for (const queue of queues) {
        if (picked.length >= target) break;
        const next = queue.shift();
        if (next) {
          picked.push(next);
          tookAny = true;
        }
      }
      if (!tookAny) break;
    }
  }

  return shuffle(picked, random).map((q) => ({ ...q, answers: shuffle(q.answers, random) }));
}
