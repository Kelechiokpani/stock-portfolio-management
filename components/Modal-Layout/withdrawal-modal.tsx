"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useWithdrawFundsMutation } from "@/app/services/features/market/marketApi";

interface SettlementAccount {
  _id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  status: string;
  routingNumber?: string; // Added to match payload needs
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlementAccounts: SettlementAccount[];
  availableBalance: number;
  baseCurrency?: string;
}

type Step = "amount" | "destination" | "review" | "success";

export function WithdrawalModal({
  isOpen,
  onClose,
  settlementAccounts,
  availableBalance,
  baseCurrency = "EUR",
}: WithdrawalModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("Capital Withdrawal");
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // RTK Query Mutation
  const [withdrawFunds, { isLoading: isSubmitting }] =
    useWithdrawFundsMutation();

  const selectedAccount = useMemo(
    () => settlementAccounts.find((acc) => acc._id === selectedAccountId),
    [selectedAccountId, settlementAccounts]
  );

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) return;

    try {
      const result = await withdrawFunds({
        accountNumber: selectedAccount.accountNumber,
        routingNumber: selectedAccount?.routingNumber || "",
        amount: parseFloat(amount),
        narration: narration,
        method: "bank_transfer",
      }).unwrap();

      console.log("Withdrawal result:", result);

      setStep("success");
    } catch (error: any) {
      console.log("Withdrawal error:", error);
      toast.error(error?.data?.error || "Withdrawal failed. Please try again.");
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setNarration("Capital Withdrawal");
    onClose();
  };

  const isAmountValid =
    amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl ring-1 ring-border/50">
        {/* Header Branding */}
        <div className="bg-rose-500/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif font-bold text-sm tracking-tight text-foreground uppercase">
              Capital Exit
            </span>
          </div>
          {step !== "success" && (
            <div className="flex gap-1.5">
              {(["amount", "destination", "review"] as Step[]).map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    step === s ? "bg-rose-500 w-10" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* STEP 1: AMOUNT */}
          {step === "amount" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <header className="space-y-1">
                <DialogTitle className="text-2xl font-serif">
                  Withdrawal Amount
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  Specify the amount to transfer to your external account.
                </DialogDescription>
              </header>

              <div className="space-y-4">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground group-focus-within:text-rose-500 transition-colors">
                    {baseCurrency === "EUR" ? "€" : "$"}
                  </span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-3xl font-serif h-20 bg-secondary/20 border-border/50 focus:ring-rose-500 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Available Liquidity
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {baseCurrency === "EUR" ? "€" : "$"}
                    {availableBalance.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[0.25, 0.5, 1].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      onClick={() =>
                        setAmount((availableBalance * percent).toString())
                      }
                      className="h-11 border-border/50 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/5"
                    >
                      {percent === 1 ? "MAX" : `${percent * 100}%`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep("destination")}
                  disabled={!isAmountValid}
                  className="flex-[2] rounded-xl h-12 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                >
                  Select Destination <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DESTINATION */}
          {step === "destination" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep("amount")}
                className="flex items-center text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> BACK TO AMOUNT
              </button>

              <header className="space-y-1">
                <DialogTitle className="text-2xl font-serif">
                  Settlement Node
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Select the verified destination bank.
                </DialogDescription>
              </header>

              <RadioGroup
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
                className="gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {settlementAccounts?.map((account) => (
                  <div key={account._id}>
                    <RadioGroupItem
                      value={account._id}
                      id={account._id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={account._id}
                      className={`flex cursor-pointer items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedAccountId === account._id
                          ? "border-rose-500 bg-rose-500/5"
                          : "border-border/40 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedAccountId === account._id
                              ? "bg-rose-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">
                            {account.bankName}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                            {account.accountName} • ****
                            {account.accountNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                      {account.status === "verified" && (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={() => setStep("review")}
                disabled={!selectedAccountId}
                className="w-full h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
              >
                Review Withdrawal
              </Button>
            </div>
          )}

          {/* STEP 3: REVIEW & NARRATION */}
          {step === "review" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <header className="space-y-1 text-center">
                <DialogTitle className="text-2xl font-serif">
                  Confirm Exit
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Finalize your transfer details.
                </DialogDescription>
              </header>

              <div className="rounded-2xl bg-secondary/30 p-6 border border-border/40 space-y-4">
                <div className="flex justify-between items-baseline border-b border-border pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Amount
                  </span>
                  <span className="text-2xl font-serif font-bold text-rose-500">
                    {baseCurrency === "EUR" ? "€" : "$"}
                    {parseFloat(amount).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">
                    Narration / Reference
                  </Label>
                  <Input
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    className="h-10 bg-background/50 text-sm border-border/40"
                    placeholder="e.g. Portfolio Rebalancing"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-bold text-foreground">
                      {selectedAccount?.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account</span>
                    <span className="font-mono text-foreground">
                      ****{selectedAccount?.accountNumber.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/5 rounded-xl p-4 flex gap-3 border border-amber-500/10">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Funds will be released to the network within{" "}
                  <span className="text-foreground font-bold">24-48 hours</span>
                  .
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("destination")}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl"
                >
                  Modify
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isSubmitting}
                  className="flex-[2] h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="space-y-6 py-4 animate-in zoom-in duration-500 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
                <CheckCircle2 className="h-10 w-10 text-rose-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold">
                  Withdrawal Initiated
                </h2>
                <p className="text-muted-foreground text-sm">
                  Transfer of{" "}
                  <span className="text-foreground font-bold">
                    {baseCurrency === "EUR" ? "€" : "$"}
                    {parseFloat(amount).toLocaleString()}
                  </span>{" "}
                  is processing.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full h-12 rounded-xl">
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
