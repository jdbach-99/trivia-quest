interface Props {
  onClick: () => void;
  label?: string;
}

export default function BackButton({ onClick, label = "Back to home" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-xl font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}
