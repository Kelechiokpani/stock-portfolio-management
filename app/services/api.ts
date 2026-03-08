import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stockinvest-api.vercel.app/api",
    prepareHeaders: (headers, { getState }: any) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Portfolio", "Market", "Admin", "Funds"],
  endpoints: () => ({}), // Empty: we will inject here
});
