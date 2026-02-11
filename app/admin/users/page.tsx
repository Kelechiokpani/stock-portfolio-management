"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Shield,
  FileText,
  Briefcase,
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
import { mockUsers, type User, type UserStatus } from "@/lib/mock-data"

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    user: User
    action: "approve" | "reject"
  } | null>(null)

  const filteredUsers =
    filterStatus === "all" ? users : users.filter((u) => u.status === filterStatus)

  function handleAction(userId: string, action: "approve" | "reject") {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: (action === "approve" ? "approved" : "rejected") as UserStatus }
          : u
      )
    )
    setConfirmAction(null)
    setSelectedUser(null)
  }

  const statusBadge = (status: UserStatus) => {
    switch (status) {
      case "pending_approval":
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
      case "onboarding":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Onboarding
          </Badge>
        )
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-muted-foreground">
            Manage registered users and their account status.
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
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
                  <TableHead>KYC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Portfolios</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{user.country}</TableCell>
                    <TableCell>
                      {user.kycCompleted ? (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(user.status)}</TableCell>
                    <TableCell className="text-center">{user.portfolios.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        {user.status === "pending_approval" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() =>
                                setConfirmAction({ user, action: "approve" })
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setConfirmAction({ user, action: "reject" })
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

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">User Details</DialogTitle>
            <DialogDescription>
              Account information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {statusBadge(selectedUser.status)}
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <h4 className="font-semibold text-foreground text-sm">Personal Information</h4>
                {[
                  { label: "Email", value: selectedUser.email },
                  { label: "Phone", value: selectedUser.phone },
                  { label: "Country", value: selectedUser.country },
                  { label: "Date of Birth", value: new Date(selectedUser.dateOfBirth).toLocaleDateString() },
                  { label: "Address", value: selectedUser.address },
                  { label: "Occupation", value: selectedUser.occupation },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Shield className={`h-4 w-4 ${selectedUser.kycCompleted ? "text-success" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">KYC</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.kycCompleted ? "Done" : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <FileText className={`h-4 w-4 ${selectedUser.agreementSigned ? "text-success" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">Agreement</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.agreementSigned ? "Signed" : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Portfolios</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.portfolios.length}</p>
                  </div>
                </div>
              </div>

              {selectedUser.status === "pending_approval" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                    onClick={() =>
                      setConfirmAction({ user: selectedUser, action: "approve" })
                    }
                  >
                    Approve Account
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      setConfirmAction({ user: selectedUser, action: "reject" })
                    }
                  >
                    Reject Account
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === "approve" ? "Approve Account" : "Reject Account"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.action === "approve"
                ? `Are you sure you want to approve the account for ${confirmAction?.user.fullName}? They will be able to start creating portfolios.`
                : `Are you sure you want to reject the account for ${confirmAction?.user.fullName}? They will be notified via email.`}
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
                  handleAction(confirmAction.user.id, confirmAction.action)
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
