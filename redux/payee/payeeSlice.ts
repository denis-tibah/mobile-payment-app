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
      query: ({ accessToken, tokenZiyl }) => ({
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
        recipientFirstname,
        recipientLastname,
        debtor_iban,
        creditor_iban,
        creditor_name,
        amount,
        currency,
        reason,
        remarks,
        purpose,
        reference,
      }: any) => {
        return {
          url: `/initiatepaymentfinxp`,
          method: "POST",
          body: {
            recipientFirstname,
            recipientLastname,
            creditor_name,
            debtor_iban,
            creditor_iban,
            amount,
            currency,
            reason,
            remarks,
            purpose,
            reference,
          },
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${access_token}`,
            Authorization: `Bearer ${token_ziyl}`,
          },
        };
      },
    }),
    smsRequestVerification: builder.mutation({
      query: ({
        access_token,
        token_ziyl,
        identifier,
        type,
        amount,
        currency,
      }: any) => {
        console.log({
          identifier,
          type,
          amount,
          currency,
          access_token,
          token_ziyl,
        });
        return {
          url: `/otprequestfinxp`,
          method: "POST",
          body: {
            identifier,
            type,
            amount,
            currency,
          },
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${access_token}`,
            Authorization: `Bearer ${token_ziyl}`,
          },
        };
      },
    }),
    processPayment: builder.mutation({
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
        reason,
        reference,
        purpose,
      }: any) => {
        return {
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
            reason,
            reference,
            purpose,
          },
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${access_token}`,
            Authorization: `Bearer ${token_ziyl}`,
          },
        };
      },
    }),
    submitProcessPayment: builder.mutation({
      query: ({
        access_token,
        token_ziyl,
        email,
        ticketValue,
        reference,
        purpose,
      }: any) => {
        return {
          url: `/submitprocesspaymentticket `,
          method: "POST",
          body: {
            type: "ProcessPaymentFileUpload",
            email,
            subject: "Process Payment",
            reference,
            purposeoftransfer: purpose,
            ticketValue,
          },
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${access_token}`,
            Authorization: `Bearer ${token_ziyl}`,
          },
        };
      },
    }),
    initiatePaymentV2: builder.mutation({
      query: ({ bodyParams, paramsHeader }) => {
        return {
          url: `/payment/initiate`,
          method: "POST",
          body: bodyParams,
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${paramsHeader?.accessToken}`,
            Authorization: `Bearer ${paramsHeader?.tokenZiyl}`,
          },
        };
      },
    }),
    getOTPV2: builder.mutation({
      query: ({ bodyParams, paramsHeader }) => {
        return {
          url: `/payment/otp`,
          method: "POST",
          body: bodyParams,
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${paramsHeader?.accessToken}`,
            Authorization: `Bearer ${paramsHeader?.tokenZiyl}`,
          },
        };
      },
    }),
    processPaymentV2: builder.mutation({
      query: ({ bodyParams, paramsHeader }) => {
        console.log("🚀 ~ paramsHeader:", paramsHeader);
        console.log("🚀 ~ bodyParams:", bodyParams);
        return {
          url: `/payment/process`,
          method: "POST",
          body: bodyParams,
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${paramsHeader?.accessToken}`,
            Authorization: `Bearer ${paramsHeader?.tokenZiyl}`,
          },
        };
      },
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
  useSubmitProcessPaymentMutation,
  useInitiatePaymentV2Mutation,
  useGetOTPV2Mutation,
  useProcessPaymentV2Mutation,
} = payeeSlice;

// reference = remarks
// purpose = reason
