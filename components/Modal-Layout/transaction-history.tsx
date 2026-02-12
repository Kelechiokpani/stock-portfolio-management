"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Transaction} from "@/lib/user-date";

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-5 w-5 text-success" />
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-destructive" />
      case "transfer_sent":
        return <Share2 className="h-5 w-5 text-warning" />
      case "transfer_received":
        return <Share2 className="h-5 w-5 text-success" />
      case "buy":
        return <TrendingUp className="h-5 w-5 text-primary" />
      case "sell":
        return <TrendingDown className="h-5 w-5 text-warning" />
      default:
        return null
    }
  }

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "transfer_received":
      case "sell":
        return "text-success"
      case "withdrawal":
      case "transfer_sent":
      case "buy":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-warning/10 text-warning"
      case "failed":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
                  {getTransactionIcon(txn.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">
                    {txn.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${getTransactionColor(txn.type)}`}
                  >
                    {txn.type === "deposit" || txn.type === "transfer_received"
                      ? "+"
                      : "-"}
                    €{txn.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getStatusColor(txn.status)}`}
                  >
                    {txn.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          {sortedTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
