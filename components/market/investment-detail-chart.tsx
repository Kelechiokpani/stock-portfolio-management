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
import InvestedStockChart from "@/components/market/Chart/InvestedStockChart";

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
              <CardTitle className="">Performance History & Projection</CardTitle>
              <p className=" mt-1 text-sm">
                Historical performance and projected future value
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm font-semibold ">
                {latestGain >= 0 ? "+" : ""}€
                {latestGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InvestedStockChart
              holding={holding}
          />

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 bg-accent/50">
              <p className="text-sm  mb-1">Current Performance</p>
              <p className="text-2xl font-bold ">
                €{latestValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-1 ">
                {latestGain >= 0 ? "+" : ""}€
                {latestGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 bg-accent/50">
              <p className="text-sm  mb-1">Projected at Target</p>
              <p className="text-2xl font-bold ">
                €{projectedValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-1 ">
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
