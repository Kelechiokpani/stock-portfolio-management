"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Modern Skyscraper/Bank
    title: "Institutional Grade Wealth Management",
    description:
      "Access private equity flows and advanced market analytics used by the world's top 1%.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop", // Stock Market Tickers
    title: "Real-Time Equity Intelligence",
    description:
      "Our neural networks process millions of data points to give you an edge in volatile markets.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1973&auto=format&fit=crop", // Professional Handshake/Advisory
    title: "Global Investment Network",
    description:
      "Connect your portfolio to international markets with zero-friction cross-border transfers.",
  },
];

export function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[95vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Professional Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/60 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover scale-105 animate-slow-pan"
          />

          <div className="absolute inset-0 z-20 flex items-center px-6 md:px-16 lg:px-24">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-500" />
                <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">
                  Premium Access
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic font-serif">
                {slide.title}
              </h1>
              <p className="text-slate-300 text-lg md:text-xl max-w-lg leading-relaxed">
                {slide.description}
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/request-account">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                  >
                    Open Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-dark border-white/20 backdrop-blur-md rounded-full px-8"
                  >
                    View Markets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 ${
              i === current ? "w-12 bg-blue-500" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
