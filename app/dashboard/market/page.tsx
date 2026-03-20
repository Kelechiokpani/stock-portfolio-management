"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, TrendingUp, BarChart3, Globe, Loader2 } from "lucide-react";

// UI Components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { AssetTable } from "@/components/market/markets/asset-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Redux & API
import {
  setSearchQuery,
  setSortBy,
  updateMarketSummary,
} from "@/app/services/features/market/marketSlice";
import { useGetApprovedStocksQuery } from "@/app/services/features/market/marketApi";
import { Asset, AssetClass } from "@/components/data/data-type";
import { RootState } from "@/app/store";
import { AssetDetailsModal } from "@/components/market/markets/asset-table-details";
import { AssetTableFilter } from "@/components/market/markets/asset-table-filter";
import { CartHeader } from "@/app/services/hooks/CartHeader";
import { useCart } from "@/app/services/Provider/CartProvider";

export default function MarketplacePage() {
  const dispatch = useDispatch();
  const { buyCart, sellCart } = useCart();

  // State with explicit types to fix ts(2322)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeCategory, setActiveCategory] = useState<AssetClass>("all");

  const [activeFilters, setActiveFilters] = useState<{
    sectors: string[];
    sort: string | null;
  }>({
    sectors: [],
    sort: null,
  });

  const { searchQuery, sortBy, summary } = useSelector(
    (state: RootState) => state.marketUI
  );

  const { data, isLoading } = useGetApprovedStocksQuery();

  // Sync Summary
  useEffect(() => {
    if (data?.summary) {
      dispatch(updateMarketSummary(data?.summary));
    }
  }, [data, dispatch]);

  // const filteredAsset: any = useMemo(() => {
  //   const rawStocks = (data as any)?.stocks || [];
  //   if (rawStocks.length === 0) return [];

  //   let assets = [...rawStocks];

  //   // Global Category Tab Filter
  //   if (activeCategory !== "all") {
  //     assets = assets.filter(
  //       (a) => a.sector?.toLowerCase() === activeCategory.toLowerCase()
  //     );
  //   }

  //   // Sidebar Sector Filter
  //   if (activeFilters.sectors.length > 0) {
  //     assets = assets.filter((a) => activeFilters.sectors.includes(a.sector));
  //   }

  //   // Search Filter
  //   if (searchQuery) {
  //     const q = searchQuery.toLowerCase();
  //     assets = assets.filter(
  //       (a) =>
  //         a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
  //     );
  //   }

  //   // Sidebar Sort Filter
  //   if (activeFilters.sort === "gainers") {
  //     assets.sort((a, b) => b.changePercent - a.changePercent);
  //   } else if (activeFilters.sort === "losers") {
  //     assets.sort((a, b) => a.changePercent - b.changePercent);
  //   } else if (activeFilters.sort === "volume") {
  //     // This assumes you've parsed your volume string elsewhere, or just sort raw
  //     assets.sort((a, b) => b.volume.localeCompare(a.volume));
  //   } else if (sortBy === "price") {
  //     assets.sort((a, b) => b.price - a.price);
  //   }

  //   return assets;
  // }, [data, searchQuery, sortBy, activeCategory, activeFilters]);

  const filteredAsset: any = useMemo(() => {
    const rawStocks = (data as any)?.stocks || [];
    if (rawStocks.length === 0) return [];

    let assets = [...rawStocks];

    // --- FIX: Change Category Filter from 'sector' to 'market' ---
    if (activeCategory !== "all") {
      assets = assets.filter(
        (a) => a.market?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sidebar Sector Filter (Keep this as is if you still want to filter sectors within a market)
    if (activeFilters.sectors.length > 0) {
      assets = assets.filter((a) => activeFilters.sectors.includes(a.sector));
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }

    // ... rest of your sorting logic ...

    // Sidebar Sort Filter
    if (activeFilters.sort === "gainers") {
      assets.sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeFilters.sort === "losers") {
      assets.sort((a, b) => a.changePercent - b.changePercent);
    } else if (activeFilters.sort === "volume") {
      // This assumes you've parsed your volume string elsewhere, or just sort raw
      assets.sort((a, b) => b.volume.localeCompare(a.volume));
    } else if (sortBy === "price") {
      assets.sort((a, b) => b.price - a.price);
    }

    return assets;
  }, [data, searchQuery, sortBy, activeCategory, activeFilters]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing with Exchange Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="h-3 w-3" />
            {summary?.total || 0} Assets Verified •{" "}
            {summary?.markets?.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl shadow-sm font-bold text-[10px] uppercase"
            onClick={() => dispatch(setSortBy("change"))}
          >
            <TrendingUp className="mr-2 h-4 w-4 text-emerald-500" /> Gainers (
            {summary?.gainers || 0})
          </Button>
          <Button
            variant="outline"
            className="rounded-xl shadow-sm font-bold text-[10px] uppercase"
          >
            <BarChart3 className="mr-2 h-4 w-4 text-blue-500" /> High Volume
          </Button>
          <CartHeader buyCount={buyCart.length} sellCount={sellCart.length} />
        </div>
      </header>

      {/* SEARCH */}
      <div className="relative mb-12 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search symbols, sectors, or companies..."
          className="pl-16 h-18 text-lg rounded-[1rem] border-border bg-card shadow-xl dark:shadow-none 
               focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all 
               placeholder:text-muted-foreground/50 text-foreground"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as AssetClass)}
        className="space-y-8"
      >
        <div className="relative mb-8">
          <TabsList
            className="bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-2xl h-auto 
               flex flex-row justify-start gap-1.5 overflow-x-auto no-scrollbar 
               border border-slate-200/50 dark:border-white/5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Universal Trigger */}
            <TabsTrigger
              value="all"
              className="px-6 py-2.5 rounded-xl capitalize text-[11px] font-black tracking-widest 
                 whitespace-nowrap transition-all duration-200
                 text-slate-500 hover:text-slate-700
                 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 
                 data-[state=active]:text-slate-950 dark:data-[state=active]:text-white
                 data-
                 [state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              All
            </TabsTrigger>

            {/* Dynamic Sector Triggers */}
            {data?.summary?.markets?.map((sector: string) => (
              <TabsTrigger
                key={sector}
                value={sector.toLowerCase()}
                className="px-6 py-2.5 rounded-xl capitalize text-[11px] font-black tracking-widest 
                   whitespace-nowrap transition-all duration-200
                   text-slate-500 hover:text-slate-700
                   data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 
                   data-[state=active]:text-slate-950 dark:data-[state=active]:text-white
                   data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              >
                {sector.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Optional: Gradient Fade for scroll indication */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background/50 to-transparent pointer-events-none rounded-r-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Card className="sticky top-8 border-none shadow-2xl ring-1 ring-slate-100">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase">
                  Screener
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
                  Filtering {filteredAsset?.length} results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Fixed the type error by passing correct activeCategory */}

                <AssetTableFilter
                  assetClass={activeCategory}
                  onFiltersChange={(filters) => setActiveFilters(filters)}
                />
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Verified Instruments
              </h3>
              <Badge
                variant="secondary"
                className="text-[9px] font-black uppercase"
              >
                {sortBy} ASC
              </Badge>
            </div>

            <AssetTable
              assets={filteredAsset}
              assetClass={activeCategory}
              onRowClick={setSelectedAsset}
            />
          </main>
        </div>
      </Tabs>

      {/* Details Modal */}
      {selectedAsset && (
        <AssetDetailsModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* SUMMARY FOOTER */}
      <footer className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Market Status
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-bold uppercase tracking-tighter text-foreground">
              Live Trading
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total Listings
          </p>
          <p className="text-xl font-mono font-black mt-1">
            {summary?.total || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Active Gainers
          </p>
          <p className="text-xl font-mono font-black mt-1 text-emerald-500">
            {summary?.gainers || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Active Losers
          </p>
          <p className="text-xl font-mono font-black mt-1 text-rose-500">
            {summary?.losers || 0}
          </p>
        </div>
      </footer>
    </div>
  );
}
