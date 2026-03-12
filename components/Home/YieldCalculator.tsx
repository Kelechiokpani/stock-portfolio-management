"use client";

import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, ChevronDown, Check } from "lucide-react";
import { Button } from "../ui/button";
import { STOCK_LIST } from "./market_chart";

export const YieldCalculator = () => {
  const [selectedStock, setSelectedStock] = useState(STOCK_LIST[0]);
  const [shares, setShares] = useState<string>("10");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [totalCost, setTotalCost] = useState<number>(0);
  const [projectedProfit, setProjectedProfit] = useState<number>(0);

  const calculatePosition = () => {
    const shareCount = parseFloat(shares) || 0;
    const cost = shareCount * parseFloat(selectedStock.v);

    setTotalCost(cost);
    // Mocking a 15% institutional "Target Profit" for the calculation
    setProjectedProfit(cost * 0.15);
  };

  useEffect(() => {
    calculatePosition();
  }, [shares, selectedStock]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <section className="bg-white dark:bg-black py-24 border-b border-border/40">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10">
        <div className="bg-primary p-6 md:p-12 rounded-2xl overflow-hidden relative">
          <Calculator className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 -rotate-12 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Side: Copy */}
            <div className="lg:col-span-2 text-white space-y-4">
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">
                Position <br /> Analyzer
              </h2>
              <p className="text-white/80 text-sm font-medium">
                Select an asset and enter your desired share count to calculate
                required capital and target institutional upside.
              </p>
            </div>

            {/* Right Side: Inputs & Results */}
            <div className="lg:col-span-3 bg-white dark:bg-zinc-950 rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Stock Selector */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Select Asset
                  </label>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full h-12 bg-muted/50 dark:bg-zinc-900 rounded-lg px-4 font-bold text-sm text-foreground border-none outline-none focus:ring-2 focus:ring-primary"
                  >
                    {selectedStock.symbol}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      {STOCK_LIST.map((stock) => (
                        <div
                          key={stock.symbol}
                          onClick={() => {
                            setSelectedStock(stock);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center justify-between px-4 py-3 hover:bg-primary/10 cursor-pointer transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-black">
                              {stock.symbol}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {stock.v}
                            </span>
                          </div>
                          {selectedStock.symbol === stock.symbol && (
                            <Check size={12} className="text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Number of Shares */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    value={shares}
                    onFocus={handleFocus}
                    onChange={(e) => setShares(e.target.value)}
                    className="w-full h-12 bg-muted/50 dark:bg-zinc-900 border-none rounded-lg px-4 font-mono font-bold focus:ring-2 focus:ring-primary outline-none text-foreground"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Price Per Share
                  </p>
                  <p className="text-sm font-mono font-bold text-foreground">
                    ${selectedStock.v.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Target Profit (15%)
                  </p>
                  <p className="text-sm font-mono font-bold text-emerald-500">
                    +$
                    {projectedProfit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Final Result */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-auto">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Total Investment
                  </p>
                  <p className="text-4xl font-mono font-black text-primary">
                    $
                    {totalCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Button className="w-full md:w-auto h-12 px-10 font-black uppercase text-xs tracking-widest rounded-lg transition-all hover:bg-primary/90">
                  Execute Trade <TrendingUp size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
