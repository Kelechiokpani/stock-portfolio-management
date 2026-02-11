"use client"

import { CheckCircle2, Shield, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"

export default function ProfilePage() {
  const user = mockUsers[0]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Profile</h1>
      <p className="mt-1 text-muted-foreground">Your account information and verification status.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Full Name", value: user.fullName },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Country", value: user.country },
              { label: "Date of Birth", value: new Date(user.dateOfBirth).toLocaleDateString() },
              { label: "Address", value: user.address },
              { label: "Occupation", value: user.occupation },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground text-right">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant={user.status === "approved" ? "default" : "secondary"}>
                  {user.status === "approved" ? "Approved" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Portfolios</span>
                <span className="text-sm font-medium text-foreground">{user.portfolios.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${user.kycCompleted ? "bg-success/10" : "bg-muted"}`}>
                  {user.kycCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">KYC Verification</p>
                  <p className="text-xs text-muted-foreground">
                    {user.kycCompleted ? "Identity verified" : "Pending verification"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${user.agreementSigned ? "bg-success/10" : "bg-muted"}`}>
                  {user.agreementSigned ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Agreement</p>
                  <p className="text-xs text-muted-foreground">
                    {user.agreementSigned ? "Agreement signed" : "Pending signature"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
