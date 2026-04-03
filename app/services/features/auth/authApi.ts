import { User } from "@/components/data/data-type";
// Import the consolidated apiSlice instead of baseApi
import { apiSlice } from "../../api";

// --- New Onboarding & Auth Interfaces ---
export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface BankResponse {
  banks: Bank[];
}

export interface OnboardingBankPayload {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface OtpSendPayload {
  email: string;
}

export interface OtpVerifyPayload {
  email: any;
  otp: any;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    onboarding: builder.mutation({
      query: (formData) => ({
        url: `/onboarding/kyc`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // --- New Auth & Onboarding Endpoints ---
    sendOtp: builder.mutation<{ message: string }, OtpSendPayload>({
      query: (body) => ({
        url: "/auth/otp/send",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<
      { verified: boolean; token?: string },
      OtpVerifyPayload
    >({
      query: (body) => ({
        url: "/auth/otp/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getBankList: builder.query<BankResponse[], void>({
      query: () => "/onboarding/bank/list",
    }),

    submitOnboardingBank: builder.mutation<any, OnboardingBankPayload>({
      query: (body) => ({
        url: "/onboarding/bank",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data: { token: any; newPassword: any }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      any,
      { currentPassword: string; newPassword: string }
    >({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: passwords,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // This will clear the 'User' tag in the cache
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

// Added useLogoutMutation to the exports
export const {
  // New hooks
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetBankListQuery,
  useSubmitOnboardingBankMutation,

  // Existing hooks
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useOnboardingMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
