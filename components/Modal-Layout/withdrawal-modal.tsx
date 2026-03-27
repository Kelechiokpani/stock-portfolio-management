"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useWithdrawFundsMutation } from "@/app/services/features/market/marketApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ArrowLeft,
  ChevronRight,
  Wallet2,
  AlertTriangle,
  CheckCircle2,
  SendHorizontal,
} from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

type Step = "amount" | "details" | "success";

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
}: WithdrawalModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [bankData, setBankData] = useState({
    accountNumber: "",
    routingNumber: "",
  });

  const [withdrawFunds, { isLoading }] = useWithdrawFundsMutation();
  const amountNum = parseFloat(amount) || 0;

  // --- VALIDATION ENGINE ---
  const validation = useMemo(() => {
    const isAccValid = /^\d{10,12}$/.test(bankData.accountNumber);
    const isRoutingValid = /^\d{9}$/.test(bankData.routingNumber);
    const isAmountValid = amountNum > 0 && amountNum <= availableBalance;

    const errors: string[] = [];
    if (bankData.accountNumber && !isAccValid)
      errors.push("Account Number (10-12 digits).");
    if (bankData.routingNumber && !isRoutingValid)
      errors.push("Routing Number (9 digits).");
    if (amount && amountNum > availableBalance)
      errors.push("Insufficient balance.");

    return {
      isValid: isAccValid && isRoutingValid && isAmountValid,
      errors,
    };
  }, [bankData, amountNum, availableBalance, amount]);

  // --- FINAL SUBMIT HANDLER ---
  const handleFinalSubmit = async () => {
    try {
      await withdrawFunds({
        accountNumber: bankData.accountNumber,
        routingNumber: bankData.routingNumber,
        amount: amountNum,
        narration: `Standard Settlement Withdrawal`,
      }).unwrap();

      setStep("success");
    } catch (err: any) {
      toast.error(err?.data?.message || "Transfer failed. Please try again.");
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setBankData({ accountNumber: "", routingNumber: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif font-black text-[10px] uppercase tracking-widest text-zinc-500">
              Payout Terminal
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: AMOUNT */}
          {step === "amount" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                  Withdrawal Amount
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
                <div className="flex justify-between px-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">
                    Available
                  </p>
                  <p className="text-[10px] font-black text-primary">
                    €{availableBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setStep("details")}
                disabled={amountNum <= 0 || amountNum > availableBalance}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest"
              >
                Continue to Details <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: BANK DETAILS */}
          {step === "details" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <button
                onClick={() => setStep("amount")}
                className="flex items-center text-[10px] font-black text-zinc-400 uppercase hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-3 w-3" /> Edit Amount
              </button>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-zinc-400 ml-1">
                    Account Number
                  </Label>
                  <Input
                    placeholder="10-12 digits"
                    maxLength={12}
                    value={bankData.accountNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-zinc-400 ml-1">
                    Routing Number
                  </Label>
                  <Input
                    placeholder="9 digits"
                    maxLength={9}
                    value={bankData.routingNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        routingNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Validation Display */}
                {validation.errors.length > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40">
                    {validation.errors.map((err, i) => (
                      <div
                        key={i}
                        className="text-[10px] font-black uppercase text-rose-600 flex items-center gap-2 mb-1 last:mb-0"
                      >
                        <AlertTriangle size={10} /> {err}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleFinalSubmit}
                disabled={!validation.isValid || isLoading}
                className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white dark:text-black font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Confirm Payout €{amountNum.toLocaleString()}{" "}
                    <SendHorizontal className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === "success" && (
            <div className="space-y-6 py-6 text-center animate-in zoom-in-95">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-serif font-black italic">
                Funds Dispatched.
              </h2>
              <p className="text-sm text-zinc-500">
                Your withdrawal of €{amountNum.toLocaleString()} is being
                processed.
              </p>
              <Button
                onClick={handleClose}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
