"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Logo from "../Logo";

// Updated Nav Items for Admin Context
const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },

  { href: "/admin/market", label: "System Markets", icon: FileText },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/requests", label: "Account Requests", icon: ClipboardList },

  { href: "/admin/kyc", label: "Compliance/KYC", icon: ShieldCheck },
  { href: "/admin/profile", label: "Admin Profile", icon: Settings },
  { href: "/admin/region", label: "Regional Settings ", icon: UserCheck },
  // { href: "/admin/settings", label: "System Settings", icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Admin_Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
              <Logo />
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
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block"
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`
                                        h-11 w-full 
                                        ${
                                          collapsed
                                            ? "justify-center px-0"
                                            : "justify-start px-4"
                                        } 
                                        gap-3 transition-all duration-200
                                        ${
                                          isActive
                                            ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                                            : "text-muted-foreground"
                                        }
                                    `}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  {!collapsed && <span className="text-sm">{item.label}</span>}

                  {/* Optional: Add a "New" badge for Requests if collapsed is false */}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
