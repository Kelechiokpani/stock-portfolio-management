"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Banknote,
  ArrowLeft,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { ConnectedAccount } from "@/components/data/user-data";
// 1. Import the mutation hook
import { useDepositFundsMutation } from "@/app/services/features/market/marketApi";
import { toast } from "sonner"; // Assuming you use sonner or similar for notifications

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAccounts: ConnectedAccount[];
  baseCurrency?: string;
}

type Step = "amount" | "method" | "review" | "success";

export function DepositModal({
  isOpen,
  onClose,
  connectedAccounts,
  baseCurrency = "EUR",
}: DepositModalProps) {
  // 2. Initialize the mutation
  const [depositFunds, { isLoading: isApiLoading }] = useDepositFundsMutation();

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(
    connectedAccounts[0]?.id || ""
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedAccount = connectedAccounts.find(
    (m) => m.id === selectedMethod
  );

  // 3. Functional Deposit Handler
  const handleDeposit = async () => {
    setErrorMessage(null);

    try {
      const payload = {
        amount: parseFloat(amount),
        method: selectedAccount?.provider || "Bank Transfer",
        currency: baseCurrency,
        description: `Institutional deposit via ${selectedAccount?.accountName}`,
      };

      // Execute API call
      await depositFunds(payload).unwrap();

      setStep("success");
      toast.success("Deposit initiated successfully");
    } catch (err: any) {
      console.error("Deposit Error:", err);
      setErrorMessage(
        err?.data?.message ||
          "Transaction failed. Please verify your source account."
      );
      toast.error("Deposit failed");
    }
  };

  const handleClose = () => {
    if (isApiLoading) return; // Prevent closing during active transaction
    setStep("amount");
    setAmount("");
    setErrorMessage(null);
    setSelectedMethod(connectedAccounts[0]?.id || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl ring-1 ring-border/50 bg-background">
        {/* Header Branding */}
        <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <Banknote className="h-5 w-5" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">
              Asset Liquidity
            </span>
          </div>
          {step !== "success" && (
            <div className="flex gap-1.5">
              {(["amount", "method", "review"] as Step[]).map((s) => (
                <div
                  key={s}
                  className={`h-1 w-4 rounded-full transition-all ${
                    step === s ? "bg-primary w-8" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-3 animate-in fade-in zoom-in-95">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-xs font-bold text-destructive leading-tight">
                {errorMessage}
              </p>
            </div>
          )}

          {step === "amount" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  Capital Allocation
                </h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Specify total deposit volume
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground group-focus-within:text-primary transition-colors">
                    €
                  </span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    type="number"
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 text-4xl font-black h-24 bg-muted/30 border-none focus-visible:ring-0 rounded-[2rem] tabular-nums tracking-tighter"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 25000, 50000, 100000, 500000].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      onClick={() => setAmount(val.toString())}
                      className={`h-12 border-border/40 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                        amount === val.toString()
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-primary/5"
                      }`}
                    >
                      €{val.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 font-bold text-[10px] uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep("method")}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-[2] rounded-[1.5rem] h-14 shadow-xl shadow-primary/20 font-black text-[11px] uppercase tracking-widest"
                >
                  Source Method <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "method" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setStep("amount")}
                className="flex items-center text-[10px] font-black text-muted-foreground hover:text-primary transition-colors tracking-widest"
              >
                <ArrowLeft className="mr-2 h-3 w-3" /> BACK TO VOLUME
              </button>

              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  Settlement Account
                </h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Select verified liquidity source
                </p>
              </div>

              <RadioGroup
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                className="gap-3"
              >
                {connectedAccounts.map((method) => (
                  <div key={method.id}>
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={method.id}
                      className={`flex cursor-pointer items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5 shadow-inner"
                          : "border-border/40 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            selectedMethod === method.id
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">
                            {method.provider}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {method.accountName} • {method.lastFour}
                          </p>
                        </div>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={() => setStep("review")}
                className="w-full h-14 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest"
              >
                Review Authorization
              </Button>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  Institutional Review
                </h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Confirm your liquidity transfer
                </p>
              </div>

              <div className="rounded-[2rem] bg-muted/30 p-8 border border-border/40 space-y-6">
                <div className="flex flex-col items-center border-b border-border pb-6 gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Transfer Amount
                  </span>
                  <span className="text-4xl font-black tracking-tighter tabular-nums text-primary">
                    €
                    {parseFloat(amount).toLocaleString("en-DE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="space-y-4">
                  <ReviewItem
                    label="Origin"
                    value={selectedAccount?.provider || "N/A"}
                  />
                  <ReviewItem label="Destination" value="FS Global Liquidity" />
                  <ReviewItem label="Fee" value="€0.00 (Standard)" isFree />
                </div>
              </div>

              <div className="bg-emerald-500/5 rounded-2xl p-5 flex gap-4 border border-emerald-500/10">
                <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider">
                  Funds typically settle within{" "}
                  <span className="text-foreground font-black italic">
                    12-24 hours
                  </span>
                  . Verified by AES-256 standard encryption.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("method")}
                  disabled={isApiLoading}
                  className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest"
                >
                  Modify
                </Button>
                <Button
                  onClick={handleDeposit}
                  disabled={isApiLoading}
                  className="flex-[2] h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-[11px] uppercase tracking-widest"
                >
                  {isApiLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Authorize Settlement"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-8 py-6 animate-in zoom-in duration-500 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                  Success
                </h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-relaxed px-10">
                  Transfer of{" "}
                  <span className="text-foreground font-black">
                    €{parseFloat(amount).toLocaleString()}
                  </span>{" "}
                  has been broadcasted.
                </p>
              </div>

              <div className="bg-muted/40 rounded-[1.5rem] p-6 text-left space-y-4 border border-border/40">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Auth Token
                  </span>
                  <span className="text-[10px] font-mono font-bold text-foreground">
                    TX-{Math.random().toString(36).substring(7).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Expected Settlement
                  </span>
                  <span className="text-[10px] font-black uppercase text-foreground">
                    Next Business Day
                  </span>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full h-14 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Internal Helper Components for cleaner code
function ReviewItem({
  label,
  value,
  isFree,
}: {
  label: string;
  value: string;
  isFree?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-[11px] font-black uppercase tracking-tight ${
          isFree ? "text-emerald-500" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
