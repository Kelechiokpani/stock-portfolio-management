"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Landmark,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { useGetAllUsersQuery } from "@/app/services/features/admin/adminApi";
import AdminSupportDesk from "@/components/support/AdminSupportDesk";

const mockSelectedUser = {
  id: "USR-9942-XQ",
  fullName: "Alexander Sterling",
  email: "a.sterling@vault-capital.com",
};

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Re-using your query or fetching single user if you have that hook
  const { data: rawResponse } = useGetAllUsersQuery({
    page: 1,
    limit: 100,
    total: 0,
  });

  const user = rawResponse?.users?.find((u: any) => u._id === id);

  const handleOpenChat = (user: any) => {
    setIsPanelOpen(true);
  };

  if (!user)
    return (
      <div className="p-10 text-center font-serif italic text-slate-500">
        Retrieving user record...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8 space-y-6 transition-colors duration-300">
      {/* NAVIGATION */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-slate-500 hover:text-blue-600 -ml-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Button>

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex gap-5 items-center">
          <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-2xl">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            />
            <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              <Badge className="bg-blue-500/10 text-blue-600 border-none uppercase text-[10px] font-black tracking-widest px-3">
                {user.role}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20">
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-6 dark:bg-slate-900 dark:border-slate-800 border-slate-200 font-bold"
          >
            Suspend Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: IDENTITY & SECURITY */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden">
            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 border-b dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Account Identity
              </span>
            </div>
            <CardContent className="p-6 space-y-4">
              <InfoRow
                label="Account Type"
                value={user.accountType}
                icon={<Briefcase className="w-4 h-4" />}
              />
              <InfoRow
                label="Risk Tolerance"
                value={user.riskTolerance}
                icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
              />
              <InfoRow
                label="Base Currency"
                value={user.baseCurrency}
                icon={<Landmark className="w-4 h-4" />}
              />
              <InfoRow
                label="Phone"
                value={user.phone || "Not Provided"}
                icon={<Phone className="w-4 h-4" />}
              />
              <InfoRow
                label="Location"
                value={user.country || "Unset"}
                icon={<MapPin className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Security Clearance
                </span>
                <Badge
                  className={
                    user.kycVerified
                      ? "bg-emerald-500/10 text-emerald-600 border-none"
                      : "bg-rose-500/10 text-rose-600 border-none"
                  }
                >
                  {user.kycStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Onboarding Progress
                </span>
                <span className="text-sm font-black text-blue-600">
                  Step {user.onboardingStep}/16
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: FINANCIALS & TABS */}
        <div className="lg:col-span-2 space-y-6">
          {/* BALANCE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <Wallet className="absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                Total Balance
              </p>
              <h2 className="text-4xl font-black italic tracking-tighter mb-4">
                {user.baseCurrency} {user.totalBalance.toLocaleString()}
              </h2>
              <div className="flex gap-4">
                <div className="text-[10px]">
                  <p className="opacity-60 uppercase font-bold">
                    Available Cash
                  </p>
                  <p className="text-sm font-bold">
                    {user.availableCash.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Investments
              </p>
              <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                $0.00
              </h2>
              <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 0% Growth this month
              </p>
            </div>
          </div>

          {/* ACTIVITY TABS */}
          <Tabs defaultValue="stocks" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full justify-start h-14 border dark:border-slate-700">
              <TabsTrigger
                value="stocks"
                className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Stock Ops
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Cash Flow
              </TabsTrigger>
              <TabsTrigger
                value="transfers"
                className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Transfers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="mt-4">
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl p-8 text-center">
                <div className="max-w-xs mx-auto space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm">
                    No Equity Positions
                  </h3>
                  <p className="text-xs text-slate-500">
                    This user hasn't executed any Buy or Sell orders in the
                    current fiscal period.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                          Date
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                          Type
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                          Amount
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                          Method
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.transactions?.map((tx: any) => (
                        <tr
                          key={tx._id}
                          className="border-b dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                        >
                          <td className="p-4 text-xs font-mono text-slate-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${
                                tx.type === "deposit"
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {tx.type === "deposit" ? (
                                <ArrowDownLeft className="w-3 h-3" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3" />
                              )}
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-bold dark:text-white">
                            {tx.currency} {tx.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-xs text-slate-500 font-medium">
                            {tx.method}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`rounded-md text-[9px] font-black uppercase border-none ${
                                tx.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-amber-500/10 text-amber-600"
                              }`}
                            >
                              {tx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* <AdminSupportDesk
        user={mockSelectedUser}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      /> */}

      <AdminSupportDesk user={mockSelectedUser} />
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-400">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
          {label}
        </span>
      </div>
      <span className="text-sm font-black text-slate-900 dark:text-white capitalize italic">
        {value}
      </span>
    </div>
  );
}
