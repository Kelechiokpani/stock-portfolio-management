"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search,
    TrendingUp,
    TrendingDown,
    Filter,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Zap,
    Activity
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data & Types
import {
    Stocks,
    AllBonds,
    ETFs,
    MutualFunds,
    Commodities,
    Gold,
    Futures,
    Options,
    Bitcoin,
    type AssetClass,
    type Asset,
} from "@/components/data/market-data"

/**
 * Helper to parse volume strings like "1.2M" or "500K" into sortable numbers
 */
const parseVolume = (vol: string): number => {
    if (!vol) return 0
    const val = parseFloat(vol.replace(/[^\d.]/g, ""))
    const multiplier = vol.toLowerCase().includes("b") ? 1e9 : vol.toLowerCase().includes("m") ? 1e6 : vol.toLowerCase().includes("k") ? 1e3 : 1
    return val * multiplier
}

export default function MarketplacePage() {
    const router = useRouter()

    // State
    const [activeTab, setActiveTab] = useState<AssetClass>("stock")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("volume_desc")

    // Map data sources to tabs
    const assetMap: Record<AssetClass, Asset[]> = {
        stock: Stocks,
        bond: AllBonds,
        etf: ETFs,
        mutual_fund: MutualFunds,
        commodity: Commodities,
        gold: Gold,
        futures: Futures,
        options: Options,
        bitcoin: Bitcoin
    }

    // Filter & Sort Logic
    const filteredAssets = useMemo(() => {
        let list = [...(assetMap[activeTab] || [])]

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            list = list.filter(a => a.symbol.toLowerCase().includes(q) || a.name?.toLowerCase().includes(q))
        }

        // Sort
        list.sort((a: any, b: any) => {
            switch (sortBy) {
                case "price_high": return b.price - a.price
                case "price_low": return a.price - b.price
                case "gain_high": return b.changePercent - a.changePercent
                case "gain_low": return a.changePercent - b.changePercent
                case "volume_desc": return parseVolume(b.volume) - parseVolume(a.volume)
                default: return 0
            }
        })

        return list
    }, [activeTab, searchQuery, sortBy])

    // Summary Stats Logic
    const stats = useMemo(() => {
        const currentList = assetMap[activeTab] || []
        return {
            total: currentList.length,
            gainers: currentList.filter(a => a.changePercent > 0).length,
            losers: currentList.filter(a => a.changePercent < 0).length,
            avgVol: currentList.length > 0 ? "High" : "N/A"
        }
    }, [activeTab])

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-700">

            {/* Header & Brand Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-1xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                        Marketplace
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl font-medium">
                        Institutional-grade research across <span className="text-primary">9 global asset classes</span>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                        <Zap className="w-4 h-4 mr-2 text-emerald-500 fill-emerald-500" />
                        Top Gainers
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-all">
                        <Activity className="w-4 h-4 mr-2 text-blue-500" />
                        Most Active
                    </Button>
                </div>
            </section>

            {/* Hero Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Assets", value: stats.total, icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Active Gainers", value: stats.gainers, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Active Losers", value: stats.losers, icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Market Vol.", value: stats.avgVol, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Navigation & Controls */}
            <div className="space-y-6">
                <Tabs defaultValue="stock" onValueChange={(v) => setActiveTab(v as AssetClass)}>
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start gap-1">
                        {Object.keys(assetMap).map((key) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="px-5 py-2.5 rounded-lg dark:text-black capitalize text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                {key.replace("_", " ")}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={`Search ${activeTab.replace("_", " ")}s...`}
                            className="h-12 pl-12 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full lg:w-64 h-12 rounded-xl border-muted-foreground/20 bg-background focus:ring-0">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>

                        <SelectContent
                            className="z-50 bg-white dark:bg-zinc-950 text-popover-foreground border-border shadow-2xl min-w-[14rem] rounded-xl overflow-hidden p-1 border opacity-100"
                        >
                            {[
                                { value: "volume_desc", label: "Highest Volume" },
                                { value: "gain_high", label: "Top Performers" },
                                { value: "gain_low", label: "Worst Performers" },
                                { value: "price_high", label: "Highest Price" },
                                { value: "price_low", label: "Lowest Price" },
                            ].map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                    className="relative flex w-full cursor-pointer select-none items-center justify-between py-3 px-4 outline-none focus:bg-accent focus:text-accent-foreground rounded-md transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                    <span className="font-medium text-sm">{item.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
            </div>

            {/* Results Table/List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Market Results ({filteredAssets.length})
                    </h2>
                </div>

                {filteredAssets.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                        <p className="text-muted-foreground italic">No assets found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredAssets.map((asset) => (
                            <Card
                                key={asset.id}
                                className="group border-muted/40 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                                onClick={() => router.push(`/dashboard/stocks/${asset.symbol}`)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-between p-5 md:p-6">
                                        {/* Ticker Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black tracking-tight">{asset.symbol}</span>
                                                <span className="text-sm text-muted-foreground font-medium truncate max-w-[150px] md:max-w-xs">
                                                      {asset.name}
                                                    </span>
                                            </div>
                                            <div className="hidden sm:flex gap-2">
                                                <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase font-bold tracking-tighter">
                                                    {activeTab}
                                                </Badge>
                                                {asset.sector && (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/20 uppercase font-bold tracking-tighter">
                                                        {asset.sector}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pricing & Performance */}
                                        <div className="flex items-center gap-8 md:gap-16 text-right">
                                            <div className="hidden lg:block">
                                                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Volume</p>
                                                <p className="font-semibold text-sm">{asset.volume}</p>
                                            </div>

                                            <div className="min-w-[100px]">
                                                <p className="text-lg md:text-xl font-bold font-mono">
                                                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                                <div className={`flex items-center justify-end gap-1 font-bold text-sm ${
                                                    asset.changePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                                                }`}>
                                                    {asset.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {Math.abs(asset.changePercent).toFixed(2)}%
                                                </div>
                                            </div>

                                            <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
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
    )
}



// "use client"
//
// import { useState, useMemo } from "react"
// import {
//   Search,
//   TrendingUp,
//   TrendingDown,
//   Filter,
//   Globe,
//   ArrowUpRight,
//   ArrowDownLeft,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { mockStocks, mockStockMarkets } from "@/components/market/mock-data"
// import { useRouter } from "next/navigation"
//
//
//
// export default function StocksPage() {
//   const router = useRouter()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedMarket, setSelectedMarket] = useState("all")
//   const [selectedSector, setSelectedSector] = useState("all")
//   const [sortBy, setSortBy] = useState("name")
//
//   // Get unique sectors
//   const sectors = Array.from(new Set(mockStocks.map((s) => s.sector))).sort()
//
//
//   // Filter and sort stocks
//   const filteredStocks = useMemo(() => {
//     let filtered = mockStocks.filter((stock) => {
//       const matchesSearch =
//         stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         stock.name.toLowerCase().includes(searchQuery.toLowerCase())
//       const matchesMarket =
//         selectedMarket === "all" || stock.market === selectedMarket
//       const matchesSector =
//         selectedSector === "all" || stock.sector === selectedSector
//
//       return matchesSearch && matchesMarket && matchesSector
//     })
//
//     // Sort
//     switch (sortBy) {
//       case "name":
//         filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
//         break
//       case "price_high":
//         filtered = filtered.sort((a, b) => b.price - a.price)
//         break
//       case "price_low":
//         filtered = filtered.sort((a, b) => a.price - b.price)
//         break
//       case "gain_high":
//         filtered = filtered.sort((a, b) => b.changePercent - a.changePercent)
//         break
//       case "gain_low":
//         filtered = filtered.sort((a, b) => a.changePercent - b.changePercent)
//         break
//       case "volume":
//         filtered = filtered.sort((a, b) => {
//           const aVol = parseInt(a.volume.replace(/[A-Za-z]/g, ""))
//           const bVol = parseInt(b.volume.replace(/[A-Za-z]/g, ""))
//           return bVol - aVol
//         })
//         break
//       default:
//         break
//     }
//
//     return filtered
//   }, [searchQuery, selectedMarket, selectedSector, sortBy])
//
//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
//             Stock Browser
//           </h1>
//           <p className="mt-1 text-muted-foreground">
//             Explore and research available stocks
//           </p>
//         </div>
//       </div>
//
//       {/* Stats Footer */}
//       <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
//         <Card>
//           <CardContent className="flex items-center gap-4 pt-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <Globe className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Total Stocks</p>
//               <p className="text-2xl font-bold text-foreground">
//                 {mockStocks.length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardContent className="flex items-center gap-4 pt-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
//               <TrendingUp className="h-5 w-5 text-success" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Gainers</p>
//               <p className="text-2xl font-bold text-foreground">
//                 {mockStocks.filter((s) => s.change > 0).length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardContent className="flex items-center gap-4 pt-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
//               <TrendingDown className="h-5 w-5 text-destructive" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Losers</p>
//               <p className="text-2xl font-bold text-foreground">
//                 {mockStocks.filter((s) => s.change < 0).length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardContent className="flex items-center gap-4 pt-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
//               <Filter className="h-5 w-5 text-info" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Sectors</p>
//               <p className="text-2xl font-bold text-foreground">
//                 {sectors.length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//
//       {/* Search & Filters */}
//       <div className="mt-8 space-y-4">
//         <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
//           <div className="flex-1">
//             <label className="text-sm font-medium text-foreground mb-2 block">
//               Search Stocks
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <Input
//                 placeholder="Search by symbol or name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-foreground mb-2 block">
//               Market
//             </label>
//             <Select value={selectedMarket} onValueChange={setSelectedMarket}>
//               <SelectTrigger className="w-full lg:w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Markets</SelectItem>
//                 {mockStockMarkets.map((market:any) => (
//                   <SelectItem key={market.id} value={market.symbol}>
//                     {market.name} ({market.symbol})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-foreground mb-2 block">
//               Sector
//             </label>
//             <Select value={selectedSector} onValueChange={setSelectedSector}>
//               <SelectTrigger className="w-full lg:w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Sectors</SelectItem>
//                 {sectors.map((sector) => (
//                   <SelectItem key={sector} value={sector}>
//                     {sector}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-foreground mb-2 block">
//               Sort By
//             </label>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full lg:w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="name">Name (A-Z)</SelectItem>
//                 <SelectItem value="price_high">Price (High to Low)</SelectItem>
//                 <SelectItem value="price_low">Price (Low to High)</SelectItem>
//                 <SelectItem value="gain_high">Gain (High to Low)</SelectItem>
//                 <SelectItem value="gain_low">Gain (Low to High)</SelectItem>
//                 <SelectItem value="volume">Volume</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//
//       {/* Results */}
//       <div className="mt-8">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-foreground">
//             Results ({filteredStocks.length})
//           </h2>
//         </div>
//
//         {filteredStocks.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
//               <p className="text-muted-foreground">No stocks found</p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-3">
//             {filteredStocks.map((stock) => (
//               <Card key={stock.id} className="hover:border-primary transition-colors">
//                 <CardContent className="pt-6">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-bold text-lg text-foreground">
//                           {stock.symbol}
//                         </h3>
//                         <Badge variant="secondary">{stock.market}</Badge>
//                         <Badge variant="outline">{stock.sector}</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3">
//                         {stock.name}
//                       </p>
//
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//                         <div>
//                           <p className="text-muted-foreground">Price</p>
//                           <p className="font-semibold text-foreground">
//                             €{stock.price.toFixed(2)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-muted-foreground">Change</p>
//                           <p
//                             className={`font-semibold ${
//                               stock.change >= 0
//                                 ? "text-success"
//                                 : "text-destructive"
//                             }`}
//                           >
//                             {stock.change >= 0 ? "+" : ""}€
//                             {stock.change.toFixed(2)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-muted-foreground">Volume</p>
//                           <p className="font-semibold text-foreground">
//                             {stock.volume}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-muted-foreground">Market Cap</p>
//                           <p className="font-semibold text-foreground">
//                             {stock.marketCap}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//
//                     <div className="flex flex-col items-end gap-3">
//                       <div className="text-right">
//                         <p
//                           className={`text-lg font-bold ${
//                             stock.changePercent >= 0
//                               ? "text-success"
//                               : "text-destructive"
//                           }`}
//                         >
//                           {stock.changePercent >= 0 ? "+" : ""}
//                           {stock.changePercent.toFixed(2)}%
//                         </p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
//                           {stock.changePercent >= 0 ? (
//                             <ArrowUpRight className="h-3 w-3" />
//                           ) : (
//                             <ArrowDownLeft className="h-3 w-3" />
//                           )}
//                           Today
//                         </p>
//                       </div>
//                       <Button
//                           size="sm"
//                           onClick={() => router.push(`/dashboard/stocks/${stock.symbol}`)}
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//
//
//     </div>
//   )
// }
