# StayWorth — Vacation rental revenue estimator

A single-page tool that helps a property owner or manager understand **what a vacation rental could earn**. Enter the property's size, market, amenities, expected occupancy and management fee, and the results update live:

- **Estimated annual revenue** (gross) with **net to owner** beneath it
- Key metrics: **ADR**, **RevPAN**, average monthly revenue, occupancy used
- **Revenue by month**: a seasonality chart across the year
- **Base vs. dynamic pricing**: what smart pricing adds, annually and month by month
- **What's driving your rate**: a line-by-line breakdown of the nightly rate
- **Market benchmark**: where the rate sits against a band of similar listings

> **The model is illustrative.** It uses simple, transparent heuristics, not live market data, and is not a real pricing engine. Treat every number as a directional estimate, not a guaranteed projection.

## The model

Every coefficient lives in [`src/lib/config.ts`](src/lib/config.ts), with comments. The calculation itself is a pure function in [`src/lib/model.ts`](src/lib/model.ts).

1. **ADR** = (`$60` base + `$45` × bedrooms + `$8` × beds beyond bedrooms × 2 + amenity premiums) × location multiplier × property-type multiplier. A studio is priced as 1 bedroom.
2. **RevPAN** = ADR × occupancy (30–95%, with Peak / Shoulder / Off-season presets).
3. **Monthly revenue** = RevPAN × 30.4 × that month's seasonality factor. There are 12 summer-weighted factors that average 1.0. **Annual gross** is the sum of the 12 months.
4. **Net to owner** = annual gross × (1 − management fee).
5. **Dynamic pricing**, when on, adds a configurable uplift (default +15%; +12–22% is typical) to gross and net.
6. **Benchmark band** = ADR × 0.85 to ADR × 1.15.

### Worked example

3 bedrooms, 8 beds, Beach / resort, Entire house, with Pool, Hot tub, Ocean view, Full kitchen, AC and WiFi, at 65% occupancy and a 20% fee:

| Step | Value |
| --- | --- |
| Subtotal | 60 + 135 + 16 + 122 = **$333** |
| ADR | 333 × 1.35 = **$449.55** |
| RevPAN | **$292.21** |
| Annual gross | **$106,598** |
| Net to owner | **$85,278** |
| Dynamic pricing | **+$15,990** gross / **+$12,792** net |

The test suite checks these figures (`npm test`).

## Tech

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- [Recharts](https://recharts.org) for charts
- Vitest for model tests
- Fully client-side, with no backend and no external API calls. The page is statically pre-rendered.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # model tests
npm run build   # production build
```

Requires Node.js 20.9 or newer.

## Deploy to Vercel

Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js automatically, so no configuration or environment variables are needed.

## Accessibility notes

- Every control has a visible label and works from the keyboard. Steppers are ARIA spinbuttons that respond to arrow keys, the dynamic-pricing control is a switch, and amenity chips are toggle buttons.
- Animated numbers expose only their final value to screen readers. Motion respects `prefers-reduced-motion`.
- Each chart has a "Show data table" view, and the benchmark gauge has a text description.

---

*Illustrative estimate based on general market heuristics. Not a guaranteed projection.*
