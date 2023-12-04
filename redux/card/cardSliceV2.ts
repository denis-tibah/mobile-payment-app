import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exportedBaseUrl } from "../../api";
const METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
};
const getTokens = async (): Promise<{ accessToken: string | null; tokenZiyl: string | null; }> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const tokenZiyl = await AsyncStorage.getItem("tokenZiyl");
  return { accessToken, tokenZiyl };
}
export const cardsV2 = createApi({
  reducerPath: "cardsV2",
  tagTypes: ["cardsV2"],
  keepUnusedDataFor: 30,
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
    prepareHeaders: async (headers) => {
      const { accessToken, tokenZiyl} = await getTokens();
      if (accessToken && tokenZiyl) {
        headers.set("Content-Type", "application/json");
        headers.set("AuthorizationFinxp", `Bearer ${accessToken}`);
        headers.set("Authorization", `Bearer ${tokenZiyl}`);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    getCardTransactions: builder.query({
      query: ({ account_id, from_date, to_date, type, card_id }) => ({
        url: `/getCardTransactionsfinxp`,
        method: METHODS.POST,
        body: {
          account_id,
          from_date,
          to_date,
          type,
          card_id,
        },
      }),
      invalidatesTags: ["cardsV2"] as any,
    }),
    sendSmsShowPinVerification: builder.query({
      query: ({ type }) => ({
        url: `/cardotpfinxp`,
        method: "POST",
        body: { type },
      }),
    }),
    orderCard: builder.query({
      query: ({ accountUuid, email, cardType, currency, otp }) => ({
        url: "/OrdercardfinxpV2",
        method: METHODS.POST,
        body: {
          accountUuid,
          email,
          cardType,
          currency,
          code: otp,
        },
      }),
    }),

    showCardDetails: builder.query({
      query: ({ accountId, otp }) => ({
        url: `/showcardfinxpV2`,
        method: "POST",
        body: {
          account_id: accountId,
          otp,
        },
      }),
    }),
    orderCardTwo: builder.mutation({
      query: ({ accountUuid, email, cardType, currency, otp }) => {
        console.log("card enrollll");
        return {
          url: "/OrdercardfinxpV2",
          method: METHODS.POST,
          body: {
            cardType,
            accountUuid,
            currency,
            email,
            code: otp,
          },
          invalidatesTags: ["cardsV2"],
        };
      },
    }),
    sendSmsLostCardVerification: builder.query({
      query: ({ accountId, cardId }) => ({
        url: "/terminatecardfinxpV2",
        method: METHODS.POST,
        body: {
          account_id: accountId,
          card_id: cardId,
        },
      }),
    }),
    sendSmsShowPinVerificationTwo: builder.mutation({
      query: ({ type }) => ({
        url: `/cardotpfinxp`,
        method: "POST",
        body: {
          type,
        },
        invalidatesTags: ["cardsV2"],
      }),
    }),
    getCardV2: builder.query({
      query: () => ({
        url: `/getcardsfinxpV2`,
        method: "GET",
      }),
      invalidatesTags: ["cardsV2"] as any,
    }),
    freezeCard: builder.query({
      query: ({ freezeYN, account_id }) => ({
        url: `/freezecardfinxpV3`,
        method: "POST",
        body: {
          freezeYN: freezeYN,
          account_id: account_id,
        },
      }),
      invalidatesTags: ["cardsV2"] as any,
    }),
    showCardPinNumber: builder.query({
      query: ({ account_id, show }) => ({
        url: `/showcardpinfinxp`,
        method: "POST",
        body: {
          account_id: account_id,
          show: show,
        },
      }),
      invalidatesTags: ["cardsV2"] as any,
    }),
    showCardRegistrationFinxp: builder.mutation({
      query: ({ account_id }) => ({
        url: `/showcardregistrationfinxpV2`,
        method: "POST",
        body: {
          account_id: account_id,
        },
      }),
      invalidatesTags: ["cardsV2"],
    }),
  }),
});

export const {
  useLazyGetCardTransactionsQuery,
  useLazySendSmsShowPinVerificationQuery,
  useSendSmsShowPinVerificationTwoMutation,
  useLazyOrderCardQuery,
  useOrderCardTwoMutation,
  useSendSmsLostCardVerificationQuery,
  useLazySendSmsLostCardVerificationQuery,
  useShowCardDetailsQuery,
  useLazyShowCardDetailsQuery,
  useLazyGetCardV2Query,
  useLazyFreezeCardQuery,
  useLazyShowCardPinNumberQuery,
  useShowCardRegistrationFinxpMutation,
} = cardsV2;