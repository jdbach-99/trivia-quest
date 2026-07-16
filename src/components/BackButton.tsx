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
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-navy-700 bg-navy-800 text-xl font-bold text-slate-300 shadow-sm transition hover:border-navy-500 hover:bg-navy-700 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70"
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}
