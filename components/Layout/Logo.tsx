import Link from "next/link";
import { Activity, TrendingUp } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
      <div className="bg-primary p-1.5 rounded text-primary-foreground">
        <Activity size={18} />
      </div>
      <span className="text-foreground">
        EQUITY<span className="text-primary font-black">FLOW</span>
      </span>
    </div>
  );
};

export default Logo;
