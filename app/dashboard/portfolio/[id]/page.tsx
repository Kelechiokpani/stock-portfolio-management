'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, Download, Copy, Settings, Eye, EyeOff, Zap, History, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-provider'

interface StockHolding {
  id: string
  ticker: string
  name: string
  logo: string
  shares: number
  avgCostPerShare: number
  currentPrice: number
  currentValue: number
  gainLoss: number
  gainLossPercent: number
  allocation: number
  status: 'profit' | 'loss' | 'breakeven'
  dayChange: number
  dayChangePercent: number
}

interface Transaction {
  id: string
  date: string
  type: 'buy' | 'sell'
  ticker: string
  shares: number
  pricePerShare: number
  totalValue: number
  notes?: string
}

export default function PortfolioDetailPage() {
  const params = useParams()
  const portfolioId = params.id as string
  const { theme, toggleTheme, mounted } = useTheme()
  const [showBalance, setShowBalance] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showAuthCode, setShowAuthCode] = useState(false)
  const [buyMode, setBuyMode] = useState<'ticker' | 'new' | null>(null)
  const [sellMode, setSellMode] = useState(false)
  const [buyQuantity, setBuyQuantity] = useState('')
  const [sellQuantity, setSellQuantity] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<'buy' | 'sell' | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions'>('holdings')
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [holdingsSearch, setHoldingsSearch] = useState('')

  const copyToClipboard = (text: string, type: 'id' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'id') {
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleSellAll = (ticker: any) => {
    setSellQuantity(ticker.shares.toString())
  }

  // Mock data - in real app, fetch from API based on portfolioId
  const portfolio = {
    id: portfolioId,
    name: 'Growth Portfolio',
    totalValue: 45230.50,
    totalInvested: 38500.00,
    gainLoss: 6730.50,
    gainLossPercent: 17.48,
    uniqueIdentifier: 'PORT-' + portfolioId.toUpperCase() + '-A7B2C9',
    authorizationCode: 'AUTH84F5K2M9X',
    allocation: [
      { sector: 'Technology', percent: 45 },
      { sector: 'Finance', percent: 30 },
      { sector: 'Healthcare', percent: 25 }
    ]
  }

  const [selectedTicker, setSelectedTicker] = useState<StockHolding | null>(null)
  const holdings = [
    {
      id: '1',
      ticker: 'AAPL',
      name: 'Apple Inc.',
      logo: 'https://logo.clearbit.com/apple.com',
      shares: 50,
      avgCostPerShare: 145.20,
      currentPrice: 187.50,
      currentValue: 9375.00,
      gainLoss: 2115.00,
      gainLossPercent: 29.08,
      allocation: 20.7,
      status: 'profit',
      dayChange: 2.50,
      dayChangePercent: 1.35
    },
    {
      id: '2',
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      logo: 'https://logo.clearbit.com/microsoft.com',
      shares: 35,
      avgCostPerShare: 320.50,
      currentPrice: 425.80,
      currentValue: 14903.00,
      gainLoss: 3705.50,
      gainLossPercent: 33.10,
      allocation: 32.9,
      status: 'profit',
      dayChange: 5.30,
      dayChangePercent: 1.26
    },
    {
      id: '3',
      ticker: 'GOOGL',
      name: 'Alphabet Inc.',
      logo: 'https://logo.clearbit.com/google.com',
      shares: 25,
      avgCostPerShare: 140.00,
      currentPrice: 156.30,
      currentValue: 3907.50,
      gainLoss: 408.50,
      gainLossPercent: 11.63,
      allocation: 8.6,
      status: 'profit',
      dayChange: -1.20,
      dayChangePercent: -0.76
    },
    {
      id: '4',
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      logo: 'https://logo.clearbit.com/tesla.com',
      shares: 15,
      avgCostPerShare: 290.00,
      currentPrice: 245.90,
      currentValue: 3688.50,
      gainLoss: -660.00,
      gainLossPercent: -15.18,
      allocation: 8.1,
      status: 'loss',
      dayChange: -3.50,
      dayChangePercent: -1.41
    },
    {
      id: '5',
      ticker: 'JPM',
      name: 'JPMorgan Chase & Co.',
      logo: 'https://logo.clearbit.com/jpmorganchase.com',
      shares: 60,
      avgCostPerShare: 155.00,
      currentPrice: 198.40,
      currentValue: 11904.00,
      gainLoss: 2604.00,
      gainLossPercent: 28.02,
      allocation: 26.3,
      status: 'profit',
      dayChange: 1.80,
      dayChangePercent: 0.91
    },
    {
      id: '6',
      ticker: 'JNJ',
      name: 'Johnson & Johnson',
      logo: 'https://logo.clearbit.com/jnj.com',
      shares: 30,
      avgCostPerShare: 152.50,
      currentPrice: 160.75,
      currentValue: 4822.50,
      gainLoss: 247.50,
      gainLossPercent: 5.38,
      allocation: 10.7,
      status: 'profit',
      dayChange: 0.50,
      dayChangePercent: 0.31
    }
  ]

  const transactions = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'buy',
      ticker: 'AAPL',
      shares: 50,
      pricePerShare: 145.20,
      totalValue: 7260.00,
      notes: 'Bought as part of tech sector allocation'
    },
    {
      id: '2',
      date: '2024-01-18',
      type: 'buy',
      ticker: 'MSFT',
      shares: 35,
      pricePerShare: 320.50,
      totalValue: 11217.50
    },
    {
      id: '3',
      date: '2024-01-22',
      type: 'buy',
      ticker: 'GOOGL',
      shares: 25,
      pricePerShare: 140.00,
      totalValue: 3500.00
    },
    {
      id: '4',
      date: '2024-02-01',
      type: 'buy',
      ticker: 'JPM',
      shares: 60,
      pricePerShare: 155.00,
      totalValue: 9300.00,
      notes: 'Finance sector diversification'
    },
    {
      id: '5',
      date: '2024-02-05',
      type: 'buy',
      ticker: 'JNJ',
      shares: 30,
      pricePerShare: 152.50,
      totalValue: 4575.00
    },
    {
      id: '6',
      date: '2024-02-10',
      type: 'buy',
      ticker: 'TSLA',
      shares: 15,
      pricePerShare: 290.00,
      totalValue: 4350.00
    },
    {
      id: '7',
      date: '2024-02-20',
      type: 'sell',
      ticker: 'AAPL',
      shares: 10,
      pricePerShare: 170.50,
      totalValue: 1705.00,
      notes: 'Took partial profit'
    }
  ]

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{portfolio.name}</h1>
              <p className="text-xs text-muted-foreground">Portfolio Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <Button onClick={toggleTheme} variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent md:flex hidden">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={() => setShowCredentials(true)} variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                View Credentials
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            {mounted && (
              <Button onClick={toggleTheme} variant="outline" size="sm" className="border-border hover:bg-secondary bg-transparent md:hidden">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/30 to-card border-primary/30 p-6 md:col-span-2">
            <p className="text-sm text-muted-foreground font-medium mb-2">Portfolio Value</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </Card>

          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground font-medium mb-2">Total Invested</p>
            <h3 className="text-2xl font-bold text-foreground">${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-muted-foreground mt-2">{holdings.length} holdings</p>
          </Card>

          <Card className={`border-border p-6 ${portfolio.gainLossPercent > 0 ? 'bg-gradient-to-br from-green-500/20 to-card' : 'bg-gradient-to-br from-red-500/20 to-card'}`}>
            <p className="text-sm text-muted-foreground font-medium mb-2">Total Gain/Loss</p>
            <h3 className={`text-2xl font-bold ${portfolio.gainLossPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.gainLossPercent > 0 ? '+' : ''}{portfolio.gainLossPercent.toFixed(2)}%
            </h3>
            <p className={`text-xs mt-2 ${portfolio.gainLossPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.gainLossPercent > 0 ? '+' : ''}${portfolio.gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </Card>
        </div>

        {/* Allocation Breakdown */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sector Allocation</h3>
          <div className="space-y-3">
            {portfolio.allocation.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{item.sector}</span>
                  <span className="text-sm font-semibold text-foreground">{item.percent}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-400' : 'bg-purple-400'}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-border flex gap-4 sticky top-0 bg-background z-40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`pb-3 px-4 py-3 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'holdings'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Zap className="w-4 h-4" />
            Holdings
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-4 py-3 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" />
            Transaction History
          </button>
        </div>

        {/* Holdings Section */}
        {activeTab === 'holdings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Holdings</h3>
              <Button onClick={() => setBuyMode('new')} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-9">
                Buy New Ticker
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search holdings..."
                value={holdingsSearch}
                onChange={(e) => setHoldingsSearch(e.target.value)}
                className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
              <select className="bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary">
                <option>All Status</option>
                <option>Profitable</option>
                <option>Loss</option>
                <option>Breakeven</option>
              </select>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {holdings.filter(h => h.ticker.toLowerCase().includes(holdingsSearch.toLowerCase()) || h.name.toLowerCase().includes(holdingsSearch.toLowerCase())).map((holding) => (
                <button key={holding.id} onClick={() => setSelectedTicker(holding)} className="w-full text-left">
                  <Card className="bg-card border-border p-4 hover:border-primary/50 transition cursor-pointer">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <img src={holding.logo || "/placeholder.svg"} alt={holding.ticker} className="w-8 h-8 rounded-full" onError={(e) => {e.currentTarget.style.display = 'none'}} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{holding.ticker}</p>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${holding.status === 'profit' ? 'bg-green-500/20 text-green-400' : holding.status === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {holding.status === 'profit' ? 'Profitable' : holding.status === 'loss' ? 'Loss' : 'Breakeven'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{holding.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Shares</p>
                          <p className="font-semibold text-foreground">{holding.shares}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-semibold text-foreground">${holding.currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-semibold text-foreground">${(holding.currentValue / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Allocation</p>
                          <p className="font-semibold text-foreground">{holding.allocation.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className={`text-xs ${holding.gainLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.gainLoss > 0 ? '+' : ''}${holding.gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Ticker</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Shares</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Avg Cost</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Current Price</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Total Value</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Gain/Loss</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Return %</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">Allocation</th>
                  </tr>
                </thead>
              <tbody>
                {holdings.filter(h => h.ticker.toLowerCase().includes(holdingsSearch.toLowerCase()) || h.name.toLowerCase().includes(holdingsSearch.toLowerCase())).map((holding) => (
                  <tr key={holding.id} onClick={() => setSelectedTicker(holding)} className="border-b border-border hover:bg-secondary/50 transition cursor-pointer">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={holding.logo || "/placeholder.svg"} alt={holding.ticker} className="w-8 h-8 rounded-full" onError={(e) => {e.currentTarget.style.display = 'none'}} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{holding.ticker}</p>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${holding.status === 'profit' ? 'bg-green-500/20 text-green-400' : holding.status === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {holding.status === 'profit' ? 'Profitable' : holding.status === 'loss' ? 'Loss' : 'Breakeven'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{holding.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{holding.shares}</td>
                      <td className="py-4 px-4 text-foreground">${holding.avgCostPerShare.toFixed(2)}</td>
                      <td className="py-4 px-4 text-foreground">${holding.currentPrice.toFixed(2)}</td>
                      <td className="py-4 px-4 text-foreground font-semibold">${holding.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className={`py-4 px-4 font-semibold ${holding.gainLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLoss > 0 ? '+' : ''}${holding.gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-4 px-4 font-semibold ${holding.gainLossPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLossPercent > 0 ? '▲' : '▼'} {Math.abs(holding.gainLossPercent).toFixed(2)}%
                      </td>
                      <td className="py-4 px-4 text-foreground">{holding.allocation.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {activeTab === 'transactions' && (
          <Card className="bg-card border-border p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTransactionFilter('all')}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    transactionFilter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTransactionFilter('buy')}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    transactionFilter === 'buy'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTransactionFilter('sell')}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    transactionFilter === 'sell'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {transactions.filter(tx => transactionFilter === 'all' || tx.type === transactionFilter).map((tx) => (
                <button key={tx.id} onClick={() => setSelectedTransaction(tx)} className="w-full text-left hover:bg-secondary/50 transition rounded-lg p-2 -mx-2">
                  <div className="flex items-center justify-between py-3 px-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {tx.type === 'buy' ? (
                          <TrendingUp className={`w-4 h-4 ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {tx.type === 'buy' ? 'Buy' : 'Sell'} {tx.shares} shares of {tx.ticker}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${tx.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs text-muted-foreground">${tx.pricePerShare.toFixed(2)}/share</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Ticker Detail Modal */}
        {selectedTicker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" style={{overflow: 'hidden'}}>
            <Card className="bg-card border-border w-full md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-xl">
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedTicker.ticker}</h2>
                  <p className="text-sm text-muted-foreground">{selectedTicker.name}</p>
                </div>
                <button onClick={() => setSelectedTicker(null)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-foreground">${selectedTicker.currentPrice.toFixed(2)}</p>
                    <p className={`text-sm font-semibold mt-1 ${selectedTicker.dayChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedTicker.dayChange > 0 ? '+' : ''}{selectedTicker.dayChange.toFixed(2)} ({selectedTicker.dayChangePercent > 0 ? '+' : ''}{selectedTicker.dayChangePercent.toFixed(2)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className={`text-2xl font-bold ${selectedTicker.status === 'profit' ? 'text-green-400' : selectedTicker.status === 'loss' ? 'text-red-400' : 'text-gray-400'}`}>
                      {selectedTicker.status === 'profit' ? 'Profitable' : selectedTicker.status === 'loss' ? 'Loss' : 'Breakeven'}
                    </p>
                  </div>
                </div>

                {/* Holdings Details */}
                <div className="bg-secondary rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-foreground">Your Holdings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Shares Owned</p>
                      <p className="text-2xl font-bold text-foreground">{selectedTicker.shares}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Cost Per Share</p>
                      <p className="text-2xl font-bold text-foreground">${selectedTicker.avgCostPerShare.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Invested</p>
                      <p className="text-2xl font-bold text-foreground">${(selectedTicker.avgCostPerShare * selectedTicker.shares).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Value</p>
                      <p className="text-2xl font-bold text-foreground">${selectedTicker.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Allocation %</p>
                      <p className="text-2xl font-bold text-foreground">{selectedTicker.allocation.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gain/Loss</p>
                      <p className={`text-2xl font-bold ${selectedTicker.gainLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedTicker.gainLoss > 0 ? '+' : ''}${selectedTicker.gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return Analysis */}
                <div className={`rounded-lg p-4 ${selectedTicker.gainLossPercent > 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <p className="text-sm text-muted-foreground mb-2">Total Return</p>
                  <p className={`text-3xl font-bold ${selectedTicker.gainLossPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedTicker.gainLossPercent > 0 ? '+' : ''}{selectedTicker.gainLossPercent.toFixed(2)}%
                  </p>
                </div>

                {/* Recent Transactions for this Ticker */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Recent Transactions</h3>
                  <div className="space-y-2">
                    {transactions.filter(tx => tx.ticker === selectedTicker.ticker).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2 px-3 bg-secondary rounded">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {tx.type === 'buy' ? 'Buy' : 'Sell'} {tx.shares} shares
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.date} @ ${tx.pricePerShare.toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-foreground">${tx.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setSelectedTicker(null)} className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground">
                    Close
                  </Button>
                  <Button onClick={() => { setBuyMode('ticker'); setSelectedTrade('buy') }} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30">
                    Buy More
                  </Button>
                  <Button onClick={() => { setSellMode(true); setSelectedTrade('sell') }} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
                    Sell
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Transaction Receipt Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" style={{overflow: 'hidden'}}>
            <Card className="bg-card border-border w-full md:w-full md:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-xl">
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                <h2 className="text-lg font-bold text-foreground">Transaction Receipt</h2>
                <button onClick={() => setSelectedTransaction(null)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
              </div>

              <div className="p-6 space-y-6">
                {/* Transaction Details */}
                <div className={`rounded-lg p-4 ${selectedTransaction.type === 'buy' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Transaction Type</p>
                    <p className={`text-sm font-bold ${selectedTransaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedTransaction.type === 'buy' ? 'BUY' : 'SELL'}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedTransaction.ticker}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTransaction.shares} shares</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-sm font-semibold text-foreground">{selectedTransaction.date}</p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <p className="text-sm text-muted-foreground">Shares</p>
                    <p className="text-sm font-semibold text-foreground">{selectedTransaction.shares}</p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <p className="text-sm text-muted-foreground">Price Per Share</p>
                    <p className="text-sm font-semibold text-foreground">${selectedTransaction.pricePerShare.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-sm font-semibold text-foreground">${selectedTransaction.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  {selectedTransaction.notes && (
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm font-semibold text-foreground text-right">{selectedTransaction.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Portfolio Credentials Modal */}
        {showCredentials && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" style={{overflow: 'hidden'}}>
            <Card className="bg-card border-border w-full md:w-full md:max-w-md rounded-2xl md:rounded-xl">
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                <h2 className="text-lg font-semibold text-foreground">Portfolio Credentials</h2>
                <button onClick={() => setShowCredentials(false)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Unique Identifier</p>
                  <div className="flex items-center justify-between bg-secondary rounded-lg p-3 gap-2">
                    <p className="font-mono text-foreground font-semibold text-sm break-all">{portfolio.uniqueIdentifier}</p>
                  <button 
                    onClick={() => copyToClipboard(portfolio.uniqueIdentifier, 'id')}
                    className="flex-shrink-0 text-primary hover:text-primary/80 transition"
                    title="Copy"
                  >
                    {copiedId ? '✓' : <Copy className="w-4 h-4" />}
                  </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Authorization Code</p>
                  <div className="flex items-center justify-between bg-secondary rounded-lg p-3 gap-2">
                    <p className="font-mono text-foreground font-semibold text-sm break-all">{showAuthCode ? portfolio.authorizationCode : '••••••••'}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => setShowAuthCode(!showAuthCode)}
                        className="text-primary hover:text-primary/80 transition"
                        title={showAuthCode ? 'Hide' : 'Show'}
                      >
                        {showAuthCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    <button 
                      onClick={() => copyToClipboard(portfolio.authorizationCode, 'code')}
                      className="text-primary hover:text-primary/80 transition"
                      title="Copy"
                    >
                      {copiedCode ? '✓' : <Copy className="w-4 h-4" />}
                    </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-2">Share these credentials securely with other investors to transfer or inherit this portfolio.</p>

                <Button onClick={() => setShowCredentials(false)} className="w-full bg-secondary hover:bg-secondary/80 text-foreground mt-4">
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
