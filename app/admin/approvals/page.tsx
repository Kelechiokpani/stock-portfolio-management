'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock, FileText, User, Mail, MapPin, Phone } from 'lucide-react'

interface ApprovalRequest {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  kycStatus: 'pending' | 'verified' | 'rejected'
}

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      country: 'United States',
      status: 'pending',
      kycStatus: 'verified',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 234-5678',
      address: '789 Pine Street',
      city: 'New York',
      country: 'United States',
      status: 'pending',
      kycStatus: 'verified',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      fullName: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 345-6789',
      address: '321 Elm Boulevard',
      city: 'Los Angeles',
      country: 'United States',
      status: 'approved',
      kycStatus: 'verified',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: 'approved' as const } : r
      )
    )
    setSelectedRequest(null)
  }

  const handleReject = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: 'rejected' as const } : r
      )
    )
    setSelectedRequest(null)
  }

  const filteredRequests = requests.filter((r) => (filterStatus === 'all' ? true : r.status === filterStatus))

  const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    total: requests.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Admin Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Logged in as:</span>
              <p className="text-foreground font-semibold">admin@invest.com</p>
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: stats.total, color: 'bg-blue-500/20 text-blue-400' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500/20 text-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-500/20 text-green-400' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-500/20 text-red-400' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Registration Requests</h2>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3 py-1 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-border">
                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No requests to display</p>
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
                            <h3 className="font-semibold text-foreground">{request.fullName}</h3>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                request.status === 'pending'
                                  ? 'bg-yellow-500'
                                  : request.status === 'approved'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                              }`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" /> {request.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {request.city}, {request.country}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {request.kycStatus === 'verified' && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                              KYC Verified
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              request.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : request.status === 'approved'
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

          {/* Detail View */}
          {selectedRequest && (
            <Card className="bg-card border-border p-6 h-fit lg:sticky lg:top-20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Request Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="text-foreground font-semibold">{selectedRequest.fullName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-semibold">{selectedRequest.email}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground font-semibold">{selectedRequest.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground font-semibold">
                    {selectedRequest.address}, {selectedRequest.city}, {selectedRequest.country}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">KYC Status</p>
                  <div className="flex items-center gap-2">
                    {selectedRequest.kycStatus === 'verified' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-foreground font-semibold">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-foreground font-semibold">Pending Review</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">KYC Documents</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-secondary rounded">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Government ID</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-secondary rounded">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Proof of Address</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedRequest.id)}
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}

                {selectedRequest.status === 'approved' && (
                  <div className="pt-4 border-t border-border p-3 bg-green-500/10 rounded border border-green-500/30">
                    <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Approved by admin
                    </p>
                  </div>
                )}

                {selectedRequest.status === 'rejected' && (
                  <div className="pt-4 border-t border-border p-3 bg-red-500/10 rounded border border-red-500/30">
                    <p className="text-sm text-red-400 font-semibold flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Rejected by admin
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
