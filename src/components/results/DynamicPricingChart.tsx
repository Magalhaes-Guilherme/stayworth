"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card, CardHeader, Pill } from "../ui";
import { AnimatedNumber } from "../AnimatedNumber";
import { CHART, TooltipRow, TooltipShell } from "./ChartTooltip";
import { DataTableToggle } from "./DataTableToggle";
import { formatSignedUSD, formatUSD, formatUSDCompact } from "@/lib/format";
import type { Estimate } from "@/lib/model";
import { MODEL } from "@/lib/config";

type Row = { month: string; base: number; uplift: number; total: number };

export function DynamicPricingChart({ estimate }: { estimate: Estimate }) {
  const narrow = useMediaQuery("(max-width: 520px)");
  const { annual, dynamic } = estimate;
  const [lo, hi] = MODEL.dynamicPricing.typicalRange;

  const data: Row[] = estimate.months.map((m) => ({
    month: m.month,
    base: m.base,
    uplift: m.withDynamic - m.base,
    total: m.withDynamic,
  }));

  const bars = [
    { label: "Base pricing", gross: annual.grossBase, net: annual.netBase, color: CHART.base },
    { label: "With dynamic pricing", gross: annual.grossDynamic, net: annual.netDynamic, color: CHART.primary },
  ];

  return (
    <Card className="p-5 sm:p-6" aria-labelledby="dynamic-title">
      <CardHeader
        id="dynamic-title"
        title="Base vs. dynamic pricing"
        subtitle={`Dynamic pricing raises rates on high-demand nights. Modeled at +${Math.round(
          dynamic.uplift * 100,
        )}% (${Math.round(lo * 100)}–${Math.round(hi * 100)}% is typical).`}
        action={
          <Pill tone={dynamic.enabled ? "brand" : "neutral"}>
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${dynamic.enabled ? "bg-brand-500" : "bg-faint"}`}
            />
            {dynamic.enabled ? "Applied to estimate" : "Not applied"}
          </Pill>
        }
      />

      {/* Annual comparison */}
      <div className="mt-5 space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
              <span className="flex items-center gap-2 font-medium text-ink-soft">
                <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: b.color }} />
                {b.label}
              </span>
              <span className="text-muted">
                <span className="font-semibold text-ink tabular">{formatUSD(b.gross)}</span>
                <span className="hidden sm:inline"> gross · </span>
                <span className="sm:hidden"> · </span>
                <span className="tabular">{formatUSD(b.net)}</span> net
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${(b.gross / annual.grossDynamic) * 100}%`, background: b.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-brand-50 px-4 py-3 text-[13px] text-brand-900">
        <span className="text-[18px] font-bold tracking-[-0.02em]">
          <AnimatedNumber value={dynamic.deltaGross} format={formatSignedUSD} />
          <span className="text-[13px] font-semibold">/yr</span>
        </span>
        <span>
          gross with dynamic pricing ·{" "}
          <span className="font-semibold tabular">{formatSignedUSD(dynamic.deltaNet)}</span> to the owner after fees
        </span>
      </div>

      {/* Monthly stacked area */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-ink-soft">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: CHART.base }} />
          Base revenue
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: CHART.primary }} />
          Dynamic pricing uplift
        </span>
      </div>

      <div className="mt-2 h-[200px] w-full sm:h-[220px]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 220 }}>
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="upliftFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.95} />
                <stop offset="100%" stopColor={CHART.primary} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART.axis, fontSize: 11 }}
              interval={0}
              tickFormatter={(m: string) => (narrow ? m[0] : m)}
              padding={{ left: 10, right: 10 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART.axis, fontSize: 11 }}
              tickFormatter={(v: number) => formatUSDCompact(v)}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: CHART.axis, strokeWidth: 1, strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as Row;
                return (
                  <TooltipShell title={row.month}>
                    <TooltipRow swatch={CHART.base} label="Base" value={formatUSD(row.base)} />
                    <TooltipRow swatch={CHART.primary} label="Uplift" value={formatSignedUSD(row.uplift)} />
                    <TooltipRow label="With dynamic" value={formatUSD(row.total)} strong />
                  </TooltipShell>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="base"
              stackId="rev"
              stroke={CHART.baseStroke}
              strokeWidth={2}
              fill={CHART.base}
              fillOpacity={0.55}
              animationDuration={500}
              activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2, fill: CHART.baseStroke }}
            />
            <Area
              type="monotone"
              dataKey="uplift"
              stackId="rev"
              stroke={CHART.primary}
              strokeWidth={2}
              fill="url(#upliftFill)"
              fillOpacity={1}
              animationDuration={500}
              activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2, fill: CHART.primary }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <DataTableToggle
        caption="Monthly revenue, base vs. dynamic pricing"
        columns={["Month", "Base", "Uplift", "With dynamic"]}
        rows={data.map((d) => [d.month, formatUSD(d.base), formatSignedUSD(d.uplift), formatUSD(d.total)])}
      />
    </Card>
  );
}
