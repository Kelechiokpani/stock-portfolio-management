import Link from "next/link";
import {TrendingUp} from "lucide-react";
import React from "react";

const Logo = ( ) => {
    return (
        <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">VaultStock</span>
        </Link>
    )
}

export default Logo