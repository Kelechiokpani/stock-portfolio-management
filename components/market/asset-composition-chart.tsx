"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ETFHolding, MutualFundHolding } from "@/lib/mock-data"

interface AssetCompositionChartProps {
  holdings: (ETFHolding | MutualFundHolding)[]
  title?: string
  description?: string
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#14b8a6",
]

export function AssetCompositionChart({
  holdings,
  title = "Asset Composition",
  description = "Allocation across holdings",
}: AssetCompositionChartProps) {
  const chartData = [...holdings].sort((a, b) => b.percentage - a.percentage).slice(0, 10)

  const otherPercentage = holdings
    .reduce((sum, h) => sum + h.percentage, 0) - chartData.reduce((sum, h) => sum + h.percentage, 0)

  if (otherPercentage > 0) {
    chartData.push({
      symbol: "Other",
      name: "Other Holdings",
      percentage: Math.max(0, otherPercentage),
    } as any)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(2)}%`}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div className="mt-6 space-y-2 max-h-[200px] overflow-y-auto">
          <h4 className="text-sm font-semibold text-foreground mb-3">Holdings Breakdown</h4>
          {chartData.map((holding, idx) => (
            <div key={`${holding.symbol}-${idx}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-muted-foreground">{holding.symbol}</span>
              </div>
              <span className="font-semibold">{holding.percentage.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
