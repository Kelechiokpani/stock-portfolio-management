"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  Plus, // ✅ added missing import
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {mockStockMarkets, mockStocks} from "@/components/market/mock-data";


/* ============================= */
/* Local Types & Mock Data       */
/* ============================= */

export interface Stock {
  id: string
  symbol: string
  name: string
  market: string
  price: number
  change: number
  changePercent: number
  sector: string
  volume: string
}

const mockStockMarkets1 = [
  { id: "1", symbol: "NASDAQ", name: "NASDAQ Exchange" },
  { id: "2", symbol: "NYSE", name: "New York Stock Exchange" },
  { id: "3", symbol: "LSE", name: "London Stock Exchange" },
]

const mockStocks1: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    market: "NASDAQ",
    price: 192.32,
    change: 2.14,
    changePercent: 1.12,
    sector: "Technology",
    volume: "89M",
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    market: "NASDAQ",
    price: 338.11,
    change: -1.21,
    changePercent: -0.36,
    sector: "Technology",
    volume: "52M",
  },
  {
    id: "3",
    symbol: "TSLA",
    name: "Tesla Inc.",
    market: "NASDAQ",
    price: 244.87,
    change: 4.22,
    changePercent: 1.75,
    sector: "Automotive",
    volume: "76M",
  },
  {
    id: "4",
    symbol: "JNJ",
    name: "Johnson & Johnson",
    market: "NYSE",
    price: 158.45,
    change: -0.88,
    changePercent: -0.55,
    sector: "Healthcare",
    volume: "23M",
  },
  {
    id: "5",
    symbol: "HSBA",
    name: "HSBC Holdings",
    market: "LSE",
    price: 6.72,
    change: 0.12,
    changePercent: 1.81,
    sector: "Finance",
    volume: "34M",
  },
]

interface SelectedStock extends Stock {
  shares: number
}

/* ============================= */
/* Component                     */
/* ============================= */

