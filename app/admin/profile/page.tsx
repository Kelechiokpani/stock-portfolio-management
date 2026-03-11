"use client";

import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  MapPin,
  Mail,
  Phone,
  Globe,
  User as UserIcon,
  ShieldAlert,
  CreditCard,
  Settings2,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Fingerprint,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GlobalLoader from "@/components/GlobalLoader";

// Assuming this is your API hook path
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

export default function ProfilePage() {
  const { data: response, isLoading } = useGetMeQuery();

  if (isLoading)
    return (
      <GlobalLoader
        message="Retrieving Identity"
        subtext="Fetching profile credentials from the secure vault..."
      />
    );

  const user = response?.user;
  if (!user) return null;

  // Derived states from your JSON
  const isVerified = user.kycVerified;
  const portfolio = user.portfolios?.[0]; // Julian's Main Growth Portfolio

  const totalGain =
    portfolio?.holdings.reduce(
      (acc: number, curr: any) => acc + curr.change,
      0
    ) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. PROFILE HEADER */}
      <header className="relative flex flex-col md:flex-row items-center gap-8 border-b border-border/40 pb-10">
        <div className="relative group">
          <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <img
              src={user.profile.avatar}
              alt={user.profile.firstName}
              className="h-full w-full object-cover bg-slate-100 dark:bg-slate-800"
            />
          </div>
          {isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-background shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
              {user.profile.firstName} {user.profile.lastName}
            </h1>
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 px-3 uppercase text-[10px] font-black tracking-widest"
            >
              {user.settings.accountType} Account
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-500 border-none text-[10px] font-bold">
              STEP {user.onboardingStep}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground text-sm font-medium">
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
              <Mail className="h-4 w-4" /> {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-500" /> {user.profile.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Fingerprint className="h-4 w-4 text-slate-400" /> ID:{" "}
              {user.id.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-6 font-bold border-slate-200 dark:border-slate-800"
          >
            Settings
          </Button>
          <Button className="rounded-xl px-6 shadow-xl shadow-primary/20 font-bold bg-slate-900 dark:bg-white dark:text-black">
            Upgrade
          </Button>
        </div>
      </header>

      {/* 2. STATS OVERVIEW (New Section for Julian's Financials) */}


      <div className="grid gap-8 lg:grid-cols-3">
        {/* 3. PERSONAL DOSSIER */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Identity Dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-10 pt-8">
            <InfoItem label="Legal First Name" value={user.profile.firstName} />
            <InfoItem label="Legal Last Name" value={user.profile.lastName} />
            <InfoItem label="Contact Number" value={user.profile.phoneNumber} />
            <InfoItem label="Registered Email" value={user.profile.email} />
            <InfoItem
              label="Residential Address"
              value={user.profile.address}
              className="sm:col-span-2"
            />

            {/* 4. RECENT MOVEMENTS (Integrated from cashMovements) */}
            <div className="sm:col-span-2 space-y-4 pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Recent Capital Movements
              </h4>
              <div className="space-y-3">
                {user.cashMovements.slice(0, 5).map((move: any) => (
                  <div
                    key={move.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          move.type === "deposit"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {move.type === "deposit" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold capitalize">
                          {move.type} via {move.method}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(move.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-mono font-bold ${
                        move.type === "deposit"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {move.type === "deposit" ? "+" : "-"}
                      {move.amount} {move.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. SIDEBAR - RISK & COMPLIANCE */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Investor Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-sm text-slate-500">Risk Tolerance</span>
                <Badge className="bg-rose-500/10 text-rose-600 border-none capitalize font-black text-[10px]">
                  {user.settings.riskTolerance}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-sm text-slate-500">Base Currency</span>
                <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200">
                  {user.settings.baseCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Linked Providers</span>
                <div className="flex -space-x-2">
                  {user.connectedAccounts.map((acc: any) => (
                    <div
                      key={acc.id}
                      className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-background flex items-center justify-center text-[8px] font-bold"
                      title={acc.provider}
                    >
                      {acc.provider[0]}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card className="border-none bg-slate-900 dark:bg-slate-100 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Compliance Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusBadge
                label="Identity (KYC)"
                status={user.settings.kycStatus}
                icon={
                  isVerified ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )
                }
              />
              <StatusBadge
                label="Digital Agreement"
                status={user.agreementSigned ? "signed" : "pending"}
                icon={<FileText className="h-4 w-4" />}
              />
              <StatusBadge
                label="Account Status"
                status={user.accountStatus}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** MINI COMPONENTS **/

function MetricCard({ label, value, subtext, icon, isNegative }: any) {
  return (
    <Card className="border-none shadow-lg bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
        <div>
          <h3
            className={`text-2xl font-black font-mono tracking-tighter ${
              isNegative ? "text-rose-500" : "text-slate-900 dark:text-white"
            }`}
          >
            {value}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
            {subtext}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, className }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>
      <p className="font-bold text-slate-700 dark:text-slate-200 border-l-4 border-primary/20 pl-4 py-1 text-sm">
        {value || "Not Provided"}
      </p>
    </div>
  );
}

function StatusBadge({
  label,
  status,
  icon,
}: {
  label: string;
  status: string;
  icon: any;
}) {
  const isApproved =
    status === "verified" ||
    status === "signed" ||
    status === "active" ||
    status === "approved";

  return (
    <div className="flex items-center justify-between bg-white/5 dark:bg-black/5 p-4 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl ${
            isApproved ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
          }`}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-white dark:text-slate-900">
          {label}
        </span>
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          isApproved ? "text-emerald-400" : "text-amber-500"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
