export const Trackers = () => {
  return (
    <section className="bg-white dark:bg-black text-foreground py-24 overflow-hidden relative border-y border-border/40">
      {/* Subtle background glow effect - adjusted for theme visibility */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">
              Whale Tracker
            </span>
            <h2 className="text-3xl font-black tracking-tight uppercase">
              Institutional Flow
            </h2>
          </div>
          <p className="max-w-xs text-muted-foreground text-xs font-medium leading-relaxed">
            Real-time tracking of large block trades and dark pool activity
            across global markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["BlackRock", "Vanguard", "Fidelity", "State Street"].map(
            (inst, i) => (
              <div
                key={inst}
                className="bg-muted/30 dark:bg-white/5 border border-border dark:border-white/10 rounded-lg p-6 hover:bg-muted/50 dark:hover:bg-white/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-6 uppercase">
                  <div className="font-black text-sm tracking-tight text-foreground">
                    {inst}
                  </div>
                  <div className="text-[9px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">
                    ACTIVE
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Top Buy</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      NVDA
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-1 w-full bg-border dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 group-hover:brightness-110"
                      style={{ width: `${70 + i * 5}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Confidence
                    </span>
                    <span className="text-[9px] font-mono font-bold text-foreground">
                      {70 + i * 5}%
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
