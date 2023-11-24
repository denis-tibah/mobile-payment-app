import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exportedBaseUrl } from "../../api";
const getTokens = async (): Promise<{ accessToken: string | null; tokenZiyl: string | null; }> => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const tokenZiyl = await AsyncStorage.getItem("tokenZiyl");
    return { accessToken, tokenZiyl };
}
export const accountV2 = createApi({
  reducerPath: "accountV2",
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
  keepUnusedDataFor: 30,
  tagTypes: ["accountV2"],
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => ({
        url: `/accountsfinxp`,
      }),
    }),
    getAccountDetails: builder.query({
      query: ({ accountId }) => ({
        url: `/accountdetailsfinxp/${accountId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAccountQuery, useGetAccountDetailsQuery } = accountV2;
