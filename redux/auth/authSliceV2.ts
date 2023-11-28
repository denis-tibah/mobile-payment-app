import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authV2 = createApi({
  reducerPath: "authV2",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_APIURL,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
      },
  }),
  tagTypes: ["AuthV2"],
  endpoints: (builder) => ({
    requestForgotPassword: builder.mutation({
      query: ({ requestingEmail }) => ({
        url: `/ziyl/RequestForgotPasswordfinxp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: requestingEmail
        }
      }),
    }),
    resetPassword:  builder.mutation({
      query: ({ requestingEmail, password, resetToken }) => ({
        url: `/ziyl/resetPasswordfinxp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: requestingEmail,
          password,
          password_confirmation: password,
          token: resetToken
        }
      }),
    }),
  }),
});

export const { useRequestForgotPasswordMutation, useResetPasswordMutation } = authV2;
