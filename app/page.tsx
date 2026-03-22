// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   TrendingUp,
//   TrendingDown,
//   Search,
//   Bell,
//   Globe,
//   ArrowRight,
//   Activity,
//   Shield,
//   Zap,
//   BarChart3,
//   Layers,
//   Newspaper,
//   ChevronRight,
//   PlayCircle,
//   Star,
//   ArrowUpRight,
//   BrainCircuit,
//   Gift,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Navbar } from "@/components/Layout/Navbar";
// import { Markets_Chart } from "@/components/Home/market_chart";
// import { Hero } from "@/components/Home/Hero";
// import { Analysis } from "@/components/Home/Analysis";
// import { Feature } from "@/components/Home/Feature";
// import { Trackers } from "@/components/Home/Trackers";
// import HomeLayout from "@/components/Layout/Layout";
// import { AssetAllocation } from "@/components/Home/AssetAllocation";
// import { YieldCalculator } from "@/components/Home/YieldCalculator";
// import { HomeCarousel } from "@/components/Home/HomeCarousel";

// export default function EquityFlowHome() {
//   return (
//     <HomeLayout>
//       <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground font-sans selection:bg-primary/10">
//         <Markets_Chart />
//         <HomeCarousel />

//         <YieldCalculator />

//         <Analysis />
//         <Hero />
//         <Feature />

//         <AssetAllocation />

//         <Trackers />
//       </div>
//     </HomeLayout>
//   );
// }

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Globe2,
  Zap,
  BarChart3,
  Clock,
  ArrowRight,
  Layers,
  Lock,
  MousePointer2,
  Smartphone,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HomeLayout from "@/components/Layout/Layout";
import Link from "next/link";
import Logo from "@/components/Layout/Logo";
import { AssetAllocation } from "@/components/Home/AssetAllocation";

