'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface TransferredPortfolio {
  id: string
  name: string
  value: number
  holdings: number
  owner: string
  createdDate: string
  lastUpdated: string
}

export default function PortfolioTransferPage() {
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input')
  const [portfolioId, setPortfolioId] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [transferredPortfolio, setTransferredPortfolio] = useState<TransferredPortfolio | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call to fetch portfolio details
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (portfolioId.length < 8) {
      setError('Portfolio ID must be at least 8 characters')
      setLoading(false)
      return
    }

    if (authCode.length < 6) {
      setError('Authorization code must be at least 6 characters')
      setLoading(false)
      return
    }

    // Mock portfolio data (in real app, fetch from API)
    const mockPortfolio: TransferredPortfolio = {
      id: portfolioId,
      name: 'Tech Growth Portfolio',
      value: 68500.75,
      holdings: 12,
      owner: 'John Doe',
      createdDate: '2024-01-15',
      lastUpdated: 'Today'
    }

    setTransferredPortfolio(mockPortfolio)
    setStep('preview')
    setLoading(false)
  }

  const handleCompleteTransfer = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStep('success')
    setLoading(false)
  }

  const handleReset = () => {
    setStep('input')
    setPortfolioId('')
    setAuthCode('')
    setError('')
    setTransferredPortfolio(null)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolio Transfer</h1>
            <p className="text-xs text-muted-foreground">Receive or inherit a portfolio from another investor</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'input' && (
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Request Portfolio Transfer</h2>
              <p className="text-muted-foreground mb-6">
                Enter the portfolio unique identifier and authorization code provided by the portfolio owner to initiate the transfer.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Portfolio Unique Identifier
                  </label>
                  <input
                    type="text"
                    value={portfolioId}
                    onChange={(e) => setPortfolioId(e.target.value)}
                    placeholder="e.g., PF-XXXXXXXXXXXX"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can find this in the portfolio sharing settings
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Authorization Code
                  </label>
                  <input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The portfolio owner will provide this security code
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !portfolioId || !authCode}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Preview'}
                </Button>
              </form>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/30 p-6">
              <h3 className="font-semibold text-foreground mb-2">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Get the portfolio identifier and authorization code from the portfolio owner</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Enter both credentials here to verify and preview the portfolio</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Review all portfolio details before confirming the transfer</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Complete the transfer and start managing your new portfolio</span>
                </li>
              </ul>
            </Card>
          </div>
        )}

        {step === 'preview' && transferredPortfolio && (
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Review Portfolio Details</h2>

              {/* Portfolio Overview */}
              <div className="space-y-6">
                {/* Header Info */}
                <div className="border-b border-border pb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{transferredPortfolio.name}</h3>
                  <p className="text-muted-foreground">From: <span className="font-semibold text-foreground">{transferredPortfolio.owner}</span></p>
                </div>

                {/* Key Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${transferredPortfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Holdings</p>
                    <p className="text-2xl font-bold text-foreground">{transferredPortfolio.holdings} stocks</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="text-2xl font-bold text-foreground">{transferredPortfolio.createdDate}</p>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    ✓ Portfolio verified and ready for transfer
                  </p>
                  <p className="text-sm text-foreground">
                    By completing this transfer, you will have full ownership and management rights over this portfolio.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary bg-transparent text-foreground"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteTransfer}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? 'Processing...' : 'Complete Transfer'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-500/20 to-card border-green-500/30 p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Transfer Successful!</h2>
              <p className="text-muted-foreground mb-6">
                The portfolio "{transferredPortfolio?.name}" has been successfully transferred to your account.
              </p>

              <div className="bg-secondary rounded-lg p-6 mb-6 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Portfolio Name:</span>
                  <span className="font-semibold text-foreground">{transferredPortfolio?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Portfolio Value:</span>
                  <span className="font-semibold text-foreground">
                    ${transferredPortfolio?.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Holdings:</span>
                  <span className="font-semibold text-foreground">{transferredPortfolio?.holdings} stocks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transfer Date:</span>
                  <span className="font-semibold text-foreground">Today</span>
                </div>
              </div>

              <Link href="/dashboard" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Dashboard
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
