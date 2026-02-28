"use client"

import React, { useState, useMemo } from "react"
import {
    Eye, EyeOff, Globe, LayoutDashboard, Search, Save,
    ArrowUpRight, BarChart3, Filter, CheckCircle2,
    Zap, AlertCircle, RefreshCw, MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { allAssets } from "@/components/data/market-data"
import { AssetClass } from "@/components/data/data-type";


export default function MarketVisibilityPage() {
    const [visibility, setVisibility] = useState<Record<string, any>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const categories: AssetClass[] = ["stock", "bond", "etf", "bitcoin", "gold", "commodity"]

    const toggleVisibility = (id: string, platform: 'web' | 'dashboard') => {
        setVisibility(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [platform]: !prev[id]?.[platform]
            }
        }))
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Infrastructure</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tighter font-serif italic">Market Visibility</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Provision real-time asset feeds across public and private interfaces.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-11 px-6 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                            <RefreshCw className="w-4 h-4 mr-2" /> Audit Logs
                        </Button>
                        <Button className="h-11 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 shadow-2xl shadow-slate-900/20">
                            <Save className="w-4 h-4 mr-2" /> Deploy Changes
                        </Button>
                    </div>
                </header>

                {/* --- ANALYTICS OVERVIEW --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Assets", value: "1,284", icon: BarChart3, color: "text-blue-500" },
                        { label: "Web Exposure", value: "84%", icon: Globe, color: "text-emerald-500" },
                        { label: "Platform Latency", value: "12ms", icon: Zap, color: "text-amber-500" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* --- MAIN CONTROL INTERFACE --- */}
                <Tabs defaultValue="stock" className="w-full space-y-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4 items-end lg:items-center">
                        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 border-none h-12">
                            {categories.map(cat => (
                                <TabsTrigger
                                    key={cat}
                                    value={cat}
                                    className="capitalize px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-md transition-all"
                                >
                                    {cat}s
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Filter assets by ticker..."
                                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {categories.map(category => (
                        <TabsContent key={category} value={category} className="mt-0">
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 py-4">
                                    <div>
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-slate-400" />
                                            {category} Configuration Pool
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-slate-400">CATEGORY MASTER TOGGLE:</span>
                                        <Switch className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-emerald-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-6 py-4 font-black">Asset Identifier</th>
                                                <th className="px-6 py-4">Real-time Feed</th>
                                                <th className="px-6 py-4">Public Web</th>
                                                <th className="px-6 py-4">Internal Dashboard</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {allAssets
                                                .filter((a: any) => a.id.startsWith(category.substring(0, 1)) || (category === 'bitcoin' && a.type === 'Crypto'))
                                                .filter((a: any) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((asset) => (
                                                    <tr key={asset.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-[10px] shadow-lg">
                                                                    {asset.symbol.substring(0, 3)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-sm tracking-tight">{asset.name}</p>
                                                                    <p className="text-[10px] font-mono text-slate-400">{asset.symbol} • UID:{asset.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 font-mono text-xs font-semibold text-emerald-500">
                                                            ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <Globe className={`w-3.5 h-3.5 ${visibility[asset.id]?.web ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                                <Switch
                                                                    checked={visibility[asset.id]?.web}
                                                                    onCheckedChange={() => toggleVisibility(asset.id, 'web')}
                                                                    className="scale-75 data-[state=checked]:bg-emerald-500"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <LayoutDashboard className={`w-3.5 h-3.5 ${visibility[asset.id]?.dashboard ? 'text-blue-500' : 'text-slate-300'}`} />
                                                                <Switch
                                                                    checked={visibility[asset.id]?.dashboard}
                                                                    onCheckedChange={() => toggleVisibility(asset.id, 'dashboard')}
                                                                    className="scale-75 data-[state=checked]:bg-blue-600"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center">
                                    <p className="text-[10px] text-slate-400 font-medium">SHOWN: 24 OF 1,284 ASSETS</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4 border-slate-200 dark:border-slate-800">PREVIOUS</Button>
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4 border-slate-200 dark:border-slate-800">NEXT</Button>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* --- WARNING FOOTER --- */}
                <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Operational Warning</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                            Visibility changes take effect immediately on edge-cached servers. Ensure compliance review has been completed before deploying changes to Public Web interfaces.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}