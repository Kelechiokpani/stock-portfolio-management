"use client"

import { useRouter } from "next/navigation"
import { Briefcase, ArrowRight, Plus, GitMerge } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface CreatePortfolioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePortfolioModal({ open, onOpenChange }: CreatePortfolioModalProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create a Portfolio</DialogTitle>
          <DialogDescription>
            Choose how you would like to set up your new investment portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false)
              router.push("/dashboard/portfolio/new")
            }}
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:bg-muted"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Create New Portfolio</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Select stocks from global markets and build a custom portfolio from scratch.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenChange(false)
              router.push("/dashboard/portfolio/inherit")
            }}
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-accent/30 hover:bg-muted"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
              <GitMerge className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Inherit a Portfolio</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Transfer an existing portfolio using its unique identifier and authorization code.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
