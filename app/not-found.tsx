import React from "react";
import Link from "next/link";
import { Search, ArrowLeft, BarChart3, Activity } from "lucide-react"; // Using Lucide for professional icons

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-3xl w-full text-center">
        {/* Abstract "Broken Data" Graphic */}
        <div className="relative mb-12 flex justify-center items-center">
          <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
            <span className="text-[20rem] font-bold">404</span>
          </div>

          <div className="relative flex items-end gap-3 h-48 px-10 border-b-2 border-slate-200">
            {/* Animated Bars to simulate a 'crashing' market */}
            <div className="w-8 bg-blue-500/20 h-32 rounded-t-md transition-all duration-1000 ease-in-out hover:h-40" />
            <div className="w-8 bg-blue-500/40 h-24 rounded-t-md" />
            <div className="w-8 bg-blue-600 h-36 rounded-t-md" />
            <div className="w-8 bg-red-500 h-16 rounded-t-md animate-bounce" />
            <div className="w-8 bg-slate-200 h-28 rounded-t-md" />

            {/* The Floating 404 Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 shadow-xl border border-slate-100 rounded-2xl">
              <span className="text-5xl font-black tracking-tight text-slate-800">
                404
              </span>
            </div>
          </div>
        </div>

        {/* Financial Context Headers */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Ticker Symbol{" "}
            <span className="text-red-500 font-mono italic">"NOT_FOUND"</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
            The page or asset you are looking for has been delisted or is
            currently experiencing a liquidity crisis. Let’s get your portfolio
            back on track.
          </p>
        </div>

        {/* Professional Search Input */}
        <div className="relative max-w-md mx-auto mb-12 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search symbols, news, or sectors..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl leading-5 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>

        {/* Action Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Activity className="w-4 h-4 text-blue-500" />
            Return Back Home
          </Link>
        </div>

        {/* Institutional Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
          <Link
            href="/support"
            className="hover:text-slate-600 transition-colors"
          >
            Support Center
          </Link>
          <Link
            href="/status"
            className="hover:text-slate-600 transition-colors flex items-center gap-1"
          >
            System Status{" "}
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </Link>
          <Link href="/api" className="hover:text-slate-600 transition-colors">
            API Reference
          </Link>
        </div>
      </div>
    </div>
  );
}
