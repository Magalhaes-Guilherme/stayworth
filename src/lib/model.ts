import {
  MODEL,
  MONTHS,
  type AmenityId,
  type LocationId,
  type PropertyTypeId,
} from "./config";

export type EstimateInputs = {
  bedrooms: number; // 0 = studio
  beds: number;
  guests: number;
  location: LocationId;
  propertyType: PropertyTypeId;
  amenities: AmenityId[];
  occupancy: number; // 0–1
  managementFee: number; // 0–1
  dynamicPricing: boolean;
};

export type BreakdownLine =
  | { kind: "add"; id: string; label: string; detail?: string; amount: number }
  | { kind: "multiply"; id: string; label: string; detail?: string; multiplier: number; amount: number };

export type MonthPoint = {
  month: (typeof MONTHS)[number];
  base: number;
  withDynamic: number;
};

export type Estimate = {
  adr: number;
  revpan: number;
  occupancy: number;
  /** ADR × occupancy × 30.4 — a flat, season-agnostic month. */
  monthlyGrossFlat: number;
  months: MonthPoint[];
  annual: {
    grossBase: number;
    grossDynamic: number;
    netBase: number;
    netDynamic: number;
    /** The figures to headline, respecting the dynamic-pricing toggle. */
    gross: number;
    net: number;
    averageMonthly: number;
  };
  dynamic: {
    enabled: boolean;
    uplift: number;
    deltaGross: number;
    deltaNet: number;
  };
  benchmark: {
    low: number;
    high: number;
    adr: number;
    adrWithDynamic: number;
    scaleMin: number;
    scaleMax: number;
  };
  breakdown: {
    lines: BreakdownLine[];
    subtotal: number;
  };
  extraBeds: number;
};

const findOrThrow = <T extends { id: string }>(list: readonly T[], id: string): T => {
  const item = list.find((x) => x.id === id);
  if (!item) throw new Error(`Unknown option "${id}"`);
  return item;
};

export function estimate(input: EstimateInputs): Estimate {
  const { adr: A } = MODEL;

  /* ---- 1. ADR ------------------------------------------------- */
  const pricedBedrooms = Math.max(1, input.bedrooms); // studio → 1
  const expectedBeds = pricedBedrooms * A.expectedBedsPerBedroom;
  const extraBeds = Math.max(0, input.beds - expectedBeds);

  const lines: BreakdownLine[] = [
    { kind: "add", id: "base", label: "Base nightly rate", amount: A.base },
    {
      kind: "add",
      id: "bedrooms",
      label: input.bedrooms === 0 ? "Studio" : `${input.bedrooms} bedroom${input.bedrooms === 1 ? "" : "s"}`,
      detail: `${pricedBedrooms} × $${A.perBedroom}${input.bedrooms === 0 ? " (priced as 1 bedroom)" : ""}`,
      amount: pricedBedrooms * A.perBedroom,
    },
  ];

  if (extraBeds > 0) {
    lines.push({
      kind: "add",
      id: "beds",
      label: `${extraBeds} extra bed${extraBeds === 1 ? "" : "s"}`,
      detail: `Beyond ${expectedBeds} expected · ${extraBeds} × $${A.perExtraBed}`,
      amount: extraBeds * A.perExtraBed,
    });
  }

  for (const amenity of MODEL.amenities) {
    if (input.amenities.includes(amenity.id)) {
      lines.push({ kind: "add", id: amenity.id, label: amenity.label, amount: amenity.premium });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  const location = findOrThrow(MODEL.locations, input.location);
  const propertyType = findOrThrow(MODEL.propertyTypes, input.propertyType);

  const afterLocation = subtotal * location.multiplier;
  const adr = afterLocation * propertyType.multiplier;

  lines.push(
    {
      kind: "multiply",
      id: "location",
      label: location.label,
      detail: "Location multiplier",
      multiplier: location.multiplier,
      amount: afterLocation - subtotal,
    },
    {
      kind: "multiply",
      id: "type",
      label: propertyType.label,
      detail: "Property-type multiplier",
      multiplier: propertyType.multiplier,
      amount: adr - afterLocation,
    },
  );

  /* ---- 2–3. Occupancy & revenue ------------------------------- */
  const occupancy = clamp(input.occupancy, MODEL.occupancy.min, MODEL.occupancy.max);
  const revpan = adr * occupancy;
  const monthlyGrossFlat = revpan * MODEL.daysPerMonth;

  const uplift = MODEL.dynamicPricing.uplift;
  const months: MonthPoint[] = MONTHS.map((month, i) => {
    const base = monthlyGrossFlat * MODEL.seasonality[i];
    return { month, base, withDynamic: base * (1 + uplift) };
  });

  const grossBase = months.reduce((sum, m) => sum + m.base, 0);
  const grossDynamic = grossBase * (1 + uplift);
  const keep = 1 - clamp(input.managementFee, 0, 1);
  const netBase = grossBase * keep;
  const netDynamic = grossDynamic * keep;

  const gross = input.dynamicPricing ? grossDynamic : grossBase;
  const net = input.dynamicPricing ? netDynamic : netBase;

  /* ---- 5. Benchmark ------------------------------------------- */
  const B = MODEL.benchmark;

  return {
    adr,
    revpan,
    occupancy,
    monthlyGrossFlat,
    months,
    annual: { grossBase, grossDynamic, netBase, netDynamic, gross, net, averageMonthly: gross / 12 },
    dynamic: {
      enabled: input.dynamicPricing,
      uplift,
      deltaGross: grossDynamic - grossBase,
      deltaNet: netDynamic - netBase,
    },
    benchmark: {
      low: adr * B.low,
      high: adr * B.high,
      adr,
      adrWithDynamic: adr * (1 + uplift),
      scaleMin: adr * B.scaleMin,
      scaleMax: adr * B.scaleMax,
    },
    breakdown: { lines, subtotal },
    extraBeds,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const DEFAULT_INPUTS: EstimateInputs = {
  bedrooms: 3,
  beds: 8,
  guests: 8,
  location: "beach",
  propertyType: "house",
  amenities: ["pool", "hotTub", "view", "kitchen", "ac", "wifi"],
  occupancy: MODEL.occupancy.default,
  managementFee: MODEL.managementFee.default,
  dynamicPricing: false,
};
