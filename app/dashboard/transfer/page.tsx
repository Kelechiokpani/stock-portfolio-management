"use client";

import { useState } from "react";
import {
  Plus,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  History,
  FileText,
  Layers,
  Box,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalLoader from "@/components/GlobalLoader";

// API & Components
import { useGetMeQuery } from "@/app/services/features/auth/authApi";
import { TransferPortfolioModal } from "@/components/Modal-Layout/transfer-portfolio-modal";

export default function AssetTransfersPage() {
  const { data: response, isLoading } = useGetMeQuery();
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (isLoading)
    return (
      <GlobalLoader
        message="Syncing Asset Ledger"
        subtext="Verifying block-level migrations..."
      />
    );

  const user = response?.user;
  const transfers = user?.stockTransfers || [];

  if (!user) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: user.settings.baseCurrency,
    }).format(val);

  // Stats derived from stockTransfers
  const totalInbound = transfers
    .filter((t: any) => t.type === "inbound")
    .reduce((acc: number, curr: any) => acc + curr.valueAtTransfer, 0);

  const totalOutbound = transfers
    .filter((t: any) => t.type === "outbound")
    .reduce((acc: number, curr: any) => acc + curr.valueAtTransfer, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HEADER */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Protocol: Asset Migration
            </span>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Stock Asset Transfers
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Manage and audit the movement of stocks and digital assets across
            your portfolios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowTransferModal(true)}
            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[11px] 
                      bg-slate-900 text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] 
                      dark:bg-white dark:text-black dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.1)]
                      hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
            Move Assets
          </Button>
        </div>
      </header>

      {/* ASSET STATS OVERVIEW */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatsCard
          title="Total Inbound Volume"
          value={formatCurrency(totalInbound)}
          icon={<ArrowDownLeft className="text-emerald-500" />}
          description="Total assets received into custody"
        />
        <StatsCard
          title="Total Outbound Volume"
          value={formatCurrency(totalOutbound)}
          icon={<ArrowUpRight className="text-rose-500" />}
          description="Assets migrated to external sinks"
        />
        <StatsCard
          title="Network Status"
          value={user.kycVerified ? "Tier-1 Verified" : "Verification Required"}
          icon={<Globe className="text-blue-500" />}
          isBadge
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT: MAIN LEDGER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Box className="w-3 h-3" /> Transactional Ledger
            </h2>
            <Badge variant="outline" className="text-[9px] font-bold">
              {transfers.length} Operations Found
            </Badge>
          </div>

          <div className="space-y-4">
            {transfers.length === 0 ? (
              <EmptyState message="No asset transfers recorded" />
            ) : (
              transfers.map((t: any) => (
                <AssetTransferItem
                  key={t.id}
                  transfer={t}
                  formatCurrency={formatCurrency}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT: PROTOCOL & COMPLIANCE */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 dark:bg-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-800 dark:ring-white">
            <CardHeader className="border-b border-slate-800 dark:border-slate-200 bg-slate-950 dark:bg-slate-50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Compliance
                Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ProtocolStep
                step="01"
                label="Asset Lock"
                sub="Selected shares are frozen in the source portfolio during the migration handshake."
                darkTheme
              />
              <ProtocolStep
                step="02"
                label="Identity Verification"
                sub="Level 1 KYC is mandatory for all cross-user or external wallet migrations."
                darkTheme
              />
              <ProtocolStep
                step="03"
                label="Settlement Cycle"
                sub="Traditional stocks follow T+1 settlement; digital assets await 3 network confirmations."
                darkTheme
              />
            </CardContent>
          </Card>

          <Card className="border-none bg-slate-50 dark:bg-slate-900/40 shadow-inner ring-1 ring-slate-200 dark:ring-slate-800 p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FileText className="w-3 h-3" /> System Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                NVIDIA Corp. (NVDA) transfers reflect the pre-split adjusted
                value. Bitcoin (BTC) transfers include the internal liquidity
                fees applied at the time of migration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <TransferPortfolioModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        portfolios={user.portfolios}
      />
    </div>
  );
}

/** HELPER COMPONENTS **/

function StatsCard({ title, value, icon, description, isBadge }: any) {
  return (
    <Card className="border-none shadow-xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800">
      <CardContent className="flex items-center gap-5 pt-7 pb-7">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>
          {isBadge ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none uppercase text-[10px] font-black tracking-widest px-3 py-1 mt-1">
              {value}
            </Badge>
          ) : (
            <p className="text-2xl font-mono font-black tabular-nums tracking-tighter text-slate-900 dark:text-white">
              {value}
            </p>
          )}
          {description && (
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AssetTransferItem({ transfer, formatCurrency }: any) {
  const isInbound = transfer.type === "inbound";

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-blue-500/30 transition-all bg-white dark:bg-slate-900/30 backdrop-blur-sm group">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-5">
          <div
            className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${
              isInbound
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {isInbound ? (
              <ArrowDownLeft className="h-5 w-5" />
            ) : (
              <ArrowUpRight className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-800 dark:text-slate-100">
                {transfer.assetName}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] font-black h-4 px-1 border-slate-200 text-slate-400"
              >
                {transfer.assetSymbol}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
              {isInbound
                ? `From: ${transfer.fromUser}`
                : `To: ${transfer.toUser}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-black tabular-nums tracking-tighter text-slate-900 dark:text-white">
            {isInbound ? "+" : "-"}
            {transfer.shares}{" "}
            <span className="text-[10px] font-bold text-slate-400 ml-0.5">
              SHARES
            </span>
          </p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-[10px] text-slate-400 font-bold tabular-nums">
              {formatCurrency(transfer.valueAtTransfer)}
            </span>
            <Badge className="text-[8px] font-black uppercase tracking-widest px-2 h-3.5 border-none bg-emerald-500/10 text-emerald-500">
              {transfer.status}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProtocolStep({ step, label, sub, darkTheme }: any) {
  return (
    <div className="flex gap-4 items-start group">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors ${
          darkTheme
            ? "bg-slate-800 text-slate-400 border-slate-700 group-hover:bg-white group-hover:text-black"
            : "bg-white text-slate-400 border-slate-100 group-hover:bg-slate-900 group-hover:text-white"
        }`}
      >
        {step}
      </div>
      <div className="space-y-1">
        <p
          className={`text-xs font-bold leading-none ${
            darkTheme ? "text-slate-200" : "text-slate-800 dark:text-slate-200"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-[10px] font-medium leading-relaxed ${
            darkTheme ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
      <Box className="w-8 h-8 text-slate-300 mb-2 opacity-30" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {message}
      </p>
    </div>
  );
}
