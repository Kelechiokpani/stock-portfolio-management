"use client"
import React, { useState } from "react"
import Sidebar from "@/components/Layout/User/Sidebar"
import Header from "@/components/Layout/User/Header"


export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="h-screen flex overflow-hidden bg-background ">
            {/* Sidebar (fixed height, no scroll with page) */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            {/* Main Area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">

                {/* Header (fixed) */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Scrollable Content Only */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>
        </div>
    )
}



// "use client"
// import React from "react"
// import { usePathname } from "next/navigation"
// import { useState } from "react"
// import Header from "@/components/Layout/User/Header";
//
//
// export default function DashboardLayout({children,}: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const [mobileNavOpen, setMobileNavOpen] = useState(false)
//
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top bar */}
//        <Header/>
//       {/* Content */}
//       <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
//       {/*<main className="mx-auto  px-4 ">{children}</main>*/}
//     </div>
//   )
// }
