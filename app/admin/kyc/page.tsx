"use client"

import React, { useState, useMemo } from "react"
import {
    AlertTriangle, CheckCircle, FileText, Eye, Download, ShieldCheck, User,
    MapPin, Briefcase, Fingerprint, Scale, ChevronRight, Search, XCircle,
    Maximize2, Check, Clock, Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

// --- MOCK DATABASE (Standardized) ---
const initialUsers = [
    {
        id: "REQ-9921",
        name: "Global Trade Ltd",
        type: "Business",
        time: "2h ago",
        steps: [
            { id: 1, name: "Email & Phone", status: "complete", doc: "Verified via SMS" },
            { id: 2, name: "Articles of Inc.", status: "complete", doc: "Articles_of_Inc.pdf" },
            { id: 3, name: "UBO Declaration", status: "complete", doc: "UBO_Form.pdf" },
            { id: 4, name: "Proof of Address", status: "current", doc: "Utility_Bill_HQ.pdf" },
            { id: 5, name: "Tax ID (TIN)", status: "pending", doc: "Tax_Reg_Doc.pdf" },
            { id: 6, name: "AML Screening", status: "pending", doc: "Database_Search.xml" },
            { id: 7, name: "Final Sign-off", status: "pending", doc: "Summary_Report.pdf" },
        ],
        riskMsg: "Address matches registered business HQ. No flags.",
        confidence: 94.2
    },
    {
        id: "REQ-8840",
        name: "Adewale K.",
        type: "Personal",
        time: "5m ago",
        steps: [
            { id: 1, name: "Phone OTP", status: "complete", doc: "OTP_Verified" },
            { id: 2, name: "Government ID", status: "current", doc: "NIN_Card_Front.jpg" },
            { id: 3, name: "Liveness Check", status: "pending", doc: "Selfie_Video.mp4" },
            { id: 4, name: "Address Proof", status: "pending", doc: "Bank_Statement.pdf" },
            { id: 5, name: "Employment", status: "pending", doc: "Payslip.pdf" },
            { id: 6, name: "PEP Screening", status: "pending", doc: "Watchlist_Check.pdf" },
            { id: 7, name: "Approval", status: "pending", doc: "Final_Decision.pdf" },
        ],
        riskMsg: "Applicant matches a name on the 'Soft PEP' list. Manual review required.",
        confidence: 88.8
    }
]

export default function KYC_Workbench() {
    const [users, setUsers] = useState(initialUsers)
    const [selectedUserId, setSelectedUserId] = useState(initialUsers[0].id)
    const [activeStepId, setActiveStepId] = useState(4) // Defaulting to first active step
    const [searchTerm, setSearchTerm] = useState("")

    // Find the current user and their current active step object
    const selectedUser:any = useMemo(() => users.find((u:any) => u.id === setSelectedUserId) || users[0], [users, selectedUserId])
    const currentStepData = useMemo(() => selectedUser.steps.find((s:any) => s.id === activeStepId), [selectedUser, activeStepId])

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.includes(searchTerm)
        )
    }, [searchTerm, users])

    // --- LOGIC: UPDATE STEP STATUS ---
    const handleApproveStep = () => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id !== selectedUser.id) return user;

            return {
                ...user,
                steps: user.steps.map(step =>
                    step.id === activeStepId ? { ...step, status: 'complete' } : step
                )
            };
        }));

        // Auto-advance to next step if available
        if (activeStepId < 7) setActiveStepId(prev => prev + 1);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">KYC Workbench</h1>
                        <p className="text-sm text-slate-500">Managing compliance for <span className="font-semibold">{selectedUser.name}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Case</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete Entire Case
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* --- LEFT SIDE: QUEUE --- */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search Queue..."
                                className="pl-9 bg-white dark:bg-slate-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Card className="border-none shadow-sm dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                            <ScrollArea className="h-[650px]">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUserId(user.id);
                                            // Reset active step to the first incomplete step or first step
                                            const firstIncomplete = user.steps.find(s => s.status !== 'complete');
                                            setActiveStepId(firstIncomplete ? firstIncomplete.id : 1);
                                        }}
                                        className={`p-4 border-b dark:border-slate-800 cursor-pointer transition-all 
                                            ${selectedUser.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold">{user.name}</span>
                                            <Badge variant="outline" className="text-[9px]">{user.type}</Badge>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>{user.id}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-2 h-2" /> {user.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* --- RIGHT SIDE: WORKSPACE --- */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* STEPPER BAR (NOW INTERACTIVE) */}
                        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-x-auto">
                            {selectedUser.steps.map((step:any) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStepId(step.id)}
                                    className={`flex items-center gap-2 px-3 py-2 shrink-0 rounded-lg transition-all
                                        ${activeStepId === step.id ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                                        ${step.status === 'complete' ? 'bg-emerald-500 text-white' :
                                        activeStepId === step.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
                                    >
                                        {step.status === 'complete' ? <Check className="w-3 h-3" /> : step.id}
                                    </div>
                                    <span className={`text-[11px] font-semibold ${activeStepId === step.id ? 'text-blue-600' : 'text-slate-500'}`}>
                                        {step.name}
                                    </span>
                                    {step.id !== 7 && <ChevronRight className="w-3 h-3 text-slate-300 ml-1" />}
                                </button>
                            ))}
                        </div>

                        {/* MAIN INSPECTOR */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* DOCUMENT PREVIEW */}
                            <Card className="xl:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex flex-row justify-between items-center py-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        {currentStepData?.name} Inspection
                                    </CardTitle>
                                    <Badge className={currentStepData?.status === 'complete' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}>
                                        {currentStepData?.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-full max-w-md aspect-[4/3] bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                                            <Eye className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-xs font-mono text-slate-500 mb-2">{currentStepData?.doc}</p>
                                        <Button variant="outline" size="sm">Open Document</Button>
                                    </div>
                                </CardContent>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 flex justify-between">
                                    <Button variant="ghost" className="text-xs text-rose-500">Flag for Rejection</Button>
                                    <Button
                                        disabled={currentStepData?.status === 'complete'}
                                        onClick={handleApproveStep}
                                        className="bg-slate-900 dark:bg-blue-600 text-white"
                                    >
                                        {currentStepData?.status === 'complete' ? "Step Verified" : `Verify ${currentStepData?.name}`}
                                    </Button>
                                </div>
                            </Card>

                            {/* SIDE PANELS */}
                            <div className="space-y-6">
                                <Card className="border-none shadow-lg dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Logic Check
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/10">
                                            <p className="text-[11px] leading-relaxed">
                                                AI scanned <strong>{currentStepData?.doc}</strong>. System confidence for this step is <strong>{selectedUser.confidence}%</strong>.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// "use client"
//
// import React, { useState, useMemo } from "react"
// import {
//     AlertTriangle, CheckCircle, FileText, Eye, Download, ShieldCheck, User,
//     MapPin, Briefcase, Fingerprint, Scale, ChevronRight, Search, XCircle,
//     Maximize2, Check, Clock, Filter,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import {Input} from "@/components/ui/input";
//
// // --- MOCK DATABASE ---
// const mockUsers = [
//     {
//         id: "REQ-9921",
//         name: "Global Trade Ltd",
//         type: "Business",
//         time: "2h ago",
//         currentStep: 4,
//         steps: [
//             { id: 1, name: "Email & Phone", status: "complete" },
//             { id: 2, name: "Articles of Inc.", status: "complete" },
//             { id: 3, name: "UBO Declaration", status: "complete" },
//             { id: 4, name: "Proof of Address", status: "current" },
//             { id: 5, name: "Tax ID (TIN)", status: "pending" },
//             { id: 6, name: "AML Screening", status: "pending" },
//             { id: 7, name: "Final Sign-off", status: "pending" },
//         ],
//         docName: "Utility_Bill_HQ.pdf",
//         riskMsg: "Address matches registered business HQ. No flags.",
//         confidence: 94.2
//     },
//     {
//         id: "REQ-8840",
//         name: "Adewale K.",
//         type: "Personal",
//         time: "5m ago",
//         currentStep: 2,
//         steps: [
//             { id: 1, name: "Phone OTP", status: "complete" },
//             { id: 2, name: "Government ID", status: "current" },
//             { id: 3, name: "Liveness Check", status: "pending" },
//             { id: 4, name: "Address Proof", status: "pending" },
//             { id: 5, name: "Employment", status: "pending" },
//             { id: 6, name: "PEP Screening", status: "pending" },
//             { id: 7, name: "Approval", status: "pending" },
//         ],
//         docName: "NIN_Card_Front.jpg",
//         riskMsg: "Applicant matches a name on the 'Soft PEP' list. Manual review required.",
//         confidence: 98.8
//     },
//     {
//         id: "REQ-7712",
//         name: "Elena Rodriguez",
//         type: "Personal",
//         time: "14h ago",
//         currentStep: 6,
//         steps: [
//             { id: 1, name: "Email", status: "complete" },
//             { id: 2, name: "Passport", status: "complete" },
//             { id: 3, name: "Selfie-Match", status: "complete" },
//             { id: 4, name: "Lease Agreement", status: "complete" },
//             { id: 5, name: "Salary Slip", status: "complete" },
//             { id: 6, name: "World-Check AML", status: "current" },
//             { id: 7, name: "Compliance Approval", status: "pending" },
//         ],
//         docName: "AML_Report_v4.pdf",
//         riskMsg: "Clear result from World-Check. No sanctions found.",
//         confidence: 100
//     }
// ]
//
// export default function KYC_User() {
//     const [selectedUser, setSelectedUser] = useState(mockUsers[0])
//     const [searchTerm, setSearchTerm] = useState("")
//
//     // Filtered list logic
//     const filteredUsers = useMemo(() => {
//         return mockUsers.filter(u =>
//             u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             u.id.includes(searchTerm)
//         )
//     }, [searchTerm])
//
//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 lg:p-8 transition-all">
//             <div className="mx-auto max-w-[1600px] space-y-6">
//
//                 {/* --- HEADER --- */}
//                 <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight font-serif">KYC Workbench</h1>
//                         <p className="text-sm text-slate-500 dark:text-slate-400">Reviewing identity and compliance for FS Group candidates.</p>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button variant="outline" className="dark:bg-slate-900 dark:border-slate-800">
//                             <Download className="w-4 h-4 mr-2" /> Download Case
//                         </Button>
//                         <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20">
//                             <CheckCircle className="w-4 h-4 mr-2" /> Complete Verification
//                         </Button>
//                     </div>
//                 </header>
//
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//
//                     {/* --- LEFT SIDE: QUEUE (3 COLUMNS) --- */}
//                     <div className="lg:col-span-3 space-y-4">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                             <Input
//                                 placeholder="Search Queue..."
//                                 className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//
//                         <Card className="border-none shadow-sm dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
//                             <CardHeader className="p-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
//                                 <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Active Queue ({filteredUsers.length})</CardTitle>
//                             </CardHeader>
//                             <ScrollArea className="h-[600px]">
//                                 {filteredUsers.map((user) => (
//                                     <div
//                                         key={user.id}
//                                         onClick={() => setSelectedUser(user)}
//                                         className={`p-4 border-b dark:border-slate-800 last:border-0 cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10
//                                             ${selectedUser.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary' : ''}`}
//                                     >
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-sm font-bold">{user.name}</span>
//                                             <Badge variant="outline" className="text-[9px] px-1 h-4">{user.type}</Badge>
//                                         </div>
//                                         <div className="flex justify-between text-[10px] text-slate-500">
//                                             <span>{user.id}</span>
//                                             <span className="flex items-center gap-1"><Clock className="w-2 h-2" /> {user.time}</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </ScrollArea>
//                         </Card>
//                     </div>
//
//                     {/* --- RIGHT SIDE: STEPPER & WORKSPACE (9 COLUMNS) --- */}
//                     <div className="lg:col-span-9 space-y-6">
//
//                         {/* THE STEPPER BAR */}
//                         <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-x-auto">
//                             {selectedUser.steps.map((step) => (
//                                 <div key={step.id} className="flex items-center gap-2 px-3 py-2 shrink-0">
//                                     <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
//                                         ${step.status === 'complete' ? 'bg-emerald-500 text-white' :
//                                         step.status === 'current' ? 'bg-primary text-white scale-110 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
//                                     >
//                                         {step.status === 'complete' ? <Check className="w-3 h-3" /> : step.id}
//                                     </div>
//                                     <span className={`text-[11px] font-semibold whitespace-nowrap ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
//                                         {step.name}
//                                     </span>
//                                     {step.id !== 7 && <ChevronRight className="w-3 h-3 text-slate-300" />}
//                                 </div>
//                             ))}
//                         </div>
//
//                         {/* THE MAIN INSPECTOR */}
//                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//
//                             {/* DOCUMENT PREVIEW */}
//                             <Card className="xl:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
//                                 <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex flex-row justify-between items-center py-3">
//                                     <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
//                                         <FileText className="w-4 h-4 text-primary" /> Active Document Preview
//                                     </CardTitle>
//                                     <div className="flex gap-2">
//                                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800"><Maximize2 className="w-4 h-4" /></Button>
//                                     </div>
//                                 </CardHeader>
//                                 <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
//                                     <div className="w-full max-w-md aspect-[4/3] bg-slate-100 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center group cursor-zoom-in hover:border-primary transition-all shadow-inner">
//                                         <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
//                                             <FileText className="w-10 h-10 text-slate-400" />
//                                         </div>
//                                         <p className="text-xs font-mono text-slate-400">{selectedUser.docName}</p>
//                                         <Button variant="secondary" size="sm" className="mt-6 text-[11px] h-8">View High-Res Scan</Button>
//                                     </div>
//                                 </CardContent>
//                                 <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 flex justify-between">
//                                     <Button variant="ghost" className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">Flag Discrepancy</Button>
//                                     <Button size="sm" className="h-8 bg-slate-900 dark:bg-blue-600 text-white">Approve Step {selectedUser.currentStep}</Button>
//                                 </div>
//                             </Card>
//
//                             {/* RISK & DATA PANEL */}
//                             <div className="space-y-6">
//                                 <Card className="border-none shadow-lg dark:bg-slate-900 bg-white ring-1 ring-slate-200 dark:ring-slate-800">
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                                             <ShieldCheck className="w-4 h-4 text-emerald-500" /> AI Insights
//                                         </CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <div className="flex justify-between text-[11px] font-bold">
//                                                 <span>Data Match Accuracy</span>
//                                                 <span className={selectedUser.confidence > 95 ? "text-emerald-500" : "text-amber-500"}>{selectedUser.confidence}%</span>
//                                             </div>
//                                             <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                                                 <div
//                                                     className={`h-full transition-all duration-1000 ${selectedUser.confidence > 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
//                                                     style={{ width: `${selectedUser.confidence}%` }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className={`p-3 rounded-xl border flex gap-3 ${selectedUser.confidence < 95 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
//                                             <AlertTriangle className={`w-5 h-5 shrink-0 ${selectedUser.confidence < 95 ? 'text-amber-500' : 'text-emerald-500'}`} />
//                                             <p className="text-[11px] leading-relaxed font-medium">
//                                                 {selectedUser.riskMsg}
//                                             </p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card className="border-none shadow-lg dark:bg-slate-900 bg-white ring-1 ring-slate-200 dark:ring-slate-800">
//                                     <CardHeader className="pb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Manual Controls</CardHeader>
//                                     <CardContent className="space-y-2">
//                                         <Button variant="outline" className="w-full justify-start text-xs h-9 dark:bg-slate-800 dark:border-slate-700">
//                                             <XCircle className="w-4 h-4 mr-2 text-rose-500" /> Request Re-submission
//                                         </Button>
//                                         <Button variant="outline" className="w-full justify-start text-xs h-9 dark:bg-slate-800 dark:border-slate-700">
//                                             <Search className="w-4 h-4 mr-2 text-blue-500" /> Open External AML Check
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }