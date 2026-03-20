import { configureStore } from "@reduxjs/toolkit";
// 1. Import the SINGLE consolidated apiSlice
import { apiSlice } from "@/app/services/api";
import authReducer from "@/app/services/features/auth/authSlice";
import marketReducer from "@/app/services/features/market/marketSlice";
import adminReducer from "@/app/services/features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    // Single API Cache (Server Data)
    [apiSlice.reducerPath]: apiSlice.reducer,

    // UI & Local State Slices
    auth: authReducer,
    marketUI: marketReducer,
    admin: adminReducer,
  },
  // 2. Add only the ONE apiSlice middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  // 3. Recommended for devTools clarity
  devTools: process.env.NODE_ENV !== "production",
});

// --- Types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 4. Custom hooks for better DX (Optional but highly recommended)
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
