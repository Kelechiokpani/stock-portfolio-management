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
  ChevronRight,
  Banknote,
  ArrowLeft,
  ShieldCheck,
  Wallet
} from "lucide-react"
import { ConnectedAccount } from "@/components/data/user-data" // Updated to your provided type

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  connectedAccounts: ConnectedAccount[] // Using your data type
  baseCurrency?: string
}

type Step = "amount" | "method" | "review" | "success"

export function DepositModal({
                               isOpen,
                               onClose,
                               connectedAccounts,
                               baseCurrency = "EUR"
                             }: DepositModalProps) {
  const [step, setStep] = useState<Step>("amount")
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(connectedAccounts[0]?.id || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    setSelectedMethod(connectedAccounts[0]?.id || "")
    onClose()
  }

  const selectedAccount = connectedAccounts.find((m) => m.id === selectedMethod)

  return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl ring-1 ring-border/50">

          {/* Header Branding/Step Indicator */}
          <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Banknote className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-foreground uppercase">FS Liquidity</span>
            </div>
            {step !== "success" && (
                <div className="flex gap-1.5">
                  {(['amount', 'method', 'review'] as Step[]).map((s) => (
                      <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step === s ? "bg-primary w-10" : "bg-muted"}`} />
                  ))}
                </div>
            )}
          </div>

          <div className="p-6">
            {step === "amount" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Deposit Amount</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                      Enter the capital amount you wish to allocate to your account.
                    </DialogDescription>
                  </header>

                  <div className="space-y-4">
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">€</span>
                      <Input
                          id="amount"
                          placeholder="0.00"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 text-3xl font-serif h-20 bg-secondary/20 border-border/50 focus:ring-primary focus:border-primary rounded-xl tabular-nums"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[1000, 5000, 10000, 25000, 50000, 100000].map((val) => (
                          <Button
                              key={val}
                              variant="outline"
                              onClick={() => setAmount(val.toString())}
                              className={`h-11 border-border/50 rounded-lg text-xs font-bold transition-all ${
                                  amount === val.toString() ? "bg-primary text-primary-foreground border-primary" : "hover:bg-primary/5"
                              }`}
                          >
                            €{val.toLocaleString()}
                          </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={handleClose} className="flex-1 text-muted-foreground">Cancel</Button>
                    <Button
                        onClick={() => setStep("method")}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20"
                    >
                      Review Methods <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
            )}

            {step === "method" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setStep("amount")} className="flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-1 h-3 w-3" /> BACK TO AMOUNT
                  </button>

                  <header className="space-y-1">
                    <DialogTitle className="text-2xl font-serif">Select Settlement</DialogTitle>
                    <DialogDescription className="text-sm">Choose a verified source account.</DialogDescription>
                  </header>

                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="gap-3">
                    {connectedAccounts.map((method) => (
                        <div key={method.id}>
                          <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                          <Label
                              htmlFor={method.id}
                              className={`flex cursor-pointer items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                  selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border/40 hover:bg-secondary/40"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${selectedMethod === method.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                <Wallet className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm leading-tight">{method.provider}</p>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{method.accountName} (****{method.lastFour})</p>
                              </div>
                            </div>
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? "border-primary" : "border-muted"}`}>
                              {selectedMethod === method.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                          </Label>
                        </div>
                    ))}
                  </RadioGroup>

                  <Button onClick={() => setStep("review")} className="w-full h-12 rounded-xl">Continue to Review</Button>
                </div>
            )}

            {step === "review" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <header className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-serif">Final Verification</DialogTitle>
                    <DialogDescription className="text-sm">Please confirm your institutional transfer.</DialogDescription>
                  </header>

                  <div className="rounded-2xl bg-secondary/30 p-6 border border-border/40 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-border pb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Allocation</span>
                      <span className="text-2xl font-serif font-bold">€{parseFloat(amount).toLocaleString("en-DE", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Origin</span>
                        <span className="font-bold text-foreground">{selectedAccount?.provider}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Destination</span>
                        <span className="font-bold text-foreground">FS Liquidity Wallet</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="font-bold text-emerald-500">€0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 flex gap-3 border border-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Transfers are secured with bank-grade AES-256 encryption. Funds typically settle within <span className="text-foreground font-bold">12-24 business hours</span>.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("method")} disabled={isLoading} className="flex-1 h-12 rounded-xl">Modify</Button>
                    <Button onClick={handleDeposit} disabled={isLoading} className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Deposit"}
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
                    <h2 className="text-2xl font-serif font-bold">Deposit Authorized</h2>
                    <p className="text-muted-foreground text-sm">Transfer of <span className="text-foreground font-bold">€{parseFloat(amount).toLocaleString()}</span> is in progress.</p>
                  </div>

                  <div className="bg-secondary/40 rounded-2xl p-4 text-left space-y-2 border border-border/40">
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Transaction Hash</span>
                      <span className="text-foreground">FSR-9982-X2</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                      <span>Expected Settlement</span>
                      <span className="text-foreground">Today, 5:00 PM</span>
                    </div>
                  </div>

                  <Button onClick={handleClose} className="w-full h-12 rounded-xl">Dismiss</Button>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}