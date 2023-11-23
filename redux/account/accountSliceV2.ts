import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountV2 = createApi({
  reducerPath: "accountV2",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_APIURL,
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem("accessToken");
      const tokenZiyl = localStorage.getItem("token_ziyl");
      if (accessToken && tokenZiyl) {
        headers.set("Content-Type", "application/json");
        headers.set("AuthorizationFinxp", `Bearer ${accessToken}`);
        headers.set("Authorization", `Bearer ${tokenZiyl}`);
        return headers;
      }
    },
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["accountV2"],
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => ({
        url: `/ziyl/accountsfinxp`,
      }),
      invalidatesTags: ["accountV2"],
    }),
    getAccountDetails: builder.query({
      query: ({ accountId }) => ({
        url: `/ziyl/accountdetailsfinxp/${accountId}`,
      }),
      invalidatesTags: ["accountV2"],
    }),
  }),
});

export const { useGetAccountQuery, useGetAccountDetailsQuery } = accountV2;
