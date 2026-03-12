import { BarChart3, Newspaper, Shield, Zap } from "lucide-react";

export const Feature = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/20 py-24 border-y">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight uppercase">
            The Professional Edge
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-medium">
            Institutional-grade modules for the modern retail investor.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              i: Zap,
              t: "Ultra-Low Latency",
              d: "Execute trades in ms with direct fiber.",
              c: "col-span-1",
            },
            {
              i: BarChart3,
              t: "Advanced Screeners",
              d: "50,000+ symbols and 150+ metrics.",
              c: "col-span-1 md:col-span-2 bg-slate-900 text-white dark:bg-primary",
            },
            {
              i: Shield,
              t: "Vault Security",
              d: "Protected by 256-bit encryption.",
              c: "col-span-1",
            },
            {
              i: Newspaper,
              t: "Terminal News",
              d: "Real-time news from world-class wires.",
              c: "col-span-1 md:col-span-2",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`${f.c} p-8 bg-background border border-border/40 rounded-lg transition-all group hover:border-primary/50`}
            >
              <f.i
                className={`w-6 h-6 mb-4 ${
                  f.c.includes("text-white") ? "text-white" : "text-primary"
                }`}
              />
              <h3 className="text-sm font-black mb-2 uppercase tracking-wide">
                {f.t}
              </h3>
              <p className="text-xs opacity-75 leading-relaxed font-medium">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
