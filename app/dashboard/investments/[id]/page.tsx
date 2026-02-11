"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Clock,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { InvestmentDetailChart } from "@/components/investment-detail-chart"

export default function InvestmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const holdingId = params.id as string

  const user = mockUsers[0]
  const allHoldings = user.portfolios.flatMap((p) =>
    p.holdings.map((h) => ({
      ...h,
      portfolioName: p.name,
      portfolioId: p.id,
    }))
  )

  const holding = allHoldings.find((h) => h.id === holdingId)

  if (!holding) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Investment not found</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  const initialInvestment = holding.avgPrice * holding.shares
  const currentValue = holding.value
  const totalGain = currentValue - initialInvestment
  const gainPercent = (totalGain / initialInvestment) * 100

  // Calculate projected future value
  const monthsRemaining = Math.max(0, 24 - holding.investmentDuration) // Assume 24-month target
  const projectedFutureValue =
    currentValue *
    (1 + (holding.projectedReturnPercent - gainPercent) / 100)

  // Calculate end date
  const startDate = new Date(holding.purchaseDate)
  const targetMonths = 24
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + targetMonths,
    startDate.getDate()
  )

  const progressPercent = Math.min(
    100,
    (holding.investmentDuration / targetMonths) * 100
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
              {holding.symbol}
            </h1>
            <p className="text-muted-foreground">{holding.name}</p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {holding.market}
        </Badge>
      </div>

      {/* Main Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold text-foreground">
                €{currentValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                totalGain >= 0 ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              {totalGain >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${
                  totalGain >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {totalGain >= 0 ? "+" : ""}€
                {totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p
                className={`text-xs ${
                  gainPercent >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {gainPercent >= 0 ? "+" : ""}
                {gainPercent.toFixed(2)}%
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
              <p className="text-sm text-muted-foreground">Held For</p>
              <p className="text-2xl font-bold text-foreground">
                {holding.investmentDuration} mo
              </p>
              <p className="text-xs text-muted-foreground">
                of {targetMonths} mo target
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
              <p className="text-sm text-muted-foreground">Projected Return</p>
              <p className="text-2xl font-bold text-foreground">
                +{holding.projectedReturnPercent.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <div className="mt-8">
        <InvestmentDetailChart
          holding={holding}
          projectedValue={projectedFutureValue}
        />
      </div>

      {/* Investment Timeline */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Investment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  Progress: {holding.investmentDuration} / {targetMonths} months
                </span>
                <span className="text-sm font-semibold text-primary">
                  {progressPercent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                <p className="font-semibold text-foreground">
                  {new Date(holding.purchaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Time Elapsed</p>
                <p className="font-semibold text-foreground">
                  {holding.investmentDuration} months
                </p>
              </div>

              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Target End Date</p>
                <p className="font-semibold text-foreground">
                  {endDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {monthsRemaining > 0 && (
              <div className="rounded-lg bg-info/10 border border-info/20 p-4">
                <p className="text-sm text-info">
                  <span className="font-semibold">{monthsRemaining}</span> months
                  remaining until your target investment period ends
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Investment Details */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Position Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shares Owned</span>
              <span className="font-semibold">{holding.shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Purchase Price</span>
              <span className="font-semibold">
                €{holding.avgPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-semibold">
                €{holding.currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-medium">Total Invested</span>
              <span className="font-bold">
                €{initialInvestment.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Projections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Value</span>
              <span className="font-semibold">
                €
                {currentValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected Target Return</span>
              <span className="font-semibold">
                +{holding.projectedReturnPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected Future Value</span>
              <span className="font-bold text-success">
                €
                {projectedFutureValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-medium">Potential Gain</span>
              <span className="font-bold text-success">
                €
                {(projectedFutureValue - currentValue).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
