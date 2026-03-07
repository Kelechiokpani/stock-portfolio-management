"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Layout/User/Header";
import { useResetPasswordMutation } from "@/app/services/features/auth/authApi";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Separate visibility states for each field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (passwords.password !== passwords.confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!token) {
      setErrorMsg("Invalid or missing reset token. Please request a new link.");
      return;
    }

    try {
      await resetPassword({ token, newPassword: passwords.password }).unwrap();
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to reset password.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header onMenuClick={() => {}} />

      <main className="mx-auto max-w-[540px] px-6 py-20 lg:py-32">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Please enter your new secure password below.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ml-1">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 pr-11 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-950"
                    value={passwords.password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ml-1">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 pr-11 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-950"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-100"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold">Password Updated!</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Your security is our priority. Redirecting to login...
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {errorMsg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
