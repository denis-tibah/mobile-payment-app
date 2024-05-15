import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { exportedBaseUrl } from "../../api";

export const notifications = createApi({
  reducerPath: "notification",
  baseQuery: fetchBaseQuery({
    baseUrl: exportedBaseUrl,
  }),
  keepUnusedDataFor: 30,
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => {
        return {
          method: "GET",
          url: `/notification`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${params?.tokenZiyl}`,
          },
          invalidatesTags: ["notification"],
        };
      },
    }),
    generateStatementsNotification: builder.query({
      query: (params) => {
        return {
          url: `/notification/statements-ready`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AuthorizationFinxp: `Bearer ${params?.accessToken}`,
            Authorization: `Bearer ${params?.tokenZiyl}`,
          },
          invalidatesTags: ["notification"],
        };
      },
    }),
    readNotification: builder.mutation({
      query: (params) => {
        return {
          url: `/notification/read/${params?.notificationId}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${params?.tokenZiyl}`,
          },
          invalidatesTags: ["notification"],
        };
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGenerateStatementsNotificationQuery,
  useReadNotificationMutation,
} = notifications;
