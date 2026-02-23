"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  Share2,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  Wallet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CashMovement, TransactionStatus } from "@/components/data/user-data"



interface TransactionHistoryProps {
  // We use the CashMovement type from your data file
  transactions: CashMovement[]
  baseCurrency: string
}

export function TransactionHistory({
                                     transactions,
                                     baseCurrency = "EUR",
                                   }: TransactionHistoryProps) {

  const getMovementConfig = (type: CashMovement["type"]) => {
    switch (type) {
      case "deposit":
        return {
          icon: <ArrowDownLeft className="h-4 w-4" />,
          label: "Inward Remittance",
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          prefix: "+"
        }
      case "withdrawal":
        return {
          icon: <ArrowUpRight className="h-4 w-4" />,
          label: "Outward Settlement",
          color: "text-foreground",
          bg: "bg-secondary",
          prefix: "-"
        }
      default:
        return {
          icon: <Wallet className="h-4 w-4" />,
          label: "Adjustment",
          color: "text-muted-foreground",
          bg: "bg-muted",
          prefix: ""
        }
    }
  }

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] font-bold uppercase tracking-tighter">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Settled
            </Badge>
        )
      case "pending":
        return (
            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-amber-600 text-[10px] font-bold uppercase tracking-tighter">
              <Clock className="mr-1 h-3 w-3" /> Pending
            </Badge>
        )
      case "failed":
        return (
            <Badge variant="outline" className="border-rose-500/20 bg-rose-500/5 text-rose-600 text-[10px] font-bold uppercase tracking-tighter">
              <XCircle className="mr-1 h-3 w-3" /> Declined
            </Badge>
        )
    }
  }

  // Newest transactions first
  const sortedMovements = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
      <Card className="border-none shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl font-bold">Capital Movements</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-semibold mt-1">
                Audit-ready cash flow records
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {sortedMovements.map((txn) => {
              const config = getMovementConfig(txn.type)

              return (
                  <div
                      key={txn.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground leading-none">
                          {config.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                          {txn.method} • {new Date(txn.date).toLocaleDateString("en-DE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <p className={`font-bold text-sm tracking-tight tabular-nums ${config.color}`}>
                        {config.prefix}{new Intl.NumberFormat("en-DE", {
                        style: "currency",
                        currency: txn.currency || baseCurrency,
                      }).format(txn.amount)}
                      </p>
                      {getStatusBadge(txn.status)}
                    </div>
                  </div>
              )
            })}

            {sortedMovements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/50 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <Wallet className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No ledger entries detected</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
  )
}