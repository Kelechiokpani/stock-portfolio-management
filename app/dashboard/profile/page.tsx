"use client"

import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  MapPin,
  Mail,
  Phone,
  Globe,
  User as UserIcon,
  ShieldAlert,
  CreditCard,
  Settings2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/components/data/user-data"
import { Button } from "@/components/ui/button"


export default function ProfilePage() {
  // Fetch the specific user from your mock data structure
  const user = mockUsers[0]

  const isVerified = user.settings.kycStatus === "verified"

  return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-700">

        {/* 1. PROFILE HEADER / HERO */}
        <header className="relative flex flex-col md:flex-row items-center gap-8 border-b border-border/40 pb-10">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-2xl ring-1 ring-primary/20">
              <img
                  src={user.profile.avatar}
                  alt={user.profile.firstName}
                  className="h-full w-full object-cover"
              />
            </div>
            {isVerified && (
                <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-background shadow-lg">
                  <ShieldCheck className="h-4 w-4" />
                </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-serif font-bold tracking-tight">
                {user.profile.firstName} {user.profile.lastName}
              </h1>
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 uppercase text-[10px] font-black">
                {user.settings.accountType}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.profile.email}</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> {user.profile.country}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full px-5">Edit Profile</Button>
            <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20">Security</Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* 2. PERSONAL DOSSIER */}
          <Card className="lg:col-span-2 border-muted/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Identity Dossier
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-8 pt-8">
              <InfoItem icon={<UserIcon />} label="Legal Name" value={`${user.profile.firstName} ${user.profile.lastName}`} />
              <InfoItem icon={<Mail />} label="Primary Email" value={user.profile.email} />
              <InfoItem icon={<Phone />} label="Mobile Phone" value={user.profile.phoneNumber} />
              <InfoItem icon={<Globe />} label="Nationality" value={user.profile.country} />
              <InfoItem icon={<MapPin />} label="Residential Address" value={user.profile.address} className="sm:col-span-2" />
            </CardContent>
          </Card>

          {/* 3. SETTINGS & COMPLIANCE SIDEBAR */}
          <div className="space-y-8">

            {/* Wealth Settings */}
            <Card className="border-muted/40 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Settings2 className="h-4 w-4" /> Investor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-sm text-muted-foreground">Risk Tolerance</span>
                  <Badge className="bg-primary/10 text-primary border-none capitalize font-bold">
                    {user.settings.riskTolerance}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-sm text-muted-foreground">Base Currency</span>
                  <span className="text-sm font-bold font-mono">{user.settings.baseCurrency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Linked Accounts</span>
                  <span className="text-sm font-bold">{user.connectedAccounts.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Card */}
            <Card className="border-none bg-gradient-to-br from-secondary/50 to-background shadow-inner">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compliance Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusBadge
                    label="Identity (KYC)"
                    status={user.settings.kycStatus}
                    icon={isVerified ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                />
                <StatusBadge
                    label="Investment Agreement"
                    status="signed" // Simplified for this example
                    icon={<FileText className="h-4 w-4" />}
                />
                <StatusBadge
                    label="Source of Wealth"
                    status="verified"
                    icon={<CreditCard className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
  )
}

/** * MINI COMPONENTS FOR CLEANER CODE **/

function InfoItem({ icon, label, value, className }: any) {
  return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon && <span className="opacity-70 scale-75">{icon}</span>}
          <p className="text-[10px] font-bold uppercase tracking-tighter">{label}</p>
        </div>
        <p className="font-semibold text-foreground border-l-2 border-primary/20 pl-3">
          {value}
        </p>
      </div>
  )
}

function StatusBadge({ label, status, icon }: { label: string, status: string, icon: any }) {
  const isApproved = status === "verified" || status === "signed" || status === "approved"

  return (
      <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-border/40">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            {icon}
          </div>
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={`text-[10px] font-black uppercase ${isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
        {status}
      </span>
      </div>
  )
}