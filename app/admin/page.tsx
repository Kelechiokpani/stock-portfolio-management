"use client"

import React from "react"
import {
    BarChart3,
    Users,
    ShieldCheck,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    MoreHorizontal,
    Plus,
    Activity,
    Globe,
    Zap,
    Filter,
    Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function AdminOverview() {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">

            {/* 1. TOP UTILITY BAR (System Health) */}
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium">Marketstack: Online</span>
                </div>
                <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-800">
                    <Activity className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-medium">Server Latency: 24ms</span>
                </div>
                <div className="ml-auto hidden md:flex items-center gap-4">
                    <span className="text-xs text-slate-500 italic">Last auto-refresh: Just now</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs italic"><Zap className="h-3 w-3 mr-1" /> Re-sync API</Button>
                </div>
            </div>

            {/* 2. HEADER SECTION */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
                    <p className="text-slate-500 dark:text-slate-400">Strategic overview for FS Group ecosystem.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <Calendar className="mr-2 h-4 w-4" /> Feb 2026
                    </Button>
                    <Button size="sm" className="bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-lg">
                        <Plus className="mr-2 h-4 w-4" /> Create Manual Entry
                    </Button>
                </div>
            </div>

            {/* 3. PRIMARY KPI GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Applications" value="2,845" change="+18.2%" trend="up" icon={<Users className="h-4 w-4" />} color="primary" />
                <StatCard title="Pending Review" value="42" change="-4.1%" trend="down" icon={<Clock className="h-4 w-4" />} color="amber" />
                <StatCard title="Conversion Rate" value="64.3%" change="+2.4%" trend="up" icon={<ShieldCheck className="h-4 w-4" />} color="emerald" />
                <StatCard title="Risk Alerts" value="7" change="+2" trend="up" icon={<AlertCircle className="h-4 w-4" />} color="rose" />
            </div>

            <div className="grid gap-6 md:grid-cols-12">

                {/* 4. MAIN ANALYTICS (8 Columns) */}
                <div className="md:col-span-8 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Application Velocity</CardTitle>
                                <CardDescription>Monitoring the intake of new account requests.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8"><Filter className="h-3 w-3" /></Button>
                                <Tabs defaultValue="7d">
                                    <TabsList className="h-8">
                                        <TabsTrigger value="7d" className="text-[10px]">7D</TabsTrigger>
                                        <TabsTrigger value="30d" className="text-[10px]">30D</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center border-t border-slate-100 dark:border-slate-800 italic text-muted-foreground">
                            [Interactive Area Chart Rendering Here]
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Quick Action Card */}
                        <Card className="border-none shadow-sm bg-blue-600 dark:bg-blue-700 text-white">
                            <CardHeader>
                                <CardTitle className="text-lg">New Policy Update</CardTitle>
                                <CardDescription className="text-blue-100">Review the updated KYC guidelines for 2026.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="secondary" className="w-full text-blue-700">Read Document</Button>
                            </CardContent>
                        </Card>

                        {/* Verification Progress */}
                        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Batch Processing Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span>Identity Verification (Automated)</span>
                                    <span className="font-bold text-emerald-500">88%</span>
                                </div>
                                <Progress value={88} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 5. SIDEBAR CONTENT (4 Columns) */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Activity Stream</CardTitle>
                            <Badge variant="outline" className="font-normal">Real-time</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ActivityItem name="Sarah Jenkins" action="Business Request" time="2 mins" initials="SJ" color="bg-blue-500/10 text-blue-600" />
                            <ActivityItem name="System" action="KYC Failed: REQ-882" time="1 hour" initials="SY" color="bg-rose-500/10 text-rose-600" />
                            <ActivityItem name="Marcus Wright" action="Approved REQ-901" time="3 hours" initials="MW" color="bg-emerald-500/10 text-emerald-600" />
                            <ActivityItem name="Global Alert" action="Maintenance Post" time="5 hours" initials="GA" color="bg-amber-500/10 text-amber-600" />
                        </CardContent>
                        <div className="px-6 pb-6">
                            <Button variant="ghost" className="w-full text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
                                Expand Activity Logs
                            </Button>
                        </div>
                    </Card>

                    {/* Regional Distribution */}
                    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-sm">Top Regional Growth</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">United States</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-500">+12%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">Nigeria</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-500">+8%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, trend, icon, color }: any) {
    const colorMap: any = {
        primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
        amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
        rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                <div className={`flex items-center text-xs mt-2 font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {change} <span className="ml-1 text-slate-400 font-normal italic">vs last month</span>
                </div>
            </CardContent>
        </Card>
    )
}

function ActivityItem({ name, action, time, initials, color }: any) {
    return (
        <div className="flex gap-4 items-center group cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${color}`}>
                {initials}
            </div>
            <div className="space-y-1 flex-1">
                <p className="text-sm leading-none font-medium text-slate-900 dark:text-slate-100">{name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{action}</p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono italic">{time}</div>
        </div>
    )
}