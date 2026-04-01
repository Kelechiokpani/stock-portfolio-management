import { Asset } from "@/components/data/data-type";
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
export interface ResettlementAccount {
  _id?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankAddress?: string;
  routingNumber?: string;
  iban?: string;
  swiftBic?: string;
  currency?: string;
  createdAt?: string;
}

export interface WithdrawalPayload {
  accountNumber: string;
  routingNumber: string;
  amount: number;
  narration: string;
  // If your backend TRULY requires 'method', add it back as an optional:
  method?: string;
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
  _id: string;
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

    // --- Added Onboarding Bank List ---
    getBanks: builder.query<any[], void>({
      query: () => "/onboarding/bank/list",
      providesTags: ["Resettlement"],
      transformResponse: (response: any) => {
        return (
          response?.data ||
          response?.banks ||
          (Array.isArray(response) ? response : [])
        );
      },
    }),

    // --- Resettlement Endpoints ---
    getResettlementAccounts: builder.query<ResettlementAccount[], void>({
      query: () => "/funds/resettlement",
      providesTags: ["Resettlement"],
      transformResponse: (response: any) => response?.data || response || [],
    }),

    addResettlementAccount: builder.mutation<any, ResettlementAccount>({
      query: (body) => ({
        url: "/funds/resettlement",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Resettlement"],
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

    getChatHistory: builder.query<any[], string | void>({
      query: (id) => (id ? `/support/admin/chat/${id}` : "/support/chat"),

      transformResponse: (response: any) => {
        // Look for 'data' first, then fall back to other structures
        const messages =
          response?.data || // This matches your XHR log
          response?.chat ||
          response?.user?.chat ||
          response?.messages ||
          (Array.isArray(response) ? response : []);

        return Array.isArray(messages) ? messages : [];
      },

      providesTags: (result, error, id) =>
        id
          ? [{ type: "Messages", id }]
          : [{ type: "Messages", id: "SUPPORT_CHAT" }],
    }),

    sendMessage: builder.mutation<any, { text: string; id?: string }>({
      query: ({ text, id }) => ({
        url: id ? `/admin/users/${id}/chat` : "/support/chat/send",
        method: "POST",
        body: { text },
      }),
      // This tells RTK Query to refetch getChatHistory immediately
      invalidatesTags: (result, error, { id }) =>
        id
          ? [{ type: "Messages", id }]
          : [{ type: "Messages", id: "SUPPORT_CHAT" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetApprovedStocksQuery,
  useDepositFundsMutation,

  useGetBanksQuery,
  useGetResettlementAccountsQuery,
  useAddResettlementAccountMutation,

  useWithdrawFundsMutation,
  useBuyStockMutation,
  useSellStockMutation,
  useTransferStockMutation,
  useGetChatHistoryQuery,
  useSendMessageMutation,
} = marketApi;
