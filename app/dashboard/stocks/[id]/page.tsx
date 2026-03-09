"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Activity, ChevronDown, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. Import your real API Hook
import { useGetApprovedStocksQuery } from "@/app/services/features/market/marketApi";
import StockDetailChart from "@/components/market/Chart/StockDetailChart";

export default function StockDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("YTD");

  // 2. Fetch live data from the database
  const { data, isLoading } = useGetApprovedStocksQuery();

  // 3. Find the stock in the live data using the ID from the URL
  const stock = useMemo(() => {
    const rawStocks = (data as any)?.stocks || [];
    if (!params.id) return null;

    return rawStocks.find(
      (s: any) =>
        s.id === params.id ||
        s._id === params.id || // Checking both id formats just in case
        s.symbol?.toLowerCase() === (params.id as string).toLowerCase()
    );
  }, [data, params.id]);

  // 4. Show a loader while the database is being queried
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Fetching Live Terminal Data...
        </p>
      </div>
    );
  }

  // 5. Handle the case where the ID doesn't exist in the database
  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-background text-foreground">
        <div className="p-8 border-2 border-dashed border-border rounded-[2rem] text-center">
          <p className="font-black uppercase tracking-widest text-sm mb-2">
            Instrument Not Found
          </p>
          <p className="text-xs text-muted-foreground">ID: {params.id}</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/market")}
          variant="outline"
          className="rounded-xl font-bold uppercase text-[10px]"
        >
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="px-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Market Overview
        </span>
      </Button>

      {/* HEADER SECTION */}
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            {stock.name}
          </h1>
          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
            {stock.symbol}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl font-black tracking-tighter tabular-nums">
            $
            {stock.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
          <div
            className={`flex flex-col font-bold ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            <span className="text-xl leading-none">
              {isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
            <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest">
              ({isPositive ? "+" : ""}
              {(stock.change || 0).toFixed(2)}) Day
            </span>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium pt-2">
          <Activity className="h-3.5 w-3.5 text-emerald-500" />
          <span>
            Real-time Market Feed{" "}
            <span className="text-emerald-500 font-bold">Active</span>
          </span>
        </div>
      </header>

      {/* MAIN CHART CARD */}
      <Card className="border-border bg-card rounded-lg overflow-hidden shadow-2xl dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-5 border-b border-border/50">
          <div className="flex gap-6">
            <ChartAction label="Insights" />
            <ChartAction label="Terminal" />
          </div>
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest"
          >
            Live Feed
          </Badge>
        </CardHeader>

        <CardContent className="p-0 h-[480px] relative">
          <StockDetailChart stock={stock} />

          <div className="flex justify-center pb-8 gap-1.5 mt-[-60px] relative z-10">
            {["1D", "5D", "1M", "6M", "YTD", "1Y", "MAX"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${
                  timeRange === t
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border shadow-sm"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-card border-border p-10 rounded-lg">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> Key Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 text-foreground">
            <MetricItem label="Market Cap" value={stock.marketCap || "N/A"} />
            <MetricItem label="Volume (24h)" value={stock.volume || "N/A"} />
            <MetricItem
              label="Sector"
              value={stock.sector || "Institutional"}
            />
            <MetricItem label="P/E Ratio" value="28.42" />
            <MetricItem label="Yield" value={stock.yield || "1.38%"} />
            <MetricItem
              label="Day Range"
              value={`$${stock.price.toFixed(2)} - $${(
                stock.price * 1.01
              ).toFixed(2)}`}
            />
          </div>
        </Card>

        <Card className="bg-primary p-10 rounded-lg flex flex-col justify-between border-none shadow-2xl shadow-primary/20 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-black leading-tight italic uppercase">
              Trade Now
            </h2>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
              Execution Terminal
            </p>
          </div>
          <Button className="w-full h-16 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-xl">
            Open {stock.symbol} Position
          </Button>
        </Card>
      </div>
    </div>
  );
}

function ChartAction({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
      {label} <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-xl font-black font-mono tracking-tighter">{value}</p>
    </div>
  );
}
