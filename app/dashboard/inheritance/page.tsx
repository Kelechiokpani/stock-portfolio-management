'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Share2, Send, CheckCircle2, XCircle, Clock, User, DollarSign, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'

interface InheritanceRequest {
  id: string
  type: 'sent' | 'received'
  fromUser: string
  fromEmail: string
  toUser: string
  toEmail: string
  portfolioName: string
  portfolioValue: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  message?: string
}

export default function InheritanceFeaturePage() {
  const [requests, setRequests] = useState<InheritanceRequest[]>([
    {
      id: '1',
      type: 'received',
      fromUser: 'Sarah Johnson',
      fromEmail: 'sarah.johnson@example.com',
      toUser: 'Admin User',
      toEmail: 'admin@invest.com',
      portfolioName: 'Growth Portfolio',
      portfolioValue: 45230.50,
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'I would like to transfer my growth portfolio to you as an inheritance.',
    },
    {
      id: '2',
      type: 'sent',
      fromUser: 'Admin User',
      fromEmail: 'admin@invest.com',
      toUser: 'John Smith',
      toEmail: 'john.smith@example.com',
      portfolioName: 'Tech Sector Focus',
      portfolioValue: 32150.00,
      status: 'accepted',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Sharing my tech portfolio with you.',
    },
    {
      id: '3',
      type: 'received',
      fromUser: 'Michael Chen',
      fromEmail: 'michael.chen@example.com',
      toUser: 'Admin User',
      toEmail: 'admin@invest.com',
      portfolioName: 'Dividend Income',
      portfolioValue: 28900.75,
      status: 'rejected',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Testing portfolio transfer request.',
    },
  ])

  const [tab, setTab] = useState<'sent' | 'received'>('received')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<InheritanceRequest | null>(null)
  const [newRequest, setNewRequest] = useState({
    email: '',
    portfolioId: '',
    message: '',
  })

  const filteredRequests = requests.filter((r) => r.type === tab)
  const pendingCount = requests.filter((r) => r.type === tab && r.status === 'pending').length

  const handleAccept = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'accepted' as const } : r)))
    setSelectedRequest(null)
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)))
    setSelectedRequest(null)
  }

  const handleCreateRequest = () => {
    if (newRequest.email && newRequest.portfolioId) {
      const newInheritanceRequest: InheritanceRequest = {
        id: `req_${Date.now()}`,
        type: 'sent',
        fromUser: 'Admin User',
        fromEmail: 'admin@invest.com',
        toUser: newRequest.email.split('@')[0],
        toEmail: newRequest.email,
        portfolioName: 'Sample Portfolio',
        portfolioValue: 10000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: newRequest.message,
      }
      setRequests([...requests, newInheritanceRequest])
      setNewRequest({ email: '', portfolioId: '', message: '' })
      setShowCreateForm(false)
    }
  }

  const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    total: requests.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolio Inheritance</h1>
            <p className="text-sm text-muted-foreground">Share and receive portfolios securely</p>
          </div>

          {/*/dashboard/portfolio/inherit*/}
          <Link href="/dashboard/inheritance/inherit">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Inherit Portfolio  Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Transfers', value: stats.total, color: 'bg-blue-500/20 text-blue-400' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500/20 text-yellow-400' },
            { label: 'Accepted', value: stats.accepted, color: 'bg-green-500/20 text-green-400' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-500/20 text-red-400' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transfer List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              {/* Tabs */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTab('received')}
                      className={`pb-2 font-semibold transition border-b-2 ${
                        tab === 'received' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
                      }`}
                    >
                      Received Transfers ({requests.filter((r) => r.type === 'received' && r.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setTab('sent')}
                      className={`pb-2 font-semibold transition border-b-2 ${
                        tab === 'sent' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
                      }`}
                    >
                      Sent Transfers
                    </button>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                </div>

                {showCreateForm && (
                  <div className="p-4 bg-secondary rounded-lg space-y-4 mb-4">
                    <h3 className="font-semibold text-foreground">Create Transfer Request</h3>
                    <input
                      type="email"
                      placeholder="Recipient email address"
                      value={newRequest.email}
                      onChange={(e) => setNewRequest({ ...newRequest, email: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <select
                      value={newRequest.portfolioId}
                      onChange={(e) => setNewRequest({ ...newRequest, portfolioId: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Select portfolio to transfer</option>
                      <option value="p1">Growth Portfolio ($45,230.50)</option>
                      <option value="p2">Tech Sector Focus ($32,150.00)</option>
                    </select>
                    <textarea
                      placeholder="Optional message to recipient"
                      value={newRequest.message}
                      onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreateRequest} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Send Request
                      </Button>
                      <Button
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-background"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer List */}
              <div className="divide-y divide-border">
                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {tab === 'received' ? 'No received transfer requests' : 'No sent transfer requests'}
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 cursor-pointer transition ${
                        selectedRequest?.id === request.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{request.portfolioName}</h3>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                request.status === 'pending'
                                  ? 'bg-yellow-500'
                                  : request.status === 'accepted'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                              }`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {tab === 'received' ? `From ${request.fromUser}` : `To ${request.toUser}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> ${request.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {tab === 'received' ? 'From:' : 'To:'} {tab === 'received' ? request.fromEmail : request.toEmail}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              request.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : request.status === 'accepted'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Details View */}
          {selectedRequest && (
            <Card className="bg-card border-border p-6 h-fit lg:sticky lg:top-20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Transfer Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Portfolio</p>
                  <p className="text-foreground font-semibold">{selectedRequest.portfolioName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Value</p>
                  <p className="text-foreground font-semibold">${selectedRequest.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">{tab === 'received' ? 'From' : 'To'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">{tab === 'received' ? selectedRequest.fromUser : selectedRequest.toUser}</p>
                      <p className="text-xs text-muted-foreground">{tab === 'received' ? selectedRequest.fromEmail : selectedRequest.toEmail}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-foreground text-sm">{selectedRequest.message}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {selectedRequest.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                    {selectedRequest.status === 'accepted' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {selectedRequest.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-foreground font-semibold">{selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                  Requested: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </div>

                {tab === 'received' && selectedRequest.status === 'pending' && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button onClick={() => handleAccept(selectedRequest.id)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Transfer
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedRequest.id)}
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Transfer
                    </Button>
                  </div>
                )}

                {selectedRequest.status === 'accepted' && (
                  <div className="pt-4 border-t border-border p-3 bg-green-500/10 rounded border border-green-500/30">
                    <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Transfer accepted
                    </p>
                  </div>
                )}

                {selectedRequest.status === 'rejected' && (
                  <div className="pt-4 border-t border-border p-3 bg-red-500/10 rounded border border-red-500/30">
                    <p className="text-sm text-red-400 font-semibold flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Transfer rejected
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* How It Works Section */}
        <Card className="bg-card border-border p-8 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How Portfolio Inheritance Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Create Transfer Request',
                description: 'Click "New Transfer Request" and select the portfolio you want to share. Enter the recipient\'s email address.',
              },
              {
                step: '2',
                title: 'Recipient Reviews',
                description: 'The recipient receives a notification and can review the portfolio details, holdings, and any message you included.',
              },
              {
                step: '3',
                title: 'Accept or Decline',
                description: 'The recipient accepts or declines the transfer. Once accepted, they have full control of the inherited portfolio.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{item.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
