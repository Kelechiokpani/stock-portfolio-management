"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Portfolio } from "@/lib/mock-data"

interface PortfolioAllocationProps {
  portfolio: Portfolio
}

export function PortfolioAllocation({ portfolio }: PortfolioAllocationProps) {
  // Calculate allocation by asset class (in real app, holdings would have type field)
  // For now, we'll use a simplified calculation based on holdings
  const allocation = {
    stocks: portfolio.holdings.length > 0 ? (portfolio.totalValue * 0.65) : 0,
    bonds: portfolio.holdings.length > 0 ? (portfolio.totalValue * 0.25) : 0,
    etfs: portfolio.holdings.length > 0 ? (portfolio.totalValue * 0.1) : 0,
  }

  const allocationData = [
    { name: "Stocks", value: allocation.stocks, percentage: (allocation.stocks / portfolio.totalValue * 100).toFixed(1) },
    { name: "Bonds", value: allocation.bonds, percentage: (allocation.bonds / portfolio.totalValue * 100).toFixed(1) },
    { name: "ETFs", value: allocation.etfs, percentage: (allocation.etfs / portfolio.totalValue * 100).toFixed(1) },
  ]

  const chartData = [
    {
      name: portfolio.name,
      Stocks: parseFloat((allocation.stocks / portfolio.totalValue * 100).toFixed(1)),
      Bonds: parseFloat((allocation.bonds / portfolio.totalValue * 100).toFixed(1)),
      ETFs: parseFloat((allocation.etfs / portfolio.totalValue * 100).toFixed(1)),
    },
  ]

  // Calculate diversification score (0-100)
  const diversificationScore = Math.min(
    100,
    (Object.values(allocation).filter((v) => v > 0).length * 33) + 
    (Math.abs(allocation.stocks - allocation.bonds) < portfolio.totalValue * 0.15 ? 10 : 0)
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Current distribution across asset classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allocationData.map((asset) => (
              <div key={asset.name} className="rounded-lg border p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                <div>
                  <p className="text-2xl font-bold">${asset.value.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{asset.percentage}% of portfolio</p>
                </div>
                <Progress value={parseFloat(asset.percentage)} className="h-2" />
              </div>
            ))}
          </div>

          {/* Stacked Bar Chart */}
          <div className="mt-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="Stocks" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Bonds" stackId="a" fill="#10b981" />
                <Bar dataKey="ETFs" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Diversification Score */}
      <Card>
        <CardHeader>
          <CardTitle>Diversification Score</CardTitle>
          <CardDescription>How well-diversified is your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Score</span>
              <span className="text-2xl font-bold text-blue-600">{diversificationScore.toFixed(0)}/100</span>
            </div>
            <Progress value={diversificationScore} className="h-3" />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              {diversificationScore > 75
                ? "✓ Excellent diversification across asset classes"
                : diversificationScore > 50
                ? "○ Moderate diversification - consider adding more asset types"
                : "⚠ Limited diversification - strongly consider diversifying"}
            </p>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg bg-muted/50 p-3 mt-4">
            <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {Object.entries(allocation).every(([_, v]) => v > portfolio.totalValue * 0.2) ? (
                <li>✓ Good balance across asset types</li>
              ) : (
                <li>• Consider balancing allocation across asset classes</li>
              )}
              {portfolio.totalValue < 50000 && (
                <li>• Increasing portfolio size improves diversification options</li>
              )}
              <li>• Review and rebalance quarterly to maintain target allocation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
