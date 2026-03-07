import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../../store";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stockinvest-api.vercel.app/api/admin",
    prepareHeaders: (headers) => {
      // 1. Get token directly from localStorage to avoid 'getState' circular loops
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        // Use the exact format your backend expects (Bearer)
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["KYC", "Market", "Settings", "Requests"],

  endpoints: (builder) => ({
    // --- MARKET DATA CONTROL ---
    getMarketAssets: builder.query<any, void>({
      query: () => "/market/stocks",
      providesTags: ["Market"],
    }),

    createMarketAsset: builder.mutation<any, any>({
      query: (newAsset) => ({
        url: "/market/stocks",
        method: "POST",
        body: newAsset,
      }),
      invalidatesTags: ["Market"],
    }),

    updateMarketAsset: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/market/stocks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Market"],
    }),

    // --- KYC MANAGEMENT ---
    getKycList: builder.query<any, void>({
      query: () => "/kyc",
      transformResponse: (response: any) => response?.users || [],
      providesTags: ["KYC"],
    }),

    updateKycStatus: builder.mutation< any, { id: string; status: string; field?: string }>({
      query: ({ id, ...body }) => ({
        url: `/kyc/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["KYC"],
    }),

    // --- GLOBAL SETTINGS ---
    getGlobalSettings: builder.query<any, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    updateGlobalSettings: builder.mutation<any, any>({
      query: (settings) => ({
        url: "/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),

    // --- ACCOUNT REQUESTS ---
    getAccountRequests: builder.query<any, void>({
      query: () => "/requests",
      providesTags: ["Requests"],
    }),

    reviewRequest: builder.mutation< any,  { id: string; action: "approve" | "reject" }>({
      query: ({ id, action }) => ({
        url: `/requests/${id}`,
        method: "PUT",
        body: { action },
      }),
      invalidatesTags: ["Requests"],
    }),
  }),
});

export const {
  useGetKycListQuery,
  useUpdateKycStatusMutation,

  useGetMarketAssetsQuery,
  useCreateMarketAssetMutation,
  useUpdateMarketAssetMutation,

  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,

  useGetAccountRequestsQuery,
  useReviewRequestMutation,
} = adminApi;

function getState(): any {
  throw new Error("Function not implemented.");
}
