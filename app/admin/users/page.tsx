"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Mail,
  Target,
  History,
  Ban,
  Clock,
  RefreshCw,
  UserCheck,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalLoader from "@/components/GlobalLoader";
import { useParams, useRouter } from "next/navigation";

// Import your hook
import { useGetAllUsersQuery } from "@/app/services/features/admin/adminApi";
import { CustomPagination } from "@/components/Reuse/CustomPagination";

export default function ManageUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [view, setView] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // API Integration
  const {
    data: rawResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllUsersQuery({ page, limit, total: 0 });

  console.log("API Response:", rawResponse); // Debug log to check API response structure

  // --- 1. DATA NORMALIZATION ---
  const usersList = useMemo(() => {
    if (!rawResponse) return [];
    // Handles { users: [] } or just []
    return (
      rawResponse.users ||
      rawResponse.data ||
      (Array.isArray(rawResponse) ? rawResponse : [])
    );
  }, [rawResponse]);

  // --- 2. DYNAMIC STATS ---
  const stats = useMemo(() => {
    const total = usersList.length;
    const verified = usersList.filter((u: any) => u.kycVerified).length;
    const pending = usersList.filter(
      (u: any) => u.accountStatus === "pending"
    ).length;
    const totalCap = usersList.reduce(
      (acc: number, curr: any) => acc + (curr.totalBalance || 0),
      0
    );

    return { total, verified, pending, totalCap };
  }, [usersList]);

  // --- 3. FILTER LOGIC ---
  const filteredUsers = useMemo(() => {
    return usersList.filter((user: any) => {
      const fullName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = fullName.includes(search) || email.includes(search);

      if (view === "all") return matchesSearch;
      if (view === "verified")
        return matchesSearch && user.kycVerified === true;
      if (view === "pending")
        return matchesSearch && user.accountStatus === "pending";
      if (view === "suspended")
        return matchesSearch && user.accountStatus === "suspended";
      return matchesSearch;
    });
  }, [usersList, searchTerm, view]);

  if (isLoading) return <GlobalLoader message="Decrypting User Database..." />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8 space-y-8 transition-colors duration-300">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Admin Node: Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900 dark:text-slate-100 font-serif italic">
            User Directory
          </h1>
          <p className="text-muted-foreground text-sm">
            Operational oversight for{" "}
            <span className="text-blue-600 font-bold">{stats.total}</span>{" "}
            accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="dark:bg-slate-900 dark:border-slate-800 h-10 px-4"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Sync
          </Button>
        </div>
      </div>

      {/* --- STATS BENTO --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Total Users"
          value={stats.total}
          trend="Live Directory"
          icon={<Briefcase className="w-4 h-4 text-blue-500" />}
        />
        <StatusCard
          label="KYC Verified"
          value={stats.verified}
          trend="Compliant"
          color="text-emerald-500"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
        />
        <StatusCard
          label="Pending Action"
          value={stats.pending}
          trend="Awaiting Review"
          color="text-amber-500"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <StatusCard
          label="Total AUM"
          value={`$${(stats.totalCap / 1000).toFixed(1)}K`}
          trend="Liquid Balance"
          color="text-blue-500"
          icon={<CreditCard className="w-4 h-4 text-blue-500" />}
        />
      </div>

      {/* --- DATA INTERFACE --- */}
      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/50 backdrop-blur-md overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="p-6 border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Filter by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {["All", "Verified", "Pending", "Suspended"].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab.toLowerCase())}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  view === tab.toLowerCase()
                    ? "bg-white dark:bg-slate-700 shadow-md text-blue-600"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/80">
                <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                  <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    User Identity
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Account Logic
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Security Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Portfolio
                  </TableHead>
                  <TableHead className="text-right px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Management
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <UserRow key={user._id} user={user} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-slate-400 italic font-serif"
                    >
                      No matching records found in the current sector.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredUsers && (
            <CustomPagination
              currentPage={page}
              totalPages={rawResponse?.pagination?.totalPages}
              limit={limit}
              totalItems={rawResponse?.pagination?.total}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* --- ROW COMPONENT --- */

function UserRow({ user }: { user: any }) {
  const router = useRouter();
  const name = `${user.firstName || ""} ${user.lastName || ""}`;

  return (
    <TableRow className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b dark:border-slate-800/50">
      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-11 w-11 border-2 border-white dark:border-slate-800 shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              />
              <AvatarFallback className="bg-slate-900 text-white text-xs">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.kycVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {name}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border dark:border-slate-700">
                STEP {user.onboardingStep}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono uppercase tracking-tighter">
              <Mail className="w-3 h-3" /> {user.email}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">
              {user.accountType}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {user.riskTolerance} Risk
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                user.kycVerified ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              KYC: {user.kycStatus.replace("_", " ")}
            </span>
          </div>
          <Badge
            className={`
            text-[9px] py-0 px-2 border-none shadow-none font-black tracking-widest
            ${
              user.accountStatus === "approved"
                ? "bg-emerald-500/10 text-emerald-600"
                : user.accountStatus === "pending"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-green-500/10 text-green-600"
            }
          `}
          >
            {user.accountStatus.toUpperCase()}
          </Badge>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="font-mono text-sm font-black text-slate-900 dark:text-white italic">
            {user.totalBalance?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            {user.baseCurrency}{" "}
            <span className="text-slate-300 ml-1">
              Available: {user.availableCash}
            </span>
          </span>
        </div>
      </TableCell>

      <TableCell className="text-right px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-xl shadow-2xl border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800"
          >
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-2">
              Security Ops
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

            {/* Audit Action */}
            <DropdownMenuItem
              onClick={() => router.push(`/admin/users/${user._id}`)}
              className="flex items-center gap-3 p-3 cursor-pointer rounded-lg focus:bg-blue-50 dark:focus:bg-blue-500/10 transition-colors"
            >
              <History className="w-4 h-4 text-blue-500" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  View User Data
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  View transaction history
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

            {/* Danger Action */}
            {/* <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-lg text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10 transition-colors group">
              <Ban className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">Revoke Access</span>
                <span className="text-[10px] text-rose-400/70 font-medium">
                  Suspend account immediately
                </span>
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function StatusCard({
  label,
  value,
  trend,
  icon,
  color = "text-blue-500",
}: any) {
  return (
    <Card className="border-none shadow-sm dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {label}
          </p>
          <p className="text-2xl font-black dark:text-white tracking-tighter">
            {value}
          </p>
          <p
            className={`text-[10px] font-bold ${color} flex items-center gap-1`}
          >
            <ChevronRight className="w-3 h-3" /> {trend}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