export default function InvestmentLandingPage() {
  return (
    <HomeLayout>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          {/* Abstract Light Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              // src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover opacity-10"
              alt="Hero gradient"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f615,transparent)]" />
          </div>

          <div className="max-w-5xl text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border-none text-[10px] font-black uppercase tracking-[0.3em]">
                Institutional Grade Intelligence
              </Badge>
              <h1 className="text-6xl md:text-[6rem] font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
                Equity Flow
                <br /> <span className="text-blue-600">Capital</span>
              </h1>

              <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                A unified ecosystem for sophisticated investors. Access global
                markets, automated portfolios, and real-time risk analytics.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/request-account">
                  <Button className="h-16 px-12 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                    Open Institutional Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-16 px-12 rounded-2xl border-2 font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 backdrop-blur-sm"
                  >
                    Live Markets <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. LIVE TICKER */}
        <section className="py-8 border-y border-slate-100 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex gap-16 animate-marquee whitespace-nowrap overflow-hidden items-center">
            {[
              "BTC $64,231 (+1.2%)",
              "AAPL $182.52 (-0.4%)",
              "NVDA $875.20 (+3.5%)",
              "EUR/USD 1.08",
              "GOLD $2,150 (+0.8%)",
            ].map((tick, i) => (
              <span
                key={i}
                className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    tick.includes("+")
                      ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                      : "bg-rose-500"
                  }`}
                />{" "}
                {tick}
              </span>
            ))}
          </div>
        </section>

        {/* 3. CORE STATS */}
        <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "AUM", value: "$2.4B+" },
            { label: "Active Users", value: "140K" },
            { label: "Global Markets", value: "18" },
            { label: "Security Rating", value: "AAA" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group cursor-default border-l border-slate-100 dark:border-slate-800 pl-6"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 transition-colors group-hover:text-blue-500">
                {stat.label}
              </p>
              <h3 className="text-4xl md:text-5xl font-mono italic font-bold tracking-tighter">
                {stat.value}
              </h3>
            </div>
          ))}
        </section>

        {/* 4. BENTO FEATURE GRID */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            <div className="md:col-span-2 rounded-[3rem] bg-slate-950 p-12 flex flex-col justify-end relative overflow-hidden group">
              {/* Dark Professional Image */}
              <img
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                alt="Trading Terminal"
              />
              <div className="relative z-10">
                <h4 className="text-4xl font-bold tracking-tighter text-white mb-4 uppercase italic">
                  Multi-Asset <br /> Execution
                </h4>
                <p className="text-slate-300 max-w-sm text-sm font-medium">
                  Trade 1,200+ instruments across equity, digital assets, and
                  commodities with zero-latency.
                </p>
              </div>
            </div>
            <div className="rounded-[3rem] bg-blue-600 p-12 flex flex-col justify-between text-white shadow-2xl shadow-blue-500/20 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                <ShieldCheck size={120} />
              </div>
              <ShieldCheck className="h-12 w-12 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-bold tracking-tighter uppercase italic mb-2">
                  Vault-Grade <br /> Custody
                </h4>
                <p className="text-blue-100 text-xs">
                  Multi-sig institutional cold storage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PORTFOLIO MIRRORING */}
        <section className="py-32 bg-slate-50/50 dark:bg-slate-900/30 px-6 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.9]">
                Automated <br /> Mirroring
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Generated by elite quantitative models. Simply choose your risk
                appetite and let our neural networks rebalance your capital in
                real-time.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "AI-Driven Rebalancing",
                  "Tax-Loss Harvesting",
                  "Smart-Beta Indexing",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-blue-500 transition-colors"
                  >
                    <CheckCircle className="text-blue-600 h-5 w-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full bg-white dark:bg-slate-950 p-6 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative group">
              <img
                src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Data Chart"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-600 p-6 rounded-full text-white shadow-2xl animate-bounce">
                  <Activity size={32} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ANALYTICS (DARK BREAK) */}
        <section className="py-32 px-6 bg-slate-950 text-white rounded-[5rem] mx-4 my-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-4xl font-bold tracking-tighter italic mb-12 uppercase">
              Deep Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Zap />, label: "0.04ms Latency" },
                { icon: <Layers />, label: "Deep Liquidity" },
                { icon: <Lock />, label: "Quantum Secure" },
              ].map((box, i) => (
                <div
                  key={i}
                  className="p-10 border border-slate-800 rounded-[2.5rem] hover:bg-white/5 transition-colors group"
                >
                  <div className="text-blue-500 mb-6 flex justify-center group-hover:scale-110 transition-transform">
                    {box.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {box.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. GLOBAL COMPLIANCE */}
        <section className="py-32 px-6 max-w-7xl mx-auto text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
              alt="Map"
            />
          </div>
          <Globe2 className="h-16 w-16 mx-auto text-blue-600 opacity-40 animate-pulse" />
          <h2 className="text-5xl font-black uppercase tracking-tighter italic relative z-10">
            Global Reach. <br /> Local Safety.
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 font-medium relative z-10">
            Regulated across Pan-African and European jurisdictions. Your
            capital is protected by the highest standards of international
            financial law.
          </p>
        </section>

        {/* 8. MOBILE PREVIEW */}
        <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-72 h-[580px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.1)] relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover opacity-80"
                    alt="App UI"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8 order-1 md:order-2">
              <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
                Your Wealth <br /> In Motion.
              </h2>
              <p className="text-slate-500 text-lg">
                Full institutional capabilities on your mobile device. Biometric
                security, instant execution, and 24/7 concierge support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="h-16 px-8 rounded-2xl bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800">
                  <Smartphone size={18} /> App Store
                </Button>
                <Button className="h-16 px-8 rounded-2xl bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800">
                  Play Store
                </Button>
              </div>
            </div>
          </div>
        </section>

        <AssetAllocation />

        {/* 10. FINAL CTA */}
        <section className="py-40 px-6 text-center bg-blue-600 text-white relative overflow-hidden">
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-[5rem] font-black tracking-tighter mb-12 uppercase italic leading-none">
              Begin Your <br /> Legacy
            </h2>
            <Link href="/request-account">
              <Button className="h-14 px-20 rounded-full bg-white text-blue-600 font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20">
                Open Account Now
              </Button>
            </Link>
            <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
              Join 140,000+ Global Institutional Investors
            </p>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
