import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const payeeSlice = createApi({
  reducerPath: "payee",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
      },
    }),
  keepUnusedDataFor: 30,
  tagTypes: ["payee"],
  endpoints: (builder) => ({
    getPayees: builder.query({
      query: ({accessToken, tokenZiyl}) => ({
        url: `/getBeneficiaryfinxp`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          AuthorizationFinxp: `Bearer ${accessToken}`,
          Authorization: `Bearer ${tokenZiyl}`,
        },
      }),
    }),
    addPayee: builder.mutation({
      query: ({
        accessToken,
        tokenZiyl,
        beneficiary_name,
        beneficiary_iban,
        beneficiary_bic,
      }: any) => ({
        url: `/createbeneficiaryfinxp`,
        method: "POST",
        body: {
          beneficiary_name,
          beneficiary_iban,
          beneficiary_bic,
        },
        headers: {
          "Content-Type": "application/json",
          AuthorizationFinxp: `Bearer ${accessToken}`,
          Authorization: `Bearer ${tokenZiyl}`,
        },
      }),
    }),
  }),
});

export const { 
  useGetPayeesQuery, 
  useLazyGetPayeesQuery,
  useAddPayeeMutation,
} = payeeSlice;