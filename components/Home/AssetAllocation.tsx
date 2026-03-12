import React from "react";
import { PieChart, Layers, Target, ArrowUpRight } from "lucide-react";

export const AssetAllocation = () => {
  const allocations = [
    { label: "Equities", value: 45, color: "bg-primary", trend: "+2.4%" },
    { label: "Fixed Income", value: 25, color: "bg-blue-500", trend: "-0.8%" },
    { label: "Commodities", value: 15, color: "bg-amber-500", trend: "+1.2%" },
    { label: "Crypto/Digital", value: 15, color: "bg-emerald-500", trend: "+5.6%" },
  ];

  return (
    <section className="bg-white dark:bg-black py-24 border-b border-border/40">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded text-[10px] font-black uppercase tracking-widest">
              <Target size={14} /> Portfolio Strategy
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Global Asset Allocation</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Current market distribution based on institutional flow and risk-adjusted rebalancing for Q1 2026.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {allocations.map((item) => (
                <div key={item.label} className="p-4 border border-border rounded-lg bg-muted/20 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-mono font-black">{item.value}%</span>
                    <span className="text-[9px] font-bold text-emerald-500">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center">
             {/* Decorative Ring Design */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[20px] border-muted dark:border-zinc-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total AUM</p>
                    <p className="text-2xl font-mono font-black">$1.2T</p>
                </div>
                {/* Visual "Slices" representation using absolute positioning or SVG could go here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};