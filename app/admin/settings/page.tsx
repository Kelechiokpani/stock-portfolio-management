"use client"

import React, { useState } from "react"
import {
    Settings, Globe, Lock, Bell, Database, ShieldCheck,
    Smartphone, Mail, Save, Trash2, Key,
    CreditCard, Server, Fingerprint, Activity, ChevronRight,
    AlertCircle, RefreshCcw, Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function GeneralAdminSettings() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto p-6 lg:p-10 space-y-10">

                {/* --- TOP BAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment: Production</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight font-serif italic">Core Configuration</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Orchestrate global parameters and system-wide security protocols.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-11 px-6 dark:bg-slate-900 dark:border-slate-800">
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset View
                        </Button>
                        <Button className="h-11 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 shadow-xl shadow-slate-900/10">
                            <Save className="w-4 h-4 mr-2" /> Commit All Changes
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="flex flex-col lg:flex-row gap-12">

                    {/* --- NAVIGATION SIDEBAR --- */}
                    <TabsList className="flex lg:flex-col h-auto bg-transparent border-none gap-1 p-0 lg:w-72 shrink-0">
                        <SettingsTabTrigger value="general" icon={<Settings className="w-4 h-4" />} label="Platform Identity" />
                        <SettingsTabTrigger value="market" icon={<Globe className="w-4 h-4" />} label="Market Localization" />
                        <SettingsTabTrigger value="security" icon={<Lock className="w-4 h-4" />} label="Security & Access" />
                        <SettingsTabTrigger value="notifications" icon={<Bell className="w-4 h-4" />} label="Communication Hub" />
                        {/*<SettingsTabTrigger value="api" icon={<CloudZap className="w-4 h-4" />} label="API Infrastructure" />*/}
                    </TabsList>

                    {/* --- CONTENT AREA --- */}
                    <div className="flex-1 max-w-4xl">

                        {/* 1. GENERAL SETTINGS */}
                        <TabsContent value="general" className="mt-0 space-y-8">
                            <SectionHeader title="Organization Profile" desc="Set the public-facing identity for your FS platform." />
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-tighter">Legal Platform Name</Label>
                                            <Input defaultValue="FS Group VaultStock" className="h-11 dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-tighter">Compliance Email</Label>
                                            <Input defaultValue="legal@fsgroup.com" className="h-11 dark:bg-slate-950" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-tighter">Primary Web Domain</Label>
                                        <div className="flex items-center">
                                            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 dark:border-slate-700 rounded-l-md text-[10px] font-bold">HTTPS://</span>
                                            <Input defaultValue="vault.fsgroup.com" className="rounded-l-none h-11 dark:bg-slate-950" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-amber-500/5 dark:bg-amber-500/10 ring-1 ring-amber-500/20">
                                <CardHeader>
                                    <CardTitle className="text-amber-800 dark:text-amber-500 flex items-center gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4" /> Hard Maintenance Mode
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between pb-6">
                                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 max-w-md">
                                        Forcibly disconnect all active user sessions and display a maintenance screen. Only admins with direct bypass keys will be able to login.
                                    </p>
                                    <Switch />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 2. MARKET SETTINGS */}
                        <TabsContent value="market" className="mt-0 space-y-8">
                            <SectionHeader title="Regional Logic" desc="Manage how the platform behaves in different jurisdictions." />
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-tighter">Base Currency</Label>
                                            <Input defaultValue="USD - United States Dollar" readOnly className="h-11 bg-slate-50 dark:bg-slate-800" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-tighter">System Timezone</Label>
                                            <Input defaultValue="UTC (Coordinated Universal Time)" className="h-11 dark:bg-slate-950" />
                                        </div>
                                    </div>
                                    <Separator className="dark:bg-slate-800" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold">Auto-Detect Region</p>
                                            <p className="text-xs text-slate-500">Route users to local instances based on IP.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 3. SECURITY SETTINGS */}
                        <TabsContent value="security" className="mt-0 space-y-8">
                            <SectionHeader title="Access Governance" desc="Enforce strict authentication and session rules." />
                            <div className="grid gap-6">
                                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                    <CardContent className="p-0">
                                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="p-2 bg-slate-900 dark:bg-white rounded-lg">
                                                    <Fingerprint className="w-5 h-5 text-white dark:text-slate-900" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold tracking-tight">Multi-Factor Enforcement</p>
                                                    <p className="text-xs text-slate-500">Mandatory TOTP for all administrative roles.</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                    <Server className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold tracking-tight">IP Whitelisting</p>
                                                    <p className="text-xs text-slate-500">Only allow traffic from corporate VPN ranges.</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="p-6 bg-slate-900 text-white rounded-xl flex justify-between items-center shadow-2xl">
                                    <div>
                                        <h4 className="font-bold text-sm">Security Audit Logs</h4>
                                        <p className="text-xs opacity-60">Review login attempts and system changes.</p>
                                    </div>
                                    <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-none text-white text-xs">
                                        View Logs <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* 4. NOTIFICATIONS */}
                        <TabsContent value="notifications" className="mt-0 space-y-8">
                            <SectionHeader title="Communication Channels" desc="Configure SMTP and SMS gateway providers." />
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> SMTP (Email Service)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Host</Label>
                                            <Input defaultValue="smtp.sendgrid.net" className="dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Port</Label>
                                            <Input defaultValue="587" className="dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Encryption</Label>
                                            <Input defaultValue="TLS" className="dark:bg-slate-950" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="text-xs h-9">Send Test Mail</Button>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none">Connected</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 5. API SETTINGS */}
                        <TabsContent value="api" className="mt-0 space-y-8">
                            <SectionHeader title="API Infrastructure" desc="Manage third-party data keys and platform webhooks." />
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <CardContent className="p-0">
                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <Label className="text-[10px] font-black uppercase text-slate-400">Marketstack API (Data Feed)</Label>
                                                    <p className="text-xs text-slate-500">Required for real-time stock pricing.</p>
                                                </div>
                                                <Badge variant="outline" className="border-slate-200">Production</Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                    <Input type="password" value="MS_LIVE_7721_VX9901" readOnly className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                                </div>
                                                <Button variant="outline" className="h-11">Rotate Key</Button>
                                            </div>
                                        </div>

                                        <Separator className="dark:bg-slate-800" />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <Label className="text-[10px] font-black uppercase text-slate-400">Webhooks Endpoint</Label>
                                                    <p className="text-xs text-slate-500">Listener for external transaction status updates.</p>
                                                </div>
                                            </div>
                                            <Input defaultValue="https://hooks.fsgroup.com/v1/updates" className="h-11 dark:bg-slate-950" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </div>
                </Tabs>
            </div>
        </div>
    )
}

/* --- HELPER COMPONENTS --- */

function SectionHeader({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    )
}

function SettingsTabTrigger({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="w-full justify-start gap-4 px-5 py-4 data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900 data-[state=active]:shadow-2xl data-[state=active]:shadow-slate-900/10 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
            <span className="opacity-70">{icon}</span>
            <span className="text-sm font-semibold tracking-tight">{label}</span>
        </TabsTrigger>
    )
}