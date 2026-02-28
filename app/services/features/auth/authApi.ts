import { User } from '@/components/data/data-type';
import { baseApi } from '../../api';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials })
        }),
        getMe: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['User']
        }),
        submitOnboarding: builder.mutation({
            query: ({ step, data }) => ({ url: `/onboarding/step${step}`, method: 'POST', body: data }),
            invalidatesTags: ['User'],
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation, useGetMeQuery, useSubmitOnboardingMutation } = authApi;