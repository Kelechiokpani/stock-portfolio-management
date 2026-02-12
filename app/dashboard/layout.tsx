"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Header from "@/components/Layout/Header";


export default function DashboardLayout({children,}: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
       <Header/>
      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
      {/*<main className="mx-auto  px-4 ">{children}</main>*/}
    </div>
  )
}
