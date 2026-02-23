"use client"

import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  MoreHorizontal,
  ArrowRightLeft,
  PieChart
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Use Julian's actual data structure
import { mockUsers } from "@/components/data/user-data"
import Link from "next/link";

export default function OverviewPage() {
  const user = mockUsers[0]
  if (!user) return null

  const formatCurrency = (val: number) =>
      new Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: user.settings.baseCurrency,
      }).format(val)

  return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

        {/* 1. WELCOME & QUICK ACTIONS */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              Welcome back, {user.profile.firstName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500"/>
              {user.settings.accountType.toUpperCase()} Account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/transfer" passHref>
              <Button variant="outline" className="rounded-xl border-border/60">
                <ArrowRightLeft className="mr-2 h-4 w-4"/> Transfer
              </Button>
            </Link>

            <Link href="/dashboard/market" passHref>
              <Button
                  className="rounded-xl shadow-lg shadow-primary/20 bg-foreground text-background hover:bg-foreground/90">
                Invest Cash
              </Button>
            </Link>
          </div>
        </header>

        {/* 2. TOP TIER KPIS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
              label="Total Net Worth"
              value={formatCurrency(user.totalBalance)}
              trend="+12.5%"
              isPositive={true}
          />
          <MetricCard
              label="Available Liquidity"
              value={formatCurrency(user.availableCash)}
              trend="Ready"
              icon={<Wallet className="h-4 w-4" />}
          />
          <MetricCard
              label="Risk Profile"
              value={user.settings.riskTolerance.toUpperCase()}
              icon={<ActivityIcon />}
          />
          <MetricCard
              label="Connected Nodes"
              value={user.connectedAccounts.length}
              trend="Active"
              icon={<CreditCard className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* 3. PORTFOLIO ALLOCATION (LEFT/CENTER) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-border/40 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-xl">Primary Holdings</CardTitle>
                  <CardDescription>Asset distribution for {user.portfolios[0].name}</CardDescription>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-1">
                  {user.portfolios[0].holdings.map((asset) => (
                      <div key={asset.id} className="group flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border/10 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center font-bold text-xs">
                            {asset.symbol}
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-none">{asset.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-1.5 uppercase font-medium tracking-tighter">
                              {asset.shares} Units • {asset.portfolioType}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black tabular-nums">{formatCurrency(asset.value)}</p>
                          <p className={`text-[11px] font-bold mt-1 ${asset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.changePercent}%
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* RECENT CASH ACTIVITY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Recent Movements</h3>
                <Button variant="link" className="text-xs text-primary p-0 h-auto">View All Ledger</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {user.cashMovements.slice(0, 2).map((tx) => (
                    <Card key={tx.id} className="border-none ring-1 ring-border/40 bg-card/50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {tx.type === 'deposit' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{tx.method}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-xs font-black tabular-nums">{formatCurrency(tx.amount)}</p>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </div>

          {/* 4. SIDEBAR ASSET SUMMARY (RIGHT) */}
          <div className="space-y-6">
            <Card className="border-none bg-foreground text-background shadow-xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <PieChart className="h-32 w-32" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm font-medium opacity-70 uppercase tracking-widest">Global Allocation</CardTitle>
                <div className="pt-2">
                  <p className="text-4xl font-serif font-bold tracking-tight">{formatCurrency(user.totalBalance)}</p>
                  <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +€4,120.44 This Month
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter opacity-70">
                    <span>Crypto Exposure</span>
                    <span>69%</span>
                  </div>
                  <Progress value={69} className="h-1.5 bg-white/10" indicatorClassName="bg-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter opacity-70">
                    <span>Equities / Growth</span>
                    <span>31%</span>
                  </div>
                  <Progress value={31} className="h-1.5 bg-white/10" indicatorClassName="bg-blue-400" />
                </div>
                <Button className="w-full mt-4 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-xs uppercase tracking-widest h-10">
                  Detailed Audit
                </Button>
              </CardContent>
            </Card>

            {/* CONNECTED INSTITUTIONS */}
            <Card className="border-none bg-secondary/20 ring-1 ring-border/40 shadow-inner">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Connected Settlement Nodes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.connectedAccounts.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="text-xs font-bold leading-none">{acc.provider}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">****{acc.lastFour}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
  )
}

/** SUB-COMPONENTS **/

function MetricCard({ label, value, trend, isPositive, icon }: any) {
  return (
      <Card className="border-none shadow-sm ring-1 ring-border/40 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
            <div className="text-primary/40">{icon}</div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-serif font-bold tracking-tight tabular-nums">{value}</p>
            {trend && (
                <Badge variant="outline" className={`text-[10px] font-black border-none ${isPositive ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {trend}
                </Badge>
            )}
          </div>
        </CardContent>
      </Card>
  )
}

function ActivityIcon() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
  )
}