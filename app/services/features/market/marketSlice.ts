import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetClass } from '@/components/data/data-type';

interface MarketState {
    searchQuery: string;
    activeCategory: AssetClass | 'all';
    sortBy: 'price' | 'change' | 'name';
}

const initialState: MarketState = {
    searchQuery: '',
    activeCategory: 'all',
    sortBy: 'name',
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setCategory: (state, action: PayloadAction<AssetClass | 'all'>) => {
            state.activeCategory = action.payload;
        },
        setSortBy: (state, action: PayloadAction<MarketState['sortBy']>) => {
            state.sortBy = action.payload;
        },
    },
});

export const { setSearchQuery, setCategory, setSortBy } = marketSlice.actions;
export default marketSlice.reducer;