const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** $106,598 */
export const formatUSD = (n: number) => usd0.format(Math.round(n));

/** $107K */
export const formatUSDCompact = (n: number) => usdCompact.format(n);

/** +$15,990 */
export const formatSignedUSD = (n: number) => `${n >= 0 ? "+" : "−"}${usd0.format(Math.abs(Math.round(n)))}`;

/** 65% */
export const formatPct = (n: number) => `${Math.round(n * 100)}%`;
