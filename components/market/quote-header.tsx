"use client"

import { Heart, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Asset } from "@/components/market/mock-data"

interface QuoteHeaderProps {
  asset: Asset
  assetType: string
}

export function QuoteHeader({ asset, assetType }: QuoteHeaderProps) {
  const getPrice = () => {
    switch (assetType) {
      case "stock":
      case "etf":
      case "commodity":
        return (asset as any).price
      case "bond":
        return (asset as any).price
      case "mutual_fund":
        return (asset as any).nav
      default:
        return 0
    }
  }

  const getChange = () => (asset as any).change
  const getChangePercent = () => (asset as any).changePercent

  const price = getPrice()
  const change = getChange()
  const changePercent = getChangePercent()
  const isBullish = change > 0

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{(asset as any).symbol}</h1>
          <p className="text-lg text-muted-foreground mt-1">{(asset as any).name}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="capitalize">
              {assetType.replace("_", " ")}
            </Badge>
            {(asset as any).market && (
              <Badge variant="secondary">{(asset as any).market}</Badge>
            )}
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-end gap-6 pt-4 border-t">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Current Price</p>
          <p className="text-5xl font-bold text-foreground">
            ${price.toFixed(2)}
          </p>
        </div>

        <div className={`flex items-center gap-2 pb-2 ${isBullish ? "text-green-600" : "text-red-600"}`}>
          {isBullish ? (
            <TrendingUp className="h-6 w-6" />
          ) : (
            <TrendingDown className="h-6 w-6" />
          )}
          <div>
            <p className="font-semibold">{change > 0 ? "+" : ""}{change.toFixed(2)}</p>
            <p className="text-sm">{changePercent > 0 ? "+" : ""}{changePercent.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground pt-4 border-t">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  )
}
