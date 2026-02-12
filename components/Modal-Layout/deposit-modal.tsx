"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {PaymentMethod} from "@/lib/user-date";

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethods: PaymentMethod[]
}

export function DepositModal({
  isOpen,
  onClose,
  paymentMethods,
}: DepositModalProps) {
  const [step, setStep] = useState<"amount" | "method" | "review" | "success">(
    "amount"
  )
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]?.id || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    setSelectedMethod(paymentMethods[0]?.id || "")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "amount" && (
          <>
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to deposit to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (EUR)</Label>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label>Suggested Amounts</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000, 2500, 5000, 10000].map((val) => (
                    <Button
                      key={val}
                      variant={amount === val.toString() ? "default" : "outline"}
                      onClick={() => setAmount(val.toString())}
                      className="text-sm"
                    >
                      €{val}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("method")}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "method" && (
          <>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
              <DialogDescription>
                Choose how you want to deposit funds
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex cursor-pointer items-center gap-3 flex-1 p-2 rounded-lg border border-transparent hover:border-border hover:bg-accent/50"
                    >
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.details}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("amount")}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={() => setStep("review")} className="flex-1">
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "review" && (
          <>
            <DialogHeader>
              <DialogTitle>Review Deposit</DialogTitle>
              <DialogDescription>
                Confirm your deposit details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-accent/50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">
                    €{parseFloat(amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">
                    €{parseFloat(amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-info/10 border border-info/20 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <p className="text-sm text-info">
                  Your deposit will be processed within 1-2 business days
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("method")}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleDeposit}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : "Confirm Deposit"}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Deposit Successful</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  €{parseFloat(amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  has been deposited to your account
                </p>
              </div>
              <div className="rounded-lg bg-accent/50 border border-border p-3 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Transaction ID:</span>{" "}
                  <span className="font-mono font-medium">TXN-202602-1847</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium text-success">Processing</span>
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
