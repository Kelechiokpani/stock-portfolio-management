"use client";

import { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Plus,
  Minus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// API & Modals
import { useGetMeQuery } from "@/app/services/features/auth/authApi";
import GlobalLoader from "@/components/GlobalLoader";
import { DepositModal } from "@/components/Modal-Layout/deposit-modal";
import { WithdrawalModal } from "@/components/Modal-Layout/withdrawal-modal";
import CashMovementTabs from "@/components/Modal-Layout/transaction-history";
import { SettlementNodes } from "@/components/Modal-Layout/settlement-nodes";
import SupportTerminal from "@/components/support/SupportTerminal";
import { ResettlementModal } from "@/components/Modal-Layout/Resettlement-modal";
import { useGetResettlementAccountsQuery } from "@/app/services/features/market/marketApi";
import { ResettlementNodes } from "@/components/market/wallet/resettlementNodes";

export default function WalletPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showResettlementModal, setShowResettlementModal] = useState(false);
  const [showSupportDeposit, setShowSupportDeposit] = useState(false);

  const { data: response, isLoading } = useGetMeQuery();
  const { data: resettlementAccounts } = useGetResettlementAccountsQuery();

  // console.log("User data response:", response);

  // console.log("User resettlementAccounts:", resettlementAccounts);

  const user = response?.user;

  // Financial Calculations
  const stats = useMemo(() => {
    if (!user) return { deposits: 0, withdrawals: 0 };

    const deposits = user.cashMovements
      .filter((m: any) => m.type === "deposit" && m.status === "completed")
      .reduce((sum: number, m: any) => sum + m.amount, 0);

    const withdrawals = user.cashMovements
      .filter((m: any) => m.type === "withdrawal" && m.status === "completed")
      .reduce((sum: number, m: any) => sum + m.amount, 0);

    return { deposits, withdrawals };
  }, [user]);

  if (isLoading)
    return (
      <GlobalLoader
        message="Syncing Capital Ledger"
        subtext="Verifying settlement nodes..."
      />
    );

  if (!user) return null;

  const currency = user.settings.baseCurrency || "EUR";
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-DE", { style: "currency", currency }).format(val);

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. INSTITUTIONAL HEADER */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-slate-200 dark:border-slate-800"
            >
              Capital Reserve
            </Badge>
            <Badge className="bg-emerald-500 text-white border-none flex gap-1.5 items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> SECURED BY LEDGER
            </Badge>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Funds Management
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Authorized for{" "}
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              {user.settings.accountType}
            </span>{" "}
            clearing and settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            // onClick={() => setShowDepositModal(true)}
            onClick={() => setShowSupportDeposit(true)}
            className="rounded-xl bg-emerald-500 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-2xl hover:opacity-90 transition-all"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Deposit
          </Button>
          <Button
            onClick={() => setShowResettlementModal(true)}
            variant="outline"
            className="rounded-xl border-slate-500 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] px-8 h-12 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            <Minus className="mr-2 h-4 w-4 stroke-[3px]" /> Add Withdrawal
            Account
          </Button>
        </div>
      </header>

      {/* 2. CORE KPIS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BalanceCard
          title="Available Liquidity"
          amount={user.availableCash}
          icon={<Wallet className="h-5 w-5" />}
          description="Total funds cleared for trading"
          format={formatCurrency}
          theme="dark"
        />
        <BalanceCard
          title="Net Inflows"
          amount={stats.deposits}
          icon={<ArrowDownLeft className="h-5 w-5 text-emerald-500" />}
          description="Total lifetime successful deposits"
          format={formatCurrency}
          theme="light"
        />
        <BalanceCard
          title="Capital Outflows"
          amount={stats.withdrawals}
          icon={<ArrowUpRight className="h-5 w-5 text-rose-500" />}
          description="Total lifetime successful withdrawals"
          format={formatCurrency}
          theme="light"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black italic tracking-tight text-foreground">
                Resettlement / Withdrawal Accounts
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                Verified Liquidity Accounts
              </p>
            </div>
          </div>
          {user?.settlementAccounts?.length >= 1 && (
            <Button
              onClick={() => setShowWithdrawalModal(true)}
              variant="outline"
              className="rounded-xl border-slate-500 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] px-8 h-12 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <Minus className="mr-2 h-4 w-4 stroke-[3px]" />
              Withdrawal
            </Button>
          )}
        </div>

        <ResettlementNodes accounts={user.settlementAccounts} />
      </section>

      {/* 3. MOVEMENTS & NODES */}
      {/* <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-lg font-serif font-bold tracking-tight">
              Verified Nodes
            </h2>
          </div>
          <SettlementNodes
            accounts={user.connectedAccounts}
            kycStatus={user.settings.kycStatus}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-4 h-4 text-slate-400" />
            <h2 className="text-lg font-serif font-bold tracking-tight">
              Recent Cash Movements
            </h2>
          </div>
          <CashMovementTabs
            movements={user.cashMovements}
            currency={currency}
          />
        </div>
      </div> */}

      {/* <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        connectedAccounts={user.connectedAccounts}
        baseCurrency={currency}
      /> */}

      <SupportTerminal
        isDepositOpen={showSupportDeposit}
        onClose={() => setShowSupportDeposit(false)}
      />

      <ResettlementModal
        isOpen={showResettlementModal}
        onClose={() => setShowResettlementModal(false)}
      />

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        availableBalance={user.availableCash}
        settlementAccounts={user?.settlementAccounts}
      />
    </div>
  );
}

/** * SUB-COMPONENTS **/

function BalanceCard({ title, amount, icon, description, format, theme }: any) {
  const isDark = theme === "dark";

  return (
    <Card
      className={`border-none shadow-xl ring-1 ${
        isDark
          ? "bg-slate-900 text-white dark:bg-white dark:text-black ring-slate-900 dark:ring-white"
          : "bg-white dark:bg-slate-900/40 ring-slate-100 dark:ring-slate-800"
      }`}
    >
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`p-3 rounded-2xl ${
              isDark
                ? "bg-white/10 dark:bg-slate-100"
                : "bg-slate-50 dark:bg-slate-800"
            }`}
          >
            {icon}
          </div>
          <p
            className={`text-[9px] font-black uppercase tracking-[0.2em] ${
              isDark ? "opacity-60" : "text-slate-400"
            }`}
          >
            {title}
          </p>
        </div>
        <p className="text-4xl font-mono font-black tracking-tighter tabular-nums mb-2">
          {format(amount)}
        </p>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isDark ? "opacity-40" : "text-slate-400"
          }`}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
