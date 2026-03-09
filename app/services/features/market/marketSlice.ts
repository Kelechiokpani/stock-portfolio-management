import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarketSummary } from "./marketApi";

interface MarketState {
  searchQuery: string;
  sortBy: "price" | "change" | "name";
  summary: MarketSummary | null;
}

const initialState: MarketState = {
  searchQuery: "",
  sortBy: "name",
  summary: null,
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<MarketState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    updateMarketSummary: (state, action: PayloadAction<MarketSummary>) => {
      state.summary = action.payload;
    },
  },
});

export const { setSearchQuery, setSortBy, updateMarketSummary } =
  marketSlice.actions;
export default marketSlice.reducer;
