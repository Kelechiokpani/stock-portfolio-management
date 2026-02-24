"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  CheckCircle2,
  Upload,
  User,
  FileText,
  Shield,
  PenTool,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {GENDER_OPTIONS, locationData} from "@/components/data/countries";



const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "KYC Documents", icon: FileText },
  { id: 3, label: "Agreement", icon: Shield },
  { id: 4, label: "Signature", icon: PenTool },
]





export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSettlementError, setShowSettlementError] = useState(false)

  // Refs for file inputs
  const idFrontRef = useRef<HTMLInputElement>(null)
  const idBackRef = useRef<HTMLInputElement>(null)
  const poaRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)



  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>("");

  const [formData, setFormData] = useState({
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
    partner: "",
    agreementAccepted: false,
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    // Auto-save simulation: Logic to push to backend or localstorage would go here
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">VaultStock</span>
            </Link>
            <span className="text-sm text-muted-foreground">Account Onboarding</span>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-10">
          {/* Progress Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">Step {currentStep} of {steps.length}</p>
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-6 flex justify-between">
              {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        step.id < currentStep ? "border-success bg-success text-success-foreground" :
                            step.id === currentStep ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                    }`}>
                      {step.id < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </div>
                  </div>
              ))}
            </div>
          </div>



            {currentStep === 1 && (
                <div className="rounded-xl border border-border bg-card p-6 lg:p-8 space-y-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Create Password & Profile</h2>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Email</Label>
                        <Input
                            value="newuser@gmail.com"
                            className="bg-background border-input focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Create Password</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-background border-input focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground ml-1">
                        Sex
                      </Label>
                      <Select
                          onValueChange={(v) => setFormData({...formData, sex: v})}
                          value={formData.sex} // Controlled component
                      >
                        <SelectTrigger
                            className="h-12 w-full bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all duration-200 rounded-lg outline-none"
                        >
                          <SelectValue placeholder="Select Sex"/>
                        </SelectTrigger>

                        <SelectContent
                            className="z-[100] min-w-[8rem] overflow-hidden rounded-xl border border-border bg-white dark:bg-zinc-950 text-popover-foreground shadow-2xl opacity-100 p-1"
                            position="popper"
                            sideOffset={6}
                        >
                          {GENDER_OPTIONS.map((gender: any) => (
                              <SelectItem
                                  key={gender.value}
                                  value={gender.value}
                                  className="rounded-md py-3 px-4 cursor-pointer outline-none
                                      focus:bg-emerald-50 focus:text-emerald-700
                                      dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400
                                      data-[state=checked]:bg-emerald-100 data-[state=checked]:text-emerald-800
                                      dark:data-[state=checked]:bg-emerald-900/40 dark:data-[state=checked]:text-emerald-300
                                      transition-colors duration-150"
                              >
                                {gender.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <hr className="my-2 border-border"/>
                    <h3 className="font-semibold text-foreground text-lg">Address Verification</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Country Selection */}
                      <div className="col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-foreground ml-1">Country 🚩</Label>
                        <Select onValueChange={(v) => {
                          setSelectedCountry(v);
                          setSelectedState("");
                          setFormData({...formData, country: v, state: "", city: ""});
                        }}>
                          <SelectTrigger
                              className="h-12 bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all rounded-lg">
                            <SelectValue placeholder="Select Country"/>
                          </SelectTrigger>
                          <SelectContent
                              className="z-[100] max-h-[300px] overflow-y-auto rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                            {locationData && Object.keys(locationData).sort().map((country) => (
                                <SelectItem
                                    key={country}
                                    value={country}
                                    className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors"
                                >
                                  {country}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* State Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground ml-1"> State / Province </Label>
                        <Select
                            disabled={!selectedCountry}
                            onValueChange={(v) => {
                              setSelectedState(v);
                              setFormData({...formData, state: v, city: ""});
                            }}
                            value={selectedState}
                        >
                          <SelectTrigger
                              className="h-12 bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 disabled:opacity-50 transition-all rounded-lg">
                            <SelectValue placeholder={selectedCountry ? "Select State" : "Select Country first"}/>
                          </SelectTrigger>
                          <SelectContent
                              className="z-[100] rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                            {selectedCountry && locationData[selectedCountry] && Object.keys(locationData[selectedCountry]).map((state) => (
                                <SelectItem
                                    key={state}
                                    value={state}
                                    className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors"
                                >
                                  {state}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* City Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground ml-1">City/Town</Label>
                        <Select
                            disabled={!selectedState}
                            onValueChange={(v) => setFormData({...formData, city: v})}
                        >
                          <SelectTrigger
                              className="h-12 bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 disabled:opacity-50 transition-all rounded-lg">
                            <SelectValue placeholder={selectedState ? "Select City" : "Select State first"}/>
                          </SelectTrigger>
                          <SelectContent
                              className="z-[100] rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                            {selectedCountry && selectedState && locationData[selectedCountry]?.[selectedState]?.map((city: string) => (
                                <SelectItem
                                    key={city}
                                    value={city}
                                    className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors"
                                >
                                  {city}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Manual Input Fields */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium ml-1">House Number</Label>
                        <Input placeholder="e.g. 12"
                               className="h-12 bg-background border-input focus:ring-emerald-500/20 focus:border-emerald-500 rounded-lg"/>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium ml-1">Street Address</Label>
                        <Input placeholder="Main St"
                               className="h-12 bg-background border-input focus:ring-emerald-500/20 focus:border-emerald-500 rounded-lg"/>
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label className="text-sm font-medium ml-1">Zip Code/Postal Code</Label>
                        <Input placeholder="100001"
                               className="h-12 bg-background border-input focus:ring-emerald-500/20 focus:border-emerald-500 rounded-lg"/>
                      </div>
                    </div>
                  </div>

                  <Button
                      className="w-4rem mt-4 h-10 text-xs  font-semibold shadow-lg transition-all active:scale-[0.98]"
                      onClick={handleNext}>
                    Save and Continue
                  </Button>
                </div>
            )}


          {/* STEP 2: KYC DOCUMENTS (ID, POA, NOMINEE) */}
          {currentStep === 2 && (
              <div className="rounded-xl border border-border bg-card p-6 lg:p-8 space-y-8 shadow-sm">
                {/* Identity Section */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Identity & Documents</h2>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground ml-1">Select Government ID Type</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, idType: v })}>
                      <SelectTrigger className="h-12 bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all rounded-lg">
                        <SelectValue placeholder="Select ID Document" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                        {["Passport", "Driver's License", "National ID Card", "Voter's ID Card"].map((item) => (
                            <SelectItem
                                key={item}
                                value={item.toLowerCase()}
                                className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors cursor-pointer"
                            >
                              {item}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Upload Front", ref: idFrontRef },
                      { label: "Upload Back", ref: idBackRef },
                    ].map((side, i) => (
                        <div
                            key={i}
                            className="group border-2 border-dashed border-muted hover:border-emerald-500/50 hover:bg-emerald-50/5 p-6 rounded-xl text-center cursor-pointer transition-all"
                            onClick={() => side.ref.current?.click()}
                        >
                          <Upload className="mx-auto h-6 w-6 mb-2 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                          <span className="text-xs font-medium text-foreground">{side.label}</span>
                          <input type="file" ref={side.ref} hidden />
                        </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic text-center">
                    Ensure name, address, and age are clearly visible.
                  </p>
                </section>

                {/* Proof of Address Section */}
                <section className="space-y-4 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground">Proof of Address (PoA)</h3>
                  <div className="space-y-2">
                    <Select onValueChange={(v) => setFormData({ ...formData, poaType: v })}>
                      <SelectTrigger className="h-12 bg-background border-input hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all rounded-lg">
                        <SelectValue placeholder="Select PoA Document" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                        {["Utility Bill", "Rent Receipt", "Water Bill"].map((item) => (
                            <SelectItem
                                key={item}
                                value={item.toLowerCase()}
                                className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors cursor-pointer"
                            >
                              {item}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                      className="group border-2 border-dashed border-muted hover:border-emerald-500/50 hover:bg-emerald-50/5 p-8 rounded-xl text-center cursor-pointer transition-all"
                      onClick={() => poaRef.current?.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    <span className="text-sm font-medium">Upload PoA Document</span>
                    <input type="file" ref={poaRef} hidden />
                  </div>
                </section>

                {/* Nominee Section */}
                <section className="space-y-4 pt-6 border-t border-border">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account Nominee</h3>
                    <p className="text-xs text-muted-foreground">Used in case of death or permanent incapacity.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input placeholder="First Name" className="h-11 bg-background border-input focus:border-emerald-500/50" />
                    <Input placeholder="Middle" className="h-11 bg-background border-input focus:border-emerald-500/50" />
                    <Input placeholder="Last Name" className="h-11 bg-background border-input focus:border-emerald-500/50" />
                  </div>

                  <Select>
                    <SelectTrigger className="h-11 bg-background border-input hover:border-emerald-500/50 rounded-lg">
                      <SelectValue placeholder="Relationship to Nominee" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl opacity-100 p-1">
                      {["Father", "Mother", "Wife", "Husband", "Son/Daughter"].map((rel) => (
                          <SelectItem
                              key={rel}
                              value={rel.toLowerCase()}
                              className="rounded-md py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-400 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:bg-emerald-900/40 transition-colors cursor-pointer"
                          >
                            {rel}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50/5 transition-colors cursor-pointer">
                    <Checkbox id="sameAddress" defaultChecked className="data-[state=checked]:bg-emerald-500 border-emerald-500" />
                    <Label htmlFor="sameAddress" className="text-sm font-normal cursor-pointer">
                      Nominee lives at my same address
                    </Label>
                  </div>
                </section>

                <Button
                    className="w-4rem mt-4 h-10 text-xs  font-semibold shadow-lg transition-all active:scale-[0.98]"
                    onClick={handleNext}>
                  Save and Continue
                </Button>
              </div>
          )}



          {/* STEP 3: AGREEMENT & SETTLEMENT */}
          {currentStep === 3 && (
              <div className="rounded-xl border bg-card p-6 lg:p-8 space-y-6">
                <h2 className="text-2xl font-bold">Settlement & Agreement</h2>

                <div className="space-y-4">
                  <Label>Redemption & Settlement Bank</Label>
                  <div className="grid gap-3 p-4 bg-muted rounded-lg">
                    <Input placeholder="Account Name" />
                    <Input placeholder="Account Number" />
                    <Input placeholder="Bank Name" />
                    <Input placeholder="USA Routing / Europe IBAN / Asia SWIFT" />
                  </div>

                  {showSettlementError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Trouble recording this info. Not appearing correct. We strongly advise you
                          <button className="underline font-bold ml-1" onClick={handleNext}>"Do this later"</button>.
                        </AlertDescription>
                      </Alert>
                  )}
                </div>

                <div className="mt-6 space-y-4 border-t pt-6">
                  <h3 className="font-semibold">FS Service Agreement</h3>
                  <div className="h-32 overflow-y-auto text-xs bg-muted p-3 rounded">
                    All FS Products are provided in accordance with this agreement. You agree to use our platform
                    responsibly and NEVER engage in illegitimate activity.
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox id="agree" onCheckedChange={(v) => setFormData({...formData, agreementAccepted: !!v})} />
                    <Label htmlFor="agree" className="text-xs leading-none">I understand and agree to the FS Terms of Use.</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={handleNext}>Do this later</Button>
                  <Button className="flex-1" onClick={() => setShowSettlementError(true)}>Continue</Button>
                </div>
              </div>
          )}

          {/* STEP 4: SIGNATURE & SELFIE */}
          {currentStep === 4 && (
              <div className="rounded-xl border bg-card p-6 lg:p-8 space-y-8 text-center">
                <h2 className="text-2xl font-bold">Final Verification</h2>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Take a clear photo of yourself for your FS Account headshot.</p>
                  <div className="mx-auto w-40 h-40 border-2 border-dashed rounded-full flex flex-col items-center justify-center bg-muted cursor-pointer" onClick={() => selfieRef.current?.click()}>
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs">Upload Selfie</span>
                    <input type="file" ref={selfieRef} hidden />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <p className="text-xs italic">Digital Signature: By clicking Finish, you affirm you shall be held liable for any fraudulent actions incongruent with this agreement.</p>
                  <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>Finish & Get FS Account</Button>
                </div>
              </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" className='bg-emerald-200 dark:text-white white:text-black' onClick={handleBack} disabled={currentStep === 1}>Back</Button>
          </div>
        </main>
      </div>
  )
}




// "use client"
//
// import { useState, useRef } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import {
//   TrendingUp,
//   CheckCircle2,
//   Upload,
//   User,
//   FileText,
//   Shield,
//   PenTool,
//   ArrowRight,
//   ArrowLeft,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Progress } from "@/components/ui/progress"
//
// const steps = [
//   { id: 1, label: "Personal Info", icon: User },
//   { id: 2, label: "KYC Documents", icon: FileText },
//   { id: 3, label: "Agreement", icon: Shield },
//   { id: 4, label: "Signature", icon: PenTool },
// ]
//
// const SOURCE_OF_FUNDS_OPTIONS = [
//   { value: "employment", label: "Employment Income" },
//   { value: "business", label: "Business Income" },
//   { value: "investments", label: "Investment Returns" },
//   { value: "inheritance", label: "Inheritance" },
//   { value: "savings", label: "Personal Savings" },
//   { value: "other", label: "Other" },
// ];
//
// export default function OnboardingPage() {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [useUploadSignature, setUseUploadSignature] = useState(false)
//   const [signatureFile, setSignatureFile] = useState<File | null>(null)
//   const [agreementAccepted, setAgreementAccepted] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const kycFrontRef = useRef<HTMLInputElement>(null)
//   const kycBackRef = useRef<HTMLInputElement>(null)
//   const kycSelfieRef = useRef<HTMLInputElement>(null)
//
//   const [personalInfo, setPersonalInfo] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     country: "",
//     dateOfBirth: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     occupation: "",
//     sourceOfFunds: "",
//   })
//
//   const [kycFiles, setKycFiles] = useState({
//     idFront: null as File | null,
//     idBack: null as File | null,
//     selfie: null as File | null,
//   })
//
//   const progress = (currentStep / steps.length) * 100
//
//   function handleNext() {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1)
//     }
//   }
//
//   function handleBack() {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }
//
//   function handleComplete() {
//     router.push("/dashboard")
//   }
//
//   function canProceed() {
//     switch (currentStep) {
//       case 1:
//         return (
//           personalInfo.dateOfBirth &&
//           personalInfo.address &&
//           personalInfo.city &&
//           personalInfo.postalCode &&
//           personalInfo.occupation &&
//           personalInfo.sourceOfFunds
//         )
//       case 2:
//         return kycFiles.idFront && kycFiles.idBack && kycFiles.selfie
//       case 3:
//         return agreementAccepted
//       case 4:
//         return !useUploadSignature || (useUploadSignature && signatureFile)
//       default:
//         return false
//     }
//   }
//
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card">
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//               <TrendingUp className="h-5 w-5 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold text-foreground tracking-tight">VaultStock</span>
//           </Link>
//           <span className="text-sm text-muted-foreground">Account Onboarding</span>
//         </div>
//       </header>
//
//       <main className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
//         {/* Progress */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-sm font-medium text-foreground">
//               Step {currentStep} of {steps.length}
//             </p>
//             <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
//           </div>
//           <Progress value={progress} className="h-2" />
//           <div className="mt-6 flex justify-between">
//             {steps.map((step) => (
//               <div key={step.id} className="flex flex-col items-center gap-2">
//                 <div
//                   className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
//                     step.id < currentStep
//                       ? "border-success bg-success text-success-foreground"
//                       : step.id === currentStep
//                       ? "border-primary bg-primary text-primary-foreground"
//                       : "border-border bg-card text-muted-foreground"
//                   }`}
//                 >
//                   {step.id < currentStep ? (
//                     <CheckCircle2 className="h-5 w-5" />
//                   ) : (
//                     <step.icon className="h-5 w-5" />
//                   )}
//                 </div>
//                 <span
//                   className={`hidden text-xs font-medium sm:block ${
//                     step.id === currentStep ? "text-foreground" : "text-muted-foreground"
//                   }`}
//                 >
//                   {step.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//
//         {/* Step 1: Personal Info */}
//         {currentStep === 1 && (
//           <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
//             <h2 className="font-serif text-2xl font-bold text-foreground">Complete Your Profile</h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Some information has been pre-filled from your application. Please complete the remaining fields.
//             </p>
//
//             <div className="mt-8 grid gap-6 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input id="fullName" value={personalInfo.fullName}
//                        onChange={(e) =>
//                            setPersonalInfo({...personalInfo, fullName: e.target.value})
//                        }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" value={personalInfo.email}
//                        onChange={(e) =>
//                            setPersonalInfo({...personalInfo, email: e.target.value})
//                        }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input id="phone" value={personalInfo.phone}
//
//                        onChange={(e) =>
//                            setPersonalInfo({...personalInfo, phone: e.target.value})
//                        }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="country">Country</Label>
//                 <Input id="country" value={personalInfo.country}
//                        onChange={(e) =>
//                            setPersonalInfo({...personalInfo, country: e.target.value})
//                        }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dob">Date of Birth</Label>
//                 <Input
//                     id="dob"
//                     type="date"
//                     value={personalInfo.dateOfBirth}
//                     onChange={(e) =>
//                         setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})
//                     }
//                     required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="occupation">Occupation</Label>
//                 <Input
//                     id="occupation"
//                     placeholder="e.g., Software Engineer"
//                     value={personalInfo.occupation}
//                     onChange={(e) =>
//                         setPersonalInfo({...personalInfo, occupation: e.target.value})
//                     }
//                     required
//                 />
//               </div>
//               <div className="sm:col-span-2 space-y-2">
//                 <Label htmlFor="address">Street Address</Label>
//                 <Input
//                     id="address"
//                     placeholder="123 Main Street"
//                     value={personalInfo.address}
//                     onChange={(e) =>
//                         setPersonalInfo({...personalInfo, address: e.target.value})
//                     }
//                     required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="city">City</Label>
//                 <Input
//                     id="city"
//                     placeholder="New York"
//                     value={personalInfo.city}
//                     onChange={(e) =>
//                         setPersonalInfo({...personalInfo, city: e.target.value})
//                     }
//                     required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="postalCode">Postal Code</Label>
//                 <Input
//                     id="postalCode"
//                     placeholder="10001"
//                     value={personalInfo.postalCode}
//                     onChange={(e) =>
//                         setPersonalInfo({...personalInfo, postalCode: e.target.value})
//                     }
//                     required
//                 />
//               </div>
//               <div className="sm:col-span-2 space-y-2">
//                 <Label htmlFor="sourceOfFunds">Source of Funds</Label>
//                 <Select
//                     value={personalInfo.sourceOfFunds}
//                     onValueChange={(value) =>
//                         setPersonalInfo({...personalInfo, sourceOfFunds: value})
//                     }
//                 >
//                   <SelectTrigger
//                       className="w-full h-12 rounded-lg border-muted-foreground/20 bg-background focus:ring-0">
//                     <SelectValue placeholder="Select source of funds"/>
//                   </SelectTrigger>
//
//                   <SelectContent
//                       className="z-50 bg-white dark:bg-zinc-950 text-popover-foreground border-border shadow-2xl min-w-[14rem] rounded-xl overflow-hidden p-1 border opacity-100">
//                     {SOURCE_OF_FUNDS_OPTIONS.map((option) => (
//                         <SelectItem
//                             key={option.value}
//                             value={option.value}
//                             className="relative flex w-full cursor-pointer select-none items-start flex-col py-3 px-4 mt-1 outline-none rounded-md transition-all focus:bg-zinc-100 dark:focus:bg-zinc-800 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary"
//                         >
//                           {option.label}
//                         </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )}
//
//         {/* Step 2: KYC Documents */}
//         {currentStep === 2 && (
//             <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
//               <h2 className="font-serif text-2xl font-bold text-foreground">KYC Verification</h2>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Upload your identity documents for verification. All documents are encrypted and stored securely.
//               </p>
//
//               <div className="mt-8 space-y-6">
//                 {/* ID Front */}
//                 <div className="space-y-2">
//                   <Label>Government ID (Front)</Label>
//                   <p className="text-xs text-muted-foreground">
//                     Upload the front of your passport, driver license, or national ID card.
//                   </p>
//                   <div
//                       onClick={() => kycFrontRef.current?.click()}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") kycFrontRef.current?.click()
//                       }}
//                       role="button"
//                       tabIndex={0}
//                       className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-accent/50 ${
//                     kycFiles.idFront
//                       ? "border-success bg-success/5"
//                       : "border-border"
//                   }`}
//                 >
//                   <input
//                     ref={kycFrontRef}
//                     type="file"
//                     accept="image/*,.pdf"
//                     className="hidden"
//                     onChange={(e) => {
//                       if (e.target.files?.[0]) {
//                         setKycFiles({ ...kycFiles, idFront: e.target.files[0] })
//                       }
//                     }}
//                   />
//                   <div className="text-center">
//                     {kycFiles.idFront ? (
//                       <>
//                         <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           {kycFiles.idFront.name}
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">Click to replace</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           Click to upload
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">
//                           PNG, JPG, or PDF up to 10MB
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//
//               {/* ID Back */}
//               <div className="space-y-2">
//                 <Label>Government ID (Back)</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Upload the back of your identification document.
//                 </p>
//                 <div
//                   onClick={() => kycBackRef.current?.click()}
//                   onKeyDown={(e) => { if (e.key === "Enter") kycBackRef.current?.click() }}
//                   role="button"
//                   tabIndex={0}
//                   className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-accent/50 ${
//                     kycFiles.idBack
//                       ? "border-success bg-success/5"
//                       : "border-border"
//                   }`}
//                 >
//                   <input
//                     ref={kycBackRef}
//                     type="file"
//                     accept="image/*,.pdf"
//                     className="hidden"
//                     onChange={(e) => {
//                       if (e.target.files?.[0]) {
//                         setKycFiles({ ...kycFiles, idBack: e.target.files[0] })
//                       }
//                     }}
//                   />
//                   <div className="text-center">
//                     {kycFiles.idBack ? (
//                       <>
//                         <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           {kycFiles.idBack.name}
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">Click to replace</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           Click to upload
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">
//                           PNG, JPG, or PDF up to 10MB
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//
//               {/* Selfie */}
//               <div className="space-y-2">
//                 <Label>Selfie with ID</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Upload a clear photo of yourself holding your ID document.
//                 </p>
//                 <div
//                   onClick={() => kycSelfieRef.current?.click()}
//                   onKeyDown={(e) => { if (e.key === "Enter") kycSelfieRef.current?.click() }}
//                   role="button"
//                   tabIndex={0}
//                   className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-accent/50 ${
//                     kycFiles.selfie
//                       ? "border-success bg-success/5"
//                       : "border-border"
//                   }`}
//                 >
//                   <input
//                     ref={kycSelfieRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) => {
//                       if (e.target.files?.[0]) {
//                         setKycFiles({ ...kycFiles, selfie: e.target.files[0] })
//                       }
//                     }}
//                   />
//                   <div className="text-center">
//                     {kycFiles.selfie ? (
//                       <>
//                         <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           {kycFiles.selfie.name}
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">Click to replace</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                         <p className="mt-2 text-sm font-medium text-foreground">
//                           Click to upload
//                         </p>
//                         <p className="mt-1 text-xs text-muted-foreground">
//                           PNG or JPG up to 10MB
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//
//         {/* Step 3: Agreement */}
//         {currentStep === 3 && (
//           <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
//             <h2 className="font-serif text-2xl font-bold text-foreground">Investment Agreement</h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Please read and accept the following agreement to proceed with your account setup.
//             </p>
//
//             <div className="mt-8 max-h-96 overflow-y-auto rounded-lg border border-border bg-muted p-6">
//               <h3 className="text-lg font-semibold text-foreground">
//                 VaultStock Investment Services Agreement
//               </h3>
//               <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
//                 <p>
//                   This Investment Services Agreement (&quot;Agreement&quot;) is entered into between you (&quot;Client&quot;)
//                   and VaultStock Investment Management Ltd. (&quot;VaultStock&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
//                 </p>
//                 <p>
//                   <strong className="text-foreground">1. Account Services</strong><br />
//                   VaultStock agrees to provide the Client with access to our investment platform,
//                   including portfolio management tools, market data, and trading capabilities
//                   subject to the terms of this Agreement.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">2. Client Representations</strong><br />
//                   The Client represents and warrants that: (a) all information provided during
//                   registration and KYC verification is true, accurate, and complete; (b) the
//                   Client is of legal age to enter into this Agreement; (c) the funds used for
//                   investment are from legitimate sources.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">3. Investment Risks</strong><br />
//                   The Client acknowledges that investing in securities involves risk, including
//                   the potential loss of principal. Past performance does not guarantee future
//                   results. VaultStock does not provide investment advice or guarantee returns.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">4. Fees and Charges</strong><br />
//                   The Client agrees to pay all applicable fees as outlined in the Fee Schedule,
//                   which may be amended from time to time with prior notice. Fees may include
//                   management fees, transaction fees, and applicable taxes.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">5. Confidentiality</strong><br />
//                   VaultStock will maintain the confidentiality of Client information in
//                   accordance with applicable data protection laws and our Privacy Policy.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">6. Account Termination</strong><br />
//                   Either party may terminate this Agreement with 30 days written notice.
//                   Upon termination, the Client&apos;s positions will be liquidated or transferred
//                   according to their instructions.
//                 </p>
//                 <p>
//                   <strong className="text-foreground">7. Governing Law</strong><br />
//                   This Agreement shall be governed by and construed in accordance with the
//                   laws of the applicable jurisdiction.
//                 </p>
//               </div>
//             </div>
//
//             <div className="mt-6 flex items-start gap-3">
//               <Checkbox
//                 id="agreement"
//                 checked={agreementAccepted}
//                 onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
//               />
//               <label
//                 htmlFor="agreement"
//                 className="text-sm leading-relaxed text-foreground cursor-pointer"
//               >
//                 I have read, understood, and agree to the VaultStock Investment Services
//                 Agreement and all terms and conditions outlined above.
//               </label>
//             </div>
//           </div>
//         )}
//
//         {/* Step 4: Signature */}
//         {currentStep === 4 && (
//           <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
//             <h2 className="font-serif text-2xl font-bold text-foreground">Sign Your Agreement</h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Provide your signature to finalize the onboarding process.
//             </p>
//
//             <div className="mt-8">
//               {/* Signature display */}
//               <div className="rounded-lg border border-border bg-muted p-8 text-center">
//                 <Label className="text-xs uppercase tracking-wider text-muted-foreground">
//                   Your Signature
//                 </Label>
//                 {useUploadSignature && signatureFile ? (
//                   <div className="mt-4">
//                     <p className="text-sm text-muted-foreground">Uploaded: {signatureFile.name}</p>
//                     <div className="mt-2 flex h-20 items-center justify-center rounded border border-border bg-card">
//                       <CheckCircle2 className="h-6 w-6 text-success" />
//                       <span className="ml-2 text-sm text-foreground">Signature uploaded</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mt-4">
//                     <p className="font-serif text-3xl italic text-foreground">
//                       {personalInfo.fullName}
//                     </p>
//                     <p className="mt-2 text-xs text-muted-foreground">
//                       Default signature based on your account name
//                     </p>
//                   </div>
//                 )}
//               </div>
//
//               {/* Toggle */}
//               <div className="mt-6 flex items-center justify-between rounded-lg border border-border p-4">
//                 <div>
//                   <p className="text-sm font-medium text-foreground">Upload custom signature</p>
//                   <p className="text-xs text-muted-foreground">
//                     Replace the default name signature with an uploaded image
//                   </p>
//                 </div>
//                 <Button
//                   variant={useUploadSignature ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => {
//                     setUseUploadSignature(!useUploadSignature)
//                     if (useUploadSignature) setSignatureFile(null)
//                   }}
//                 >
//                   {useUploadSignature ? "Using Upload" : "Use Upload"}
//                 </Button>
//               </div>
//
//               {/* Upload area */}
//               {useUploadSignature && (
//                 <div className="mt-4">
//                   <div
//                     onClick={() => fileInputRef.current?.click()}
//                     onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click() }}
//                     role="button"
//                     tabIndex={0}
//                     className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-accent/50"
//                   >
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         if (e.target.files?.[0]) {
//                           setSignatureFile(e.target.files[0])
//                         }
//                       }}
//                     />
//                     <div className="text-center">
//                       <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
//                       <p className="mt-2 text-sm text-foreground">
//                         {signatureFile ? signatureFile.name : "Click to upload signature image"}
//                       </p>
//                       <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 5MB</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//
//         {/* Navigation */}
//         <div className="mt-8 flex items-center justify-between">
//           <Button
//             variant="outline"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//           >
//             <ArrowLeft className="mr-1 h-4 w-4" />
//             Back
//           </Button>
//
//           {currentStep < steps.length ? (
//             <Button onClick={handleNext} disabled={!canProceed()}>
//               Continue
//               <ArrowRight className="ml-1 h-4 w-4" />
//             </Button>
//           ) : (
//             <Button
//               onClick={handleComplete}
//               disabled={!canProceed()}
//               className="bg-success text-success-foreground hover:bg-success/90"
//             >
//               Complete Onboarding
//               <CheckCircle2 className="ml-1 h-4 w-4" />
//             </Button>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }
