"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Plus,
  ArrowUpRight,
  Clock,
  AlertCircle,
  LineChart,
  Wallet,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { CreatePortfolioModal } from "@/components/create-portfolio-modal"

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Simulating user state: switch between "pending_approval" and "approved" to see both UIs
  const [accountApproved] = useState(true)
  const user = mockUsers[0]
  const portfolios = user.portfolios

  const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalGain = portfolios.reduce((sum, p) => sum + p.totalGain, 0)

  if (!accountApproved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Account Pending Approval
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground leading-relaxed">
          Your account is currently under review by our team. You will be notified 
          via email once your account has been approved and you can start investing.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Estimated review time: 24-48 hours</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Welcome back, {user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {"Here's an overview of your investment portfolio."}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Balance</p>
              <p className="text-2xl font-bold text-foreground">
                €{user.accountBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold text-foreground">
                €{totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${totalGain >= 0 ? "bg-success/10" : "bg-destructive/10"}`}>
              {totalGain >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${totalGain >= 0 ? "text-success" : "text-destructive"}`}>
                {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Briefcase className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolios</p>
              <p className="text-2xl font-bold text-foreground">{portfolios.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Holdings</p>
              <p className="text-2xl font-bold text-foreground">
                {portfolios.reduce((sum, p) => sum + p.holdings.length, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolios */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Your Portfolios</h2>
        {portfolios.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No portfolios yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first portfolio to start investing.
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="mt-6 gap-2">
                <Plus className="h-4 w-4" />
                Create Portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{portfolio.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{portfolio.uniqueIdentifier}</p>
                  </div>
                  <Badge variant={portfolio.status === "active" ? "default" : "secondary"}>
                    {portfolio.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-foreground">
                      ${portfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm font-medium ${portfolio.totalGain >= 0 ? "text-success" : "text-destructive"}`}>
                      {portfolio.totalGain >= 0 ? "+" : ""}
                      {portfolio.gainPercent.toFixed(2)}%
                    </p>
                  </div>

                  {/* Holdings preview */}
                  <div className="mt-4 space-y-2">
                    {portfolio.holdings.slice(0, 3).map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{holding.symbol}</span>
                          <span className="text-muted-foreground">{holding.shares} shares</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">
                            ${holding.currentPrice.toFixed(2)}
                          </span>
                          <span className={`text-xs ${holding.change >= 0 ? "text-success" : "text-destructive"}`}>
                            {holding.change >= 0 ? "+" : ""}
                            {holding.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/dashboard/portfolios">
                    <Button variant="ghost" size="sm" className="mt-4 w-full gap-1 text-accent">
                      View Details
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/funds">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Manage Funds</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deposit or withdraw
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/investments">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">View Investments</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor performance
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/transfers">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Transfer Portfolio</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Send to other users
                </p>
              </CardContent>
            </Card>
          </Link>

          <div>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setShowCreateModal(true)}>
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Create Portfolio</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add new investment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreatePortfolioModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
