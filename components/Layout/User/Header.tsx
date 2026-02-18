"use client"

import Link from "next/link"
import { Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Layout/Logo"
import {useTheme} from "@/lib/theme-provider";
import { Sun, Moon } from 'lucide-react'


interface HeaderProps {
    onMenuClick: () => void
}


export default function Header({ onMenuClick }: HeaderProps) {

    const { theme, toggleTheme, mounted } = useTheme()


    return (
        <header className="sticky top-0 z-40 w-full border-b bg-card">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left Section */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Logo */}
                    <Logo />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3 sm:gap-4">

                    {/* User Profile */}
                    <Link
                        href="/dashboard/profile"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            CR
                        </div>
                        <span className="text-sm font-medium hidden md:inline">
              Carlos Rivera
            </span>
                    </Link>

                    {/* Mobile Profile Icon */}
                    <Link
                        href="/dashboard/profile"
                        className="sm:hidden p-2 rounded-md hover:bg-muted"
                    >
                        <User className="h-5 w-5" />
                    </Link>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="border-gray-700 dark:border-gray-600"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Logout */}
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </Link>

                </div>
            </div>
        </header>
    )
}


// "use client"
//
// import React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//     TrendingUp,
//     LayoutDashboard,
//     Briefcase,
//     User,
//     LogOut,
//     Menu,
//     X,
//     LineChart,
//     Wallet,
//     Send,
//     Globe,
// } from "lucide-react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import Logo from "@/components/Layout/Logo";
//
// const navItems = [
//     { href: "/dashboard/market", label: "Markets", icon: LayoutDashboard },
//     { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
//     { href: "/dashboard/portfolio", label: "Portfolios", icon: Briefcase },
//     { href: "/dashboard/investments", label: "Investments", icon: Wallet },
//     { href: "/dashboard/transfer", label: "Transfers", icon: Send },
//
//     // { href: "/dashboard/stocks", label: "Stocks", icon: Globe },
//     // { href: "/dashboard/funds", label: "Funds", icon: Wallet },
//     // { href: "/dashboard/inheritance", label: "Inheritance", icon: LineChart },
//     // { href: "/dashboard/settings", label: "Profile", icon: User },
// ]
//
// export default function Header( ) {
//
//     const pathname = usePathname()
//     const [mobileNavOpen, setMobileNavOpen] = useState(false)
//
//     return (
//         <div className=" bg-background">
//             {/* Top bar */}
//             <header className="sticky top-0 z-50 border-b border-border bg-card">
//                 <div className="flex h-16 items-center justify-between px-4 lg:px-8">
//                     <div className="flex items-center gap-4">
//                         <button
//                             type="button"
//                             className="lg:hidden"
//                             onClick={() => setMobileNavOpen(!mobileNavOpen)}
//                             aria-label="Toggle navigation"
//                         >
//                             {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//                         </button>
//                        <Logo/>
//                     </div>
//
//                     <nav className="hidden items-center gap-1 lg:flex">
//                         {navItems.map((item) => {
//                             const isActive =
//                                 item.href === "/dashboard"
//                                     ? pathname === "/dashboard"
//                                     : pathname.startsWith(item.href)
//                             return (
//                                 <Link key={item.href} href={item.href}>
//                                     <Button
//                                         variant={isActive ? "secondary" : "ghost"}
//                                         size="sm"
//                                         className="gap-2"
//                                     >
//                                         <item.icon className="h-4 w-4" />
//                                         {item.label}
//                                     </Button>
//                                 </Link>
//                             )
//                         })}
//                     </nav>
//
//                     <div className="flex items-center gap-3">
//                         <Link href="/dashboard/settings">
//                         <div className="hidden items-center gap-2 sm:flex">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
//                                 CR
//                             </div>
//                             <span className="text-xs font-medium text-foreground">Carlos Rivera</span>
//                         </div>
//                         </Link>
//                         <Link href="/login">
//                             <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
//                                 <LogOut className="h-4 w-4" />
//                                 <span className="hidden sm:inline">Sign Out</span>
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </header>
//             {/* Mobile Nav */}
//             {mobileNavOpen && (
//                 <div className="border-b border-border bg-card p-4 lg:hidden">
//                     <nav className="flex flex-col gap-1">
//                         {navItems.map((item) => {
//                             const isActive =
//                                 item.href === "/dashboard"
//                                     ? pathname === "/dashboard"
//                                     : pathname.startsWith(item.href)
//                             return (
//                                 <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
//                                     <Button
//                                         variant={isActive ? "secondary" : "ghost"}
//                                         size="sm"
//                                         className="w-full justify-start gap-2"
//                                     >
//                                         <item.icon className="h-4 w-4" />
//                                         {item.label}
//                                     </Button>
//                                 </Link>
//                             )
//                         })}
//                     </nav>
//                 </div>
//             )}
//
//         </div>
//     )
// }
