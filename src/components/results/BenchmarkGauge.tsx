"use client";

import { Card, CardHeader } from "../ui";
import { formatUSD } from "@/lib/format";
import type { Estimate } from "@/lib/model";
import { MODEL } from "@/lib/config";

type Props = { estimate: Estimate; marketLabel: string };

export function BenchmarkGauge({ estimate, marketLabel }: Props) {
  const b = estimate.benchmark;
  const pos = (v: number) => ((v - b.scaleMin) / (b.scaleMax - b.scaleMin)) * 100;
  const clampPct = (n: number) => Math.min(100, Math.max(0, n));

  const bandLeft = pos(b.low);
  const bandWidth = pos(b.high) - bandLeft;
  const you = clampPct(pos(b.adr));
  const dyn = clampPct(pos(b.adrWithDynamic));
  const showDynamic = estimate.dynamic.enabled;

  return (
    <Card className="p-5 sm:p-6" aria-labelledby="benchmark-title">
      <CardHeader
        id="benchmark-title"
        title="How your rate compares"
        subtitle={
          <>
            Your estimated nightly rate against a band of similar listings in a{" "}
            <span className="font-medium text-ink-soft">{marketLabel.toLowerCase()}</span> market.
          </>
        }
      />

      <figure className="mt-6">
        <div
          role="img"
          aria-label={`Similar listings range from ${formatUSD(b.low)} to ${formatUSD(b.high)} per night. Your estimate of ${formatUSD(
            b.adr,
          )} sits within that range${showDynamic ? `; with dynamic pricing the effective rate is about ${formatUSD(b.adrWithDynamic)}` : ""}.`}
          className="relative pb-14 pt-9"
        >
          {/* Marker label: your estimate */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-[left] duration-500 ease-out"
            style={{ left: `${you}%` }}
          >
            <span className="block whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-semibold text-white tabular shadow-sm">
              You · {formatUSD(b.adr)}
            </span>
          </div>

          {/* Track */}
          <div className="relative h-3 rounded-full bg-line-soft">
            <div
              className="absolute inset-y-0 rounded-full bg-brand-100 ring-1 ring-inset ring-brand-200 transition-all duration-500"
              style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
            />
            {/* Your estimate */}
            <div
              className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-white transition-[left] duration-500 ease-out"
              style={{ left: `${you}%` }}
            />
            {/* With dynamic pricing */}
            <div
              className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-600 bg-white ring-2 ring-white transition-all duration-500 ease-out ${
                showDynamic ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: `${dyn}%` }}
            />
          </div>

          {/* Band edge labels */}
          <div className="absolute left-0 right-0 top-[3.6rem] text-[12px] text-muted tabular">
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${bandLeft}%` }}>
              {formatUSD(b.low)}
            </span>
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${bandLeft + bandWidth}%` }}
            >
              {formatUSD(b.high)}
            </span>
          </div>
        </div>

        <figcaption className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ink-soft">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-5 rounded-full bg-brand-100 ring-1 ring-inset ring-brand-200" />
            Similar listings (typical range)
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-ink" />
            Your estimate
          </span>
          {showDynamic && (
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-full border-2 border-brand-600 bg-white" />
              With dynamic pricing · {formatUSD(b.adrWithDynamic)} avg.
            </span>
          )}
        </figcaption>
      </figure>

      <p className="mt-4 rounded-lg bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-muted">
        <span className="font-semibold text-ink-soft">Illustrative.</span> The comparison band is modeled as{" "}
        {Math.round(MODEL.benchmark.low * 100)}–{Math.round(MODEL.benchmark.high * 100)}% of your estimate, not drawn
        from live listings data.
      </p>
    </Card>
  );
}
