import { describe, expect, it } from "vitest";
import { MODEL } from "./config";
import { DEFAULT_INPUTS, estimate } from "./model";

describe("estimate — worked example", () => {
  // 3 BR, 8 beds, Beach/resort, Entire house, Pool + Hot tub + View +
  // Kitchen + AC + WiFi, 65% occupancy, 20% management fee.
  const result = estimate(DEFAULT_INPUTS);

  it("builds the ADR subtotal from base + bedrooms + extra beds + amenities", () => {
    // 60 + 135 + 16 + 122
    expect(result.breakdown.subtotal).toBe(333);
    expect(result.extraBeds).toBe(2);
  });

  it("applies the beach multiplier to land at ~$449 ADR", () => {
    expect(result.adr).toBeCloseTo(449.55, 2);
  });

  it("derives RevPAN of ~$292", () => {
    expect(result.revpan).toBeCloseTo(292.21, 1);
  });

  it("lands annual gross near $107k and net near $85k", () => {
    expect(result.annual.grossBase).toBeGreaterThan(105_000);
    expect(result.annual.grossBase).toBeLessThan(108_000);
    expect(result.annual.netBase).toBeGreaterThan(84_000);
    expect(result.annual.netBase).toBeLessThan(86_500);
  });

  it("breakdown lines add up to the ADR", () => {
    const total = result.breakdown.lines.reduce((s, l) => s + l.amount, 0);
    expect(total).toBeCloseTo(result.adr, 6);
  });
});

describe("estimate — rules", () => {
  it("prices a studio as one bedroom", () => {
    const studio = estimate({ ...DEFAULT_INPUTS, bedrooms: 0, beds: 1, amenities: [] });
    const oneBr = estimate({ ...DEFAULT_INPUTS, bedrooms: 1, beds: 1, amenities: [] });
    expect(studio.adr).toBe(oneBr.adr);
  });

  it("only charges for beds beyond bedrooms × 2", () => {
    expect(estimate({ ...DEFAULT_INPUTS, bedrooms: 2, beds: 4 }).extraBeds).toBe(0);
    expect(estimate({ ...DEFAULT_INPUTS, bedrooms: 2, beds: 7 }).extraBeds).toBe(3);
  });

  it("applies the dynamic-pricing uplift to gross and net", () => {
    const off = estimate(DEFAULT_INPUTS);
    const on = estimate({ ...DEFAULT_INPUTS, dynamicPricing: true });
    expect(on.annual.gross).toBeCloseTo(off.annual.gross * (1 + MODEL.dynamicPricing.uplift), 6);
    expect(on.annual.net).toBeCloseTo(off.annual.net * (1 + MODEL.dynamicPricing.uplift), 6);
    expect(on.dynamic.deltaGross).toBeCloseTo(on.annual.gross - off.annual.gross, 6);
  });

  it("keeps the seasonality curve averaging 1.0", () => {
    const sum = MODEL.seasonality.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(12, 6);
  });

  it("centers the benchmark band on the estimate", () => {
    const { benchmark } = estimate(DEFAULT_INPUTS);
    expect((benchmark.low + benchmark.high) / 2).toBeCloseTo(benchmark.adr, 6);
  });
});
