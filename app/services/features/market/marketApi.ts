import { Asset } from '@/components/data/data-type';
import {baseApi} from "@/app/services/api";


export const marketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMarketOverview: builder.query<Asset[], string | void>({
            query: (type) => type ? `/market/${type}` : '/market/screener',
            providesTags: ['Market'],
        }),
        searchAssets: builder.query<Asset[], string>({
            query: (q) => `/market/search?q=${q}`,
        }),
    }),
});

export const { useGetMarketOverviewQuery, useSearchAssetsQuery } = marketApi;