import type { ReactNode } from "react";

/** Shared tooltip shell so both charts read as one system. */
export function TooltipShell({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-[168px] rounded-xl border border-line bg-surface px-3.5 py-3 text-[12px] shadow-[var(--shadow-lift)]">
      <p className="mb-2 text-[12px] font-semibold text-ink">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function TooltipRow({
  swatch,
  label,
  value,
  strong,
}: {
  swatch?: string;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "border-t border-line-soft pt-1.5" : ""}`}>
      <span className="flex items-center gap-2 text-muted">
        {swatch && <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: swatch }} />}
        {label}
      </span>
      <span className={`tabular ${strong ? "font-semibold text-ink" : "font-medium text-ink-soft"}`}>{value}</span>
    </div>
  );
}

export const CHART = {
  primary: "#0d766a", // brand-600
  primaryHover: "#0b5f56", // brand-700
  base: "#77c5b7", // brand-300
  baseStroke: "#3fa694", // brand-400
  grid: "#efede8",
  axis: "#8a93a0",
  cursor: "#eef8f6",
};
