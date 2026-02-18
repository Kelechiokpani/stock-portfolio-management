"use client"

import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/components/market/mock-data"
import { InvestmentChart } from "@/components/market/investment-chart"
import StockDetailChart from "@/components/market/Chart/StockDetailChart";
import TotalInvestmentChart from "@/components/market/Chart/TotalInvestmentChart";



export default function InvestmentsPage() {
  const user = mockUsers[0]
  const portfolios = user.portfolios

  // Flatten all holdings from all portfolios
  const allHoldings = portfolios.flatMap((p) =>
    p.holdings.map((h) => ({
      ...h,
      portfolioName: p.name,
      portfolioId: p.id,
    }))
  )

  // Calculate stats
  const totalInvested = allHoldings.reduce(
    (sum, h) => sum + h.avgPrice * h.shares,
    0
  )
  const totalCurrentValue = allHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalGain = totalCurrentValue - totalInvested
  const totalGainPercent = (totalGain / totalInvested) * 100

  // Get performance data across all holdings
  const performanceData =
    allHoldings.length > 0
      ? allHoldings[0].performanceHistory.map((perf) => ({
          date: perf.date,
          value: allHoldings.reduce((sum, h) => {
            const hData = h.performanceHistory.find((d) => d.date === perf.date)
            return sum + (hData?.value || 0)
          }, 0),
        }))
      : []

  const bestPerformer = allHoldings.reduce((best, current) =>
    current.changePercent > best.changePercent ? current : best
  )
  const worstPerformer = allHoldings.reduce((worst, current) =>
    current.changePercent < worst.changePercent ? current : worst
  )

  const averageDuration =
    allHoldings.length > 0
      ? Math.round(
          allHoldings.reduce((sum, h) => sum + h.investmentDuration, 0) /
            allHoldings.length
        )
      : 0

  const averageReturn =
    allHoldings.length > 0
      ? (
          allHoldings.reduce((sum, h) => sum + h.projectedReturnPercent, 0) /
          allHoldings.length
        ).toFixed(1)
      : "0"

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Investment Monitoring
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your investments and monitor performance
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-2xl font-bold text-foreground">
                €{totalInvested.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${totalGain >= 0 ? "bg-success/10" : "bg-destructive/10"}`}>
              {totalGain >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${
                  totalGain >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {totalGain >= 0 ? "+" : ""}€
                {totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalGain >= 0 ? "+" : ""}
                {totalGainPercent.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-info/10">
              <Clock className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold text-foreground">
                {averageDuration} mo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Target className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Projected</p>
              <p className="text-2xl font-bold text-foreground">
                {averageReturn}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {performanceData.length > 0 && (
          <CardContent className="h-full mt-8 rounded-lg border">
          {/*<StockDetailChart stock={performanceData} />*/}
          {/*<InvestmentChart data={performanceData} />*/}
          <TotalInvestmentChart userId={user?.id} />

        </CardContent>
      )}

      {/* Holdings Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Your Holdings ({allHoldings.length})
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allHoldings.map((holding) => (
            <Link
              key={holding.id}
              href={`/dashboard/investments/${holding.id}`}
            >
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">
                        {holding.symbol}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {holding.name}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {holding.market}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Shares</span>
                    <span className="font-semibold">{holding.shares}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Current Price
                    </span>
                    <span className="font-semibold">
                      €{holding.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-semibold">
                      €
                      {holding.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Gain/Loss
                    </span>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          holding.change >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {holding.change >= 0 ? "+" : ""}€
                        {holding.change.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          holding.changePercent >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {holding.changePercent >= 0 ? "+" : ""}
                        {holding.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                    <p>Duration: {holding.investmentDuration} months</p>
                    <p>
                      Target Return: +{holding.projectedReturnPercent.toFixed(1)}
                      %
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Top & Bottom Performers */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {bestPerformer.symbol}
              </p>
              <p className="text-muted-foreground">{bestPerformer.name}</p>
              <div className="flex items-center gap-2 pt-2">
                <Badge className="bg-success/10 text-success">
                  +{bestPerformer.changePercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Worst Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {worstPerformer.symbol}
              </p>
              <p className="text-muted-foreground">{worstPerformer.name}</p>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  className={
                    worstPerformer.changePercent >= 0
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {worstPerformer.changePercent >= 0 ? "+" : ""}
                  {worstPerformer.changePercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
