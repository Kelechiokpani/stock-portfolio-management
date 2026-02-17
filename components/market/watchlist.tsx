"use client"

import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: "stock" | "bond" | "etf" | "mutual_fund" | "commodity"
  addedDate: string
}

interface WatchlistProps {
  items?: WatchlistItem[]
  isLoading?: boolean
  onRemove?: (id: string) => void
}

const mockWatchlist: WatchlistItem[] = [
  {
    id: "watch-001",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 192.30,
    change: 2.45,
    changePercent: 1.29,
    type: "stock",
    addedDate: "2026-02-01",
  },
  {
    id: "watch-002",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    price: 463.12,
    change: 2.15,
    changePercent: 0.47,
    type: "etf",
    addedDate: "2026-02-05",
  },
  {
    id: "watch-003",
    symbol: "BND",
    name: "Vanguard Total Bond ETF",
    price: 72.18,
    change: 0.25,
    changePercent: 0.35,
    type: "etf",
    addedDate: "2026-02-10",
  },
  {
    id: "watch-004",
    symbol: "VFIAX",
    name: "Vanguard S&P 500 Index Fund",
    price: 425.30,
    change: 2.15,
    changePercent: 0.51,
    type: "mutual_fund",
    addedDate: "2026-02-08",
  },
  {
    id: "watch-005",
    symbol: "GLD",
    name: "SPDR Gold Shares",
    price: 2089.50,
    change: 45.30,
    changePercent: 2.21,
    type: "commodity",
    addedDate: "2026-02-12",
  },
]

export function Watchlist({
  items = mockWatchlist,
  isLoading = false,
  onRemove,
}: WatchlistProps) {
  const getTrendColor = (change: number) => {
    return change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-100 text-blue-800"
      case "bond":
        return "bg-green-100 text-green-800"
      case "etf":
        return "bg-purple-100 text-purple-800"
      case "mutual_fund":
        return "bg-orange-100 text-orange-800"
      case "commodity":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Watchlist</CardTitle>
        <CardDescription>Track your favorite investments</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading watchlist...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Add assets to your watchlist to track them here
            </p>
            <Button variant="outline" className="mt-4">
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">% Change</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-semibold">{item.symbol}</p>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${getTrendColor(item.change)}`}>
                      {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${getTrendColor(item.changePercent)}`}>
                      {item.changePercent > 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getTypeColor(item.type)}`}>
                        {item.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove?.(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
