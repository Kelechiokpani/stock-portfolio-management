"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Mail,
  Eye,
  EyeOff,
  Lock,
  Star,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";
import Logo from "@/components/Layout/Logo";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1973&auto=format&fit=crop",
    title: "Secure Your Legacy",
    desc: "Experience the next generation of institutional portfolio management.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    title: "Global Reach",
    desc: "Direct access to over 150 global exchanges and private equity flows.",
  },
];

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.email || !form.password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    try {
      const response = await login(form).unwrap();
      const userRole = response?.user?.role;
      userRole === "admin" ? router.push("/admin") : router.push("/dashboard");
      toast.success("Welcome back!");
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || "Login failed. Check your credentials."
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Left Side: Captivating Image Carousel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <img
              src={slide.image}
              alt="Banking"
              className="h-full w-full object-cover grayscale-[0.3]"
            />
            <div className="absolute bottom-20 left-16 z-20 max-w-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30 text-[10px] font-black uppercase tracking-[0.2em]">
                <Star size={12} fill="currentColor" /> VaultStock Elite
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter text-white font-serif leading-tight">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Professional Login Form */}
      <main className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-[440px] space-y-10">
          <div className="flex flex-col items-center lg:items-start">
            <Logo />
            <h1 className="mt-6 text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
              Welcome back.
            </h1>
            <p className="mt-2 font-medium text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access the terminal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-12 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-12 pr-12 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-2xl bg-blue-600 text-[13px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:translate-y-[-2px] transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Sign In to Terminal"}
            </Button>
          </form>

          {errorMsg && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Link
              href="/request-account"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors"
            >
              Request New Account
            </Link>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors"
            >
              Reset Password
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
              <ShieldCheck size={14} className="text-emerald-500" /> AES-256
              Encryption
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-auto">
              System Status: <span className="text-emerald-500">Optimal</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
