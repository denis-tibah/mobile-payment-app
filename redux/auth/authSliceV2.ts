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
      query: (bodyParams) => {
        return {
          url: `/ziyl/updateBiometric`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyParams,
        };
      },
    }),
  }),
});

export const { useUpdateBiometricMutation } = authV2;
