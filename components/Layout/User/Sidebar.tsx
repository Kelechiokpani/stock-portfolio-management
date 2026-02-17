"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Briefcase,
    Send,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    BarChart2,
    TrendingUp,
    PieChart,
    Wallet,
    Repeat,
    Settings

} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Layout/Logo"
import React, { useState } from "react"

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/market", label: "Markets", icon: BarChart2 },
    { href: "/dashboard/stocks", label: "Stocks", icon: TrendingUp },
    { href: "/dashboard/funds", label: "Funds", icon: PieChart },
    { href: "/dashboard/investments", label: "Investments", icon: Wallet },
    { href: "/dashboard/transfer", label: "Stock Transfers", icon: Repeat },
    { href: "/dashboard/settings", label: "Profile Settings", icon: Settings },
];

interface Props {
    open: boolean
    onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                          fixed lg:static top-0 left-0 z-50
                          h-screen bg-card border-r border-border
                          transition-all duration-300
                          ${collapsed ? "w-20" : "w-44"}
                          ${open ? "block" : "hidden"} 
                          lg:block `}
            >
                {/*     ${collapsed ? "w-20" : "w-64"} */}
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    {!collapsed && <span className="text-xl font-bold text-foreground tracking-tight">VaultStock</span>}

                    {/*{!collapsed && <Logo />}*/}

                    {/* Collapse Toggle (Desktop Only) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-1 rounded-md hover:bg-muted"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {/* Navigation */}
                <nav className="p-3 space-y-6">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href)

                        return (
                            <Link key={item.href} href={item.href} onClick={onClose} className="">
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    // variant={isActive ? "secondary" : "ghost"}
                                    className={`py-4 mt-2 w-full ${collapsed ? "justify-center px-2" : "justify-start"} gap-3 `}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {!collapsed && <span>{item.label}</span>}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}


// "use client"
//
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//     LayoutDashboard,
//     Briefcase,
//     Wallet,
//     Send,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Logo from "@/components/Layout/Logo"
// import { useState } from "react"
//
// const navItems = [
//     { href: "/dashboard/market", label: "Markets", icon: LayoutDashboard },
//     { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
//     { href: "/dashboard/portfolio", label: "Portfolios", icon: Briefcase },
//     { href: "/dashboard/investments", label: "Investments", icon: Wallet },
//     { href: "/dashboard/transfer", label: "Transfers", icon: Send },
// ]
//
// interface Props {
//     open: boolean
//     onClose: () => void
// }
//
// export default function Sidebar({ open, onClose }: Props) {
//     const pathname = usePathname()
//
//     // collapsed state (desktop only)
//     const [collapsed, setCollapsed] = useState(false)
//
//     return (
//         <div className='sticky'>
//             {/* Mobile Overlay */}
//             {open && (
//                 <div
//                     className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//                     onClick={onClose}
//                 />
//             )}
//
//             <aside
//                 className={`
//           fixed top-0 left-0 z-50  bg-card border-r border-border h-screen w-64
//           transform transition-all duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0 lg:static lg:z-auto
//           ${collapsed ? "w-20" : "w-64"}
//         `}
//             >
//                 {/* Top section */}
//                 <div className="flex items-center justify-between h-16 px-3 border-b">
//                     {!collapsed && <Logo />}
//
//                     {/* Toggle button */}
//                     <button
//                         onClick={() => setCollapsed(!collapsed)}
//                         className="hidden lg:flex p-1 rounded-md hover:bg-muted"
//                     >
//                         {collapsed ? (
//                             <ChevronRight className="h-5 w-5" />
//                         ) : (
//                             <ChevronLeft className="h-5 w-5" />
//                         )}
//                     </button>
//                 </div>
//
//                 {/* Nav */}
//                 <nav className="p-2 space-y-1">
//                     {navItems.map((item) => {
//                         const isActive =
//                             item.href === "/dashboard"
//                                 ? pathname === "/dashboard"
//                                 : pathname.startsWith(item.href)
//
//                         return (
//                             <Link key={item.href} href={item.href} onClick={onClose}>
//                                 <Button
//                                     variant={isActive ? "secondary" : "ghost"}
//                                     className={`w-full ${
//                                         collapsed ? "justify-center" : "justify-start"
//                                     } gap-3`}
//                                 >
//                                     <item.icon className="h-5 w-5" />
//                                     {!collapsed && <span>{item.label}</span>}
//                                 </Button>
//                             </Link>
//                         )
//                     })}
//                 </nav>
//             </aside>
//         </div>
//     )
// }
