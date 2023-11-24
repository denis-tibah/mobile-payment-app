import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionV2 = createApi({
  reducerPath: "transactionV2",
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
  tagTypes: ["TransactionV2"],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (params) => ({
        url: `/ziyl/getTransactionsV2finxp`,
        method: "POST",
        body: {
          account_id: params?.accountId,
          name: params?.name,
          sort: params?.sort,
          page: params?.page,
          direction: params?.direction,
          limit: params?.limit,
          iban: params?.iban,
          min_amount: params?.min_amount,
          max_amount: params?.max_amount,
          status: params?.status,
          from_date: params?.from_date,
          to_date: params?.to_date,
          bic: params?.bic,
          reference_no: params?.reference_no,
        },
      }),
    }),
    getStatementfinxp: builder.query({
      query: ({ account_id, direction, sort, from_date, to_date}) => ({
        url: `/ziyl/getStatementfinxp`,
        method: "POST",
        body: {
          account_id,
          direction,
          sort,
          from_date,
          to_date
        },
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useLazyGetStatementfinxpQuery,
} =
  transactionV2;
