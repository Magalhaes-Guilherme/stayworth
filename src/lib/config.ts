/**
 * StayWorth — model configuration
 * ------------------------------------------------------------------
 * Every coefficient the estimator uses lives in this file. Change a number
 * here and the whole app (UI, charts, breakdown, tests) follows.
 *
 * These are illustrative heuristics chosen to produce plausible numbers for
 * a US vacation rental. They are NOT derived from live market data.
 */

export const MODEL = {
  /* ---------------------------------------------------------------
   * 1. Average Daily Rate (ADR), USD
   * ------------------------------------------------------------- */
  adr: {
    /** Starting nightly rate for any listing, before size or amenities. */
    base: 60,

    /** Added per bedroom. A studio (0 bedrooms) is priced as 1 bedroom. */
    perBedroom: 45,

    /**
     * Expected beds per bedroom. Beds above (bedrooms × this) are "extra"
     * sleeping capacity and earn a small premium each.
     */
    expectedBedsPerBedroom: 2,

    /** Added per bed beyond the expected count. */
    perExtraBed: 8,
  },

  /* ---------------------------------------------------------------
   * Amenity premiums — flat USD added to the nightly rate, before
   * the location and property-type multipliers are applied.
   * ------------------------------------------------------------- */
  amenities: [
    { id: "pool", label: "Pool", premium: 35 },
    { id: "hotTub", label: "Hot tub", premium: 25 },
    { id: "view", label: "Ocean / lake view", premium: 30 },
    { id: "kitchen", label: "Full kitchen", premium: 12 },
    { id: "ac", label: "Air conditioning", premium: 10 },
    { id: "wifi", label: "Fast WiFi / workspace", premium: 10 },
    { id: "ev", label: "EV charger", premium: 10 },
    { id: "parking", label: "Free parking", premium: 8 },
    { id: "pets", label: "Pet-friendly", premium: 15 },
  ],

  /* ---------------------------------------------------------------
   * Multipliers applied to the (base + size + amenities) subtotal,
   * in this order: location first, then property type.
   * ------------------------------------------------------------- */
  locations: [
    { id: "urban", label: "Urban prime", multiplier: 1.4 },
    { id: "beach", label: "Beach / resort", multiplier: 1.35 },
    { id: "mountain", label: "Mountain / lake", multiplier: 1.25 },
    { id: "suburban", label: "Suburban", multiplier: 1.0 },
    { id: "rural", label: "Rural", multiplier: 0.85 },
  ],

  propertyTypes: [
    { id: "villa", label: "Luxury villa", multiplier: 1.5 },
    { id: "cabin", label: "Cabin", multiplier: 1.05 },
    { id: "house", label: "Entire house", multiplier: 1.0 },
    { id: "apartment", label: "Apartment / condo", multiplier: 0.95 },
  ],

  /* ---------------------------------------------------------------
   * 2. Occupancy (share of available nights that are booked)
   * ------------------------------------------------------------- */
  occupancy: {
    min: 0.3,
    max: 0.95,
    default: 0.65,
    presets: [
      { id: "peak", label: "Peak", value: 0.85 },
      { id: "shoulder", label: "Shoulder", value: 0.65 },
      { id: "off", label: "Off-season", value: 0.45 },
    ],
  },

  /* ---------------------------------------------------------------
   * 3. Revenue roll-up
   * ------------------------------------------------------------- */
  /** Average days per month (365 / 12, rounded). */
  daysPerMonth: 30.4,

  /**
   * Monthly revenue multipliers, Jan → Dec. Summer-weighted for a typical
   * Northern-Hemisphere leisure market. Each value blends rate and demand
   * swings for that month. The 12 values sum to 12.0 (average 1.0), so the
   * annual total equals RevPAN × 30.4 × 12 and the curve only redistributes
   * revenue across the year. Keep the average at 1.0 if you edit them.
   */
  seasonality: [0.7, 0.75, 0.85, 0.95, 1.05, 1.25, 1.4, 1.4, 1.1, 0.95, 0.8, 0.8],

  /** Share of gross revenue kept by a property manager. */
  managementFee: {
    min: 0,
    max: 0.4,
    default: 0.2,
  },

  /* ---------------------------------------------------------------
   * 4. Dynamic (smart) pricing
   * ------------------------------------------------------------- */
  dynamicPricing: {
    /** Uplift applied to annual gross (and therefore net) when enabled. */
    uplift: 0.15,
    /** Typical range shown to the user as context. */
    typicalRange: [0.12, 0.22] as const,
  },

  /* ---------------------------------------------------------------
   * 5. Market benchmark — "similar listings" ADR band
   * ------------------------------------------------------------- */
  benchmark: {
    /** Band = ADR × low … ADR × high. */
    low: 0.85,
    high: 1.15,
    /** Visible scale of the gauge, as a share of ADR (wider than the band). */
    scaleMin: 0.6,
    scaleMax: 1.4,
  },

  /* ---------------------------------------------------------------
   * Input limits for the property steppers
   * ------------------------------------------------------------- */
  limits: {
    bedrooms: { min: 0, max: 10 }, // 0 = studio
    beds: { min: 1, max: 24 },
    guests: { min: 1, max: 30 },
  },
} as const;

export type AmenityId = (typeof MODEL.amenities)[number]["id"];
export type LocationId = (typeof MODEL.locations)[number]["id"];
export type PropertyTypeId = (typeof MODEL.propertyTypes)[number]["id"];

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;
