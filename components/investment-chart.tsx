"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PerformancePoint {
  date: string
  value: number
}

interface InvestmentChartProps {
  data: PerformancePoint[]
}

export function InvestmentChart({ data }: InvestmentChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))
  const latestValue = data[data.length - 1]?.value || 0
  const firstValue = data[0]?.value || 0
  const valueChange = latestValue - firstValue
  const percentChange = ((valueChange / firstValue) * 100).toFixed(2)

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your investment growth over time
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">
              €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p
              className={`text-sm font-semibold ${
                valueChange >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {valueChange >= 0 ? "+" : ""}€
              {valueChange.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}{" "}
              ({valueChange >= 0 ? "+" : ""}{percentChange}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="formattedDate"
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
              formatter={(value: number) => [
                `€${value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`,
                "Portfolio Value",
              ]}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
