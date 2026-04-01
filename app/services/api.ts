import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// 1. Define the raw base query
const baseQuery = fetchBaseQuery({
  baseUrl: "https://stockinvest-api.vercel.app/api",
  prepareHeaders: (headers) => {
    // Use "token" consistently
    const token = Cookies.get("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. Create the Re-auth wrapper
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Clear the session - Use the correct cookie key
    Cookies.remove("token");
    localStorage.removeItem("user");

    // Wipe all cached data
    api.dispatch(apiSlice.util.resetApiState());

    // Redirect to login
    window.location.href = "/login";
  }

  return result;
};

// 3. Initialize the SINGLE API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Market",
    "Portfolio",
    "Transactions",
    "UserBalance",
    "Messages",
    "Resettlement",

    // ADD THESE NEW ADMIN TAGS:
    "Overview",
    "Users",
    "KYC",
    "Settings",
    "Requests",
    "Transfers",
    "Trades",
    "Markets",
  ],
  endpoints: () => ({}), // Inject your endpoints into this apiSlice elsewhere
});
