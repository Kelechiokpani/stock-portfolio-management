"use client";

import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Asset } from "@/components/data/data-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/app/services/Provider/CartProvider";
import { useState } from "react";
import { toast } from "sonner";

interface AssetDetailsModalProps {
  asset: Asset;
  onClose: () => void;
}

export function AssetDetailsModal({ asset, onClose }: AssetDetailsModalProps) {
  const { addToBuyCart, addToSellCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isPositive = asset.change >= 0;

  const handleBuy = () => {
    addToBuyCart({
      symbol: asset.symbol,
      shares: quantity,
      price: asset.price,
      companyName: asset.name,
      // portfolioId: portfolioId
    });
    toast.success(`${asset.symbol} added to Buy Cart`);
    onClose();
  };

  // const handleSell = () => {
  //   addToSellCart({
  //     symbol: asset.symbol,
  //     shares: quantity,
  //     price: asset.price,
  //     // symbol is required by your SellPayload interface
  //   });
  //   toast.success(`${asset.symbol} added to Sell Cart`);
  //   onClose();
  // };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[1rem] overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute right-8 top-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>

        <div className="p-10">
          {/* Top Info */}
          <header className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase tracking-[0.2em] border-slate-200 text-slate-400"
              >
                {asset.market}
              </Badge>
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase tracking-[0.2em] border-slate-200 text-slate-400"
              >
                {asset.sector}
              </Badge>
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                {asset.symbol}
              </h2>
              <span className="text-xl font-bold text-slate-400 truncate max-w-[300px]">
                {asset.name}
              </span>
            </div>
          </header>

          {/* Pricing Section */}
          <div className="mt-12 grid grid-cols-2 gap-12 pb-10 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Current Price
              </p>
              <p className="text-5xl font-mono font-black tracking-tighter tabular-nums">
                $
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Day Change
              </p>
              <div
                className={`flex items-center gap-2 text-3xl font-black ${
                  isPositive ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-8 w-8" />
                ) : (
                  <ArrowDownRight className="h-8 w-8" />
                )}
                {Math.abs(asset.changePercent)}%
              </div>
            </div>
          </div>

          {/* Portfolio & Trade Section */}
          <div className="mt-10 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Briefcase className="h-3 w-3" /> Select Destination Portfolio
              </label>
              <Select defaultValue="main">
                <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-800/50 font-bold text-sm focus:ring-2 focus:ring-slate-900 transition-all">
                  <SelectValue placeholder="Target Portfolio" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="main" className="font-bold">
                    Main Investment Fund
                  </SelectItem>
                  <SelectItem value="growth" className="font-bold">
                    Aggressive Growth
                  </SelectItem>
                  <SelectItem value="crypto" className="font-bold">
                    Crypto Wallet #1
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <Button
                onClick={handleBuy}
                className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4" /> Add to Buy Cart
              </Button>
              {/* <Button
                onClick={handleSell}
                variant="outline"
                className="h-16 rounded-2xl border-2 border-slate-100 hover:bg-rose-50 hover:text-rose-600 font-black uppercase tracking-widest text-[11px]"
              >
                Add to Sell Cart
              </Button> */}
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <Button className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] gap-2 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95">
                <Zap className="h-4 w-4 fill-white" /> Buy Asset
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-2xl border-2 border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95"
              >
                Execute Sell
              </Button>
            </div> */}
          </div>
        </div>

        {/* Footer Audit */}
        <footer className="bg-slate-50 dark:bg-white/5 p-6 px-10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure
            Institutional Flow
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300">
            <Info className="h-3 w-3" /> UID:{" "}
            {asset._id.slice(-8).toUpperCase()}
          </div>
        </footer>
      </div>
    </div>
  );
}
