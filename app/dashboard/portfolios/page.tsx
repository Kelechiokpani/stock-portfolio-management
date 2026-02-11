"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockUsers } from "@/lib/mock-data"
import { CreatePortfolioModal } from "@/components/create-portfolio-modal"

export default function PortfoliosPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const user = mockUsers[0]
  const portfolios = user.portfolios

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Portfolios</h1>
          <p className="mt-1 text-muted-foreground">Manage and track all your investment portfolios.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Button>
      </div>

      <div className="mt-8 space-y-8">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{portfolio.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {portfolio.uniqueIdentifier} | Created {new Date(portfolio.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={portfolio.status === "active" ? "default" : "secondary"}>
                    {portfolio.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">
                      ${portfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm font-medium ${portfolio.totalGain >= 0 ? "text-success" : "text-destructive"}`}>
                      {portfolio.totalGain >= 0 ? "+" : ""}
                      ${portfolio.totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      {" "}({portfolio.totalGain >= 0 ? "+" : ""}{portfolio.gainPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Avg Price</TableHead>
                      <TableHead className="text-right">Current Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.holdings.map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell className="font-semibold">{holding.symbol}</TableCell>
                        <TableCell className="text-muted-foreground">{holding.name}</TableCell>
                        <TableCell className="text-right">{holding.shares}</TableCell>
                        <TableCell className="text-right">${holding.avgPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${holding.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {holding.change >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-success" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-destructive" />
                            )}
                            <span className={`text-sm ${holding.change >= 0 ? "text-success" : "text-destructive"}`}>
                              {holding.change >= 0 ? "+" : ""}{holding.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${holding.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreatePortfolioModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
