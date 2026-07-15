interface Props {
  value: number;
  max: number;
  label: string;
  barClassName?: string;
  trackClassName?: string;
  heightClassName?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  barClassName = "bg-sky-500",
  trackClassName = "bg-slate-200",
  heightClassName = "h-3",
}: Props) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full ${heightClassName} ${trackClassName}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
