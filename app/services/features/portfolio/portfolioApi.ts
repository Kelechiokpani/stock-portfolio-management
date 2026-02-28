import { User, Investment } from '@/components/data/data-type';
import {baseApi} from "@/app/services/api";

export const portfolioApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPortfolios: builder.query<User['portfolios'], void>({
            query: () => '/portfolios',
            providesTags: ['Portfolio'],
        }),
        addInvestment: builder.mutation<void, { portfolioId: string; data: Partial<Investment> }>({
            query: ({ portfolioId, data }) => ({
                url: `/portfolios/${portfolioId}/holdings`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Portfolio'],
        }),
    }),
});

export const { useGetPortfoliosQuery, useAddInvestmentMutation } = portfolioApi;