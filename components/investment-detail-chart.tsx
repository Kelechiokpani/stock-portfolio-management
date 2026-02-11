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
import type { Holding } from "@/lib/mock-data"

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
  const chartData = holding.performanceHistory.map((perf, index) => ({
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
            <CardTitle>Performance History & Projection</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Historical performance and projected future value
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p
              className={`text-sm font-semibold ${
                latestGain >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {latestGain >= 0 ? "+" : ""}€
              {latestGain.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
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
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: "12px" }}
              formatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => {
                if (name === "value") {
                  return [
                    `€${value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`,
                    "Position Value",
                  ]
                } else if (name === "gain") {
                  return [
                    `€${value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`,
                    "Total Gain",
                  ]
                }
                return value
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)", r: 4 }}
              activeDot={{ r: 6 }}
              name="Position Value"
              isAnimationActive={true}
            />
            <Bar
              dataKey="gain"
              fill="var(--color-success)"
              opacity={0.6}
              name="Total Gain"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-4 bg-accent/50">
            <p className="text-sm text-muted-foreground mb-1">
              Current Performance
            </p>
            <p className="text-2xl font-bold text-foreground">
              €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-sm mt-1 ${latestGain >= 0 ? "text-success" : "text-destructive"}`}>
              {latestGain >= 0 ? "+" : ""}€
              {latestGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="rounded-lg border border-border p-4 bg-accent/50">
            <p className="text-sm text-muted-foreground mb-1">
              Projected at Target
            </p>
            <p className="text-2xl font-bold text-success">
              €{projectedValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-success mt-1">
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
