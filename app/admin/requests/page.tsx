"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  FileText,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

import {
  useGetAccountRequestsQuery,
  useReviewRequestMutation,
} from "@/app/services/features/admin/adminApi";

export default function AdminAccountRequests() {
  const { data: response, isLoading, refetch } = useGetAccountRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] =
    useReviewRequestMutation();

  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATA NORMALIZATION ---
  // Your API returns { requests: [...] }, so we extract that array specifically.
  const requestsList = useMemo(() => response?.requests || [], [response]);

  useEffect(() => {
    if (requestsList.length > 0 && !selectedReqId) {
      setSelectedReqId(requestsList[0]._id);
    }
  }, [requestsList, selectedReqId]);

  const filteredRequests = useMemo(() => {
    return requestsList.filter((req: any) => {
      const fullName = `${req.firstName} ${req.lastName}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        fullName.includes(search) ||
        req.email?.toLowerCase().includes(search) ||
        req._id?.includes(search)
      );
    });
  }, [searchTerm, requestsList]);

  const selectedReq = useMemo(() => {
    return (
      requestsList.find((req: any) => req._id === selectedReqId) ||
      requestsList[0]
    );
  }, [requestsList, selectedReqId]);

  // --- HANDLERS ---
  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedReqId) return;
    try {
      await reviewRequest({ id: selectedReqId, action }).unwrap();
      toast.success(`Request ${action}ed successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  if (isLoading)
    return (
      <GlobalLoader
        message="Syncing Requests"
        subtext="Accessing vault applications..."
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif italic">
              Account Requests
            </h1>
            <p className="text-muted-foreground text-sm">
              Viewing{" "}
              <span className="text-primary font-bold">
                {filteredRequests.length}
              </span>{" "}
              results.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="dark:bg-slate-900"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Sync Queue
          </Button>
        </div>

        {/* ANALYTICS */}
        <div className="grid gap-4 md:grid-cols-4">
          <MiniStat
            label="Total Requests"
            value={response?.pagination?.total || "0"}
            sub="All time"
            icon={<FileText className="h-4 w-4 text-blue-500" />}
          />
          <MiniStat
            label="Pending"
            value={requestsList
              .filter((r: any) => r.status === "pending")
              .length.toString()}
            sub="Needs Review"
            icon={<Clock className="h-4 w-4 text-amber-500" />}
          />
          <MiniStat
            label="System Status"
            value="Secure"
            sub="API Online"
            icon={<UserCheck className="h-4 w-4 text-emerald-500" />}
          />
          <MiniStat
            label="Encryption"
            value="AES-256"
            sub="Active"
            icon={<ShieldAlert className="h-4 w-4 text-rose-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAIN LIST */}
          <Card className="lg:col-span-8 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader className="border-b dark:border-slate-800 p-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by name or email..."
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 z-20">
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req: any) => (
                    <TableRow
                      key={req._id}
                      onClick={() => setSelectedReqId(req._id)}
                      className={`cursor-pointer ${
                        selectedReqId === req._id
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">
                            {req.firstName} {req.lastName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {req.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusStyles(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>

          {/* INSPECTION PANEL */}
          {selectedReq && (
            <Card className="lg:col-span-4 border-none shadow-2xl bg-white dark:bg-slate-900 sticky top-8 h-fit ring-1 ring-slate-100">
              <div className="h-1.5 w-full bg-amber-500" />
              <CardHeader>
                <CardTitle className="font-serif italic">
                  {selectedReq.firstName} {selectedReq.lastName}
                </CardTitle>
                <CardDescription className="text-[10px] font-mono">
                  ID: {selectedReq._id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <InfoBox
                    label="Email"
                    value={selectedReq.email}
                    icon={<Mail className="h-3 w-3 pt-4 " />}
                  />
                  <InfoBox
                    label="Phone"
                    value={selectedReq.phone}
                    icon={<Phone className="h-3 w-3 pt-8s " />}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Message/Note
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed text-xs italic">
                    "{selectedReq.message || "No message provided."}"
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAction("approve")}
                      disabled={
                        isReviewing || selectedReq.status === "approved"
                      }
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12"
                    >
                      {isReviewing ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      onClick={() => handleAction("reject")}
                      disabled={
                        isReviewing || selectedReq.status === "rejected"
                      }
                      variant="outline"
                      className="flex-1 border-rose-200 text-rose-600 h-12"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components remain the same as your design
function MiniStat({ label, value, sub, icon }: any) {
  return (
    <Card className="border-none shadow-sm dark:bg-slate-900/50">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-2xl font-black mt-1">{value}</p>
          <p className="text-[10px] text-emerald-500 font-medium">{sub}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBox({ label, value, icon }: any) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
      <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 mb-1">
        {icon} {label}
      </p>
      <p className="text-xs font-semibold truncate">{value}</p>
    </div>
  );
}

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
    case "rejected":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50";
    case "pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};
