"use client";

import { useCallback, useEffect, useRef } from "react";

type ToneStep = {
  frequency: number;
  /** seconds */
  duration: number;
  /** seconds after play() is called */
  at: number;
  type?: OscillatorType;
  volume?: number;
};

export interface Sounds {
  tap: () => void;
  correct: () => void;
  incorrect: () => void;
  trophy: () => void;
  roundComplete: () => void;
  perfectRound: () => void;
}

/**
 * Lightweight browser-generated tones via the Web Audio API — no audio
 * files. The AudioContext is created lazily on the first play so it always
 * follows a user gesture.
 */
export function useSound(enabled: boolean): Sounds {
  const contextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const play = useCallback((steps: ToneStep[]) => {
    if (!enabledRef.current || typeof window === "undefined") return;
    try {
      contextRef.current ??= new AudioContext();
      const ctx = contextRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      for (const step of steps) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + step.at;
        const volume = step.volume ?? 0.08;
        osc.type = step.type ?? "sine";
        osc.frequency.setValueAtTime(step.frequency, start);
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + step.duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + step.duration);
      }
    } catch {
      // Audio unavailable — the game plays on silently.
    }
  }, []);

  return {
    tap: useCallback(() => play([{ frequency: 440, duration: 0.06, at: 0, type: "triangle" }]), [play]),
    correct: useCallback(
      () =>
        play([
          { frequency: 523, duration: 0.12, at: 0 },
          { frequency: 784, duration: 0.18, at: 0.09 },
        ]),
      [play]
    ),
    incorrect: useCallback(
      () => play([{ frequency: 220, duration: 0.25, at: 0, type: "triangle", volume: 0.05 }]),
      [play]
    ),
    trophy: useCallback(
      () =>
        play([
          { frequency: 523, duration: 0.12, at: 0 },
          { frequency: 659, duration: 0.12, at: 0.1 },
          { frequency: 784, duration: 0.12, at: 0.2 },
          { frequency: 1047, duration: 0.3, at: 0.3 },
        ]),
      [play]
    ),
    roundComplete: useCallback(
      () =>
        play([
          { frequency: 392, duration: 0.15, at: 0 },
          { frequency: 523, duration: 0.25, at: 0.12 },
        ]),
      [play]
    ),
    perfectRound: useCallback(
      () =>
        play([
          { frequency: 523, duration: 0.12, at: 0 },
          { frequency: 659, duration: 0.12, at: 0.1 },
          { frequency: 784, duration: 0.12, at: 0.2 },
          { frequency: 1047, duration: 0.2, at: 0.3 },
          { frequency: 1319, duration: 0.4, at: 0.42 },
        ]),
      [play]
    ),
  };
}
