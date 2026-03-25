"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  User,
  Building2,
  Heart,
  ChevronRight,
  ChevronLeft,
  MailCheck,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/app/services/features/auth/authApi";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1974&auto=format&fit=crop",
    title: "Institutional Wealth",
    desc: "Join an ecosystem of elite investors and corporate entities.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1974&auto=format&fit=crop",
    title: "Global Compliance",
    desc: "Our rigorous onboarding ensures the highest standards of portfolio security.",
  },
];

const accountTypes = [
  {
    id: "personal",
    title: "Personal",
    desc: "Individual wealth management",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "business",
    title: "Business",
    desc: "Corporate entity structures",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "non-profit",
    title: "Non-Profit",
    desc: "Charitable & Endowment funds",
    icon: <Heart className="w-5 h-5" />,
  },
];

export default function RequestAccountPage() {
  const [register, { isLoading }] = useRegisterMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const [step, setStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [otpValue, setOtpValue] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

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

  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      8000
    );
    return () => clearInterval(timer);
  }, []);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!form.accountType;
      case 2:
        const ageLimit = new Date();
        ageLimit.setFullYear(ageLimit.getFullYear() - 18);
        return (
          form.firstName.length >= 2 &&
          form.lastName.length >= 2 &&
          !!form.dob &&
          new Date(form.dob) <= ageLimit
        );
      case 3:
        return isEmailVerified;
      case 4:
        return form.phone.replace(/\D/g, "").length >= 10;
      case 5:
        return form.note.trim().length >= 20;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (step === 5) {
      try {
        const response = await register(form).unwrap();
        setSuccessData(response);
        setStep(6);
        toast.success("Application Successfully");
      } catch (err: any) {
        const message =
          err?.data?.error || "Registration failed. Please try again.";
        setErrorMsg(message);
        toast.error(message);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleRequestOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return toast.error("Please enter a valid institutional email");
    try {
      const response = await sendOtp({ email: form.email }).unwrap();
      if (response) {
        setOtpSent(true);
        toast.success(response.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) return toast.error("Enter full verification code");
    try {
      const res = await verifyOtp({
        email: form.email,
        otp: otpValue,
      }).unwrap();
      console.log(res, "response...");
      if (res?.verified === true) {
        setIsEmailVerified(true);
        toast.success("Identity Authenticated");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired code");
    }
  };

  return (
    <div className="flex bg-white dark:bg-zinc-950">
      {/* LEFT: VISUAL NARRATIVE */}
      <div className="relative hidden w-[40%] overflow-hidden lg:block border-r border-zinc-100 dark:border-zinc-900">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Gradient Overlay using Primary Green tint */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/80 via-zinc-950/40 to-transparent" />
            <img
              src={slide.image}
              className="h-full w-full object-cover grayscale-[0.5]"
              alt="Vaulting"
            />
            <div className="absolute bottom-20 left-12 z-20 max-w-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <TrendingUp size={28} />
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white font-serif uppercase">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg font-medium">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: INTERACTIVE PORTAL */}
      <main className="flex w-full flex-col lg:w-[60%]">
        <div className="mx-auto w-full max-w-xl px-6 py-12">
          {step < 6 ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  Step 0{step} <ChevronRight size={12} />{" "}
                  <span className="text-zinc-400">Application</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                  {step === 1 && "Select Portfolio Type"}
                  {step === 2 && "Identity Particulars"}
                  {step === 3 && "Contact Channel"}
                  {step === 4 && "Verification Link"}
                  {step === 5 && "Executive Brief"}
                </h1>
              </div>

              {/* Progress Bar mapped to Primary Green */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      step >= s ? "bg-primary" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  />
                ))}
              </div>

              <div className="min-h-[420px]">
                {step === 1 && (
                  <div className="grid gap-4">
                    {accountTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setForm({ ...form, accountType: type.id })
                        }
                        className={`group flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${
                          form.accountType === type.id
                            ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                            : "border-zinc-100 dark:border-zinc-900 hover:border-zinc-200"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl transition-all ${
                            form.accountType === type.id
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {type.icon}
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-black text-lg uppercase italic ${
                              form.accountType === type.id ? "text-primary" : ""
                            }`}
                          >
                            {type.title}
                          </p>
                          <p className="text-sm font-medium text-zinc-500">
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                          First Name
                        </Label>
                        <Input
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                          className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                          Last Name
                        </Label>
                        <Input
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                          className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                        Date of Birth
                      </Label>
                      <Input
                        type="date"
                        value={form.dob}
                        onChange={(e) =>
                          setForm({ ...form, dob: e.target.value })
                        }
                        className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-primary"
                      />
                      {form.dob &&
                        new Date(form.dob) >
                          new Date(
                            new Date().setFullYear(
                              new Date().getFullYear() - 18
                            )
                          ) && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-2">
                            Required: 18+ years of age
                          </p>
                        )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div
                      className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-center ${
                        isEmailVerified
                          ? "bg-primary/10 border-primary/20"
                          : "bg-primary/5 border-primary/10"
                      }`}
                    >
                      {isEmailVerified ? (
                        <CheckCircle2 className="text-primary w-12 h-12" />
                      ) : (
                        <MailCheck className="text-primary w-12 h-12" />
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          disabled={isEmailVerified || isSendingOtp}
                          value={form.email}
                          placeholder="name@institutional.com"
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="h-16 text-xl font-medium rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none text-center focus-visible:ring-primary"
                        />
                        {!isEmailVerified && (
                          <button
                            onClick={handleRequestOtp}
                            disabled={isSendingOtp || !form.email}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 disabled:opacity-30"
                          >
                            {isSendingOtp
                              ? "Sending..."
                              : otpSent
                              ? "Resend"
                              : "Request OTP"}
                          </button>
                        )}
                      </div>
                      {otpSent && !isEmailVerified && (
                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block text-center">
                            Verify Security Token
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={otpValue}
                              maxLength={6}
                              onChange={(e) => setOtpValue(e.target.value)}
                              placeholder="0 0 0 0 0 0"
                              className="h-16 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-2 border-primary/20 focus:border-primary"
                            />
                            <Button
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp || otpValue.length < 4}
                              className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground shadow-lg"
                            >
                              {isVerifyingOtp ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      {isEmailVerified && (
                        <p className="text-center text-primary font-black text-[10px] uppercase tracking-widest">
                          Identity Authenticated. Proceed.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center justify-center">
                      <Smartphone className="text-primary w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                        Phone Number (Institutional)
                      </Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        placeholder="+1 (XXX) XXX-XXXX"
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="h-16 text-xl font-medium rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none text-center focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <Textarea
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="State your primary investment objectives..."
                      className="h-60 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border-none p-6 resize-none focus-visible:ring-primary"
                    />
                    <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest">
                      <span
                        className={
                          form.note.length >= 20
                            ? "text-primary"
                            : "text-zinc-400"
                        }
                      >
                        Min 20 characters
                      </span>
                      <span className="text-zinc-400">
                        {form.note.length}/500
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* NAV BUTTONS */}
              <div className="flex items-center gap-4 pt-4">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => s - 1)}
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-zinc-400"
                  >
                    <ChevronLeft className="mr-2" /> Back
                  </Button>
                )}
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid() || isLoading}
                  className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    isStepValid()
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:translate-y-[-2px]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {isLoading
                    ? "Authenticating..."
                    : step === 5
                    ? "Submit Application"
                    : "Next Phase"}
                  {!isLoading && isStepValid() && (
                    <ChevronRight className="ml-2" />
                  )}
                  {!isLoading && !isStepValid() && (
                    <Lock className="ml-2 w-4 h-4 opacity-30" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* SUCCESS VIEW */
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
              <div className="mx-auto w-28 h-28 bg-primary/10 rounded-[3rem] flex items-center justify-center border border-primary/20 shadow-2xl">
                <CheckCircle2 className="h-14 w-14 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                  Application Logged.
                </h2>
                <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                  Compliance officers will review your credentials and contact
                  you via {form.email} within 24 hours.
                </p>
              </div>
              <Button
                asChild
                className="h-14 px-12 rounded-2xl text-white font-black uppercase tracking-widest"
              >
                <Link href="/">Exit Terminal</Link>
              </Button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-900 p-8 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> End-to-End Secure
          </div>
          <div>
            Portal ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </div>
      </main>
    </div>
  );
}
