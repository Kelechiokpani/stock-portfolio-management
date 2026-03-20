import { Asset } from "@/components/data/data-type";
// 1. Point to the consolidated apiSlice
import { apiSlice } from "../../api";

// --- Existing Interfaces ---
export interface MarketSummary {
  total: number;
  gainers: number;
  losers: number;
  sectors: string[];
  markets: string[];
}

export interface MarketResponse {
  stocks: Asset[];
  summary: MarketSummary;
}

// --- Updated Transaction Interfaces ---
export interface FundPayload {
  userId: string;
  fullName: string;
  amount: number;
  method: string;
  description?: string;
}

export interface WithdrawalPayload extends FundPayload {
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  method: "moniepoint" | "gtbank" | string;
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

export interface TransferAssetItem {
  assetSymbol: string;
  shares: number;
  assetName?: string;
  valueAtTransfer?: number;
}

export interface TransferPayload {
  portfolioId: string;
  toUserEmail: string;
  assets: TransferAssetItem[];
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  description: string;
}

export interface Message {
  _id: string; // Changed to match MongoDB standard usually found in these APIs
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  conversationId: string;
}

export interface SendMessagePayload {
  text: string;
  id?: string; // Admin uses this to reply to a specific user
}

export interface ChatActionResponse {
  success: boolean;
  message: string;
  data?: Message;
}

// 2. Use apiSlice.injectEndpoints
export const marketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApprovedStocks: builder.query<MarketResponse, void>({
      query: () => "/market/approved",
      providesTags: ["Market"],
    }),

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

    transferStock: builder.mutation<any, TransferPayload>({
      query: (body) => ({
        url: "/transfers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Portfolio", "Transactions"],
    }),

    depositFunds: builder.mutation<any, FundPayload>({
      query: (body) => ({
        url: "/funds/deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserBalance", "Transactions"],
    }),

    withdrawFunds: builder.mutation<any, WithdrawalPayload>({
      query: (body) => ({
        url: "/funds/withdrawal",
        method: "POST",
        body,
      }),
      // Including "User" tag as withdrawal logic often triggers status changes
      invalidatesTags: ["UserBalance", "Transactions", "User"],
    }),

    getChatHistory: builder.query<Message[], string | void>({
      // query: (id) => `/admin/users/${id}/details`,
      query: (id) => (id ? `/admin/users/${id}/details` : "/chat"),

      transformResponse: (response: any) => {
        // Navigate the response object safely
        const messages =
          response.chat ||
          response.user?.chat ||
          response.messages ||
          (Array.isArray(response) ? response : []);

        return Array.isArray(messages) ? messages : [];
      },

      // 2. Fix providesTags to correctly map the ID
      providesTags: (result, error, id) =>
        id ? [{ type: "Messages", id }] : ["Messages"],
    }),

    sendMessage: builder.mutation<ChatActionResponse, SendMessagePayload>({
      query: ({ text, id }) => ({
        url: id ? `/admin/users/${id}/chat` : "/chat",
        method: "POST",
        body: { text },
      }),
      // Dynamic invalidation for real-time feel
      invalidatesTags: (result, error, { id }) =>
        id ? [{ type: "Messages", id }] : ["Messages"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetApprovedStocksQuery,
  useDepositFundsMutation,
  useWithdrawFundsMutation,
  useBuyStockMutation,
  useSellStockMutation,
  useTransferStockMutation,
  useGetChatHistoryQuery,
  useSendMessageMutation,
} = marketApi;
