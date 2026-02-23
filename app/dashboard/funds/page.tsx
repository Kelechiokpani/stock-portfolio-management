"use client"

import { useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Plus,
  Minus,
  History,
  ShieldCheck,
  Banknote,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/components/data/user-data"

import { DepositModal } from "@/components/Modal-Layout/deposit-modal"
import { WithdrawalModal } from "@/components/Modal-Layout/withdrawal-modal"
import {TransactionHistory} from "@/components/Modal-Layout/transaction-history";
import {SettlementNodes} from "@/components/Modal-Layout/settlement-nodes";




export default function FundsPage() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)

  // Mapping to your strict 'User' type
  const user = mockUsers[0]
  const { availableCash, totalBalance, cashMovements, connectedAccounts, settings } = user
  const currency = settings.baseCurrency || "EUR"

  // Financial Calculations based on 'CashMovement' type
  const depositTotal = cashMovements
      .filter((m) => m.type === "deposit" && m.status === "completed")
      .reduce((sum, m) => sum + m.amount, 0)

  const withdrawalTotal = cashMovements
      .filter((m) => m.type === "withdrawal" && m.status === "completed")
      .reduce((sum, m) => sum + m.amount, 0)

  const formatCurrency = (val: number) =>
      new Intl.NumberFormat("en-DE", { style: "currency", currency }).format(val)

  return (
      <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 animate-in fade-in duration-700">

        {/* 1. HEADER SECTION */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5 uppercase tracking-tighter text-[10px] font-bold">
              Asset Liquidity
            </Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Capital Management
            </h1>
            <p className="mt-1 text-muted-foreground text-sm max-w-md">
              Manage your {settings.accountType} account funds and track cash movements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setShowDepositModal(true)} className="rounded-xl shadow-lg shadow-primary/20 px-6 h-11">
              <Plus className="mr-2 h-4 w-4" /> Deposit
            </Button>
            <Button onClick={() => setShowWithdrawalModal(true)} variant="outline" className="rounded-xl border-border px-6 h-11">
              <Minus className="mr-2 h-4 w-4" /> Withdraw
            </Button>
          </div>
        </header>

        {/* 2. CORE FINANCIAL KPIS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <BalanceCard
              title="Available Cash"
              amount={availableCash}
              icon={<Wallet className="h-5 w-5 text-primary" />}
              description="Ready for immediate reinvestment"
              format={formatCurrency}
          />
          <BalanceCard
              title="Net Deposits"
              amount={depositTotal}
              icon={<ArrowDownLeft className="h-5 w-5 text-emerald-500" />}
              description="Lifetime successful inflows"
              format={formatCurrency}
              variant="success"
          />
          <BalanceCard
              title="Total Withdrawals"
              amount={withdrawalTotal}
              icon={<ArrowUpRight className="h-5 w-5 text-rose-500" />}
              description="Lifetime successful outflows"
              format={formatCurrency}
              variant="destructive"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 3. CASH MOVEMENTS TABLE */}
          <TransactionHistory
              transactions={user.cashMovements}
              baseCurrency={user.settings.baseCurrency}
          />

          {/* 4. CONNECTED ACCOUNTS SIDEBAR */}
          <SettlementNodes
              accounts={user.connectedAccounts}
              kycStatus={user.settings.kycStatus}
              formatCurrency={formatCurrency}
          />
        </div>

        <DepositModal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            connectedAccounts={connectedAccounts} // Added this
            baseCurrency={currency}               // Added this
        />

        <WithdrawalModal
            isOpen={showWithdrawalModal}
            onClose={() => setShowWithdrawalModal(false)}
            availableBalance={availableCash}
            connectedAccounts={connectedAccounts} // Added this
        />
      </div>
  )
}

/** * SUB-COMPONENTS **/

function BalanceCard({ title, amount, icon, description, format, variant = 'default' }: any) {
  return (
      <Card className="border-none shadow-sm ring-1 ring-border/40 relative overflow-hidden">
        <div className={`absolute left-0 top-0 h-full w-1 ${variant === 'success' ? 'bg-emerald-500' : variant === 'destructive' ? 'bg-rose-500' : 'bg-primary'}`} />
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary/80">{icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
          </div>
          <p className="text-3xl font-serif font-bold tracking-tighter tabular-nums">{format(amount)}</p>
          <p className="text-[11px] text-muted-foreground mt-2">{description}</p>
        </CardContent>
      </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-none flex items-center gap-1 w-fit mx-auto"><CheckCircle2 className="w-3 h-3" /> Success</Badge>
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-none flex items-center gap-1 w-fit mx-auto"><Clock className="w-3 h-3" /> Processing</Badge>
    case 'failed':
      return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-none flex items-center gap-1 w-fit mx-auto"><AlertCircle className="w-3 h-3" /> Declined</Badge>
    default:
      return null
  }
}