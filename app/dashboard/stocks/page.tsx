"use client"

import { useState, useMemo } from "react"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockStocks, mockStockMarkets } from "@/components/market/mock-data"




export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Get unique sectors
  const sectors = Array.from(new Set(mockStocks.map((s) => s.sector))).sort()

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    let filtered = mockStocks.filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMarket =
        selectedMarket === "all" || stock.market === selectedMarket
      const matchesSector =
        selectedSector === "all" || stock.sector === selectedSector

      return matchesSearch && matchesMarket && matchesSector
    })

    // Sort
    switch (sortBy) {
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price_high":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "price_low":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "gain_high":
        filtered = filtered.sort((a, b) => b.changePercent - a.changePercent)
        break
      case "gain_low":
        filtered = filtered.sort((a, b) => a.changePercent - b.changePercent)
        break
      case "volume":
        filtered = filtered.sort((a, b) => {
          const aVol = parseInt(a.volume.replace(/[A-Za-z]/g, ""))
          const bVol = parseInt(b.volume.replace(/[A-Za-z]/g, ""))
          return bVol - aVol
        })
        break
      default:
        break
    }

    return filtered
  }, [searchQuery, selectedMarket, selectedSector, sortBy])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Stock Browser
          </h1>
          <p className="mt-1 text-muted-foreground">
            Explore and research available stocks
          </p>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Stocks</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStocks.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gainers</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStocks.filter((s) => s.change > 0).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Losers</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStocks.filter((s) => s.change < 0).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Filter className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sectors</p>
              <p className="text-2xl font-bold text-foreground">
                {sectors.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search Stocks
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Market
            </label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {mockStockMarkets.map((market:any) => (
                  <SelectItem key={market.id} value={market.symbol}>
                    {market.name} ({market.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sector
            </label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="gain_high">Gain (High to Low)</SelectItem>
                <SelectItem value="gain_low">Gain (Low to High)</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Results ({filteredStocks.length})
          </h2>
        </div>

        {filteredStocks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No stocks found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStocks.map((stock) => (
              <Card key={stock.id} className="hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-foreground">
                          {stock.symbol}
                        </h3>
                        <Badge variant="secondary">{stock.market}</Badge>
                        <Badge variant="outline">{stock.sector}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {stock.name}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-semibold text-foreground">
                            €{stock.price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Change</p>
                          <p
                            className={`font-semibold ${
                              stock.change >= 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}€
                            {stock.change.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume</p>
                          <p className="font-semibold text-foreground">
                            {stock.volume}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Market Cap</p>
                          <p className="font-semibold text-foreground">
                            {stock.marketCap}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            stock.changePercent >= 0
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          {stock.changePercent >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3" />
                          )}
                          Today
                        </p>
                      </div>
                      <Button size="sm" variant="default">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}
