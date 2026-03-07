"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  LayoutDashboard,
  Search,
  Save,
  BarChart3,
  Filter,
  Zap,
  AlertCircle,
  RefreshCw,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

import {
  useGetMarketAssetsQuery,
  useUpdateMarketAssetMutation,
} from "@/app/services/features/admin/adminApi";

export default function MarketVisibilityPage() {
  const { data: rawResponse, isLoading, refetch } = useGetMarketAssetsQuery();
  const [updateAsset, { isLoading: isUpdating }] =
    useUpdateMarketAssetMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const stocksList = useMemo(() => rawResponse?.stocks || [], [rawResponse]);

  const categories = useMemo(() => {
    const sectors = stocksList.map((s: any) => s.sector);
    return Array.from(new Set(sectors)).filter(Boolean) as string[];
  }, [stocksList]);

  const handleToggle = async (
    id: string,
    platform: "web" | "dashboard",
    currentState: boolean
  ) => {
    try {
      await updateAsset({
        id,
        data: {
          [`isVisible${platform === "web" ? "Web" : "Dash"}`]: !currentState,
        },
      }).unwrap();
      toast.success("Infrastructure Synced");
    } catch (err) {
      toast.error("Failed to update edge node");
    }
  };

  if (isLoading)
    return (
      <GlobalLoader
        message="Fetching Market Data"
        subtext="Analyzing active tickers..."
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Node Status: Active
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter font-serif italic">
              Market Visibility
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Direct management of {stocksList.length} global equity feeds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="h-11 px-6 dark:bg-slate-900 dark:border-slate-800"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              Hard Refresh
            </Button>
            <Button className="h-11 px-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 shadow-xl transition-all">
              <Save className="w-4 h-4 mr-2" /> Push to Production
            </Button>
          </div>
        </header>

        {/* --- LIVE STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Market Cap"
            value="$12.4T"
            icon={BarChart3}
            color="text-blue-500"
          />
          <StatCard
            label="Bullish Sentiment"
            value="82%"
            icon={TrendingUp}
            color="text-emerald-500"
          />
          <StatCard
            label="Avg Latency"
            value="14ms"
            icon={Zap}
            color="text-amber-500"
          />
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search symbol (e.g. AAPL)..."
              className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- INTERFACE --- */}
        <Tabs defaultValue={categories[0]} className="w-full space-y-6">
          <TabsList className="bg-slate-200/50 dark:bg-slate-900 p-1 h-12 w-fit border border-slate-200 dark:border-slate-800">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="capitalize px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="outline-none"
            >
              <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">Ticker</th>
                        <th className="px-6 py-4">Price / Change</th>
                        <th className="px-6 py-4">Market Cap</th>
                        <th className="px-6 py-4 text-center">Public Web</th>
                        <th className="px-6 py-4 text-center">Dashboard</th>
                        <th className="px-6 py-4 text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stocksList
                        .filter((s: any) => s.sector === category)
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
                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shadow-md">
                                  {stock.symbol.slice(0, 3)}
                                </div>
                                <div>
                                  <p className="font-bold text-sm leading-none mb-1">
                                    {stock.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                    {stock.symbol} • {stock.market}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold">
                                ${stock.price.toFixed(2)}
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
                            </td>
                            <td className="px-6 py-5 text-xs font-mono text-slate-500 dark:text-slate-400">
                              {stock.marketCap}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <Switch
                                checked={stock.isVisibleWeb}
                                disabled={isUpdating}
                                onCheckedChange={() =>
                                  handleToggle(
                                    stock._id,
                                    "web",
                                    stock.isVisibleWeb
                                  )
                                }
                                className="data-[state=checked]:bg-emerald-500 scale-90 mx-auto"
                              />
                            </td>
                            <td className="px-6 py-5 text-center">
                              <Switch
                                checked={stock.isVisibleDash}
                                disabled={isUpdating}
                                onCheckedChange={() =>
                                  handleToggle(
                                    stock._id,
                                    "dashboard",
                                    stock.isVisibleDash
                                  )
                                }
                                className="data-[state=checked]:bg-blue-600 scale-90 mx-auto"
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
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* --- OPS FOOTER --- */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              System Log
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300/80 leading-relaxed">
              Showing {stocksList.length} assets across {categories.length}{" "}
              sectors. Edge nodes are synchronized with the primary NASDAQ data
              stream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-black">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-800`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
