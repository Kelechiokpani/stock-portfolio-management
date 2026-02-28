import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioUIState {
    selectedPortfolioId: string | null;
    isAddInvestmentModalOpen: boolean;
}

const initialState: PortfolioUIState = {
    selectedPortfolioId: null,
    isAddInvestmentModalOpen: false,
};

const portfolioSlice = createSlice({
    name: 'portfolioUI',
    initialState,
    reducers: {
        selectPortfolio: (state, action: PayloadAction<string>) => {
            state.selectedPortfolioId = action.payload;
        },
        toggleInvestmentModal: (state) => {
            state.isAddInvestmentModalOpen = !state.isAddInvestmentModalOpen;
        },
    },
});

export const { selectPortfolio, toggleInvestmentModal } = portfolioSlice.actions;
export default portfolioSlice.reducer;