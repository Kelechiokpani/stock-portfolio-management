"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, Shield, Star, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

const bgImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Modern Banking Architecture
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop", // Trading Floor/Data
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Professional Analytics
];

export const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-[#09090b]">
      {/* Visual Background Element (The "Captivating" Part) */}
      <div className="absolute top-0 right-0 w-full lg:w-[45%] h-full hidden lg:block">
        {bgImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentBg ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#09090b] via-transparent to-transparent z-10" />
            <img
              src={img}
              className="w-full h-full object-cover grayscale-[0.5] contrast-[1.1]"
              alt="Investment Banking"
            />
          </div>
        ))}
      </div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-10 py-20 lg:py-40 grid lg:grid-cols-2 gap-16 items-center relative z-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em]">
            <Star size={12} fill="currentColor" /> Market Leader 2026
          </div>

          <h1 className="text-5xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
            Invest with <br />
            <span className="text-blue-600 italic font-serif">
              Institutional
            </span>
            <br /> Precision.
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-[480px] leading-relaxed font-medium">
            Access real-time global analytics, professional-grade screeners, and
            AI-driven insights to outperform the market.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/request-account">
              <Button
                size="lg"
                className="rounded-full h-14 px-10 text-xs font-bold uppercase tracking-widest shadow-2xl shadow-blue-500/40 bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-1"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-10 text-xs font-bold uppercase tracking-widest border-2 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Client Portal
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                <Shield size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Bank-Grade Security
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                <Globe size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                150+ Global Exchanges
              </span>
            </div>
          </div>
        </div>

        {/* The Terminal UI Card - Enhanced with Glassmorphism */}
        <div className="relative group perspective-1000">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

          <Card className="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden rounded-2xl transform transition-transform group-hover:rotate-y-2">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-inner" />
              </div>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Equity Terminal v4.0
              </span>
            </div>
            <CardContent className="p-10 space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 uppercase font-black tracking-[0.15em]">
                    Portfolio Valuation
                  </p>
                  <h3 className="text-4xl font-mono font-bold tracking-tighter text-slate-900 dark:text-white">
                    $842,510.24
                  </h3>
                </div>
                <div className="text-right pb-1">
                  <p className="text-emerald-500 font-black text-2xl flex items-center gap-1">
                    +18.4% <ChevronRight size={16} />
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    YTD Performance
                  </p>
                </div>
              </div>

              {/* Chart Visual */}
              <div className="h-48 flex items-end gap-2 px-1">
                {[30, 50, 40, 80, 60, 90, 75, 110, 95, 120].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-500 rounded-t-md ${
                      i === 9
                        ? "bg-blue-600 shadow-lg shadow-blue-500/50"
                        : "bg-slate-200 dark:bg-slate-800 hover:bg-blue-400"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
