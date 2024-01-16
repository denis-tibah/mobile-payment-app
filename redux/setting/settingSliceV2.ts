import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const settingV2 = createApi({
  reducerPath: "settingV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["settingV2"],
  endpoints: (builder) => ({
    getLimits: builder.query({
      query: ({ accessToken, tokenZiyl, accountId }) => {
        return {
          url: `/getlimitsfinxp`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
          body: {
            account_id: accountId,
          },
        };
      },
      invalidatesTags: ["settingV2"],
    }),
    updateLimits: builder.mutation({
      query: ({
        bodyParams,
        accountId,
        accessToken,
        tokenZiyl,
      }: {
        bodyParams: any;
        accountId: any;
        accessToken: any;
        tokenZiyl: any;
      }) => {
        return {
          url: `/updatelimitsfinxp/${accountId}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
          body: bodyParams,
        };
      },
      invalidatesTags: ["settingV2"],
    }),
  }),
});

export const { useGetLimitsQuery, useUpdateLimitsMutation } = settingV2;
