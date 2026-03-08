import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/components/data/data-type";
import { authApi } from "./authApi";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  onboardingStep: number; // Tracks Step 7-15 progress locally
}

const isBrowser = typeof window !== "undefined";

const savedToken = isBrowser
  ? Cookies.get("token") || localStorage.getItem("token")
  : null;

// Check localStorage so user stays logged in on page refresh
const initialState: AuthState = {
  user: null,
  token: savedToken,
  isAuthenticated: !!savedToken,
  onboardingStep: 1,
};

const authSlice = createSlice({
  name: "auth",
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

      // Sync both storage types
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 7, secure: true });
    },

    /**
     * Clears everything on Logout
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear both storage types
      localStorage.removeItem("token");
      Cookies.remove("token");
    },

    /**
     * Update user profile data without re-logging in
     */
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    /**
     * Specific reducer to track the 15-step journey
     */
    setStep: (state, action: PayloadAction<number>) => {
      state.onboardingStep = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;

        // Match the cookie name used in your middleware.ts
        localStorage.setItem("token", payload.token);
        Cookies.set("token", payload.token, { expires: 7 });
      }
    );

    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { setCredentials, logout, updateUser, setStep } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access in components
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
