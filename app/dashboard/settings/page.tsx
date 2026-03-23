"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  User as UserIcon,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Trash2,
  ShieldCheck,
  Globe,
  Wallet,
  Check,
  Fingerprint,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import GlobalLoader from "@/components/GlobalLoader";
// Assuming your hook path
import {
  useChangePasswordMutation,
  useGetMeQuery,
} from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: response, isLoading } = useGetMeQuery();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState<
    "account" | "security" | "notifications" | "preferences"
  >("account");

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Local state for form handling
  const [profileData, setProfileData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Sync local state when data arrives from database
  useEffect(() => {
    if (response?.user) {
      setProfileData({ ...response.user.profile });
      setSettingsData({ ...response.user.settings });
    }
  }, [response]);

  const handleSave = () => {
    setIsSaving(true);
    // Here you would call your updateProfile mutation
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1200);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return alert("Please fill in both password fields.");
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      // Success Logic
      setSavedSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to change password:", err);
      alert(
        err.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  if (isLoading || !profileData) {
    return (
      <GlobalLoader
        message="Accessing System Config"
        subtext="Verifying administrative privileges..."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="w-4 h-4 text-primary opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your identity, security protocols, and wealth preferences.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit h-7 px-3 border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-bold uppercase tracking-tighter"
        >
          Level {response?.user.onboardingStep} Authorization
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          <NavButton
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
            icon={<UserIcon className="w-4 h-4" />}
            label="Identity Dossier"
          />
          <NavButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            icon={<Lock className="w-4 h-4" />}
            label="Security & Auth"
          />
          <NavButton
            active={activeTab === "preferences"}
            onClick={() => setActiveTab("preferences")}
            icon={<Settings className="w-4 h-4" />}
            label="Wealth Prefs"
          />
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB: ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <CardTitle className="text-lg font-serif">
                    Personal Identity
                  </CardTitle>
                  <CardDescription>
                    Update your legal credentials as they appear in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Legal First Name"
                      value={profileData.firstName}
                      onChange={(e: any) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="Legal Last Name"
                      value={profileData.lastName}
                      onChange={(e: any) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <InputField
                    label="Verified Email Address"
                    value={profileData.email}
                    type="email"
                    disabled={true} // Usually email is locked or requires a different flow
                    subtext="Contact support to change your primary login email."
                  />
                  <InputField
                    label="Residential Address"
                    value={profileData.address}
                    onChange={(e: any) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-xl px-8 font-bold bg-slate-900 dark:bg-white dark:text-black shadow-xl"
                    >
                      {isSaving ? (
                        "Syncing..."
                      ) : savedSuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Updated
                        </>
                      ) : (
                        "Commit Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-rose-500/[0.02] ring-1 ring-rose-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-rose-500 font-serif">
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-rose-400/70 text-xs">
                    Permanent account deactivation and data purging.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 rounded-xl px-6 font-bold"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Deactivate Identity
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === "security" && (
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-lg font-serif">
                  Security Protocol
                </CardTitle>
                <CardDescription>
                  Manage your authentication layers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 dark:bg-slate-900/10 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white dark:text-slate-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                        Status: Active
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white border-none px-4 rounded-full text-[10px] font-black tracking-widest">
                    SECURE
                  </Badge>
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Update Access Password
                  </h3>

                  <div className="relative">
                    <InputField
                      label="Current Password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e: any) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-10 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <InputField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e: any) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />

                  <Button
                    className="rounded-xl w-full md:w-auto font-bold px-10"
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword
                      ? "Processing..."
                      : savedSuccess
                      ? "Password Updated!"
                      : "Renew Credentials"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB: PREFERENCES */}
          {activeTab === "preferences" && (
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-lg font-serif">
                  Wealth Preferences
                </CardTitle>
                <CardDescription>
                  Customize how you interact with your assets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-blue-500" /> Settlement
                      Currency
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                      value={settingsData.baseCurrency}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          baseCurrency: e.target.value,
                        })
                      }
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Globe className="w-3 h-3 text-emerald-500" /> Interface
                      Language
                    </label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none">
                      <option>English (International)</option>
                      <option>German (DACH)</option>
                      <option>French (FR)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Privacy & Visibility
                  </h3>
                  <ToggleItem
                    title="Show Portfolio Net Worth"
                    description="Toggle visibility of your total balance on the global dashboard."
                    defaultChecked={true}
                  />
                  <ToggleItem
                    title="Performance Leaderboards"
                    description="Allow your percentage gains to be visible to verified peers."
                    defaultChecked={false}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-rose-500/50 animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-rose-500/10 pb-6">
              <CardTitle className="text-rose-500 font-serif flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Confirm Permanent Purge
              </CardTitle>
              <CardDescription className="text-rose-900/60 dark:text-rose-200/60 font-medium pt-2">
                This will erase all record of{" "}
                <span className="font-bold text-rose-600 dark:text-rose-400 underline">
                  {profileData.email}
                </span>
                . Portfolios and history will be lost forever.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Type email to authorize
                </p>
                <Input
                  className="rounded-xl border-rose-100 dark:border-rose-900"
                  placeholder={profileData.email}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl font-bold"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl font-bold bg-rose-500"
                >
                  Purge Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/** * UI SUB-COMPONENTS **/

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-2xl"
          : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ChevronRight
        className={`w-3 h-3 transition-transform ${
          active ? "translate-x-1" : "opacity-0"
        }`}
      />
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  subtext,
}: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-12 px-5 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
      />
      {subtext && (
        <p className="text-[10px] text-slate-400 ml-1 italic">{subtext}</p>
      )}
    </div>
  );
}

function ToggleItem({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {title}
        </p>
        <p className="text-[11px] text-slate-400 font-medium max-w-[300px] leading-relaxed">
          {description}
        </p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function ShieldAlert(props: any) {
  return <ShieldCheck {...props} className="text-rose-500" />;
}
