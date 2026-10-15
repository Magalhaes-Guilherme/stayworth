"use client";

import { forwardRef } from "react";
import { AnimatedNumber } from "../AnimatedNumber";
import { formatPct, formatSignedUSD, formatUSD } from "@/lib/format";
import type { Estimate } from "@/lib/model";
import { MODEL } from "@/lib/config";

type Props = {
  estimate: Estimate;
  managementFee: number;
  onToggleDynamic: (on: boolean) => void;
};

export const HeroResult = forwardRef<HTMLElement, Props>(function HeroResult(
  { estimate, managementFee, onToggleDynamic },
  ref,
) {
  const { annual, dynamic } = estimate;
  const [lo, hi] = MODEL.dynamicPricing.typicalRange;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-2xl bg-brand-900 p-6 text-white shadow-[var(--shadow-lift)] sm:p-8"
    >
      {/* soft light wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-brand-400/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="hero-title" className="text-[13px] font-medium uppercase tracking-[0.08em] text-brand-100">
            Estimated annual revenue
          </h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-brand-50">Gross</span>
        </div>

        <p className="mt-3 text-[44px] font-bold leading-none tracking-[-0.03em] sm:text-[60px]">
          <AnimatedNumber value={annual.gross} format={formatUSD} />
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <p className="text-[12px] font-medium text-brand-200">Net to owner</p>
            <p className="mt-0.5 text-[24px] font-semibold tracking-[-0.02em]">
              <AnimatedNumber value={annual.net} format={formatUSD} />
            </p>
          </div>
          <p className="pb-1 text-[13px] text-brand-200">
            after {formatPct(managementFee)} management fee
            {managementFee > 0 && (
              <>
                {" "}
                · <span className="tabular">{formatUSD(annual.gross - annual.net)}</span>/yr
              </>
            )}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {dynamic.enabled ? (
            <p className="flex items-start gap-2.5 text-[14px] text-brand-50">
              <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-400 text-brand-900">
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2.2 5.2 4.2 7.2 7.8 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                Includes{" "}
                <strong className="font-semibold text-white">
                  <AnimatedNumber value={dynamic.deltaGross} format={formatSignedUSD} />/yr
                </strong>{" "}
                from dynamic pricing{" "}
                <span className="text-brand-200">
                  ({formatSignedUSD(dynamic.deltaNet)} net)
                </span>
              </span>
            </p>
          ) : (
            <p className="text-[14px] text-brand-50">
              <strong className="font-semibold text-white">
                <AnimatedNumber value={dynamic.deltaGross} format={formatSignedUSD} />/yr
              </strong>{" "}
              possible with dynamic pricing{" "}
              <span className="text-brand-200">
                (+{Math.round(dynamic.uplift * 100)}% · {Math.round(lo * 100)}–{Math.round(hi * 100)}% typical)
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={() => onToggleDynamic(!dynamic.enabled)}
            aria-pressed={dynamic.enabled}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-white px-4 text-[13px] font-semibold text-brand-900 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
          >
            {dynamic.enabled ? "Remove dynamic pricing" : "Apply dynamic pricing"}
          </button>
        </div>
      </div>
    </section>
  );
});
