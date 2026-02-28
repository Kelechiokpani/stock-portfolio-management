"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Users,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    ClipboardList,
    ShieldCheck,
    History,
    FileText,
    Settings,
    UserCheck,
    Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"

// Updated Nav Items for Admin Context
const adminNavItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Account Requests", icon: ClipboardList },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/kyc", label: "Compliance/KYC", icon: ShieldCheck },
    { href: "/admin/region", label: "Regional Settings ", icon: UserCheck },
    { href: "/admin/market", label: "System Markets", icon: FileText },
    { href: "/admin/settings", label: "System Settings", icon: Settings },
];

interface Props {
    open: boolean
    onClose: () => void
}

export default function Admin_Sidebar({ open, onClose }: Props) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                          fixed lg:static top-0 left-0 z-50
                          h-screen bg-card border-r border-border
                          transition-all duration-300 ease-in-out
                          ${collapsed ? "w-20" : "w-64"}
                          ${open ? "translate-x-0" : "-translate-x-full"} 
                          lg:translate-x-0 lg:block `}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-foreground leading-tight">FS Group</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Admin Portal</span>
                        </div>
                    )}

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {adminNavItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href)

                        return (
                            <Link key={item.href} href={item.href} onClick={onClose} className="block">
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`
                                        h-11 w-full 
                                        ${collapsed ? "justify-center px-0" : "justify-start px-4"} 
                                        gap-3 transition-all duration-200
                                        ${isActive ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold" : "text-muted-foreground"}
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}

                                    {/* Optional: Add a "New" badge for Requests if collapsed is false */}
                                    {!collapsed && item.label === "Account Requests" && (
                                        <span className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                            12
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Account Section */}
                <div className="absolute bottom-0 w-full p-4 border-t border-border/50">
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            AD
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-medium truncate">Admin User</span>
                                <span className="text-[10px] text-muted-foreground truncate">admin@fsgroup.com</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}