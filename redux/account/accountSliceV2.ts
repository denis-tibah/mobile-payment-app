import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exportedBaseUrl } from "../../api";
const getTokens = async (): Promise<{
  accessToken: string | null;
  tokenZiyl: string | null;
}> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const tokenZiyl = await AsyncStorage.getItem("tokenZiyl");
  return { accessToken, tokenZiyl };
};
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
      query: ({ accountId }) => {
        return {
          url: `/accountdetailsfinxp/${accountId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAccountQuery, useGetAccountDetailsQuery } = accountV2;
