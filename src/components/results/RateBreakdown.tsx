"use client";

import { Card, CardHeader } from "../ui";
import { AnimatedNumber } from "../AnimatedNumber";
import { formatUSD } from "@/lib/format";
import type { BreakdownLine, Estimate } from "@/lib/model";

const signed = (n: number) => `${n < 0 ? "−" : "+"}${formatUSD(Math.abs(n))}`;

function Line({ line, adr }: { line: BreakdownLine; adr: number }) {
  const share = Math.min(100, (Math.abs(line.amount) / adr) * 100);
  const negative = line.amount < 0;

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-x-4 py-2.5">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
          <span className="truncate">{line.label}</span>
          {line.kind === "multiply" && (
            <span className="shrink-0 rounded-md bg-canvas px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft tabular">
              ×{line.multiplier.toFixed(2)}
            </span>
          )}
        </p>
        {line.detail && <p className="mt-0.5 truncate text-[12px] text-muted">{line.detail}</p>}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-line-soft" aria-hidden="true">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${
              negative ? "bg-faint" : line.kind === "multiply" ? "bg-brand-400" : "bg-brand-600"
            }`}
            style={{ width: `${share}%` }}
          />
        </div>
      </div>
      <p className={`text-right text-[14px] font-semibold tabular ${negative ? "text-muted" : "text-ink"}`}>
        {line.kind === "multiply" && line.multiplier === 1 ? (
          <span className="font-medium text-faint">No change</span>
        ) : (
          signed(line.amount)
        )}
      </p>
    </li>
  );
}

export function RateBreakdown({ estimate }: { estimate: Estimate }) {
  const { lines, subtotal } = estimate.breakdown;
  const additive = lines.filter((l) => l.kind === "add");
  const multipliers = lines.filter((l) => l.kind === "multiply");

  return (
    <Card className="p-5 sm:p-6" aria-labelledby="breakdown-title">
      <CardHeader
        id="breakdown-title"
        title="What’s driving your rate"
        subtitle="Every dollar of the nightly estimate, line by line. Additions first, then market multipliers."
      />

      <ul className="mt-4 divide-y divide-line-soft">
        {additive.map((l) => (
          <Line key={l.id} line={l} adr={estimate.adr} />
        ))}
      </ul>

      <div className="my-1 flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-[13px]">
        <span className="font-medium text-ink-soft">Subtotal before multipliers</span>
        <span className="font-semibold text-ink tabular">{formatUSD(subtotal)}</span>
      </div>

      <ul className="divide-y divide-line-soft">
        {multipliers.map((l) => (
          <Line key={l.id} line={l} adr={estimate.adr} />
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-4">
        <span className="text-[14px] font-semibold text-ink">Estimated nightly rate (ADR)</span>
        <span className="text-[20px] font-bold tracking-[-0.02em] text-brand-700">
          <AnimatedNumber value={estimate.adr} format={formatUSD} />
        </span>
      </div>
    </Card>
  );
}
