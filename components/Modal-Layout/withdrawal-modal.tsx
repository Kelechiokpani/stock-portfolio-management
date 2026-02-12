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



interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  paymentMethods: PaymentMethod[]
}

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  paymentMethods,
}: WithdrawalModalProps) {
  const [step, setStep] = useState<"amount" | "method" | "review" | "success">(
    "amount"
  )
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(
    paymentMethods.find((m) => m.isDefault)?.id || paymentMethods[0]?.id || ""
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleWithdraw = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    onClose()
  }

  const amountNum = parseFloat(amount) || 0
  const fee = amountNum > 0 ? Math.max(5, amountNum * 0.01) : 0
  const totalWithFee = amountNum + fee

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "amount" && (
          <>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to withdraw from your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-accent/50 border border-border p-3">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground">
                  €{availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawal-amount">Amount (EUR)</Label>
                <Input
                  id="withdrawal-amount"
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                  max={availableBalance}
                />
              </div>
              {amountNum > 0 && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium text-foreground">
                      €{amountNum.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="font-medium text-foreground">
                      €{fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-border pt-1 flex justify-between text-foreground font-medium">
                    <span>Total to Withdraw:</span>
                    <span>
                      €{totalWithFee.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("method")}
                disabled={
                  !amount || amountNum <= 0 || amountNum > availableBalance
                }
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
              <DialogTitle>Select Destination</DialogTitle>
              <DialogDescription>
                Where do you want to receive the funds?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {paymentMethods
                  .filter((m) => m.type === "bank_transfer")
                  .map((method) => (
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
              <DialogTitle>Review Withdrawal</DialogTitle>
              <DialogDescription>
                Confirm your withdrawal details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-accent/50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">
                    €{amountNum.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold">
                    €{fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-semibold">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">
                    €{totalWithFee.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-warning">
                  Withdrawals take 2-3 business days to process
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
                onClick={handleWithdraw}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Withdrawal Submitted</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  €{totalWithFee.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Withdrawal is being processed
                </p>
              </div>
              <div className="rounded-lg bg-accent/50 border border-border p-3 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Transaction ID:</span>{" "}
                  <span className="font-mono font-medium">WTH-202602-5024</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium text-warning">Pending</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Expected:</span>{" "}
                  <span className="font-medium">2-3 business days</span>
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
