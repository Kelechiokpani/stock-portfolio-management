import { ArrowUpRight, BrainCircuit } from "lucide-react";
import { Button } from "../ui/button";

export const Analysis = () => {
  return (
    <section className="max-w-[1536px] mx-auto px-6 md:px-10 py-24 border-t">
      <div className="grid lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-1 space-y-5">
          <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center text-primary">
            <BrainCircuit size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-tight uppercase">
            AI Sentiment Analysis
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Neural network analysis scanning millions of data points to gauge
            market mood before it hits the tape.
          </p>
          <div className="pt-2">
            <Button
              variant="link"
              className="p-0 font-black uppercase text-[10px] tracking-widest gap-2 h-auto"
            >
              Explore AI Tools <ArrowUpRight size={14} />
            </Button>
          </div>
        </div>
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
          {[
            {
              label: "Retail Bullishness",
              value: "84%",
              trend: "+12%",
              color: "text-emerald-500",
            },
            {
              label: "Institutional Fear",
              value: "22%",
              trend: "-5%",
              color: "text-rose-500",
            },
            {
              label: "Sector Focus",
              value: "Semis",
              trend: "Volume Alert",
              color: "text-blue-500",
            },
            {
              label: "Volatility",
              value: "Low",
              trend: "Stable",
              color: "text-amber-500",
            },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-lg border bg-card/50 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
              <div className={`text-3xl font-mono font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">
                {stat.trend} VS LW
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
