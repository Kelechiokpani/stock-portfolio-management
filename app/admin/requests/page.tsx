"use client"

import { useState } from "react"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockUserRequests, type UserRequest, type RequestStatus } from "@/lib/mock-data"

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState(mockUserRequests)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    request: UserRequest
    action: "approve" | "reject"
  } | null>(null)

  const filteredRequests =
    filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus)

  function handleAction(requestId: string, action: "approve" | "reject") {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: (action === "approve" ? "approved" : "rejected") as RequestStatus,
              approvedDate: action === "approve" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : r
      )
    )
    setConfirmAction(null)
    setSelectedRequest(null)
  }

  const statusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="gap-1 bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Account Requests</h1>
          <p className="mt-1 text-muted-foreground">
            Review and manage incoming account opening requests.
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{request.email}</TableCell>
                    <TableCell className="text-muted-foreground">{request.country}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{statusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() =>
                                setConfirmAction({ request, action: "approve" })
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setConfirmAction({ request, action: "reject" })
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Request Details</DialogTitle>
            <DialogDescription>
              Account opening request from {selectedRequest?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {statusBadge(selectedRequest.status)}
              </div>
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedRequest.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedRequest.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedRequest.country}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Requested: {new Date(selectedRequest.requestDate).toLocaleDateString()}</span>
                {selectedRequest.approvedDate && (
                  <span>Approved: {new Date(selectedRequest.approvedDate).toLocaleDateString()}</span>
                )}
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                    onClick={() =>
                      setConfirmAction({ request: selectedRequest, action: "approve" })
                    }
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      setConfirmAction({ request: selectedRequest, action: "reject" })
                    }
                  >
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.action === "approve"
                ? `Are you sure you want to approve the account request from ${confirmAction?.request.fullName}? They will receive an email with a link to complete their registration.`
                : `Are you sure you want to reject the account request from ${confirmAction?.request.fullName}? They will be notified via email.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction?.action === "approve" ? "default" : "destructive"}
              className={
                confirmAction?.action === "approve"
                  ? "bg-success text-success-foreground hover:bg-success/90"
                  : ""
              }
              onClick={() => {
                if (confirmAction) {
                  handleAction(confirmAction.request.id, confirmAction.action)
                }
              }}
            >
              {confirmAction?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
