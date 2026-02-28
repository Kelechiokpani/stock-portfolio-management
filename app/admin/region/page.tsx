"use client"

import React, { useState, useMemo } from "react"
import {
    MapPin, Users2, ChevronRight, Globe2, Plus,
    Settings2, Search, Trash2, ShieldCheck,
    ArrowUpRight, Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { GENDER_OPTIONS, locationData } from "@/components/data/countries";

export default function RegionalSettingsPage() {
    const [selectedCountry, setSelectedCountry] = useState("Nigeria")
    const [searchQuery, setSearchQuery] = useState("")
    const countries = Object.keys(locationData)

    const filteredCountries = useMemo(() =>
            countries.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())),
        [searchQuery, countries]
    )

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto p-6 lg:p-10 space-y-8">

                {/* --- TOP NAVIGATION / HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="rounded-full px-3 py-0 text-[10px] uppercase tracking-tighter border-slate-300 dark:border-slate-700">
                                System Admin
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight font-serif italic">Regional Core</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure localization parameters and demographic taxonomies.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800">
                            Export Config
                        </Button>
                        <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-xl">
                            <Plus className="w-4 h-4 mr-2" /> Add Territory
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: GENDER & STATUS (4 COLUMNS) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users2 className="w-5 h-5" /> Identity Prefs
                                    </CardTitle>
                                    <Settings2 className="w-4 h-4 text-slate-400 cursor-pointer" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {GENDER_OPTIONS.map((gender) => (
                                    <div key={gender.value} className="flex justify-between items-center group">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold">{gender.label}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">System Default</p>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-emerald-500" />
                                    </div>
                                ))}
                                <Separator className="my-4 dark:bg-slate-800" />
                                <Button variant="ghost" className="w-full text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 h-12 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Define Custom Identity
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-none shadow-2xl">
                            <CardContent className="p-6">
                                <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
                                <h3 className="text-xl font-bold mb-2 font-serif">Compliance Sync</h3>
                                <p className="text-xs opacity-70 mb-4 leading-relaxed">Ensure all regional settings align with GDPR and local data residency laws.</p>
                                <Button variant="secondary" className="w-full text-xs bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 border-none">
                                    Run Audit Report <ArrowUpRight className="w-3 h-3 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: MASTER/DETAIL LOCATIONS (8 COLUMNS) --- */}
                    <Card className="lg:col-span-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                        <div className="flex h-[700px]">

                            {/* COUNTRY SIDEBAR */}
                            <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Territories</span>
                                        <Badge variant="secondary" className="text-[9px]">{countries.length}</Badge>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                        <Input
                                            placeholder="Search..."
                                            className="pl-8 h-9 text-xs bg-slate-50 dark:bg-slate-950 border-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <ScrollArea className="flex-1">
                                    {filteredCountries.map(country => (
                                        <button
                                            key={country}
                                            onClick={() => setSelectedCountry(country)}
                                            className={`w-full text-left px-5 py-4 flex items-center justify-between group transition-all
                                                ${selectedCountry === country
                                                ? "bg-slate-100 dark:bg-slate-800/80 border-r-4 border-slate-900 dark:border-white shadow-inner"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Globe className={`w-4 h-4 ${selectedCountry === country ? "text-slate-900 dark:text-white" : "text-slate-300"}`} />
                                                <span className={`text-sm font-medium ${selectedCountry === country ? "text-slate-900 dark:text-white" : ""}`}>
                                                    {country}
                                                </span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCountry === country ? "opacity-100" : ""}`} />
                                        </button>
                                    ))}
                                </ScrollArea>
                            </div>

                            {/* DETAILS VIEW */}
                            <div className="flex-1 flex flex-col bg-white dark:bg-transparent">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">{selectedCountry}</h2>
                                        <p className="text-xs text-slate-500 italic">Operational regions and city switches.</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-[10px] h-8 dark:border-slate-700">
                                        Disable All in {selectedCountry}
                                    </Button>
                                </div>

                                <ScrollArea className="flex-1 p-6">
                                    <div className="grid gap-8">
                                        {Object.entries(locationData[selectedCountry]).map(([state, cities]: [string, any]) => (
                                            <div key={state} className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{state}</h4>
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {cities.map((city: string) => (
                                                        <div key={city} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-emerald-500 transition-colors" />
                                                                <span className="text-sm font-medium">{city}</span>
                                                            </div>
                                                            <Switch defaultChecked className="scale-75" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}