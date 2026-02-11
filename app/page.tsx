"use client"

import Link from "next/link"
import {
  TrendingUp,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  ChevronRight,
  LineChart,
  Lock,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">VaultStock</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#markets" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Markets
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/request-account">
              <Button size="sm">
                Request Access
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, hsl(199 70% 44%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(213 56% 35%) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <span className="mr-2 h-2 w-2 rounded-full bg-accent" />
              Trusted by investors worldwide
            </p>
            <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Professional Stock Investment Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
              Build and manage your investment portfolio with institutional-grade tools. 
              Access global stock markets, track performance, and grow your wealth with confidence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/request-account">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                  Request an Account
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { label: "Assets Managed", value: "$2.4B+" },
              { label: "Active Investors", value: "12,000+" },
              { label: "Markets Available", value: "25+" },
              { label: "Years of Trust", value: "15+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary-foreground lg:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Why VaultStock</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground lg:text-4xl">
              Everything you need to invest with confidence
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Secure & Regulated",
                description: "Bank-level security with full KYC compliance and multi-factor authentication to protect your assets.",
              },
              {
                icon: BarChart3,
                title: "Portfolio Analytics",
                description: "Real-time performance tracking with detailed analytics and reporting for every portfolio you manage.",
              },
              {
                icon: Globe,
                title: "Global Markets",
                description: "Access 25+ stock exchanges worldwide including NYSE, NASDAQ, LSE, and TSE from a single platform.",
              },
              {
                icon: LineChart,
                title: "Smart Insights",
                description: "Data-driven insights and market analysis to help you make informed investment decisions.",
              },
              {
                icon: Users,
                title: "Portfolio Inheritance",
                description: "Seamlessly transfer and inherit portfolios with our secure authorization system.",
              },
              {
                icon: Lock,
                title: "Institutional Grade",
                description: "Professional tools and infrastructure trusted by institutional investors and wealth managers.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-serif text-3xl font-bold text-foreground lg:text-4xl">
              Ready to start investing?
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              Request an account today and join thousands of investors who trust VaultStock 
              to manage their wealth. Our team will review your application within 24 hours.
            </p>
            <Link href="/request-account">
              <Button size="lg" className="mt-8 px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">VaultStock</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {"2026 VaultStock. All rights reserved. Securities offered through licensed partners."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
