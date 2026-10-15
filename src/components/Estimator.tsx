"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MODEL, type AmenityId } from "@/lib/config";
import { DEFAULT_INPUTS, estimate, type EstimateInputs } from "@/lib/model";
import { formatUSD } from "@/lib/format";
import { Card, focusRing } from "./ui";
import { Stepper } from "./inputs/Stepper";
import { SelectField } from "./inputs/SelectField";
import { AmenityChips } from "./inputs/AmenityChips";
import { SliderField } from "./inputs/SliderField";
import { Toggle } from "./inputs/Toggle";
import { HeroResult } from "./results/HeroResult";
import { StatTiles } from "./results/StatTiles";
import { MonthlyChart } from "./results/MonthlyChart";
import { DynamicPricingChart } from "./results/DynamicPricingChart";
import { RateBreakdown } from "./results/RateBreakdown";
import { BenchmarkGauge } from "./results/BenchmarkGauge";
import { AnimatedNumber } from "./AnimatedNumber";

function SectionLabel({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
      <span className="grid size-5 place-items-center rounded-full bg-brand-50 text-[11px] text-brand-700">{step}</span>
      {children}
    </h3>
  );
}

export function Estimator() {
  const [inputs, setInputs] = useState<EstimateInputs>(DEFAULT_INPUTS);
  const result = useMemo(() => estimate(inputs), [inputs]);

  const set = <K extends keyof EstimateInputs>(key: K, value: EstimateInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (id: AmenityId) =>
    setInputs((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
    }));

  const isDefault = JSON.stringify(inputs) === JSON.stringify(DEFAULT_INPUTS);
  const marketLabel = MODEL.locations.find((l) => l.id === inputs.location)?.label ?? "";
  const guestsPerBed = inputs.guests / Math.max(1, inputs.beds);

  // Mobile: show a compact sticky summary once the hero result scrolls out of view.
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      {/* ---------------- Inputs ---------------- */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card as="aside" aria-labelledby="inputs-title" className="lg:flex lg:max-h-[calc(100dvh-3rem)] lg:flex-col">
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-4 sm:px-6">
            <div>
              <h2 id="inputs-title" className="text-[15px] font-semibold text-ink">
                Your property
              </h2>
              <p className="text-[12px] text-muted">Results update as you go.</p>
            </div>
            <button
              type="button"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              disabled={isDefault}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-0 ${focusRing}`}
            >
              Reset
            </button>
          </div>

          <form
            className="space-y-8 px-5 py-6 sm:px-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Property details"
          >
            <section>
              <SectionLabel step={1}>Size</SectionLabel>
              <div className="grid grid-cols-3 gap-2.5">
                <Stepper
                  label="Bedrooms"
                  value={inputs.bedrooms}
                  {...MODEL.limits.bedrooms}
                  onChange={(v) => set("bedrooms", v)}
                  formatValue={(v) => (v === 0 ? "Studio" : String(v))}
                />
                <Stepper label="Beds" value={inputs.beds} {...MODEL.limits.beds} onChange={(v) => set("beds", v)} />
                <Stepper
                  label="Guests"
                  value={inputs.guests}
                  {...MODEL.limits.guests}
                  onChange={(v) => set("guests", v)}
                />
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-muted" aria-live="polite">
                {guestsPerBed > 2
                  ? "That’s more than 2 guests per bed — double-check sleeping capacity."
                  : result.extraBeds > 0
                    ? `${result.extraBeds} bed${result.extraBeds === 1 ? "" : "s"} above the expected ${
                        Math.max(1, inputs.bedrooms) * MODEL.adr.expectedBedsPerBedroom
                      } add a small premium.`
                    : "Guest capacity is priced through beds, so it doesn’t change the rate on its own."}
              </p>
            </section>

            <section>
              <SectionLabel step={2}>Market</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <SelectField
                  label="Location"
                  value={inputs.location}
                  options={MODEL.locations}
                  onChange={(v) => set("location", v)}
                />
                <SelectField
                  label="Property type"
                  value={inputs.propertyType}
                  options={MODEL.propertyTypes}
                  onChange={(v) => set("propertyType", v)}
                />
              </div>
            </section>

            <section>
              <SectionLabel step={3}>Amenities</SectionLabel>
              <AmenityChips selected={inputs.amenities} onToggle={toggleAmenity} />
            </section>

            <section>
              <SectionLabel step={4}>Demand &amp; costs</SectionLabel>
              <div className="space-y-6">
                <SliderField
                  label="Occupancy"
                  value={inputs.occupancy}
                  min={MODEL.occupancy.min}
                  max={MODEL.occupancy.max}
                  onChange={(v) => set("occupancy", v)}
                  hint={`About ${Math.round(inputs.occupancy * 365)} booked nights a year. Use a preset or fine-tune.`}
                >
                  <div role="group" aria-label="Season presets" className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-canvas p-1">
                    {MODEL.occupancy.presets.map((p) => {
                      const active = Math.abs(inputs.occupancy - p.value) < 0.005;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => set("occupancy", p.value)}
                          className={`rounded-lg px-2 py-2 text-[12.5px] font-medium transition-all ${focusRing} ${
                            active
                              ? "bg-surface text-ink shadow-[0_1px_2px_rgb(15_29_43/0.08),0_0_0_1px_var(--color-line)]"
                              : "text-muted hover:text-ink"
                          }`}
                        >
                          {p.label}
                          <span className="block text-[11px] text-faint tabular sm:ml-1 sm:inline sm:text-[12.5px]">
                            {Math.round(p.value * 100)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </SliderField>

                <SliderField
                  label="Management fee"
                  value={inputs.managementFee}
                  min={MODEL.managementFee.min}
                  max={MODEL.managementFee.max}
                  onChange={(v) => set("managementFee", v)}
                  hint="Share of gross revenue paid to a property manager. Set to 0% if you self-manage."
                />

                <Toggle
                  label="Apply smart / dynamic pricing"
                  checked={inputs.dynamicPricing}
                  onChange={(v) => set("dynamicPricing", v)}
                  description={
                    <>
                      Adjusts nightly rates to demand. Adds{" "}
                      <span className="font-semibold text-ink-soft">
                        +{Math.round(MODEL.dynamicPricing.uplift * 100)}%
                      </span>{" "}
                      to revenue (+{Math.round(MODEL.dynamicPricing.typicalRange[0] * 100)}–
                      {Math.round(MODEL.dynamicPricing.typicalRange[1] * 100)}% typical).
                    </>
                  }
                />
              </div>
            </section>
          </form>
        </Card>
      </div>

      {/* ---------------- Results ---------------- */}
      <div className="min-w-0 space-y-6" aria-label="Estimate results" role="region">
        <HeroResult
          ref={heroRef}
          estimate={result}
          managementFee={inputs.managementFee}
          onToggleDynamic={(v) => set("dynamicPricing", v)}
        />
        <StatTiles estimate={result} />
        <MonthlyChart estimate={result} />
        <DynamicPricingChart estimate={result} />
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <RateBreakdown estimate={result} />
          <BenchmarkGauge estimate={result} marketLabel={marketLabel} />
        </div>
      </div>

      {/* ---------------- Mobile sticky summary ---------------- */}
      <div
        aria-hidden={heroVisible}
        className={`fixed inset-x-3 bottom-3 z-30 transition-all duration-300 lg:hidden ${
          heroVisible ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-900 px-4 py-3 text-white shadow-[var(--shadow-lift)]">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-200">Est. annual gross</p>
            <p className="text-[20px] font-bold leading-tight tracking-[-0.02em]">
              <AnimatedNumber value={result.annual.gross} format={formatUSD} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-brand-200">Net to owner</p>
            <p className="text-[15px] font-semibold">
              <AnimatedNumber value={result.annual.net} format={formatUSD} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
