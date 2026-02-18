"use client";

import { useMemo, useState } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Bar
} from "recharts";
import { mockUsers } from "@/components/market/mock-data"; // adjust path


type PortfolioChartPoint = {
    date: string;
    totalValue: number;
    totalGain: number;
};

export default function TotalInvestmentChart({ userId }: { userId: string }) {
    const user = mockUsers.find(u => u.id === userId);

    // Generate aggregated portfolio history
    const chartData: PortfolioChartPoint[] = useMemo(() => {
        if (!user || user.portfolios.length === 0) return [];

        // Get the longest history among all holdings
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

            return { date, totalValue, totalGain };
        });
    }, [user]);

    return (
        <div className="w-full rounded-lg  p-6  ">
            <h2 className="text-1xl font-semibold pt-6 pb-6">Total Portfolio Performance</h2>

            <div className="w-full h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="totalValue"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#totalGradient)"
                            dot={false}
                        />
                        <defs>
                            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
