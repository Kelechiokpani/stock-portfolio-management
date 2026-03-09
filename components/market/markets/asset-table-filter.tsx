"use client";

import { useState, useEffect } from "react";
import {
  X,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AssetClass } from "@/components/data/data-type";

interface ScreenerFiltersProps {
  assetClass: AssetClass;
  onFiltersChange: (filters: any) => void;
}

export function AssetTableFilter({
  assetClass,
  onFiltersChange,
}: ScreenerFiltersProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSectors([]);
    setActiveSort(null);
  }, [assetClass]);

  const toggleSector = (sector: string) => {
    const next = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];
    setSelectedSectors(next);
    onFiltersChange({ sectors: next, sort: activeSort });
  };

  const handleSort = (sortType: string) => {
    const nextSort = activeSort === sortType ? null : sortType;
    setActiveSort(nextSort);
    onFiltersChange({ sectors: selectedSectors, sort: nextSort });
  };

  const resetAll = () => {
    setSelectedSectors([]);
    setActiveSort(null);
    onFiltersChange({ sectors: [], sort: null });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Quick Sort Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground font-black text-[10px] uppercase tracking-[0.2em]">
          <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
          Institutional Sort
        </div>
        <div className="flex flex-col gap-2">
          {[
            {
              id: "gainers",
              label: "Top Gainers",
              icon: ArrowUpRight,
              color: "text-emerald-500",
            },
            {
              id: "losers",
              label: "Top Losers",
              icon: ArrowDownRight,
              color: "text-rose-500",
            },
            {
              id: "volume",
              label: "High Volume",
              icon: BarChart3,
              color: "text-blue-500",
            },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeSort === item.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort(item.id)}
              className={`justify-start h-12 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all border-border
                ${
                  activeSort === item.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <item.icon
                className={`mr-2 h-4 w-4 ${
                  activeSort === item.id ? "text-current" : item.color
                }`}
              />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Dynamic Sector Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground font-black text-[10px] uppercase tracking-[0.2em]">
          <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
          Market Sectors
        </div>
        <div className="space-y-4 pt-2">
          {[
            "Technology",
            "Financial Services",
            "Healthcare",
            "Crypto",
            "Consumer Cyclical",
          ].map((sector) => (
            <div
              key={sector}
              className="flex items-center group cursor-pointer"
            >
              <Checkbox
                id={sector}
                checked={selectedSectors.includes(sector)}
                onCheckedChange={() => toggleSector(sector)}
                className="rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={sector}
                className="ml-3 text-[11px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
              >
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Section */}
      {(selectedSectors.length > 0 || activeSort) && (
        <Button
          variant="ghost"
          className="w-full text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl h-12 transition-colors"
          onClick={resetAll}
        >
          <X className="mr-2 h-3 w-3" /> Reset Screener
        </Button>
      )}
    </div>
  );
}
