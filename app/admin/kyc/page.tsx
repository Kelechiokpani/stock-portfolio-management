"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Check,
  Loader2,
  RefreshCcw,
  MapPin,
  Mail,
  User,
  Fingerprint,
  Clock,
  Calendar,
  Hash,
  Activity,
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
  const { data: usersData, isLoading, refetch } = useGetKycListQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateKycStatusMutation();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  // --- COMPREHENSIVE DATA MAPPING ---
  const userSteps = useMemo(() => {
    if (!selectedUser) return [];

    const kycDoc = selectedUser.documents?.kyc?.[0];
    const addrDoc = selectedUser.documents?.address?.[0];

    return [
      {
        id: 1,
        name: "Identity Verification",
        type: kycDoc?.documentType || "Not Provided",
        docs: kycDoc
          ? [kycDoc.frontPageUrl, kycDoc.backPageUrl].filter(Boolean)
          : [],
        status: kycDoc?.status || "missing",
        field: "kyc",
        rawData: kycDoc,
      },
      {
        id: 2,
        name: "Proof of Address",
        type: addrDoc?.poaDocumentType?.replace("_", " ") || "Not Provided",
        docs: addrDoc?.poaDocumentUrl ? [addrDoc.poaDocumentUrl] : [],
        status: addrDoc?.status || "missing",
        field: "address",
        rawData: addrDoc,
      },
    ];
  }, [selectedUser]);

  const currentStepData = useMemo(
    () => userSteps.find((s: any) => s.id === activeStepId),
    [userSteps, activeStepId]
  );

  const handleApproveStep = async () => {
    if (!selectedUserId) return;
    try {
      const isFinal = activeStepId === 2;
      const payload = isFinal
        ? { kycVerified: true, accountStatus: "active", status: "approved" }
        : { status: "approved", field: currentStepData?.field };

      await updateStatus({ id: selectedUserId, ...payload }).unwrap();
      toast.success(`${currentStepData?.name} approved`);
      if (activeStepId < userSteps.length) setActiveStepId((prev) => prev + 1);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (isLoading)
    return <GlobalLoader message="Accessing Compliance Database..." />;

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-slate-950 p-4 lg:p-6">
      <div className="mx-auto max-w-[1750px] space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                KYC Workbench
              </h1>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                KYC
              </Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Reviewing: {selectedUser?.firstName} {selectedUser?.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: QUEUE */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search candidates..."
                className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
              <ScrollArea className="h-[calc(200vh-20px)]">
                {filteredUsers.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setActiveStepId(1);
                    }}
                    className={`p-4 cursor-pointer transition-all border-b last:border-0 
                      ${
                        selectedUserId === user._id
                          ? "bg-blue-50/50 border-r-4 border-r-blue-600"
                          : "hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {user.firstName} {user.lastName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          user.accountStatus === "active"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {user.accountStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 truncate font-mono">
                      {user._id}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </div>

          {/* MIDDLE: INSPECTOR */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {userSteps.map((step: any) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all text-left
                    ${
                      activeStepId === step.id
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-transparent bg-white shadow-sm"
                    }`}
                >
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Step 0{step.id}
                  </p>
                  <p className="text-xs font-bold text-slate-700 truncate">
                    {step.name}
                  </p>
                </button>
              ))}
            </div>

            <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col bg-white">
              <CardHeader className="border-b px-8 py-5 flex flex-row justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {activeStepId}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {currentStepData?.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-medium capitalize">
                      {currentStepData?.type}
                    </p>
                  </div>
                </div>
                <Badge className="bg-slate-900 text-white rounded-lg px-3 py-1">
                  {currentStepData?.status}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 p-8 bg-slate-100/50 flex flex-col items-center justify-center">
                {currentStepData?.docs && currentStepData.docs.length > 0 ? (
                  <div
                    className={`grid gap-6 w-full ${
                      currentStepData.docs.length > 1
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {currentStepData.docs.map((url: string, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <div className="aspect-[4/3] bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden group">
                          <img
                            src={url}
                            alt="KYC"
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in"
                          />
                        </div>
                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {idx === 0 ? "Front Page" : "Back Page"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      Document assets are missing for this user.
                    </p>
                  </div>
                )}
              </CardContent>

              <div className="p-6 border-t bg-white flex justify-between items-center">
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Flag as Fraud
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-xl px-6">
                    Reject
                  </Button>
                  <Button
                    onClick={handleApproveStep}
                    disabled={
                      isUpdating ||
                      (currentStepData?.docs?.length === 0 &&
                        activeStepId !== 3) ||
                      currentStepData?.status === "approved" ||
                      currentStepData?.status === "active"
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl h-12 font-bold shadow-lg shadow-blue-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none transition-all"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        {currentStepData?.status === "approved" ||
                        currentStepData?.status === "active" ? (
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" /> Approved
                          </span>
                        ) : (
                          "Verify & Approve"
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* RIGHT: DATA SUMMARY */}
            <div className="lg:col-span-3 space-y-8">
              <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="bg-slate-900 p-6 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">
                    Core Identity
                  </p>
                  <div className="space-y-4">
                    <DataRow
                      icon={<User size={14} />}
                      label="Legal Name"
                      value={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                      invert
                    />
                    <DataRow
                      icon={<Mail size={14} />}
                      label="Email Address"
                      value={selectedUser?.email}
                      invert
                    />
                    <DataRow
                      icon={<Hash size={14} />}
                      label="User ID"
                      value={selectedUser?._id}
                      invert
                    />
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">
                      Onboarding Progress
                    </p>
                    <div className="space-y-4">
                      <DataRow
                        icon={<Activity size={14} />}
                        label="Current Step"
                        value={`Step ${selectedUser?.onboardingStep}`}
                      />
                      <DataRow
                        icon={<Check size={14} />}
                        label="KYC Verified"
                        value={selectedUser?.kycVerified ? "YES" : "NO"}
                      />
                      <DataRow
                        icon={<Calendar size={14} />}
                        label="Member Since"
                        value={new Date(
                          selectedUser?.createdAt || ""
                        ).toLocaleDateString()}
                      />
                    </div>
                  </div>

                  {/* ADDRESS METADATA FROM JSON */}
                  {selectedUser?.documents?.address?.[0] && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">
                        Residential Data
                      </p>
                      <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                        <div className="flex gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                          <p className="text-xs font-bold leading-relaxed">
                            {selectedUser.documents.address[0].streetAddress}{" "}
                            {selectedUser.documents.address[0].houseNumber},
                            <br />
                            {selectedUser.documents.address[0].city},{" "}
                            {selectedUser.documents.address[0].zipCode}
                            <br />
                            {selectedUser.documents.address[0].country}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENT METADATA */}
                  {currentStepData?.rawData && (
                    <div className="pt-4 border-t">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                        Audit Logs
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-bold">
                            UPLOADED
                          </span>
                          <span className="text-slate-600 font-mono">
                            {new Date(
                              currentStepData.rawData.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-bold">
                            DOC ID
                          </span>
                          <span className="text-slate-600 font-mono">
                            {currentStepData.rawData._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataRow({
  label,
  value,
  icon,
  invert = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  invert?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${invert ? "text-blue-400" : "text-blue-600"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[9px] font-black uppercase tracking-widest ${
            invert ? "text-white/40" : "text-slate-400"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-sm font-bold truncate ${
            invert ? "text-white" : "text-slate-800"
          }`}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}
