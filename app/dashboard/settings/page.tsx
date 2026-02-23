"use client"

import React, { useState, useEffect } from "react"
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
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { mockUsers } from "@/components/data/user-data"



export default function SettingsPage() {
  const user = mockUsers[0]
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications" | "preferences">("account")
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  // Local state initialized with user data
  const [profileData, setProfileData] = useState({ ...user.profile })
  const [settingsData, setSettingsData] = useState({ ...user.settings })

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 800)
  }

  return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">

        {/* Header */}
        <header className="border-b border-border/40 pb-6">
          <h1 className="text-3xl font-serif font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Manage your identity, security protocols, and platform preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Navigation Sidebar */}
          <aside className="space-y-1">
            <NavButton
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
                icon={<UserIcon className="w-4 h-4" />}
                label="Account Profile"
            />
            <NavButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                icon={<Lock className="w-4 h-4" />}
                label="Security & Auth"
            />
            <NavButton
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
                icon={<Bell className="w-4 h-4" />}
                label="Notifications"
            />
            <NavButton
                active={activeTab === "preferences"}
                onClick={() => setActiveTab("preferences")}
                icon={<Settings className="w-4 h-4" />}
                label="Preferences"
            />
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* TAB: ACCOUNT */}
            {activeTab === "account" && (
                <div className="space-y-6">
                  <Card className="border-muted/40 bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-serif">Personal Information</CardTitle>
                      <CardDescription>Update your public identity and contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="First Name"
                            value={profileData.firstName}
                            onChange={(e:any) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                        <InputField
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={(e:any) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                      <InputField
                          label="Email Address"
                          value={profileData.email}
                          type="email"
                          onChange={(e:any) => setProfileData({...profileData, email: e.target.value})}
                      />
                      <InputField
                          label="Residential Address"
                          value={profileData.address}
                          onChange={(e:any) => setProfileData({...profileData, address: e.target.value})}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
                          {isSaving ? "Syncing..." : savedSuccess ? <><Check className="w-4 h-4 mr-2"/> Saved</> : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardHeader>
                      <CardTitle className="text-lg text-red-500 font-serif">Danger Zone</CardTitle>
                      <CardDescription className="text-red-400/70">Irreversible actions regarding your wealth data.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                      <Button variant="destructive" onClick={() => setShowConfirmDelete(true)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Deactivate Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === "security" && (
                <Card className="border-muted/40 bg-card/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Security Protocol</CardTitle>
                    <CardDescription>Manage your authentication methods and session security.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-emerald-500 opacity-80" />
                        <div>
                          <p className="font-bold text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Added security for your withdrawals and sensitive actions.</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3">Active</Badge>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Update Password</h3>
                      <div className="relative">
                        <InputField label="Current Password" type={showPassword ? "text" : "password"} />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </button>
                      </div>
                      <InputField label="New Password" type={showPassword ? "text" : "password"} />
                    </div>
                    <Button onClick={handleSave}>Update Credentials</Button>
                  </CardContent>
                </Card>
            )}

            {/* TAB: PREFERENCES */}
            {activeTab === "preferences" && (
                <Card className="border-muted/40 bg-card/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Platform Preferences</CardTitle>
                    <CardDescription>Customize your wealth management experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                          <Wallet className="w-3 h-3"/> Base Currency
                        </label>
                        <select
                            className="w-full bg-secondary/50 border border-border rounded-lg p-2 text-sm focus:ring-1 ring-primary"
                            value={settingsData.baseCurrency}
                            onChange={(e) => setSettingsData({...settingsData, baseCurrency: e.target.value})}
                        >
                          <option value="EUR">Euro (€)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                          <Globe className="w-3 h-3"/> Language
                        </label>
                        <select className="w-full bg-secondary/50 border border-border rounded-lg p-2 text-sm">
                          <option>English (UK)</option>
                          <option>German (DE)</option>
                          <option>French (FR)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Privacy Controls</h3>
                      <ToggleItem title="Public Portfolio Value" description="Allow other verified users to see your total balance." />
                      <ToggleItem title="Performance Sharing" description="Show your percentage gains on global leaderboards." />
                    </div>
                  </CardContent>
                </Card>
            )}

          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full border-red-500/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-red-500">Confirm Deletion</CardTitle>
                  <CardDescription>
                    This will permanently erase all data for <span className="font-bold text-foreground">{user.profile.email}</span>.
                    All portfolios, history, and connected accounts will be purged.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputField label="Type your email to confirm" placeholder={user.profile.email} />
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
                    <Button variant="destructive" className="flex-1">Permanently Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}
      </div>
  )
}

/** * UI SUB-COMPONENTS **/

function NavButton({ active, onClick, icon, label }: any) {
  return (
      <button
          onClick={onClick}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
      >
        {icon}
        {label}
      </button>
  )
}

function InputField({ label, value, onChange, type = "text", placeholder }: any) {
  return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
          {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-secondary/40 border border-border/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
        />
      </div>
  )
}

function ToggleItem({ title, description }: { title: string, description: string }) {
  return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
        <div className="space-y-0.5">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-muted-foreground max-w-[250px]">{description}</p>
        </div>
        <Switch /> {/* Replaces the manual button for a cleaner Look */}
      </div>
  )
}

// 'use client'
//
// import React, { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import {
//   Settings,
//   User,
//   Lock,
//   Bell,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   Save,
//   Sun,
//   Moon, LogOut, Trash2,
// } from "lucide-react"
// import { useTheme } from "@/lib/theme-provider"
//
// export default function SettingsPage() {
//   const [activeTab, setActiveTab] =
//       useState<"account" | "security" | "notifications" | "preferences">("account")
//   const [showPassword, setShowPassword] = useState(false)
//   const [saved, setSaved] = useState(false)
//   const { theme, toggleTheme, mounted } = useTheme()
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false)
//
//
//   const [formData, setFormData] = useState({
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     country: "United States",
//     timezone: "EST (UTC-5)",
//   })
//
//   const [securityData, setSecurityData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//     twoFactorEnabled: true,
//   })
//
//   const [notificationSettings, setNotificationSettings] = useState({
//     emailNotifications: true,
//     portfolioUpdates: true,
//   })
//
//   const handleInputChange = (
//       e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }
//
//   const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setSecurityData((prev) => ({ ...prev, [name]: value }))
//   }
//
//   const handleNotificationToggle = (
//       key: keyof typeof notificationSettings
//   ) => {
//     setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }))
//   }
//
//   const handleSave = () => {
//     setSaved(true)
//     setTimeout(() => setSaved(false), 3000)
//   }
//
//   return (
//       <div className="min-h-screen bg-background pb-20">
//
//         {/* Save Notification */}
//         {saved && (
//             <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-green-500/20 border border-green-500/30 rounded-lg p-4 z-50">
//               <p className="text-sm font-medium text-green-400">
//                 Settings saved successfully
//               </p>
//             </div>
//         )}
//
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//
//             {/* Sidebar (Desktop) */}
//             <aside className="hidden lg:block space-y-2 sticky top-24">
//               {[
//                 { key: "account", icon: User, label: "Account" },
//                 { key: "security", icon: Lock, label: "Security" },
//                 { key: "notifications", icon: Bell, label: "Notifications" },
//                 { key: "preferences", icon: Settings, label: "Preferences" },
//               ].map(({ key, icon: Icon, label }) => (
//                   <button
//                       key={key}
//                       onClick={() => setActiveTab(key as any)}
//                       className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
//                           activeTab === key
//                               ? "bg-primary text-primary-foreground"
//                               : "hover:bg-secondary"
//                       }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     {label}
//                   </button>
//               ))}
//             </aside>
//
//             {/* Mobile Tabs */}
//             <div className="lg:hidden flex gap-2 overflow-x-auto pb-4">
//               {[
//                 { key: "account", icon: User, label: "Account" },
//                 { key: "security", icon: Lock, label: "Security" },
//                 { key: "notifications", icon: Bell, label: "Notifications" },
//                 { key: "preferences", icon: Settings, label: "Preferences" },
//               ].map(({ key, icon: Icon, label }) => (
//                   <button
//                       key={key}
//                       onClick={() => setActiveTab(key as any)}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap font-medium transition ${
//                           activeTab === key
//                               ? "bg-primary text-primary-foreground"
//                               : "bg-secondary"
//                       }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     {label}
//                   </button>
//               ))}
//             </div>
//
//             {/* Content */}
//             <div className="lg:col-span-3 space-y-6">
//
//               {/* ACCOUNT */}
//               {activeTab === "account" && (
//                   <div>
//                     <Card className="p-4 sm:p-6 space-y-6">
//                       <h2 className="text-xl font-semibold">Personal Information</h2>
//
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <InputField
//                             label="First Name"
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleInputChange}
//                         />
//                         <InputField
//                             label="Last Name"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleInputChange}
//                         />
//                       </div>
//
//                       <InputField
//                           label="Email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                       />
//
//                       <InputField
//                           label="Phone"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                       />
//
//                       <Button onClick={handleSave} className="w-full sm:w-auto">
//                         <Save className="w-4 h-4 mr-2" />
//                         Save Changes
//                       </Button>
//                     </Card>
//                     {/* Danger Zone */}
//                     <Card className="mt-5 bg-red-500/10 border border-red-500/30 p-6 md:col-span-1 lg:col-span-3">
//                       <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
//                       <div className="flex flex-col sm:flex-row gap-3">
//                         <Button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
//                           <LogOut className="w-4 h-4 mr-2" />
//                           Sign Out
//                         </Button>
//                         <Button
//                             onClick={() => setShowConfirmDelete(true)}
//                             className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete Account
//                         </Button>
//                       </div>
//                     </Card>
//
//                   </div>
//
//
//               )}
//
//               {/* SECURITY */}
//               {activeTab === "security" && (
//                   <Card className="p-4 sm:p-6 space-y-6">
//                     <h2 className="text-xl font-semibold">Change Password</h2>
//
//                     <div>
//                       <label className="text-sm font-medium mb-2 block">
//                         Current Password
//                       </label>
//                       <div className="relative">
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="currentPassword"
//                             value={securityData.currentPassword}
//                             onChange={handleSecurityChange}
//                             className="w-full px-4 py-2 bg-secondary border border-border rounded-lg pr-10"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2"
//                         >
//                           {showPassword ? (
//                               <EyeOff className="w-4 h-4" />
//                           ) : (
//                               <Eye className="w-4 h-4" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//
//                     <div>
//                       <label className="text-sm font-medium mb-2 block">
//                         New Password
//                       </label>
//                       <div className="relative">
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="currentPassword"
//                             value={securityData.currentPassword}
//                             onChange={handleSecurityChange}
//                             className="w-full px-4 py-2 bg-secondary border border-border rounded-lg pr-10"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2"
//                         >
//                           {showPassword ? (
//                               <EyeOff className="w-4 h-4" />
//                           ) : (
//                               <Eye className="w-4 h-4" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//
//                     <Button onClick={handleSave} className="w-full sm:w-auto">
//                       <Save className="w-4 h-4 mr-2" />
//                       Save Changes
//                     </Button>
//                   </Card>
//               )}
//
//               {/* NOTIFICATIONS */}
//               {activeTab === "notifications" && (
//                   <Card className="p-4 sm:p-6 space-y-4">
//                     <h2 className="text-xl font-semibold">
//                       Notification Preferences
//                     </h2>
//
//                     {Object.entries(notificationSettings).map(([key, value]) => (
//                         <div
//                             key={key}
//                             className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0"
//                         >
//                           <p className="font-medium capitalize">
//                             {key.replace(/([A-Z])/g, " $1")}
//                           </p>
//                           <button
//                               onClick={() =>
//                                   handleNotificationToggle(
//                                       key as keyof typeof notificationSettings
//                                   )
//                               }
//                               className={`relative inline-flex h-6 w-11 items-center rounded-full ${
//                                   value ? "bg-green-500" : "bg-gray-500"
//                               }`}
//                           >
//                       <span
//                           className={`inline-block h-4 w-4 transform rounded-full bg-white ${
//                               value ? "translate-x-6" : "translate-x-1"
//                           }`}
//                       />
//                           </button>
//                         </div>
//                     ))}
//
//                     <Button onClick={handleSave} className="w-full sm:w-auto">
//                       Save Preferences
//                     </Button>
//                   </Card>
//               )}
//
//               {/* Preferences */}
//               {activeTab === 'preferences' && (
//                   <div className="space-y-6">
//                     {/*<Card className="bg-card border-border p-6">*/}
//                     {/*  <h2 className="text-xl font-semibold text-foreground mb-4">Display & Appearance</h2>*/}
//                     {/*  <div className="space-y-4">*/}
//                     {/*    <div>*/}
//                     {/*      <label className="block text-sm font-medium text-foreground mb-2">Theme</label>*/}
//                     {/*      <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition">*/}
//                     {/*        <option>Dark Mode (Default)</option>*/}
//                     {/*        <option>Light Mode</option>*/}
//                     {/*        <option>Auto</option>*/}
//                     {/*      </select>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div>*/}
//                     {/*      <label className="block text-sm font-medium text-foreground mb-2">Currency Display</label>*/}
//                     {/*      <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition">*/}
//                     {/*        <option>USD ($)</option>*/}
//                     {/*        <option>EUR (€)</option>*/}
//                     {/*        <option>GBP (£)</option>*/}
//                     {/*        <option>CAD (C$)</option>*/}
//                     {/*        <option>AUD (A$)</option>*/}
//                     {/*      </select>*/}
//                     {/*    </div>*/}
//                     {/*  </div>*/}
//                     {/*</Card>*/}
//
//                     <Card className="bg-card border-border p-6">
//                       <h2 className="text-xl font-semibold text-foreground mb-4">Privacy & Data</h2>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between py-3 border-b border-border">
//                           <div>
//                             <p className="font-medium text-foreground">Profile Visibility</p>
//                             <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
//                           </div>
//                           <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition">
//                             <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
//                           </button>
//                         </div>
//
//                         <div className="flex items-center justify-between py-3">
//                           <div>
//                             <p className="font-medium text-foreground">Allow Portfolio Sharing</p>
//                             <p className="text-sm text-muted-foreground">Allow others to see your portfolio performance</p>
//                           </div>
//                           <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-500 transition">
//                             <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
//                           </button>
//                         </div>
//                       </div>
//                     </Card>
//
//                     <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
//                       <Save className="w-4 h-4 mr-2" />
//                       Save Preferences
//                     </Button>
//
//                   </div>
//               )}
//
//               {showConfirmDelete && (
//                   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
//                     <Card className="bg-card border-border w-full md:w-full md:max-w-md rounded-2xl md:rounded-xl">
//                       <div className="p-6 border-b border-border flex items-center justify-between">
//                         <h2 className="text-lg font-bold text-foreground">Delete Account</h2>
//                         <button onClick={() => setShowConfirmDelete(false)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
//                       </div>
//
//                       <div className="p-6 space-y-4">
//                         <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
//                           <p className="text-sm text-red-400 font-medium">This action cannot be undone</p>
//                           <p className="text-sm text-muted-foreground mt-2">Deleting your account will permanently remove all your data, portfolios, and transaction history.</p>
//                         </div>
//
//                         <div>
//                           <label className="block text-sm font-medium text-foreground mb-2">Type your email to confirm</label>
//                           <input
//                               type="email"
//                               placeholder="john.doe@example.com"
//                               className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
//                           />
//                         </div>
//
//                         <div className="flex gap-3">
//                           <Button
//                               onClick={() => setShowConfirmDelete(false)}
//                               className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
//                           >
//                             Cancel
//                           </Button>
//                           <Button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
//                             Delete Account
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   </div>
//               )}
//
//               {/* PREFERENCES */}
//               {/*{activeTab === "preferences" && (*/}
//               {/*    <Card className="p-4 sm:p-6 space-y-6">*/}
//               {/*      <h2 className="text-xl font-semibold">Appearance</h2>*/}
//
//               {/*      {mounted && (*/}
//               {/*          <Button*/}
//               {/*              onClick={toggleTheme}*/}
//               {/*              variant="outline"*/}
//               {/*              className="w-full sm:w-auto"*/}
//               {/*          >*/}
//               {/*            Toggle {theme === "dark" ? "Light" : "Dark"} Mode*/}
//               {/*          </Button>*/}
//               {/*      )}*/}
//               {/*    </Card>*/}
//               {/*)}*/}
//             </div>
//           </div>
//         </div>
//       </div>
//   )
// }
//
// /* Reusable Input */
// function InputField({
//                       label,
//                       name,
//                       value,
//                       onChange,
//                     }: any) {
//   return (
//       <div>
//         <label className="block text-sm font-medium mb-2">{label}</label>
//         <input
//             type="text"
//             name={name}
//             value={value}
//             onChange={onChange}
//             className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition"
//         />
//       </div>
//   )
// }
//
//
//
//
//
