"use client";

import { useId, type ReactNode } from "react";
import { focusRing } from "../ui";

type Props = {
  label: string;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ label, description, checked, onChange }: Props) {
  const id = useId();
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
        checked ? "border-brand-200 bg-brand-50/60" : "border-line bg-canvas/50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <span id={`${id}-label`} className="block text-[14px] font-semibold text-ink">
          {label}
        </span>
        {description && (
          <span id={`${id}-desc`} className="mt-1 block text-[12px] leading-relaxed text-muted">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${focusRing} ${
          checked ? "bg-brand-600" : "bg-[#c9cdd3]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
