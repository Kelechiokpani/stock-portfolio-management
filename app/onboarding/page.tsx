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
import { useOnboardingMutation } from "@/app/services/features/auth/authApi";
import { toast } from "sonner";
import {
  useGetGendersQuery,
  useGetLocationsQuery,
} from "../services/features/data/referenceApi";

const steps = [
  { id: 1, label: "Account", icon: User },
  { id: 2, label: "KYC", icon: FileText },
  { id: 3, label: "Settlement", icon: Shield },
  { id: 4, label: "Finalize", icon: PenTool },
];

export default function OnboardingPage() {
  const { data: locations, isLoading: loadingLocs } = useGetLocationsQuery();
  const { data: genders, isLoading: loadingGenders } = useGetGendersQuery();

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSettlementError, setShowSettlementError] = useState(false);
  const [onboarding, { isLoading }] = useOnboardingMutation();
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
      if (!formData.email) newErrors.push("email");
      if (!formData.password) newErrors.push("password");
      if (!formData.sex) newErrors.push("sex");
      if (!formData.country) newErrors.push("country");
      if (!formData.state) newErrors.push("state");
      if (!formData.city) newErrors.push("city");
      if (!formData.houseNumber) newErrors.push("houseNumber");
      if (!formData.street) newErrors.push("street");
    }

    if (currentStep === 2) {
      if (!formData.idType) newErrors.push("idType");
      if (!formData.nomineeName.first) newErrors.push("nomineeFirst");
      if (!formData.nomineeName.last) newErrors.push("nomineeLast");
    }

    if (currentStep === 3) {
      if (!formData.bankInfo.accountName) newErrors.push("bankAccountName");
      if (!formData.bankInfo.accountNumber) newErrors.push("bankAccountNumber");
      if (!formData.bankInfo.bankName) newErrors.push("bankName");
      if (!formData.agreementAccepted) newErrors.push("agreement");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
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

  const handleNext = async () => {
    // 1. Validation
    if (!validateStep()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // 2. Navigation
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 3. Final Submission
    try {
      // Check for selfie before submitting
      const selfieFile = selfieRef.current?.files?.[0] || formData.selfie;
      if (!selfieFile) {
        toast.error("Please upload your selfie to complete registration.");
        return;
      }

      const submitData = new FormData();

      // Iterate through formData
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value === null || value === undefined) return;

        if (key === "nomineeName" || key === "bankInfo") {
          // Only stringify if your backend is specifically coded to parse these sub-fields
          submitData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          // Explicitly handle File objects
          submitData.append(key, value);
        } else {
          // Convert booleans/numbers to strings for FormData compatibility
          submitData.append(key, String(value));
        }
      });

      // CRITICAL FIX: Pass 'submitData' directly, do not wrap it in { data: ... }
      const response = await onboarding(submitData).unwrap();

      const successMessage =
        response?.message || "Account created successfully!";
      const currentKycStatus = response?.kycStatus;
      
      toast.success(successMessage, {
        description:
          currentKycStatus === "pending"
            ? "Your documents are now under review."
            : "Registration complete!",
      });

      router.push("/login");
    } catch (err: any) {
      console.log("Error Status:", err.status);
      console.log("Error Data:", err.data);

      const errorMessage =
        err?.data?.error ||
        err?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    }
  };

  // const handleNext = async () => {
  //   // 1. Validate the current step's inputs
  //   if (!validateStep()) {
  //     toast.error("Please fill in all required fields.");
  //     return;
  //   }

  //   // 2. If not on the last step, just move to the next screen
  //   if (currentStep < steps.length) {
  //     setCurrentStep(currentStep + 1);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //     return;
  //   }

  //   // 3. If on Step 4, call the API with the ENTIRE formData
  //   try {
  //     // Logic check: Ensure selfie is present if required for final step
  //     if (!selfieRef.current?.files?.[0] && !formData.selfie) {
  //       toast.error("Please upload your selfie to complete registration.");
  //       return;
  //     }

  //     const submitData = new FormData();

  //     Object.keys(formData).forEach((key) => {
  //       if (key === "nomineeName" || key === "bankInfo") {
  //         submitData.append(key, JSON.stringify(formData[key]));
  //       } else {
  //         submitData.append(key, formData[key]);
  //       }
  //     });

  //     const response = await onboarding({ data: submitData }).unwrap();
  //     setSuccessData(response);

  //     toast.success("Account created successfully!");
  //     router.push("/dashboard");
  //   } catch (err: any) {
  //     toast.error(
  //       err?.data?.message || "Registration failed. Please try again."
  //     );
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 text-slate-900 dark:text-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VaultStock</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
              Secure Onboarding
            </span>
          </div>
        </div>
      </header>

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
                    placeholder="name@company.com"
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
                  Account Nominee
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
            <h2 className="text-xl font-bold">Settlement Details</h2>

            <div className="space-y-4">
              <Label>Primary Bank Account</Label>
              <div className="grid gap-3 p-5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
                {/* Step 3.1: Bank Selection based on Country */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-slate-400">
                    Select Your Bank
                  </Label>
                  <Select
                    onValueChange={(bankName) => {
                      const countryBanks =
                        formData.country === "United Kingdom"
                          ? BANK_LIST.UK
                          : BANK_LIST.USA;
                      const selectedBank = countryBanks.find(
                        (b) => b.name === bankName
                      );
                      updateFields({
                        bankInfo: {
                          ...formData.bankInfo,
                          bankName: selectedBank?.name,
                          routing: selectedBank?.routing,
                        },
                      });
                    }}
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-zinc-200 bg-white px-4 text-sm font-medium transition-all hover:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white">
                      <SelectValue placeholder="Choose a bank..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                      {(formData.country === "United Kingdom"
                        ? BANK_LIST.UK
                        : BANK_LIST.USA
                      ).map((bank) => (
                        <SelectItem
                          className="rounded-lg py-3 px-4 text-sm font-medium focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                          key={bank.name}
                          value={bank.name}
                        >
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 3.2: Account Number Entry */}
                <Input
                  placeholder="Account Number"
                  value={formData.bankInfo.accountNumber}
                  onChange={(e) =>
                    updateFields({
                      bankInfo: {
                        ...formData.bankInfo,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                  className={`h-11 bg-white dark:bg-zinc-900 ${
                    errors.includes("bankAccountNumber") ? "border-red-500" : ""
                  }`}
                />

                {/* Step 3.3: Visual Feedback (Display Auto-filled Data) */}
                {formData.bankInfo.bankName && (
                  <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 animate-in zoom-in-95">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase text-primary font-bold">
                          Verified Bank
                        </p>
                        <p className="text-sm font-semibold">
                          {formData.bankInfo.bankName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400">
                          {formData.country === "United Kingdom"
                            ? "Sort Code"
                            : "Routing Number"}
                        </p>
                        <p className="text-sm font-mono">
                          {formData.bankInfo.routing}
                        </p>
                      </div>
                    </div>

                    {/* Displaying Account Name if user has typed a full account number */}
                    {formData.bankInfo.accountNumber.length > 5 && (
                      <div className="mt-2 pt-2 border-t border-primary/10">
                        <p className="text-[10px] uppercase text-slate-400">
                          Estimated Account Name
                        </p>
                        <p className="text-sm italic">
                          {formData.email
                            .split("@")[0]
                            .replace(".", " ")
                            .toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                  className={`h-11 bg-white dark:bg-zinc-900 ${
                    errors.includes("bankAccountName") ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
              <h3
                className={`font-semibold text-sm ${
                  errors.includes("agreement") ? "text-red-500" : ""
                }`}
              >
                Terms of Service
              </h3>
              <div className="h-32 overflow-y-auto text-[11px] text-slate-500 bg-slate-50 p-4 rounded-xl">
                Legal agreement text here...
              </div>
              <div className="flex items-start gap-3 p-3">
                <Checkbox
                  id="agree"
                  checked={formData.agreementAccepted}
                  onCheckedChange={(v) =>
                    updateFields({ agreementAccepted: !!v })
                  }
                />
                <Label htmlFor="agree" className="text-xs text-slate-500">
                  I accept the VaultStock Service Agreement.
                </Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={handleBack}
              >
                Previous
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl shadow-lg"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-10 shadow-sm text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">One last thing</h2>
            <div className="relative mx-auto w-44 h-44 group">
              {/* The decorative dashed border */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 group-hover:border-primary/60 transition-colors" />

              <div
                className="absolute inset-2 rounded-full bg-slate-50 dark:bg-zinc-900 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all"
                onClick={() => selfieRef.current?.click()}
              >
                {formData.selfie ? (
                  // Show Preview if file exists
                  <img
                    src={URL.createObjectURL(formData.selfie)}
                    className="h-full w-full object-cover"
                    alt="Selfie preview"
                  />
                ) : (
                  // Default Upload State
                  <>
                    <Upload className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                      Take Selfie
                    </span>
                  </>
                )}

                <input
                  type="file"
                  ref={selfieRef}
                  accept="image/*"
                  capture="user" // This triggers the front camera on mobile devices
                  hidden
                  onChange={(e) => handleFileChange(e, "selfie")}
                />
              </div>

              {/* Success Checkmark Badge */}
              {formData.selfie && (
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-zinc-950">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            <Button
              className="w-full h-12 rounded-xl text-sm font-bold shadow-xl"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
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
