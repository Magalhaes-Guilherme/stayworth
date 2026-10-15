"use client";

import { useId } from "react";

type Option = { id: string; label: string; multiplier: number };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly Option[];
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({ label, value, options, onChange }: Props<T>) {
  const id = useId();
  const selected = options.find((o) => o.id === value);

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          aria-describedby={`${id}-hint`}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface pl-3.5 pr-10 text-[15px] font-medium text-ink transition-colors hover:border-faint focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <path d="M3.5 5.5 7 9l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-muted">
        Rate multiplier <span className="font-semibold text-ink-soft tabular">×{selected?.multiplier.toFixed(2)}</span>
      </p>
    </div>
  );
}
