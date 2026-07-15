export interface Trophy {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}

/** Ordered cheapest to most expensive. */
export const TROPHIES: Trophy[] = [
  { id: "golden-pencil", name: "Golden Pencil", emoji: "✏️", cost: 5 },
  { id: "mini-globe", name: "Mini Globe", emoji: "🌍", cost: 10 },
  { id: "dinosaur-egg", name: "Dinosaur Egg", emoji: "🦕", cost: 15 },
  { id: "rocket-ship", name: "Rocket Ship", emoji: "🚀", cost: 20 },
  { id: "friendly-robot", name: "Friendly Robot", emoji: "🤖", cost: 25 },
  { id: "crystal", name: "Crystal", emoji: "💎", cost: 30 },
  { id: "treasure-chest", name: "Treasure Chest", emoji: "💰", cost: 40 },
  { id: "magic-book", name: "Magic Book", emoji: "📖", cost: 50 },
  { id: "crown", name: "Crown", emoji: "👑", cost: 65 },
  { id: "star-trophy", name: "Star Trophy", emoji: "🏆", cost: 80 },
];
