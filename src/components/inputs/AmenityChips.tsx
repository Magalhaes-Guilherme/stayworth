"use client";

import { MODEL, type AmenityId } from "@/lib/config";
import { focusRing } from "../ui";

type Props = {
  selected: AmenityId[];
  onToggle: (id: AmenityId) => void;
};

export function AmenityChips({ selected, onToggle }: Props) {
  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-baseline justify-between text-[13px] font-medium text-ink-soft">
        <span>Amenities</span>
        <span className="text-[12px] font-normal text-muted">{selected.length} selected</span>
      </legend>
      <ul className="flex flex-wrap gap-2">
        {MODEL.amenities.map((a) => {
          const on = selected.includes(a.id);
          return (
            <li key={a.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(a.id)}
                className={`group inline-flex h-9 items-center gap-1.5 rounded-full border pl-2.5 pr-3 text-[13px] font-medium transition-all duration-150 ${focusRing} ${
                  on
                    ? "border-brand-600 bg-brand-600 text-white shadow-[0_1px_2px_rgb(13_118_106/0.25)]"
                    : "border-line bg-surface text-ink-soft hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-4 place-items-center rounded-full transition-colors ${
                    on ? "bg-white/20" : "border border-line group-hover:border-brand-300"
                  }`}
                >
                  {on && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M2.2 5.2 4.2 7.2 7.8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {a.label}
                <span className={`tabular text-[12px] ${on ? "text-white/80" : "text-muted"}`}>+${a.premium}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
