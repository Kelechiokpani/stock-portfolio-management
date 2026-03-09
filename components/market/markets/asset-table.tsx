"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AssetTableProps {
  assets: any[];
  assetClass: string;
  onRowClick?: (asset: any) => void;
}

export function AssetTable({
  assets,
  assetClass,
  onRowClick,
}: AssetTableProps) {
  const renderPriceChange = (change: number, percent: number) => {
    const isPositive = change > 0;
    const isNeutral = change === 0;
    const colorClass = isPositive
      ? "text-emerald-500"
      : isNeutral
      ? "text-slate-400"
      : "text-rose-500";

    return (
      <div className={`flex flex-col items-end ${colorClass}`}>
        <div className="flex items-center gap-1 font-bold text-xs">
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(percent).toFixed(2)}%
        </div>
        <span className="text-[9px] font-black opacity-60 tabular-nums">
          {isPositive ? "+" : ""}
          {change.toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border-none bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 px-6">
              Symbol
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">
              Asset Name
            </TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">
              Price
            </TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">
              Performance
            </TableHead>

            {/* Dynamic Column for Market Cap */}
            {["stock", "etf", "crypto", "all"].includes(assetClass) && (
              <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">
                Mkt Cap
              </TableHead>
            )}

            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-6">
              Volume
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow
                key={asset._id}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 border-slate-50 dark:border-slate-800 transition-colors group"
                onClick={() => onRowClick?.(asset)}
              >
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                      {asset.symbol}
                    </div>
                    {asset.marketTrend === "bullish" && (
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
                        title="Bullish Trend"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {asset.name}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                      {asset.market} • {asset.sector}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-black text-sm tabular-nums text-foreground">
                  $
                  {asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {renderPriceChange(asset.change, asset.changePercent)}
                </TableCell>

                {["stock", "etf", "crypto", "all"].includes(assetClass) && (
                  <TableCell className="text-right text-[11px] font-bold text-slate-500">
                    {asset.marketCap || "—"}
                  </TableCell>
                )}

                <TableCell className="text-right px-6">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black border-slate-200 dark:border-slate-800 text-slate-400"
                  >
                    {asset.volume}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    No Assets Found
                  </p>
                  <p className="text-xs text-slate-300 font-medium">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
