import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";
export const REQUESTTYPE = {
  updateProfile: "Update Profile Request",
  updateAddress: "Update Address Request",
  updatePassword: "Update Password Request",
};
export const profileV2 = createApi({
  reducerPath: "profileV2",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["profileV2"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/ziyl/profilefinxp`,
      }),
      invalidatesTags: ["profileV2"],
    }),
    createTicketRequest: builder.mutation({
      query: ({
        bodyParams,
        accessToken,
        tokenZiyl,
      }: {
        bodyParams: any;
        accessToken: any;
        tokenZiyl: any;
      }) => {
        return {
          url: "/createticketfinxp",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
          body: bodyParams,
        };
      },
    }),
    updatePassword: builder.mutation({
      query: ({
        bodyParams,
        accessToken,
        tokenZiyl,
      }: {
        bodyParams: any;
        accessToken: any;
        tokenZiyl: any;
      }) => {
        console.log("🚀 ~ tokenZiyl:", tokenZiyl);
        console.log("🚀 ~ accessToken:", accessToken);
        console.log("🚀 ~ bodyParams:", bodyParams);
        return {
          url: "/updatePasswordfinxp",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${accessToken}`,
            Authorization: `Bearer ${tokenZiyl}`,
          },
          body: bodyParams,
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useCreateTicketRequestMutation,
  useUpdatePasswordMutation,
} = profileV2;
