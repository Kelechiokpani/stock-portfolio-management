"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, ChevronDown, Info } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { allAssets } from "@/components/data/market-data"
import StockDetailChart from "@/components/market/Chart/StockDetailChart"

export default function StockDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [timeRange, setTimeRange] = useState("YTD")

    const stock = useMemo(() => {
        if (!params.id) return null;
        return allAssets.find((s) =>
            s.id === params.id ||
            s.symbol?.toLowerCase() === (params.id as string).toLowerCase()
        )
    }, [params.id])

    if (!stock) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-background text-foreground">
                <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-center">
                    <p className="font-bold">Asset Not Found</p>
                    <p className="text-xs text-muted-foreground">ID: {params.id}</p>
                </div>
                <Button onClick={() => router.push('/market')} variant="outline">
                    Back to Marketplace
                </Button>
            </div>
        )
    }

    const isPositive = stock.changePercent >= 0

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-foreground">
            <Button variant="ghost" onClick={() => router.back()} className="px-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Market Overview</span>
            </Button>

            {/* HEADER SECTION */}
            <header className="space-y-1">
                <h1 className="text-2xl font-bold">{stock.name}</h1>
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold tracking-tighter">
                        ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <div className={`flex items-center text-xl font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        <span className="text-muted-foreground text-sm ml-2 font-normal">
                            ({isPositive ? '+' : ''}{stock.change.toFixed(2)}) YTD
                        </span>
                    </div>
                </div>
                <div className="text-[12px] text-muted-foreground flex items-center gap-2 font-medium">
                    <span>${(stock.price + 0.16).toFixed(2)} <span className="text-emerald-500 font-bold">+0.12%</span> (+0.16)</span>
                    <Activity className="h-3 w-3 ml-1" />
                    <span>After hours</span>
                </div>
            </header>

            {/* MAIN CHART CARD */}
            <Card className="border-border bg-card rounded-[24px] overflow-hidden shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/50">
                    <div className="flex gap-4">
                        <ChartAction label="Area" />
                        <ChartAction label="Compare" />
                        <ChartAction label="Indicators" />
                    </div>
                </CardHeader>
                <CardContent className="p-0 h-[450px] relative">
                    <StockDetailChart stock={stock} />

                    <div className="flex justify-center pb-6 gap-1 mt-[-60px] relative z-10">
                        {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeRange(t)}
                                className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                                    timeRange === t
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* DATA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-card border-border p-8 rounded-[32px]">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> Key Metrics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 text-foreground">
                        <MetricItem label="Market Cap" value={stock.marketCap || "N/A"} />
                        <MetricItem label="Volume" value={stock.volume} />
                        <MetricItem label="Sector" value={stock.sector || stock.type || "N/A"} />
                        <MetricItem label="PE Ratio" value="28.42" />
                        <MetricItem label="Yield" value={stock.yield || "1.38%"} />
                        <MetricItem label="Expiry" value={stock.expiry || "N/A"} />
                    </div>
                </Card>

                <Card className="bg-primary p-8 rounded-[32px] flex flex-col justify-between border-none shadow-xl shadow-primary/20">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-primary-foreground leading-tight italic uppercase">Trade Now</h2>
                        <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-widest">Instant Execution</p>
                    </div>
                    <Button className="w-full h-14 bg-primary-foreground text-primary hover:opacity-90 rounded-2xl font-bold text-lg transition-transform active:scale-95">
                        Execute {stock.symbol}
                    </Button>
                </Card>
            </div>
        </div>
    )
}

function ChartAction({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            {label} <ChevronDown className="h-3 w-3" />
        </button>
    )
}

function MetricItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
            <p className="text-lg font-bold font-mono tracking-tighter">{value}</p>
        </div>
    )
}