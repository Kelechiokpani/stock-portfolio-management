"use client"

import Link from "next/link"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockUserRequests, mockUsers } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  const pendingRequests = mockUserRequests.filter((r) => r.status === "pending")
  const approvedRequests = mockUserRequests.filter((r) => r.status === "approved")
  const rejectedRequests = mockUserRequests.filter((r) => r.status === "rejected")

  const pendingAccounts = mockUsers.filter((u) => u.status === "pending_approval")
  const activeAccounts = mockUsers.filter((u) => u.status === "approved")

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
        Admin Dashboard
      </h1>
      <p className="mt-1 text-muted-foreground">
        Overview of account requests, users, and platform activity.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground">{approvedRequests.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <UserX className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-foreground">{rejectedRequests.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Requests</CardTitle>
            <Link href="/admin/requests">
              <Button variant="ghost" size="sm" className="gap-1 text-accent">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{request.fullName}</p>
                      <p className="text-xs text-muted-foreground">{request.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {request.country}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Accounts Pending Approval</CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="gap-1 text-accent">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No accounts pending approval</p>
            ) : (
              <div className="space-y-3">
                {pendingAccounts.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.kycCompleted ? "default" : "secondary"} className="text-xs">
                        {user.kycCompleted ? "KYC Done" : "KYC Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
