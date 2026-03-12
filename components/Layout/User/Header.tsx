"use client";

import Link from "next/link";
import { Menu, LogOut, User, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Layout/Logo";
import { useTheme } from "@/lib/theme-provider";
import { mockUsers } from "@/components/data/user-data";
import { useLogout } from "../User/Logout";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const handleLogout = useLogout();

  // Access the current user from your data
  const user = mockUsers[0];
  const isAuthenticated = !!user; // If user exists, show profile; otherwise show guest nav

  // Extract Initials (e.g., Carlos Rivera -> CR)
  const initials = user
    ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
    : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - Only visible when logged in to control sidebar */}
          {isAuthenticated && (
            <button
              onClick={onMenuClick}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition text-muted-foreground hover:text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Logo Component */}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isAuthenticated ? (
            /* GUEST STATE: Back to Home + Theme Toggle */
            <>
              <Link href="/" className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </>
          ) : (
            /* AUTHENTICATED STATE: Profile + Logout */
            <>
              {/* Desktop Profile Link */}
              <Link
                href="/dashboard/profile"
                className="hidden sm:flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-secondary/50 transition-all"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-sm text-primary-foreground text-[10px] font-black uppercase tracking-tighter transition-transform group-hover:scale-105">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-foreground hidden md:inline tracking-tight">
                  {user.profile.firstName}
                </span>
              </Link>

              {/* Mobile Profile Icon */}
              <Link
                href="/dashboard/profile"
                className="sm:hidden p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Logout Action */}
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Sign Out"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {/* THEME TOGGLE (Always Visible) */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:text-primary transition-all shadow-sm"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.1rem] w-[1.1rem]" />
              ) : (
                <Moon className="h-[1.1rem] w-[1.1rem]" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
