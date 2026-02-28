"use client"

import React, { useState } from "react"
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    ShieldAlert,
    UserCheck,
    FileText,
    ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialRequests = [
    {
        id: "REQ-1001",
        name: "John Doe",
        email: "john.doe@finance.com",
        type: "Personal",
        status: "Pending",
        date: "2026-02-24",
        phone: "+1 (555) 000-0000",
        note: "Looking to open a long-term savings account for retirement and wealth management.",
        riskScore: "Low"
    },
    {
        id: "REQ-1002",
        name: "Tech Solutions Inc",
        email: "admin@techsolutions.io",
        type: "Business",
        status: "Approved",
        date: "2026-02-23",
        phone: "+1 (555) 123-4567",
        note: "Corporate investment portfolio management for series A funding capital.",
        riskScore: "Medium"
    },
    {
        id: "REQ-1003",
        name: "Green Earth NGO",
        email: "contact@greenearth.org",
        type: "Non-Profit",
        status: "Rejected",
        date: "2026-02-22",
        phone: "+1 (555) 987-6543",
        note: "Seeking tax-exempt fund management for global reforestation projects.",
        riskScore: "High"
    },
]

export default function AdminAccountRequests() {
    const [requests] = useState(initialRequests)
    const [selectedReq, setSelectedReq] = useState(initialRequests[0])
    const [searchTerm, setSearchTerm] = useState("")

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
            case "Rejected": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
            default: return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900"
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 transition-colors duration-300">
            <div className="mx-auto max-w-[1600px] space-y-8">

                {/* --- HEADER --- */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif">Account Requests</h1>
                        <p className="text-muted-foreground text-sm">Reviewing <span className="text-primary font-bold">12 new</span> applications today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="dark:bg-slate-900 dark:border-slate-800">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button size="sm" className="bg-slate-900 dark:bg-blue-600 text-white shadow-lg">
                            Batch Approve
                        </Button>
                    </div>
                </div>

                {/* --- ANALYTICS CARDS --- */}
                <div className="grid gap-4 md:grid-cols-4">
                    <MiniStat label="Total Volume" value="1,284" sub="+12%" icon={<FileText className="h-4 w-4 text-blue-500" />} />
                    <MiniStat label="Pending" value="43" sub="Urgent" icon={<Clock className="h-4 w-4 text-amber-500" />} />
                    <MiniStat label="Verified" value="88.4%" sub="Passed" icon={<UserCheck className="h-4 w-4 text-emerald-500" />} />
                    <MiniStat label="Risk Flags" value="03" sub="High" icon={<ShieldAlert className="h-4 w-4 text-rose-500" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* --- MAIN LIST (8 COLUMNS) --- */}
                    <Card className="lg:col-span-8 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b dark:border-slate-800 flex flex-row items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search applications..."
                                    className="pl-10 h-9 bg-slate-50 dark:bg-slate-800 border-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="ghost" size="sm" className="h-9"><Filter className="h-4 w-4 mr-2" /> Sort</Button>
                        </CardHeader>
                        <ScrollArea className="h-[600px]">
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 z-20">
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            onClick={() => setSelectedReq(req)}
                                            className={`cursor-pointer transition-colors ${selectedReq.id === req.id ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                                        >
                                            <TableCell className="font-mono text-[10px] text-slate-400">{req.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{req.name}</span>
                                                    <span className="text-[11px] text-slate-400">{req.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider">{req.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(req.status)} border-none shadow-none text-[10px]`}>
                                                    {req.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${selectedReq.id === req.id ? "translate-x-1 text-primary" : "text-slate-300"}`} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </Card>

                    {/* --- INSPECTION PANEL (4 COLUMNS) --- */}
                    <Card className="lg:col-span-4 border-none shadow-xl bg-white dark:bg-slate-900 sticky top-8 h-fit overflow-hidden">
                        <div className={`h-1.5 w-full ${selectedReq.status === 'Approved' ? 'bg-emerald-500' : selectedReq.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">{selectedReq.name}</CardTitle>
                                    <CardDescription>{selectedReq.id} • Submitted {selectedReq.date}</CardDescription>
                                </div>
                                <Badge className={selectedReq.riskScore === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                                    {selectedReq.riskScore} Risk
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                                    <p className="text-xs font-medium truncate">{selectedReq.email}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                                    <p className="text-xs font-medium">{selectedReq.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1"><FileText className="h-3 w-3" /> Application Note</p>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed dark:border-slate-700 text-xs italic leading-relaxed">
                                    "{selectedReq.note}"
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none h-11">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 h-11">
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                                <Button variant="ghost" className="w-full text-slate-400 text-xs">
                                    Flag for Manual Compliance Review
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

function MiniStat({ label, value, sub, icon }: any) {
    return (
        <Card className="border-none shadow-sm dark:bg-slate-900/50">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                    <p className={`text-[10px] mt-0.5 font-medium ${sub === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>{sub}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}