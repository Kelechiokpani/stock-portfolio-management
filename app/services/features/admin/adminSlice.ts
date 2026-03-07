import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  isMaintenanceMode: boolean;
  selectedRequestId: string | null;
  activeMarketCategory: string;
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
    setMarketCategory: (state, action: PayloadAction<string>) => {
      state.activeMarketCategory = action.payload;
    },
  },
});

export const { setMaintenanceMode, setSelectedRequest, setMarketCategory } = adminSlice.actions;
export default adminSlice.reducer;