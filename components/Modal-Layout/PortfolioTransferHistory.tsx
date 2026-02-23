"use client"

import {
    ArrowLeftRight,
    History,
    UserCircle2,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockTransfer } from "@/components/data/user-data";

interface PortfolioTransferHistoryProps {
    transfers: StockTransfer[]
    baseCurrency: string
}

export function PortfolioTransferHistory({ transfers, baseCurrency }: PortfolioTransferHistoryProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return { icon: <CheckCircle2 className="h-3 w-3" />, class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
            case "pending":
                return { icon: <Clock className="h-3 w-3" />, class: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
            default:
                return { icon: <XCircle className="h-3 w-3" />, class: "bg-rose-500/10 text-rose-600 border-rose-500/20" }
        }
    }

    return (
        <Card className="border-none shadow-sm ring-1 ring-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div className="space-y-1">
                    <CardTitle className="font-serif text-xl">Asset Ledger</CardTitle>
                    <CardDescription className="text-[10px] uppercase tracking-[0.15em] font-black text-muted-foreground">
                        Migration Audit Trail
                    </CardDescription>
                </div>
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <History className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {transfers.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-2xl border-border/40">
                            <History className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">No migrations recorded</p>
                        </div>
                    ) : (
                        transfers.map((transfer) => {
                            const statusStyle = getStatusConfig(transfer.status)
                            const isInbound = transfer.type === "inbound"

                            return (
                                <div key={transfer.id} className="group relative flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/60 hover:bg-accent/40 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isInbound ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {isInbound ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-bold text-foreground leading-none">{transfer.assetName}</p>
                                                <Badge variant="outline" className="text-[8px] font-black uppercase px-1 h-3.5 border-muted-foreground/30">
                                                    {transfer.assetSymbol}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <div className="flex items-center text-[9px] text-muted-foreground font-bold uppercase tracking-tight">
                                                    {isInbound ? `From: ${transfer.fromUser.split(' ')[0]}` : `To: ${transfer.toUser.split(' ')[0]}`}
                                                </div>
                                                <span className="text-muted-foreground/30 text-[9px]">•</span>
                                                <p className="text-[9px] text-muted-foreground font-medium">
                                                    {new Date(transfer.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-black tabular-nums">
                                            {transfer.shares.toLocaleString()} <span className="text-[9px] text-muted-foreground font-normal">Units</span>
                                        </p>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/80">
                                                €{transfer.valueAtTransfer.toLocaleString()}
                                            </p>
                                            <div className={`h-1.5 w-1.5 rounded-full ${transfer.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}