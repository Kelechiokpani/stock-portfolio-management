'use client'

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Settings,
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "@/lib/theme-provider"

export default function SettingsPage() {
  const [activeTab, setActiveTab] =
      useState<"account" | "security" | "notifications" | "preferences">("account")
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    timezone: "EST (UTC-5)",
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    portfolioUpdates: true,
  })

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurityData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (
      key: keyof typeof notificationSettings
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
      <div className="min-h-screen bg-background pb-20">

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-lg font-semibold">Settings</h1>

            {/*{mounted && (*/}
            {/*    <button*/}
            {/*        onClick={toggleTheme}*/}
            {/*        className="p-2 rounded-lg hover:bg-secondary transition"*/}
            {/*    >*/}
            {/*      {theme === "dark" ? (*/}
            {/*          <Sun className="w-5 h-5" />*/}
            {/*      ) : (*/}
            {/*          <Moon className="w-5 h-5" />*/}
            {/*      )}*/}
            {/*    </button>*/}
            {/*)}*/}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-50 border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>

        {/* Save Notification */}
        {saved && (
            <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-green-500/20 border border-green-500/30 rounded-lg p-4 z-50">
              <p className="text-sm font-medium text-green-400">
                Settings saved successfully
              </p>
            </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:block space-y-2 sticky top-24">
              {[
                { key: "account", icon: User, label: "Account" },
                { key: "security", icon: Lock, label: "Security" },
                { key: "notifications", icon: Bell, label: "Notifications" },
                // { key: "preferences", icon: Settings, label: "Preferences" },
              ].map(({ key, icon: Icon, label }) => (
                  <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                          activeTab === key
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
              ))}
            </aside>

            {/* Mobile Tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4">
              {[
                { key: "account", icon: User, label: "Account" },
                { key: "security", icon: Lock, label: "Security" },
                { key: "notifications", icon: Bell, label: "Notifications" },
                // { key: "preferences", icon: Settings, label: "Preferences" },
              ].map(({ key, icon: Icon, label }) => (
                  <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                          activeTab === key
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
              ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">

              {/* ACCOUNT */}
              {activeTab === "account" && (
                  <Card className="p-4 sm:p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                      />
                      <InputField
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                      />
                    </div>

                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />

                    <InputField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />

                    <Button onClick={handleSave} className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </Card>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                  <Card className="p-4 sm:p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Change Password</h2>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={securityData.currentPassword}
                            onChange={handleSecurityChange}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                          ) : (
                              <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </Card>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                  <Card className="p-4 sm:p-6 space-y-4">
                    <h2 className="text-xl font-semibold">
                      Notification Preferences
                    </h2>

                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0"
                        >
                          <p className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </p>
                          <button
                              onClick={() =>
                                  handleNotificationToggle(
                                      key as keyof typeof notificationSettings
                                  )
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                  value ? "bg-green-500" : "bg-gray-500"
                              }`}
                          >
                      <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                              value ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                          </button>
                        </div>
                    ))}

                    <Button onClick={handleSave} className="w-full sm:w-auto">
                      Save Preferences
                    </Button>
                  </Card>
              )}

              {/* PREFERENCES */}
              {/*{activeTab === "preferences" && (*/}
              {/*    <Card className="p-4 sm:p-6 space-y-6">*/}
              {/*      <h2 className="text-xl font-semibold">Appearance</h2>*/}

              {/*      {mounted && (*/}
              {/*          <Button*/}
              {/*              onClick={toggleTheme}*/}
              {/*              variant="outline"*/}
              {/*              className="w-full sm:w-auto"*/}
              {/*          >*/}
              {/*            Toggle {theme === "dark" ? "Light" : "Dark"} Mode*/}
              {/*          </Button>*/}
              {/*      )}*/}
              {/*    </Card>*/}
              {/*)}*/}
            </div>
          </div>
        </div>
      </div>
  )
}

/* Reusable Input */
function InputField({
                      label,
                      name,
                      value,
                      onChange,
                    }: any) {
  return (
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition"
        />
      </div>
  )
}

