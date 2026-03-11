"use client";

import { useBuyStockMutation } from "@/app/services/features/market/marketApi";
import { useCart } from "@/app/services/Provider/CartProvider"; // Import your hook
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StockBuyCart() {
  const router = useRouter();

  // 1. Fetch data and actions directly from your context
  const { buyCart, updateBuyShares, removeFromBuy, clearCarts } = useCart();

  const [buyStock, { isLoading }] = useBuyStockMutation();

  // 2. Use 'buyCart' instead of 'items'
  const totalCost = buyCart.reduce(
    (acc, item) => acc + item.price * item.shares,
    0
  );
  const totalFees = totalCost * 0.005;

  const handleCheckout = async () => {
    try {
      for (const item of buyCart) {
        await buyStock(item).unwrap();
      }
      toast.success("Portfolio acquisitions successful.");
      clearCarts(); // Clear the context state
    } catch (err: any) {
      toast.error(err?.data?.message || "Acquisition failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-8xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" /> Return to Market
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold italic">
            Acquisition Cart
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
            Staged Assets for Purchase
          </p>
        </div>
        <ShoppingCart className="h-10 w-10 text-primary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {buyCart.length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl p-12 text-center text-muted-foreground italic">
              No assets currently staged for acquisition.
            </div>
          ) : (
            buyCart.map((item) => (
              <Card
                key={item.symbol}
                className="p-4 bg-card/50 backdrop-blur-sm border-border/50 flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {item.symbol}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase">
                    {item.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                      Shares
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.shares}
                      onChange={(e) =>
                        updateBuyShares(
                          item.symbol,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-20 bg-secondary/50 border border-border rounded px-2 py-1 text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    />
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-sm font-bold">
                      €{(item.price * item.shares).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      @ €{item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromBuy(item.symbol)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <Card className="p-6 bg-primary/[0.02] border-primary/10 h-fit space-y-6">
          <h2 className="text-xs font-black uppercase tracking-tighter text-muted-foreground">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Staged Subtotal</span>
              <span className="font-mono">€{totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Execution Fee (0.5%)
              </span>
              <span className="font-mono">€{totalFees.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t flex justify-between items-baseline">
              <span className="font-bold text-xs uppercase tracking-widest">
                Total Cost
              </span>
              <span className="text-2xl font-serif font-black text-primary">
                €{(totalCost + totalFees).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 flex gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-tight">
              Assets will be instantly added to your VaultStock portfolio upon
              execution.
            </p>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={buyCart.length === 0 || isLoading}
            className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Confirm Acquisitions"
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
