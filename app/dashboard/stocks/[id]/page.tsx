"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockStocks } from "@/components/market/mock-data"
import StockDetailChart from "@/components/market/Chart/StockDetailChart";
import {ArrowLeft} from "lucide-react";




type DataPoint = {
    time: string;
    value: number;
};

export default function StockDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [chartType, setChartType] = useState("area")
    const stock = mockStocks.find(s => s.symbol === params.id);
    // const stock = mockStocks.find(s => s.symbol === params.symbol)

    if (!stock) return <div>Stock not found</div>

    return (
        <div className="space-y-6">

            <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{stock.name}</h1>
                <p className="text-muted-foreground">{stock.symbol} • {stock.sector}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold">
                €{stock.price.toFixed(2)}
            </div>

            {/* Chart */}
            <Card>

                <CardContent className="h-full pt-6">
                {/*<CardContent className="h-[550px] pt-6">*/}
                    <StockDetailChart stock={stock} />
                </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
                <CardContent className="space-y-3 pt-6">
                    <h2 className="text-xl font-semibold">About Company</h2>

                    <p className="text-muted-foreground">
                        {stock.name} operates in the {stock.sector} sector and provides
                        products and services globally. The company focuses on innovation,
                        operational efficiency, and long-term shareholder value.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Founded</p>
                            <p className="font-semibold">1975</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">CEO</p>
                            <p className="font-semibold">John Doe</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Past CEO</p>
                            <p className="font-semibold">Jane Smith</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Sector</p>
                            <p className="font-semibold">{stock.sector}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Market</p>
                            <p className="font-semibold">{stock.market}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Market Cap</p>
                            <p className="font-semibold">{stock.marketCap}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Report */}
            <Card>
                <CardContent className="space-y-3 pt-6">
                    <h2 className="text-xl font-semibold">Performance & Financials</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-semibold">€12.4B</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Net Profit</p>
                            <p className="font-semibold">€2.1B</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">EPS</p>
                            <p className="font-semibold">3.42</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Dividend Yield</p>
                            <p className="font-semibold">1.8%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
