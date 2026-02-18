"use client";

import { useMemo } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

type StockHolding = {
    id: string;
    symbol: string;
    name: string;
    performanceHistory: { date: string; value: number; gain: number }[];
};

export default function InvestedStockChart({ holding }: { holding: StockHolding }) {
    const chartData = useMemo(() => {
        return holding.performanceHistory.map(ph => ({
            date: ph.date,
            value: ph.value,
            gain: ph.gain
        }));
    }, [holding]);

    return (
        <div className="w-full rounded-xl p-4 ">
            <h2 className="text-lg font-semibold mb-4">{holding.name} Performance</h2>
            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

                        {/* X-axis */}
                        {/*<XAxis*/}
                        {/*    dataKey="date"*/}
                        {/*    stroke="#9ca3af"*/}
                        {/*    tick={{ fontSize: 12 }}*/}
                        {/*    interval={0}*/}
                        {/*    angle={30}*/}
                        {/*    textAnchor="end"*/}
                        {/*/>*/}
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fontSize: 10 }}
                            interval={0} // show every date
                        />

                        {/* Y-axis for value */}
                        <YAxis
                            yAxisId="value"
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                            orientation="left"
                            domain={["dataMin - 50", "dataMax + 50"]}
                        />

                        {/* Y-axis for gain */}
                        <YAxis
                            yAxisId="gain"
                            orientation="right"
                            hide
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8 }}
                            labelStyle={{ color: "#fff" }}
                        />

                        {/* Gain/loss bars */}
                        <Bar
                            yAxisId="gain"
                            dataKey="gain"
                            fill="#f97316" // orange for positive gain
                            barSize={10}
                            radius={[4, 4, 0, 0]}
                        />

                        {/* Total value area */}
                        <Area
                            type="monotone"
                            yAxisId="value"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#stockGradient)"
                            dot={{ r: 3, fill: "#3b82f6" }}
                        />

                        {/* Gradient for area */}
                        <defs>
                            <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


// "use client";
//
// import { useMemo } from "react";
// import {
//     ResponsiveContainer,
//     ComposedChart,
//     Area,
//     XAxis,
//     YAxis,
//     Tooltip,
//     CartesianGrid
// } from "recharts";
//
// type StockHolding = {
//     id: string;
//     symbol: string;
//     name: string;
//     performanceHistory: { date: string; value: number; gain: number }[];
// };
//
// export default function InvestedStockChart({ holding }: { holding: StockHolding }) {
//     const chartData = useMemo(() => {
//         return holding.performanceHistory.map(ph => ({
//             date: ph.date,
//             value: ph.value,
//             gain: ph.gain
//         }));
//     }, [holding]);
//
//
//
//     return (
//         <div className="w-full rounded-xl p-4 bg-[#0b0f17] text-white">
//             <h2 className="text-lg font-semibold mb-4">{holding.name} Performance</h2>
//             <div className="w-full h-[360px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <ComposedChart data={chartData}>
//                         <CartesianGrid stroke="#1f2937" strokeDasharray="3 3"/>
//                         <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 12}}/>
//                         <YAxis stroke="#9ca3af" tick={{fontSize: 12}}/>
//                         <Tooltip/>
//                         <Area
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#3b82f6"
//                             strokeWidth={2}
//                             fill="url(#stockGradient)"
//                             dot={false}
//                         />
//                         <defs>
//                             <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
//                                 <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
//                             </linearGradient>
//                         </defs>
//                     </ComposedChart>
//                 </ResponsiveContainer>
//             </div>
//
//
//         </div>
//     );
// }
