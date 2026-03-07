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

  if (isLoading || !formData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm font-serif italic text-slate-500">
          Syncing System State...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Global Settings
            </h1>
            <p className="text-slate-500 text-sm">
              Control platform availability and onboarding automation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Sync
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-slate-900 text-white  dark:bg-slate-100 dark:text-slate-900   px-6"
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

        {/* --- SYSTEM CRITICAL TOGGLES (Grid of 3) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Maintenance Mode */}
          <Card
            className={`transition-all border-none shadow-sm ${
              formData.maintenanceMode
                ? "bg-orange-50 ring-1 ring-orange-200"
                : "bg-white"
            }`}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    formData.maintenanceMode
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none mb-1">
                    Maintenance
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Admin-only access
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.maintenanceMode}
                onCheckedChange={(val) =>
                  handleInputChange("maintenanceMode", val)
                }
              />
            </CardContent>
          </Card>

          {/* Registrations */}
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none mb-1">
                    Registrations
                  </p>
                  <p className="text-[10px] text-slate-500">Public sign-ups</p>
                </div>
              </div>
              <Switch
                checked={formData.allowedRegistrations}
                onCheckedChange={(val) =>
                  handleInputChange("allowedRegistrations", val)
                }
              />
            </CardContent>
          </Card>

          {/* KYC Auto-Approval */}
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    formData.kycAutoApproval
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none mb-1">
                    KYC Auto-Approve
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Instant verification
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.kycAutoApproval}
                onCheckedChange={(val) =>
                  handleInputChange("kycAutoApproval", val)
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* --- CORE DATA FIELDS --- */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" /> Identity &
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-400 tracking-tight">
                  Site Display Name
                </Label>
                <Input
                  value={formData.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  className="bg-slate-50 border-none h-11 focus-visible:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-400 tracking-tight">
                  Global Support Email
                </Label>
                <Input
                  value={formData.supportEmail}
                  onChange={(e) =>
                    handleInputChange("supportEmail", e.target.value)
                  }
                  className="bg-slate-50 border-none h-11 focus-visible:ring-1"
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase text-slate-400 tracking-tight">
                Investor Account Prefix
              </Label>
              <div className="flex max-w-[320px]">
                <div className="px-4 flex items-center bg-slate-100 rounded-l-md border-r text-[11px] font-mono font-bold text-slate-600">
                  PRE-
                </div>
                <Input
                  value={formData.investorCodePrefix}
                  onChange={(e) =>
                    handleInputChange("investorCodePrefix", e.target.value)
                  }
                  className="rounded-l-none bg-slate-50 border-none h-11"
                  placeholder="FS"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Example: Generated IDs will appear as{" "}
                <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1 rounded">
                  {formData.investorCodePrefix}-XXXX
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- METADATA FOOTER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3 h-3" />
            <span className="text-[10px] font-mono uppercase tracking-tight">
              Doc ID: {remoteSettings._id}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Last Synced: {new Date(remoteSettings.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
