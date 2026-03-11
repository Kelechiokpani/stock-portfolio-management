"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useWithdrawFundsMutation } from "@/app/services/features/market/marketApi";
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
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Building2,
  ShieldAlert,
  Wallet2,
  Info,
  Lock,
  AlertTriangle,
  PlusCircle,
  History,
} from "lucide-react";
import { ConnectedAccount } from "@/components/data/user-data";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  connectedAccounts: ConnectedAccount[];
  userProfile?: {
    requiresResettlementAccount: boolean;
    withdrawalFailures: number; // Tracked 0-3
  };
}

type Step = "amount" | "add-bank" | "review" | "success" | "resettlement";

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  connectedAccounts,
  userProfile,
}: WithdrawalModalProps) {
  // Logic: If failures >= 3, force resettlement step immediately
  const initialStep =
    (userProfile?.withdrawalFailures || 0) >= 3 ? "resettlement" : "amount";

  const [step, setStep] = useState<Step>(initialStep);
  const [amount, setAmount] = useState("");
  const [failureCount, setFailureCount] = useState(
    userProfile?.withdrawalFailures || 0
  );

  // New Bank Form State
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [withdrawFunds, { isLoading }] = useWithdrawFundsMutation();

  const amountNum = parseFloat(amount) || 0;
  const fee = useMemo(
    () => (amountNum > 0 ? Math.max(5, amountNum * 0.01) : 0),
    [amountNum]
  );
  const totalDebit = amountNum + fee;

  const handleLinkAndWithdraw = async () => {
    try {
      // Simulate API call to link and withdraw
      await withdrawFunds({
        amount: amountNum,
        method: bankData.bankName.toLowerCase(),
        bankDetails: bankData,
        description: "Standard Settlement Request",
      }).unwrap();

      setStep("success");
    } catch (err: any) {
      const newFailCount = failureCount + 1;
      setFailureCount(newFailCount);

      if (newFailCount >= 3) {
        setStep("resettlement");
        toast.error("Security Lock: Maximum settlement attempts reached.");
      } else {
        toast.error(
          `Settlement Failed. Attempt ${newFailCount}/3. Please check your bank details.`
        );
      }
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setBankData({ bankName: "", accountNumber: "", accountName: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-border bg-background shadow-2xl dark:border-zinc-800">
        {/* Header - Adaptive Colors based on status */}
        <div
          className={`px-6 py-4 border-b flex justify-between items-center ${
            step === "resettlement"
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-muted/30 border-border"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                step === "resettlement" ? "bg-amber-500/20" : "bg-primary/10"
              }`}
            >
              {step === "resettlement" ? (
                <Lock className="h-4 w-4 text-amber-600" />
              ) : (
                <Wallet2 className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className="font-serif font-bold text-sm uppercase tracking-widest">
              {step === "resettlement" ? "Security Hold" : "Settlement Request"}
            </span>
          </div>
          {step !== "success" && step !== "resettlement" && (
            <div className="text-[10px] font-bold text-muted-foreground uppercase bg-background px-2 py-1 rounded-full border border-border">
              Attempts: {failureCount}/3
            </div>
          )}
        </div>

        <div className="p-6">
          {/* STATE: RESETTLEMENT REQUIRED (AFTER 3 FAILURES) */}
          {step === "resettlement" && (
            <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95">
              <div className="mx-auto h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-serif font-bold">
                  Resettlement Required
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your automated bank linking has failed{" "}
                  <span className="text-foreground font-bold">3 times</span>.
                  For security, you must now request a manual resettlement
                  account.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-xl text-xs text-left border border-border space-y-2">
                <p className="text-muted-foreground">This process involves:</p>
                <ul className="list-disc pl-4 space-y-1 text-foreground font-medium">
                  <li>Manual verification of account ownership</li>
                  <li>Direct provisioning by the clearing house</li>
                  <li>48-hour security cooling period</li>
                </ul>
              </div>
              <Button className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
                Request Resettlement Account
              </Button>
            </div>
          )}

          {/* STEP 1: AMOUNT */}
          {step === "amount" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 rounded-xl bg-muted/50 border border-border flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Available Cash
                </span>
                <span className="font-serif font-bold text-lg">
                  €{availableBalance.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                  €
                </span>
                <Input
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-3xl font-serif h-20 bg-muted/30 border-border rounded-xl"
                />
              </div>
              <Button
                onClick={() => setStep("add-bank")}
                disabled={amountNum <= 0 || amountNum > availableBalance}
                className="w-full h-12 rounded-xl"
              >
                Continue to Bank Details{" "}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: ADD BANK (Since no selection allowed) */}
          {step === "add-bank" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep("amount")}
                className="flex items-center text-[10px] font-black text-muted-foreground uppercase"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> Back
              </button>
              <header className="space-y-1">
                <DialogTitle className="text-2xl font-serif">
                  Link Settlement Bank
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Provide the destination bank details for this outflow.
                </DialogDescription>
              </header>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">
                    Bank Name
                  </Label>
                  <Input
                    placeholder="e.g. Moniepoint, GTBank"
                    value={bankData.bankName}
                    onChange={(e) =>
                      setBankData({ ...bankData, bankName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">
                    Account Name
                  </Label>
                  <Input
                    placeholder="Exact name on account"
                    value={bankData.accountName}
                    onChange={(e) =>
                      setBankData({ ...bankData, accountName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">
                    Account Number
                  </Label>
                  <Input
                    placeholder="10-digit account number"
                    value={bankData.accountNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10 flex gap-2 items-start">
                <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground">
                  Careful: You have{" "}
                  <span className="font-bold text-foreground">
                    {3 - failureCount} attempts remaining
                  </span>{" "}
                  before automated linking is disabled.
                </p>
              </div>

              <Button
                onClick={() => setStep("review")}
                disabled={
                  !bankData.bankName ||
                  !bankData.accountName ||
                  bankData.accountNumber.length < 10
                }
                className="w-full h-12 rounded-xl"
              >
                Review Transaction
              </Button>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === "review" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
                <div className="p-4 bg-muted/50 border-b flex justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Net Withdrawal
                  </span>
                  <span className="font-serif font-bold">
                    €{amountNum.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Bank</span>
                    <span className="text-foreground font-medium">
                      {bankData.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Beneficiary</span>
                    <span className="text-foreground font-medium">
                      {bankData.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border font-serif font-black text-lg">
                    <span className="text-sm font-sans font-bold text-muted-foreground uppercase">
                      Total Debit
                    </span>
                    <span className="text-destructive">
                      €{totalDebit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("add-bank")}
                  className="flex-1 h-12 rounded-xl"
                >
                  Modify
                </Button>
                <Button
                  onClick={handleLinkAndWithdraw}
                  disabled={isLoading}
                  className="flex-[2] h-12 rounded-xl bg-destructive text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Authorize & Link"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="space-y-6 py-4 text-center animate-in zoom-in">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold">
                Settlement Initiated
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bank account linked and withdrawal of{" "}
                <span className="text-foreground font-bold">
                  €{amountNum.toLocaleString()}
                </span>{" "}
                queued.
              </p>
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
