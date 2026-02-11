'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Users, CheckCircle2 } from 'lucide-react'
import { RequestAccessModal } from '@/components/request-access-modal'

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Invest</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-foreground hover:bg-secondary">
              Sign In
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Request Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Now accepting new investors</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Invest in Your <span className="text-primary">Future</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Access global stock markets with a modern, secure platform designed for retail and professional investors.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                Learn More
              </Button>
            </div>
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Trusted by investors worldwide</p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">50K+</div>
                  <div className="text-xs text-muted-foreground">Active Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">$2.5B+</div>
                  <div className="text-xs text-muted-foreground">Assets Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">150+</div>
                  <div className="text-xs text-muted-foreground">Stock Markets</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Chart Visualization */}
          <div className="relative h-96 bg-card rounded-2xl border border-border p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-3xl font-bold text-foreground">$124,560</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+12.5%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">TECH Sector</span>
                    <span className="text-sm text-foreground font-semibold">45%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-primary rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Finance</span>
                    <span className="text-sm text-foreground font-semibold">30%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Healthcare</span>
                    <span className="text-sm text-foreground font-semibold">25%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[25%] bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete platform for modern investing with tools designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description: 'Your assets and data are protected with military-grade encryption and compliance standards.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Access detailed market data, charts, and insights to make informed investment decisions.',
              },
              {
                icon: Zap,
                title: 'Instant Execution',
                description: 'Trade with lightning-fast order execution and minimal latency.',
              },
              {
                icon: Users,
                title: 'Portfolio Inheritance',
                description: 'Easily transfer or inherit portfolios from other investors with secure authorization.',
              },
              {
                icon: CheckCircle2,
                title: 'Full KYC Support',
                description: 'Streamlined account opening with integrated identity verification and compliance.',
              },
              {
                icon: TrendingUp,
                title: 'Smart Portfolios',
                description: 'Create and manage multiple portfolios across 150+ global stock markets.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-card rounded-xl border border-border hover:border-primary/50 transition group">
                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-muted-foreground">Get started in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Request Account',
                description: 'Start by requesting access. Our team will review your application and contact you within 24 hours.',
              },
              {
                step: '02',
                title: 'Complete KYC',
                description: 'Verify your identity and complete the KYC process. Sign your agreement with ease using our digital signature.',
              },
              {
                step: '03',
                title: 'Start Investing',
                description: 'Create portfolios, explore markets, and begin trading once your account is approved.',
              },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="text-5xl font-bold text-primary/20">{item.step}</div>
                <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to start investing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are building wealth with our platform.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Request Access Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Invest</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern investing for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Markets</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">&copy; 2026 Invest. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
