"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Activity,
  Save,
  RefreshCcw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Mail,
  Database,
  Terminal,
  ShieldAlert,
  Globe,
  Fingerprint,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import {
  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
} from "@/app/services/features/admin/adminApi";
import GlobalLoader from "@/components/GlobalLoader";

export default function GeneralAdminSettings() {
  const {
    data: remoteSettings,
    isLoading,
    refetch,
  } = useGetGlobalSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateGlobalSettingsMutation();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (remoteSettings) {
      const actualData = remoteSettings?.settings || remoteSettings;
      setFormData({
        siteName: actualData.siteName || "",
        supportEmail: actualData.supportEmail || "",
        investorCodePrefix: actualData.investorCodePrefix || "",
        allowedRegistrations: Boolean(actualData.allowedRegistrations),
        maintenanceMode: Boolean(actualData.maintenanceMode),
        kycAutoApproval: Boolean(actualData.kycAutoApproval),
      });
    }
  }, [remoteSettings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
      toast.success("System configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (isLoading || !formData)
    return (
      <GlobalLoader
        type="settings"
        message="Initializing Environment"
        subtext="Syncing your personalized interface configurations..."
      />
    );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Global Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Control platform availability and onboarding automation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="dark:bg-slate-900 dark:border-slate-800"
            >
              <RefreshCcw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              Sync
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 hover:opacity-90 transition-all"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* --- SYSTEM CRITICAL TOGGLES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Maintenance Mode */}
          <Card
            className={`transition-all border-none shadow-sm ${
              formData?.maintenanceMode
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            }`}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    formData?.maintenanceMode
                      ? "bg-white/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none mb-1">
                    Maintenance
                  </p>
                  <p
                    className={`text-[10px] ${
                      formData?.maintenanceMode
                        ? "text-orange-100"
                        : "text-slate-500"
                    }`}
                  >
                    Admin-only access
                  </p>
                </div>
              </div>
              <Switch
                checked={formData?.maintenanceMode}
                onCheckedChange={(val) =>
                  handleInputChange("maintenanceMode", val)
                }
                className="data-[state=checked]:bg-white data-[state=checked]:dark:bg-white"
              />
            </CardContent>
          </Card>

          {/* Registrations */}
          <ToggleCard
            title="Registrations"
            sub="Public sign-ups"
            icon={Globe}
            checked={formData?.allowedRegistrations}
            onChange={(val) => handleInputChange("allowedRegistrations", val)}
            colorClass="bg-emerald-500"
          />

          {/* KYC Auto-Approval */}
          <ToggleCard
            title="KYC Auto-Approve"
            sub="Instant verification"
            icon={UserCheck}
            checked={formData?.kycAutoApproval}
            onChange={(val) => handleInputChange("kycAutoApproval", val)}
            colorClass="bg-blue-600"
          />
        </div>

        {/* --- CORE DATA FIELDS --- */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 transition-colors">
          <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" /> Identity &
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                  Site Display Name
                </Label>
                <Input
                  value={formData.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  className="bg-slate-50 dark:bg-slate-950 border-none h-12 focus-visible:ring-2 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                  Global Support Email
                </Label>
                <Input
                  value={formData.supportEmail}
                  onChange={(e) =>
                    handleInputChange("supportEmail", e.target.value)
                  }
                  className="bg-slate-50 dark:bg-slate-950 border-none h-12 focus-visible:ring-2 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            <Separator className="opacity-50 dark:bg-slate-800" />

            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                Investor Account Prefix
              </Label>
              <div className="flex max-w-[360px] shadow-sm rounded-md overflow-hidden">
                <div className="px-4 flex items-center bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-500">
                  ID-
                </div>
                <Input
                  value={formData.investorCodePrefix}
                  onChange={(e) =>
                    handleInputChange("investorCodePrefix", e.target.value)
                  }
                  className="rounded-none bg-slate-50 dark:bg-slate-950 border-none h-12 text-slate-900 dark:text-slate-100 font-mono"
                  placeholder="FS"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2 italic">
                <AlertCircle className="w-3 h-3" />
                Example: {formData.investorCodePrefix || "XX"}-2026-VLT
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- METADATA FOOTER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 opacity-60">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3 h-3" />
            <span className="text-[9px] font-mono uppercase tracking-widest">
              DOC_UID: {remoteSettings._id}
            </span>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            Last Synced: {new Date(remoteSettings.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Toggle Card Component for cleaner code
function ToggleCard({
  title,
  sub,
  icon: Icon,
  checked,
  onChange,
  colorClass,
}: any) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-none shadow-sm transition-colors">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex gap-3">
          <div
            className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-opacity-80 transition-all`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none mb-1">{title}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tight font-medium">
              {sub}
            </p>
          </div>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          className={`data-[state=checked]:${colorClass}`}
        />
      </CardContent>
    </Card>
  );
}
