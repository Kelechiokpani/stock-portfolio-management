"use client";

import React from "react";
import { Loader2, Shield } from "lucide-react";

interface GlobalLoaderProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export default function GlobalLoader({
  message = "Syncing with Core",
  subtext = "Securing your connection to the vault...",
  fullScreen = true,
}: GlobalLoaderProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center transition-all duration-700
        ${
          fullScreen
            ? "fixed inset-0 z-[9999] bg-white dark:bg-[#020617]"
            : "h-[400px] w-full bg-transparent"
        }
      `}
    >
      {/* Subtle Background Glow for Dark Mode / Soft Shadow for Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Outer Pulsing Rings - Infrastructure Theme */}
        <div className="absolute inset-0 h-24 w-24 -m-4 rounded-full border border-slate-200 dark:border-slate-800 animate-ping opacity-20" />
        <div className="absolute inset-0 h-24 w-24 -m-4 rounded-full border border-slate-100 dark:border-slate-900 animate-pulse opacity-40 scale-110" />

        {/* Main Icon Box */}
        <div className="relative h-20 w-20 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/10 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Loader2 className="h-10 w-10 animate-spin text-slate-900 dark:text-slate-100 stroke-[1.5px]" />

          {/* Icon Badge - Matches your "Vault" identity */}
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
            <Shield className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Dynamic Typography */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h3 className="text-sm font-black tracking-[0.3em] uppercase text-slate-900 dark:text-slate-100">
            {message}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
            {subtext}
          </p>
        </div>

        {/* Infrastructure Progress Bar */}
        <div className="mt-10 w-48 h-[1px] bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 dark:bg-blue-500 w-1/3 rounded-full animate-loading-slide" />
        </div>
      </div>

      {/* Scoped Styles for the bespoke progress animation */}
      <style jsx>{`
        @keyframes loading-slide {
          0% {
            transform: translateX(-150%);
          }
          50% {
            width: 60%;
          }
          100% {
            transform: translateX(250%);
          }
        }
        .animate-loading-slide {
          animation: loading-slide 2s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
      `}</style>
    </div>
  );
}
