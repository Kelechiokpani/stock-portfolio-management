'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Settings, User, Lock, Bell, Eye, EyeOff, ArrowLeft, LogOut, Trash2, Save, X, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-provider'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'preferences'>('account')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [saved, setSaved] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    timezone: 'EST (UTC-5)',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    priceAlerts: true,
    portfolioUpdates: true,
    newsDigest: true,
    weeklyReport: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurityData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          {mounted && (
            <button onClick={toggleTheme} className="p-2 hover:bg-secondary rounded-lg transition">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          {/*{mounted && (*/}
          {/*  <button onClick={toggleTheme} className="p-2 hover:bg-secondary rounded-lg transition">*/}
          {/*    {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}*/}
          {/*  </button>*/}
          {/*)}*/}
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="fixed top-20 lg:top-24 left-4 right-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3 z-40 animate-in fade-in">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <p className="text-sm font-medium text-green-400">Settings saved successfully</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="space-y-2 sticky top-24">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeTab === 'account'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Account
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeTab === 'security'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeTab === 'preferences'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Preferences
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
              {[
                { key: 'account', icon: User, label: 'Account' },
                { key: 'security', icon: Lock, label: 'Security' },
                { key: 'notifications', icon: Bell, label: 'Notifications' },
                { key: 'preferences', icon: Settings, label: 'Preferences' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                    activeTab === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Germany</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
                        >
                          <option>EST (UTC-5)</option>
                          <option>CST (UTC-6)</option>
                          <option>MST (UTC-7)</option>
                          <option>PST (UTC-8)</option>
                          <option>GMT (UTC+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/*<Card className="bg-card border-border p-6">*/}
                {/*  <h2 className="text-xl font-semibold text-foreground mb-4">Account Actions</h2>*/}
                {/*  <div className="space-y-3">*/}
                {/*    <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground justify-start">*/}
                {/*      <User className="w-4 h-4 mr-2" />*/}
                {/*      📧*/}
                {/*    </Button>*/}
                {/*    <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground justify-start">*/}
                {/*      📧*/}
                {/*    </Button>*/}
                {/*  </div>*/}
                {/*</Card>*/}

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition pr-10"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div className="bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
                      Password must be at least 8 characters and contain uppercase, lowercase, and numbers.
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mt-1">Enhance your account security with 2FA</p>
                    </div>
                    <button
                      onClick={() => setSecurityData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        securityData.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </Card>

                {/*<Card className="bg-red-500/10 border border-red-500/30 p-6">*/}
                {/*  <h3 className="text-lg font-semibold text-red-400 mb-4">Active Sessions</h3>*/}
                {/*  <p className="text-sm text-muted-foreground mb-4">Currently logged in on 2 devices</p>*/}
                {/*  <Button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">*/}
                {/*    Sign Out All Other Devices*/}
                {/*  </Button>*/}
                {/*</Card>*/}

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates on your account' },
                      // { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when stock prices change' },
                      { key: 'portfolioUpdates', label: 'Portfolio Updates', desc: 'Daily portfolio performance summaries' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{label}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key as keyof typeof notificationSettings)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            notificationSettings[key as keyof typeof notificationSettings] ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              notificationSettings[key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/*<Card className="bg-card border-border p-6">*/}
                {/*  <h2 className="text-xl font-semibold text-foreground mb-4">Display & Appearance</h2>*/}
                {/*  <div className="space-y-4">*/}
                {/*    <div>*/}
                {/*      <label className="block text-sm font-medium text-foreground mb-2">Theme</label>*/}
                {/*      <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition">*/}
                {/*        <option>Dark Mode (Default)</option>*/}
                {/*        <option>Light Mode</option>*/}
                {/*        <option>Auto</option>*/}
                {/*      </select>*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*      <label className="block text-sm font-medium text-foreground mb-2">Currency Display</label>*/}
                {/*      <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition">*/}
                {/*        <option>USD ($)</option>*/}
                {/*        <option>EUR (€)</option>*/}
                {/*        <option>GBP (£)</option>*/}
                {/*        <option>CAD (C$)</option>*/}
                {/*        <option>AUD (A$)</option>*/}
                {/*      </select>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</Card>*/}

                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Privacy & Data</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium text-foreground">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-foreground">Allow Portfolio Sharing</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your portfolio performance</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-500 transition">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                      </button>
                    </div>
                  </div>
                </Card>

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}

            {/* Danger Zone */}
            {/*<Card className="bg-red-500/10 border border-red-500/30 p-6 md:col-span-1 lg:col-span-3">*/}
            {/*  <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>*/}
            {/*  <div className="flex flex-col sm:flex-row gap-3">*/}
            {/*    <Button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">*/}
            {/*      <LogOut className="w-4 h-4 mr-2" />*/}
            {/*      Sign Out*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*      onClick={() => setShowConfirmDelete(true)}*/}
            {/*      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"*/}
            {/*    >*/}
            {/*      <Trash2 className="w-4 h-4 mr-2" />*/}
            {/*      Delete Account*/}
            {/*    </Button>*/}
            {/*  </div>*/}
            {/*</Card>*/}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
          <Card className="bg-card border-border w-full md:w-full md:max-w-md rounded-2xl md:rounded-xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Delete Account</h2>
              <button onClick={() => setShowConfirmDelete(false)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 font-medium">This action cannot be undone</p>
                <p className="text-sm text-muted-foreground mt-2">Deleting your account will permanently remove all your data, portfolios, and transaction history.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type your email to confirm</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
