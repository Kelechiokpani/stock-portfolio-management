"use client";

import React from "react";
import {
  BarChart3,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Plus,
  Activity,
  Globe,
  Zap,
  Calendar,
  RefreshCw,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import GlobalLoader from "@/components/GlobalLoader";

// Import your API hook
import { useGetAdminOverviewQuery } from "@/app/services/features/admin/adminApi";

export default function AdminOverview() {
  const {
    data: overview,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminOverviewQuery();

  // Mapping the specific JSON structure provided
  const stats = overview?.stats || {};
  const recentUsers = overview?.latestUsers || [];
  const kycSubmissions = overview?.recentKycSubmissions || [];

  if (isLoading)
    return (
      <GlobalLoader
        message="Booting Command Center..."
        subtext="Syncing strategic data..."
      />
    );

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. TOP UTILITY BAR */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            Systems: Operational
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-800">
          <Activity className="h-3 w-3 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            Active Users: {stats.activeUsers || 0}
          </span>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-4">
          <span className="text-[10px] text-slate-400 font-mono italic">
            Refreshed: {new Date().toLocaleTimeString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-[10px] uppercase font-bold tracking-tighter"
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${isFetching ? "animate-spin" : ""}`}
            />
            Re-sync API
          </Button>
        </div>
      </div>

      {/* 2. HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif italic">
            Admin Command Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Overview for {stats.totalUsers || 0} registered investors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-900 font-bold text-[10px]"
          >
            <Calendar className="mr-2 h-3 w-3" />{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Button>
        </div>
      </div>

      {/* 3. PRIMARY KPI GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || "0"}
          subtext="Total platform reach"
          icon={<Users className="h-4 w-4" />}
          color="primary"
        />
        <StatCard
          title="Pending KYC"
          value={stats.pendingKyc || "0"}
          subtext="Submissions awaiting review"
          icon={<ShieldCheck className="h-4 w-4" />}
          color="amber"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests || "0"}
          subtext="Active withdrawal/buy orders"
          icon={<Clock className="h-4 w-4" />}
          color="rose"
        />
        <StatCard
          title="Total Stocks"
          value={stats.totalStocks || "0"}
          subtext="Approved market assets"
          icon={<TrendingUp className="h-4 w-4" />}
          color="emerald"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* 4. MAIN ANALYTICS & RECENT USERS */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-serif italic">
                  Latest User Registrations
                </CardTitle>
                <CardDescription className="text-xs">
                  Newest investors onboarded today.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-[9px] uppercase bg-emerald-500/10 text-emerald-500 border-none">
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-none shadow-sm bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-serif italic">
                  System Pulse
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Investors currently in onboarding: {stats.onboardingUsers}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={(stats.activeUsers / stats.totalUsers) * 100}
                  className="h-1 bg-slate-700 mb-4"
                />
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Platform Activity:{" "}
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Verification Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>KYC Pending Review</span>
                  <span className="text-amber-500">
                    {stats.pendingKyc} Users
                  </span>
                </div>
                <Progress
                  value={(stats.pendingKyc / stats.totalUsers) * 100}
                  className="h-1 bg-slate-100 dark:bg-slate-800"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. SIDEBAR (KYC SUBMISSIONS) */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-slate-800 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-tighter">
                Recent KYC Submissions
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-500 border-none"
              >
                Review
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {kycSubmissions.length > 0 ? (
                  kycSubmissions.map((kyc: any) => (
                    <ActivityItem
                      key={kyc._id}
                      name={`${kyc.userId.firstName} ${kyc.userId.lastName}`}
                      action={`Submitted ${kyc.documentType}`}
                      time={new Date(kyc.createdAt).toLocaleDateString()}
                      initials={
                        kyc.userId.firstName[0] + kyc.userId.lastName[0]
                      }
                      color="bg-amber-500/10 text-amber-600"
                    />
                  ))
                ) : (
                  <p className="p-4 text-xs text-center text-slate-500 italic">
                    No pending submissions.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function StatCard({ title, value, subtext, icon, color }: any) {
  const colorMap: any = {
    primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
    amber:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
    emerald:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight font-mono italic">
          {value}
        </div>
        <p className="text-[10px] mt-2 font-bold uppercase text-slate-500 italic">
          {subtext}
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ name, action, time, initials, color }: any) {
  return (
    <div className="flex gap-4 items-center group cursor-pointer p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center font-black text-[10px] flex-shrink-0 shadow-sm ${color}`}
      >
        {initials}
      </div>
      <div className="space-y-0.5 flex-1">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {name}
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {action}
        </p>
      </div>
      <div className="text-[10px] text-slate-400 font-mono italic">{time}</div>
    </div>
  );
}
