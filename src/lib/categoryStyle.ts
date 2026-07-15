export interface CategoryStyle {
  emoji: string;
  /** Accent classes for chips/cards; full class strings so Tailwind sees them. */
  chip: string;
  button: string;
}

const KNOWN: Record<string, CategoryStyle> = {
  Books: {
    emoji: "📚",
    chip: "bg-amber-100 text-amber-900",
    button: "border-amber-300 hover:border-amber-500 hover:bg-amber-50",
  },
  Movies: {
    emoji: "🎬",
    chip: "bg-violet-100 text-violet-900",
    button: "border-violet-300 hover:border-violet-500 hover:bg-violet-50",
  },
  Food: {
    emoji: "🍜",
    chip: "bg-rose-100 text-rose-900",
    button: "border-rose-300 hover:border-rose-500 hover:bg-rose-50",
  },
  Garden: {
    emoji: "🌻",
    chip: "bg-emerald-100 text-emerald-900",
    button: "border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50",
  },
  "Video Games": {
    emoji: "🎮",
    chip: "bg-sky-100 text-sky-900",
    button: "border-sky-300 hover:border-sky-500 hover:bg-sky-50",
  },
};

const FALLBACKS: CategoryStyle[] = [
  {
    emoji: "🧠",
    chip: "bg-cyan-100 text-cyan-900",
    button: "border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50",
  },
  {
    emoji: "⭐",
    chip: "bg-orange-100 text-orange-900",
    button: "border-orange-300 hover:border-orange-500 hover:bg-orange-50",
  },
  {
    emoji: "🔍",
    chip: "bg-lime-100 text-lime-900",
    button: "border-lime-300 hover:border-lime-500 hover:bg-lime-50",
  },
];

/** Style for a category; unknown categories get a stable fallback. */
export function categoryStyle(category: string): CategoryStyle {
  const known = KNOWN[category];
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return FALLBACKS[hash % FALLBACKS.length];
}
