export type AnswerState = "idle" | "correct" | "incorrect" | "dimmed";

interface Props {
  text: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

const STATE_CLASSES: Record<AnswerState, string> = {
  idle: "border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50 active:scale-[0.98]",
  correct: "border-emerald-500 bg-emerald-100 text-emerald-900",
  incorrect: "border-rose-500 bg-rose-100 text-rose-900",
  dimmed: "border-slate-200 bg-white opacity-50",
};

const STATE_ICON: Record<AnswerState, string | null> = {
  idle: null,
  correct: "✓",
  incorrect: "✗",
  dimmed: null,
};

export default function AnswerButton({ text, state, disabled, onClick }: Props) {
  const icon = STATE_ICON[state];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        state === "correct" ? `${text} — correct answer` : state === "incorrect" ? `${text} — incorrect` : text
      }
      className={`flex min-h-[52px] w-full items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${STATE_CLASSES[state]}`}
    >
      <span className="min-w-0 break-words">{text}</span>
      {icon && (
        <span aria-hidden="true" className="shrink-0 text-xl font-bold">
          {icon}
        </span>
      )}
    </button>
  );
}
