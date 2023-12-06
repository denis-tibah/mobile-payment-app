import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const transactionV2 = createApi({
  reducerPath: "transactionV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["transactionV2"],
  endpoints: (builder) => ({
    getTransactions: builder.query<any, any>({
      query: (params) => ({
        url: `/getTransactionsV2finxp`,
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
          card_id: params?.card_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${params?.tokenZiyl}`,
          AuthorizationFinxp: `Bearer ${params?.accessToken}`,
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
} = transactionV2;
