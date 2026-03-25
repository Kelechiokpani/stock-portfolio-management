"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Activity,
  Loader2,
  Minus,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hooks & Providers
import { CartHeader } from "@/app/services/hooks/CartHeader";
import { useCart } from "@/app/services/Provider/CartProvider";
import { toast } from "sonner";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

export default function MarketplacePage() {
  const router = useRouter();
  const { buyCart, sellCart, addToSellCart } = useCart();
  const [quantity] = useState(1);

  const { data: response, isLoading } = useGetMeQuery();
  const userData = response?.user;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("value_desc");

  // 1. Comprehensive Data Mapping
  const { filteredAssets, summary } = useMemo(() => {
    // Flattening and preserving ALL data points from the API
    const allHoldings =
      userData?.portfolios?.flatMap((portfolio: any) =>
        portfolio.holdings.map((holding: any) => ({
          ...holding, // This spreads EVERYTHING: id, assetId, performanceHistory, marketTrend, avgPrice, etc.
          parentPortfolioId: portfolio.id,
          parentPortfolioName: portfolio.name,
        }))
      ) || [];

    const stats = {
      total: allHoldings.length,
      gainers: allHoldings.filter((h: any) => h.changePercent > 0).length,
      losers: allHoldings.filter((h: any) => h.changePercent < 0).length,
      portfolioTypes: Array.from(
        new Set(allHoldings.map((h: any) => h.portfolioType).filter(Boolean))
      ),
    };

    let list = [...allHoldings];

    if (activeTab !== "all") {
      list = list.filter(
        (a) => a.portfolioType?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) ||
          a.name?.toLowerCase().includes(q) ||
          a.companyName?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "value_desc":
          return b.value - a.value;
        case "gain_high":
          return b.changePercent - a.changePercent;
        case "gain_low":
          return a.changePercent - b.changePercent;
        case "price_high":
          return b.currentPrice - a.currentPrice;
        default:
          return 0;
      }
    });

    return { filteredAssets: list, summary: stats };
  }, [userData, activeTab, searchQuery, sortBy]);

  const handleSell = (asset: any) => {
    addToSellCart({
      symbol: asset.symbol,
      shares: quantity,
      price: asset.currentPrice,
    });
    toast.warning(`${asset.symbol} added to Sell Cart`);
  };

  if (isLoading)
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Initializing Terminal...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            Stocks Holdings
          </h1>
          <p className="text-sm text-muted-foreground font-medium italic">
            Managing{" "}
            <span className="text-primary font-bold">{summary.total}</span>{" "}
            assets for {userData?.profile?.firstName}{" "}
            {userData?.profile?.lastName}.
          </p>
        </div>
        <CartHeader buyCount={buyCart.length} sellCount={sellCart.length} />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Positions"
          value={summary.total}
          icon={Globe}
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Net Gainers"
          value={summary.gainers}
          icon={TrendingUp}
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Risk Profile"
          value={userData?.settings?.riskTolerance || "Medium"}
          icon={Activity}
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-900/20"
        />
        <StatCard
          label="Currency"
          value={userData?.settings?.baseCurrency || "EUR"}
          icon={BarChart3}
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
      </section>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="
      bg-white dark:bg-zinc-950 
      p-1.5 
      rounded-[1.2rem] 
      h-auto 
      flex 
      flex-row 
      flex-nowrap 
      justify-start 
      gap-1 
      border 
      border-slate-200 
      dark:border-zinc-800 
      overflow-x-auto 
      scrollbar-hide
    "
          >
            <TabsTrigger
              value="all"
              className="
        px-6 
        py-2.5 
        rounded-xl 
        text-[10px] 
        font-black 
        tracking-widest 
        uppercase 
        transition-all 
        data-[state=active]:bg-slate-100 
        dark:data-[state=active]:bg-zinc-900 
        data-[state=active]:text-primary
      "
            >
              Universal Feed
            </TabsTrigger>

            {summary.portfolioTypes.map((type: any) => (
              <TabsTrigger
                key={type}
                value={type.toLowerCase()}
                className="
          px-6 
          py-2.5 
          rounded-xl 
          text-[10px] 
          font-black 
          tracking-widest 
          uppercase 
          transition-all 
          data-[state=active]:bg-slate-100 
          dark:data-[state=active]:bg-zinc-900 
          data-[state=active]:text-primary
        "
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by Symbol, Asset Name or Company..."
              className="h-14 pl-14 rounded-[1.5rem] bg-card border-border text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="w-full lg:w-72 h-14 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest 
               bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 
               shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>

            <SelectContent
              className="rounded-2xl border-slate-200 dark:border-zinc-800 
               bg-white dark:bg-zinc-950 shadow-xl"
            >
              <SelectItem
                value="value_desc"
                className="font-bold text-[11px] uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 cursor-pointer"
              >
                Market Value
              </SelectItem>
              <SelectItem
                value="gain_high"
                className="font-bold text-[11px] uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 cursor-pointer"
              >
                Top Percent Gain
              </SelectItem>
              <SelectItem
                value="gain_low"
                className="font-bold text-[11px] uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 cursor-pointer"
              >
                Lowest Performance
              </SelectItem>
              <SelectItem
                value="price_high"
                className="font-bold text-[11px] uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 cursor-pointer"
              >
                Unit Price
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="space-y-4">
        {filteredAssets.map((asset) => (
          <Card
            key={asset.id}
            className="group border-border/40 hover:border-primary/40 transition-all rounded-[1rem] overflow-hidden"
          >
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Asset Identity */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tighter">
                      {asset.symbol}
                    </span>
                    <Badge className="bg-primary/10 text-primary text-[8px] font-black uppercase py-0 px-1.5">
                      {asset.marketTrend}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[200px]">
                    {asset.companyName}
                  </span>
                </div>
              </div>

              {/* Advanced Data Columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
                <div className="text-right md:text-left">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    Avg Cost
                  </p>
                  <p className="font-bold text-sm font-mono tracking-tighter">
                    €{asset.avgPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right md:text-left">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    Net Change
                  </p>
                  <p
                    className={`font-bold text-sm font-mono tracking-tighter ${
                      asset.change >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {asset.change >= 0 ? "+" : ""}€
                    {asset.change.toLocaleString()}
                  </p>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    Holding Type
                  </p>
                  <p className="font-bold text-[10px] uppercase">
                    {asset.portfolioType}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xl font-black font-mono tracking-tighter">
                    €{asset.currentPrice.toLocaleString()}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 font-black text-[11px] ${
                      asset.changePercent >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {asset.changePercent >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(asset.changePercent).toFixed(2)}%
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSell(asset)}
                    className="h-9 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px]"
                  >
                    Liquidate
                  </Button>
                  {/* <Button
                    onClick={() =>
                      router.push(`/dashboard/stocks/${asset.assetId}`)
                    }
                    size="icon"
                    variant="outline"
                    className="rounded-xl"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-card/40 rounded-[2rem]">
      <CardContent className="p-6 flex items-center gap-5">
        <div className={`p-4 rounded-[1.2rem] ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <p className="text-xl font-black tracking-tighter">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
