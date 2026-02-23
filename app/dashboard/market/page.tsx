"use client"

import { useState, useMemo } from "react"
import { Search, TrendingUp, TrendingDown, BarChart3, X, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScreenerFilters } from "@/components/market/screener-filters"
import { AssetTable } from "@/components/market/asset-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// --- DATA IMPORTS ---
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

export default function MarketplacePage() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass>("stock")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // 1. Unified Data Source
  const allAssets: Record<AssetClass, Asset[]> = {
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

  // 2. Helper: Convert string volumes (e.g., "1.2M", "500K") to numbers for sorting
  const parseVolume = (volStr: string): number => {
    if (!volStr || volStr === "N/A") return 0
    const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }
    const unit = volStr.slice(-1).toUpperCase()
    const value = parseFloat(volStr.slice(0, -1))
    return multipliers[unit] ? value * multipliers[unit] : parseFloat(volStr) || 0
  }

  // 3. Filter and Sort Logic
  const filteredAssets = useMemo(() => {
    let assets = [...(allAssets[selectedAssetClass] || [])]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      assets = assets.filter((asset) =>
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query)
      )
    }

    // Dynamic Filtering based on Asset Class
    if (filters.sector?.length > 0) {
      assets = assets.filter((asset) => filters.sector.includes(asset.sector))
    }
    if (filters.type?.length > 0) {
      assets = assets.filter((asset) => filters.type.includes(asset.type))
    }

    // Sorting Logic
    if (filters.sort === "gainers") {
      assets.sort((a, b) => b.changePercent - a.changePercent)
    } else if (filters.sort === "losers") {
      assets.sort((a, b) => a.changePercent - b.changePercent)
    } else if (filters.sort === "volume") {
      assets.sort((a, b) => parseVolume(b.volume) - parseVolume(a.volume))
    }

    return assets
  }, [selectedAssetClass, searchQuery, filters])

  return (
      <div className="min-h-screen bg-background p-4 md:p-8 lg:p-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">

        {/* HEADER SECTION */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-1xl font-extrabold tracking-tight lg:text-2xl text-foreground">
              Marketplace
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Institutional-grade data across 9 global asset classes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full shadow-sm">
              <TrendingUp className="mr-2 h-4 w-4 text-emerald-500" /> Gainers
            </Button>
            <Button variant="outline" className="rounded-full shadow-sm">
              <BarChart3 className="mr-2 h-4 w-4 text-blue-500" /> High Volume
            </Button>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
              placeholder="Search symbols, names, or sectors..."
              className="pl-12 h-14 text-lg rounded-2xl border-muted bg-card shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TABS & MAIN CONTENT */}
        <Tabs value={selectedAssetClass} onValueChange={(v) => setSelectedAssetClass(v as AssetClass)} className="space-y-8">
          <TabsList className="flex h-12 w-full justify-start overflow-x-auto bg-transparent border-b rounded-none p-0 gap-8 scrollbar-hide">
            {Object.keys(allAssets).map((key) => (
                <TabsTrigger
                    key={key}
                    value={key}
                    className="px-3 font-bold pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-green-900 data-[state=active]:bg-transparent capitalize text-sm  transition-all"
                >
                  {key.replace("_", " ")}
                </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-3">
              <Card className="sticky top-8 border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Screener Filters</CardTitle>
                  <CardDescription>Refine by sector, type, or performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScreenerFilters assetClass={selectedAssetClass} onFiltersChange={setFilters} />
                </CardContent>
              </Card>
            </aside>

            {/* Asset Table Container */}
            <main className="lg:col-span-9 space-y-6">
              <AssetTable
                  assets={filteredAssets}
                  assetClass={selectedAssetClass}
                  onRowClick={setSelectedAsset}
              />
            </main>
          </div>
        </Tabs>

        {/* MODAL: ASSET DETAILS */}
        {selectedAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
              <div className="w-full max-w-2xl bg-card border shadow-2xl rounded-3xl overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={() => setSelectedAsset(null)}
                    className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Modal Header */}
                <div className="p-8 pb-0">
                  <Badge variant="outline" className="mb-2 capitalize">{selectedAssetClass}</Badge>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-4xl font-bold">{selectedAsset.symbol}</h2>
                    <span className="text-xl text-muted-foreground">{selectedAsset.name}</span>
                  </div>

                  <div className="mt-6 flex items-center gap-8">
                    <div>
                      <p className="text-sm text-muted-foreground py-6 uppercase tracking-wider font-semibold">Current Price</p>
                      <p className="text-1xl font-mono font-bold">${selectedAsset.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground py-6 uppercase tracking-wider font-semibold">24h Change</p>
                      <p className={`text-md font-bold flex items-center ${selectedAsset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedAsset.change >= 0 ? <ArrowUpRight className="mr-1 h-5 w-5" /> : <ArrowDownRight className="mr-1 h-5 w-5" />}
                        {Math.abs(selectedAsset.changePercent)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Stats Grid */}
                <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 mt-8 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Market Cap / Cap</p>
                    <p className="font-semibold">{selectedAsset.marketCap || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Volume (24h)</p>
                    <p className="font-semibold">{selectedAsset.volume}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Sector / Type</p>
                    <p className="font-semibold">{selectedAsset.sector || selectedAsset.type}</p>
                  </div>
                  {selectedAsset.yield && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Yield</p>
                        <p className="font-semibold text-blue-500">{selectedAsset.yield}</p>
                      </div>
                  )}
                  {selectedAsset.expiry && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Expiry</p>
                        <p className="font-semibold">{selectedAsset.expiry}</p>
                      </div>
                  )}
                  {selectedAsset.strike && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Strike Price</p>
                        <p className="font-semibold">${selectedAsset.strike}</p>
                      </div>
                  )}
                </div>

                {/* Modal Action Footer */}
                <div className="p-8 flex items-center justify-between border-t bg-card">
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setSelectedAsset(null)}>Cancel</Button>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6">Sell</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">Buy Asset</Button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* SUMMARY FOOTER */}
        <footer className="mt-12 pt-12 border-t">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {Object.entries(allAssets).slice(0, 5).map(([key, data]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground capitalize">{key.replace("_", " ")} Tracking</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
            ))}
          </div>
        </footer>
      </div>
  )
}


// "use client"
//
// import { useState, useMemo } from "react"
// import { Search } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { ScreenerFilters } from "@/components/market/screener-filters"
// import { AssetTable } from "@/components/market/asset-table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   mockStocks,
//   mockBonds,
//   mockETFs,
//   mockMutualFunds,
//   mockCommodities,
//   type AssetClass,
//   type Asset,
// } from "@/components/market/mock-data"
//
// export default function MarketplacePage() {
//   const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass>("stock")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filters, setFilters] = useState<Record<string, any>>({})
//   const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null) // clicked asset
//
//   const allAssets: Record<AssetClass, Asset[]> = {
//     stock: mockStocks,
//     bond: mockBonds,
//     etf: mockETFs,
//     mutual_fund: mockMutualFunds,
//     commodity: mockCommodities,
//   }
//
//   const filteredAssets = useMemo(() => {
//     let assets = allAssets[selectedAssetClass] || []
//
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       assets = assets.filter((asset: any) =>
//           asset.symbol?.toLowerCase().includes(query) ||
//           asset.name?.toLowerCase().includes(query) ||
//           asset.issuer?.toLowerCase().includes(query)
//       )
//     }
//
//     if (selectedAssetClass === "stock" && filters.sector) {
//       assets = assets.filter((asset: any) => filters.sector.includes(asset.sector))
//     }
//
//     if (selectedAssetClass === "bond" && filters.type) {
//       assets = assets.filter((asset: any) => filters.type.includes(asset.type))
//     }
//
//     if (selectedAssetClass === "commodity" && filters.type) {
//       assets = assets.filter((asset: any) => filters.type.includes(asset.type))
//     }
//
//     if (filters.sort === "gainers") {
//       assets = assets.sort((a: any, b: any) => b.changePercent - a.changePercent)
//     } else if (filters.sort === "losers") {
//       assets = assets.sort((a: any, b: any) => a.changePercent - b.changePercent)
//     } else if (filters.sort === "volume") {
//       assets = assets.sort((a: any, b: any) => {
//         const volA = parseInt(a.volume?.replace(/[MB]/, "") || "0")
//         const volB = parseInt(b.volume?.replace(/[MB]/, "") || "0")
//         return volB - volA
//       })
//     }
//
//     return assets
//   }, [selectedAssetClass, searchQuery, filters])
//
//   return (
//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Markets</h1>
//           <p className="text-muted-foreground mt-2">
//             Discover and explore investment opportunities across all asset classes
//           </p>
//         </div>
//
//         {/* Search Bar */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <Input
//                   placeholder="Search by symbol or name (e.g., AAPL, Microsoft)..."
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </CardContent>
//         </Card>
//
//         {/* Tabs */}
//         <Tabs value={selectedAssetClass} onValueChange={(value) => setSelectedAssetClass(value as AssetClass)}>
//
//           <TabsList className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]  gap-2 w-full  overflow-x-auto mb-6">
//             <TabsTrigger value="stock">Stocks </TabsTrigger>
//             <TabsTrigger value="bond">Bonds</TabsTrigger>
//             <TabsTrigger value="etf">ETFs</TabsTrigger>
//             <TabsTrigger value="mutual_fund">Mutual Funds</TabsTrigger>
//             <TabsTrigger value="commodity">Commodities</TabsTrigger>
//             <TabsTrigger value="gold">Gold</TabsTrigger>
//             <TabsTrigger value="futures">Futures</TabsTrigger>
//             <TabsTrigger value="options">Options</TabsTrigger>
//             <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
//           </TabsList>
//
//
//           {/* Asset Class Content */}
//           {["stock", "bond", "etf", "mutual_fund", "commodity"].map((ac) => (
//               <TabsContent key={ac} value={ac} className="space-y-4">
//                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//                   {/* Filters */}
//                   <div className="lg:col-span-1">
//                     <Card className="sticky top-4">
//                       <CardHeader>
//                         <CardTitle className="text-lg">Filters</CardTitle>
//                         <CardDescription>Narrow down your search</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <ScreenerFilters assetClass={ac as AssetClass} onFiltersChange={setFilters} />
//                       </CardContent>
//                     </Card>
//                   </div>
//
//                   {/* Table */}
//                   <div className="lg:col-span-3">
//                     <AssetTable
//                         assets={filteredAssets}
//                         assetClass={ac as AssetClass}
//                         onRowClick={(asset) => setSelectedAsset(asset)} // <-- set clicked asset
//                     />
//                   </div>
//                 </div>
//               </TabsContent>
//           ))}
//         </Tabs>
//
//         {/* Summary Stats */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Market Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Stocks</p>
//                 <p className="text-2xl font-bold">{mockStocks.length}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Bonds</p>
//                 <p className="text-2xl font-bold">{mockBonds.length}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Total ETFs</p>
//                 <p className="text-2xl font-bold">{mockETFs.length}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Mutual Funds</p>
//                 <p className="text-2xl font-bold">{mockMutualFunds.length}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Commodities</p>
//                 <p className="text-2xl font-bold">{mockCommodities.length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//
//         {/* Asset Details Modal */}
//         {/* Modal */}
//         {/* Modal */}
//         {/*bg-black/50*/}
//         {selectedAsset && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//               <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl rounded-xl bg-gray-900/90  shadow-xl overflow-y-auto max-h-[90vh]">
//
//                 {/* Header */}
//                 <div className="flex justify-between items-start p-6 border-b border-gray-700">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">{selectedAsset.symbol}</h2>
//                     <p className="text-gray-400">
//                       {('name' in selectedAsset && selectedAsset.name) ||
//                           ('issuer' in selectedAsset && selectedAsset.issuer) ||
//                           'Unknown'}
//                     </p>
//                   </div>
//                   <button
//                       onClick={() => setSelectedAsset(null)}
//                       className="text-gray-400 hover:text-white text-xl font-bold"
//                   >
//                     ×
//                   </button>
//                 </div>
//
//                 {/* Holdings */}
//                 <div className="p-6 bg-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
//                   {/* Individual cards */}
//                   <div>
//                     <p className="text-sm text-gray-400">Shares Owned</p>
//                     <p className="font-semibold text-lg">{50}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Avg Cost Per Share</p>
//                     <p className="font-semibold text-lg">${145.20}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Total Invested</p>
//                     <p className="font-semibold text-lg">${7_260.00}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Current Value</p>
//                     <p className="font-semibold text-lg">${9_375.00}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Allocation %</p>
//                     <p className="font-semibold text-lg">20.70%</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Gain/Loss</p>
//                     <p className="font-semibold text-lg text-green-500">+$2,115.00</p>
//                   </div>
//                 </div>
//
//                 {/* Total Return */}
//                 <div className="p-6 bg-green-700 text-white text-center font-semibold text-lg md:text-xl">
//                   Total Return: +29.08%
//                 </div>
//
//                 {/* Recent Transactions */}
//                 <div className="p-6">
//                   <h3 className="text-white font-semibold text-lg mb-3">Recent Transactions</h3>
//                   <ul className="space-y-2">
//                     <li className="flex justify-between bg-gray-800 p-3 rounded-lg">
//                       <div>
//                         <p className="text-white font-medium">Buy 50 shares</p>
//                         <p className="text-gray-400 text-sm">2024-01-15 @ $145.20</p>
//                       </div>
//                       <p className="text-white font-semibold">$7,260.00</p>
//                     </li>
//                     <li className="flex justify-between bg-gray-800 p-3 rounded-lg">
//                       <div>
//                         <p className="text-white font-medium">Sell 10 shares</p>
//                         <p className="text-gray-400 text-sm">2024-02-20 @ $170.50</p>
//                       </div>
//                       <p className="text-white font-semibold">$1,705.00</p>
//                     </li>
//                   </ul>
//                 </div>
//
//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-700">
//                   <button
//                       onClick={() => setSelectedAsset(null)}
//                       className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
//                   >
//                     Close
//                   </button>
//                   <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white">
//                     Buy More
//                   </button>
//                   <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white">
//                     Sell
//                   </button>
//                 </div>
//
//               </div>
//             </div>
//         )}
//
//
//
//       </div>
//   )
// }
//
//
