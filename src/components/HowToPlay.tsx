"use client";

import Modal from "./Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIPS: [string, string][] = [
  ["🎯", "Answer 10 questions each round. Tap the answer you think is right!"],
  ["⚡", "Answer fast and keep a streak going to earn extra points."],
  ["⭐", "Finishing a round earns stars — spend them on trophies for your shelf."],
  ["🎁", "Come back every day: your first round earns 2 bonus stars."],
];

export default function HowToPlay({ open, onClose }: Props) {
  return (
    <Modal open={open} title="Welcome to Trivia Quest! 🧠" onClose={onClose}>
      <ul className="mb-5 space-y-3">
        {TIPS.map(([emoji, tip]) => (
          <li key={emoji} className="flex items-start gap-3">
            <span aria-hidden="true" className="text-2xl leading-6">
              {emoji}
            </span>
            <span className="text-sm font-semibold leading-snug text-slate-700">{tip}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="w-full rounded-2xl bg-sky-500 py-3.5 text-lg font-extrabold text-white shadow transition hover:bg-sky-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        Let&apos;s Play! ▶
      </button>
    </Modal>
  );
}
