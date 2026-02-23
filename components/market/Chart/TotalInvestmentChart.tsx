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
import { mockUsers } from "@/components/data/user-data";


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const gain = payload[0].payload.totalGain;
        const gainPercent = ((gain / (value - gain)) * 100).toFixed(2);

        return (
            <div className="bg-background/80 border border-border p-4 shadow-2xl backdrop-blur-md rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
                    {label}
                </p>
                <div className="space-y-1">
                    <p className="text-xl font-bold tracking-tighter text-foreground">
                        €{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            gain >= 0
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                            {gain >= 0 ? '+' : ''}€{Math.abs(gain).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                            ({gainPercent}%)
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function TotalInvestmentChart({ userId }: { userId: string }) {
    const user = mockUsers.find(u => u.id === userId);

    const chartData = useMemo(() => {
        if (!user || user.portfolios.length === 0) return [];

        const allHoldings = user.portfolios.flatMap(p => p.holdings);
        const dates = Array.from(
            new Set(allHoldings.flatMap(h => h.performanceHistory.map(ph => ph.date)))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        return dates.map(date => {
            let totalValue = 0;
            let totalGain = 0;

            allHoldings.forEach(h => {
                const ph = h.performanceHistory.find(p => p.date === date);
                if (ph) {
                    totalValue += ph.value;
                    totalGain += ph.gain;
                }
            });

            return {
                // Format date for better X-Axis display
                date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                totalValue,
                totalGain
            };
        });
    }, [user]);

    if (!chartData.length) return (
        <div className="h-full flex items-center justify-center text-muted-foreground italic font-light">
            Awaiting market data...
        </div>
    );

    return (
        <div className="w-full h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                        {/* Theme-adaptive gradient:
                            Uses current primary color and fades to transparent
                        */}
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} className="text-primary" />
                            <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        vertical={false}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-border/50"
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 11 }}
                        className="text-muted-foreground"
                        minTickGap={30}
                        dy={15}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 11 }}
                        className="text-muted-foreground"
                        tickFormatter={(val) => `€${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4' }}
                        wrapperStyle={{ outline: 'none' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="totalValue"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                        className="text-primary"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                        activeDot={{
                            r: 6,
                            strokeWidth: 0,
                            className: "text-primary fill-current shadow-lg"
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}