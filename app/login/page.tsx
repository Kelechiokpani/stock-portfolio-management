"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ArrowLeft,
  Sun,
  Moon,
  Mail,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/theme-provider";
import Header from "@/components/Layout/User/Header";
import { useLoginMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!form.email || !form.password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      // 3. Execute the mutation
      // .unwrap() allows us to use standard try/catch logic with RTK Query
      const response = await login(form).unwrap();

      const userRole = response?.user?.role;

      console.log(" User response:", response);
      console.log("Login successful! User role:", userRole);

      // 3. Conditional Redirect
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      toast.success("Welcome back!");
    } catch (err: any) {
      // Handle API errors (e.g., 401 Unauthorized)
      setErrorMsg(
        err?.data?.message || "Login failed. Please check your credentials."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header onMenuClick={() => setSidebarOpen(false)} />

      <main className="mx-auto max-w-[640px] px-6 py-20 lg:py-32">
        {/* Branding/Logo Area */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Securely access your VaultStock portfolio
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ml-1"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:bg-zinc-950"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 pr-11 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:bg-zinc-950"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4  group relative w-full h-12 overflow-hidden rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-100"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "Authenticating..." : "Sign In to VaultStock"}
              </span>
            </Button>
          </form>

          {errorMsg && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400 animate-in fade-in zoom-in-95">
              {errorMsg}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 dark:border-zinc-800">
            <Link
              href="/request-account"
              className="text-center text-xs font-semibold text-slate-500 hover:text-primary transition-colors dark:text-zinc-400"
            >
              REQUEST ACCOUNT
            </Link>
            <Link
              href="/forgot-password"
              className="text-center text-xs font-semibold text-slate-500 hover:text-primary transition-colors dark:text-zinc-400"
            >
              FORGOT PASSWORD?
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-400 dark:text-zinc-500 italic">
          Protected by industry-standard 256-bit encryption.
        </p>
      </main>
    </div>
  );
}
