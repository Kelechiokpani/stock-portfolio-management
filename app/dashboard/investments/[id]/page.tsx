"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Clock,
  Euro,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/components/data/user-data"
// Importing the chart we refined earlier
import TotalInvestmentChart from "@/components/market/Chart/TotalInvestmentChart"

export default function InvestmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const holdingId = params.id as string

  // Accessing our professional mock data
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
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Info className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-xl font-serif font-medium text-foreground">Asset Not Found</p>
          <p className="text-muted-foreground mb-6">This holding might have been liquidated or moved.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Return to Portfolio
          </Button>
        </div>
    )
  }

  // LOGIC: Derived Calculations from your data structure
  const initialCostBasis = holding.avgPrice * holding.shares
  const currentValue = holding.value
  const totalGain = holding.change
  const gainPercent = holding.changePercent

  // Calculate Duration based on purchaseDate
  const startDate = new Date(holding.purchaseDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - startDate.getTime())
  const monthsHeld = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))

  // Professional Target Logic (Assuming a 36-month standard cycle if not specified)
  const targetMonths = 36
  const progressPercent = Math.min(100, (monthsHeld / targetMonths) * 100)
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + targetMonths))

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">

        {/* 1. NAVIGATION & IDENTITY */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-bold border-primary/20 text-primary uppercase text-[10px]">
                  {holding.portfolioType}
                </Badge>
                <Badge className="bg-secondary text-secondary-foreground text-[10px]">
                  ID: {holding.id}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
                {holding.name} <span className="text-muted-foreground font-sans font-normal ml-1">({holding.symbol})</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Market Price</p>
            <p className="text-3xl font-black tracking-tighter">
              €{holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* 2. CORE PERFORMANCE METRICS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
              title="Equity Value"
              value={`€${currentValue.toLocaleString()}`}
              icon={<Euro className="h-5 w-5" />}
              trend={null}
          />
          <MetricCard
              title="Total P/L"
              value={`€${totalGain.toLocaleString()}`}
              icon={totalGain >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              trend={`${totalGain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%`}
              isPositive={totalGain >= 0}
          />
          <MetricCard
              title="Holding Period"
              value={`${monthsHeld} Months`}
              icon={<Clock className="h-5 w-5" />}
              trend="Since Purchase"
          />
          <MetricCard
              title="Avg. Cost Basis"
              value={`€${holding.avgPrice.toLocaleString()}`}
              icon={<Target className="h-5 w-5" />}
              trend={`${holding.shares} Shares Owned`}
          />
        </div>

        {/* 3. PERFORMANCE CHART */}
        <Card className="border-none bg-card/30 backdrop-blur-md shadow-2xl shadow-primary/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-serif">Historical Accumulation</CardTitle>
            <Badge variant="secondary" className="font-mono">Real-time Data Sync</Badge>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="h-[400px] w-full">
              {/* Reusing your professional chart - passing dummy logic for local context */}
              <TotalInvestmentChart userId={user.id} />
            </div>
          </CardContent>
        </Card>

        {/* 4. INVESTMENT TIMELINE & DETAILS */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Progress Tracker */}
          <Card className="lg:col-span-2 border-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md">
                <Calendar className="h-5 w-5 text-primary" />
                Strategic Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Maturity Progress</span>
                  <span className="font-bold text-primary">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                  <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <TimelineStep label="Acquisition" date={holding.purchaseDate} />
                <TimelineStep label="Time Elapsed" date={`${monthsHeld} Mo`} isDate={false} />
                <TimelineStep label="Target Maturity" date={endDate.toISOString()} />
              </div>
            </CardContent>
          </Card>

          {/* Position Breakdown */}
          <Card className="border-muted/40 bg-secondary/10">
            <CardHeader>
              <CardTitle className="text-md font-serif">Position Ledger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Original Capital</span>
                <span className="font-bold">€{initialCostBasis.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Units Owned</span>
                <span className="font-bold">{holding.shares}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Portfolio Weight</span>
                <span className="font-bold text-primary">
                    {((currentValue / user.totalBalance) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="pt-4">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Strategy Note</p>
                <div className="p-3 bg-background/50 rounded-lg text-xs leading-relaxed text-muted-foreground italic border border-border/40">
                  This {holding.symbol} position is classified under {holding.portfolioType} management.
                  Monitor for volatility shifts in the {holding.portfolioName}.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

/** * PROFESSIONAL SUB-COMPONENTS
 */

function MetricCard({ title, value, icon, trend, isPositive }: any) {
  return (
      <Card className="border-muted/40 shadow-sm transition-all hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              {icon}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black tracking-tight">{value}</p>
              {trend && (
                  <span className={`text-[10px] font-bold ${isPositive === null ? 'text-muted-foreground' : (isPositive ? 'text-emerald-500' : 'text-rose-500')}`}>
                                {trend}
                            </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

function TimelineStep({ label, date, isDate = true }: { label: string, date: string, isDate?: boolean }) {
  return (
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
        <p className="text-sm font-bold truncate px-1">
          {isDate ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : date}
        </p>
      </div>
  )
}