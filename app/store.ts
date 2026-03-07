import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/app/services/api";
import authReducer from "@/app/services/features/auth/authSlice";
import marketReducer from "@/app/services/features/market/marketSlice";
import portfolioReducer from "@/app/services/features/portfolio/portfolioSlice";
import { adminApi } from "@/app/services/features/admin/adminApi";
import adminReducer from "@/app/services/features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    // API Cache (Server Data)
    [baseApi.reducerPath]: baseApi.reducer,

    // Admin API (Server Data)
    [adminApi.reducerPath]: adminApi.reducer,

    // UI Slices (Local Data)
    auth: authReducer,
    marketUI: marketReducer,
    portfolioUI: portfolioReducer,

    // Admin Slices
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
