"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const gain = payload[0].payload.totalGain;
    const isPositive = gain >= 0;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-2xl rounded-xl ring-1 ring-black/5">
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">
          Snapshot: {label}
        </p>
        <div className="space-y-1">
          <p className="text-2xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
            €{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              }`}
            >
              {isPositive ? "+" : "-"}€{Math.abs(gain).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {isPositive ? "Growth" : "Drawdown"}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function InvestmentHoldingsChart({ holding }: { holding: any }) {
  const chartData = useMemo(() => {
    // If we are on a specific asset page, we use that holding's history directly
    if (!holding || !holding.performanceHistory) return [];

    return holding.performanceHistory.map((ph: any) => ({
      // Formatting date to professional "DD MMM" uppercase format
      date: new Date(ph.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
        .toUpperCase(),
      totalValue: ph.value,
      totalGain: ph.gain,
    }));
  }, [holding]);

  if (!chartData.length)
    return (
      <div className="h-[350px] flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
        <Activity className="w-5 h-5 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
          Synchronizing Asset History...
        </p>
      </div>
    );

  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="currentColor"
                stopOpacity={0.15}
                className="text-slate-900 dark:text-white"
              />
              <stop
                offset="95%"
                stopColor="currentColor"
                stopOpacity={0}
                className="text-slate-900 dark:text-white"
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="currentColor"
            strokeDasharray="0"
            className="text-slate-100 dark:text-slate-800"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "currentColor", fontSize: 9, fontWeight: 800 }}
            className="text-slate-400"
            minTickGap={40}
            dy={15}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "currentColor", fontSize: 9, fontWeight: 800 }}
            className="text-slate-400"
            tickFormatter={(val) =>
              `€${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`
            }
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "currentColor",
              strokeWidth: 2,
              className: "text-slate-200 dark:text-slate-700",
            }}
            wrapperStyle={{ outline: "none" }}
          />

          <Area
            type="stepAfter"
            dataKey="totalValue"
            stroke="currentColor"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#chartGradient)"
            className="text-slate-900 dark:text-white"
            animationDuration={2000}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              className:
                "text-white dark:text-slate-900 fill-slate-900 dark:fill-white",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
