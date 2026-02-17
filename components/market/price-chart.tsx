"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PriceChartProps {
  symbol: string
  currentPrice: number
}

type Timeframe = "1D" | "5D" | "1M" | "3M" | "1Y" | "5Y" | "All"

// Generate mock historical data for demonstration
function generateChartData(timeframe: Timeframe, currentPrice: number) {
  const data:any = []
  const now = new Date()
  let daysBack = 1

  switch (timeframe) {
    case "1D":
      daysBack = 1
      for (let i = 24; i >= 0; i--) {
        const date = new Date(now)
        date.setHours(date.getHours() - i)
        const variance = (Math.random() - 0.5) * currentPrice * 0.05
        data.push({
          time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 1000000),
        })
      }
      break
    case "5D":
      daysBack = 5
      for (let i = 120; i >= 0; i--) {
        const date = new Date(now)
        date.setHours(date.getHours() - i * 2)
        const variance = (Math.random() - 0.5) * currentPrice * 0.08
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 5000000),
        })
      }
      break
    case "1M":
      daysBack = 30
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const variance = (Math.random() - 0.5) * currentPrice * 0.12
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 10000000),
        })
      }
      break
    case "3M":
      daysBack = 90
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i * 7)
        const variance = (Math.random() - 0.5) * currentPrice * 0.2
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 20000000),
        })
      }
      break
    case "1Y":
      daysBack = 365
      for (let i = 52; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        const variance = (Math.random() - 0.5) * currentPrice * 0.3
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 50000000),
        })
      }
      break
    case "5Y":
      for (let i = 60; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        const variance = (Math.random() - 0.5) * currentPrice * 0.5
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 100000000),
        })
      }
      break
    case "All":
      for (let i = 120; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        const variance = (Math.random() - 0.5) * currentPrice * 0.7
        data.push({
          time: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          price: parseFloat((currentPrice + variance).toFixed(2)),
          volume: Math.floor(Math.random() * 200000000),
        })
      }
      break
  }

  return data.reverse()
}

export function PriceChart({ symbol, currentPrice }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1M")
  const [chartType, setChartType] = useState<"line" | "area">("line")

  const chartData = generateChartData(timeframe, currentPrice)
  const minPrice = Math.min(...chartData.map((d:any) => d.price))
  const maxPrice = Math.max(...chartData.map((d:any) => d.price))
  const priceChange = chartData[chartData.length - 1].price - chartData[0].price
  const percentChange = ((priceChange / chartData[0].price) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Price Chart - {symbol}</CardTitle>
            <CardDescription>
              Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} ({percentChange}%)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              Line
            </Button>
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
            >
              Area
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeframe Selector */}
        <div className="flex gap-2 flex-wrap">
          {(["1D", "5D", "1M", "3M", "1Y", "5Y", "All"] as Timeframe[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#888" style={{ fontSize: "12px" }} />
                <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #444",
                    borderRadius: "4px",
                  }}
                  // formatter={(value) => `$${value.toFixed(2)}`}
                  formatter={(value: number | string) =>
                      typeof value === "number" ? `$${value.toFixed(2)}` : value
                  }
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#888" style={{ fontSize: "12px" }} />
                <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #444",
                    borderRadius: "4px",
                  }}
                  // formatter={(value) => `$${value.toFixed(2)}`}
                  formatter={(value: number | string) =>
                      typeof value === "number" ? `$${value.toFixed(2)}` : value
                  }
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
