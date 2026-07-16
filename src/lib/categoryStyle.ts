export interface CategoryStyle {
  emoji: string;
  /** Accent classes for chips/cards; full class strings so Tailwind sees them. */
  chip: string;
  button: string;
}

const KNOWN: Record<string, CategoryStyle> = {
  "Hugo Books": {
    emoji: "📚",
    chip: "bg-amber-400/20 text-amber-300",
    button: "border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/10",
  },
  "Hugo Films": {
    emoji: "🎬",
    chip: "bg-violet-400/20 text-violet-300",
    button: "border-violet-400/40 hover:border-violet-400 hover:bg-violet-400/10",
  },
  "Hugo Eats": {
    emoji: "🍜",
    chip: "bg-rose-400/20 text-rose-300",
    button: "border-rose-400/40 hover:border-rose-400 hover:bg-rose-400/10",
  },
  "Hugo Plants": {
    emoji: "🌻",
    chip: "bg-emerald-400/20 text-emerald-300",
    button: "border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-400/10",
  },
  "Hugo Games": {
    emoji: "🎮",
    chip: "bg-sky-400/20 text-sky-300",
    button: "border-sky-400/40 hover:border-sky-400 hover:bg-sky-400/10",
  },
};

const FALLBACKS: CategoryStyle[] = [
  {
    emoji: "🧠",
    chip: "bg-cyan-400/20 text-cyan-300",
    button: "border-cyan-400/40 hover:border-cyan-400 hover:bg-cyan-400/10",
  },
  {
    emoji: "⭐",
    chip: "bg-orange-400/20 text-orange-300",
    button: "border-orange-400/40 hover:border-orange-400 hover:bg-orange-400/10",
  },
  {
    emoji: "🔍",
    chip: "bg-lime-400/20 text-lime-300",
    button: "border-lime-400/40 hover:border-lime-400 hover:bg-lime-400/10",
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
