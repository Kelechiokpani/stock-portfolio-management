"use client";

import React, { useEffect, useState } from "react";

// Unified Interface
interface MarketData {
  symbol: string;
  v: string; // Price/Value
  c: string; // Change %
}

// Fixed STOCK_LIST with the correct properties for the Marquee
export const STOCK_LIST: MarketData[] = [
  { symbol: "AAPL", v: "185.92", c: "+0.45%" },
  { symbol: "TSLA", v: "175.40", c: "-1.20%" },
  { symbol: "NVDA", v: "890.50", c: "+2.10%" },
  { symbol: "MSFT", v: "415.20", c: "+0.85%" },
  { symbol: "AMZN", v: "178.10", c: "+1.15%" },
  { symbol: "GOOGL", v: "152.45", c: "-0.30%" },
  { symbol: "META", v: "485.20", c: "+3.40%" },
  { symbol: "BRK.B", v: "408.30", c: "+0.12%" },
  { symbol: "JPM", v: "192.15", c: "-0.45%" },
  { symbol: "V", v: "275.60", c: "+0.60%" },
  { symbol: "LLY", v: "762.10", c: "+1.80%" },
  { symbol: "AVGO", v: "1320.40", c: "+0.95%" },
  { symbol: "COST", v: "725.50", c: "-0.25%" },
  { symbol: "SPY", v: "512.40", c: "+0.55%" },
  { symbol: "BTC/USD", v: "67420.00", c: "+4.20%" },
];

export const Markets_Chart = () => {
  const [stocks, setStocks] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  // Note: Replace with your actual key or use process.env.NEXT_PUBLIC_MARKETSTACK_KEY
  const API_KEY = "YOUR_MARKETSTACK_API_KEY";
  const symbols = "AAPL,MSFT,TSLA,AMZN,GOOGL,NVDA,META,SPY";

  useEffect(() => {
    const fetchMarketData = async () => {
      // If no API key is set, stay in loading/fallback mode
      if (API_KEY === "YOUR_MARKETSTACK_API_KEY") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.marketstack.com/v1/intraday/latest?access_key=${API_KEY}&symbols=${symbols}`
        );
        const result = await response.json();

        if (result.data) {
          const formattedData = result.data.map((item: any) => {
            const change = item.open
              ? ((item.last - item.open) / item.open) * 100
              : 0;

            return {
              symbol: item.symbol,
              v: item.last.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              c: (change >= 0 ? "+" : "") + change.toFixed(2) + "%",
            };
          });
          setStocks(formattedData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000); // 5 mins
    return () => clearInterval(interval);
  }, [API_KEY]);

  // Use API stocks if available, otherwise use STOCK_LIST
  const displayData = stocks.length > 0 ? stocks : STOCK_LIST;

  // Seamless infinite scroll requires doubling the items
  const marqueeItems = [...displayData, ...displayData];

  return (
    <div className="bg-white dark:bg-black border-b border-border/40 overflow-hidden whitespace-nowrap py-2 select-none">
      <div className="flex animate-marquee gap-10 items-center text-[10px] font-mono">
        {marqueeItems.map((t, i) => (
          <div
            key={`${t.symbol}-${i}`}
            className="flex gap-3 items-center border-r border-border/30 pr-10"
          >
            <span className="font-black text-muted-foreground uppercase tracking-tighter">
              {t.symbol}
            </span>
            <span className="font-bold text-foreground">{t.v}</span>
            <span
              className={`font-bold ${
                t.c.startsWith("+") ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {t.c}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
