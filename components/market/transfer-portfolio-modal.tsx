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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import type { Portfolio } from "@/lib/mock-data"

interface TransferPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  portfolios: Portfolio[]
}

export function TransferPortfolioModal({
  isOpen,
  onClose,
  portfolios,
}: TransferPortfolioModalProps) {
  const [step, setStep] = useState<"select" | "recipient" | "confirm" | "success">(
    "select"
  )
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientUserId, setRecipientUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  const handleTransfer = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("select")
    setSelectedPortfolioId("")
    setRecipientEmail("")
    setRecipientUserId("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Portfolio</DialogTitle>
              <DialogDescription>
                Select the portfolio you want to transfer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio-select">Portfolio</Label>
                <Select
                  value={selectedPortfolioId}
                  onValueChange={setSelectedPortfolioId}
                >
                  <SelectTrigger id="portfolio-select">
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        <div className="flex items-center gap-2">
                          <span>{portfolio.name}</span>
                          <span className="text-muted-foreground">
                            (€
                            {portfolio.totalValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })
                            })
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPortfolio && (
                <div className="rounded-lg bg-accent/50 border border-border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portfolio Value</span>
                    <span className="font-semibold">
                      €
                      {selectedPortfolio.totalValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Holdings</span>
                    <span className="font-semibold">
                      {selectedPortfolio.holdings.length} stocks
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gain/Loss</span>
                    <span
                      className={`font-semibold ${
                        selectedPortfolio.totalGain >= 0
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {selectedPortfolio.totalGain >= 0 ? "+" : ""}€
                      {selectedPortfolio.totalGain.toLocaleString("en-US", {
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
                onClick={() => setStep("recipient")}
                disabled={!selectedPortfolioId}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "recipient" && (
          <>
            <DialogHeader>
              <DialogTitle>Recipient Details</DialogTitle>
              <DialogDescription>
                Who do you want to send this portfolio to?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-id">Or User ID</Label>
                <Input
                  id="user-id"
                  placeholder="user-123"
                  value={recipientUserId}
                  onChange={(e) => setRecipientUserId(e.target.value)}
                />
              </div>
              <div className="rounded-lg bg-info/10 border border-info/20 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <p className="text-sm text-info">
                  The recipient will need to approve this transfer
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={!recipientEmail && !recipientUserId}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>
                Review the transfer details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-accent/50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Portfolio</span>
                  <span className="font-semibold">{selectedPortfolio?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Portfolio Value</span>
                  <span className="font-semibold">
                    €
                    {selectedPortfolio?.totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-muted-foreground">Send To</span>
                  <span className="font-semibold">
                    {recipientEmail || recipientUserId}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-warning">
                  Once transferred, you will no longer have access to this portfolio
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("recipient")}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleTransfer}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send Transfer"}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Sent Successfully</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {selectedPortfolio?.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  has been sent to {recipientEmail || recipientUserId}
                </p>
              </div>
              <div className="rounded-lg bg-accent/50 border border-border p-3 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Transfer ID:</span>{" "}
                  <span className="font-mono font-medium">TRF-202602-7841</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium text-warning">Pending Acceptance</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                The recipient will receive a notification and must accept this transfer
                within 30 days
              </p>
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
