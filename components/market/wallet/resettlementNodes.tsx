import React from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  Building2, 
  ChevronRight,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

interface SettlementAccount {
  _id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber?: string;
  currency: string;
  status: "verified" | "failed" | "pending_verification" | string;
}

interface SettlementNodesProps {
  accounts: SettlementAccount[];
}

export const ResettlementNodes = ({ accounts }: SettlementNodesProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const isVerified = account.status === "verified";
        const isPending = account.status === "pending_verification";
        const isFailed = account.status === "failed";

        return (
          <div
            key={account._id}
            className={cn(
              "relative group overflow-hidden rounded-radius border p-4 transition-all duration-300",
              isVerified ? "bg-primary/5 border-primary/20" : "bg-card border-border",
              isFailed && "opacity-75 grayscale-[0.5]"
            )}
          >
            {/* Background Glow for Verified */}
            {isVerified && (
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
            )}

            <div className="relative flex flex-col h-full space-y-4">
              {/* Header: Bank & Status */}
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border shadow-sm">
                  <Building2 className={cn("h-5 w-5", isVerified ? "text-primary" : "text-muted-foreground")} />
                </div>
                
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
                  isVerified && "bg-primary/10 border-primary/20 text-primary",
                  isPending && "bg-amber-500/10 border-amber-500/20 text-amber-500",
                  isFailed && "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                  {isVerified && <ShieldCheck className="h-3 w-3" />}
                  {isPending && <ShieldQuestion className="h-3 w-3" />}
                  {isFailed && <ShieldAlert className="h-3 w-3" />}
                  {account.status.replace("_", " ")}
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="font-serif font-bold text-sm text-foreground truncate">
                  {account.bankName}
                </h3>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 tracking-tight">
                  {account.accountName}
                </p>
              </div>

              {/* Secure Data Strip */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-widest">
                    Account Number
                  </span>
                  <span className="block font-mono text-[12px] font-bold tracking-widest text-foreground/80">
                    ****{account.accountNumber.slice(-4)}
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-widest">
                    Currency
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[12px] font-black text-primary">
                    <Globe className="h-3 w-3 opacity-50" />
                    {account.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};