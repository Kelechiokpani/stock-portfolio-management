"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useAddResettlementAccountMutation,
  useGetBanksQuery,
  useGetResettlementAccountsQuery,
} from "@/app/services/features/market/marketApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle2,
  Building2,
  User,
  Plus,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

interface AddResettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "details" | "success" | "onboarding";

export function ResettlementModal({
  isOpen,
  onClose,
}: AddResettlementModalProps) {
  const [resettlementResult, setResettlementResult] = useState<any>(null); // New state for API result
  const { data: userData } = useGetMeQuery();
  const { data: banks, isLoading: loadingBanks } = useGetBanksQuery();
  const [step, setStep] = useState<Step>("details");

  const [bankData, setBankData] = useState({
    accountName:
      `${userData?.user?.profile?.firstName} ${userData?.user?.profile?.lastName}`.trim() ||
      "",
    accountNumber: "",
    bankName: "",
    bankAddress: "",
    routingNumber: "011000023",
    iban: "",
    swiftBic: "",
    currency: "USD",
  }) as any;

  const selectedBank = useMemo(() => {
    return banks?.find((b: any) => b.name === bankData.bankName);
  }, [banks, bankData.bankName]);

  const [addResettlement, { isLoading }] = useAddResettlementAccountMutation();

  const validation = useMemo(() => {
    const hasRequiredFields =
      bankData.accountName.trim().length >= 2 &&
      bankData.accountNumber.trim().length >= 5 &&
      bankData.bankName.trim().length >= 4 &&
      bankData.routingNumber.trim().length >= 5;

    return { isValid: hasRequiredFields };
  }, [bankData]);

  const handleFinalSubmit = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(bankData).filter(([_, v]) => v !== "")
      );

      const result = await addResettlement(payload as any).unwrap();
      console.log("Resettlement Account Added:", result);
      setResettlementResult(result);
      setStep("success");
    } catch (err: any) {
      console.error("Error Response:", err);

      //  if (err?.status === 422 || err?.success === false) {
      if (err?.data?.success === false) {
        const errorMsg =
          err?.data?.message || err?.data?.error || "Connection failed.";
        setStep("onboarding");
        //    toast.error(`Verification Failed: ${errorMsg}`, {
        //      className: "border-rose-500/20 bg-card font-serif",
        //    });
      }
    }
  };

  //   const handleFinalSubmit = async () => {
  //     try {
  //       const payload = Object.fromEntries(
  //         Object.entries(bankData).filter(([_, v]) => v !== "")
  //       );

  //       const result = await addResettlement(payload as any).unwrap();

  //       console.log("Resettlement Account Added:", result);

  //       setStep("success");
  //     } catch (err: any) {
  //       if (
  //         err?.status === 503 ||
  //         err?.status === "503" ||
  //         err?.data?.error?.includes("Bankora")
  //       ) {
  //         setStep("onboarding");
  //       } else {
  //         toast.error(err?.data?.error || "Check required fields and try again.");
  //       }
  //     }
  //   };

  const handleClose = () => {
    setStep("details");
    setBankData({
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankAddress: "",
      routingNumber: "",
      iban: "",
      swiftBic: "",
      currency: "USD",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              {step === "onboarding" ? (
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Building2 className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {step === "onboarding"
                  ? "Identity Verification"
                  : "Bank Withdrawal Account"}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                {step === "onboarding"
                  ? "Bankora Protocol"
                  : "Secure Node Registration"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* STEP: DETAILS */}
          {step === "details" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
              <div className="space-y-4">
                <BadgeLabel text="Required Identity" />
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-black ml-1 text-muted-foreground">
                      Legal Account Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        disabled
                        placeholder="Name as it appears on statement"
                        value={bankData.accountName}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            accountName: e.target.value,
                          })
                        }
                        className="h-12 pl-10 rounded-radius border-border bg-background focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-black ml-1 text-muted-foreground tracking-widest">
                        Settlement Institution
                      </Label>
                      <Select
                        value={bankData.bankName}
                        onValueChange={(val) =>
                          setBankData({ ...bankData, bankName: val })
                        }
                        disabled={loadingBanks}
                      >
                        <SelectTrigger className="h-12 rounded-radius border-border bg-muted/20 hover:bg-muted/40 transition-colors font-bold focus:ring-primary/20">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                              {loadingBanks ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : selectedBank?.logo ? (
                                <img
                                  src={selectedBank.logo}
                                  alt=""
                                  className="h-4 w-4 object-contain"
                                />
                              ) : (
                                <Building2 className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <SelectValue
                              placeholder={
                                loadingBanks
                                  ? "Loading Registry..."
                                  : "Select verified bank"
                              }
                            />
                          </div>
                        </SelectTrigger>

                        <SelectContent className="border-border bg-card max-h-[300px]">
                          {banks?.map((bank) => (
                            <SelectItem
                              key={bank.id}
                              value={bank.name}
                              className="focus:bg-primary/10 focus:text-primary py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-6 w-8 items-center justify-center rounded bg-muted text-[10px] font-mono text-muted-foreground">
                                  {bank.code ||
                                    bank.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold leading-none">
                                    {bank.name}
                                  </span>
                                  <span className="text-[9px] opacity-50 font-sans tracking-normal mt-1">
                                    {bank.isVerified
                                      ? "Verified Node"
                                      : "Standard Network"}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}

                          {/* Fallback if no banks are returned */}
                          {(!banks || banks.length === 0) && !loadingBanks && (
                            <div className="p-4 text-center text-[10px] text-muted-foreground italic">
                              No verified institutions found.
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-black ml-1 text-muted-foreground tracking-widest">
                          Settlement Currency
                        </Label>
                        <Select
                          value={bankData.currency}
                          onValueChange={(val) =>
                            setBankData({ ...bankData, currency: val })
                          }
                        >
                          <SelectTrigger className="h-12 rounded-radius border-border bg-muted/20 hover:bg-muted/40 transition-colors font-mono font-bold focus:ring-primary/20">
                            <div className="flex items-center gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                                {bankData.currency === "USD"
                                  ? "$"
                                  : bankData.currency === "EUR"
                                  ? "€"
                                  : "£"}
                              </div>
                              <SelectValue placeholder="USD" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="border-border bg-card">
                            <SelectItem
                              value="USD"
                              className="focus:bg-primary/10 focus:text-primary"
                            >
                              <span className="font-mono font-bold">USD</span>
                              <span className="ml-2 text-[10px] opacity-50 font-sans tracking-normal">
                                (US Dollar)
                              </span>
                            </SelectItem>
                            <SelectItem
                              value="EUR"
                              className="focus:bg-primary/10 focus:text-primary"
                            >
                              <span className="font-mono font-bold">EUR</span>
                              <span className="ml-2 text-[10px] opacity-50 font-sans tracking-normal">
                                (Euro)
                              </span>
                            </SelectItem>
                            <SelectItem
                              value="GBP"
                              className="focus:bg-primary/10 focus:text-primary"
                            >
                              <span className="font-mono font-bold">GBP</span>
                              <span className="ml-2 text-[10px] opacity-50 font-sans tracking-normal">
                                (British Pound)
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-black ml-1 text-muted-foreground">
                      Account Number
                    </Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000000000"
                      value={bankData.accountNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) {
                          setBankData({ ...bankData, accountNumber: val });
                        }
                      }}
                      className="h-12 rounded-radius border-border bg-background font-mono tracking-[0.3em] text-center text-lg focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <BadgeLabel text="Optional Clearing Codes" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                        Routing (ABA)
                      </Label>
                      <span className="text-[9px] font-mono text-muted-foreground/50">
                        {bankData.routingNumber.length}/9
                      </span>
                    </div>

                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="000000000"
                      value={bankData.routingNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        if (val.length <= 9) {
                          setBankData({ ...bankData, routingNumber: val });
                        }
                      }}
                      className="h-12 rounded-radius border-border bg-background font-mono tracking-[0.2em] focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                        SWIFT / BIC (optional)
                      </Label>
                      <span className="text-[9px] font-mono text-muted-foreground/50">
                        {bankData.swiftBic.length}/11
                      </span>
                    </div>

                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="000000000"
                      value={bankData.swiftBic}
                      onChange={(v: any) =>
                        setBankData({ ...bankData, swiftBic: v.toUpperCase() })
                      }
                      className="h-12 rounded-radius border-border bg-background font-mono tracking-[0.2em] focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleFinalSubmit}
                disabled={!validation.isValid || isLoading}
                className="w-full h-14 rounded-radius bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all"
              >
                {isLoading ? (
                  <div className="flex justify-center">
                    please wait... <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Link Resettlement Account"
                )}
              </Button>
            </div>
          )}

          {/* STEP: ONBOARDING */}
          {step === "onboarding" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="p-4 rounded-radius bg-amber-500/10 border border-amber-500/20 flex gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-600">
                    Account Not Verified
                  </p>
                  <p className="text-[11px] text-foreground/70 leading-relaxed">
                    Our settlement partner requires identity verification before
                    linking external nodes.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <ProcessStep
                  number="01"
                  title="Register Profile"
                  description="Create your secure legal identity on the Bankora network."
                />
                <ProcessStep
                  number="02"
                  title="KYC Compliance"
                  description="Upload document for automated liquidity clearance."
                />
                <ProcessStep
                  number="03"
                  title="Node Authorization"
                  description="Return here to complete your bank resettlement link."
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-14 rounded-radius bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                  onClick={() =>
                    window.open(
                      "https://bankoradigitalbanking.vercel.app/register",
                      "_blank"
                    )
                  }
                >
                  Open Bankora Account <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  onClick={() => setStep("details")}
                >
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back to Bank Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === "success" && (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                <CheckCircle2 className="h-12 w-12 text-primary stroke-[1.5px]" />
              </div>

              <h2 className="text-3xl font-serif font-black italic mb-2 text-foreground">
                Account Linked Successfully.
              </h2>

              <p className="text-muted-foreground max-w-xs mx-auto text-sm mb-8">
                Account ending in{" "}
                <span className="text-foreground font-bold">
                  {bankData.accountNumber.slice(-4)}
                </span>{" "}
                is now authorized for {bankData.currency} settlements.
              </p>

              {/* DATA RECEIPT BLOCK */}
              {resettlementResult && (
                <div className="mb-10 p-4 rounded-radius border border-border bg-muted/30 text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-black text-muted-foreground">
                      Network Status
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      {resettlementResult.status || "Active"}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleClose}
                className="w-full h-14 rounded-radius bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg hover:opacity-90"
              >
                Withdraw Funds <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- HELPERS ---

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start p-3 rounded-radius border border-border bg-muted/20">
      <span className="font-mono text-xs font-black text-primary">
        {number}
      </span>
      <div className="space-y-0.5">
        <p className="text-[11px] font-black uppercase tracking-tight text-foreground">
          {title}
        </p>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {description}
        </p>
      </div>
    </div>
  );
}

function BadgeLabel({ text }: { text: string }) {
  return (
    <div className="inline-block px-2 py-0.5 rounded bg-muted text-[8px] font-black uppercase tracking-widest text-muted-foreground">
      {text}
    </div>
  );
}

function InputItem({ label, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase font-black ml-1 text-muted-foreground">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-radius border-border bg-background text-xs font-mono"
      />
    </div>
  );
}
