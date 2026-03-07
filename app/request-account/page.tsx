"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  User,
  Building2,
  Heart,
  ChevronRight,
  ChevronLeft,
  MailCheck,
  Smartphone,
  ClipboardList,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Header from "@/components/Layout/User/Header";
import { useRegisterMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

const accountTypes = [
  {
    id: "personal",
    title: "Personal",
    desc: "For individual investors",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "business",
    title: "Business",
    desc: "Corporate entity accounts",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "non-profit",
    title: "Non-Profit",
    desc: "Charitable organizations",
    icon: <Heart className="w-5 h-5" />,
  },
];

export default function RequestAccountPage() {
  const [register, { isLoading }] = useRegisterMutation(); // API Hook
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    accountType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    note: "",
  });

  const nextStep = async () => {
    if (step === 5) {
      try {
        const response = await register(form).unwrap();
        setSuccessData(response);
        setStep(6);
      } catch (err: any) {
        console.log("Registration failed:", err);
        const message = err?.data?.error || "An unexpected error occurred.";
        setErrorMsg(message);
        toast.error(message);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const isStepValid = () => {
    if (step === 1) return !!form.accountType;
    if (step === 2) return !!form.firstName && !!form.lastName && !!form.dob;
    if (step === 3) return form.email.includes("@") && form.email.length > 5;
    if (step === 4) return form.phone.length > 7;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header onMenuClick={() => setSidebarOpen(false)} />

      <main className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
        {step < 6 ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Elegant Progress Bar */}
            <div className="relative flex justify-between items-center px-2">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-500 -translate-y-1/2 z-0"
                style={{ width: `${(step - 1) * 25}%` }}
              />
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="relative z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                      step >= s
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110"
                        : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {step === 1 && "Select Account Type"}
                {step === 2 && "Personal Details"}
                {step === 3 && "Email Address"}
                {step === 4 && "Phone Number"}
                {step === 5 && "Final Remarks"}
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">
                Step {step} of 5 — Secure Application Process
              </p>
            </div>

            <Card className="p-8 border-slate-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/50 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl rounded-[2rem]">
              {/* STEP 1: Account Type */}
              {step === 1 && (
                <div className="grid gap-4">
                  {accountTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setForm({ ...form, accountType: type.id })}
                      className={`group flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${
                        form.accountType === type.id
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-slate-100 dark:border-zinc-800 hover:border-primary/40 bg-slate-50/50 dark:bg-zinc-950/50"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-xl transition-colors ${
                          form.accountType === type.id
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-zinc-900 text-slate-400 group-hover:text-primary"
                        }`}
                      >
                        {type.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{type.title}</p>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                          {type.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                        First Name
                      </Label>
                      <Input
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        placeholder="John"
                        className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                        Middle Name
                      </Label>
                      <Input
                        value={form.middleName}
                        onChange={(e) =>
                          setForm({ ...form, middleName: e.target.value })
                        }
                        placeholder=""
                        className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Last Name
                    </Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) =>
                        setForm({ ...form, dob: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200"
                    />
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <p className="text-[10px] text-slate-400 font-medium italic">
                        Identity verification required for age 18+.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 & 4 (Combined Style) */}
              {(step === 3 || step === 4) && (
                <div className="space-y-8 py-4">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
                    {step === 3 ? (
                      <MailCheck className="text-primary w-10 h-10" />
                    ) : (
                      <Smartphone className="text-primary w-10 h-10" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      {step === 3 ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      type={step === 3 ? "email" : "tel"}
                      value={step === 3 ? form.email : form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [step === 3 ? "email" : "phone"]: e.target.value,
                        })
                      }
                      placeholder={
                        step === 3 ? "name@company.com" : "+1 (555) 000-0000"
                      }
                      className="h-14 text-lg rounded-xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Note */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
                    <ClipboardList className="text-primary w-6 h-6" />
                    <p className="text-sm font-medium">
                      Investment Objectives & Notes
                    </p>
                  </div>
                  <Textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Briefly describe your interest in VaultStock..."
                    className="min-h-[180px] rounded-2xl bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200 p-4 resize-none focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                  </Button>
                )}
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid() || isLoading}
                  className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isLoading
                    ? "Processing..."
                    : step === 5
                    ? "Submit Application"
                    : "Continue"}
                  {!isLoading && <ChevronRight className="ml-1 w-5 h-5" />}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-10 animate-in zoom-in-95 duration-700">
            <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in spin-in-12 duration-1000" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Application Received
            </h1>
            <p className="mt-6 text-lg text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Our compliance team has received your request for an account.
            </p>

            <div className="mt-10 p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800 text-sm italic text-slate-500">
              {successData?.message ||
                "Your application has been submitted successfully."}
            </div>

            {errorMsg && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400 animate-in fade-in zoom-in-95">
                {errorMsg}
              </div>
            )}

            <Button
              size="lg"
              className="mt-12 w-full rounded-2xl shadow-xl shadow-primary/20"
              asChild
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
