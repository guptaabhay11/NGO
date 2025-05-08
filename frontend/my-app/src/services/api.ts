import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { Key } from "react";
import { User } from "../types";
import { ApiResponse } from "../types";
import { Fund } from "../types";
import { FundAnalytics } from "../types";
import { Donation } from "../types";
const baseUrl = "http://localhost:5000/api/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Funds'],
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => "users/me",
    }),

    login: builder.mutation<
    ApiResponse<{ accessToken: string; refreshToken: string; user: User }>,
    { email: string; password: string }
  >({
    query: (body) => ({
      url: `/users/login`,
      method: 'POST',
      body,
    }),
  }),

    register: builder.mutation<
      { user: User; token: string },
      Omit<User, "id" | "role" | "bankDetails" | "amount" | "active" | "data"> & { password: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: "users/register",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "users/logout", method: "POST" }),
    }),

    createFund: builder.mutation<Fund, { name: string; description: string; targetAmount: number; plan: string }>({
      query: (body) => ({
        url: "funds/create",
        method: "POST",
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Funds'],
    }),

    donateFund: builder.mutation<Donation, { fundId: string; amount: number; interval: string }>({
      query: ({ fundId, amount, interval }) => ({
        url: `funds/donate/${fundId}`,
        method: "PATCH",
        body: { amount, interval },
      }),
    }),

  getAllFunds: builder.query<ApiResponse<Fund[]>, void>({
  query: () => '/funds/all', 
  providesTags: ['Funds'],
}),

    getFundAnalytics: builder.query<FundAnalytics, { fundId: string }>({
      query: ({ fundId }) => `funds/analytics/${fundId}`,
    }),

    deleteFund: builder.mutation<void, { fundId: string }>({
      query: ({ fundId }) => ({ url: `funds/delete/${fundId}`, method: "DELETE" }),
    }),

    getFundById: builder.query<ApiResponse<Fund>, string>({
      query: (fundId) => `funds/getfunds/${fundId}`,
    }),

    addBalance: builder.mutation<void, {userId: string, amount: number }>({
      query: ({ userId, amount }) => ({
        url: `users/addBalance`,
        method: "PATCH",
        body: { amount, userId },
      }),
    }),

    addBankDetails: builder.mutation<void, {userId: string, bankDetails: string }>({
      query: ({ userId, bankDetails }) => ({
        url: `users/addBankDetails`,
        method: "POST",
        body: { bankDetails, userId },
      }),
    }),

    getRecentDonations: builder.query<Donation[], void>({
      query: () => "funds/recentDonations",
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCreateFundMutation,
  useAddBankDetailsMutation,
  useAddBalanceMutation,
  useDonateFundMutation,
  useGetAllFundsQuery,
  useGetFundAnalyticsQuery,
  useGetFundByIdQuery,
  useDeleteFundMutation,
  useGetRecentDonationsQuery,
} = api;
