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
        const days = 40;
        const basePrice = stock.price;
        return Array.from({ length: days }, (_, i) => ({
            // Show few labels to keep it clean like the reference
            date: i === 5 ? "Jan 12" : i === 20 ? "Jan 26" : i === 35 ? "Feb 9" : "",
            price: basePrice + Math.sin(i / 5) * 8 + (i * 0.5),
            volume: Math.random() * 5 + 2,
        }));
    }, [stock]);

    const isPositive = stock.changePercent >= 0;

    // We use CSS variables for the line color so it's consistent with your UI theme
    const chartLineColor = isPositive ? "var(--chart-2, #22c55e)" : "var(--chart-5, #ef4444)";

    return (
        <div className="w-full h-full p-6 select-none outline-none">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartLineColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartLineColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Stroke uses the border variable from your theme */}
                    <CartesianGrid
                        vertical={true}
                        horizontal={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.5}
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        // Uses muted-foreground for text color
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                        interval={0}
                        dy={10}
                    />

                    <YAxis
                        orientation="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                        domain={['auto', 'auto']}
                    />

                    <Tooltip
                        cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                        contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            color: "hsl(var(--popover-foreground))",
                            fontSize: "12px",
                            fontWeight: "bold"
                        }}
                        itemStyle={{ color: chartLineColor }}
                    />

                    {/* Volume bars use the muted color of the current theme */}
                    <Bar
                        dataKey="volume"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity={0.2}
                        barSize={6}
                    />

                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={chartLineColor}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                        animationDuration={1500}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}