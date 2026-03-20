import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Import your RootState to type the selectors

// Use a union type for better developer experience (IDE Autocomplete)
type MarketCategory = "stocks" | "crypto" | "forex" | string;

interface AdminState {
  isMaintenanceMode: boolean;
  selectedRequestId: string | null;
  activeMarketCategory: MarketCategory;
}

const initialState: AdminState = {
  isMaintenanceMode: false,
  selectedRequestId: null,
  activeMarketCategory: "stocks",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setMaintenanceMode: (state, action: PayloadAction<boolean>) => {
      state.isMaintenanceMode = action.payload;
    },
    setSelectedRequest: (state, action: PayloadAction<string | null>) => {
      state.selectedRequestId = action.payload;
    },
    setMarketCategory: (state, action: PayloadAction<MarketCategory>) => {
      state.activeMarketCategory = action.payload;
    },
    // Optional: Add a reset action for when the admin logs out
    resetAdminState: () => initialState,
  },
});

// --- Actions ---
export const {
  setMaintenanceMode,
  setSelectedRequest,
  setMarketCategory,
  resetAdminState,
} = adminSlice.actions;

// --- Selectors ---
// These make it easy to use in components: const mode = useAppSelector(selectMaintenanceMode)
export const selectMaintenanceMode = (state: RootState) =>
  state.admin.isMaintenanceMode;
export const selectSelectedRequestId = (state: RootState) =>
  state.admin.selectedRequestId;
export const selectMarketCategory = (state: RootState) =>
  state.admin.activeMarketCategory;

export default adminSlice.reducer;