export default function NewPortfolioPage() {
  const router = useRouter()

  const [portfolioName, setPortfolioName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([])
  const [step, setStep] = useState<"select" | "review">("select")

  /* ---------------- Filtering ---------------- */

  const filteredStocks = useMemo(() => {
    return mockStocks.filter((stock) => {
      const matchesSearch =
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesMarket =
          selectedMarket === "all" || stock.market === selectedMarket

      return matchesSearch && matchesMarket
    })
  }, [searchQuery, selectedMarket])

  /* ---------------- Stock Actions ---------------- */

  function addStock(stock: Stock) {
    if (!selectedStocks.some((s) => s.id === stock.id)) {
      setSelectedStocks([...selectedStocks, { ...stock, shares: 1 }])
    }
  }

  function removeStock(stockId: string) {
    setSelectedStocks(selectedStocks.filter((s) => s.id !== stockId))
  }

  function updateShares(stockId: string, shares: number) {
    setSelectedStocks((prev) =>
        prev.map((s) =>
            s.id === stockId ? { ...s, shares: Math.max(1, shares) } : s
        )
    )
  }

  // ✅ fixed name
  const isStockSelected = (stockId: string) =>
      selectedStocks.some((s) => s.id === stockId)

  const totalValue = useMemo(
      () =>
          selectedStocks.reduce(
              (sum, stock) => sum + stock.price * stock.shares,
              0
          ),
      [selectedStocks]
  )

  function handleCreate() {
    router.push("/dashboard")
  }

  /* ============================= */
  /* UI (UNCHANGED)               */
  /* ============================= */

  return (
      <div>
        {/* ---- Your UI remains EXACTLY the same below ---- */}

        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4"/>
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Create New Portfolio</h1>
            <p className="mt-1 text-muted-foreground">
              {step === "select"
                  ? "Select stocks from the market to build your portfolio."
                  : "Review your selections and finalize your portfolio."}
            </p>
          </div>
          {step === "select" && selectedStocks.length > 0 && (
              <Button onClick={() => setStep("review")} className="gap-2">
                Review ({selectedStocks.length})
                <Check className="h-4 w-4"/>
              </Button>
          )}
          {step === "review" && (
              <Button variant="outline" onClick={() => setStep("select")}>
                <ArrowLeft className="mr-1 h-4 w-4"/>
                Back to Selection
              </Button>
          )}
        </div>

        {step === "select" && (
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* Stock list */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Search stocks by name or symbol..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="mr-2 h-4 w-4"/>
                      <SelectValue placeholder="All Markets"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Markets</SelectItem>
                      {mockStockMarkets.map((market) => (
                          <SelectItem key={market.id} value={market.symbol}>
                            {market.symbol} - {market.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 space-y-2">
                  {filteredStocks.map((stock) => {
                    const selected = isStockSelected(stock.id)
                    return (
                        <div
                            key={stock.id}
                            className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                                selected
                                    ? "border-primary/30 bg-primary/5"
                                    : "border-border bg-card hover:bg-muted/50"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{stock.symbol}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {stock.market}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                              <div className="flex items-center justify-end gap-1">
                                {stock.change >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-success"/>
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-destructive"/>
                                )}
                                <span
                                    className={`text-xs font-medium ${
                                        stock.change >= 0 ? "text-success" : "text-destructive"
                                    }`}
                                >
                            {stock.change >= 0 ? "+" : ""}
                                  {stock.changePercent.toFixed(2)}%
                          </span>
                              </div>
                            </div>
                            <Button
                                size="sm"
                                variant={selected ? "secondary" : "default"}
                                onClick={() => (selected ? removeStock(stock.id) : addStock(stock))}
                            >
                              {selected ? (
                                  <>
                                    <Check className="mr-1 h-3 w-3"/> Added
                                  </>
                              ) : (
                                  <>
                                    <Plus className="mr-1 h-3 w-3"/> Add
                                  </>
                              )}
                            </Button>
                          </div>
                        </div>
                    )
                  })}

                  {filteredStocks.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground">
                        No stocks found matching your search criteria.
                      </div>
                  )}
                </div>
              </div>

              {/* Selected stocks sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Selected Stocks ({selectedStocks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStocks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No stocks selected yet. Browse the market and add stocks to your portfolio.
                        </p>
                    ) : (
                        <div className="space-y-3">
                          {selectedStocks.map((stock) => (
                              <div key={stock.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{stock.symbol}</span>
                                  <span className="text-muted-foreground">${stock.price.toFixed(2)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStock(stock.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label={`Remove ${stock.symbol}`}
                                >
                                  <X className="h-4 w-4"/>
                                </button>
                              </div>
                          ))}
                          <div className="border-t border-border pt-3">
                            <p className="text-sm text-muted-foreground">Estimated Total</p>
                            <p className="text-lg font-bold text-foreground">
                              ${totalValue.toLocaleString("en-US", {minimumFractionDigits: 2})}
                            </p>
                          </div>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
        )}

        {/* Review Step */}
        {step === "review" && (
            <div className="mx-auto mt-6 sm:mt-8 max-w-2xl px-4 sm:px-0 space-y-6">

              <div className="space-y-2">
                <Label htmlFor="portfolioName">Portfolio Name</Label>
                <Input
                    id="portfolioName"
                    placeholder="e.g., Growth Portfolio"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selected Holdings</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">

                    {selectedStocks.map((stock) => (
                        <div
                            key={stock.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
                        >
                          {/* Stock Info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {stock.symbol}
                  </span>
                              <span className="text-sm text-muted-foreground">
                    {stock.name}
                  </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              ${stock.price.toFixed(2)} per share
                            </p>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`shares-${stock.id}`} className="sr-only">
                                Shares
                              </Label>

                              <Input
                                  id={`shares-${stock.id}`}
                                  type="number"
                                  min={1}
                                  value={stock.shares}
                                  onChange={(e) =>
                                      updateShares(stock.id, parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 sm:w-20 text-center"
                              />

                              <span className="text-xs text-muted-foreground">
                    shares
                  </span>
                            </div>

                            <p className="min-w-[90px] text-right pl-2 font-medium text-foreground">
                              ${(stock.price * stock.shares).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                            </p>

                            <button
                                type="button"
                                onClick={() => removeStock(stock.id)}
                                className="text-muted-foreground hover:text-destructive font-bold transition-colors"
                                aria-label={`Remove ${stock.symbol}`}
                            >
                              <X className="h-4 w-4 font-bold pl-2" />
                            </button>
                          </div>
                        </div>
                    ))}

                  </div>

                  {/* Total */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-border pt-4">
          <span className="font-medium text-foreground">
            Total Portfolio Value
          </span>

                    <span className="text-lg sm:text-xl  font-bold text-foreground">
            ${totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
          </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                  onClick={handleCreate}
                  className="w-full"
                  size="lg"
                  disabled={!portfolioName || selectedStocks.length === 0}
              >
                Create Portfolio
              </Button>

            </div>
        )}

      </div>
  )
}
