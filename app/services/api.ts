import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://stockinvest-api.vercel.app/',
        prepareHeaders: (headers, { getState }: any) => {
            const token = getState().auth.token;
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['User', 'Portfolio', 'Market', 'Admin', 'Funds'],
    endpoints: () => ({}), // Empty: we will inject here
});


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Asset, User, Investment, CashMovement, StockTransfer } from '@/components/data/data-type';
//
// export const baseApi = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'https://stockinvest-api.vercel.app/',
//         prepareHeaders: (headers, { getState }: any) => {
//             const token = getState().auth.token;
//             if (token) headers.set('authorization', `Bearer ${token}`);
//             return headers;
//         },
//     }),
//     tagTypes: ['User', 'Portfolio', 'Market', 'Admin', 'Funds'],
//     endpoints: (builder) => ({
//         // --- AUTH & ONBOARDING ---
//         login: builder.mutation({ query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }) }),
//         getMe: builder.query<User, void>({ query: () => '/auth/me', providesTags: ['User'] }),
//         submitOnboarding: builder.mutation({
//             query: ({ step, data }) => ({ url: `/onboarding/step${step}`, method: 'POST', body: data }),
//             invalidatesTags: ['User'],
//         }),
//
//         // --- MARKET SCREENER (Typed with your Asset interface) ---
//         getMarketOverview: builder.query<Asset[], string | void>({
//             query: (type) => type ? `/market/${type}` : '/market/screener',
//             providesTags: ['Market'],
//         }),
//         searchAssets: builder.query<Asset[], string>({
//             query: (q) => `/market/search?q=${q}`,
//         }),
//
//         // --- PORTFOLIO & INVESTMENTS ---
//         getPortfolios: builder.query<User['portfolios'], void>({
//             query: () => '/portfolios',
//             providesTags: ['Portfolio'],
//         }),
//         addInvestment: builder.mutation<void, { portfolioId: string; data: Partial<Investment> }>({
//             query: ({ portfolioId, data }) => ({
//                 url: `/portfolios/${portfolioId}/holdings`,
//                 method: 'POST',
//                 body: data,
//             }),
//             invalidatesTags: ['Portfolio'],
//         }),
//
//         // --- FUNDS & TRANSFERS ---
//         getFunds: builder.query<{ balance: number; movements: CashMovement[] }, void>({
//             query: () => '/api/funds',
//             providesTags: ['Funds'],
//         }),
//         initiateTransfer: builder.mutation<void, Partial<StockTransfer>>({
//             query: (transfer) => ({ url: '/api/transfers', method: 'POST', body: transfer }),
//             invalidatesTags: ['Portfolio', 'Funds'],
//         }),
//
//         // --- MOCK DATA (For Demo Purposes) ---
//         getUser: builder.query<User, string>({
//             query: (id) => `/mock/user/${id}`,
//         }),
//     }),
// });
//
// export const {
//     useLoginMutation,
//     useGetMeQuery,
//     useGetMarketOverviewQuery,
//     useGetPortfoliosQuery,
//     useAddInvestmentMutation,
//     useInitiateTransferMutation,
//     useGetUserQuery
// } = baseApi;