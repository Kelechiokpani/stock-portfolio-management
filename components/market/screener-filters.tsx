"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { AssetClass } from "@/components/market/mock-data"

interface FilterConfig {
  name: string
  type: "range" | "checkbox" | "radio"
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  step?: number
}

interface ScreenerFiltersProps {
  assetClass: AssetClass
  onFiltersChange: (filters: Record<string, any>) => void
}

const FILTER_PRESETS: Record<AssetClass, FilterConfig[]> = {
  stock: [
    { name: "priceRange", type: "range", min: 0, max: 500, step: 5 },
    {
      name: "sector",
      type: "checkbox",
      options: [
        { label: "Technology", value: "Technology" },
        { label: "Healthcare", value: "Healthcare" },
        { label: "Finance", value: "Financial Services" },
        { label: "Consumer", value: "Consumer Cyclical" },
        { label: "Energy", value: "Energy" },
      ],
    },
    {
      name: "marketCap",
      type: "radio",
      options: [
        { label: "Mega", value: "mega" },
        { label: "Large", value: "large" },
        { label: "Mid", value: "mid" },
        { label: "Small", value: "small" },
      ],
    },
    { name: "peRatio", type: "range", min: 0, max: 100, step: 2 },
    { name: "dividend", type: "range", min: 0, max: 10, step: 0.5 },
  ],
  bond: [
    {
      name: "type",
      type: "checkbox",
      options: [
        { label: "Corporate", value: "corporate" },
        { label: "Government", value: "government" },
        { label: "Municipal", value: "municipal" },
        { label: "High-Yield", value: "high_yield" },
      ],
    },
    {
      name: "rating",
      type: "checkbox",
      options: [
        { label: "AAA", value: "AAA" },
        { label: "AA", value: "AA" },
        { label: "A", value: "A" },
        { label: "BBB", value: "BBB" },
        { label: "BB", value: "BB" },
      ],
    },
    { name: "yield", type: "range", min: 0, max: 12, step: 0.5 },
    { name: "duration", type: "range", min: 0, max: 30, step: 1 },
  ],
  etf: [
    {
      name: "type",
      type: "radio",
      options: [
        { label: "Index-based", value: "index" },
        { label: "Actively managed", value: "active" },
      ],
    },
    {
      name: "assetType",
      type: "checkbox",
      options: [
        { label: "Stocks", value: "stocks" },
        { label: "Bonds", value: "bonds" },
        { label: "Mixed", value: "mixed" },
        { label: "Commodity", value: "commodity" },
      ],
    },
    { name: "expenseRatio", type: "range", min: 0, max: 1, step: 0.05 },
    { name: "yield", type: "range", min: 0, max: 10, step: 0.5 },
    { name: "aum", type: "range", min: 0, max: 500, step: 25 },
  ],
  mutual_fund: [
    {
      name: "family",
      type: "checkbox",
      options: [
        { label: "Vanguard", value: "Vanguard" },
        { label: "Fidelity", value: "Fidelity" },
        { label: "Schwab", value: "Schwab" },
      ],
    },
    {
      name: "type",
      type: "radio",
      options: [
        { label: "Index", value: "index" },
        { label: "Actively Managed", value: "active" },
        { label: "Balanced", value: "balanced" },
      ],
    },
    { name: "expenseRatio", type: "range", min: 0, max: 2, step: 0.1 },
    { name: "minimumInvestment", type: "range", min: 0, max: 50000, step: 1000 },
  ],
  commodity: [
    {
      name: "type",
      type: "checkbox",
      options: [
        { label: "Precious Metals", value: "precious_metal" },
        { label: "Energy", value: "energy" },
        { label: "Agricultural", value: "agricultural" },
      ],
    },
    {
      name: "investmentType",
      type: "radio",
      options: [
        { label: "Physical", value: "physical" },
        { label: "ETF", value: "etf" },
        { label: "Futures", value: "futures" },
      ],
    },
  ],
}

const PRESETS: Record<AssetClass, { label: string; filters: Record<string, any> }[]> = {
  stock: [
    { label: "Top Gainers", filters: { sort: "gainers" } },
    { label: "Top Losers", filters: { sort: "losers" } },
    { label: "Most Active", filters: { sort: "volume" } },
    { label: "High Dividend", filters: { dividend: [5, 10] } },
  ],
  bond: [
    { label: "Highest Yield", filters: { sort: "yield_desc" } },
    { label: "Investment Grade", filters: { rating: ["AAA", "AA", "A", "BBB"] } },
    { label: "Short Duration", filters: { duration: [0, 5] } },
  ],
  etf: [
    { label: "Lowest Cost", filters: { sort: "expense_asc" } },
    { label: "Highest Yield", filters: { sort: "yield_desc" } },
    { label: "Most Popular", filters: { sort: "aum_desc" } },
  ],
  mutual_fund: [
    { label: "Best Performance", filters: { sort: "performance_1y_desc" } },
    { label: "Lowest Cost", filters: { sort: "expense_asc" } },
  ],
  commodity: [
    { label: "Bullish Trend", filters: { trend: "bullish" } },
    { label: "Most Volatile", filters: { sort: "volatility_desc" } },
  ],
}

export function ScreenerFilters({
  assetClass,
  onFiltersChange,
}: ScreenerFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )
  }

  const handleFilterChange = (filterName: string, value: any) => {
    const newFilters = { ...filters, [filterName]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const applyPreset = (presetFilters: Record<string, any>) => {
    setFilters(presetFilters)
    onFiltersChange(presetFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const filterConfigs = FILTER_PRESETS[assetClass] || []
  const presets = PRESETS[assetClass] || []

  return (
    <div className="w-full space-y-6">
      {/* Preset Screeners */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Popular Screeners</h3>
        <div className="space-y-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => applyPreset(preset.filters)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t" />

      {/* Dynamic Filters */}
      <div className="space-y-2">
        {filterConfigs.map((config) => (
          <Collapsible
            key={config.name}
            open={expandedSections.includes(config.name)}
            onOpenChange={() => toggleSection(config.name)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-accent">
              <span className="text-sm font-medium text-foreground capitalize">
                {config.name.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 px-3 py-3">
              {config.type === "range" && (
                <div className="space-y-2">
                  <Slider
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={filters[config.name] || [config.min, config.max]}
                    onValueChange={(value) => handleFilterChange(config.name, value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${filters[config.name]?.[0] ?? config.min}</span>
                    <span>${filters[config.name]?.[1] ?? config.max}</span>
                  </div>
                </div>
              )}
              {config.type === "checkbox" &&
                config.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${config.name}-${option.value}`}
                      checked={
                        Array.isArray(filters[config.name])
                          ? filters[config.name].includes(option.value)
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const current = filters[config.name] || []
                        const updated = checked
                          ? [...current, option.value]
                          : current.filter((v:any) => v !== option.value)
                        handleFilterChange(config.name, updated)
                      }}
                    />
                    <Label
                      htmlFor={`${config.name}-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              {config.type === "radio" &&
                config.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${config.name}-${option.value}`}
                      name={config.name}
                      value={option.value}
                      checked={filters[config.name] === option.value}
                      onChange={() => handleFilterChange(config.name, option.value)}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`${config.name}-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {Object.keys(filters).length > 0 && (
        <>
          <div className="border-t" />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={clearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </>
      )}
    </div>
  )
}
