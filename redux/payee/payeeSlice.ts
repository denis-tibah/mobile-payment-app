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
        access_token,
        token_ziyl,
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
          AuthorizationFinxp: `Bearer ${access_token}`,
          Authorization: `Bearer ${token_ziyl}`,
        },
      }),
    }),
    initiatePayment: builder.mutation({
      query: ({
        access_token,
        token_ziyl,
        attached_file,
        recipientFirstname,
        recipientLastname,
        debtor_iban,
        creditor_iban,
        creditor_name,
        amount,
        currency,
        reason,
      }: any) => ({
        url: `/initiatepaymentfinxp`,
        method: "POST",
        body: {
          debtor_iban,
          creditor_iban,
          amount,
          currency,
          reason,
          attached_file,
        },
        headers: {
          "Content-Type": "application/json",
          AuthorizationFinxp: `Bearer ${access_token}`,
          Authorization: `Bearer ${token_ziyl}`,
        },
      }),
    }),
    smsRequestVerification: builder.mutation({
      query: ({ 
        access_token,
        token_ziyl,
        identifier,
        type,
        amount,
        currency,
      }: any) => ({
        url: `/otprequestfinxp`,
        method: "POST",
        body: {
          identifier,
          type,
          amount,
          currency
        },
        headers: {
          "Content-Type": "application/json",
          AuthorizationFinxp: `Bearer ${access_token}`,
          Authorization: `Bearer ${token_ziyl}`,
        },
      }),
    }),
    processPayment : builder.mutation({
      query: ({ 
        access_token,
        token_ziyl,
        identifier,
        code,
        amount,
        currency,
        debtor_iban,
        creditor_iban,
        remarks,
      }: any) => ({
        url: `/processpaymentfinxp`,
        method: "POST",
        body: {
          identifier,
          code,
          amount,
          currency,
          debtor_iban,
          creditor_iban,
          remarks,
        },
        headers: {
          "Content-Type": "application/json",
          AuthorizationFinxp: `Bearer ${access_token}`,
          Authorization: `Bearer ${token_ziyl}`,
        },
      }),
    }),
  }),
});

export const { 
  useGetPayeesQuery, 
  useLazyGetPayeesQuery,
  useAddPayeeMutation,
  useInitiatePaymentMutation,
  useSmsRequestVerificationMutation,
  useProcessPaymentMutation,
} = payeeSlice;