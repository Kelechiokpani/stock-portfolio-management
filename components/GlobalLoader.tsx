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
        flex flex-col items-center justify-center transition-all duration-500
        ${
          fullScreen
            ? "fixed inset-0 z-[9999] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
            : "h-[400px] w-full"
        }
      `}
    >
      <div className="relative flex flex-col items-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 h-24 w-24 -m-4 rounded-full border-2 border-slate-100 dark:border-slate-800 animate-ping opacity-20" />

        {/* Main Icon Container */}
        <div className="relative h-16 w-16 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-slate-900 dark:text-white" />

          {/* Subtle center icon - matches your "Vault" theme */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Shield className="h-4 w-4" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-800 dark:text-slate-200">
            {message}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic font-serif">
            {subtext}
          </p>
        </div>

        {/* Loading Progress Bar Indicator (Decorative) */}
        <div className="mt-8 w-32 h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 dark:bg-white w-1/3 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>
      </div>

      {/* Tailwind Animation Extension needed for 'loading-bar' in tailwind.config.js */}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
