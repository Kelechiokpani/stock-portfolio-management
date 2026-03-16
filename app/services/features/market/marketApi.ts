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

/** * NEW: Updated for /api/funds/withdrawal
 * Includes bankDetails and specific method as per update.
 */
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

/** * NEW: Enhanced Transfers for POST /api/transfers
 * Includes tracking: firstName, lastName, address, phone, and description.
 */

export interface TransferAssetItem {
  assetSymbol: string;
  shares: number;
  assetName?: string;
  valueAtTransfer?: number;
}

export interface TransferPayload {
  portfolioId: string;
  toUserEmail: string;
  assets: TransferAssetItem[]; // Changed from single fields to an array
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  description: string;
}

export interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  conversationId: string;
}

export interface SendMessagePayload {
  text: string;
  id?: string;
}

export interface ChatActionResponse {
  success: boolean;
  message: string;
  data?: Message;
}

export const marketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing Query
    getApprovedStocks: builder.query<MarketResponse, void>({
      query: () => "/market/approved",
      providesTags: ["Market"],
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
        url: "/transfers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Portfolio", "Transactions"],
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

    withdrawFunds: builder.mutation<any, WithdrawalPayload>({
      query: (body) => ({
        url: "/funds/withdrawal",
        method: "POST",
        body,
      }),
      // Invalidating "User" is key here because the 3-strike logic
      // updates the user's "requiresResettlementAccount" flag.
      invalidatesTags: ["UserBalance", "Transactions", "User"],
    }),

    // 1. User: Get their own chat history
    getChatHistory: builder.query<Message[], void>({
      query: () => "/chat",
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        return response?.messages || response?.chat || [];
      },
      providesTags: ["Messages"],
    }),

    // 3. Send Message (Universal)
    sendMessage: builder.mutation<ChatActionResponse, SendMessagePayload>({
      query: ({ text, id }) => {
        const url = id ? `/admin/users/${id}/chat` : "/chat";
        return {
          url,
          method: "POST",
          body: { text },
        };
      },
      // This is the "Magic" that refreshes the Admin Panel
      invalidatesTags: (result, error, { id }) =>
        id
          ? [{ type: "Messages" as const, id: id }] // Refreshes Admin View
          : ["Messages"], // Refreshes User View
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

  useGetChatHistoryQuery,
  useSendMessageMutation,
} = marketApi;
