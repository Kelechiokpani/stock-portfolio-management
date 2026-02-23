"use client"

import { Banknote, ExternalLink, ShieldCheck, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectedAccount, KYCStatus } from "@/components/data/user-data"


interface SettlementNodesProps {
    accounts: ConnectedAccount[]
    kycStatus: KYCStatus
    formatCurrency: (val: number) => string
}

export function SettlementNodes({ accounts, kycStatus, formatCurrency }: SettlementNodesProps) {
    return (
        <div className="space-y-6">
            <Card className="border-none bg-secondary/30 shadow-inner ring-1 ring-border/40">
                <CardHeader>
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Settlement Nodes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="group p-4 rounded-xl bg-background/60 border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Banknote className="h-4 w-4" />
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-foreground">{acc.provider}</p>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                    {acc.accountName} <span className="opacity-50">•</span> ****{acc.lastFour}
                                </p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border/40 flex justify-between items-center">
                                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Linked Balance</span>
                                <span className="text-sm font-mono font-bold tabular-nums">
                  {formatCurrency(acc.balance)}
                </span>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full h-12 border-dashed border-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 hover:border-primary/50 transition-all"
                    >
                        <Plus className="mr-2 h-3 w-3" /> Connect via Plaid
                    </Button>
                </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    All connected accounts are verified via 128-bit encryption for secure{" "}
                    <span className="text-foreground font-bold uppercase not-italic">
            {kycStatus === 'verified' ? 'Institutional' : 'Standard'}
          </span>{" "}
                    trading.
                </p>
            </div>
        </div>
    )
}