"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  ShieldCheck,
  ChevronRight,
  Search,
  Clock,
  Check,
  Loader2,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

import {
  useGetKycListQuery,
  useUpdateKycStatusMutation,
} from "@/app/services/features/admin/adminApi";

export default function KYC_Workbench() {
  const { data: usersData, isLoading, isError, refetch } = useGetKycListQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateKycStatusMutation();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATA NORMALIZATION ---
  // Ensure we are working with the 'users' array from your response
  const usersList = useMemo(
    () => (Array.isArray(usersData) ? usersData : []),
    [usersData]
  );

  useEffect(() => {
    if (usersList.length > 0 && !selectedUserId) {
      setSelectedUserId(usersList[0]._id);
    }
  }, [usersList, selectedUserId]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((u: any) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        fullName.includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u._id.includes(search)
      );
    });
  }, [searchTerm, usersList]);

  const selectedUser = useMemo(() => {
    return (
      usersList.find((u: any) => u._id === selectedUserId) ||
      usersList[0] ||
      null
    );
  }, [usersList, selectedUserId]);

  // --- STEPPER MAPPING ---
  // Adjusted to look into the 'documents' object from your response
  const userSteps = useMemo(() => {
    if (!selectedUser) return [];
    return [
      {
        id: 1,
        name: "ID Document",
        // Accessing the first item in the kyc array if it exists
        doc: selectedUser.documents?.kyc?.[0]?.url || null,
        status: selectedUser.documents?.kyc?.[0]?.status || "pending",
        field: "kyc",
      },
      {
        id: 2,
        name: "Proof of Address",
        doc: selectedUser.documents?.address?.[0]?.url || null,
        status: selectedUser.documents?.address?.[0]?.status || "pending",
        field: "address",
      },
      {
        id: 3,
        name: "Selfie Check",
        doc: selectedUser.documents?.selfie?.url || null,
        status: selectedUser.documents?.selfie?.status || "pending",
        field: "selfie",
      },
      {
        id: 4,
        name: "Sanctions/AML",
        doc: null,
        status: "complete",
        field: null,
      },
      {
        id: 5,
        name: "Final Account Status",
        doc: null,
        status: selectedUser.accountStatus,
        field: "accountStatus",
      },
    ];
  }, [selectedUser]);

  const currentStepData = useMemo(
    () => userSteps.find((s: any) => s.id === activeStepId),
    [userSteps, activeStepId]
  );

  const handleApproveStep = async () => {
    if (!selectedUserId || !currentStepData?.field) return;
    try {
      await updateStatus({
        id: selectedUserId,
        status: "approved",
        field: currentStepData.field,
      }).unwrap();
      toast.success(`${currentStepData.name} approved`);
      if (activeStepId < userSteps.length) setActiveStepId((prev) => prev + 1);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading)
    return (
      <GlobalLoader
        message="Accessing KYC Records"
        subtext="Scanning user documents..."
      />
    );

    
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif italic">
              KYC Workbench
            </h1>
            <p className="text-sm text-slate-500">
              Agent view for{" "}
              <span className="font-bold text-blue-600 underline">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="dark:bg-slate-900"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Sync Data
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QUEUE SIDEBAR */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search candidates..."
                className="pl-9 bg-white dark:bg-slate-900 border-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card className="border-none shadow-sm dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {filteredUsers.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setActiveStepId(1);
                    }}
                    className={`p-4 border-b dark:border-slate-800 cursor-pointer transition-all 
                      ${
                        selectedUserId === user._id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold truncate pr-2">
                        {user.firstName} {user.lastName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          user.accountStatus === "pending"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {user.accountStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>ID: {user._id.slice(-6).toUpperCase()}</span>
                      <span>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="lg:col-span-9 space-y-6">
            {/* STEPPER BAR */}
            <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-x-auto">
              {userSteps.map((step: any) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 shrink-0 rounded-lg transition-all
                    ${
                      activeStepId === step.id
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50"
                    }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${
                      step.status === "approved" || step.status === "complete"
                        ? "bg-emerald-500 text-white"
                        : activeStepId === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step.status === "approved" ||
                    step.status === "complete" ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      activeStepId === step.id
                        ? "text-blue-600"
                        : "text-slate-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* INSPECTION AREA */}
              <Card className="xl:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3 flex flex-row justify-between items-center">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                    <FileText className="w-4 h-4 text-blue-600" />{" "}
                    {currentStepData?.name} Inspection
                  </CardTitle>
                  <Badge className="capitalize text-[10px]">
                    {currentStepData?.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center justify-center min-h-[450px] bg-slate-50/30 dark:bg-slate-900/50">
                  {currentStepData?.doc ? (
                    <div className="text-center group">
                      <div className="relative bg-white dark:bg-slate-800 p-2 shadow-2xl rounded-lg border dark:border-slate-700">
                        <img
                          src={currentStepData.doc}
                          alt="Verification Document"
                          className="max-h-[380px] object-contain rounded transition-transform group-hover:scale-[1.02]"
                        />
                      </div>
                      <p className="mt-4 text-[10px] text-slate-400 font-mono italic">
                        Source: {currentStepData.doc.split("/").pop()}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 opacity-40">
                      <AlertTriangle className="w-12 h-12 mx-auto text-slate-400" />
                      <p className="text-sm font-medium">
                        No document uploaded for this stage.
                      </p>
                    </div>
                  )}
                </CardContent>
                <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex justify-between">
                  <Button
                    variant="ghost"
                    className="text-xs text-rose-500 hover:bg-rose-100"
                  >
                    Flag for Revision
                  </Button>
                  <Button
                    disabled={
                      isUpdating ||
                      !currentStepData?.field ||
                      currentStepData?.status === "approved"
                    }
                    onClick={handleApproveStep}
                    className="bg-slate-900 dark:bg-blue-600 text-white px-8 h-10 shadow-lg"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Approve ${currentStepData?.name}`
                    )}
                  </Button>
                </div>
              </Card>

              {/* USER INFO PANEL */}
              <div className="space-y-6">
                <Card className="border-none shadow-lg dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader className="pb-2 border-b dark:border-slate-800">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />{" "}
                      Verification Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <DataRow
                      label="Legal First Name"
                      value={selectedUser?.firstName}
                    />
                    <DataRow
                      label="Legal Last Name"
                      value={selectedUser?.lastName}
                    />
                    <DataRow
                      label="Email Address"
                      value={selectedUser?.email}
                    />
                    <DataRow
                      label="Onboarding Step"
                      value={selectedUser?.onboardingStep?.toString()}
                    />

                    <div className="p-3 rounded-xl border bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50 mt-4">
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase mb-1">
                        Compliance Status
                      </p>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 italic">
                        {selectedUser?.kycVerified
                          ? "This user has already passed basic KYC."
                          : "Awaiting manual verification of uploaded credentials."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
        {label}
      </p>
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
        {value || "---"}
      </p>
    </div>
  );
}
