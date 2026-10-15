"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card, CardHeader } from "../ui";
import { CHART, TooltipRow, TooltipShell } from "./ChartTooltip";
import { DataTableToggle } from "./DataTableToggle";
import { formatUSD, formatUSDCompact } from "@/lib/format";
import type { Estimate } from "@/lib/model";

type Row = { month: string; revenue: number };

export function MonthlyChart({ estimate }: { estimate: Estimate }) {
  const narrow = useMediaQuery("(max-width: 520px)");
  const useDynamic = estimate.dynamic.enabled;
  const data: Row[] = estimate.months.map((m) => ({
    month: m.month,
    revenue: useDynamic ? m.withDynamic : m.base,
  }));

  const avg = estimate.annual.averageMonthly;
  const peak = data.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const low = data.reduce((a, b) => (b.revenue < a.revenue ? b : a));

  return (
    <Card className="p-5 sm:p-6" aria-labelledby="monthly-title">
      <CardHeader
        id="monthly-title"
        title="Revenue by month"
        subtitle={
          <>
            Gross revenue across a typical year{useDynamic ? ", with dynamic pricing" : ""}. Summer-weighted
            seasonality.
          </>
        }
      />

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
        <div className="flex gap-1.5">
          <dt className="text-muted">Peak</dt>
          <dd className="font-semibold text-ink tabular">
            {peak.month} · {formatUSD(peak.revenue)}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted">Lowest</dt>
          <dd className="font-semibold text-ink tabular">
            {low.month} · {formatUSD(low.revenue)}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted">Monthly average</dt>
          <dd className="font-semibold text-ink tabular">{formatUSD(avg)}</dd>
        </div>
      </dl>

      <div className="mt-4 h-[240px] w-full sm:h-[260px]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 260 }}>
          <BarChart
            data={data}
            margin={{ top: 12, right: 4, bottom: 0, left: -8 }}
            barCategoryGap="22%"
          >
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART.axis, fontSize: 11 }}
              interval={0}
              tickFormatter={(m: string) => (narrow ? m[0] : m)}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART.axis, fontSize: 11 }}
              tickFormatter={(v: number) => formatUSDCompact(v)}
              width={52}
            />
            <ReferenceLine
              y={avg}
              stroke={CHART.axis}
              strokeDasharray="4 4"
              label={{ value: "avg", position: "insideTopRight", fill: CHART.axis, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: CHART.cursor, radius: 6 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as Row;
                const diff = row.revenue / avg - 1;
                return (
                  <TooltipShell title={row.month}>
                    <TooltipRow swatch={CHART.primary} label="Revenue" value={formatUSD(row.revenue)} />
                    <TooltipRow
                      label="vs. average"
                      value={`${diff >= 0 ? "+" : "−"}${Math.abs(Math.round(diff * 100))}%`}
                    />
                  </TooltipShell>
                );
              }}
            />
            <Bar
              dataKey="revenue"
              fill={CHART.primary}
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: CHART.primaryHover }}
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTableToggle
        caption="Gross revenue by month"
        columns={["Month", "Revenue"]}
        rows={data.map((d) => [d.month, formatUSD(d.revenue)])}
      />
    </Card>
  );
}
