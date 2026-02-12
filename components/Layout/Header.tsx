"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    TrendingUp,
    LayoutDashboard,
    Briefcase,
    User,
    LogOut,
    Menu,
    X,
    LineChart,
    Wallet,
    Send,
    Globe,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/portfolio", label: "Portfolios", icon: Briefcase },
    { href: "/dashboard/transfer", label: "Transfers", icon: Send },

    // { href: "/dashboard/stocks", label: "Stocks", icon: Globe },
    // { href: "/dashboard/funds", label: "Funds", icon: Wallet },
    // { href: "/dashboard/inheritance", label: "Inheritance", icon: LineChart },
    // { href: "/dashboard/profile", label: "Profile", icon: User },
]

export default function Header( ) {

    const pathname = usePathname()
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <div className=" bg-background">
            {/* Top bar */}
            <header className="sticky top-0 z-50 border-b border-border bg-card">
                <div className="flex h-16 items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="lg:hidden"
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            aria-label="Toggle navigation"
                        >
                            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <TrendingUp className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">VaultStock</span>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/dashboard"
                                    ? pathname === "/dashboard"
                                    : pathname.startsWith(item.href)
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/profile">
                        <div className="hidden items-center gap-2 sm:flex">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                CR
                            </div>
                            <span className="text-xs font-medium text-foreground">Carlos Rivera</span>
                        </div>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            {/* Mobile Nav */}
            {mobileNavOpen && (
                <div className="border-b border-border bg-card p-4 lg:hidden">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/dashboard"
                                    ? pathname === "/dashboard"
                                    : pathname.startsWith(item.href)
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start gap-2"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}

        </div>
    )
}
