"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"



type TransferState = "form" | "processing" | "completed"

export default function InheritPortfolioPage() {

  const router = useRouter()
  const [state, setState] = useState<TransferState>("form")
  const [identifier, setIdentifier] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState("48:00:00")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("processing")
  }

  // Simulate transfer progress
  useEffect(() => {
    if (state !== "processing") return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setState("completed")
          return 100
        }
        return prev + 2
      })
    }, 300)

    return () => clearInterval(interval)
  }, [state])

  // Update time display based on progress
  useEffect(() => {
    if (state !== "processing") return
    const hoursRemaining = Math.max(0, 48 - (progress / 100) * 48)
    const hours = Math.floor(hoursRemaining)
    const minutes = Math.floor((hoursRemaining - hours) * 60)
    setTimeRemaining(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`)
  }, [progress, state])


  return (
    <div>

      <button
          onClick={() => router.back()}
         className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-lg">
        {state === "form" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-foreground">Inherit a Portfolio</h1>
            <p className="mt-1 text-muted-foreground">
              Enter the portfolio unique identifier and authorization code to initiate the transfer.
            </p>

            <Card className="mt-8">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Portfolio Unique Identifier</Label>
                    <Input
                      id="identifier"
                      placeholder="e.g., VP-2026-GRW-001"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This can be found on the original portfolio documentation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authCode">Authorization Code</Label>
                    <Input
                      id="authCode"
                      placeholder="e.g., AUTH-XK9P2M"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The authorization code provided by the portfolio owner.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Initiate Transfer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {state === "processing" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-foreground text-center">
              Transfer in Progress
            </h1>
            <p className="mt-1 text-center text-muted-foreground">
              Your portfolio transfer is being processed. This may take up to 48 hours.
            </p>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  Processing Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Transfer Progress</span>
                    <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Estimated time remaining</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-foreground">{timeRemaining}</span>
                </div>

                <div className="space-y-3">
                  <TransferStep label="Verification initiated" completed={progress >= 10} />
                  <TransferStep label="Portfolio validation" completed={progress >= 30} />
                  <TransferStep label="Authorization confirmed" completed={progress >= 50} />
                  <TransferStep label="Asset transfer in progress" completed={progress >= 70} />
                  <TransferStep label="Final settlement" completed={progress >= 90} />
                  <TransferStep label="Transfer complete" completed={progress >= 100} />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {state === "completed" && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
              Transfer Complete
            </h1>
            <p className="mt-2 text-muted-foreground">
              The portfolio has been successfully transferred to your account. 
              You can now view and manage it from your dashboard.
            </p>

              <Button onClick={() => router.back()}
                  className="mt-8"> Back
              </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function TransferStep({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          completed ? "bg-success" : "bg-muted border border-border"
        }`}
      >
        {completed && <CheckCircle2 className="h-4 w-4 text-success-foreground" />}
      </div>
      <span className={`text-sm ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}
