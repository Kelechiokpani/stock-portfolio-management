"use client"

import { useState } from "react"
import {
  Send,
  TrendingUp,
  Plus,
  ArrowRightLeft,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Your project-specific imports
import { mockUsers } from "@/components/data/user-data"
import { TransferPortfolioModal } from "@/components/Modal-Layout/transfer-portfolio-modal"
import {PortfolioTransferHistory} from "@/components/Modal-Layout/PortfolioTransferHistory";



export default function TransfersPage() {
  const [showTransferModal, setShowTransferModal] = useState(false)
  const user = mockUsers[0] // Julian Bernhardt

  if (!user) return null

  const formatCurrency = (val: number) =>
      new Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: user.settings.baseCurrency,
      }).format(val)

  return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 animate-in fade-in duration-500">

        {/* HEADER */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5 uppercase tracking-tighter text-[10px] font-bold">
              Network Operations
            </Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl">Transfer Center</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and audit your cross-platform asset migrations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl h-11 px-6 border-border/60">
              View Reports
            </Button>
            <Button onClick={() => setShowTransferModal(true)} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Transfer
            </Button>
          </div>
        </header>

        {/* STATS OVERVIEW */}
        <div className="grid gap-6 sm:grid-cols-3">
          <StatsCard title="Liquid Cash" value={formatCurrency(user.availableCash)} icon={<Wallet className="text-primary" />} description="Ready for deployment" />
          <StatsCard title="In-Transit" value={formatCurrency(1200)} icon={<Activity className="text-amber-500" />} description="Pending verification" />
          <StatsCard title="Security Level" value={user.settings.kycStatus} icon={<ShieldCheck className="text-emerald-500" />} isBadge />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT: CASH MOVEMENT TABS */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="received" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-secondary/50 p-1 rounded-xl border border-border/40">
                  <TabsTrigger value="received" className="rounded-lg px-8 data-[state=active]:bg-background">Deposits</TabsTrigger>
                  <TabsTrigger value="sent" className="rounded-lg px-8 data-[state=active]:bg-background">Withdrawals</TabsTrigger>
                </TabsList>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Cash Operations</p>
              </div>

              <TabsContent value="sent" className="space-y-4 outline-none">
                {user.cashMovements.filter(m => m.type === "withdrawal").length === 0 ? (
                    <EmptyState message="No withdrawal history" />
                ) : (
                    user.cashMovements.filter(m => m.type === "withdrawal").map((m) => (
                        <TransferItem key={m.id} title={m.method} date={m.date} value={formatCurrency(m.amount)} status={m.status} isOutbound />
                    ))
                )}
              </TabsContent>

              <TabsContent value="received" className="space-y-4 outline-none">
                {user.cashMovements.filter(m => m.type === "deposit").map((m) => (
                    <TransferItem key={m.id} title={m.method} date={m.date} value={formatCurrency(m.amount)} status={m.status} isOutbound={false} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: STOCK LEDGER & PROTOCOL */}
          <div className="space-y-6">
            {/* Using Julian's corrected stockTransfers data here */}
            <PortfolioTransferHistory
                transfers={user.stockTransfers}
                baseCurrency={user.settings.baseCurrency}
            />

            <Card className="border-none bg-secondary/30 shadow-inner ring-1 ring-border/40">
              <CardHeader><CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Compliance Guidelines</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <ProtocolStep step="01" label="Portfolio Selection" sub="Select holdings to migrate" />
                <ProtocolStep step="02" label="KYC Handshake" sub="Recipient must be tier-1 verified" />
                <ProtocolStep step="03" label="Escrow Lock" sub="24h cooling period for large assets" />
              </CardContent>
            </Card>
          </div>
        </div>

        <TransferPortfolioModal
            isOpen={showTransferModal}
            onClose={() => setShowTransferModal(false)}
            portfolios={user.portfolios}
        />
      </div>
  )
}

/** HELPER COMPONENTS **/

function StatsCard({ title, value, icon, description, isBadge }: any) {
  return (
      <Card className="border-none shadow-sm ring-1 ring-border/40">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50">{icon}</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
            {isBadge ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none uppercase text-[10px] mt-1 px-2">{value}</Badge>
            ) : (
                <p className="text-2xl font-serif font-bold tabular-nums leading-none mt-1">{value}</p>
            )}
            {description && <p className="text-[10px] text-muted-foreground mt-1 font-medium">{description}</p>}
          </div>
        </CardContent>
      </Card>
  )
}

function ProtocolStep({ step, label, sub }: any) {
  return (
      <div className="flex gap-3 items-start">
        <span className="text-[10px] font-black text-primary/40 mt-0.5">{step}</span>
        <div>
          <p className="text-xs font-bold text-foreground leading-none">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
        </div>
      </div>
  )
}

function TransferItem({ title, date, value, status, isOutbound }: any) {
  const statusColors: any = {
    completed: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    failed: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  }

  return (
      <Card className="border-none shadow-sm ring-1 ring-border/40 hover:ring-primary/30 transition-all overflow-hidden bg-card/40">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${isOutbound ? 'bg-rose-500/5 text-rose-500' : 'bg-emerald-500/5 text-emerald-500'}`}>
              {isOutbound ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-bold text-sm flex items-center gap-2">{title}</p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold tabular-nums ${isOutbound ? 'text-foreground' : 'text-emerald-600'}`}>
              {isOutbound ? '-' : '+'}{value}
            </p>
            <Badge variant="outline" className={`text-[9px] font-black uppercase mt-1 px-1.5 h-4 border-none ${statusColors[status]}`}>
              {status}
            </Badge>
          </div>
        </div>
      </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
      <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-2xl border-border/40">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{message}</p>
      </div>
  )
}