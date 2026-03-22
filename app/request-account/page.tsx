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
  Star,
  Lock,
  CheckCircle2,
  Loader2,
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

  // New states for OTP logic
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

  // Slide Effect
  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      8000
    );
    return () => clearInterval(timer);
  }, []);

  // Validation Logic
  // const isStepValid = () => {
  //   switch (step) {
  //     case 1:
  //       return !!form.accountType;
  //     case 2:
  //       const ageLimit = new Date();
  //       ageLimit.setFullYear(ageLimit.getFullYear() - 18);
  //       return (
  //         form.firstName.length >= 2 &&
  //         form.lastName.length >= 2 &&
  //         !!form.dob &&
  //         new Date(form.dob) <= ageLimit
  //       );
  //     case 3:
  //       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  //     case 4:
  //       return form.phone.replace(/\D/g, "").length >= 10;
  //     case 5:
  //       return form.note.trim().length >= 20;
  //     default:
  //       return true;
  //   }
  // };

  // UPDATED: Validation Logic
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
        // Step 3 is only valid if the email is verified
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

  // OTP Handlers
  const handleRequestOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error("Please enter a valid institutional email");
    }
    try {
      const response = await sendOtp({ email: form.email }).unwrap();
      console.log(response, "...respnse");
      if (response) {
        setOtpSent(true);
        toast.success(response.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < 4) return toast.error("Enter full verification code");
    try {
      const res = await verifyOtp({
        email: form.email,
        otp: otpValue,
      }).unwrap();
      if (res.success) {
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
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-950 via-zinc-950/40 to-transparent" />
            <img
              src={slide.image}
              className="h-full w-full object-cover grayscale-[0.2]"
              alt="Vaulting"
            />
            <div className="absolute bottom-20 left-12 z-20 max-w-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <TrendingUp size={28} />
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white font-serif">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg font-medium">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: INTERACTIVE PORTAL */}
      <main className="flex w-full flex-col lg:w-[60%]">
        <div className="mx-auto w-full max-w-xl px-6 py-12 ">
          {step < 6 ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                  Step 0{step} <ChevronRight size={12} />{" "}
                  <span className="text-zinc-400">Application</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
                  {step === 1 && "Select Portfolio Type"}
                  {step === 2 && "Identity Particulars"}
                  {step === 3 && "Contact Channel"}
                  {step === 4 && "Verification Link"}
                  {step === 5 && "Executive Brief"}
                </h1>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      step >= s ? "bg-blue-600" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  />
                ))}
              </div>

              <div className="min-h-[420px]">
                {/* STEP 1 */}
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
                            ? "border-blue-600 bg-blue-50/30 ring-4 ring-blue-500/5 dark:bg-blue-500/5"
                            : "border-zinc-100 dark:border-zinc-900 hover:border-zinc-200"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl transition-all ${
                            form.accountType === type.id
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {type.icon}
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-bold text-lg ${
                              form.accountType === type.id
                                ? "text-blue-600"
                                : ""
                            }`}
                          >
                            {type.title}
                          </p>
                          <p className="text-sm text-zinc-500">{type.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                          First Name
                        </Label>
                        <Input
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                          className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                          Last Name
                        </Label>
                        <Input
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                          className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        Date of Birth
                      </Label>
                      <Input
                        type="date"
                        value={form.dob}
                        onChange={(e) =>
                          setForm({ ...form, dob: e.target.value })
                        }
                        className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50"
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

                {/* STEP 3: EMAIL + OTP ONLY */}
                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div
                      className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-center ${
                        isEmailVerified
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-blue-50/50 dark:bg-blue-500/5 border-blue-100"
                      }`}
                    >
                      {isEmailVerified ? (
                        <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                      ) : (
                        <MailCheck className="text-blue-600 w-12 h-12" />
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
                          className="h-16 text-xl font-medium rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 px-6 text-center"
                        />
                        {!isEmailVerified && (
                          <button
                            onClick={handleRequestOtp}
                            disabled={isSendingOtp || !form.email}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 disabled:opacity-30"
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
                              className="h-16 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-2 border-blue-100 focus:border-blue-600"
                            />
                            <Button
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp || otpValue.length < 4}
                              className="h-16 px-8 rounded-2xl bg-blue-600 text-white shadow-lg"
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
                        <p className="text-center text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                          Identity Verified. Proceed to next phase.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: PHONE NUMBER ONLY */}
                {step === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 bg-blue-50/50 dark:bg-blue-500/5 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
                      <Smartphone className="text-blue-600 w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                        Phone Number (Institutional Contact)
                      </Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        placeholder="+1 (XXX) XXX-XXXX"
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="h-16 text-xl font-medium rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 text-center"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {step === 5 && (
                  <div className="space-y-4">
                    <Textarea
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="Briefly state your primary investment objectives..."
                      className="h-60 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/50 p-6 resize-none"
                    />
                    <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest">
                      <span
                        className={
                          form.note.length >= 20
                            ? "text-emerald-500"
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
                    className="h-14 px-8 rounded-2xl font-bold text-zinc-400"
                  >
                    <ChevronLeft className="mr-2" /> Back
                  </Button>
                )}
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid() || isLoading}
                  className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    isStepValid()
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:translate-y-[-2px]"
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
              {errorMsg && (
                <p className="text-center text-xs text-red-500 font-bold">
                  {errorMsg}
                </p>
              )}
            </div>
          ) : (
            /* SUCCESS VIEW */
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
              <div className="mx-auto w-28 h-28 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter">
                  Application Logged.
                </h2>
                <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                  Compliance officers will review your credentials and contact
                  you via {form.email} within 24 hours.
                </p>
              </div>
              <Button
                asChild
                className="h-14 px-12 rounded-2xl bg-zinc-900 text-white font-bold"
              >
                <Link href="/">Exit Terminal</Link>
              </Button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-900 p-8 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" /> End-to-End
            Secure
          </div>
          <div>
            Portal ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </div>
      </main>
    </div>
  );
}
