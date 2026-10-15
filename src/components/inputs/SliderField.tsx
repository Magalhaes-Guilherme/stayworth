"use client";

import { useId, type ReactNode } from "react";

type Props = {
  label: string;
  value: number; // 0–1
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  hint?: ReactNode;
  children?: ReactNode;
};

/** Percentage slider. Value, min and max are fractions (0.65 = 65%). */
export function SliderField({ label, value, min, max, step = 0.01, onChange, hint, children }: Props) {
  const id = useId();
  const pct = Math.round(value * 100);
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
          {label}
        </label>
        <output htmlFor={id} className="text-[15px] font-semibold text-ink tabular">
          {pct}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${pct}%`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      <div className="mt-0.5 flex justify-between text-[11px] text-faint tabular" aria-hidden="true">
        <span>{Math.round(min * 100)}%</span>
        <span>{Math.round(max * 100)}%</span>
      </div>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-[12px] leading-relaxed text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
