'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, User, Mail, Lock, Phone, Upload } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    acceptTerms: false,
    governmentId: null as File | null,
    proofOfAddress: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'governmentId' | 'proofOfAddress') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        [fileType]: file,
      })
    }
  }

  const handleNextStep = () => {
    setError('')
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long')
        return
      }
    } else if (step === 2) {
      if (!formData.phone || !formData.address || !formData.city || !formData.country) {
        setError('Please fill in all address fields')
        return
      }
    } else if (step === 3) {
      if (!formData.governmentId || !formData.proofOfAddress) {
        setError('Please upload both government ID and proof of address documents')
        return
      }
    } else if (step === 4) {
      if (!formData.acceptTerms) {
        setError('You must accept the terms and conditions')
        return
      }
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to login or success page
      window.location.href = '/login'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-6 h-6" /> : i}
                </div>
                {i < 4 && <div className={`w-12 h-1 mx-2 ${i < step ? 'bg-primary' : 'bg-secondary'}`}></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Account</span>
            <span>Address</span>
            <span>Verification</span>
            <span>Review</span>
          </div>
        </div>

        <Card className="bg-card border-border p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h2>
                <p className="text-muted-foreground">Start your investment journey with us</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {error && <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm">{error}</div>}

              <Button onClick={handleNextStep} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Address Information</h2>
                <p className="text-muted-foreground">Help us verify your identity</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm">{error}</div>}

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Identity Verification</h2>
                <p className="text-muted-foreground">Upload documents for KYC verification</p>
              </div>

              <div className="space-y-4">
                {/* Government ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Government-Issued ID</label>
                  <p className="text-xs text-muted-foreground mb-3">Passport, driver's license, or national ID card</p>
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg bg-secondary hover:border-primary transition cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-foreground font-medium">{formData.governmentId ? formData.governmentId.name : 'Click to upload or drag and drop'}</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'governmentId')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Proof of Address Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Proof of Address</label>
                  <p className="text-xs text-muted-foreground mb-3">Utility bill, bank statement, or rental agreement</p>
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg bg-secondary hover:border-primary transition cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-foreground font-medium">{formData.proofOfAddress ? formData.proofOfAddress.name : 'Click to upload or drag and drop'}</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'proofOfAddress')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Privacy Notice:</span> Your documents are encrypted and securely stored for verification purposes only.
                </p>
              </div>

              {error && <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm">{error}</div>}

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Review & Confirm</h2>
                <p className="text-muted-foreground">Please review your information before submitting</p>
              </div>

              <div className="space-y-4 bg-secondary p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-foreground font-semibold">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground font-semibold">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-foreground font-semibold">
                    {formData.address}, {formData.city}, {formData.country}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-border mt-1"
                  />
                  <span className="ml-3 text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {error && <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm">{error}</div>}

              <div className="flex gap-4">
                <Button onClick={() => setStep(3)} variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
