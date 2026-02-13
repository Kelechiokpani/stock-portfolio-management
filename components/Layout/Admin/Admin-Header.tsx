"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    TrendingUp,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
   ShieldCheck, UserCheck, Users,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Layout/Logo";
import {Badge} from "@/components/ui/badge";


const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Account Requests", icon: UserCheck, badge: 3 },
    { href: "/admin/users", label: "Users", icon: Users },
]

export default function Admin_Header( ) {

    const pathname = usePathname()
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <div className=" bg-background">
            {/* Top bar */}
            <header className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground">
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
                        <Logo/>

                    </div>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href)
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground ${
                                            isActive ? "bg-primary-foreground/10" : ""
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                        {item.badge && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {item.badge}
                      </span>
                                        )}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 sm:flex">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10 text-sm font-semibold">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">Admin</span>
                        </div>
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-1 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
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
                                item.href === "/admin"
                                    ? pathname === "/admin"
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
                                        {item.badge && (
                                            <Badge variant="destructive" className="ml-auto text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
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
