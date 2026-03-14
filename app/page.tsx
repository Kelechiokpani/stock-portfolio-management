"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Bell,
  Globe,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Layers,
  Newspaper,
  ChevronRight,
  PlayCircle,
  Star,
  ArrowUpRight,
  BrainCircuit,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Layout/Navbar";
import { Markets_Chart } from "@/components/Home/market_chart";
import { Hero } from "@/components/Home/Hero";
import { Analysis } from "@/components/Home/Analysis";
import { Feature } from "@/components/Home/Feature";
import { Trackers } from "@/components/Home/Trackers";
import HomeLayout from "@/components/Layout/Layout";
import { AssetAllocation } from "@/components/Home/AssetAllocation";
import { YieldCalculator } from "@/components/Home/YieldCalculator";
import { HomeCarousel } from "@/components/Home/HomeCarousel";

export default function EquityFlowHome() {
  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground font-sans selection:bg-primary/10">
        <Markets_Chart />
        <HomeCarousel />

        <YieldCalculator />

        <Analysis />
        <Hero />
        <Feature />

        <AssetAllocation />

        <Trackers />
      </div>
    </HomeLayout>
  );
}
