"use client";

import { ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CartHeaderProps {
  buyCount: number;
  sellCount: number;
}

export function CartHeader({ buyCount, sellCount }: CartHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Buy Cart Link */}
      <Link
        href="/dashboard/market/buy"
        className="relative p-2 rounded-xl hover:bg-emerald-500/10 transition-all group"
      >
        <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20">
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        {buyCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 text-white border-2 border-background animate-in zoom-in">
            {buyCount}
          </Badge>
        )}
      </Link>

      {/* Sell Cart Link */}
      <Link
        href="/dashboard/stocks/sell"
        className="relative p-2 rounded-xl hover:bg-rose-500/10 transition-all group"
      >
        <div className="bg-rose-500/10 p-2 rounded-lg group-hover:bg-rose-500/20">
          <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        </div>
        {sellCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-rose-600 text-white border-2 border-background animate-in zoom-in">
            {sellCount}
          </Badge>
        )}
      </Link>
    </div>
  );
}
