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

// API Hook
import { useGetApprovedStocksQuery } from "@/app/services/features/market/marketApi";
import { CartHeader } from "@/app/services/hooks/CartHeader";
import { useCart } from "@/app/services/Provider/CartProvider";
import { toast } from "sonner";

export default function MarketplacePage() {
  const router = useRouter();
  const { buyCart, sellCart, addToBuyCart, addToSellCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // 1. Real Data Fetching
  const { data, isLoading } = useGetApprovedStocksQuery();

  const handleSell = (asset: any) => {
    addToSellCart({
      symbol: asset.symbol,
      shares: quantity,
      price: asset.price,
      // symbol is required by your SellPayload interface
    });
    toast.warning(`${asset.symbol} added to Sell Cart`);
  };

  // 2. States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("volume_desc");

  // 3. Filter & Sort Logic (Functional)
  const filteredAssets = useMemo(() => {
    const rawStocks = (data as any)?.stocks || [];
    let list = [...rawStocks];

    // Sector Filter
    if (activeTab !== "all") {
      list = list.filter(
        (a) => a.sector?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) ||
          a.name?.toLowerCase().includes(q)
      );
    }

    // Professional Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "price_high":
          return b.price - a.price;
        case "gain_high":
          return b.changePercent - a.changePercent;
        case "gain_low":
          return a.changePercent - b.changePercent;
        case "volume_desc":
          return (b.volume || "").localeCompare(a.volume || "");
        default:
          return 0;
      }
    });

    return list;
  }, [data, activeTab, searchQuery, sortBy]);

  if (isLoading)
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Syncing Market Data...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-700">
      {/* Header & Brand Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-foreground">
            Trade Market
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl font-medium italic">
            Institutional-grade terminal accessing{" "}
            <span className="text-primary font-bold">
              {data?.summary?.total || 0}
            </span>{" "}
            verified assets.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy("gain_high")}
            className="rounded-full shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all font-bold text-[10px] uppercase tracking-wider"
          >
            <Zap className="w-3 h-3 mr-2 text-emerald-500 fill-emerald-500" />
            Top Gainers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy("volume_desc")}
            className="rounded-full shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all font-bold text-[10px] uppercase tracking-wider"
          >
            <Activity className="w-3 h-3 mr-2 text-blue-500" />
            Most Active
          </Button>
        </div>
      </section>

      {/* Hero Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Assets"
          value={data?.summary?.total || 0}
          icon={Globe}
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Live Gainers"
          value={data?.summary?.gainers || 0}
          icon={TrendingUp}
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Live Losers"
          value={data?.summary?.losers || 0}
          icon={TrendingDown}
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-900/20"
        />
        <StatCard
          label="Sectors"
          value={data?.summary?.sectors?.length || 0}
          icon={BarChart3}
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
      </section>

      {/* Navigation & Controls */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="
      bg-muted/40 
      p-1 
      rounded-[1.2rem] 
      h-auto 
      flex 
      flex-row 
      flex-nowrap 
      justify-start 
      gap-1 
      border 
      border-border 
      overflow-x-auto 
      scrollbar-hide
      [-ms-overflow-style:none] 
      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
    "
          >
            <TabsTrigger
              value="all"
              className="px-6 py-2.5 rounded-xl capitalize text-[11px] font-black tracking-widest data-[state=active]:bg-background whitespace-nowrap"
            >
              Universal
            </TabsTrigger>

            {data?.summary?.sectors?.map((sector: string) => (
              <TabsTrigger
                key={sector}
                value={sector.toLowerCase()}
                className="px-6 py-2.5 rounded-xl capitalize text-[11px] font-black tracking-widest data-[state=active]:bg-background whitespace-nowrap"
              >
                {sector.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={`Scan through ${activeTab} instruments...`}
              className="h-16 pl-14 rounded-[1.5rem] bg-card border-border shadow-sm text-lg focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-72 h-16 rounded-[1.5rem] border-border bg-card font-black text-[10px] uppercase tracking-[0.2em]">
              <SelectValue placeholder="SORT CRITERIA" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border p-2">
              <SelectItem
                value="volume_desc"
                className="rounded-lg py-3 font-bold text-[11px] uppercase"
              >
                Highest Volume
              </SelectItem>
              <SelectItem
                value="gain_high"
                className="rounded-lg py-3 font-bold text-[11px] uppercase"
              >
                Top Performers
              </SelectItem>
              <SelectItem
                value="gain_low"
                className="rounded-lg py-3 font-bold text-[11px] uppercase"
              >
                Worst Performers
              </SelectItem>
              <SelectItem
                value="price_high"
                className="rounded-lg py-3 font-bold text-[11px] uppercase"
              >
                Highest Price
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
            Institutional Feed ({filteredAssets.length})
          </h2>
          <div className="flex justify-end items-center gap-4 pt-4">
            <CartHeader buyCount={buyCart.length} sellCount={sellCart.length} />
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-[2rem] opacity-50">
            <p className="text-[11px] font-black uppercase tracking-widest italic">
              No assets matching parameters found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredAssets.map((asset) => (
              <Card
                key={asset._id}
                className="group border-border/40 hover:border-primary/40 hover:shadow-2xl dark:bg-card/40 transition-all cursor-pointer rounded-[1rem] overflow-hidden"
              >
                <CardContent className="p-4 md:p-4">
                  <div className="flex items-center justify-between">
                    {/* Ticker Info */}
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-md font-black tracking-tighter leading-none">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 truncate max-w-[180px]">
                          {asset.name}
                        </span>
                      </div>
                      <div className="hidden sm:flex gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-muted text-[9px] uppercase font-black tracking-tighter rounded-md"
                        >
                          {asset.sector || "Verified"}
                        </Badge>
                      </div>
                    </div>

                    {/* Pricing & Performance */}
                    <div className="flex items-center gap-8 md:gap-16">
                      <div className="hidden lg:block text-right">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                          Vol (24h)
                        </p>
                        <p className="font-bold text-sm font-mono tracking-tighter">
                          {asset.volume}
                        </p>
                      </div>

                      <div className="min-w-[120px] text-right">
                        <p className="text-xl md:text-sm font-black font-mono tracking-tighter">
                          $
                          {asset.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
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

                      <Button
                        onClick={() => handleSell(asset)}
                        className="h-6 rounded-2xl bg-red-300 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2"
                      >
                        <Zap className="h-2 w-2" /> Sell
                      </Button>

                      <Button
                        onClick={() =>
                          router.push(`/dashboard/stocks/${asset._id}`)
                        }
                        size="icon"
                        variant="ghost"
                        className="rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Sub-component for clean organization
function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[2rem]">
      <CardContent className="p-6 flex items-center gap-5">
        <div className={`p-4 rounded-[1.2rem] ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-black tabular-nums tracking-tighter">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
