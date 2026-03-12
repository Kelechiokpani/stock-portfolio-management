"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useTransferStockMutation,
  TransferPayload,
} from "@/app/services/features/market/marketApi";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Loader2,
  ArrowRightLeft,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
  UserPlus,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { Investment } from "@/components/data/user-data";

interface Portfolio {
  id: string;
  name: string;
  holdings: Investment[];
}

interface TransferPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
}

type Step = "select" | "recipient" | "confirm" | "success";

export function TransferPortfolioModal({
  isOpen,
  onClose,
  portfolios,
}: TransferPortfolioModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const [tracking, setTracking] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    description: "Portfolio Migration",
  });

  const [transferStock, { isLoading }] = useTransferStockMutation();

  const selectedPortfolio = portfolios.find(
    (p) => p.id === selectedPortfolioId
  );

  const portfolioValue =
    selectedPortfolio?.holdings.reduce((sum, h) => sum + h.value, 0) || 0;
  const totalShares =
    selectedPortfolio?.holdings.reduce((sum, h) => sum + h.shares, 0) || 0;
  const totalAssetsCount = selectedPortfolio?.holdings.length || 0;

  const isRecipientValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailRegex.test(recipientEmail) &&
      tracking.firstName.length > 1 &&
      tracking.lastName.length > 1 &&
      tracking.phone.length > 7 &&
      tracking.address.length > 5
    );
  };

  const handleTransfer = async () => {
    if (!selectedPortfolio) return;

    try {
      // Map holdings to the bulk TransferAssetItem structure
      const assetsToTransfer = selectedPortfolio.holdings.map((asset) => ({
        assetSymbol: asset.symbol,
        shares: asset.shares,
        assetName: asset.name,
        valueAtTransfer: asset.value,
      }));

      const payload: TransferPayload = {
        portfolioId: selectedPortfolio.id,
        toUserEmail: recipientEmail,
        assets: assetsToTransfer,
        firstName: tracking.firstName,
        lastName: tracking.lastName,
        address: tracking.address,
        phone: tracking.phone,
        description: tracking.description,
      };

      await transferStock(payload).unwrap();
      setStep("success");
      toast.success("Bulk Migration Authorized Successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Transfer failed.");
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedPortfolioId("");
    setRecipientEmail("");
    setTracking({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      description: "Portfolio Migration",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl bg-background">
        {/* Header */}
        <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-sm uppercase tracking-widest">
              Asset Migration
            </span>
          </div>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: SELECTION */}
          {step === "select" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <header className="space-y-1">
                <DialogTitle className="text-2xl font-serif">
                  Select Portfolio
                </DialogTitle>
                <DialogDescription>
                  Choose the asset group for bulk migration.
                </DialogDescription>
              </header>

              <Select
                value={selectedPortfolioId}
                onValueChange={setSelectedPortfolioId}
              >
                <SelectTrigger className="h-16 rounded-xl border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  {" "}
                  <SelectValue placeholder="Select a portfolio..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-background shadow-2xl z-50">
                  {" "}
                  {portfolios.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="py-3 px-4 rounded-lg cursor-pointer"
                    >
                      {" "}
                      <div className="flex flex-col">
                        <span className="font-bold">{p.name}</span>
                        <span className="text-[10px] uppercase text-muted-foreground">
                          {p.holdings.length} Assets •{" "}
                          {p.holdings.reduce((s, h) => s + h.shares, 0)} Shares
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPortfolio && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-primary/[0.03] border border-primary/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Total Assets
                    </p>
                    <p className="text-xl font-serif font-bold">
                      {totalAssetsCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-primary/[0.03] border border-primary/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Total Shares
                    </p>
                    <p className="text-xl font-serif font-bold">
                      {totalShares.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setStep("recipient")}
                disabled={!selectedPortfolioId || totalAssetsCount === 0}
                className="w-full h-12 rounded-xl"
              >
                Identify Recipient <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: RECIPIENT */}
          {step === "recipient" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep("select")}
                className="flex items-center text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> Back
              </button>

              <header className="space-y-1">
                <DialogTitle className="text-2xl font-serif text-foreground">
                  Recipient Details
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground">
                  Enter tracking details and migration reason.
                </DialogDescription>
              </header>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                    First Name
                  </Label>

                  <Input
                    placeholder="John"
                    value={tracking.firstName}
                    onChange={(e) =>
                      setTracking({ ...tracking, firstName: e.target.value })
                    }
                    className="h-10 rounded-lg bg-muted/20"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Last Name
                  </Label>

                  <Input
                    placeholder="Doe"
                    value={tracking.lastName}
                    onChange={(e) =>
                      setTracking({ ...tracking, lastName: e.target.value })
                    }
                    className="h-10 rounded-lg bg-muted/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Email Address
                </Label>

                <div className="relative">
                  <Input
                    type="email"
                    placeholder="recipient@vaultstock.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="h-10 pl-9 rounded-lg bg-muted/20"
                  />

                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Phone Number
                  </Label>

                  <div className="relative">
                    <Input
                      placeholder="+1..."
                      value={tracking.phone}
                      onChange={(e) =>
                        setTracking({ ...tracking, phone: e.target.value })
                      }
                      className="h-10 pl-9 rounded-lg bg-muted/20"
                    />

                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Physical Address
                  </Label>

                  <div className="relative">
                    <Input
                      placeholder="City, Country"
                      value={tracking.address}
                      onChange={(e) =>
                        setTracking({ ...tracking, address: e.target.value })
                      }
                      className="h-10 pl-9 rounded-lg bg-muted/20"
                    />

                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Transfer Description
                </Label>

                <div className="relative">
                  <Input
                    placeholder="Reason for migration (e.g., Trust Allocation)"
                    value={tracking.description}
                    onChange={(e) =>
                      setTracking({ ...tracking, description: e.target.value })
                    }
                    className="h-10 pl-9 rounded-lg bg-muted/20"
                  />

                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button
                onClick={() => setStep("confirm")}
                disabled={!isRecipientValid()}
                className="w-full h-12 rounded-xl mt-4 bg-primary text-primary-foreground"
              >
                Continue to Verification
              </Button>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === "confirm" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <header className="text-center space-y-1">
                <DialogTitle className="text-2xl font-serif">
                  Final Authorization
                </DialogTitle>
                <DialogDescription>
                  Review bulk migration list.
                </DialogDescription>
              </header>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 bg-muted/30 border-b space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RECIPIENT:</span>
                    <span className="font-bold">
                      {tracking.firstName} {tracking.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EMAIL:</span>
                    <span className="font-bold">{recipientEmail}</span>
                  </div>
                </div>

                <div className="p-4 max-h-[120px] overflow-y-auto space-y-2">
                  {selectedPortfolio?.holdings.map((h) => (
                    <div
                      key={h.symbol}
                      className="flex justify-between text-[10px] bg-secondary/20 p-2 rounded-lg"
                    >
                      <span className="font-black">{h.symbol}</span>
                      <span>{h.shares.toLocaleString()} Shares</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase">
                    Total Migration Value
                  </span>
                  <span className="font-serif font-black text-xl">
                    €{portfolioValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-rose-500/5 rounded-xl p-4 flex gap-3 border border-rose-500/10">
                <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  <span className="text-rose-600 font-bold uppercase">
                    Critical:
                  </span>{" "}
                  This will transfer the entire portfolio holdings to{" "}
                  {recipientEmail}.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("recipient")}
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleTransfer}
                  disabled={isLoading}
                  className="flex-[2] h-12 rounded-xl bg-foreground text-background"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm Bulk Transfer"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="space-y-6 py-4 text-center animate-in zoom-in duration-500">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-serif font-bold">
                Migration Successful
              </h2>
              <p className="text-sm text-muted-foreground">
                All holdings in {selectedPortfolio?.name} have been moved.
              </p>
              <Button
                onClick={handleClose}
                className="w-full h-12 rounded-xl bg-foreground text-background"
              >
                Back to Portfolio
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
