"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Wallet,
  Activity,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalLoader from "@/components/GlobalLoader";
import TotalInvestmentChart from "@/components/market/Chart/TotalInvestmentChart";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

export default function InvestmentsPage() {
  const { data: response, isLoading } = useGetMeQuery();

  if (isLoading)
    return (
      <GlobalLoader
        message="Decrypting Portfolio Ledger"
        subtext="Accessing institutional asset data..."
      />
    );

  const user = response?.user;
  if (!user) return null;

  const portfolios = user.portfolios || [];

  // Flatten all holdings from the user's portfolios
  const allHoldings = portfolios.flatMap((p: any) =>
    p.holdings.map((h: any) => ({
      ...h,
      portfolioName: p.name,
    }))
  );

  // Calculations based on live data
  const totalInvested = allHoldings.reduce(
    (sum: number, h: any) => sum + h.avgPrice * h.shares,
    0
  );
  const totalCurrentValue = allHoldings.reduce(
    (sum: number, h: any) => sum + h.value,
    0
  );
  const totalGain = totalCurrentValue - totalInvested;
  const totalGainPercent =
    totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  // Performer logic
  const bestPerformer =
    allHoldings.length > 0
      ? allHoldings.reduce((best: any, current: any) =>
          current.changePercent > best.changePercent ? current : best
        )
      : null;

  const worstPerformer =
    allHoldings.length > 0
      ? allHoldings.reduce((worst: any, current: any) =>
          current.changePercent < worst.changePercent ? current : worst
        )
      : null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: user.settings.baseCurrency,
    }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. HERO HEADER */}
      <header className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 dark:border-slate-800 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border-slate-200 dark:border-slate-800"
            >
              {user.settings.accountType} Tier
            </Badge>
            {user.kycVerified ? (
              <Badge className="bg-emerald-500 text-white border-none flex gap-1.5 items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> System Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 border-none flex gap-1.5 items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" /> Audit Required
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Wealth Overview
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Aggregated intelligence across{" "}
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              {portfolios.length} active portfolios
            </span>
            .
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Total Assets Under Management
          </p>
          <p className="text-4xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
            {formatCurrency(totalCurrentValue)}
          </p>
        </div>
      </header>

      {/* 2. STATS GRID */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Principal Invested"
          value={formatCurrency(totalInvested)}
          icon={<Wallet className="w-5 h-5" />}
          theme="light"
        />
        <StatCard
          label="Unrealized P/L"
          value={formatCurrency(totalGain)}
          subValue={`${totalGain >= 0 ? "+" : ""}${totalGainPercent.toFixed(
            2
          )}%`}
          icon={
            totalGain >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )
          }
          theme={totalGain >= 0 ? "success" : "danger"}
          isTrend
        />
        <StatCard
          label="Settlement Cash"
          value={formatCurrency(user.availableCash)}
          icon={<CreditCard className="w-5 h-5" />}
          theme="light"
        />
        <StatCard
          label="Risk Exposure"
          value={user.settings.riskTolerance}
          subValue="Portfolio Profile"
          icon={<Activity className="w-5 h-5" />}
          theme="dark"
        />
      </section>

      {/* 3. CHART SECTION */}
      <Card className="border-none bg-white dark:bg-slate-900/40 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-slate-50 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3 text-blue-500" />
              <CardTitle className="text-xl font-serif font-bold">
                Equity Trajectory
              </CardTitle>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Institutional Growth Audit
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-8">
          <div className="h-[400px] w-full">
            <TotalInvestmentChart portfolio={portfolios} />
          </div>
        </CardContent>
      </Card>

      {/* 4. ASSET COMPOSITION */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Asset Composition{" "}
            <span className="text-slate-400 font-sans font-normal ml-2 text-lg">
              ({allHoldings.length})
            </span>
          </h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
            View All Assets <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allHoldings.map((holding: any) => (
            <Link
              key={holding.id}
              href={`/dashboard/investments/${holding.id}`}
              className="group"
            >
              <Card className="h-full border-none bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-500 hover:-translate-y-2 group-hover:ring-slate-900 dark:group-hover:ring-white">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                        {holding.portfolioName}
                      </p>
                      <CardTitle className="text-3xl font-mono font-black tracking-tighter">
                        {holding.symbol}
                      </CardTitle>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                        {holding.name}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                        Position
                      </p>
                      <p className="font-bold text-sm">
                        {holding.shares}{" "}
                        {holding.symbol === "BTC" ? "Unit" : "Shares"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                        Net Value
                      </p>
                      <p className="font-mono font-black text-lg tracking-tighter">
                        {formatCurrency(holding.value)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 ${
                        holding.change >= 0
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {holding.change >= 0 ? (
                        <TrendingUp className="h-3 h-3" />
                      ) : (
                        <TrendingDown className="h-3 h-3" />
                      )}
                      {holding.changePercent.toFixed(2)}%
                    </div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                      Inception:{" "}
                      {new Date(holding.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TOP & BOTTOM PERFORMERS */}
      {bestPerformer && (
        <section className="grid gap-8 md:grid-cols-2">
          <PerformerCard asset={bestPerformer} type="top" />
          <PerformerCard asset={worstPerformer} type="bottom" />
        </section>
      )}
    </div>
  );
}

/** * REUSABLE COMPONENTS **/

function StatCard({ label, value, subValue, icon, theme, isTrend }: any) {
  const themes: any = {
    light:
      "bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800",
    dark: "bg-slate-900 text-white dark:bg-white dark:text-black shadow-2xl",
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-500/20",
    danger:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-500/20",
  };

  return (
    <Card
      className={`border-none ${themes[theme]} transition-all duration-300`}
    >
      <CardContent className="p-7 flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              theme === "dark" ? "opacity-50" : "text-slate-400"
            }`}
          >
            {label}
          </p>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-2xl font-mono font-black tracking-tighter">
              {value}
            </h3>
            {subValue && (
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isTrend
                    ? subValue.includes("+")
                      ? "text-emerald-500"
                      : "text-rose-500"
                    : "opacity-60"
                }`}
              >
                {subValue}
              </span>
            )}
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl border ${
            theme === "dark"
              ? "bg-white/10 border-white/20"
              : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"
          }`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformerCard({
  asset,
  type,
}: {
  asset: any;
  type: "top" | "bottom";
}) {
  const isTop = type === "top";
  return (
    <Card
      className={`relative overflow-hidden border-none shadow-2xl ring-1 ${
        isTop
          ? "ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/[0.02]"
          : "ring-rose-500/20 bg-rose-50/30 dark:bg-rose-500/[0.02]"
      }`}
    >
      <div className={`absolute -top-6 -right-6 p-8 opacity-5 scale-150`}>
        {isTop ? (
          <TrendingUp className="h-32 w-32" />
        ) : (
          <TrendingDown className="h-32 w-32" />
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
          {isTop ? "Alpha Leader" : "Risk Underperformer"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-mono font-black tracking-tighter uppercase">
              {asset.symbol}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {asset.name}
            </p>
          </div>
          <Badge
            className={`text-lg font-mono font-black tracking-tighter px-6 py-2 rounded-xl shadow-lg border-none ${
              isTop ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {isTop ? "+" : ""}
            {asset.changePercent.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
