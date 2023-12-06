import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const registrationV2 = createApi({
  reducerPath: "registrationV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
    prepareHeaders: (headers: any) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["RegistrationV2"],
  endpoints: (builder) => ({
    loginCredentials: builder.mutation({
      query: (bodyParams) => {
        return {
          url: `/sendactivationemailfinxp`,
          method: "POST",
          body: bodyParams,
        };
      },
    }),
  }),
});

export const { useLoginCredentialsMutation } = registrationV2;
