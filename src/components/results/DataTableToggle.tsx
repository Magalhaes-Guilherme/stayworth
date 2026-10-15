"use client";

import { useId, useState } from "react";
import { focusRing } from "../ui";

type Props = {
  caption: string;
  columns: string[];
  rows: string[][];
};

/** Accessible table view of a chart's data, collapsed by default. */
export function DataTableToggle({ caption, columns, rows }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium text-muted transition-colors hover:text-brand-700 ${focusRing}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path d="M4.5 3 7.5 6l-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {open ? "Hide data table" : "Show data table"}
      </button>
      <div id={id} hidden={!open} className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line text-muted">
              {columns.map((c, i) => (
                <th key={c} scope="col" className={`py-2 font-medium ${i > 0 ? "text-right" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-line-soft last:border-0">
                {r.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="py-1.5 font-medium text-ink-soft">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="py-1.5 text-right text-ink tabular">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
