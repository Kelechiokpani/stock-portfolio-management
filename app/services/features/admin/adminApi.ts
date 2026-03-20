import { apiSlice } from "../../api"; // Point to your central apiSlice file
import { Message } from "../market/marketApi";

interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Overview
    getAdminOverview: builder.query<any, void>({
      query: () => "/admin/overview",
      providesTags: ["Overview"],
    }),

    // 2. User Management
    getAllUsers: builder.query<any, PaginationParams>({
      query: ({ page, limit, total }) => ({
        url: "/admin/users",
        params: { page, limit, total },
      }),
      providesTags: ["Users"],
    }),

    updateUserStatus: builder.mutation<
      any,
      { id: string; status: "active" | "suspended" | "pending" | "rejected" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { accountStatus: status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
        "KYC",
      ],
    }),

    // 3. Market Data Control
    getMarketAssets: builder.query<any, void>({
      query: () => "/admin/market/stocks",
      providesTags: (result) =>
        result?.stocks
          ? [
              ...result.stocks.map(({ _id }: any) => ({
                type: "Market" as const,
                id: _id,
              })),
              { type: "Market", id: "LIST" },
            ]
          : [{ type: "Market", id: "LIST" }],
    }),

    updateMarketAsset: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/market/stocks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Market", id },
        "Market",
      ],
    }),

    deleteMarketAsset: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/market/stocks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Market"],
    }),

    // 4. KYC Management
    getKycList: builder.query<any, void>({
      query: () => "/admin/kyc",
      transformResponse: (response: any) => response?.users || [],
      providesTags: ["KYC"],
    }),

    updateKycStatus: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...body }) => ({
        url: `/admin/kyc/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["KYC"],
    }),

    // 5. Global Settings
    getGlobalSettings: builder.query<any, void>({
      query: () => "/admin/settings",
      providesTags: ["Settings"],
    }),

    updateGlobalSettings: builder.mutation<any, any>({
      query: (settings) => ({
        url: "/admin/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),

    // 6. Requests
    getAccountRequests: builder.query<any, PaginationParams>({
      query: ({ page, limit, total }) => ({
        url: "/admin/requests",
        params: { page, limit, total },
      }),
      providesTags: ["Requests"],
    }),

    reviewRequest: builder.mutation<
      any,
      { id: string; action: "approve" | "reject" }
    >({
      query: ({ id, action }) => ({
        url: `/admin/requests/${id}`,
        method: "PUT",
        body: { action },
      }),
      invalidatesTags: ["Requests"],
    }),

    // 7. Chat
    // adminApi.ts
    // getChatByUserId: builder.query<Message[], string>({
    //   // query: (userId) => `/admin/users/${userId}/details`,
    //   query: (id) => (id ? `/admin/users/${id}/chat` : "/chat"),
    //   transformResponse: (response: any) => {
    //     const messages =
    //       response.chat || response.user?.chat || response.messages || [];
    //     return Array.isArray(messages) ? messages : [];
    //   },
    //   providesTags: (result, error, userId) => [
    //     { type: "Messages", id: userId },
    //   ],
    // }),

    // 8. Status Updates (Transfers, Transactions, Trades)
    updatePortfolioTransferStatus: builder.mutation<
      any,
      { id: string; status: "completed" | "rejected" | "cancelled" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/transfers/portfolio/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users", "Transfers"],
    }),

    updateTransactionStatus: builder.mutation<
      any,
      { id: string; status: "completed" | "rejected" | "failed" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/transactions/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users", "Transactions"],
    }),

    updateTradeStatus: builder.mutation<
      any,
      { id: string; status: "completed" | "rejected" | "cancelled" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/trades/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users", "Trades"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
  useGetKycListQuery,
  useUpdateKycStatusMutation,
  useGetMarketAssetsQuery,
  useUpdateMarketAssetMutation,
  useDeleteMarketAssetMutation,
  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
  useGetAccountRequestsQuery,
  useReviewRequestMutation,
  useUpdateUserStatusMutation,
  // useGetChatByUserIdQuery,
  useUpdatePortfolioTransferStatusMutation,
  useUpdateTransactionStatusMutation,
  useUpdateTradeStatusMutation,
} = adminApi;
