import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const accountV2 = createApi({
  reducerPath: "accountV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["accountV2"],
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: ({
        tokenZiyl,
        accessToken,
      }: {
        tokenZiyl: string;
        accessToken: string;
      }) => {
        return {
          method: "GET",
          url: `/accountsfinxp`,
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
          invalidatesTags: ["accountV2"],
        };
      },
    }),
    getAccountDetails: builder.query({
      query: ({ accountId, tokenZiyl, accessToken }) => {
        return {
          url: `/accountdetailsfinxp/${accountId}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
        };
      },
    }),
  }),
});

export const { useGetAccountQuery, useGetAccountDetailsQuery } = accountV2;
