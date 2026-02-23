"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  User,
  Building2,
  Heart,
  ChevronRight,
  ChevronLeft,
  MailCheck,
  Smartphone,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import Header from "@/components/Layout/User/Header";
import {useTheme} from "@/lib/theme-provider";

const accountTypes = [
  { id: "personal", title: "Personal", desc: "Closed-Ended", icon: <User className="w-5 h-5" /> },
  { id: "business", title: "Business", desc: "Closed-Ended", icon: <Building2 className="w-5 h-5" /> },
  { id: "non-profit", title: "Non-Profit", desc: "Closed-Ended", icon: <Heart className="w-5 h-5" /> },
]

export default function RequestAccountPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    accountType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    note: ""
  })

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const isStepValid = () => {
    if (step === 1) return !!form.accountType
    if (step === 2) return !!form.firstName && !!form.lastName && !!form.dob
    if (step === 3) return !!form.email.includes("@")
    if (step === 4) return !!form.phone
    return true
  }

  return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}

        <Header onMenuClick={() => setSidebarOpen(false)} />

        <main className="mx-auto max-w-xl px-6 py-12 lg:py-20">
          {step < 6 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-12">
                  {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            step >= s ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20" : "border-muted text-muted-foreground"
                        }`}>
                          {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                        </div>
                        {s !== 5 && <div className={`h-[2px] flex-1 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />}
                      </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-serif font-bold tracking-tight">
                    {step === 1 && "Select Account Type"}
                    {step === 2 && "Account Holder Details"}
                    {step === 3 && "Email Verification"}
                    {step === 4 && "Phone Verification"}
                    {step === 5 && "Request Note"}
                  </h1>
                  <p className="text-muted-foreground text-sm">Step {step} of 5 — Fill out the fields provided below.</p>
                </div>

                <Card className="p-6 border-muted/40 bg-card/50 shadow-xl backdrop-blur-sm">
                  {/* STEP 1: Account Type */}
                  {step === 1 && (
                      <div className="grid gap-4">
                        {accountTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setForm({ ...form, accountType: type.id })}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                    form.accountType === type.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-muted hover:border-primary/50 bg-background"
                                }`}
                            >
                              <div className={`p-3 rounded-lg ${form.accountType === type.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                                {type.icon}
                              </div>
                              <div>
                                <p className="font-bold">{type.title}</p>
                                <p className="text-xs text-muted-foreground">{type.desc}</p>
                              </div>
                            </button>
                        ))}
                      </div>
                  )}

                  {/* STEP 2: Account Holder */}
                  {step === 2 && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label>Middle Name</Label>
                            <Input value={form.middleName} onChange={(e) => setForm({...form, middleName: e.target.value})} placeholder="(Optional)" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} placeholder="Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input type="date" value={form.dob} onChange={(e) => setForm({...form, dob: e.target.value})} className="block" />
                          <p className="text-[10px] text-muted-foreground italic">Note: You must be 18 years or older.</p>
                        </div>
                      </div>
                  )}

                  {/* STEP 3: Email */}
                  {step === 3 && (
                      <div className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <MailCheck className="text-primary w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-left block">Verify Your Email</Label>
                          <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="john.doe@finance.com" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">We will send a security code to this address to verify your identity.</p>
                      </div>
                  )}

                  {/* STEP 4: Phone */}
                  {step === 4 && (
                      <div className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Smartphone className="text-primary w-8 h-8" />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label>Verify Your Phone Number</Label>
                          <Input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                  )}

                  {/* STEP 5: Request Note */}
                  {step === 5 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ClipboardList className="text-primary w-5 h-5" />
                          <Label className="font-bold">Request Note</Label>
                        </div>
                        <Textarea
                            value={form.note}
                            onChange={(e) => setForm({...form, note: e.target.value})}
                            placeholder="Provide details regarding your request or investment objectives..."
                            className="min-h-[150px] resize-none"
                        />
                      </div>
                  )}

                  {/* Form Navigation */}
                  <div className="mt-8 flex gap-3">
                    {step > 1 && (
                        <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl">
                          <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                    )}
                    <Button
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="flex-1 rounded-xl shadow-lg shadow-primary/20"
                    >
                      {step === 5 ? "Submit Request" : "Next Step"} <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
          ) : (
              /* STEP 6: FINISH */
              <div className="text-center animate-in zoom-in duration-500">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Request Submitted</h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Thank you for your interest in growing with the <span className="text-primary font-bold">FS Group</span>.
                  Your request has been submitted and is currently being processed by our compliance team.
                </p>
                <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/50 text-sm">
                  <p className="text-muted-foreground italic">
                    "You'll soon receive an acknowledgement email with further instructions."
                  </p>
                </div>

                <Button variant="outline" className="mt-10 w-full max-w-[200px] rounded-xl" asChild>
                  <Link href="/">Exit Screen</Link>
                </Button>
              </div>
          )}
        </main>
      </div>
  )
}