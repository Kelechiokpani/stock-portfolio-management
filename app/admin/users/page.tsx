"use client"

import React, { useState } from "react"
import {
    Search,
    Filter,
    UserPlus,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    CreditCard,
    Mail,
    MapPin,
    ArrowUpDown,
    Download,
    History,
    Ban, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ManageUsersPage() {
    const [view, setView] = useState('all')

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-8 transition-colors duration-300">

            {/* --- TOP NAV & STATS --- */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif">User Directory</h1>
                    <p className="text-muted-foreground text-sm">Centralized control for <span className="text-primary font-semibold">4,129</span> active FS Group members.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden lg:flex dark:bg-slate-900 dark:border-slate-800">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <UserPlus className="w-4 h-4 mr-2" /> Provision New User
                    </Button>
                </div>
            </div>

            {/* --- USER HEALTH BENTO --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard label="Active Now" value="1,842" trend="+5%" icon={<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />} />
                <StatusCard label="Pending KYC" value="28" trend="Urgent" color="text-amber-500" icon={<ShieldAlert className="w-4 h-4 text-amber-500" />} />
                <StatusCard label="Flagged" value="12" trend="Review" color="text-rose-500" icon={<Ban className="w-4 h-4 text-rose-500" />} />
                <StatusCard label="Avg. Balance" value="$8,240" trend="Stable" icon={<CreditCard className="w-4 h-4 text-blue-500" />} />
            </div>

            {/* --- MAIN DATA TABLE --- */}
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader className="p-6 border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or country..."
                                className="pl-10 h-10 bg-slate-50 dark:bg-slate-800/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {['All', 'Verified', 'Suspended'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setView(tab.toLowerCase())}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${view === tab.toLowerCase() ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                                <TableHead className="w-[300px]">User Profile</TableHead>
                                <TableHead><div className="flex items-center gap-1 cursor-pointer">Location <ArrowUpDown className="w-3 h-3"/></div></TableHead>
                                <TableHead>KYC/Security</TableHead>
                                <TableHead>Wallet Balance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <UserRow
                                name="Adewale K."
                                email="ade.k@fsgroup.ng"
                                country="Nigeria"
                                city="Lekki"
                                status="Verified"
                                balance="1,450,000.00"
                                currency="NGN"
                                gender="Male"
                            />
                            <UserRow
                                name="Elena Rodriguez"
                                email="elena.rod@fin.com"
                                country="Spain"
                                city="Madrid"
                                status="Pending"
                                balance="12,400.00"
                                currency="EUR"
                                gender="Female"
                            />
                            <UserRow
                                name="Liam Smith"
                                email="liam.s@vault.io"
                                country="Canada"
                                city="Toronto"
                                status="Suspended"
                                balance="5,100.00"
                                currency="CAD"
                                gender="Other"
                            />
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

/* --- HELPER COMPONENTS --- */

function StatusCard({ label, value, trend, icon, color = "text-emerald-500" }: any) {
    return (
        <Card className="border-none shadow-sm dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-bold dark:text-white">{value}</p>
                    <p className={`text-[10px] font-medium ${color}`}>{trend}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}

function UserRow({ name, email, country, city, status, balance, currency, gender }: any) {
    return (
        <TableRow className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b dark:border-slate-800/50">
            <TableCell>
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm ring-1 ring-primary/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                        <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{name}</span>
                            <Badge variant="outline" className="text-[9px] h-4 font-normal py-0 px-1 opacity-60">{gender}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {email}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold flex items-center gap-1 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-rose-500" /> {country}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-4">{city}</span>
                </div>
            </TableCell>
            <TableCell>
                {status === 'Verified' ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none shadow-none text-[10px] py-0.5">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                ) : status === 'Pending' ? (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none shadow-none text-[10px] py-0.5">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                ) : (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none shadow-none text-[10px] py-0.5">
                        <Ban className="w-3 h-3 mr-1" /> Suspended
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100 italic">
                        {balance}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{currency}</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 dark:bg-slate-900 dark:border-slate-800">
                        <DropdownMenuLabel>Administrative Access</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2">
                            <History className="w-4 h-4" /> Transaction History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verify Identity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/30">
                            <Ban className="w-4 h-4" /> Suspend Account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}