import {Portfolio} from "@/lib/transfer-data";


export type UserStatus = "pending_approval" | "approved" | "rejected" | "onboarding"


export interface User {
    id: string
    fullName: string
    email: string
    phone: string
    country: string
    dateOfBirth: string
    address: string
    occupation: string
    status: UserStatus
    kycCompleted: boolean
    agreementSigned: boolean
    signatureType: "name" | "upload"
    signatureUrl?: string
    portfolios: Portfolio[]
    createdAt: string
    accountBalance: number
    savedPaymentMethods: PaymentMethod[]
    transactions: Transaction[]
}

export interface PaymentMethod {
    id: string
    type: "bank_transfer" | "credit_card" | "debit_card" | "digital_wallet"
    name: string
    details: string // last 4 digits, account ending, etc.
    isDefault: boolean
}

export type TransactionType = "deposit" | "withdrawal" | "transfer_sent" | "transfer_received" | "buy" | "sell"

export interface Transaction {
    id: string
    type: TransactionType
    amount: number
    currency: string
    date: string
    description: string
    paymentMethod?: string
    status: "completed" | "pending" | "failed"
    relatedUser?: string // for transfers
}




export const mockUsers: User[] = [
    {
        id: "user-001",
        fullName: "Carlos Rivera",
        email: "carlos.rivera@email.com",
        phone: "+34 612 345 678",
        country: "Spain",
        dateOfBirth: "1985-06-15",
        address: "123 Gran Via, Madrid, Spain",
        occupation: "Software Engineer",
        status: "approved",
        kycCompleted: true,
        agreementSigned: true,
        signatureType: "name",
        accountBalance: 15250.75,
        savedPaymentMethods: [
            {
                id: "pm-001",
                type: "bank_transfer",
                name: "Banco Santander",
                details: "ES91 2100 0418 4502 0005 1332",
                isDefault: true,
            },
            {
                id: "pm-002",
                type: "credit_card",
                name: "Visa Card",
                details: "•••• 4242",
                isDefault: false,
            },
            {
                id: "pm-003",
                type: "digital_wallet",
                name: "PayPal",
                details: "carlos.rivera@email.com",
                isDefault: false,
            },
        ],
        portfolios: [
            {
                id: "port-001",
                name: "Growth Portfolio",
                uniqueIdentifier: "VP-2026-GRW-001",
                authorizationCode: "AUTH-XK9P2M",
                type: "new",
                status: "active",
                totalValue: 48520.3,
                totalGain: 3520.3,
                gainPercent: 7.82,
                createdAt: "2025-10-25",
                holdings: [
                    {
                        id: "h-001",
                        symbol: "AAPL",
                        name: "Apple Inc.",
                        shares: 25,
                        avgPrice: 178.5,
                        currentPrice: 192.3,
                        change: 2.45,
                        changePercent: 1.29,
                        value: 4807.5,
                        market: "NASDAQ",
                        purchaseDate: "2025-10-25",
                        projectedReturnPercent: 12.5,
                        investmentDuration: 4,
                        performanceHistory: [
                            {date: "2025-10-25", value: 4462.5, gain: 0},
                            {date: "2025-11-15", value: 4652.3, gain: 189.8},
                            {date: "2025-12-15", value: 4756.2, gain: 293.7},
                            {date: "2026-01-15", value: 4789.5, gain: 327.0},
                            {date: "2026-02-10", value: 4807.5, gain: 345.0},
                        ],
                        quantity: 0
                    },
                    {
                        id: "h-002",
                        symbol: "MSFT",
                        name: "Microsoft Corp.",
                        shares: 15,
                        avgPrice: 380.2,
                        currentPrice: 412.6,
                        change: -1.8,
                        changePercent: -0.43,
                        value: 6189.0,
                        market: "NASDAQ",
                        purchaseDate: "2025-10-25",
                        projectedReturnPercent: 15.8,
                        investmentDuration: 4,
                        performanceHistory: [
                            {date: "2025-10-25", value: 5703.0, gain: 0},
                            {date: "2025-11-15", value: 5845.2, gain: 142.2},
                            {date: "2025-12-15", value: 6012.4, gain: 309.4},
                            {date: "2026-01-15", value: 6145.7, gain: 442.7},
                            {date: "2026-02-10", value: 6189.0, gain: 486.0},
                        ],
                        quantity: 0
                    },
                    {
                        id: "h-003",
                        symbol: "GOOGL",
                        name: "Alphabet Inc.",
                        shares: 20,
                        avgPrice: 145.0,
                        currentPrice: 168.9,
                        change: 3.12,
                        changePercent: 1.88,
                        value: 3378.0,
                        market: "NASDAQ",
                        purchaseDate: "2025-11-15",
                        projectedReturnPercent: 18.2,
                        investmentDuration: 3,
                        performanceHistory: [
                            {date: "2025-11-15", value: 2900.0, gain: 0},
                            {date: "2025-12-15", value: 3045.8, gain: 145.8},
                            {date: "2026-01-15", value: 3189.4, gain: 289.4},
                            {date: "2026-02-10", value: 3378.0, gain: 478.0},
                        ],
                        quantity: 0
                    },
                ],
            },
            {
                id: "port-002",
                name: "Conservative Portfolio",
                uniqueIdentifier: "VP-2026-CON-002",
                authorizationCode: "AUTH-XK9P2M",
                type: "new",
                status: "active",
                totalValue: 32150.5,
                totalGain: 1050.5,
                gainPercent: 3.37,
                createdAt: "2025-12-01",
                holdings: [
                    {
                        id: "h-004",
                        symbol: "JNJ",
                        name: "Johnson & Johnson",
                        shares: 40,
                        avgPrice: 152.0,
                        currentPrice: 156.8,
                        change: 0.85,
                        changePercent: 0.54,
                        value: 6272.0,
                        market: "NYSE",
                        purchaseDate: "2025-12-01",
                        projectedReturnPercent: 8.5,
                        investmentDuration: 2,
                        performanceHistory: [
                            {date: "2025-12-01", value: 6080.0, gain: 0},
                            {date: "2025-12-15", value: 6135.2, gain: 55.2},
                            {date: "2026-01-15", value: 6198.4, gain: 118.4},
                            {date: "2026-02-10", value: 6272.0, gain: 192.0},
                        ],
                        quantity: 0
                    },
                    {
                        id: "h-005",
                        symbol: "WMT",
                        name: "Walmart Inc.",
                        shares: 55,
                        avgPrice: 168.5,
                        currentPrice: 172.3,
                        change: 0.92,
                        changePercent: 0.54,
                        value: 9476.5,
                        market: "NYSE",
                        purchaseDate: "2025-12-01",
                        projectedReturnPercent: 7.2,
                        investmentDuration: 2,
                        performanceHistory: [
                            {date: "2025-12-01", value: 9267.5, gain: 0},
                            {date: "2025-12-15", value: 9341.8, gain: 74.3},
                            {date: "2026-01-15", value: 9408.2, gain: 140.7},
                            {date: "2026-02-10", value: 9476.5, gain: 209.0},
                        ],
                        quantity: 0
                    },
                    {
                        id: "h-006",
                        symbol: "V",
                        name: "Visa Inc.",
                        shares: 12,
                        avgPrice: 283.0,
                        currentPrice: 287.5,
                        change: -0.45,
                        changePercent: -0.16,
                        value: 3450.0,
                        market: "NYSE",
                        purchaseDate: "2025-12-15",
                        projectedReturnPercent: 9.8,
                        investmentDuration: 2,
                        performanceHistory: [
                            {date: "2025-12-15", value: 3396.0, gain: 0},
                            {date: "2026-01-15", value: 3412.5, gain: 16.5},
                            {date: "2026-02-10", value: 3450.0, gain: 54.0},
                        ],
                        quantity: 0
                    },
                ],
            },
        ],
        transactions: [
            {
                id: "txn-001",
                type: "deposit",
                amount: 25000.0,
                currency: "EUR",
                date: "2025-10-15",
                description: "Initial deposit",
                paymentMethod: "Bank Transfer",
                status: "completed",
            },
            {
                id: "txn-002",
                type: "buy",
                amount: 4462.5,
                currency: "EUR",
                date: "2025-10-25",
                description: "Bought 25 shares of AAPL",
                status: "completed",
            },
            {
                id: "txn-003",
                type: "buy",
                amount: 5703.0,
                currency: "EUR",
                date: "2025-10-25",
                description: "Bought 15 shares of MSFT",
                status: "completed",
            },
            {
                id: "txn-004",
                type: "deposit",
                amount: 15000.0,
                currency: "EUR",
                date: "2025-11-10",
                description: "Additional deposit",
                paymentMethod: "Credit Card",
                status: "completed",
            },
            {
                id: "txn-005",
                type: "buy",
                amount: 2900.0,
                currency: "EUR",
                date: "2025-11-15",
                description: "Bought 20 shares of GOOGL",
                status: "completed",
            },
            {
                id: "txn-006",
                type: "deposit",
                amount: 12000.0,
                currency: "EUR",
                date: "2025-11-28",
                description: "Deposit via PayPal",
                paymentMethod: "Digital Wallet",
                status: "completed",
            },
            {
                id: "txn-007",
                type: "buy",
                amount: 6080.0,
                currency: "EUR",
                date: "2025-12-01",
                description: "Bought 40 shares of JNJ",
                status: "completed",
            },
            {
                id: "txn-008",
                type: "buy",
                amount: 9267.5,
                currency: "EUR",
                date: "2025-12-01",
                description: "Bought 55 shares of WMT",
                status: "completed",
            },
            {
                id: "txn-009",
                type: "buy",
                amount: 3396.0,
                currency: "EUR",
                date: "2025-12-15",
                description: "Bought 12 shares of V",
                status: "completed",
            },
            {
                id: "txn-010",
                type: "withdrawal",
                amount: 5000.0,
                currency: "EUR",
                date: "2026-01-20",
                description: "Withdrawal to bank account",
                paymentMethod: "Bank Transfer",
                status: "completed",
            },
            {
                id: "txn-011",
                type: "deposit",
                amount: 8000.0,
                currency: "EUR",
                date: "2026-02-05",
                description: "Deposit via bank transfer",
                paymentMethod: "Bank Transfer",
                status: "completed",
            },
        ],
        createdAt: "2025-10-22",
    },
    {
        id: "user-002",
        fullName: "Emily Watson",
        email: "emily.watson@email.com",
        phone: "+1 (555) 987-6543",
        country: "United States",
        dateOfBirth: "1990-03-22",
        address: "456 Wall Street, New York, NY",
        occupation: "Financial Analyst",
        status: "pending_approval",
        kycCompleted: true,
        agreementSigned: true,
        signatureType: "upload",
        accountBalance: 5000.0,
        savedPaymentMethods: [
            {
                id: "pm-004",
                type: "bank_transfer",
                name: "Chase Bank",
                details: "****1234",
                isDefault: true,
            },
        ],
        portfolios: [],
        transactions: [
            {
                id: "txn-012",
                type: "deposit",
                amount: 5000.0,
                currency: "USD",
                date: "2026-02-01",
                description: "Initial deposit",
                paymentMethod: "Bank Transfer",
                status: "completed",
            },
        ],
        createdAt: "2026-02-01",
    },
]
