import { User } from "@/components/data/data-type";
// Import the consolidated apiSlice instead of baseApi
import { apiSlice } from "../../api";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    onboarding: builder.mutation({
      query: (formData) => ({
        url: `/onboarding/kyc`,
        method: "POST",
        body: formData,
        // When sending FormData, letting the browser set the header
        // automatically includes the 'boundary' string.
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data: { token: string; newPassword: any }) => ({
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
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useOnboardingMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
