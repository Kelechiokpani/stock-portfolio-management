"use client";

import { useSellStockMutation } from "@/app/services/features/market/marketApi";
import { useCart } from "@/app/services/Provider/CartProvider";
import { useRouter } from "next/navigation"; // For the back button
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingDown,
  Trash2,
  History,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function StockSellCart() {
  const { sellCart, updateSellShares, removeFromSell, clearCarts } = useCart();
  const [sellStock, { isLoading }] = useSellStockMutation();
  const router = useRouter();

  // Calculate totals from the context data
  const totalProceeds = sellCart.reduce(
    (acc, item) => acc + item.price * item.shares,
    0
  );
  const taxWithholding = totalProceeds * 0.15; // Estimated 15% Capital Gains Tax

  const handleExecuteSale = async () => {
    try {
      for (const item of sellCart) {
        await sellStock(item).unwrap();
      }
      toast.success("Assets liquidated successfully.");
      clearCarts();
      // router.push("/dashboard/"); // Optional: redirect to portfolio after sale
    } catch (err: any) {
      toast.error(err?.data?.message || "Execution failure on asset disposal.");
    }
  };

  return (
    <div className="space-y-6 max-w-8xl mx-auto p-6 animate-in slide-in-from-right duration-500">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" /> Return to Market
        </button>

        <div className="flex justify-between items-end border-b border-destructive/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold italic text-destructive">
              Liquidation Cart
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
              Assets Staged for Disposal
            </p>
          </div>
          <TrendingDown className="h-10 w-10 text-destructive/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {sellCart.length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl p-12 text-center text-muted-foreground italic">
              No assets currently staged for liquidation.
            </div>
          ) : (
            sellCart.map((item) => (
              <Card
                key={item.symbol || item.holdingId}
                className="p-4 border-destructive/10 bg-destructive/[0.01] flex justify-between items-center group transition-all hover:border-destructive/30"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-[10px] font-black text-destructive uppercase">
                      {item.symbol?.substring(0, 3)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {item.symbol ||
                        "Asset ID: " + item.holdingId?.substring(0, 8)}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-bold">
                      Market Price: €{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* INPUT SECTION FOR UPDATING SHARES */}
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end gap-1">
                    <label className="text-[9px] font-black uppercase text-destructive/60 tracking-widest">
                      Shares to Sell
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.shares}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          updateSellShares(item.symbol || item.holdingId!, val);
                        }
                      }}
                      className="w-24 bg-white dark:bg-slate-950 border border-destructive/20 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-destructive/20 text-right text-destructive transition-all"
                    />
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                      Est. Proceeds
                    </p>
                    <p className="font-serif font-bold text-lg leading-none">
                      €{(item.price * item.shares).toLocaleString()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromSell(item.symbol!)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Sell Summary */}
        <Card className="p-6 bg-destructive/[0.02] border-destructive/10 h-fit space-y-6 sticky top-24">
          <h2 className="text-xs font-black uppercase text-destructive tracking-widest">
            Settlement Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Gross Proceeds
              </span>
              <span className="font-mono text-emerald-600 font-bold">
                +€{totalProceeds.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground italic">
                Est. Withholding
              </span>
              <span className="font-mono text-destructive font-bold">
                -€{taxWithholding.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-destructive/10 flex justify-between items-baseline">
              <span className="font-bold text-xs uppercase text-muted-foreground">
                Net Payout
              </span>
              <span className="text-2xl font-serif font-black text-foreground">
                €{(totalProceeds - taxWithholding).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 flex gap-2">
            <History className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-tight italic">
              Liquidated funds will be credited to your available balance
              immediately after market clearance.
            </p>
          </div>

          <Button
            onClick={handleExecuteSale}
            disabled={sellCart.length === 0 || isLoading}
            variant="destructive"
            className="w-full h-12 font-bold rounded-xl shadow-lg shadow-destructive/20 transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Finalize Disposal"
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
