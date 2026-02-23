"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRightLeft,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
  Briefcase,
  UserPlus
} from "lucide-react"


import { Investment } from "@/components/data/user-data"
import {Badge} from "@/components/ui/badge";


interface Portfolio {
  id: string;
  name: string;
  holdings: Investment[];
}

interface TransferPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  portfolios: Portfolio[]
}

type Step = "select" | "recipient" | "confirm" | "success"

export function TransferPortfolioModal({
                                         isOpen,
                                         onClose,
                                         portfolios,
                                       }: TransferPortfolioModalProps) {
  const [step, setStep] = useState<Step>("select")
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientUserId, setRecipientUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  // Calculate total value and performance from holdings
  const portfolioValue = selectedPortfolio?.holdings.reduce((sum, h) => sum + h.value, 0) || 0
  const portfolioChange = selectedPortfolio?.holdings.reduce((sum, h) => sum + h.change, 0) || 0

  const handleTransfer = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("select")
    setSelectedPortfolioId("")
    setRecipientEmail("")
    setRecipientUserId("")
    setIsLoading(false)
    onClose()
  }

  return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl ring-1 ring-border/50">

          {/* Institutional Stepper Header */}
          <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ArrowRightLeft className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-foreground uppercase tracking-widest">Asset Migration</span>
            </div>
            {step !== "success" && (
                <div className="flex gap-1.5">
                  {(['select', 'recipient', 'confirm'] as Step[]).map((s) => (
                      <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step === s ? "bg-primary w-10" : "bg-muted"}`} />
                  ))}
                </div>
            )}
          </div>

          <div className="p-6">
            {/* STEP 1: PORTFOLIO SELECTION */}
            {step === "select" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Select Portfolio</DialogTitle>
                    <DialogDescription className="text-sm">Choose the asset group you wish to transfer ownership of.</DialogDescription>
                  </header>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="portfolio-select" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Managed Portfolios</Label>
                      <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                        <SelectTrigger
                            id="portfolio-select"
                            className="h-14 rounded-xl border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors focus:ring-primary"
                        >
                          <SelectValue placeholder="Select an allocation..." />
                        </SelectTrigger>


                        <SelectContent
                            className="rounded-xl border-border/50 bg-background shadow-2xl z-50 min-w-[var(--radix-select-trigger-width)]"
                        >
                          {portfolios.map((p) => (
                              <SelectItem
                                  key={p.id}
                                  value={p.id}
                                  className="py-3 px-4 rounded-lg focus:bg-primary/10 focus:text-primary transition-all cursor-pointer mx-1 my-1"
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-sm tracking-tight">{p.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">
                                    {p.holdings.length} Assets • €{p.holdings.reduce((s, h) => s + h.value, 0).toLocaleString()}
                            </span>
                                </div>
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>                    </div>

                    {selectedPortfolio && (
                        <div className="rounded-2xl bg-primary/[0.03] border border-primary/10 p-5 space-y-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Valuation</p>
                              <p className="text-2xl font-serif font-bold">€{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <Badge className={portfolioChange >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}>
                              {portfolioChange >= 0 ? "+" : ""}€{portfolioChange.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                            <div>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase">Asset Count</p>
                              <p className="text-sm font-bold">{selectedPortfolio.holdings.length} Positions</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase">Migration Status</p>
                              <p className="text-sm font-bold text-emerald-600">Eligible</p>
                            </div>
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="ghost" onClick={handleClose} className="flex-1 text-muted-foreground">Cancel</Button>
                    <Button
                        onClick={() => setStep("recipient")}
                        disabled={!selectedPortfolioId}
                        className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20"
                    >
                      Next Step <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
            )}

            {/* STEP 2: RECIPIENT IDENTIFICATION */}
            {step === "recipient" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setStep("select")} className="flex items-center text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to Selection
                  </button>

                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Identify Recipient</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">Specify the destination entity for this portfolio migration.</DialogDescription>
                  </header>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest">Verified Email Address</Label>
                      <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="institution@private-wealth.io"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="h-12 rounded-xl pl-10 bg-secondary/20 border-border/50"
                        />
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-tighter"><span className="bg-background px-2 text-muted-foreground">OR USE UNIQUE ID</span></div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-id" className="text-[10px] font-bold uppercase tracking-widest">User UUID</Label>
                      <Input
                          id="user-id"
                          placeholder="usr_XXXXXXXXXXXX"
                          value={recipientUserId}
                          onChange={(e) => setRecipientUserId(e.target.value)}
                          className="h-12 rounded-xl bg-secondary/20 border-border/50 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <Button
                      onClick={() => setStep("confirm")}
                      disabled={!recipientEmail && !recipientUserId}
                      className="w-full h-12 rounded-xl"
                  >
                    Continue to Verification
                  </Button>
                </div>
            )}

            {/* STEP 3: FINAL CONFIRMATION */}
            {step === "confirm" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <header className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-serif">Final Authorization</DialogTitle>
                    <DialogDescription className="text-sm">Please verify the migration details before signing.</DialogDescription>
                  </header>

                  <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                    <div className="p-4 bg-secondary/20 border-b border-border/40 flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Portfolio</span>
                      <span className="font-serif font-bold text-foreground">{selectedPortfolio?.name}</span>
                    </div>
                    <div className="p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Valuation</span>
                        <span className="font-bold">€{portfolioValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipient</span>
                        <span className="font-bold text-primary truncate max-w-[180px] text-right">{recipientEmail || recipientUserId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-rose-500/5 rounded-xl p-4 flex gap-3 border border-rose-500/10">
                    <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-rose-600 font-bold uppercase tracking-tighter">Irreversible Action:</span> Once transferred, you will lose all management rights and access to the holdings within this portfolio.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("recipient")} disabled={isLoading} className="flex-1 h-12 rounded-xl">Back</Button>
                    <Button onClick={handleTransfer} disabled={isLoading} className="flex-[2] h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Migration"}
                    </Button>
                  </div>
                </div>
            )}

            {/* SUCCESS STATE */}
            {step === "success" && (
                <div className="space-y-6 py-4 animate-in zoom-in duration-500 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold">Transfer Initiated</h2>
                    <p className="text-muted-foreground text-sm">Ownership transfer for <span className="text-foreground font-bold">{selectedPortfolio?.name}</span> has been sent.</p>
                  </div>

                  <div className="bg-secondary/40 rounded-2xl p-4 text-left space-y-3 border border-border/40">
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Recipient</span>
                      <span className="text-foreground truncate max-w-[150px]">{recipientEmail || recipientUserId}</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Auth Code</span>
                      <span className="text-foreground font-mono">XTR-902-PF</span>
                    </div>
                  </div>

                  <Button onClick={handleClose} className="w-full h-12 rounded-xl">Return to Transfers</Button>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}