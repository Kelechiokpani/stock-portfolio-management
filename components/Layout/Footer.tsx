import { Activity } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card pt-20 pb-10">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
              <Activity className="text-primary" size={24} />
              <span>EQUITYFLOW</span>
            </div>
            <p className="text-muted-foreground font-medium text-xs leading-relaxed max-w-xs">
              The world's most advanced financial analytics platform. Empowering
              retail investors with institutional-grade tools.
            </p>
          </div>
          {["Platforms", "Data", "Legal"].map((title) => (
            <div key={title} className="space-y-4">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                {title}
              </h4>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                {["Overview", "Markets", "Charts", "API", "Privacy"].map(
                  (item) => (
                    <li
                      key={item}
                      className="hover:text-primary cursor-pointer transition-colors uppercase tracking-widest"
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <p>© 2026 EquityFlow Finance Group.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
