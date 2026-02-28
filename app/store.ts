import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/app/services/api';
import authReducer from '@/app/services/features/auth/authSlice';
import marketReducer from '@/app/services/features/market/marketSlice';
import onboardingReducer from '@/app/services/features/onboarding/onboardingSlice';
import portfolioReducer from '@/app/services/features/portfolio/portfolioSlice';


export const store = configureStore({
    reducer: {
        // API Cache (Server Data)
        [baseApi.reducerPath]: baseApi.reducer,

        // UI Slices (Local Data)
        auth: authReducer,
        marketUI: marketReducer,
        onboardingUI: onboardingReducer,
        portfolioUI: portfolioReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});