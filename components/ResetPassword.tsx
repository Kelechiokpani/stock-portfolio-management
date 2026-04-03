"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  RefreshCcw,
  Star,
  Hash, // Added for OTP icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPasswordMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    title: "Secure Access",
    desc: "Update your credentials through our encrypted gateway to maintain portfolio integrity.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    title: "Advanced Encryption",
    desc: "Every credential update is backed by high-standard cryptographic protocols.",
  },
];

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState("") as any;
  const [passwords, setPasswords] = useState({
    password: "",
    confirm: "",
  }) as any;
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null) as any;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      8000
    );
    return () => clearInterval(timer);
  }, []);

  const isPasswordSecure = passwords.password.length >= 8;
  const doPasswordsMatch =
    passwords.password === passwords.confirm && passwords.password !== "";
  const isOtpValid = otp.length >= 4; // Basic check for OTP length

  async function handleSubmit(e: any) {
    e.preventDefault();
    setErrorMsg(null);

    if (!isOtpValid) {
      setErrorMsg("Security Protocol: Please enter a valid OTP code.");
      return;
    }

    if (!doPasswordsMatch) {
      setErrorMsg("Security confirmation: Passwords do not match.");
      return;
    }

    try {
      // Sending OTP, Token (from URL), and New Password to your API
      (await resetPassword({
        otp: otp as any,
        newPassword: passwords.password,
      }).unwrap()) as any;

      setIsSuccess(true);
      toast.success("Credentials updated successfully.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message ||
          "Protocol error: Failed to reset credentials. Verify your OTP."
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Left: Branding & Context Slide */}
      <div className="relative hidden w-[40%] overflow-hidden lg:block border-r border-zinc-100 dark:border-zinc-900">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-zinc-950/40 to-transparent" />
            <img
              src={slide.image}
              className="h-full w-full object-cover grayscale-[0.2]"
              alt="Security"
            />
            <div className="absolute bottom-20 left-12 z-20 max-w-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <RefreshCcw size={28} />
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white font-serif uppercase">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg font-medium">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Reset Form */}
      <main className="flex w-full flex-col lg:w-[60%] justify-center pt-8">
        <div className="mx-auto w-full max-w-lg px-8 py-12">
          {!isSuccess ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] pt-6 font-black uppercase tracking-[0.3em] text-primary">
                  Security Terminal <ChevronRight size={12} />{" "}
                  <span className="text-zinc-400">Credential Reset</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                  Verify & Reset.
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                {/* OTP Input Section */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    Authorization Code (OTP)
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-12 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 focus-visible:ring-primary font-mono text-lg tracking-[0.3em]"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      } // Only numbers
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    New Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-12 pr-12 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 focus-visible:ring-primary"
                      value={passwords.password}
                      onChange={(e) =>
                        setPasswords({ ...passwords, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    Confirm Identity Key
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-12 pr-12 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 focus-visible:ring-primary"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !isPasswordSecure ||
                    !doPasswordsMatch ||
                    !isOtpValid
                  }
                  className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:translate-y-[-2px]"
                >
                  {isLoading ? "Validating Protocol..." : "Update Credentials"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
              <div className="mx-auto w-28 h-28 bg-primary/10 rounded-[3rem] flex items-center justify-center border border-primary/20 shadow-2xl">
                <ShieldCheck className="h-14 w-14 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                  Identity Verified.
                </h2>
                <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                  Your password has been successfully updated. Transitioning to
                  login terminal...
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-8 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3">
              <Star size={14} fill="currentColor" className="shrink-0" />{" "}
              {errorMsg}
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-900 p-8 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-primary" /> AES-256 Protected
          </div>
        </div>
      </main>
    </div>
  );
}
