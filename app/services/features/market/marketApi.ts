import { baseApi } from "@/app/services/api";
import { Asset } from "@/components/data/data-type";

// --- Existing Interfaces ---
export interface MarketSummary {
  total: number;
  gainers: number;
  losers: number;
  sectors: string[];
  markets: string[];
}

export interface MarketResponse {
  stocks: Asset[]; // Changed from assets to stocks to match your frontend usage
  summary: MarketSummary;
}

// --- New Transaction Interfaces ---
export interface FundPayload {
  amount: number;
  method: string;
  currency?: string;
  description?: string;
}

export interface BuyPayload {
  symbol: string;
  shares: number;
  price: number;
  companyName?: string;
  portfolioId?: string;
}

export interface SellPayload {
  symbol?: string;
  holdingId?: string;
  shares: number;
  price: number;
}

export interface TransferPayload {
  assetSymbol: string;
  shares: number;
  toUserEmail: string;
  assetName?: string;
  valueAtTransfer?: number;
}

export const marketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing Query
    getApprovedStocks: builder.query<MarketResponse, void>({
      query: () => "/market/approved",
      providesTags: ["Market"],
    }),

    // 1. Funds Management
    depositFunds: builder.mutation<any, FundPayload>({
      query: (body) => ({
        url: "/funds/deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserBalance", "Transactions"],
    }),

    withdrawFunds: builder.mutation<any, FundPayload>({
      query: (body) => ({
        url: "/funds/withdrawal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserBalance", "Transactions"],
    }),

    // 2. Investment Operations
    buyStock: builder.mutation<any, BuyPayload>({
      query: (body) => ({
        url: "/investments/buy",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Portfolio", "UserBalance", "Transactions"],
    }),

    sellStock: builder.mutation<any, SellPayload>({
      query: (body) => ({
        url: "/investments/sell",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Portfolio", "UserBalance", "Transactions"],
    }),

    // 3. Peer-to-Peer Transfers
    transferStock: builder.mutation<any, TransferPayload>({
      query: (body) => ({
        url: "/transfers/stock",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Portfolio", "Transactions"],
    }),
  }),
});

export const {
  useGetApprovedStocksQuery,
  useDepositFundsMutation,
  useWithdrawFundsMutation,
  useBuyStockMutation,
  useSellStockMutation,
  useTransferStockMutation,
} = marketApi;

// import { baseApi } from "@/app/services/api";
// import { Asset } from '@/components/data/data-type';

// export interface MarketSummary {
//     total: number;
//     gainers: number;
//     losers: number;
//     sectors: string[];
//     markets: string[];
// }

// export interface MarketResponse {
//     assets: Asset[];
//     summary: MarketSummary;
// }

// export const marketApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         getApprovedStocks: builder.query<MarketResponse, void>({
//             query: () => '/market/approved',
//             providesTags: ['Market'],
//         }),
//     }),
// });

// export const { useGetApprovedStocksQuery } = marketApi;
