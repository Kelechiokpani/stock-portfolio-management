import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
    currentStep: number;
    formData: any;
}

const onboardingSlice = createSlice({
    name: 'onboardingUI',
    initialState: { currentStep: 7, formData: {} },
    reducers: {
        nextStep: (state) => { state.currentStep += 1; },
        prevStep: (state) => { state.currentStep -= 1; },
        updateDraftData: (state, action: PayloadAction<any>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
    },
});

export const { nextStep, prevStep, updateDraftData } = onboardingSlice.actions;
export default onboardingSlice.reducer;