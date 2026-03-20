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
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/app/services/features/admin/adminApi";
import {
  useUpdateTransactionStatusMutation,
  useUpdateTradeStatusMutation,
  useUpdatePortfolioTransferStatusMutation,
} from "@/app/services/features/admin/adminApi";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { Check, X, CheckCircle2, XCircle } from "lucide-react";
import AdminSupportDesk from "@/components/support/AdminSupportDesk";
import { useSendMessageMutation } from "@/app/services/features/market/marketApi";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";
import { TransferDetailModal } from "@/components/TransferDetailModal";


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

  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Re-using your query or fetching single user if you have that hook
  const { data: rawResponse } = useGetAllUsersQuery({
    page: 1,
    limit: 100,
    total: 0,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  // Mutations
  const [updateTx, { isLoading: isTxUpdating }] =
    useUpdateTransactionStatusMutation();
  const [updateTrade, { isLoading: isTradeUpdating }] =
    useUpdateTradeStatusMutation();
  const [updateTransfer, { isLoading: isTransferUpdating }] =
    useUpdatePortfolioTransferStatusMutation();

  const user = rawResponse?.users?.find((u: any) => u._id === id);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant: "default" | "destructive";
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    variant: "default",
  });

  // Reusable trigger
  const openConfirm = (config: Omit<typeof modalConfig, "isOpen">) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeConfirm = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  // HANDLERS
  const handleAction = async (
    mutation: any,
    id: string,
    status: string,
    type: string
  ) => {
    try {
      await mutation({ id, status }).unwrap();
      toast.success(`${type} ${status} successfully`);
      closeConfirm();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to update ${type}`);
    }
  };

  console.log("user Response:", user); // Debug log to check API response structure

  const handleStatusToggle = async () => {
    const isSuspended = user?.accountStatus === "suspended";
    const newStatus = isSuspended ? "active" : "suspended";

    try {
      await updateStatus({
        id: user?._id,
        status: newStatus,
      }).unwrap();

      toast.success(
        `Account ${
          newStatus === "suspended" ? "suspended" : "activated"
        } successfully`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update account status");
    }
  };

  const handleViewDetails = (tf: any) => {
    setSelectedTransfer(tf);
    setIsModalOpen(true);
  };

  if (!user) return <GlobalLoader message="Decrypting User Database..." />;

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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                user?.accountStatus === "suspended"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user?.accountStatus === "suspended" ? (
                <ShieldCheck size={18} />
              ) : (
                <ShieldAlert size={18} />
              )}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-zinc-500">
                Security Action
              </p>
              <p className="text-[13px] font-bold">
                {user?.accountStatus === "suspended"
                  ? "Restore Access"
                  : "Restrict Account"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdating}
            onClick={handleStatusToggle}
            className={`text-[10px] font-black uppercase tracking-widest rounded-xl border-2 ${
              user?.accountStatus === "suspended"
                ? "border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                : "border-red-200 hover:bg-red-50 text-black dark:text-white hover:text-red-600"
            }`}
          >
            {isUpdating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : user?.accountStatus === "suspended" ? (
              "Activate"
            ) : (
              "Suspend"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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

          {/* --- MODAL --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- MODAL --- */}
            <ConfirmActionModal
              {...modalConfig}
              onClose={closeConfirm}
              // Correctly map the 'action' from state to the prop the modal expects
              onConfirm={modalConfig.action}
              isLoading={isTxUpdating || isTradeUpdating || isTransferUpdating}
            />

            {/* ACTIVITY TABS */}
            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full justify-start h-14 border dark:border-slate-800 backdrop-blur-md">
                <TabsTrigger
                  value="stocks"
                  className="rounded-lg px-6 font-black text-[10px] uppercase tracking-[0.15em]"
                >
                  Buy & Sell Stock
                </TabsTrigger>
                <TabsTrigger
                  value="deposit"
                  className="rounded-lg px-6 font-black text-[10px] uppercase tracking-[0.15em]"
                >
                  Deposit Transaction
                </TabsTrigger>

                <TabsTrigger
                  value="withdrawal"
                  className="rounded-lg px-6 font-black text-[10px] uppercase tracking-[0.15em]"
                >
                  Withdrawal Transaction
                </TabsTrigger>
                <TabsTrigger
                  value="transfers"
                  className="rounded-lg px-6 font-black text-[10px] uppercase tracking-[0.15em]"
                >
                  Portfolio Transfers
                </TabsTrigger>
              </TabsList>

              {/* 1. STOCK OPS */}
              <TabsContent
                value="stocks"
                className="mt-6 focus-visible:outline-none"
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-slate-800">
                        <tr>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Symbol
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Company
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Sector
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Price Per Share
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Shares
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Total Amount
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">
                            stock Type
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">
                            Management
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800">
                        {user.buys?.map((trade: any) => (
                          <tr
                            key={trade._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-5 text-xs font-bold">
                              {trade.symbol}
                            </td>
                            <td className="p-5 text-xs font-bold">
                              {trade.companyName}
                            </td>
                            <td className="p-5 text-xs font-bold">
                              {trade.sector}
                            </td>
                            <td className="p-5 text-xs font-bold">
                              ${trade.pricePerShare}
                            </td>
                            <td className="p-5 text-xs">{trade.shares}</td>
                            <td className="p-5 text-sm font-black">
                              ${trade.totalAmount?.toLocaleString()}
                            </td>
                            <td className="p-5 text-right">
                              <span
                                className={`inline-flex items-center justify-center px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  trade.type === "buy"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                                }`}
                              >
                                {trade.type}
                              </span>
                            </td>

                            <td className="p-5 text-right">
                              {trade.status === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase text-white rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Approve Trade",
                                        description:
                                          "Confirm this market execution?",
                                        variant: "default",
                                        action: () =>
                                          handleAction(
                                            updateTrade,
                                            trade._id,
                                            "approved",
                                            "Trade"
                                          ),
                                      })
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-rose-500 hover:bg-rose-50 text-[10px] font-black uppercase rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Reject Trade",
                                        description:
                                          "Cancel this market order?",
                                        variant: "destructive",
                                        action: () =>
                                          handleAction(
                                            updateTrade,
                                            trade._id,
                                            "rejected",
                                            "Trade"
                                          ),
                                      })
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <Badge className="text-[9px] font-black uppercase opacity-50">
                                  {trade.status}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* 2. CASH FLOW */}
              <TabsContent
                value="deposit"
                className="mt-6 focus-visible:outline-none"
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-slate-800">
                        <tr>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Date
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Type
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Amount
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Deposit Method
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Status
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">
                            Management
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800">
                        {[...(user.deposits || [])].map((tx: any) => (
                          <tr
                            key={tx._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-5 text-xs font-mono text-slate-400">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                            <td
                              className={`p-5 text-[10px] font-black uppercase ${
                                tx.type === "deposit"
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {tx.type}
                            </td>
                            <td className="p-5 text-sm font-black">
                              {tx.currency} {tx.amount.toLocaleString()}
                            </td>

                            <td className="p-5 text-sm font-black">
                              {tx.method}
                            </td>

                            <td
                              className={`p-5 text-[10px] font-black uppercase ${
                                tx.status === "pending"
                                  ? "text-rose-500"
                                  : "text-emerald-500"
                              }`}
                            >
                              {tx.status}
                            </td>

                            <td className="p-5 text-right">
                              {tx.status === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase text-white rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Approve Funds",
                                        description:
                                          "Credit this amount to user wallet?",
                                        variant: "default",
                                        action: () =>
                                          handleAction(
                                            updateTx,
                                            tx._id,
                                            "completed",
                                            "Transaction"
                                          ),
                                      })
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-rose-500 hover:bg-rose-50 text-[10px] font-black uppercase rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Decline Funds",
                                        description:
                                          "Reject this financial request?",
                                        variant: "destructive",
                                        action: () =>
                                          handleAction(
                                            updateTx,
                                            tx._id,
                                            "rejected",
                                            "Transaction"
                                          ),
                                      })
                                    }
                                  >
                                    Decline
                                  </Button>
                                </div>
                              ) : (
                                <Badge className="text-[9px] font-black uppercase opacity-50">
                                  {tx.status}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* 2. CASH FLOW */}
              <TabsContent
                value="withdrawal"
                className="mt-6 focus-visible:outline-none"
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-slate-800">
                        <tr>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Date
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Type
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Amount
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Withdrawal Method
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Status
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">
                            Management
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800">
                        {[...(user.withdrawals || [])].map((tx: any) => (
                          <tr
                            key={tx._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-5 text-xs font-mono text-slate-400">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                            <td
                              className={`p-5 text-[10px] font-black uppercase ${
                                tx.type === "deposit"
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {tx.type}
                            </td>
                            <td className="p-5 text-sm font-black">
                              {tx.currency} {tx.amount.toLocaleString()}
                            </td>

                            <td className="p-5 text-sm font-black">
                              {tx.method}
                            </td>

                            <td
                              className={`p-5 text-[10px] font-black uppercase ${
                                tx.status === "pending"
                                  ? "text-rose-500"
                                  : "text-emerald-500"
                              }`}
                            >
                              {tx.status}
                            </td>

                            <td className="p-5 text-right">
                              {tx.status === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase text-white rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Approve Funds",
                                        description:
                                          "withdraw this amount from user wallet?",
                                        variant: "default",
                                        action: () =>
                                          handleAction(
                                            updateTx,
                                            tx._id,
                                            "completed",
                                            "Transaction"
                                          ),
                                      })
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-rose-500 hover:bg-rose-50 text-[10px] font-black uppercase rounded-lg"
                                    onClick={() =>
                                      openConfirm({
                                        title: "Decline Funds",
                                        description:
                                          "Reject this financial request?",
                                        variant: "destructive",
                                        action: () =>
                                          handleAction(
                                            updateTx,
                                            tx._id,
                                            "rejected",
                                            "Transaction"
                                          ),
                                      })
                                    }
                                  >
                                    Decline
                                  </Button>
                                </div>
                              ) : (
                                <Badge className="text-[9px] font-black uppercase opacity-50">
                                  {tx.status}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* 3. TRANSFERS */}
              <TabsContent
                value="transfers"
                className="mt-6 focus-visible:outline-none"
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-slate-800">
                        <tr>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Asset
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Counterparty
                          </th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            Value
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">
                            Management
                          </th>{" "}
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                            View details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800">
                        {user.transfers?.map((tf: any) => {
                          // Logic to determine what to show in the Asset column
                          const isCluster = tf.assets && tf.assets.length > 0;
                          const assetDisplayName = isCluster
                            ? `${tf.assets[0].symbol} +${
                                tf.assets.length - 1
                              } more`
                            : tf.assetSymbol || "Portfolio";

                          return (
                            <tr
                              key={tf._id}
                              className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                            >
                              <td className="p-5">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold">
                                    {assetDisplayName}
                                  </span>
                                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                                    {isCluster
                                      ? "Portfolio Migration"
                                      : "Asset Transfer"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex flex-col max-w-[150px]">
                                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase truncate">
                                    {tf.recipientFirstName}{" "}
                                    {tf.recipientLastName}
                                  </span>
                                  <span className="text-[9px] text-slate-400 truncate">
                                    {tf.recipientEmail || "External Address"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-5 text-sm font-black">
                                {/* Fallback chain for totalValue based on your log structure */}
                                €
                                {(
                                  tf.totalValue ||
                                  tf.valueAtTransfer ||
                                  0
                                ).toLocaleString()}
                              </td>

                              {/*  onClick={() => handleViewDetails(tf)} */}
                              <td className="p-5 text-center">
                                {tf.status === "pending" ? (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase text-white rounded-lg shadow-lg shadow-emerald-500/20"
                                      onClick={() =>
                                        openConfirm({
                                          title: "Authorize Transfer",
                                          description: `Approve migration of €${(
                                            tf.totalValue || 0
                                          ).toLocaleString()}?`,
                                          variant: "default",
                                          action: () =>
                                            handleAction(
                                              updateTransfer,
                                              tf._id,
                                              "completed",
                                              "Transfer"
                                            ),
                                        })
                                      }
                                    >
                                      Authorize
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[10px] font-black uppercase rounded-lg"
                                      onClick={() =>
                                        openConfirm({
                                          title: "Decline Transfer",
                                          description:
                                            "Abort this asset migration permanently?",
                                          variant: "destructive",
                                          action: () =>
                                            handleAction(
                                              updateTransfer,
                                              tf._id,
                                              "rejected",
                                              "Transfer"
                                            ),
                                        })
                                      }
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                ) : (
                                  <Badge
                                    className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                                      tf.status === "completed"
                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {tf.status}
                                  </Badge>
                                )}
                              </td>

                              <td className="p-5 text-sm font-black">
                                <Button
                                  onClick={() => handleViewDetails(tf)}
                                  size="sm"
                                  className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase text-white rounded-lg shadow-lg shadow-emerald-500/20"
                                >
                                  view details
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TransferDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transfer={selectedTransfer}
              />
            </Tabs>
          </div>
        </div>
      </div>

      <AdminSupportDesk user={user} />
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
