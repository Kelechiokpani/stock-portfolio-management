"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  BarChart3,
  Zap,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

import {
  useGetMarketAssetsQuery,
  useUpdateMarketAssetMutation,
  useDeleteMarketAssetMutation,
} from "@/app/services/features/admin/adminApi";

export default function MarketVisibilityPage() {
  const { data: rawResponse, isLoading } = useGetMarketAssetsQuery();

  const [updateAsset, { isLoading: isUpdating }] =
    useUpdateMarketAssetMutation();
  const [deleteAsset, { isLoading: isDeleting }] =
    useDeleteMarketAssetMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const stocksList = useMemo(() => rawResponse?.stocks || [], [rawResponse]);

  // FIXED: Logic now pulls unique 'market' values instead of 'sector'
  const categories = useMemo(() => {
    const markets = stocksList.map((s: any) => s.market);
    // filter(Boolean) ensures we don't have empty tabs if data is missing
    return Array.from(new Set(markets)).filter(Boolean) as string[];
  }, [stocksList]);

  // --- DYNAMIC CALCULATIONS ---
  const stats = useMemo(() => {
    if (!stocksList || stocksList.length === 0) {
      return { totalCap: "$0", bullish: "0%", bearish: "0%", count: 0 };
    }

    const parseCurrencyString = (str: string) => {
      if (!str) return 0;
      const multiplier = str.endsWith("T")
        ? 1e12
        : str.endsWith("B")
        ? 1e9
        : str.endsWith("M")
        ? 1e6
        : 1;
      return parseFloat(str.replace(/[TBM$]/g, "")) * multiplier;
    };

    const formatCurrency = (num: number) => {
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      return `$${(num / 1e6).toFixed(2)}M`;
    };

    const totalCapRaw = stocksList.reduce(
      (acc: number, curr: any) => acc + parseCurrencyString(curr.marketCap),
      0
    );
    const bullishCount = stocksList.filter((s: any) => s.change > 0).length;
    const bearishCount = stocksList.filter((s: any) => s.change < 0).length;
    const total = stocksList.length;

    return {
      totalCap: formatCurrency(totalCapRaw),
      bullish: `${((bullishCount / total) * 100).toFixed(0)}%`,
      bearish: `${((bearishCount / total) * 100).toFixed(0)}%`,
      count: total,
    };
  }, [stocksList]);

  const handleToggle = async (stock: any, type: "published") => {
    const payload = {
      ...stock,
      isPublished:
        type === "published" ? !stock.isPublished : stock.isPublished,
    };

    try {
      await updateAsset({ id: stock._id, data: payload }).unwrap();
      toast.success(`${stock.symbol} sync successful`);
    } catch (err) {
      toast.error("Cloud synchronization failed");
    }
  };

  const handleDelete = async (id: string, symbol: string) => {
    if (!confirm(`Permanently decommission ${symbol}?`)) return;
    try {
      await deleteAsset(id).unwrap();
      toast.success(`${symbol} purged from index`);
    } catch (err) {
      toast.error("Failed to delete asset");
    }
  };

  if (isLoading) return <GlobalLoader message="Analyzing Market Feeds..." />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-8">
        {/* --- HEADER --- */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Node Status: Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter font-serif italic">
              Market Visibility
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Direct management of {stocksList.length} exchange platforms.
            </p>
          </div>
        </header>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Total Market Cap"
            value={stats.totalCap}
            icon={BarChart3}
            color="text-blue-500"
          />
          <StatCard
            label="Bullish Sentiment"
            value={stats.bullish}
            icon={TrendingUp}
            color="text-emerald-500"
          />
          <StatCard
            label="Bearish Sentiment"
            value={stats.bearish}
            icon={TrendingDown}
            color="text-rose-500"
          />
          <StatCard
            label="Total Market Assets"
            value={stats.count.toString()}
            icon={Zap}
            color="text-amber-500"
          />
        </div>

        {/* --- SEARCH --- */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search symbol or exchange..."
            className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- DATA INTERFACE --- */}
        <Tabs defaultValue={categories[0]} className="w-full space-y-6">
          <div className="relative w-full group">
            <TabsList className="flex h-12 w-full items-center justify-start p-1 bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide sm:w-fit sm:max-w-full">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="capitalize px-6 h-full font-bold text-sm tracking-tight transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md flex-shrink-0 rounded-lg"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((marketName) => (
            <TabsContent
              key={marketName}
              value={marketName}
              className="outline-none"
            >
              <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-left min-w-[950px] lg:min-w-full">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">Asset</th>
                        <th className="px-6 py-4">Price / Change</th>
                        <th className="px-6 py-4 hidden md:table-cell">
                          Market Cap
                        </th>
                        <th className="px-6 py-4 text-center">Sector</th>
                        <th className="px-6 py-4 text-center">Volume</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Trend</th>
                        <th className="px-6 py-4 text-right">Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stocksList
                        // CHANGED: Filter by marketName now
                        .filter((s: any) => s.market === marketName)
                        .filter(
                          (s: any) =>
                            s.symbol
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            s.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((stock: any) => (
                          <tr
                            key={stock._id}
                            className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                              isDeleting ? "opacity-20" : ""
                            }`}
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3 min-w-[140px]">
                                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shadow-md uppercase">
                                  {stock.symbol.slice(0, 3)}
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-sm leading-none mb-1 truncate">
                                    {stock.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                                    {stock.symbol}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="min-w-[100px]">
                                <p className="text-sm font-bold">
                                  ${stock.price?.toLocaleString()}
                                </p>
                                <p
                                  className={`text-[10px] font-bold ${
                                    stock.change >= 0
                                      ? "text-emerald-500"
                                      : "text-rose-500"
                                  }`}
                                >
                                  {stock.change >= 0 ? "+" : ""}
                                  {stock.changePercent}%
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs font-mono text-slate-500 hidden md:table-cell">
                              {stock.marketCap || "N/A"}
                            </td>
                            <td className="px-6 py-5 text-center text-xs font-medium text-slate-500">
                              {stock.sector}
                            </td>
                            <td className="px-6 py-5 text-center text-xs font-mono text-slate-500">
                              {stock.volume || "0"}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <Switch
                                checked={stock.isPublished}
                                disabled={isUpdating}
                                onCheckedChange={() =>
                                  handleToggle(stock, "published")
                                }
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </td>
                            <td className="px-6 py-5 text-right">
                              {stock.marketTrend === "bullish" ? (
                                <div className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                  <TrendingUp className="w-3 h-3" /> Bull
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                  <TrendingDown className="w-3 h-3" /> Bear
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDelete(stock._id, stock.symbol)
                                    }
                                    className="text-rose-500 focus:text-rose-500 cursor-pointer font-bold"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />{" "}
                                    Decommission
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* --- SYSTEM LOG --- */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              System Log
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Infrastructure synchronized. Exchange feeds grouping validated for{" "}
              {categories.join(", ")}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, className }: any) {
  return (
    <Card
      className={`border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            {label}
          </p>
          <p className="text-2xl font-black">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
