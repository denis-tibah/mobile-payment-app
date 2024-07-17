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
  tagTypes: ["authV2"],
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
        return {
          url: `/loginfinxpmobile`,
          method: "POST",
          body: bodyParams,
        };
      },
    }),
    loginV2: builder.mutation({
      query: (bodyParams) => {
        return {
          url: `/auth/login-mobile`,
          method: "POST",
          body: bodyParams,
        };
      },
    }),
  }),
});

export const {
  useUpdateBiometricMutation,
  useLoginMutation,
  useLoginV2Mutation,
} = authV2;
export const loginReducer = authV2.reducer;
