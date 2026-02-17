"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import type { ETFHolding, MutualFundHolding } from "@/lib/mock-data"

interface HoldingsTableProps {
  holdings: (ETFHolding | MutualFundHolding)[]
  title?: string
  description?: string
}

export function HoldingsTable({
  holdings,
  title = "Fund Holdings",
  description = "Top holdings and their allocation",
}: HoldingsTableProps) {
  const sortedHoldings = [...holdings].sort(
    (a, b) => b.percentage - a.percentage
  )

  const totalPercentage = sortedHoldings.reduce((sum, h) => sum + h.percentage, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Holding</TableHead>
                <TableHead className="text-right">Allocation %</TableHead>
                <TableHead className="w-[200px]">Visual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings.map((holding, idx) => (
                <TableRow key={`${holding.symbol}-${idx}`}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{holding.symbol}</p>
                      <p className="text-sm text-muted-foreground">{holding.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {holding.percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={holding.percentage}
                        max={Math.max(...sortedHoldings.map((h) => h.percentage))}
                        className="w-full"
                      />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {holding.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalPercentage.toFixed(2)}%</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {totalPercentage < 100 && (
          <p className="text-xs text-muted-foreground mt-3">
            Showing top holdings. {(100 - totalPercentage).toFixed(2)}% in other holdings or cash.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
