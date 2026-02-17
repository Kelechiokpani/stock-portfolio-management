"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScreenerFilters } from "@/components/market/screener-filters"
import { AssetTable } from "@/components/market/asset-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  mockStocks,
  mockBonds,
  mockETFs,
  mockMutualFunds,
  mockCommodities,
  type AssetClass,
  type Asset,
} from "@/components/market/mock-data"

export default function MarketplacePage() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass>("stock")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null) // clicked asset

  const allAssets: Record<AssetClass, Asset[]> = {
    stock: mockStocks,
    bond: mockBonds,
    etf: mockETFs,
    mutual_fund: mockMutualFunds,
    commodity: mockCommodities,
  }

  const filteredAssets = useMemo(() => {
    let assets = allAssets[selectedAssetClass] || []

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      assets = assets.filter((asset: any) =>
          asset.symbol?.toLowerCase().includes(query) ||
          asset.name?.toLowerCase().includes(query) ||
          asset.issuer?.toLowerCase().includes(query)
      )
    }

    if (selectedAssetClass === "stock" && filters.sector) {
      assets = assets.filter((asset: any) => filters.sector.includes(asset.sector))
    }

    if (selectedAssetClass === "bond" && filters.type) {
      assets = assets.filter((asset: any) => filters.type.includes(asset.type))
    }

    if (selectedAssetClass === "commodity" && filters.type) {
      assets = assets.filter((asset: any) => filters.type.includes(asset.type))
    }

    if (filters.sort === "gainers") {
      assets = assets.sort((a: any, b: any) => b.changePercent - a.changePercent)
    } else if (filters.sort === "losers") {
      assets = assets.sort((a: any, b: any) => a.changePercent - b.changePercent)
    } else if (filters.sort === "volume") {
      assets = assets.sort((a: any, b: any) => {
        const volA = parseInt(a.volume?.replace(/[MB]/, "") || "0")
        const volB = parseInt(b.volume?.replace(/[MB]/, "") || "0")
        return volB - volA
      })
    }

    return assets
  }, [selectedAssetClass, searchQuery, filters])

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Markets</h1>
          <p className="text-muted-foreground mt-2">
            Discover and explore investment opportunities across all asset classes
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                  placeholder="Search by symbol or name (e.g., AAPL, Microsoft)..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedAssetClass} onValueChange={(value) => setSelectedAssetClass(value as AssetClass)}>

          <TabsList className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]  gap-2 w-full  overflow-x-auto mb-6">
            <TabsTrigger value="stock">Stocks </TabsTrigger>
            <TabsTrigger value="bond">Bonds</TabsTrigger>
            <TabsTrigger value="etf">ETFs</TabsTrigger>
            <TabsTrigger value="mutual_fund">Mutual Funds</TabsTrigger>
            <TabsTrigger value="commodity">Commodities</TabsTrigger>
            <TabsTrigger value="gold">Gold</TabsTrigger>
            <TabsTrigger value="futures">Futures</TabsTrigger>
            <TabsTrigger value="stable_coins">Stable Coins</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
          </TabsList>


          {/* Asset Class Content */}
          {["stock", "bond", "etf", "mutual_fund", "commodity"].map((ac) => (
              <TabsContent key={ac} value={ac} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                  {/* Filters */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                        <CardDescription>Narrow down your search</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScreenerFilters assetClass={ac as AssetClass} onFiltersChange={setFilters} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Table */}
                  <div className="lg:col-span-3">
                    <AssetTable
                        assets={filteredAssets}
                        assetClass={ac as AssetClass}
                        onRowClick={(asset) => setSelectedAsset(asset)} // <-- set clicked asset
                    />
                  </div>
                </div>
              </TabsContent>
          ))}
        </Tabs>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-sm text-muted-foreground">Total Stocks</p>
                <p className="text-2xl font-bold">{mockStocks.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bonds</p>
                <p className="text-2xl font-bold">{mockBonds.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ETFs</p>
                <p className="text-2xl font-bold">{mockETFs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mutual Funds</p>
                <p className="text-2xl font-bold">{mockMutualFunds.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commodities</p>
                <p className="text-2xl font-bold">{mockCommodities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Details Modal */}
        {/* Modal */}
        {/* Modal */}
        {/*bg-black/50*/}
        {selectedAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl rounded-xl bg-gray-900/90  shadow-xl overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedAsset.symbol}</h2>
                    <p className="text-gray-400">
                      {('name' in selectedAsset && selectedAsset.name) ||
                          ('issuer' in selectedAsset && selectedAsset.issuer) ||
                          'Unknown'}
                    </p>
                  </div>
                  <button
                      onClick={() => setSelectedAsset(null)}
                      className="text-gray-400 hover:text-white text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Holdings */}
                <div className="p-6 bg-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
                  {/* Individual cards */}
                  <div>
                    <p className="text-sm text-gray-400">Shares Owned</p>
                    <p className="font-semibold text-lg">{50}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Avg Cost Per Share</p>
                    <p className="font-semibold text-lg">${145.20}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Invested</p>
                    <p className="font-semibold text-lg">${7_260.00}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Value</p>
                    <p className="font-semibold text-lg">${9_375.00}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Allocation %</p>
                    <p className="font-semibold text-lg">20.70%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Gain/Loss</p>
                    <p className="font-semibold text-lg text-green-500">+$2,115.00</p>
                  </div>
                </div>

                {/* Total Return */}
                <div className="p-6 bg-green-700 text-white text-center font-semibold text-lg md:text-xl">
                  Total Return: +29.08%
                </div>

                {/* Recent Transactions */}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-3">Recent Transactions</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between bg-gray-800 p-3 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Buy 50 shares</p>
                        <p className="text-gray-400 text-sm">2024-01-15 @ $145.20</p>
                      </div>
                      <p className="text-white font-semibold">$7,260.00</p>
                    </li>
                    <li className="flex justify-between bg-gray-800 p-3 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Sell 10 shares</p>
                        <p className="text-gray-400 text-sm">2024-02-20 @ $170.50</p>
                      </div>
                      <p className="text-white font-semibold">$1,705.00</p>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-700">
                  <button
                      onClick={() => setSelectedAsset(null)}
                      className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white">
                    Buy More
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white">
                    Sell
                  </button>
                </div>

              </div>
            </div>
        )}



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
//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       assets = assets.filter((asset: any) =>
//         asset.symbol?.toLowerCase().includes(query) ||
//         asset.name?.toLowerCase().includes(query) ||
//         asset.issuer?.toLowerCase().includes(query)
//       )
//     }
//
//     // Apply active filters
//     if (selectedAssetClass === "stock" && filters.sector) {
//       assets = assets.filter((asset: any) =>
//         filters.sector.includes(asset.sector)
//       )
//     }
//
//     if (selectedAssetClass === "bond" && filters.type) {
//       assets = assets.filter((asset: any) =>
//         filters.type.includes(asset.type)
//       )
//     }
//
//     if (selectedAssetClass === "etf" && filters.assetType) {
//       // Simple filter - in real app would be more sophisticated
//       assets = assets.slice(0, assets.length)
//     }
//
//     if (selectedAssetClass === "commodity" && filters.type) {
//       assets = assets.filter((asset: any) =>
//         filters.type.includes(asset.type)
//       )
//     }
//
//     // Handle sort presets
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
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Markets</h1>
//         <p className="text-muted-foreground mt-2">
//           Discover and explore investment opportunities across all asset classes
//         </p>
//       </div>
//
//       {/* Search Bar */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//             <Input
//               placeholder="Search by symbol or name (e.g., AAPL, Microsoft)..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </CardContent>
//       </Card>
//
//        {/*Asset Class Tabs and Content */}
//       <Tabs value={selectedAssetClass} onValueChange={(value) => setSelectedAssetClass(value as AssetClass)}>
//         <TabsList className="grid w-full grid-cols-10 mb-8">
//           <TabsTrigger value="stock">Stocks / shares</TabsTrigger>
//           <TabsTrigger value="bond">Bonds</TabsTrigger>
//           <TabsTrigger value="etf">ETFs</TabsTrigger>
//           <TabsTrigger value="mutual_fund">Mutual Funds</TabsTrigger>
//           <TabsTrigger value="commodity">Commodities</TabsTrigger>
//           <TabsTrigger value="">Gold</TabsTrigger>
//           <TabsTrigger value="">Futures</TabsTrigger>
//           <TabsTrigger value=""> Stable Coins</TabsTrigger>
//           <TabsTrigger value="">Options</TabsTrigger>
//           <TabsTrigger value="">Bitcoin</TabsTrigger>
//         </TabsList>
//
//
//         {/* Stocks Tab */}
//         <TabsContent value="stock" className="space-y-4 ">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <Card className="sticky top-4">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Filters</CardTitle>
//                   <CardDescription>Narrow down your search</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScreenerFilters
//                     assetClass="stock"
//                     onFiltersChange={setFilters}
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="lg:col-span-3">
//               <AssetTable assets={filteredAssets} assetClass="stock" />
//             </div>
//           </div>
//         </TabsContent>
//
//         {/* Bonds Tab */}
//         <TabsContent value="bond" className="space-y-4">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <Card className="sticky top-4">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Filters</CardTitle>
//                   <CardDescription>Narrow down your search</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScreenerFilters
//                     assetClass="bond"
//                     onFiltersChange={setFilters}
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="lg:col-span-3">
//               <AssetTable assets={filteredAssets} assetClass="bond" />
//             </div>
//           </div>
//         </TabsContent>
//
//         {/* ETFs Tab */}
//         <TabsContent value="etf" className="space-y-4">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <Card className="sticky top-4">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Filters</CardTitle>
//                   <CardDescription>Narrow down your search</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScreenerFilters
//                     assetClass="etf"
//                     onFiltersChange={setFilters}
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="lg:col-span-3">
//               <AssetTable assets={filteredAssets} assetClass="etf" />
//             </div>
//           </div>
//         </TabsContent>
//
//         {/* Mutual Funds Tab */}
//         <TabsContent value="mutual_fund" className="space-y-4">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <Card className="sticky top-4">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Filters</CardTitle>
//                   <CardDescription>Narrow down your search</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScreenerFilters
//                     assetClass="mutual_fund"
//                     onFiltersChange={setFilters}
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="lg:col-span-3">
//               <AssetTable assets={filteredAssets} assetClass="mutual_fund" />
//             </div>
//           </div>
//         </TabsContent>
//
//         {/* Commodities Tab */}
//         <TabsContent value="commodity" className="space-y-4">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <Card className="sticky top-4">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Filters</CardTitle>
//                   <CardDescription>Narrow down your search</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScreenerFilters
//                     assetClass="commodity"
//                     onFiltersChange={setFilters}
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="lg:col-span-3">
//               <AssetTable assets={filteredAssets} assetClass="commodity" />
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//
//
//
//
//
//       {/* Summary Stats */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Market Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Stocks</p>
//               <p className="text-2xl font-bold">{mockStocks.length}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Total Bonds</p>
//               <p className="text-2xl font-bold">{mockBonds.length}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Total ETFs</p>
//               <p className="text-2xl font-bold">{mockETFs.length}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Mutual Funds</p>
//               <p className="text-2xl font-bold">{mockMutualFunds.length}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Commodities</p>
//               <p className="text-2xl font-bold">{mockCommodities.length}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
