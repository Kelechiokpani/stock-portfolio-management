'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit2, Trash2, TrendingUp, Eye, EyeOff, DollarSign, Percent } from 'lucide-react'
import { PortfolioTypeModal } from '@/components/portfolio-type-modal'

interface Holding {
  id: string
  symbol: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  sector: string
}

interface Portfolio {
  id: string
  name: string
  description: string
  value: number
  change: number
  holdings: Holding[]
}

export default function PortfolioManagementPage() {
  const [showTypeModal, setShowTypeModal] = useState(true)
  const [selectedPortfolioType, setSelectedPortfolioType] = useState<'inherit' | 'transfer' | null>(null)

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: '1',
      name: 'Growth Portfolio',
      description: 'Long-term growth focused strategy',
      value: 45230.50,
      change: 12.5,
      holdings: [
        { id: 'h1', symbol: 'AAPL', quantity: 50, purchasePrice: 150, currentPrice: 165.25, sector: 'Technology' },
        { id: 'h2', symbol: 'MSFT', quantity: 30, purchasePrice: 300, currentPrice: 325.50, sector: 'Technology' },
        { id: 'h3', symbol: 'GOOGL', quantity: 20, purchasePrice: 2500, currentPrice: 2750, sector: 'Technology' },
        {
          id: 'h4',
          symbol: 'JPM',
          quantity: 25,
          purchasePrice: 180,
          currentPrice: 195.75,
          sector: 'Finance',
        },
      ],
    },
    {
      id: '2',
      name: 'Tech Sector Focus',
      description: 'Concentrated tech investments',
      value: 32150.00,
      change: 18.3,
      holdings: [
        { id: 'h5', symbol: 'NVDA', quantity: 15, purchasePrice: 400, currentPrice: 485.60, sector: 'Technology' },
        {
          id: 'h6',
          symbol: 'META',
          quantity: 25,
          purchasePrice: 300,
          currentPrice: 325.40,
          sector: 'Technology',
        },
      ],
    },
  ])

  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(portfolios[0])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAddHolding, setShowAddHolding] = useState(false)
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' })
  const [newHolding, setNewHolding] = useState({ symbol: '', quantity: '', purchasePrice: '', currentPrice: '', sector: '' })

  const handleCreatePortfolio = () => {
    if (newPortfolio.name) {
      const portfolio: Portfolio = {
        id: `p${portfolios.length + 1}`,
        name: newPortfolio.name,
        description: newPortfolio.description,
        value: 0,
        change: 0,
        holdings: [],
      }
      setPortfolios([...portfolios, portfolio])
      setSelectedPortfolio(portfolio)
      setNewPortfolio({ name: '', description: '' })
      setShowCreateForm(false)
    }
  }

  const handleAddHolding = () => {
    if (selectedPortfolio && newHolding.symbol && newHolding.quantity) {
      const holding: Holding = {
        id: `h${Date.now()}`,
        symbol: newHolding.symbol.toUpperCase(),
        quantity: parseFloat(newHolding.quantity),
        purchasePrice: parseFloat(newHolding.purchasePrice),
        currentPrice: parseFloat(newHolding.currentPrice),
        sector: newHolding.sector,
      }
      const updated = {
        ...selectedPortfolio,
        holdings: [...selectedPortfolio.holdings, holding],
        value: selectedPortfolio.value + parseFloat(newHolding.quantity) * parseFloat(newHolding.currentPrice),
      }
      setPortfolios(portfolios.map((p) => (p.id === selectedPortfolio.id ? updated : p)))
      setSelectedPortfolio(updated)
      setNewHolding({ symbol: '', quantity: '', purchasePrice: '', currentPrice: '', sector: '' })
      setShowAddHolding(false)
    }
  }

  const handleDeleteHolding = (holdingId: string) => {
    if (selectedPortfolio) {
      const holding = selectedPortfolio.holdings.find((h) => h.id === holdingId)
      const updated = {
        ...selectedPortfolio,
        holdings: selectedPortfolio.holdings.filter((h) => h.id !== holdingId),
        value: selectedPortfolio.value - (holding ? holding.quantity * holding.currentPrice : 0),
      }
      setPortfolios(portfolios.map((p) => (p.id === selectedPortfolio.id ? updated : p)))
      setSelectedPortfolio(updated)
    }
  }

  const handleDeletePortfolio = (id: string) => {
    const updated = portfolios.filter((p) => p.id !== id)
    setPortfolios(updated)
    if (selectedPortfolio?.id === id) {
      setSelectedPortfolio(updated.length > 0 ? updated[0] : null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Portfolio Management</h1>
          <Button onClick={() => setShowTypeModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio List */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Your Portfolios</h2>
              </div>

              {showCreateForm && (
                <div className="p-4 border-b border-border space-y-3">
                  <input
                    type="text"
                    placeholder="Portfolio name"
                    value={newPortfolio.name}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePortfolio} size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Create
                    </Button>
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-border">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className={`p-4 cursor-pointer transition ${selectedPortfolio?.id === portfolio.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{portfolio.name}</h3>
                        <p className="text-xs text-muted-foreground">{portfolio.holdings.length} holdings</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePortfolio(portfolio.id)
                        }}
                        className="p-1 hover:bg-destructive/20 rounded text-destructive opacity-0 hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground">${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p
                      className={`text-xs font-semibold ${portfolio.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                      {portfolio.change > 0 ? '+' : ''}{portfolio.change.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Portfolio Details */}
          {selectedPortfolio && (
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{selectedPortfolio.name}</h2>
                    <p className="text-muted-foreground">{selectedPortfolio.description}</p>
                  </div>
                  <Button onClick={() => setShowAddHolding(!showAddHolding)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Holding
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-card border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-foreground">${selectedPortfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </Card>
                  <Card className="bg-card border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Change</p>
                    <p className={`text-2xl font-bold ${selectedPortfolio.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedPortfolio.change > 0 ? '+' : ''}{selectedPortfolio.change.toFixed(2)}%
                    </p>
                  </Card>
                  <Card className="bg-card border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Holdings</p>
                    <p className="text-2xl font-bold text-foreground">{selectedPortfolio.holdings.length}</p>
                  </Card>
                </div>

                {showAddHolding && (
                  <Card className="bg-card border-border p-6 mb-6">
                    <h3 className="font-semibold text-foreground mb-4">Add New Holding</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Stock Symbol (e.g., AAPL)"
                        value={newHolding.symbol}
                        onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                        className="px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={newHolding.quantity}
                        onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
                        className="px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Purchase Price"
                        value={newHolding.purchasePrice}
                        onChange={(e) => setNewHolding({ ...newHolding, purchasePrice: e.target.value })}
                        className="px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Current Price"
                        value={newHolding.currentPrice}
                        onChange={(e) => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
                        className="px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Sector"
                        value={newHolding.sector}
                        onChange={(e) => setNewHolding({ ...newHolding, sector: e.target.value })}
                        className="col-span-2 px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddHolding} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Add Holding
                      </Button>
                      <Button
                        onClick={() => setShowAddHolding(false)}
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Holdings Table */}
              <Card className="bg-card border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Holdings</h3>
                </div>

                {selectedPortfolio.holdings.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No holdings yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Symbol</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Price</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gain/Loss</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedPortfolio.holdings.map((holding) => {
                          const value = holding.quantity * holding.currentPrice
                          const gain = value - holding.quantity * holding.purchasePrice
                          const gainPercent = (gain / (holding.quantity * holding.purchasePrice)) * 100
                          return (
                            <tr key={holding.id} className="hover:bg-secondary/50 transition">
                              <td className="px-6 py-4">
                                <span className="font-semibold text-foreground">{holding.symbol}</span>
                              </td>
                              <td className="px-6 py-4 text-foreground">{holding.quantity}</td>
                              <td className="px-6 py-4 text-muted-foreground">{holding.sector}</td>
                              <td className="px-6 py-4 text-right text-foreground">${holding.currentPrice.toFixed(2)}</td>
                              <td className="px-6 py-4 text-right font-semibold text-foreground">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className={`px-6 py-4 text-right font-semibold ${gain > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {gain > 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleDeleteHolding(holding.id)}
                                  className="p-1 hover:bg-destructive/20 rounded text-destructive transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      <PortfolioTypeModal
        isOpen={showTypeModal}
        onClose={() => {
          setShowTypeModal(false)
          setSelectedPortfolioType(null)
        }}
        onSelectType={(type) => {
          setSelectedPortfolioType(type)
          if (type === 'inherit') {
            setShowCreateForm(false)
          } else if (type === 'transfer') {
            setShowCreateForm(false)
          }
        }}
      />
    </div>
  )
}
