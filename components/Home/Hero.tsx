import { ArrowRight, Globe, Shield, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="max-w-[1536px] mx-auto px-6 md:px-10 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded border border-primary/10 text-[9px] font-black uppercase tracking-[0.2em]">
          <Star size={10} fill="currentColor" /> Market Leader 2026
        </div>
        <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1]">
          Invest with <br />
          <span className="text-primary italic">Institutional</span> <br />
          Precision.
        </h1>
        <p className="text-base text-muted-foreground max-w-[460px] leading-relaxed font-medium">
          Access real-time global analytics, professional-grade screeners, and
          AI-driven insights to outperform the market.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link href="/request-account">
            <Button
              size="default"
              className="rounded-2xl h-11 px-8 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-transform hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="default"
              variant="outline"
              className="rounded-2xl h-11 px-8 text-xs font-bold uppercase tracking-widest border-2"
            >
              Already Have an Account?
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-6 pt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-emerald-500" /> Bank-Grade
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-blue-500" /> 150+ Exchanges
          </div>
        </div>
      </div>

      <div className="relative group">
        <Card className="relative bg-card border border-border/60 shadow-xl overflow-hidden rounded-xl">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
              Terminal v4.0.2
            </span>
          </div>
          <CardContent className="p-8 space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Live Value
                </p>
                <h3 className="text-3xl font-mono font-bold tracking-tighter">
                  $842,510.24
                </h3>
              </div>
              <div className="text-right pb-0.5">
                <p className="text-emerald-500 font-black text-xl">+18.4%</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                  YTD Growth
                </p>
              </div>
            </div>
            <div className="h-40 flex items-end gap-1.5 px-1">
              {[40, 65, 45, 90, 55, 80, 70, 95, 85, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
