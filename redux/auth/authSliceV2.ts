import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const authV2 = createApi({
  reducerPath: "authV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
    prepareHeaders: (headers: any) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["AuthV2"],
  endpoints: (builder) => ({
    updateBiometric: builder.mutation({
      query: (body) => {
        return {
          url: `/updateBiometric`,
          method: "POST",
          body,
        };
      },
    }),
    login: builder.mutation({
      query: (bodyParams) => {
        console.log("🚀 ~ file: authSliceV2.ts:29 ~ bodyParams:", bodyParams);
        return {
          url: `/loginfinxpmobile`,
          method: "POST",
          body: bodyParams,
        };
      },
    }),
  }),
});

export const { useUpdateBiometricMutation, useLoginMutation } = authV2;
