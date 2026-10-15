"use client";

import { useId } from "react";
import { focusRing } from "../ui";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Optional display override, e.g. 0 → "Studio". */
  formatValue?: (value: number) => string;
};

export function Stepper({ label, value, min, max, onChange, formatValue }: Props) {
  const id = useId();
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));
  const shown = formatValue ? formatValue(value) : String(value);

  const btn = `grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100 disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent ${focusRing}`;

  return (
    <div className="min-w-0">
      <span id={`${id}-label`} className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-1 transition-colors focus-within:border-brand-400">
        <button
          type="button"
          className={btn}
          onClick={() => set(value - 1)}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div
          role="spinbutton"
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={shown}
          onKeyDown={(e) => {
            const map: Record<string, number> = {
              ArrowUp: value + 1,
              ArrowRight: value + 1,
              ArrowDown: value - 1,
              ArrowLeft: value - 1,
              Home: min,
              End: max,
            };
            if (e.key in map) {
              e.preventDefault();
              set(map[e.key]);
            }
          }}
          className={`min-w-0 flex-1 truncate rounded-md px-1 text-center text-[15px] font-semibold text-ink tabular ${focusRing}`}
        >
          {shown}
        </div>
        <button
          type="button"
          className={btn}
          onClick={() => set(value + 1)}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
