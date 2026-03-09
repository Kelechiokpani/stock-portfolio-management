"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Clock,
  Euro,
  Info,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalLoader from "@/components/GlobalLoader";

// API & Chart
import { useGetMeQuery } from "@/app/services/features/auth/authApi";
import InvestmentHoldingsChart from "@/components/market/Chart/InvestmentHoldings";
import { useMemo } from "react";

export default function InvestmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const holdingId = params.id as string;

  const { data: response, isLoading } = useGetMeQuery();

  // Find the specific holding within Julian's portfolios
  const holding = useMemo(() => {
    if (!response?.user) return null;
    return response.user.portfolios
      .flatMap((p: any) => p.holdings)
      .find((h: any) => h.id === holdingId);
  }, [response, holdingId]);

  if (isLoading)
    return (
      <GlobalLoader
        message="Retrieving Asset Ledger"
        subtext="Decrypting position history..."
      />
    );

  if (!holding) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
        <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 ring-1 ring-slate-200 dark:ring-slate-800">
          <Info className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
          Asset Non-Existent
        </h2>
        <p className="text-slate-500 mb-8 mt-2 max-w-xs text-center font-medium">
          This position may have been liquidated or moved during a recent
          rebalancing.
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl px-8 border-slate-200 dark:border-slate-800 font-bold"
        >
          Return to Ledger
        </Button>
      </div>
    );
  }

  // LOGIC: Core Calculations
  const initialCostBasis = holding.avgPrice * holding.shares;
  const isPositive = holding.change >= 0;

  // Prep Chart Data for ONLY this specific asset
  const chartData = holding.performanceHistory.map((ph: any) => ({
    date: new Date(ph.date)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
      .toUpperCase(),
    totalValue: ph.value,
    totalGain: ph.gain,
  }));

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: response?.user?.settings?.baseCurrency,
    }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in slide-in-from-bottom-4 duration-1000">
      {/* 1. NAVIGATION & IDENTITY */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-12">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-14 w-14 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="font-black border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[9px] tracking-[0.2em] px-2 py-0.5"
              >
                {holding.portfolioType} Equity
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                Node Sync Active
              </Badge>
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {holding.name}{" "}
              <span className="text-slate-400 font-sans font-normal ml-2 tracking-tighter">
                ({holding.symbol})
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Live Quote Price
          </p>
          <p className="text-4xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
            {formatCurrency(holding.currentPrice)}
          </p>
        </div>
      </div>

      {/* 2. METRIC GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Net Position Value"
          value={formatCurrency(holding.value)}
          icon={<Euro className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Gain/Loss"
          value={formatCurrency(holding.change)}
          icon={
            isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )
          }
          trend={`${isPositive ? "+" : ""}${holding.changePercent.toFixed(2)}%`}
          isPositive={isPositive}
        />
        <MetricCard
          title="Inception Date"
          value={new Date(holding.purchaseDate).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
          icon={<Calendar className="h-5 w-5" />}
          trend="Initial Purchase"
        />
        <MetricCard
          title="Avg. Acquisition"
          value={formatCurrency(holding.avgPrice)}
          icon={<Target className="h-5 w-5" />}
          trend={`${holding.shares} Units Held`}
        />
      </div>

      {/* 3. PERFORMANCE CHART */}
      <Card className="border-none bg-white dark:bg-slate-900/40 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-slate-50 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-blue-500" />
              <CardTitle className="text-xl font-serif font-bold tracking-tight">
                Price Appreciation Ledger
              </CardTitle>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Time-Weighted Performance History
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[400px] w-full">
            <InvestmentHoldingsChart holding={holding} />
          </div>
        </CardContent>
      </Card>

      {/* 4. STRATEGIC POSITIONING */}
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-500" /> Capital Allocation
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
                    {(
                      (holding.value / response?.user?.totalBalance) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Global Portfolio Weight
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800"
                >
                  Exposure Limit: 15%
                </Badge>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 dark:bg-white transition-all duration-1000"
                  style={{
                    width: `${
                      (holding.value / response?.user?.totalBalance) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <TimelineItem
                label="Inception"
                sub={new Date(holding.purchaseDate).toLocaleDateString()}
              />
              <TimelineItem
                label="Volume"
                sub={`${holding.shares} ${
                  holding.symbol === "BTC" ? "Units" : "Shares"
                }`}
              />
              <TimelineItem
                label="Status"
                sub={isPositive ? "Profit" : "Drawdown"}
                highlight={!isPositive}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-slate-900 dark:bg-white shadow-2xl overflow-hidden">
          <CardHeader className="bg-slate-950 dark:bg-slate-50 p-6 border-b border-slate-800 dark:border-slate-200">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 font-mono">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Liquidity
              Handshake
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Position Cost
              </p>
              <p className="text-2xl font-mono font-black tracking-tighter text-white dark:text-slate-900">
                {formatCurrency(initialCostBasis)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Unrealized Result
              </p>
              <p
                className={`text-2xl font-mono font-black tracking-tighter ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatCurrency(holding.change)}
              </p>
            </div>
            <Button className="w-full h-12 rounded-xl bg-white text-black dark:bg-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all mt-4">
              Initiate Liquidation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** HELPER COMPONENTS **/

function MetricCard({ title, value, icon, trend, isPositive }: any) {
  return (
    <Card className="border-none shadow-xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 group hover:ring-slate-900 dark:hover:ring-white transition-all">
      <CardContent className="p-7">
        <div className="flex justify-between items-start mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-mono font-black tracking-tighter text-slate-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span
                className={`text-[10px] font-black tracking-widest uppercase ${
                  isPositive === undefined
                    ? "text-slate-400"
                    : isPositive
                    ? "text-emerald-500"
                    : "text-rose-500"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ label, sub, highlight }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p
        className={`text-xs font-bold uppercase tracking-tight ${
          highlight ? "text-rose-500" : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
