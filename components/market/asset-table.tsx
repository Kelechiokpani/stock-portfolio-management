"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Asset, AssetClass } from "@/components/market/mock-data"

interface AssetTableProps {
    assets: Asset[]
    assetClass: AssetClass
    onRowClick?: (asset: Asset) => void
}

// ---------- Safe format helpers (prevents crashes) ----------
function safeNumber(value: any, digits = 2, suffix = "") {
    if (typeof value !== "number" || isNaN(value)) return "N/A"
    return `${value.toFixed(digits)}${suffix}`
}

function safeCurrency(value: any) {
    if (typeof value !== "number" || isNaN(value)) return "N/A"
    return `$${value.toFixed(2)}`
}

function safeString(value: any, fallback = "N/A") {
    if (value === null || value === undefined) return fallback
    return String(value)
}

function formatBondType(value: any) {
    if (!value) return "Unknown"
    return String(value).replaceAll("_", "-")
}

function getTrendColor(change: number | undefined) {
    if (typeof change !== "number") return "text-gray-600"
    return change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
}

function getTrendBadgeVariant(change: number | undefined) {
    if (typeof change !== "number") return "secondary"
    return change > 0 ? "default" : change < 0 ? "destructive" : "secondary"
}

export function AssetTable({ assets, assetClass, onRowClick }: AssetTableProps) {
    const renderAssetRow = (asset: Asset) => {
        const a = asset as any // single cast (cleaner & safer)

        switch (assetClass) {
            case "stock":
                return (
                    <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRowClick?.(asset)}
                    >
                        <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
                        <TableCell>{safeString(a.name)}</TableCell>
                        <TableCell>{safeString(a.sector)}</TableCell>
                        <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>

                        <TableCell className={`text-right font-semibold ${getTrendColor(a.change)}`}>
                            <div className="flex items-center justify-end gap-1">
                                {(a.change ?? 0) > 0 ? (
                                    <ArrowUp className="h-4 w-4" />
                                ) : (
                                    <ArrowDown className="h-4 w-4" />
                                )}
                                {safeNumber(a.change)}
                            </div>
                        </TableCell>

                        <TableCell className={`text-right ${getTrendColor(a.changePercent)}`}>
                            {safeNumber(a.changePercent, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm text-muted-foreground">
                            {safeString(a.marketCap)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                            {safeString(a.volume)}
                        </TableCell>
                    </TableRow>
                )

            case "bond":
                return (
                    <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRowClick?.(asset)}
                    >
                        <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
                        <TableCell>{safeString(a.issuer)}</TableCell>

                        {/* FIXED CRASH HERE */}
                        <TableCell>
                            <Badge variant="outline" className="capitalize">
                                {formatBondType(a.type)}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>
                        <TableCell className="text-right">
                            {safeNumber(a.couponRate, 2, "%")}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-blue-600">
                            {safeNumber(a.yieldToMaturity, 2, "%")}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="text-xs">
                                {safeString(a.creditRating)}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                            {safeString(a.maturityDate)}
                        </TableCell>
                    </TableRow>
                )

            case "etf":
                return (
                    <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRowClick?.(asset)}
                    >
                        <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
                        <TableCell>{safeString(a.name)}</TableCell>
                        <TableCell className="text-right">{safeCurrency(a.price)}</TableCell>

                        <TableCell className={`text-right ${getTrendColor(a.change)}`}>
                            {safeNumber(a.changePercent, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm">
                            {safeNumber(a.expenseRatio, 3, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm text-blue-600">
                            {typeof a.yield === "number" ? `${a.yield.toFixed(2)}%` : "N/A"}
                        </TableCell>

                        <TableCell className="text-right text-sm text-muted-foreground">
                            {safeString(a.aum)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                            {safeString(a.volume)}
                        </TableCell>
                    </TableRow>
                )

            case "mutual_fund":
                return (
                    <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRowClick?.(asset)}
                    >
                        <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
                        <TableCell>{safeString(a.name)}</TableCell>
                        <TableCell className="text-right">{safeCurrency(a.nav)}</TableCell>

                        <TableCell className={`text-right ${getTrendColor(a.change)}`}>
                            {safeNumber(a.changePercent, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm">
                            {safeNumber(a.expenseRatio, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm text-blue-600">
                            {safeNumber(a.performance1Y, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm text-muted-foreground">
                            {typeof a.minimumInvestment === "number"
                                ? `$${a.minimumInvestment.toLocaleString()}`
                                : "N/A"}
                        </TableCell>
                    </TableRow>
                )

            case "commodity":
                return (
                    <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRowClick?.(asset)}
                    >
                        <TableCell className="font-medium">{safeString(a.symbol)}</TableCell>
                        <TableCell>{safeString(a.name)}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="capitalize">
                                {safeString(a.investmentType)}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                            {safeCurrency(a.spotPrice)}
                        </TableCell>

                        <TableCell className={`text-right ${getTrendColor(a.change)}`}>
                            {safeNumber(a.changePercent, 2, "%")}
                        </TableCell>

                        <TableCell className="text-right text-sm text-muted-foreground">
                            {safeString(a.volume)}
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant={getTrendBadgeVariant(a.change)}
                                className="capitalize"
                            >
                                {safeString(a.marketTrend, "Neutral")}
                            </Badge>
                        </TableCell>
                    </TableRow>
                )

            default:
                return null
        }
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-b bg-muted/50">
                        {assetClass === "stock" && (
                            <>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Sector</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Change</TableHead>
                                <TableHead className="text-right">% Change</TableHead>
                                <TableHead className="text-right">Market Cap</TableHead>
                                <TableHead className="text-right">Volume</TableHead>
                            </>
                        )}

                        {assetClass === "bond" && (
                            <>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Issuer</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Coupon</TableHead>
                                <TableHead className="text-right">YTM</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="text-right">Maturity</TableHead>
                            </>
                        )}

                        {assetClass === "etf" && (
                            <>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">% Change</TableHead>
                                <TableHead className="text-right">Exp. Ratio</TableHead>
                                <TableHead className="text-right">Yield</TableHead>
                                <TableHead className="text-right">AUM</TableHead>
                                <TableHead className="text-right">Volume</TableHead>
                            </>
                        )}

                        {assetClass === "mutual_fund" && (
                            <>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">NAV</TableHead>
                                <TableHead className="text-right">% Change</TableHead>
                                <TableHead className="text-right">Exp. Ratio</TableHead>
                                <TableHead className="text-right">1Y Return</TableHead>
                                <TableHead className="text-right">Min. Investment</TableHead>
                            </>
                        )}

                        {assetClass === "commodity" && (
                            <>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">% Change</TableHead>
                                <TableHead className="text-right">Volume</TableHead>
                                <TableHead>Trend</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {assets?.length > 0 ? (
                        assets.map((asset) => renderAssetRow(asset))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                No assets found matching your criteria
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
