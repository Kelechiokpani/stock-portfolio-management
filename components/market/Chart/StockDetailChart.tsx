"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Bar,
  ComposedChart,
  CartesianGrid,
} from "recharts";

export default function StockDetailChart({ stock }: { stock: any }) {
  const chartData = useMemo(() => {
    if (!stock) return [];
    const days = 60; // Extended for better visual density
    const basePrice = stock.price || 100;

    return Array.from({ length: days }, (_, i) => {
      const variance = Math.sin(i / 4) * (basePrice * 0.015);
      const randomness = Math.random() * (basePrice * 0.005);
      return {
        time: i % 10 === 0 ? `${10 + i}:00` : "",
        price: parseFloat((basePrice + variance + randomness).toFixed(2)),
        volume: Math.floor(Math.random() * 1000) + 200,
      };
    });
  }, [stock]);

  const isPositive = stock?.changePercent >= 0;
  const accentColor = isPositive ? "#10b981" : "#f43f5e"; // Emerald vs Rose

  return (
    <div className="w-full h-full p-4 md:p-8 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 0, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Institutional Grid Styling */}
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="hsl(var(--border))"
            strokeOpacity={0.4}
          />

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
              fontWeight: 800,
            }}
            dy={15}
          />

          <YAxis
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
              fontWeight: 800,
            }}
            domain={["auto", "auto"]}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />

          <Tooltip
            cursor={{
              stroke: "hsl(var(--foreground))",
              strokeWidth: 1.5,
              strokeDasharray: "5 5",
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/80 backdrop-blur-xl border border-border p-4 rounded-lg shadow-2xl space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Live Execution
                    </p>
                    <p className="text-xl font-black font-mono tracking-tighter">
                      ${payload[0].value?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: accentColor }}
                      />
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        Vol:{" "}
                        <span className="text-foreground">
                          {payload[1]?.value}M
                        </span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Faded Volume Bars in Background */}
          <Bar
            dataKey="volume"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.08}
            barSize={3}
            radius={[2, 2, 0, 0]}
          />

          {/* High-Impact Price Area */}
          <Area
            type="monotone"
            dataKey="price"
            stroke={accentColor}
            strokeWidth={3}
            fill="url(#areaGradient)"
            animationDuration={1200}
            dot={false}
            activeDot={{
              r: 6,
              fill: accentColor,
              stroke: "white",
              strokeWidth: 2,
              className: "shadow-lg",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
