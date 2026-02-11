"use client"

import { useState } from "react"
import {
  Send,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers, mockPortfolioTransfers } from "@/lib/mock-data"
import { TransferPortfolioModal } from "@/components/transfer-portfolio-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransfersPage() {
  const [showTransferModal, setShowTransferModal] = useState(false)
  const user = mockUsers[0]
  const allPortfolios = user.portfolios
  const transfers = mockPortfolioTransfers

  // Get user's sent and received transfers
  const sentTransfers = transfers.filter((t) => t.fromUserId === user.id)
  const receivedTransfers = transfers.filter((t) => t.toUserId === user.id)

  const getTransferIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />
      case "accepted":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning"
      case "accepted":
        return "bg-success/10 text-success"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Portfolio Transfers
          </h1>
          <p className="mt-1 text-muted-foreground">
            Send and receive portfolios between users
          </p>
        </div>
        <Button onClick={() => setShowTransferModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Send Portfolio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Portfolios</p>
              <p className="text-2xl font-bold text-foreground">
                {allPortfolios.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-info/10">
              <Send className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent Transfers</p>
              <p className="text-2xl font-bold text-foreground">
                {sentTransfers.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Received Transfers
              </p>
              <p className="text-2xl font-bold text-foreground">
                {receivedTransfers.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="sent">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sent">Sent ({sentTransfers.length})</TabsTrigger>
            <TabsTrigger value="received">
              Received ({receivedTransfers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sent" className="mt-6">
            {sentTransfers.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Send className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">
                      No portfolios sent yet
                    </p>
                    <Button
                      onClick={() => setShowTransferModal(true)}
                      className="mt-4"
                      variant="outline"
                    >
                      Send Your First Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sentTransfers.map((transfer) => {
                  const portfolio = allPortfolios.find(
                    (p) => p.id === transfer.portfolioId
                  )
                  return (
                    <Card key={transfer.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {portfolio?.name || "Unknown Portfolio"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Sent on{" "}
                              {new Date(transfer.transferDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Value: €
                              {portfolio?.totalValue.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              }) || "0.00"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(transfer.status)}>
                              {transfer.status}
                            </Badge>
                            {transfer.completionDate && (
                              <p className="text-xs text-muted-foreground">
                                Completed{" "}
                                {new Date(transfer.completionDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-6">
            {receivedTransfers.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">
                      No portfolio transfers received yet
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {receivedTransfers.map((transfer) => (
                  <Card key={transfer.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Portfolio Transfer from User
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Received on{" "}
                            {new Date(
                              transfer.transferDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(transfer.status)}>
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>

                      {transfer.status === "pending" && (
                        <div className="mt-4 flex gap-2 border-t border-border pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            Reject
                          </Button>
                          <Button size="sm" className="flex-1">
                            Accept
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* How It Works */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How Portfolio Transfers Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Select Portfolio</p>
                  <p className="text-sm text-muted-foreground">
                    Choose which portfolio you want to transfer
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Enter Recipient</p>
                  <p className="text-sm text-muted-foreground">
                    Provide the recipient's user ID or email address
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Send Request</p>
                  <p className="text-sm text-muted-foreground">
                    Submit the transfer request for approval
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  4
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Recipient Approves
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The recipient reviews and accepts the transfer
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <TransferPortfolioModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        portfolios={allPortfolios}
      />
    </div>
  )
}
