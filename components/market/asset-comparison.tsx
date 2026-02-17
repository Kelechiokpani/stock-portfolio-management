"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Asset } from "@/lib/mock-data"

interface AssetComparisonProps {
  assets: Asset[]
  title?: string
}

// Generate mock comparison data
function generateComparisonData(assets: Asset[]) {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const point: any = {
      day: `Day ${30 - i}`,
    }
    assets.forEach((asset, idx) => {
      const variance = (Math.random() - 0.5) * 0.1
      point[`asset${idx}`] = parseFloat(((asset as any).price * (1 + variance)).toFixed(2))
    })
    data.push(point)
  }
  return data
}

const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]

export function AssetComparison({
  assets,
  title = "Asset Comparison",
}: AssetComparisonProps) {
  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Select 2-3 assets to compare
          </p>
        </CardContent>
      </Card>
    )
  }

  const comparisonData = generateComparisonData(assets)

  const comparisonTable = assets.map((asset, idx) => {
    const assetData = asset as any
    return {
      idx,
      symbol: assetData.symbol,
      name: assetData.name,
      price: assetData.price || assetData.nav,
      change: assetData.change,
      changePercent: assetData.changePercent,
      getAdditionalMetric: () => {
        if ("expenseRatio" in assetData) return `${assetData.expenseRatio}%`
        if ("sector" in assetData) return assetData.sector
        if ("couponRate" in assetData) return `${assetData.couponRate}%`
        return "N/A"
      },
    }
  })

  return (
    <div className="space-y-6">
      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Price performance comparison over 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                {assets.map((_, idx) => (
                  <Line
                    key={`line-${idx}`}
                    type="monotone"
                    dataKey={`asset${idx}`}
                    stroke={colors[idx % colors.length]}
                    dot={false}
                    name={(assets[idx] as any).symbol}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Side-by-side comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Metric</TableHead>
                  {comparisonTable.map((asset) => (
                    <TableHead key={asset.symbol} className="text-center">
                      <div>
                        <p className="font-semibold">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {asset.name}
                        </p>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Current Price</TableCell>
                  {comparisonTable.map((asset) => (
                    <TableCell key={`price-${asset.symbol}`} className="text-center">
                      ${asset.price.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Change</TableCell>
                  {comparisonTable.map((asset) => (
                    <TableCell
                      key={`change-${asset.symbol}`}
                      className={`text-center ${
                        asset.change > 0
                          ? "text-green-600"
                          : asset.change < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {asset.change > 0 ? "+" : ""}{asset.change.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">% Change</TableCell>
                  {comparisonTable.map((asset) => (
                    <TableCell
                      key={`percent-${asset.symbol}`}
                      className={`text-center font-semibold ${
                        asset.changePercent > 0
                          ? "text-green-600"
                          : asset.changePercent < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {asset.changePercent > 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Additional Metric</TableCell>
                  {comparisonTable.map((asset) => (
                    <TableCell key={`metric-${asset.symbol}`} className="text-center">
                      {asset.getAdditionalMetric()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
