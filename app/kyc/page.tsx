"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  CheckCircle2,
  Upload,
  User,
  FileText,
  Shield,
  PenTool,
  AlertCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  UserPlus,
  SkipForward,
  ArrowRight,
  Landmark,
  Loader2,
  SearchX,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BANK_LIST,
  GENDER_OPTIONS,
  locationData,
} from "@/components/data/countries";
import {
  useGetBankListQuery,
  useOnboardingMutation,
  useSubmitOnboardingBankMutation,
} from "@/app/services/features/auth/authApi";
import { toast } from "sonner";

import { Nav } from "@/components/Reuse/Nav";

const steps = [
  { id: 1, label: "Account", icon: User },
  { id: 2, label: "KYC", icon: FileText },
  { id: 3, label: "Settlement", icon: Shield },
  { id: 4, label: "Agreement", icon: PenTool }, // Agreement moved here
  { id: 5, label: "Finalize", icon: Camera },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSettlementError, setShowSettlementError] = useState(false);
  const [onboarding, { isLoading }] = useOnboardingMutation();
  // const { data: bankList, isLoading: isFetchingBanks } = useGetBankListQuery() as any;

  const { data: bankData, isLoading: isFetchingBanks } =
    useGetBankListQuery() as any;

  // Create a safe reference to the array
  const banks = bankData?.banks || [];


  // 2. Setup the submission mutation
  const [submitBank, { isLoading: isSubmitting }] =
    useSubmitOnboardingBankMutation();

  const [successData, setSuccessData] = useState<any>(null);

  // Validation State
  const [errors, setErrors] = useState<string[]>([]);

  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const poaRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    sex: "",
    idType: "",
    country: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    poaType: "",
    nomineeName: { first: "", middle: "", last: "" },
    nomineeRelationship: "",
    nomineeAddressSame: true,
    bankInfo: { accountName: "", accountNumber: "", bankName: "", routing: "" },
    agreementAccepted: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const updateFields = (updates: any) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
    setErrors([]);
  };

  const validateStep = () => {
    const newErrors: string[] = [];

    if (currentStep === 1) {
      const required = [
        "email",
        "password",
        "sex",
        "country",
        "state",
        "city",
        "houseNumber",
        "street",
      ];
      required.forEach((field) => {
        if (!formData[field]) newErrors.push(field);
      });
    }

    if (currentStep === 2) {
      if (!formData.idType) newErrors.push("idType");
      if (!formData.nomineeName.first) newErrors.push("nomineeFirst");
      if (!formData.nomineeName.last) newErrors.push("nomineeLast");
    }

    if (currentStep === 3) {
      // Step 3 is Optional: only validate if they started filling it
      const { bankName, accountNumber, accountName } = formData.bankInfo;
      if (bankName || accountNumber || accountName) {
        if (!bankName) newErrors.push("bankName");
        if (!accountNumber) newErrors.push("bankAccountNumber");
        if (!accountName) newErrors.push("bankAccountName");
      }
    }

    if (currentStep === 4) {
      // Only Agreement validation here
      if (!formData.agreementAccepted) newErrors.push("agreement");
    }

    if (currentStep === 5) {
      // Photo check is handled in handleNext before final submit,
      // but you can add a flag here if needed.
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Navigation logic for steps 1 through 4
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // FINAL SUBMISSION (On Step 5)
    try {
      const selfieFile = selfieRef.current?.files?.[0] || formData.selfie;
      if (!selfieFile) {
        toast.error("Please upload your selfie to complete registration.");
        return;
      }

      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value === null || value === undefined) return;

        if (key === "bankInfo") {
          // Only append bank info if it was actually provided
          if (value.bankName && value.accountNumber) {
            submitData.append(key, JSON.stringify(value));
          }
        } else if (key === "nomineeName") {
          submitData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          submitData.append(key, value);
        } else {
          submitData.append(key, String(value));
        }
      });

      // Append the selfie explicitly if not already in formData
      if (!formData.selfie && selfieFile)
        submitData.append("selfie", selfieFile);

      await onboarding(submitData).unwrap();
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.data?.error || "Registration failed.");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the raw File object directly in your formData
      setFormData((prev: any) => ({ ...prev, [field]: file }));
      toast.success(`${file.name} uploaded`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onContinue = async () => {
    // If user hasn't filled anything, they might be trying to "Skip"
    const isFormEmpty =
      !formData.bankInfo.bankName || !formData.bankInfo.accountNumber;

    if (isFormEmpty) {
      handleNext(); // User chose to skip
      return;
    } else {
      toast.error("Please complete all bank fields or clear them to skip.");
    }
    // if (!formData.bankInfo.bankName || !formData.bankInfo.accountNumber) {
    //   handleNext(); // Simply move to next step (Skip logic)
    //   return;
    // }

    try {
      // Logic for "fails on submit" handling
      await submitBank({
        bankName: formData.bankInfo.bankName,
        accountNumber: formData.bankInfo.accountNumber,
        accountName: formData.bankInfo.accountName,
      }).unwrap();

      toast.success("Settlement details linked");
      handleNext();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to link bank. Please try again or skip."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50">
      <Nav
        subtitle="Secure Onboarding"
        icon={UserPlus}
        badgeText="New User Account Onboarding"
      />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-sm font-semibold text-primary uppercase tracking-widest">
                Step 0{currentStep}
              </h1>
              <p className="text-2xl font-bold mt-1">
                {steps[currentStep - 1].label}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-400">
              {Math.round(progress)}% Complete
            </p>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-slate-100 dark:bg-zinc-900"
          />

          <div className="mt-8 flex justify-between relative">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-zinc-900 -z-10" />
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center group">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    step.id < currentStep
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : step.id === currentStep
                      ? "bg-white dark:bg-zinc-950 border-primary text-primary shadow-xl shadow-primary/10"
                      : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-400"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Security & Identity</h2>
              <p className="text-sm text-slate-500">
                Configure your account credentials and primary location.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className={errors.includes("email") ? "text-red-500" : ""}
                  >
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={(e) => updateFields({ email: e.target.value })}
                    className={`h-11 rounded-xl bg-slate-50/50 focus:bg-white transition-all ${
                      errors.includes("email")
                        ? "border-red-500 shadow-sm shadow-red-100"
                        : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className={
                      errors.includes("password") ? "text-red-500" : ""
                    }
                  >
                    Create Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        updateFields({ password: e.target.value })
                      }
                      className={`h-11 rounded-xl bg-slate-50/50 pr-10 focus:bg-white transition-all ${
                        errors.includes("password")
                          ? "border-red-500 shadow-sm shadow-red-100"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                    errors.includes("sex")
                      ? "text-red-500"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Legal Sex
                </Label>
                <Select
                  onValueChange={(v) => updateFields({ sex: v })}
                  value={formData.sex}
                >
                  <SelectTrigger
                    className={`h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white ${
                      errors.includes("sex") ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    {GENDER_OPTIONS?.map((g: any) => (
                      <SelectItem
                        key={g.value}
                        value={g.value}
                        className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                      >
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">
                  Residential Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-full space-y-2">
                    <Label
                      className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                        errors.includes("country")
                          ? "text-red-500"
                          : "text-zinc-500"
                      }`}
                    >
                      Country
                    </Label>
                    <Select
                      onValueChange={(v) => {
                        setSelectedCountry(v);
                        setSelectedState("");
                        updateFields({ country: v, state: "", city: "" });
                      }}
                      value={formData.country}
                    >
                      <SelectTrigger
                        className={`h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white ${
                          errors.includes("country") ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                        {Object.keys(locationData)
                          .sort()
                          .map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                            >
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                        errors.includes("state")
                          ? "text-red-500"
                          : "text-zinc-500"
                      }`}
                    >
                      State
                    </Label>
                    <Select
                      disabled={!selectedCountry}
                      onValueChange={(v) => {
                        setSelectedState(v);
                        updateFields({ state: v, city: "" });
                      }}
                      value={formData.state}
                    >
                      <SelectTrigger
                        className={`h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white  ${
                          errors.includes("state") ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                        {selectedCountry &&
                          Object.keys(locationData[selectedCountry]).map(
                            (s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                              >
                                {s}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                        errors.includes("city")
                          ? "text-red-500"
                          : "text-zinc-500"
                      }`}
                    >
                      City
                    </Label>
                    <Select
                      disabled={!selectedState}
                      onValueChange={(v) => updateFields({ city: v })}
                      value={formData.city}
                    >
                      <SelectTrigger
                        className={`h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white  ${
                          errors.includes("city") ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                        {selectedCountry &&
                          selectedState &&
                          locationData[selectedCountry][selectedState].map(
                            (c: string) => (
                              <SelectItem
                                className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                                key={c}
                                value={c}
                              >
                                {c}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                        errors.includes("houseNumber")
                          ? "text-red-500"
                          : "text-zinc-500"
                      }`}
                    >
                      House Number
                    </Label>
                    <Input
                      placeholder="Unit #"
                      value={formData.houseNumber}
                      onChange={(e) =>
                        updateFields({ houseNumber: e.target.value })
                      }
                      className={`h-12 rounded-xl ${
                        errors.includes("houseNumber") ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`text-[13px] font-semibold uppercase tracking-wider ml-1 ${
                        errors.includes("street")
                          ? "text-red-500"
                          : "text-zinc-500"
                      }`}
                    >
                      Street Address
                    </Label>
                    <Input
                      placeholder="Street name"
                      value={formData.street}
                      onChange={(e) => updateFields({ street: e.target.value })}
                      className={`h-12 rounded-xl ${
                        errors.includes("street") ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-100 transition-all"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Synchronizing..." : "Save and Continue"}
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Document Verification</h2>
              <p className="text-sm text-slate-500">
                Identity confirmation required.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  className={errors.includes("idType") ? "text-red-500" : ""}
                >
                  Identification Type
                </Label>

                <Select
                  onValueChange={(v) => updateFields({ idType: v })}
                  value={formData.idType}
                >
                  <SelectTrigger
                    className={`h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white ${
                      errors.includes("idType") ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    {["Passport", "Driver's License", "National ID"].map(
                      (i) => (
                        <SelectItem
                          className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                          key={i}
                          value={i.toLowerCase()}
                        >
                          {i}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Front of ID", ref: idFrontRef, key: "idFront" },
                  { label: "Back of ID", ref: idBackRef, key: "idBack" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => item.ref.current?.click()}
                    className={`relative flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl transition-all cursor-pointer group overflow-hidden ${
                      formData[item.key]
                        ? "border-emerald-500 bg-emerald-50/5"
                        : "border-slate-200 dark:border-zinc-800 hover:border-primary/50"
                    }`}
                  >
                    {formData[item.key] ? (
                      // --- PREVIEW STATE ---
                      <>
                        <img
                          src={URL.createObjectURL(formData[item.key])}
                          alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="relative z-10 flex flex-col items-center bg-white/80 dark:bg-zinc-900/80 p-2 rounded-lg backdrop-blur-sm">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700 dark:text-slate-200">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      // --- EMPTY STATE ---
                      <>
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Upload className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.label}
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      ref={item.ref}
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, item.key)}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400">
                  Account Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                  <Input
                    placeholder="First Name"
                    value={formData.nomineeName.first}
                    onChange={(e) =>
                      updateFields({
                        nomineeName: {
                          ...formData.nomineeName,
                          first: e.target.value,
                        },
                      })
                    }
                    className={`h-11 mt-2  rounded-xl ${
                      errors.includes("nomineeFirst") ? "border-red-500" : ""
                    }`}
                  />
                  <Input
                    placeholder="Middle"
                    value={formData.nomineeName.middle}
                    onChange={(e) =>
                      updateFields({
                        nomineeName: {
                          ...formData.nomineeName,
                          middle: e.target.value,
                        },
                      })
                    }
                    className="h-11 mt-2  rounded-xl"
                  />
                  <Input
                    placeholder="Last Name"
                    value={formData.nomineeName.last}
                    onChange={(e) =>
                      updateFields({
                        nomineeName: {
                          ...formData.nomineeName,
                          last: e.target.value,
                        },
                      })
                    }
                    className={`h-11 mt-2  rounded-xl ${
                      errors.includes("nomineeLast") ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl text-sm font-bold shadow-lg"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Save and Continue"}
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Settlement Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600"
              >
                Skip for now <SkipForward className="ml-1 w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Primary Bank Account</Label>
              <div className="grid gap-3 p-5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
                {/* Step 3.1: Dynamic Bank Selection */}
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase text-slate-500 dark:text-zinc-500 font-black tracking-[0.15em] px-1">
                    Select Your Local Bank
                  </Label>

                  <Select
                    disabled={isFetchingBanks}
                    onValueChange={(bankName) => {
                      const selectedBank = banks.find(
                        (b: any) => b.name === bankName
                      );
                      updateFields({
                        bankInfo: {
                          ...formData.bankInfo,
                          bankName: selectedBank?.name,
                          bankCode: selectedBank?.code,
                        },
                      });
                    }}
                  >
                    <SelectTrigger className="h-14 w-full rounded-2xl border-slate-200 bg-white px-4 text-sm font-semibold transition-all hover:border-blue-500 hover:ring-4 hover:ring-blue-500/5 focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-400 dark:hover:ring-blue-400/5">
                      <div className="flex items-center gap-3">
                        <Landmark className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        <SelectValue
                          placeholder={
                            isFetchingBanks ? (
                              <span className="flex items-center gap-2 italic">
                                <Loader2 className="w-3 h-3 animate-spin" />{" "}
                                Fetching institutions...
                              </span>
                            ) : (
                              "Choose a bank..."
                            )
                          }
                        />
                      </div>
                    </SelectTrigger>

                    <SelectContent className="z-[100] max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/90">
                      {banks.length > 0 ? (
                        banks.map((bank: any) => (
                          <SelectItem
                            key={bank.id || bank.code}
                            value={bank.name}
                            className="rounded-xl py-3 px-4 text-sm font-medium transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-500/10 dark:focus:text-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-blue-500"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{bank.name}</span>
                              <span className="text-[9px] opacity-50 font-mono tracking-tighter">
                                {bank.code}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-8 text-center space-y-2">
                          <div className="mx-auto w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                            <SearchX className="w-4 h-4 text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            No institutions found
                          </p>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 3.2: Account Number */}
                <div className="space-y-2">
                  <Input
                    placeholder="Account Number"
                    maxLength={10}
                    value={formData.bankInfo.accountNumber}
                    onChange={(e) =>
                      updateFields({
                        bankInfo: {
                          ...formData.bankInfo,
                          accountNumber: e.target.value.replace(/\D/g, ""),
                        },
                      })
                    }
                    className="h-11 bg-white dark:bg-zinc-900 font-mono tracking-widest"
                  />
                </div>

                {/* Step 3.3: Account Holder Name */}
                <div className="space-y-2">
                  <Input
                    placeholder="Account Holder Name"
                    value={formData.bankInfo.accountName}
                    onChange={(e) =>
                      updateFields({
                        bankInfo: {
                          ...formData.bankInfo,
                          accountName: e.target.value,
                        },
                      })
                    }
                    className="h-11 bg-white dark:bg-zinc-900"
                  />
                </div>

                {/* Verification Badge */}
                {formData.bankInfo.bankName &&
                  formData.bankInfo.accountNumber.length === 10 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl animate-in fade-in">
                      <Landmark className="text-blue-600 w-5 h-5" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-600">
                          Routing to
                        </p>
                        <p className="text-xs font-bold">
                          {formData.bankInfo.bankName}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl font-bold"
                onClick={handleBack}
              >
                Previous
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-[11px]"
                onClick={onContinue}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Linking..." : "Continue Application"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: AGREEMENT */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Terms & Conditions</h2>
              <p className="text-sm text-slate-500">
                Please review the agreement to proceed.
              </p>
            </div>

            <div className="h-48 overflow-y-auto rounded-xl border bg-slate-50 dark:bg-zinc-950 p-4 text-[11px] leading-relaxed text-slate-500">
              <p className="font-bold mb-2 uppercase">User Service Agreement</p>
              <p>
                By checking the box below, you agree to the processing of your
                identity data for KYC purposes... [Your Full Terms Here]
              </p>
            </div>

            <div
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                formData.agreementAccepted
                  ? "bg-blue-50/50 border-blue-200"
                  : "bg-slate-50"
              }`}
            >
              <Checkbox
                id="terms"
                checked={formData.agreementAccepted}
                onCheckedChange={(v) =>
                  updateFields({ agreementAccepted: !!v })
                }
              />
              <Label
                htmlFor="terms"
                className="text-xs cursor-pointer select-none"
              >
                I confirm that I have read and accepted the service agreement.
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button className="flex-1 h-12 rounded-xl" onClick={handleNext}>
                Continue to Final Step
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: FINALIZE (SELFIE) */}
        {currentStep === 5 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-10 shadow-sm text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Identity Verification</h2>
              <p className="text-sm text-slate-500">
                Take a live photo of yourself to secure your account.
              </p>
            </div>

            <div className="relative mx-auto w-48 h-48 group">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 group-hover:border-primary/60 transition-colors animate-pulse" />
              <div
                className="absolute inset-2 rounded-full bg-slate-50 dark:bg-zinc-900 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all"
                onClick={() => selfieRef.current?.click()}
              >
                {formData.selfie ? (
                  <img
                    src={URL.createObjectURL(formData.selfie)}
                    className="h-full w-full object-cover"
                    alt="Selfie"
                  />
                ) : (
                  <>
                    <Camera className="h-10 w-10 text-primary mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Capture Selfie
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={selfieRef}
                  hidden
                  accept="image/*"
                  capture="user"
                  onChange={(e) => handleFileChange(e, "selfie")}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-blue-600 shadow-xl shadow-blue-500/20 font-bold"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? "Synchronizing..." : "Complete Registration"}
              </Button>
            </div>
          </div>
        )}

        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="mt-8 flex items-center gap-2 text-sm text-slate-400 hover:text-primary mx-auto"
          >
            <ChevronLeft className="h-4 w-4" /> Go back
          </button>
        )}

        <p className="mt-6 text-sm text-slate-500 dark:text-zinc-400  max-w-lg mx-auto">
          {successData?.message}
        </p>

        {errorMsg && (
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400 animate-in fade-in zoom-in-95">
            {errorMsg}
          </div>
        )}
      </main>
    </div>
  );
}
