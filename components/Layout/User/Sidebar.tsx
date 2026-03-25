"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Layout/Logo";
import React, { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/market",
    label: "Market",
    icon: BarChart2,
  },

  { href: "/dashboard/stocks", label: "Stocks Holdings", icon: TrendingUp },

  { href: "/dashboard/wallet", label: "Wallet", icon: PieChart },

  {
    href: "/dashboard/investments",
    label: "Investments Portfolio",
    icon: Wallet,
  },
  { href: "/dashboard/transfer", label: "Assets Transfers", icon: Repeat },
  { href: "/dashboard/settings", label: "Profile Settings", icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
                          h-screen bg-card  border-border
                          transition-all duration-300
                          ${collapsed ? "w-20" : "w-56"}
                          ${open ? "block" : "hidden"} 
                          lg:block `}
      >
        {/*     ${collapsed ? "w-20" : "w-64"} */}
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 ">
          {!collapsed && (
            <span className="text-xl font-bold text-foreground tracking-tight">
              <Logo />
            </span>
          )}

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
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className=""
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  // variant={isActive ? "secondary" : "ghost"}
                  className={`py-4 mt-2 w-full ${
                    collapsed ? "justify-center px-2" : "justify-start"
                  } gap-3 `}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
