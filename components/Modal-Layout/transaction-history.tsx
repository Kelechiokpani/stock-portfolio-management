"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CashMovementTabs({
  movements,
  currency,
}: {
  movements: any[];
  currency: string;
}) {
  const deposits = useMemo(
    () => movements.filter((m) => m.type === "deposit"),
    [movements]
  );

  const withdrawals = useMemo(
    () => movements.filter((m) => m.type === "withdrawal"),
    [movements]
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-DE", { style: "currency", currency }).format(val);

  return (
    <Card className="border-none bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
      <Tabs defaultValue="deposits" className="w-full">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-0">
          <TabsList className="w-full h-16 bg-transparent p-0 flex rounded-none">
            <TabsTrigger
              value="deposits"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-white data-[state=active]:bg-slate-50/50 dark:data-[state=active]:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Inbound Ledger
                </span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-800"
                >
                  {deposits.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-white data-[state=active]:bg-slate-50/50 dark:data-[state=active]:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Outbound Ledger
                </span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-800"
                >
                  {withdrawals.length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-0">
          <TabsContent value="deposits" className="m-0">
            <MovementTable data={deposits} format={formatCurrency} />
          </TabsContent>
          <TabsContent value="withdrawals" className="m-0">
            <MovementTable data={withdrawals} format={formatCurrency} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function MovementTable({ data, format }: { data: any[]; format: any }) {
  if (data.length === 0)
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <FileText className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          No activity found
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-white/5">
            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Date / ID
            </th>
            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Class
            </th>
            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Method
            </th>
            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Status
            </th>
            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr
              key={m.id}
              className="group border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
            >
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {new Date(m.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    REF: {m.id.slice(-8)}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6">
                <TypeBadge type={m.type} />
              </td>
              <td className="px-8 py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  {m.method}
                </span>
              </td>
              <td className="px-8 py-6">
                <StatusIndicator status={m.status} />
              </td>
              <td className="px-8 py-6 text-right">
                <span
                  className={`text-sm font-mono font-black tracking-tighter ${
                    m.type === "deposit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {m.type === "deposit" ? "+" : "-"}
                  {format(m.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const isDeposit = type === "deposit";
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${
        isDeposit
          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
          : "border-rose-500/20 bg-rose-500/5 text-rose-600"
      }`}
    >
      {isDeposit ? (
        <ArrowDownLeft className="w-3 h-3" />
      ) : (
        <ArrowUpRight className="w-3 h-3" />
      )}
      <span className="text-[9px] font-black uppercase tracking-widest">
        {type}
      </span>
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const configs: any = {
    completed: {
      color: "text-slate-900 dark:text-white",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
      text: "Settled",
    },
    pending: {
      color: "text-amber-500 bg-amber-500/10",
      icon: <Clock className="w-3 h-3" />,
      text: "Pending",
    },
    failed: {
      color: "text-rose-500 bg-rose-500/10",
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Declined",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.color}`}
    >
      {config.icon}
      <span className="text-[9px] font-black uppercase tracking-widest">
        {config.text}
      </span>
    </div>
  );
}
