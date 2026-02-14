import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface Portfolio {
    id: string
    name: string
    value: number
    change: number
    holdings: number
    lastUpdated: string
    source: 'created' | 'transferred'
    status: 'active' | 'pending' | 'archived'
}

const User_Portfolio = () => {

    const [portfolios] = useState<Portfolio[]>([
        {
            id: '1',
            name: 'Growth Portfolio',
            value: 45230.50,
            change: 12.5,
            holdings: 8,
            lastUpdated: 'Today',
            source: 'created',
            status: 'active',
        },
        {
            id: '2',
            name: 'Tech Sector Focus',
            value: 32150.00,
            change: 18.3,
            holdings: 5,
            lastUpdated: 'Today',
            source: 'created',
            status: 'active',
        },
        {
            id: '3',
            name: 'Dividend Income',
            value: 28900.75,
            change: -2.1,
            holdings: 6,
            lastUpdated: 'Yesterday',
            source: 'transferred',
            status: 'active',
        },
    ])

    return (
        <div className="space-y-4 mt-6 sm:mt-8 mb-6 sm:mb-8 px-4 sm:px-0">

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {portfolios.map((portfolio) => (
                    <Link key={portfolio.id} href={`/dashboard/portfolio/${portfolio.id}`} className="block">
                        <Card className="bg-card border-border p-4 sm:p-6 hover:border-primary/50 transition cursor-pointer h-full">
                            <div className="space-y-4">

                                {/* Header */}
                                <div>
                                    <h4 className="font-semibold text-foreground text-base sm:text-lg">
                                        {portfolio.name}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                        className={`text-xs px-2 py-1 rounded ${
                            portfolio.source === 'created'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-blue-500/20 text-blue-400'
                        }`}
                    >
                      {portfolio.source === 'created' ? 'Created by You' : 'Transferred'}
                    </span>

                                        <span
                                            className={`text-xs px-2 py-1 rounded ${
                                                portfolio.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : portfolio.status === 'pending'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                            }`}
                                        >
                      {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
                    </span>
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-2">
                                        {portfolio.holdings} holdings
                                    </p>
                                </div>

                                {/* Value */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Value</p>
                                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                                        ${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <p
                                        className={`text-sm font-semibold ${
                                            portfolio.change > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}
                                    >
                                        {portfolio.change > 0 ? '▲' : '▼'} {Math.abs(portfolio.change).toFixed(2)}%
                                    </p>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-border text-foreground hover:bg-secondary bg-transparent text-xs sm:text-sm"
                                    >
                                        View →
                                    </Button>
                                </div>

                            </div>
                        </Card>
                    </Link>
                ))}

            </div>
        </div>
    )
}

export default User_Portfolio
