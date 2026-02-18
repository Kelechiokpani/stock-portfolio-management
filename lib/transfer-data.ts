// Types
type PortfolioStatus = "active" | "pending" | "processing" | "transferred"


export interface Portfolio {
    id: string
    name: string
    uniqueIdentifier: string
    authorizationCode: string
    type: "new" | "inherited"
    status: PortfolioStatus
    totalValue: number
    totalGain: number
    gainPercent: number
    holdings: Holding[]
    createdAt: string
    transferProgress?: number
}

interface PortfolioTransfer {
    id: string
    portfolioId: string
    fromUserId: string
    toUserId: string
    status: "pending" | "approved" | "rejected"
    transferDate: string
}

export interface Holding {
    id: string
    symbol: string
    name: string
    shares: number
    avgPrice: number
    currentPrice: number
    change: number
    changePercent: number
    value: number
    market: string
    purchaseDate: string
    quantity: number
    projectedReturnPercent: number
    investmentDuration: number // in months
    performanceHistory: PerformanceData[]
}

export interface PerformanceData {
    date: string
    value: number
    gain: number
}

// Mock portfolios
const mockPortfolios: Portfolio[] = [
    {
        id: "port-001",
        name: "Growth Portfolio",
        uniqueIdentifier: "GP-7821",
        authorizationCode: "AUTH-1122",
        type: "new",
        status: "active",
        totalValue: 18500,
        totalGain: 2400,
        gainPercent: 14.9,
        holdings: [
            {
                id: "h1", symbol: "AAPL", quantity: 10, value: 5000,
                name: "",
                shares: 0,
                avgPrice: 0,
                currentPrice: 0,
                change: 0,
                changePercent: 0,
                market: "",
                purchaseDate: "",
                projectedReturnPercent: 0,
                investmentDuration: 0,
                performanceHistory: []
            },
            {
                id: "h2", symbol: "TSLA", quantity: 5, value: 8000,
                name: "",
                shares: 0,
                avgPrice: 0,
                currentPrice: 0,
                change: 0,
                changePercent: 0,
                market: "",
                purchaseDate: "",
                projectedReturnPercent: 0,
                investmentDuration: 0,
                performanceHistory: []
            },
        ],
        createdAt: "2026-01-01",
    },
]

export const mockPortfolioTransfers: PortfolioTransfer[] = [
    {
        id: "trf-001",
        portfolioId: "port-001",
        fromUserId: "user-001",
        toUserId: "user-002",
        status: "pending",
        transferDate: "2026-02-10",
    },
]
