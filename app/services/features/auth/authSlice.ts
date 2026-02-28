import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/components/data/data-type';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    onboardingStep: number; // Tracks Step 7-15 progress locally
}

// Check localStorage so user stays logged in on page refresh
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    onboardingStep: 1,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Triggered after useLoginMutation or useGetMeQuery
         */
        setCredentials: (
            state,
            { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
        },

        /**
         * Update user profile data without re-logging in
         */
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },

        /**
         * Clears everything on Logout
         */
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },

        /**
         * Specific reducer to track the 15-step journey
         */
        setStep: (state, action: PayloadAction<number>) => {
            state.onboardingStep = action.payload;
        }
    },
});

export const { setCredentials, logout, updateUser, setStep } = authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access in components
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;