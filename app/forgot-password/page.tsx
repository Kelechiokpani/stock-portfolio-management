"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Layout/User/Header";
import { useForgotPasswordMutation } from "@/app/services/features/auth/authApi";


export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header onMenuClick={() => {}} />

      <main className="mx-auto max-w-[540px] px-6 py-20 lg:py-32">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Recover Password</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            We'll send a secure reset link to your email.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ml-1">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-950"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/25">
                {isLoading ? "Sending link..." : "Send Reset Link"}
              </Button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                A password reset link has been sent to <strong>{email}</strong>.
              </p>
              <Link href="/login">
                <Button variant="outline" className="mt-6 w-full h-12 rounded-xl">Return to Login</Button>
              </Link>
            </div>
          )}

          {errorMsg && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {errorMsg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}