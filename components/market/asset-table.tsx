"use client"

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Asset, AssetClass } from "@/components/data/market-data"


interface AssetTableProps {
    assets: Asset[]
    assetClass: AssetClass
    onRowClick?: (asset: Asset) => void
}

export function AssetTable({ assets, assetClass, onRowClick }: AssetTableProps) {

    // Helper to format price movement
    const renderPriceChange = (change: number, percent: number) => {
        const isPositive = change > 0
        const isNeutral = change === 0
        const colorClass = isPositive ? "text-emerald-500" : isNeutral ? "text-muted-foreground" : "text-rose-500"

        return (
            <div className={`flex flex-col items-end ${colorClass}`}>
                <div className="flex items-center gap-1 font-medium">
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : isNeutral ? <Minus className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(percent).toFixed(2)}%
                </div>
                <span className="text-[10px] opacity-80">
                    {isPositive ? "+" : ""}{change.toFixed(2)}
                </span>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[100px]">Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">24h Change</TableHead>

                        {/* Dynamic Columns based on Asset Class */}
                        {["stock", "etf", "bitcoin"].includes(assetClass) && <TableHead className="text-right">Mkt Cap</TableHead>}
                        {assetClass === "bond" && <TableHead className="text-right">Yield</TableHead>}
                        {["futures", "options"].includes(assetClass) && <TableHead className="text-right">Expiry</TableHead>}
                        {assetClass === "options" && <TableHead className="text-right">Strike</TableHead>}

                        <TableHead className="text-right">Volume</TableHead>
                        <TableHead className="text-right">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.length > 0 ? (
                        assets.map((asset) => (
                            <TableRow
                                key={asset.id}
                                className="cursor-pointer hover:bg-green-100/50 transition-colors"
                                onClick={() => onRowClick?.(asset)}
                            >
                                <TableCell className="font-bold">{asset.symbol}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm line-clamp-1">{asset.name}</span>
                                        {asset.sector && <span className="text-[10px] text-muted-foreground">{asset.sector}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono font-semibold">
                                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-right">
                                    {renderPriceChange(asset.change, asset.changePercent)}
                                </TableCell>

                                {/* Dynamic Cells */}
                                {["stock", "etf", "bitcoin"].includes(assetClass) && (
                                    <TableCell className="text-right text-sm">{asset.marketCap || "N/A"}</TableCell>
                                )}
                                {assetClass === "bond" && (
                                    <TableCell className="text-right text-blue-500 font-medium">{asset.yield || "N/A"}</TableCell>
                                )}
                                {["futures", "options"].includes(assetClass) && (
                                    <TableCell className="text-right text-sm">{asset.expiry || "N/A"}</TableCell>
                                )}
                                {assetClass === "options" && (
                                    <TableCell className="text-right font-mono text-sm">${asset.strike}</TableCell>
                                )}

                                <TableCell className="text-right text-xs text-muted-foreground">{asset.volume}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                        {asset.type}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                                No assets found. Try adjusting your filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

// "use client"
//
// import { ArrowDown, ArrowUp } from "lucide-react"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import type { Asset, AssetClass } from "@/components/market/mock-data"
//
// interface AssetTableProps {
//     assets: Asset[]
//     assetClass: AssetClass
//     onRowClick?: (asset: Asset) => void
// }
//
// // ---------- Safe format helpers (prevents crashes) ----------
// function safeNumber(value: any, digits = 2, suffix = "") {
//     if (typeof value !== "number" || isNaN(value)) return "N/A"
//     return `${value.toFixed(digits)}${suffix}`
// }
//
// function safeCurrency(value: any) {
//     if (typeof value !== "number" || isNaN(value)) return "N/A"
//     return `$${value.toFixed(2)}`
// }
//
// function safeString(value: any, fallback = "N/A") {
//     if (value === null || value === undefined) return fallback
//     return String(value)
// }
//
// function formatBondType(value: any) {
//     if (!value) return "Unknown"
//     return String(value).replaceAll("_", "-")
// }
//
// function getTrendColor(change: number | undefined) {
//     if (typeof change !== "number") return "text-gray-600"
//     return change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
// }
//
// function getTrendBadgeVariant(change: number | undefined) {
//     if (typeof change !== "number") return "secondary"
//     return change > 0 ? "default" : change < 0 ? "destructive" : "secondary"
// }
//
// export function AssetTable({ assets, assetClass, onRowClick }: AssetTableProps) {
//     const renderAssetRow = (asset: Asset) => {
//         const a = asset as any // single cast (cleaner & safer)
//
//         switch (assetClass) {
//             case "stock":
//                 return (
//                     <TableRow
//                         key={a.id}
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => onRowClick?.(asset)}
//                     >
//                         <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
//                         <TableCell>{safeString(a.name)}</TableCell>
//                         <TableCell>{safeString(a.sector)}</TableCell>
//                         <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>
//
//                         <TableCell className={`text-right font-semibold ${getTrendColor(a.change)}`}>
//                             <div className="flex items-center justify-end gap-1">
//                                 {(a.change ?? 0) > 0 ? (
//                                     <ArrowUp className="h-4 w-4" />
//                                 ) : (
//                                     <ArrowDown className="h-4 w-4" />
//                                 )}
//                                 {safeNumber(a.change)}
//                             </div>
//                         </TableCell>
//
//                         <TableCell className={`text-right ${getTrendColor(a.changePercent)}`}>
//                             {safeNumber(a.changePercent, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {safeString(a.marketCap)}
//                         </TableCell>
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {safeString(a.volume)}
//                         </TableCell>
//                     </TableRow>
//                 )
//
//             case "bond":
//                 return (
//                     <TableRow
//                         key={a.id}
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => onRowClick?.(asset)}
//                     >
//                         <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
//                         <TableCell>{safeString(a.issuer)}</TableCell>
//
//                         {/* FIXED CRASH HERE */}
//                         <TableCell>
//                             <Badge variant="outline" className="capitalize">
//                                 {formatBondType(a.type)}
//                             </Badge>
//                         </TableCell>
//
//                         <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>
//                         <TableCell className="text-right">
//                             {safeNumber(a.couponRate, 2, "%")}
//                         </TableCell>
//                         <TableCell className="text-right font-semibold text-blue-600">
//                             {safeNumber(a.yieldToMaturity, 2, "%")}
//                         </TableCell>
//                         <TableCell>
//                             <Badge variant="secondary" className="text-xs">
//                                 {safeString(a.creditRating)}
//                             </Badge>
//                         </TableCell>
//                         <TableCell className="text-right text-sm">
//                             {safeString(a.maturityDate)}
//                         </TableCell>
//                     </TableRow>
//                 )
//
//             case "etf":
//                 return (
//                     <TableRow
//                         key={a.id}
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => onRowClick?.(asset)}
//                     >
//                         <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
//                         <TableCell>{safeString(a.name)}</TableCell>
//                         <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>
//
//                         <TableCell className={`text-right ${getTrendColor(a.change)}`}>
//                             {safeNumber(a.changePercent, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm">
//                             {safeNumber(a.expenseRatio, 3, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-blue-600">
//                             {typeof a.yield === "number" ? `${a.yield.toFixed(2)}%` : "N/A"}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {safeString(a.aum)}
//                         </TableCell>
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {safeString(a.volume)}
//                         </TableCell>
//                     </TableRow>
//                 )
//
//             case "mutual_fund":
//                 return (
//                     <TableRow
//                         key={a.id}
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => onRowClick?.(asset)}
//                     >
//                         <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
//                         <TableCell>{safeString(a.name)}</TableCell>
//                         <TableCell className="text-right">{safeCurrency(a.nav)}</TableCell>
//
//                         <TableCell className={`text-right ${getTrendColor(a.change)}`}>
//                             {safeNumber(a.changePercent, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm">
//                             {safeNumber(a.expenseRatio, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-blue-600">
//                             {safeNumber(a.performance1Y, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {typeof a.minimumInvestment === "number"
//                                 ? `$${a.minimumInvestment.toLocaleString()}`
//                                 : "N/A"}
//                         </TableCell>
//                     </TableRow>
//                 )
//
//             case "commodity":
//                 return (
//                     <TableRow
//                         key={a.id}
//                         className="cursor-pointer hover:bg-accent"
//                         onClick={() => onRowClick?.(asset)}
//                     >
//                         <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
//                         <TableCell>{safeString(a.name)}</TableCell>
//                         <TableCell>
//                             <Badge variant="outline" className="capitalize">
//                                 {safeString(a.investmentType)}
//                             </Badge>
//                         </TableCell>
//
//                         <TableCell className="text-right">
//                             {safeCurrency(a.spotPrice)}
//                         </TableCell>
//
//                         <TableCell className={`text-right ${getTrendColor(a.change)}`}>
//                             {safeNumber(a.changePercent, 2, "%")}
//                         </TableCell>
//
//                         <TableCell className="text-right text-sm text-muted-foreground">
//                             {safeString(a.volume)}
//                         </TableCell>
//
//                         <TableCell>
//                             <Badge
//                                 variant={getTrendBadgeVariant(a.change)}
//                                 className="capitalize"
//                             >
//                                 {safeString(a.marketTrend, "Neutral")}
//                             </Badge>
//                         </TableCell>
//                     </TableRow>
//                 )
//
//             default:
//                 return null
//         }
//     }
//
//     return (
//         <div className="rounded-lg border bg-card">
//             <Table>
//                 <TableHeader>
//                     <TableRow className="border-b bg-muted/50">
//                         {assetClass === "stock" && (
//                             <>
//                                 <TableHead>Symbol</TableHead>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead>Sector</TableHead>
//                                 <TableHead className="text-right">Price</TableHead>
//                                 <TableHead className="text-right">Change</TableHead>
//                                 <TableHead className="text-right">% Change</TableHead>
//                                 <TableHead className="text-right">Market Cap</TableHead>
//                                 <TableHead className="text-right">Volume</TableHead>
//                             </>
//                         )}
//
//                         {assetClass === "bond" && (
//                             <>
//                                 <TableHead>Symbol</TableHead>
//                                 <TableHead>Issuer</TableHead>
//                                 <TableHead>Type</TableHead>
//                                 <TableHead className="text-right">Price</TableHead>
//                                 <TableHead className="text-right">Coupon</TableHead>
//                                 <TableHead className="text-right">YTM</TableHead>
//                                 <TableHead>Rating</TableHead>
//                                 <TableHead className="text-right">Maturity</TableHead>
//                             </>
//                         )}
//
//                         {assetClass === "etf" && (
//                             <>
//                                 <TableHead>Symbol</TableHead>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead className="text-right">Price</TableHead>
//                                 <TableHead className="text-right">% Change</TableHead>
//                                 <TableHead className="text-right">Exp. Ratio</TableHead>
//                                 <TableHead className="text-right">Yield</TableHead>
//                                 <TableHead className="text-right">AUM</TableHead>
//                                 <TableHead className="text-right">Volume</TableHead>
//                             </>
//                         )}
//
//                         {assetClass === "mutual_fund" && (
//                             <>
//                                 <TableHead>Symbol</TableHead>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead className="text-right">NAV</TableHead>
//                                 <TableHead className="text-right">% Change</TableHead>
//                                 <TableHead className="text-right">Exp. Ratio</TableHead>
//                                 <TableHead className="text-right">1Y Return</TableHead>
//                                 <TableHead className="text-right">Min. Investment</TableHead>
//                             </>
//                         )}
//
//                         {assetClass === "commodity" && (
//                             <>
//                                 <TableHead>Symbol</TableHead>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead>Type</TableHead>
//                                 <TableHead className="text-right">Price</TableHead>
//                                 <TableHead className="text-right">% Change</TableHead>
//                                 <TableHead className="text-right">Volume</TableHead>
//                                 <TableHead>Trend</TableHead>
//                             </>
//                         )}
//                     </TableRow>
//                 </TableHeader>
//
//                 <TableBody>
//                     {assets?.length > 0 ? (
//                         assets.map((asset) => renderAssetRow(asset))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
//                                 No assets found matching your criteria
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     )
// }
