"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useWithdrawFundsMutation } from "@/app/services/features/market/marketApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Wallet2,
  Lock,
  AlertTriangle,
  SearchCheck,
} from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  userProfile?: {
    withdrawalFailures: number;
  };
}

type Step = "amount" | "details" | "success" | "resettlement";

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  userProfile,
}: WithdrawalModalProps) {
  // Navigation State
  const [step, setStep] = useState<Step>(
    (userProfile?.withdrawalFailures || 0) >= 3 ? "resettlement" : "amount"
  );

  // Form State
  const [amount, setAmount] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bankData, setBankData] = useState({
    accountNumber: "",
    routingNumber: "",
    resolvedName: "",
  });

  const [withdrawFunds, { isLoading: isSubmitting }] =
    useWithdrawFundsMutation();

  const amountNum = parseFloat(amount) || 0;

  // --- VALIDATION ENGINE ---
  const validation = useMemo(() => {
    const errors: string[] = [];

    // Account Number: Standard 10 digits (common) up to 12
    const isAccValid = /^\d{10,12}$/.test(bankData.accountNumber);
    if (bankData.accountNumber && !isAccValid)
      errors.push("Account Number must be 10-12 digits.");

    // Routing Number: Exactly 9 digits
    const isRoutingValid = /^\d{9}$/.test(bankData.routingNumber);
    if (bankData.routingNumber && !isRoutingValid)
      errors.push("Routing Number must be exactly 9 digits.");

    // Amount: Within bounds
    const isAmountValid = amountNum > 0 && amountNum <= availableBalance;
    if (amount && amountNum > availableBalance)
      errors.push("Amount exceeds available balance.");

    return {
      isAccValid,
      isRoutingValid,
      isAmountValid,
      errors,
      canVerify: isAccValid && isRoutingValid && !isVerifying,
      canSubmit: isAccValid && isRoutingValid && isAmountValid && isVerified,
    };
  }, [bankData, amountNum, availableBalance, amount, isVerifying, isVerified]);

  // --- API HANDLERS ---

  // 1. Mock Verification API (Test API)
  const handleVerifyAccount = async () => {
    setIsVerifying(true);
    try {
      // Simulation of account lookup
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock result
      setBankData((prev) => ({
        ...prev,
        resolvedName: "EXTERNAL SETTLEMENT ACCT - 044",
      }));
      setIsVerified(true);
      toast.success("Identity Check Passed");
    } catch (err) {
      toast.error("Verification failed. Please check credentials.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Final Withdrawal API
  const handleFinalSubmit = async () => {
    try {
      await withdrawFunds({
        accountNumber: bankData.accountNumber,
        routingNumber: bankData.routingNumber,
        amount: amountNum,
        narration: `Withdrawal to ${bankData.resolvedName}`,
      }).unwrap();

      setStep("success");
    } catch (err: any) {
      toast.error(err?.data?.message || "Settlement protocol error.");
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setIsVerified(false);
    setBankData({ accountNumber: "", routingNumber: "", resolvedName: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
        {/* Terminal Header */}
        <div className="px-6 py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif font-black text-[10px] uppercase tracking-widest text-zinc-500">
              Secure Gateway
            </span>
          </div>
          <div className="text-[9px] font-black uppercase text-zinc-400 px-2 py-1 bg-white dark:bg-zinc-800 rounded border border-zinc-100 dark:border-zinc-700">
            Step {step === "amount" ? "1" : "2"} of 2
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: AMOUNT SELECTION */}
          {step === "amount" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">
                  Capital Outflow Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-300">
                    €
                  </span>
                  <Input
                    placeholder="0.00"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 text-4xl font-serif h-24 bg-transparent border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">
                    Available Cash
                  </p>
                  <p className="text-[10px] font-black text-primary">
                    €{availableBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setStep("details")}
                disabled={!validation.isAmountValid}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                Specify Destination <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: BANK DETAILS & VERIFICATION */}
          {step === "details" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <button
                onClick={() => {
                  setStep("amount");
                  setIsVerified(false);
                }}
                disabled={isVerified}
                className="flex items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-primary transition-colors disabled:opacity-30"
              >
                <ArrowLeft className="mr-2 h-3 w-3" /> Back
              </button>

              <div className="space-y-4">
                {/* Account Number */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 ml-1">
                    Account Number
                  </Label>
                  <Input
                    placeholder="10-12 digits"
                    disabled={isVerified}
                    maxLength={12}
                    value={bankData.accountNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={`h-12 rounded-xl transition-all ${
                      !validation.isAccValid && bankData.accountNumber
                        ? "border-rose-500 ring-rose-500/10"
                        : ""
                    } ${
                      isVerified &&
                      "bg-zinc-50 dark:bg-zinc-900 opacity-80 border-emerald-500"
                    }`}
                  />
                </div>

                {/* Routing Number */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 ml-1">
                    Routing Number
                  </Label>
                  <Input
                    placeholder="9 digits"
                    disabled={isVerified}
                    maxLength={9}
                    value={bankData.routingNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        routingNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={`h-12 rounded-xl transition-all ${
                      !validation.isRoutingValid && bankData.routingNumber
                        ? "border-rose-500 ring-rose-500/10"
                        : ""
                    } ${
                      isVerified &&
                      "bg-zinc-50 dark:bg-zinc-900 opacity-80 border-emerald-500"
                    }`}
                  />
                </div>

                {/* Validation Feedback */}
                {validation.errors.length > 0 && !isVerified && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40">
                    {validation.errors.map((err, i) => (
                      <div
                        key={i}
                        className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <AlertTriangle size={10} /> {err}
                      </div>
                    ))}
                  </div>
                )}

                {/* Verified Identity Block */}
                {isVerified && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between animate-in zoom-in-95">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-black text-emerald-600 tracking-tighter">
                        Verified Beneficiary
                      </p>
                      <p className="text-sm font-serif font-black italic">
                        {bankData.resolvedName}
                      </p>
                    </div>
                    <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                  </div>
                )}
              </div>

              {!isVerified ? (
                <Button
                  onClick={handleVerifyAccount}
                  disabled={!validation.canVerify}
                  className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest"
                >
                  {isVerifying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify Identity <SearchCheck className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white dark:text-black font-black uppercase tracking-widest shadow-2xl"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      `Confirm Settlement €${amountNum.toLocaleString()}`
                    )}
                  </Button>
                  <button
                    onClick={() => setIsVerified(false)}
                    className="w-full text-[10px] font-black text-zinc-400 uppercase underline tracking-tighter hover:text-rose-500 transition-colors"
                  >
                    Reset & Edit Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === "success" && (
            <div className="space-y-6 py-6 text-center animate-in zoom-in-95">
              <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-black italic tracking-tighter">
                  Transfer Queued.
                </h2>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  €{amountNum.toLocaleString()} is being routed to the verified
                  account. Expected clearing: 2-4 hours.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest"
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
