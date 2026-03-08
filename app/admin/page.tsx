"use client";

import React, { useMemo } from "react";
import {
  BarChart3,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  Activity,
  Globe,
  Zap,
  Filter,
  Calendar,
  RefreshCw,
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

  console.log("Admin Overview Data:", overview); // Debug log to inspect API response

  // Mapping API data to local variables for cleaner JSX
  const stats = overview?.stats || {};
  const activities = overview?.recentActivity || [];
  const growth = overview?.regionalGrowth || [];

  if (isLoading)
    return (
      <GlobalLoader
        message="Booting Command Center..."
        subtext="Syncing strategic data..."
      />
    );

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. TOP UTILITY BAR (System Health) */}
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
            API Latency: {overview?.system?.latency || "24ms"}
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
            />{" "}
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
            Real-time performance metrics for FS Group ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-[10px]"
          >
            <Calendar className="mr-2 h-3 w-3" />{" "}
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Button>
          <Button
            size="sm"
            className="bg-slate-900 dark:bg-blue-600 hover:opacity-90 text-white shadow-lg text-[10px] font-bold uppercase"
          >
            <Plus className="mr-2 h-3 w-3" /> Create Manual Entry
          </Button>
        </div>
      </div>

      {/* 3. PRIMARY KPI GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications?.value || "0"}
          change={stats.totalApplications?.change || "0%"}
          trend={stats.totalApplications?.trend || "up"}
          icon={<Users className="h-4 w-4" />}
          color="primary"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview?.value || "0"}
          change={stats.pendingReview?.change || "0%"}
          trend={stats.pendingReview?.trend || "down"}
          icon={<Clock className="h-4 w-4" />}
          color="amber"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate?.value || "0"}%`}
          change={stats.conversionRate?.change || "0%"}
          trend={stats.conversionRate?.trend || "up"}
          icon={<ShieldCheck className="h-4 w-4" />}
          color="emerald"
        />
        <StatCard
          title="Risk Alerts"
          value={stats.riskAlerts?.value || "0"}
          change={stats.riskAlerts?.change || "0"}
          trend={stats.riskAlerts?.trend || "up"}
          icon={<AlertCircle className="h-4 w-4" />}
          color="rose"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* 4. MAIN ANALYTICS */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-serif italic">
                  Application Velocity
                </CardTitle>
                <CardDescription className="text-xs">
                  Visualizing user intake momentum.
                </CardDescription>
              </div>
              <Tabs defaultValue="7d">
                <TabsList className="h-8 bg-slate-100 dark:bg-slate-800">
                  <TabsTrigger value="7d" className="text-[10px] font-bold">
                    7D
                  </TabsTrigger>
                  <TabsTrigger value="30d" className="text-[10px] font-bold">
                    30D
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-t border-slate-100 dark:border-slate-800">
              <div className="text-center space-y-2 opacity-30">
                <BarChart3 className="h-12 w-12 mx-auto" />
                <p className="text-[10px] font-mono italic">
                  Telemetry Chart Initializing...
                </p>
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
                  Policy Hub
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Review 2026 Regulatory updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  className="w-full text-xs font-bold uppercase tracking-widest bg-white text-slate-900"
                >
                  Open Guidelines
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Verification Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Identity Sync (Auto)</span>
                  <span className="text-emerald-500">
                    {overview?.progress?.identity || 88}%
                  </span>
                </div>
                <Progress
                  value={overview?.progress?.identity || 88}
                  className="h-1 bg-slate-100 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] font-bold uppercase pt-2">
                  <span>AML Screening</span>
                  <span className="text-blue-500">
                    {overview?.progress?.aml || 65}%
                  </span>
                </div>
                <Progress
                  value={overview?.progress?.aml || 65}
                  className="h-1 bg-slate-100 dark:bg-slate-800"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. SIDEBAR */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-slate-800 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-tighter">
                Activity Stream
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 border-none"
              >
                Live
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activities.length > 0 ? (
                  activities.map((item: any, idx: number) => (
                    <ActivityItem
                      key={idx}
                      name={item.user}
                      action={item.action}
                      time={item.time}
                      initials={item.user
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                      color={
                        item.type === "error"
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-blue-500/10 text-blue-600"
                      }
                    />
                  ))
                ) : (
                  <p className="p-4 text-xs text-center text-slate-500 italic">
                    No recent logs found.
                  </p>
                )}
              </div>
            </CardContent>
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30">
              <Button
                variant="ghost"
                className="w-full text-[10px] font-bold uppercase text-slate-500"
              >
                View Audit Trail
              </Button>
            </div>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Regional Momentum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growth.map((reg: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span className="text-xs font-medium">{reg.region}</span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      reg.trend === "up" ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {reg.trend === "up" ? "+" : "-"}
                    {reg.value}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function StatCard({ title, value, change, trend, icon, color }: any) {
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
        <div
          className={`flex items-center text-[10px] mt-2 font-bold uppercase ${
            trend === "up" ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {change}{" "}
          <span className="ml-1 text-slate-400 font-normal italic lowercase">
            vs prev. month
          </span>
        </div>
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
