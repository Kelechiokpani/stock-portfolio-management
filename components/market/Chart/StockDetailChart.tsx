"use client";

import { useMemo, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    ComposedChart
} from "recharts";

type StockSnapshot = {
    id: string;
    symbol: string;
    name: string;
    market: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
    sector: string;
};

type ChartPoint = {
    date: string;
    price: number;
    volume: number;
};

export default function StockDetailChart({ stock }: { stock: StockSnapshot }) {
    const [range, setRange] = useState("YTD");

    // generate demo history from snapshot
    const chartData: ChartPoint[] = useMemo(() => {
        const days = 30;
        const basePrice = stock.price - stock.change;

        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - i));

            return {
                date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                price: basePrice + Math.sin(i / 3) * 5 + i * 0.4,
                volume: Math.random() * 10 + 2
            };
        });
    }, [stock]);

    return (
        // <div className="w-full bg-[#0b0f17] text-white rounded-xl p-4">
        <div className="w-full   rounded-xl p-4">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{stock.name}</h2>

                <div className="flex items-center gap-3 flex-wrap">

          <div className="text-3xl font-bold">
            ${stock.price.toFixed(2)}
          </div>

                    <span
                        className={`text-lg font-semibold ${
                            stock.change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
            {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent}%
          </span>
                </div>

                <p className="text-gray-400 text-sm mt-1">
                    {stock.market} • Vol {stock.volume} • {stock.sector}
                </p>
            </div>

            {/* CHART */}
            <div className="w-full h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3"/>

                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{fontSize: 12}}
                        />

                        {/* Price axis */}
                        <YAxis
                            yAxisId="price"
                            stroke="#9ca3af"
                            tick={{fontSize: 12}}
                            domain={["dataMin - 5", "dataMax + 5"]}
                        />

                        {/* Volume axis (hidden) */}
                        <YAxis
                            yAxisId="volume"
                            orientation="right"
                            hide
                        />

                        <Tooltip/>

                        {/* Volume bars */}
                        <Bar
                            dataKey="volume"
                            fill="#1f2937"
                            barSize={6}
                            yAxisId="volume"
                        />

                        {/* Price area */}
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#priceGradient)"
                            dot={false}
                            yAxisId="price"
                        />

                        <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* TIME RANGE BUTTONS */}
            <div className="flex gap-2 mt-4 flex-wrap">
                {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                            range === r
                                ? "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
    );
}
