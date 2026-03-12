"use client";

import React from "react";
import { ArrowLeft, ShieldCheck, LucideIcon, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for tailwind classes
import { useTheme } from "@/lib/theme-provider";
import { Button } from "../ui/button";

interface NavProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  backHref?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  className?: string;
}

export const Nav = ({
  title = "EQUITYFLOW",
  subtitle = "Registration",
  icon: Icon,
  backHref = "/",
  showBadge = true,
  badgeText = "New User Account Request",
  badgeIcon: BadgeIcon = ShieldCheck,
  className,
}: NavProps) => {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Dynamic Back Button */}
          {backHref && (
            <Link
              href={backHref}
              className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
            </Link>
          )}

          <div className="flex items-center gap-2">
            {/* Dynamic Main Icon */}
            {Icon && (
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end">
          {/* Dynamic Badge */}
          {showBadge && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800">
              <BadgeIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {badgeText}
              </span>
            </div>
          )}

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
    </nav>
  );
};
