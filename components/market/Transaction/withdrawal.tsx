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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Building2,
  ShieldAlert,
  Wallet2,
  Info
} from "lucide-react"
import { ConnectedAccount } from "@/components/data/user-data"


interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  connectedAccounts: ConnectedAccount[]
}

type Step = "amount" | "method" | "review" | "success"

export function WithdrawalModal({
                                  isOpen,
                                  onClose,
                                  availableBalance,
                                  connectedAccounts,
                                }: WithdrawalModalProps) {
  const [step, setStep] = useState<Step>("amount")
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(connectedAccounts[0]?.id || "")
  const [isLoading, setIsLoading] = useState(false)

  // Professional Fee Logic: 1% fee or minimum €5.00
  const amountNum = parseFloat(amount) || 0
  const fee = amountNum > 0 ? Math.max(5, amountNum * 0.01) : 0
  const totalDebit = amountNum + fee

  const handleWithdraw = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    onClose()
  }

  const selectedAccount = connectedAccounts.find((acc) => acc.id === selectedMethod)

  return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl ring-1 ring-border/50">

          {/* Institutional Stepper Header */}
          <div className="bg-destructive/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Wallet2 className="h-4 w-4 text-destructive" />
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-foreground uppercase">Capital Outflow</span>
            </div>
            {step !== "success" && (
                <div className="flex gap-1.5">
                  {(['amount', 'method', 'review'] as Step[]).map((s) => (
                      <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step === s ? "bg-destructive w-10" : "bg-muted"}`} />
                  ))}
                </div>
            )}
          </div>

          <div className="p-6">
            {step === "amount" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Withdrawal Amount</DialogTitle>
                    <DialogDescription className="text-sm">
                      Specify the liquidity you wish to transfer to your external account.
                    </DialogDescription>
                  </header>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Cash</span>
                      <span className="font-serif font-bold text-lg">€{availableBalance.toLocaleString("en-DE")}</span>
                    </div>

                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">€</span>
                      <Input
                          id="withdrawal-amount"
                          placeholder="0.00"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 text-3xl font-serif h-20 bg-secondary/10 border-border/50 focus:ring-destructive/20 focus:border-destructive rounded-xl tabular-nums"
                          max={availableBalance}
                      />
                    </div>

                    {amountNum > availableBalance && (
                        <div className="flex items-center gap-2 text-destructive text-xs font-bold animate-pulse">
                          <ShieldAlert className="h-4 w-4" /> Insufficient liquidity available
                        </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={handleClose} className="flex-1 text-muted-foreground">Cancel</Button>
                    <Button
                        onClick={() => setStep("method")}
                        disabled={!amount || amountNum <= 0 || amountNum > availableBalance}
                        className="flex-1 rounded-xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/10"
                    >
                      Next Step <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
            )}

            {step === "method" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setStep("amount")} className="flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to Amount
                  </button>

                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Destination Node</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">Select a verified settlement account.</DialogDescription>
                  </header>

                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="gap-3">
                    {connectedAccounts.map((acc) => (
                        <div key={acc.id}>
                          <RadioGroupItem value={acc.id} id={acc.id} className="sr-only" />
                          <Label
                              htmlFor={acc.id}
                              className={`flex cursor-pointer items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                  selectedMethod === acc.id ? "border-destructive bg-destructive/5" : "border-border/40 hover:bg-secondary/40"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${selectedMethod === acc.id ? "bg-destructive text-white" : "bg-muted text-muted-foreground"}`}>
                                <Building2 className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{acc.provider}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">Account ending in {acc.lastFour}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                    ))}
                  </RadioGroup>

                  <Button onClick={() => setStep("review")} className="w-full h-12 rounded-xl">Review Settlement</Button>
                </div>
            )}

            {step === "review" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <header className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-serif">Review Settlement</DialogTitle>
                    <DialogDescription className="text-sm">Verify the details of this capital outflow.</DialogDescription>
                  </header>

                  <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                    <div className="p-4 bg-secondary/20 border-b border-border/40 flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Settlement Amount</span>
                      <span className="font-serif font-bold">€{amountNum.toLocaleString("en-DE", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="font-medium">€{fee.toLocaleString("en-DE", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination</span>
                        <span className="font-medium">{selectedAccount?.provider}</span>
                      </div>
                      <div className="pt-3 border-t border-border/40 flex justify-between items-baseline">
                        <span className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Total Debit</span>
                        <span className="text-xl font-serif font-black text-destructive">€{totalDebit.toLocaleString("en-DE", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 rounded-xl p-4 flex gap-3 border border-amber-500/10">
                    <Info className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Outgoing transfers are subject to a <span className="text-foreground font-bold">48-hour security hold</span>. Estimated arrival: <span className="text-foreground font-bold">2-3 business days</span>.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("method")} disabled={isLoading} className="flex-1 h-12 rounded-xl">Modify</Button>
                    <Button onClick={handleWithdraw} disabled={isLoading} className="flex-[2] h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Settlement"}
                    </Button>
                  </div>
                </div>
            )}

            {step === "success" && (
                <div className="space-y-6 py-4 animate-in zoom-in duration-500 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold">Settlement Initiated</h2>
                    <p className="text-muted-foreground text-sm">Your withdrawal of <span className="text-foreground font-bold">€{amountNum.toLocaleString()}</span> has been queued.</p>
                  </div>

                  <div className="bg-secondary/40 rounded-2xl p-4 text-left space-y-3 border border-border/40">
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Internal Ref</span>
                      <span className="text-foreground">WTH-SET-2026-X8</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Expected Payout</span>
                      <span className="text-foreground">Feb 26, 2026</span>
                    </div>
                  </div>

                  <Button onClick={handleClose} className="w-full h-12 rounded-xl">Close Transaction View</Button>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}