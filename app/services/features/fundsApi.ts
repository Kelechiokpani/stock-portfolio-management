import { CashMovement, StockTransfer } from '@/components/data/data-type';
import {baseApi} from "@/app/services/api";


export const fundsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFunds: builder.query<{ balance: number; movements: CashMovement[] }, void>({
            query: () => '/api/funds',
            providesTags: ['Funds'],
        }),
        initiateTransfer: builder.mutation<void, Partial<StockTransfer>>({
            query: (transfer) => ({ url: '/api/transfers', method: 'POST', body: transfer }),
            invalidatesTags: ['Portfolio', 'Funds'],
        }),
    }),
});

export const { useGetFundsQuery, useInitiateTransferMutation } = fundsApi;