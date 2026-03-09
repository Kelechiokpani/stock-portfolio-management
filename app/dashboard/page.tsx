"use client";

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
  PieChart,
  Activity,
  History,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useGetMeQuery } from "../services/features/auth/authApi";

export default function OverviewPage() {
  const { data, isLoading } = useGetMeQuery();
  const user = data?.user;

  // Formatting Helper
  const formatCurrency = (val: number) => {
    if (!user) return "";
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: user.settings.baseCurrency || "EUR",
    }).format(val);
  };

  // Loading State: Institutional Skeleton
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Syncing Ledger Data
          </p>
        </div>
      </div>
    );
  }

  // Error/Null Guard
  if (!user) return null;

  // Dynamic Allocation Logic
  const mainPortfolio = user.portfolios?.[0];
  const totalAssets =
    mainPortfolio?.holdings.reduce((sum: number, h: any) => sum + h.value, 0) ||
    1;

  const cryptoVal =
    mainPortfolio?.holdings.find((h: any) => h.symbol === "BTC")?.value || 0;
  const equityVal =
    mainPortfolio?.holdings.find((h: any) => h.symbol === "NVDA")?.value || 0;

  const cryptoPercent = Math.round((cryptoVal / totalAssets) * 100);
  const equityPercent = Math.round((equityVal / totalAssets) * 100);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user.profile.firstName}
          </h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {user.settings.accountType} Account • {user.settings.kycStatus}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/transfer">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-slate-800 font-bold px-6 h-11"
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
            </Button>
          </Link>
          <Link href="/dashboard/market">
            <Button className="rounded-xl shadow-2xl bg-slate-900 text-white dark:bg-white dark:text-black font-bold px-6 h-11 hover:opacity-90 transition-opacity">
              Invest Capital
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. TOP TIER KPIS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Net Worth"
          value={formatCurrency(user.totalBalance)}
          trend="+12.5%"
          isPositive={true}
        />
        <MetricCard
          label="Available Liquidity"
          value={formatCurrency(user.availableCash)}
          trend="CLEARED"
          icon={<Wallet className="h-4 w-4" />}
        />
        <MetricCard
          label="Risk Profile"
          value={user.settings.riskTolerance.toUpperCase()}
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          label="Settlement Nodes"
          value={user.connectedAccounts?.length || 0}
          trend="ACTIVE"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 3. PRIMARY HOLDINGS */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6 px-6">
              <div>
                <CardTitle className="font-serif text-xl font-bold">
                  Primary Holdings
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">
                  {mainPortfolio?.name || "Global Ledger"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {mainPortfolio?.holdings.map((asset: any) => (
                  <div
                    key={asset.id}
                    className="group flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center font-black text-[10px] text-white dark:text-black shadow-inner">
                        {asset.symbol}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {asset.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">
                          {asset.shares} Units • {asset.portfolioType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(asset.value)}
                      </p>
                      <p
                        className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${
                          asset.changePercent >= 0
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {asset.changePercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* RECENT MOVEMENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Capital Movements
              </h3>
              <Link href="/dashboard/funds">
                <Button
                  variant="ghost"
                  className="text-[10px] font-black uppercase tracking-widest h-auto p-0 hover:bg-transparent"
                >
                  View Full Ledger <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {user.cashMovements?.slice(0, 2).map((tx: any) => (
                <Card
                  key={tx.id}
                  className="border-none ring-1 ring-slate-100 dark:ring-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${
                        tx.type === "deposit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-tight truncate">
                        {tx.method}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {new Date(tx.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-black">
                        {formatCurrency(tx.amount)}
                      </p>
                      <Badge
                        variant="outline"
                        className="h-4 px-1.5 text-[8px] border-none font-black text-slate-400 uppercase tracking-widest"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute -top-10 -right-10 p-8 opacity-10">
              <PieChart className="h-48 w-48" />
            </div>
            <CardHeader className="pt-10 px-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                Global Allocation
              </CardTitle>
              <div className="pt-4">
                <p className="text-4xl font-serif font-bold tracking-tight">
                  {formatCurrency(user.totalBalance)}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Live Clearing Active
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-10 space-y-6 relative">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
                  <span>Crypto Exposure</span>
                  <span>{cryptoPercent}%</span>
                </div>
                <Progress
                  value={cryptoPercent}
                  className="h-1 bg-white/10 dark:bg-slate-200"
                  indicatorClassName="bg-emerald-400"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
                  <span>Equity / Growth</span>
                  <span>{equityPercent}%</span>
                </div>
                <Progress
                  value={equityPercent}
                  className="h-1 bg-white/10 dark:bg-slate-200"
                  indicatorClassName="bg-indigo-400"
                />
              </div>
              <Button className="w-full mt-6 bg-white text-black dark:bg-slate-900 dark:text-white hover:opacity-90 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-14 shadow-xl">
                Asset Audit
              </Button>
            </CardContent>
          </Card>

          {/* CONNECTED INSTITUTIONS */}
          <Card className="border-none bg-slate-50 dark:bg-white/5 ring-1 ring-slate-100 dark:ring-slate-800 shadow-inner rounded-3xl">
            <CardHeader className="pb-4 px-6">
              <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <History className="w-3 h-3" /> Settlement Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {user.connectedAccounts?.map((acc: any) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">
                        {acc.provider}
                      </p>
                      <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
                        NODE: ****{acc.lastFour}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, isPositive, icon }: any) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden relative group hover:shadow-lg transition-shadow">
      <CardContent className="p-7">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <div className="text-slate-200 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {icon || <TrendingUp className="h-4 w-4" />}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <Badge
              variant="outline"
              className={`text-[9px] font-black border-none tracking-widest ${
                isPositive ? "text-emerald-500" : "text-slate-400 opacity-60"
              }`}
            >
              {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
