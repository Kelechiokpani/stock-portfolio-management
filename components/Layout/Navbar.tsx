"use client";

import React, { useState, useEffect } from "react";
import { Activity, Search, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/lib/theme-provider";
import Link from "next/link";

export const Navbar = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = ["Markets", "News", "Screeners", "Portfolio", "Education"];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        /* Using bg-background without opacity for a 100% solid fill */
        scrolled
          ? "bg-white dark:bg-black shadow-sm h-14"
          : "bg-white dark:bg-black h-16"
      }`}
    >
      <div className="max-w-[1536px] mx-auto px-4 md:px-10 h-full flex items-center justify-between">
        {/* --- LOGO --- */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
            <div className="bg-primary p-1.5 rounded text-primary-foreground">
              <Activity size={18} />
            </div>
            <span className="text-foreground">
              EQUITY<span className="text-primary font-black">FLOW</span>
            </span>
          </div>

          {/* --- DESKTOP LINKS --- */}
          <div className="hidden xl:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {navLinks.map((link) => (
              <span
                key={link}
                className="hover:text-primary cursor-pointer transition-colors uppercase"
              >
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* --- RIGHT ACTIONS --- */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-bold text-[10px] md:text-xs h-9 px-3 uppercase tracking-widest text-foreground hover:bg-muted"
              >
                Log In
              </Button>
            </Link>
            <Link href="/request-account">
              <Button className="rounded px-4 font-bold text-[10px] md:text-xs h-9 shadow-sm uppercase tracking-widest bg-primary text-primary-foreground">
                Join Now
              </Button>
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className="xl:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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

      {/* --- MOBILE OVERLAY (Solid Background) --- */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-black transition-transform duration-300 xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: scrolled ? "3.5rem" : "4rem" }}
      >
        <div className="flex flex-col p-6 gap-8 h-full">
          <div className="relative md:hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="h-11 w-full rounded-lg border border-border bg-muted/50 dark:bg-zinc-900 pl-11 text-sm outline-none text-foreground"
              placeholder="Search markets..."
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Navigation
            </p>
            {navLinks.map((link) => (
              <span
                key={link}
                className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors py-2 border-b border-border/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-auto mb-10 sm:hidden">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full font-bold uppercase tracking-widest text-xs h-12 border-border text-foreground"
              >
                Log In
              </Button>
            </Link>
            <Link href="/request-account">
              <Button className="w-full font-bold uppercase tracking-widest text-xs h-12 bg-primary text-primary-foreground">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
