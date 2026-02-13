'use client'

import Link from "next/link"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendingUp, Plus, Settings, LogOut, BarChart3, DollarSign, Target, Share2, Users, Copy, Eye, EyeOff } from 'lucide-react'
import {CreatePortfolioModal} from "@/components/Modal-Layout/create-portfolio-modal";

interface Portfolio {
  id: string
  name: string
  value: number
  change: number
  holdings: number
  lastUpdated: string
  source: 'created' | 'transferred'
  status: 'active' | 'pending' | 'archived'
}

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: '1',
      name: 'Growth Portfolio',
      value: 45230.50,
      change: 12.5,
      holdings: 8,
      lastUpdated: 'Today',
      source: 'created',
      status: 'active',
    },
    {
      id: '2',
      name: 'Tech Sector Focus',
      value: 32150.00,
      change: 18.3,
      holdings: 5,
      lastUpdated: 'Today',
      source: 'created',
      status: 'active',
    },
    {
      id: '3',
      name: 'Dividend Income',
      value: 28900.75,
      change: -2.1,
      holdings: 6,
      lastUpdated: 'Yesterday',
      source: 'transferred',
      status: 'active',
    },
  ])


  const totalAssets = portfolios.reduce((sum, p) => sum + p.holdings, 0)
  const totalValue = portfolios.reduce((sum, p) => sum + p.value, 0)
  const averageChange =
    portfolios.reduce((sum, p) => sum + p.change, 0) / portfolios.length

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {/*<div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">*/}
      {/*  <div className="px-4 py-3 flex items-center justify-between">*/}
      {/*    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">*/}
      {/*      <TrendingUp className="w-5 h-5 text-primary-foreground" />*/}
      {/*    </div>*/}
      {/*    <div className="flex items-center gap-2">*/}
      {/*      <Link href="/dashboard/profile">*/}
      {/*        <button className="p-2 hover:bg-secondary rounded-lg transition">*/}
      {/*          <Settings className="w-5 h-5 text-foreground" />*/}
      {/*        </button>*/}
      {/*      </Link>*/}
      {/*      <button className="p-2 hover:bg-secondary rounded-lg transition">*/}
      {/*        <LogOut className="w-5 h-5 text-foreground" />*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* Desktop Header *!/*/}
      {/*<div className="hidden lg:block border-b border-border bg-card sticky top-0 z-50">*/}
      {/*  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">*/}
      {/*    <div className="flex items-center gap-3">*/}
      {/*      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">*/}
      {/*        <TrendingUp className="w-6 h-6 text-primary-foreground" />*/}
      {/*      </div>*/}
      {/*      <h1 className="text-xl font-bold text-foreground">Invest</h1>*/}
      {/*    </div>*/}
      {/*    <div className="flex items-center gap-4">*/}
      {/*      <Link href="/dashboard/profile">*/}
      {/*        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">*/}
      {/*          <Settings className="w-4 h-4 mr-2" />*/}
      {/*          Settings*/}
      {/*        </Button>*/}
      {/*      </Link>*/}
      {/*      <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">*/}
      {/*        <LogOut className="w-4 h-4 mr-2" />*/}
      {/*        Sign Out*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Main Content */}
      <div className="pb-24 lg:pb-0">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4 p-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-primary/30 via-primary/10 to-card border border-primary/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Assets</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {totalAssets}
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
              <div>
                <p className="text-xs text-muted-foreground">24h Change</p>
                <p className={`text-lg font-semibold ${averageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {averageChange > 0 ? '+' : ''}{averageChange.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Portfolios</p>
                <p className="text-lg font-semibold text-foreground">{portfolios.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Holdings</p>
                <p className="text-lg font-semibold text-foreground">{portfolios.reduce((sum, p) => sum + p.holdings, 0)}</p>
              </div>
            </div>
          </div>

          {/* Promotion Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-xl p-4">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">New & Improved</p>
            <h3 className="text-lg font-bold text-foreground mt-1">Smart Portfolio Assistant</h3>
            <p className="text-xs text-muted-foreground mt-1">Introducing lower fees and smarter rebalancing</p>
          </div>

          {/* Your Favorites */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Your Portfolios</h3>
            {portfolios.slice(0, 3).map((portfolio) => (
              <Link key={portfolio.id} href={`/dashboard/portfolio/${portfolio.id}`}>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:border-primary/50 transition cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">{portfolio.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${portfolio.source === 'created' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                          {portfolio.source === 'created' ? 'Created by You' : 'Transferred'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${portfolio.status === 'active' ? 'bg-green-500/20 text-green-400' : portfolio.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs font-semibold ${portfolio.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {portfolio.change > 0 ? '▲' : '▼'} {Math.abs(portfolio.change).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="text-xl font-bold text-foreground">${(portfolio.value / 1000).toFixed(1)}k</p>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs">
                      View →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-secondary hover:bg-secondary/80 text-foreground h-12 rounded-lg font-medium">
              <DollarSign className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Buy Stock
            </Button>
          </div>

          {/* Bottom Action Menu */}
          <div className="grid grid-cols-3 gap-2 bg-card border-t border-border fixed bottom-0 left-0 right-0 p-3 lg:hidden">
            <button className="flex flex-col items-center gap-1 p-3 hover:bg-secondary rounded-lg transition">
              <Target className="w-5 h-5 text-foreground" />
              <p className="text-xs text-muted-foreground">Make Limit</p>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 hover:bg-secondary rounded-lg transition">
              <Users className="w-5 h-5 text-foreground" />
              <p className="text-xs text-muted-foreground">Invite</p>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 hover:bg-secondary rounded-lg transition">
              <BarChart3 className="w-5 h-5 text-foreground" />
              <p className="text-xs text-muted-foreground">More</p>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Balance Section */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/30 to-card border-primary/30 p-6 col-span-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">Total Assets</p>
                <h2 className="text-4xl font-bold text-foreground">
                  {totalAssets}
                </h2>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">24h Change</p>
              <p className={`text-3xl font-bold ${averageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {averageChange > 0 ? '+' : ''}{averageChange.toFixed(2)}%
              </p>
            </Card>

            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Holdings</p>
              <p className="text-3xl font-bold text-foreground">{portfolios.reduce((sum, p) => sum + p.holdings, 0)}</p>
            </Card>
          </div>

          {/* Promotion Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-2xl p-8">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">New & Improved</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">Smart Portfolio Assistant</h3>
            <p className="text-muted-foreground mt-2 max-w-lg">Introducing lower fees and smarter rebalancing. Get started today and optimize your investment strategy.</p>
          </div>

          {/* Portfolios Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Your Portfolios</h3>

              <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setShowCreateModal(true)} >
                <Plus className="w-4 h-4 mr-2" />
                New Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Link key={portfolio.id} href={`/dashboard/portfolio/${portfolio.id}`}>
                  <Card className="bg-card border-border p-6 hover:border-primary/50 transition cursor-pointer h-full">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{portfolio.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${portfolio.source === 'created' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                            {portfolio.source === 'created' ? 'Created by You' : 'Transferred'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${portfolio.status === 'active' ? 'bg-green-500/20 text-green-400' : portfolio.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{portfolio.holdings} holdings</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Value</p>
                        <p className="text-2xl font-bold text-foreground">${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className={`text-sm font-semibold ${portfolio.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {portfolio.change > 0 ? '▲' : '▼'} {Math.abs(portfolio.change).toFixed(2)}%
                        </p>
                        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">
                          View →
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/30 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Manage Portfolios</h4>
                <p className="text-muted-foreground">
                  Create, edit, or delete portfolios and manage your holdings across multiple investment strategies.
                </p>
              </div>

              <Link href="/dashboard/portfolio/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 w-full">
                Go to Management
              </Button>
              </Link>
            </Card>

            <Link href="/dashboard/transfer">
              <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/30 p-8 flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Portfolio Transfer</h4>
                  <p className="text-muted-foreground">
                    Share or inherit portfolios with other investors on the platform securely.
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Manage Transfers
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      <CreatePortfolioModal open={showCreateModal} onOpenChange={setShowCreateModal} />

    </div>
  )
}
