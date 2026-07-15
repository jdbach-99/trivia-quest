"use client";

import { useState } from "react";
import type { Settings } from "@/types/game";
import BackButton from "./BackButton";
import Modal from "./Modal";

interface Props {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
  onReset: () => void;
  onBack: () => void;
}

function Toggle({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-xs font-medium text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </li>
  );
}

export default function SettingsScreen({ settings, onChange, onReset, onBack }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
      </div>

      <section className="rounded-3xl border-2 border-slate-200 bg-white px-4 shadow-sm">
        <ul className="divide-y divide-slate-100">
          <Toggle
            label="Sound"
            description="Little beeps and celebration tones"
            checked={settings.soundEnabled}
            onToggle={() => onChange({ soundEnabled: !settings.soundEnabled })}
          />
          <Toggle
            label="Timer"
            description="20 seconds per question, with speed bonus points"
            checked={settings.timerEnabled}
            onToggle={() => onChange({ timerEnabled: !settings.timerEnabled })}
          />
          <Toggle
            label="Reduced motion"
            description="Turn off animations"
            checked={settings.reducedMotion}
            onToggle={() => onChange({ reducedMotion: !settings.reducedMotion })}
          />
        </ul>
      </section>

      <button
        type="button"
        onClick={() => setConfirmReset(true)}
        className="w-full rounded-2xl border-2 border-rose-300 bg-white py-3 font-bold text-rose-700 shadow-sm transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
      >
        Reset all progress
      </button>

      <Modal open={confirmReset} title="Reset all progress?" onClose={() => setConfirmReset(false)}>
        <p className="mb-4 text-sm font-medium text-slate-600">
          Reset all scores, stars, trophies, and progress? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => setConfirmReset(false)}
            className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 font-bold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            Keep my progress
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onReset();
            }}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 font-bold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
          >
            Reset everything
          </button>
        </div>
      </Modal>
    </div>
  );
}
