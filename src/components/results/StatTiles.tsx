"use client";

import { AnimatedNumber } from "../AnimatedNumber";
import { formatPct, formatUSD } from "@/lib/format";
import type { Estimate } from "@/lib/model";

export function StatTiles({ estimate }: { estimate: Estimate }) {
  const bookedNights = Math.round(estimate.occupancy * 365);

  const tiles = [
    {
      label: "Nightly rate (ADR)",
      value: estimate.adr,
      format: formatUSD,
      note: "Average daily rate",
    },
    {
      label: "RevPAN",
      value: estimate.revpan,
      format: formatUSD,
      note: "Revenue per available night",
    },
    {
      label: "Avg. monthly revenue",
      value: estimate.annual.averageMonthly,
      format: formatUSD,
      note: estimate.dynamic.enabled ? "Gross, with dynamic pricing" : "Gross, across the year",
    },
    {
      label: "Occupancy used",
      value: estimate.occupancy,
      format: formatPct,
      note: `≈ ${bookedNights} booked nights / yr`,
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Key metrics">
      {tiles.map((t) => (
        <li
          key={t.label}
          className="rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5"
        >
          <p className="text-[12px] font-medium text-muted">{t.label}</p>
          <p className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
            <AnimatedNumber value={t.value} format={t.format} />
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-faint">{t.note}</p>
        </li>
      ))}
    </ul>
  );
}
