"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoundState } from "@/types/game";
import type { Sounds } from "@/hooks/useSound";
import { FEEDBACK_MS, FEEDBACK_WITH_EXPLANATION_MS, TIMER_SECONDS } from "@/lib/constants";
import { questionScore } from "@/lib/scoring";
import { categoryStyle } from "@/lib/categoryStyle";
import AnswerButton, { type AnswerState } from "./AnswerButton";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";

interface Props {
  initialRound: RoundState;
  timerEnabled: boolean;
  sounds: Sounds;
  onComplete: (round: RoundState) => void;
  onQuit: () => void;
}

type Phase = "answering" | "feedback";

export default function QuestionScreen({ initialRound, timerEnabled, sounds, onComplete, onQuit }: Props) {
  const [round, setRound] = useState(initialRound);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selected, setSelected] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [remainingMs, setRemainingMs] = useState(TIMER_SECONDS * 1000);
  const [confirmQuit, setConfirmQuit] = useState(false);

  // Refs mirror state so timer callbacks and key handlers never act on
  // stale closures — the guards below are what prevent double-scoring.
  const roundRef = useRef(round);
  const phaseRef = useRef<Phase>("answering");
  const doneRef = useRef(false);
  const deadlineRef = useRef(0);
  const confirmQuitRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    confirmQuitRef.current = confirmQuit;
  }, [confirmQuit]);

  const question = round.questions[round.currentQuestionIndex];
  const total = round.questions.length;
  const style = categoryStyle(question.category);

  const advance = useCallback(() => {
    if (phaseRef.current !== "feedback" || doneRef.current) return;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    const current = roundRef.current;
    if (current.currentQuestionIndex >= current.questions.length - 1) {
      doneRef.current = true;
      onComplete(current);
      return;
    }
    phaseRef.current = "answering";
    setPhase("answering");
    setSelected(null);
    setTimedOut(false);
    setLastPoints(0);
    setRemainingMs(TIMER_SECONDS * 1000);
    const next = { ...current, currentQuestionIndex: current.currentQuestionIndex + 1 };
    roundRef.current = next;
    setRound(next);
  }, [onComplete]);

  const handleAnswer = useCallback(
    (answer: string | null) => {
      if (phaseRef.current !== "answering" || doneRef.current) return;
      phaseRef.current = "feedback";
      const current = roundRef.current;
      const q = current.questions[current.currentQuestionIndex];
      const secondsLeft = timerEnabled
        ? Math.max(0, Math.floor((deadlineRef.current - Date.now()) / 1000))
        : 0;
      const correct = answer !== null && answer === q.correctAnswer;
      const streak = correct ? current.currentStreak + 1 : 0;
      const points = correct ? questionScore(secondsLeft, streak) : 0;
      const updated: RoundState = {
        ...current,
        score: current.score + points,
        correctCount: current.correctCount + (correct ? 1 : 0),
        currentStreak: streak,
        bestStreak: Math.max(current.bestStreak, streak),
        answers: [
          ...current.answers,
          {
            questionId: q.id,
            category: q.category,
            selectedAnswer: answer,
            correct,
            pointsEarned: points,
          },
        ],
      };
      roundRef.current = updated;
      setRound(updated);
      setSelected(answer);
      setTimedOut(answer === null);
      setLastPoints(points);
      setPhase("feedback");
      if (correct) sounds.correct();
      else sounds.incorrect();
      advanceTimerRef.current = setTimeout(
        advance,
        q.explanation ? FEEDBACK_WITH_EXPLANATION_MS : FEEDBACK_MS
      );
    },
    [advance, sounds, timerEnabled]
  );

  const handleAnswerRef = useRef(handleAnswer);
  const advanceRef = useRef(advance);
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
    advanceRef.current = advance;
  }, [handleAnswer, advance]);

  // Question timer. Restarts per question; pauses while the quit dialog is
  // open. Ticks at 100ms so the bar drains smoothly; `remainingMs` is reset
  // in advance() so the effect body stays setState-free.
  useEffect(() => {
    if (!timerEnabled) return;
    deadlineRef.current = Date.now() + TIMER_SECONDS * 1000;
    const interval = setInterval(() => {
      if (phaseRef.current !== "answering") return;
      if (confirmQuitRef.current) {
        deadlineRef.current += 100;
        return;
      }
      const ms = Math.max(0, deadlineRef.current - Date.now());
      setRemainingMs(ms);
      if (ms <= 0) {
        clearInterval(interval);
        handleAnswerRef.current(null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [round.currentQuestionIndex, timerEnabled]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Keyboard: 1-4 answer, Enter/Space continue.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || confirmQuitRef.current) return;
      if (phaseRef.current === "answering" && ["1", "2", "3", "4"].includes(e.key)) {
        const current = roundRef.current;
        const q = current.questions[current.currentQuestionIndex];
        const answer = q.answers[Number(e.key) - 1];
        if (answer) handleAnswerRef.current(answer);
      } else if (phaseRef.current === "feedback" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        advanceRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const answerState = (answer: string): AnswerState => {
    if (phase === "answering") return "idle";
    if (answer === question.correctAnswer) return "correct";
    if (answer === selected) return "incorrect";
    return "dimmed";
  };

  const correct = selected !== null && selected === question.correctAnswer;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const timerUrgent = timerEnabled && remainingMs <= 5000 && phase === "answering";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setConfirmQuit(true)}
          aria-label="Exit round"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <span aria-hidden="true">✕</span>
        </button>
        <span className={`min-w-0 truncate rounded-full px-3 py-1 text-xs font-bold ${style.chip}`}>
          {style.emoji} {question.category}
          {question.subcategory && ` · ${question.subcategory}`}
        </span>
        <span className="text-sm font-bold text-slate-600">
          {round.currentQuestionIndex + 1} / {total}
        </span>
      </div>

      <ProgressBar
        value={round.currentQuestionIndex + (phase === "feedback" ? 1 : 0)}
        max={total}
        label={`Round progress: question ${round.currentQuestionIndex + 1} of ${total}`}
        barClassName="bg-violet-500"
        heightClassName="h-2"
      />

      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-slate-700">
          Score: <span className="text-sky-600">{round.score}</span>
        </span>
        <span className="text-slate-700" aria-label={`Current streak: ${round.currentStreak}`}>
          {round.currentStreak >= 2 ? "🔥" : "streak"} ×{round.currentStreak}
        </span>
      </div>

      {timerEnabled && (
        <div>
          <ProgressBar
            value={remainingMs / 1000}
            max={TIMER_SECONDS}
            label={`Time remaining: ${remainingSeconds} seconds`}
            barClassName={timerUrgent ? "timer-urgent bg-rose-500" : "bg-emerald-500"}
            heightClassName="h-2"
          />
          <p
            className={`mt-1 text-right text-xs font-bold ${
              timerUrgent ? "text-rose-600" : "text-slate-500"
            }`}
            aria-hidden="true"
          >
            {remainingSeconds}s
          </p>
        </div>
      )}

      <h2 className="min-h-16 rounded-3xl border-2 border-slate-200 bg-white p-4 text-lg font-bold leading-snug text-slate-900 shadow-sm">
        {question.question}
      </h2>

      <div className="flex flex-col gap-2.5" role="group" aria-label="Answer choices">
        {question.answers.map((answer) => (
          <AnswerButton
            key={answer}
            text={answer}
            state={answerState(answer)}
            disabled={phase !== "answering"}
            onClick={() => handleAnswer(answer)}
          />
        ))}
      </div>

      {phase === "feedback" && (
        <div
          role="status"
          className={`pop-in flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
            correct ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          <div className="min-w-0">
            <p className={`font-extrabold ${correct ? "text-emerald-800" : "text-amber-900"}`}>
              {correct
                ? `Correct! +${lastPoints}`
                : timedOut
                  ? "⏰ Time's up!"
                  : "Good try!"}
              {correct && round.currentStreak >= 3 && (
                <span className="ml-2">🔥 {round.currentStreak} in a row!</span>
              )}
            </p>
            {question.explanation && (
              <p className="mt-1 text-sm font-medium text-slate-700">{question.explanation}</p>
            )}
          </div>
          <button
            type="button"
            onClick={advance}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 font-bold text-white shadow transition hover:bg-slate-700 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            Next →
          </button>
        </div>
      )}

      <Modal open={confirmQuit} title="Leave this round?" onClose={() => setConfirmQuit(false)}>
        <p className="mb-4 text-sm font-medium text-slate-600">
          Your progress in this round won&apos;t be saved.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => setConfirmQuit(false)}
            className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 font-bold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            Keep playing
          </button>
          <button
            type="button"
            onClick={onQuit}
            className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            Exit
          </button>
        </div>
      </Modal>
    </div>
  );
}
