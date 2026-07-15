export interface Trophy {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}

/**
 * Ordered cheapest to most expensive. Tuned so the first unlock lands in the
 * first session (~3-5 stars per round).
 */
export const TROPHIES: Trophy[] = [
  { id: "golden-pencil", name: "Golden Pencil", emoji: "✏️", cost: 3 },
  { id: "dinosaur-egg", name: "Dinosaur Egg", emoji: "🦕", cost: 6 },
  { id: "rocket-ship", name: "Rocket Ship", emoji: "🚀", cost: 10 },
  { id: "friendly-robot", name: "Friendly Robot", emoji: "🤖", cost: 15 },
  { id: "treasure-chest", name: "Treasure Chest", emoji: "💰", cost: 22 },
  { id: "crown", name: "Crown", emoji: "👑", cost: 30 },
];
