"use client"

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Holding } from "@/components/market/mock-data"

interface InvestmentDetailChartProps {
  holding: Holding
  projectedValue: number
}

export function InvestmentDetailChart({
  holding,
  projectedValue,
}: InvestmentDetailChartProps) {
  if (!holding.performanceHistory || holding.performanceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Create chart data with gain/loss information
  const chartData = holding.performanceHistory.map((perf:any, index:any) => ({
    date: new Date(perf.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: perf.value,
    gain: perf.gain,
  }))

  // Add projected value at the end
  const lastData = chartData[chartData.length - 1]
  const projectedData = {
    date: "Target",
    value: projectedValue,
    gain: projectedValue - (holding.avgPrice * holding.shares),
    isProjected: true,
  }

  const allData = [...chartData, projectedData]

  const minValue = Math.min(...holding.performanceHistory.map((d) => d.value))
  const maxValue = Math.max(projectedValue, ...holding.performanceHistory.map((d) => d.value))
  const latestValue = holding.value
  const latestGain = latestValue - holding.avgPrice * holding.shares

  return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white">Performance History & Projection</CardTitle>
              <p className="text-white mt-1 text-sm">
                Historical performance and projected future value
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm font-semibold text-white">
                {latestGain >= 0 ? "+" : ""}€
                {latestGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
                data={allData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                  dataKey="date"
                  stroke="white"
                  style={{ fontSize: "12px" }}
              />
              {/*<YAxis*/}
              {/*    stroke="white"*/}
              {/*    style={{ fontSize: "12px" }}*/}
              {/*    formatter={(value:any) => `€${(value / 1000).toFixed(0)}k`}*/}
              {/*/>*/}
              <YAxis
                  stroke="white"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value: number) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "value") {
                      return [
                        `€${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                        "Position Value",
                      ];
                    } else if (name === "gain") {
                      return [
                        `€${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                        "Total Gain",
                      ];
                    }
                    return value;
                  }}
                  labelStyle={{ color: "white" }}
              />
              <Legend wrapperStyle={{ color: "white" }} />
              <Line
                  type="monotone"
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ fill: "white", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Position Value"
                  isAnimationActive={true}
              />
              <Bar dataKey="gain" fill="white" opacity={0.6} name="Total Gain" />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 bg-accent/50">
              <p className="text-sm text-white mb-1">Current Performance</p>
              <p className="text-2xl font-bold text-white">
                €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-1 text-white">
                {latestGain >= 0 ? "+" : ""}€
                {latestGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 bg-accent/50">
              <p className="text-sm text-white mb-1">Projected at Target</p>
              <p className="text-2xl font-bold text-white">
                €{projectedValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-1 text-white">
                +€
                {(projectedValue - holding.avgPrice * holding.shares).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

  )
}
