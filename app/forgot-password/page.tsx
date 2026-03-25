"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Lock,
  Star,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    title: "Secure Recovery",
    desc: "Our multi-layered encryption ensures your account retrieval remains private and protected.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    title: "Institutional Safety",
    desc: "VaultStock utilizes industry-leading security protocols to safeguard your financial assets.",
  },
];

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid institutional email address.");
      return;
    }

    try {
      const data = await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);
      console.log(data, "data...");
      toast.success("Security link dispatched.");
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || "Recovery failed. Please verify your email."
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Left: Security Narrative Slide */}
      <div className="relative hidden w-[40%] overflow-hidden lg:block border-r border-zinc-100 dark:border-zinc-900">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Gradient Overlay using Primary color */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-zinc-950/40 to-transparent" />
            <img
              src={slide.image}
              alt="Security"
              className="h-full w-full object-cover grayscale-[0.4]"
            />
            <div className="absolute bottom-20 left-12 z-20 max-w-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary-foreground rounded-full border border-primary/30 text-[10px] font-black uppercase tracking-[0.2em]">
                <ShieldAlert size={12} fill="currentColor" /> System Protocol
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white font-serif leading-tight uppercase">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg font-medium leading-relaxed">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Recovery Form */}
      <main className="flex w-full items-center justify-center px-6 lg:w-[60%]">
        <div className="w-full max-w-[440px] space-y-10">
          {!isSubmitted ? (
            <>
              <div className="flex flex-col items-center lg:items-start">
                {/* Lock icon container now uses Primary green in dark mode */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 shadow-xl shadow-zinc-500/10 dark:bg-primary">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                  Reset Credentials.
                </h1>
                <p className="mt-2 font-medium text-zinc-500 dark:text-zinc-400 text-center lg:text-left">
                  Enter your email address to receive a secure, time-sensitive
                  reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1"
                  >
                    Institutional Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 pl-12 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 focus-visible:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  className="h-14 w-full rounded-2xl bg-primary text-[13px] font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/25 hover:opacity-90 hover:translate-y-[-2px] transition-all"
                >
                  {isLoading
                    ? "Dispatched Security Link..."
                    : "Send Reset Link"}
                </Button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors pt-2"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Terminal
                </Link>
              </form>
            </>
          ) : (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-2xl">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                  Check Inbox.
                </h2>
                <p className="text-zinc-500 font-medium max-w-xs mx-auto">
                  A verification link was sent to{" "}
                  <span className="text-zinc-900 dark:text-white font-bold">
                    {email}
                  </span>
                  . Please check your spam folder if it doesn’t appear.
                </p>
              </div>
              <Link href="/login" className="block w-full">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 font-black uppercase tracking-widest text-[11px] hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                >
                  Return to Login
                </Button>
              </Link>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Dynamic Security Footer */}
        <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> System: Online
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-amber-500" /> Vault-Grade Security
          </div>
        </div>
      </main>
    </div>
  );
}
