import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { Key } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Fund {
  _id: string;
  id: string;
  name: string;
  description: string;
  plan: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export interface Donation {
  createdAt: string | number | Date;
  plan: any;
  donatedBy: any;
  _id: Key | null | undefined;
  id: string;
  fundId: string;
  userId: string;
  userName: string;
  amount: number;
  interval: string;
  date: string;
}

export interface FundAnalytics {
  data: any;
  donations: any;
  currentAmount: any;
  totalDonations: number;
  donors: number;
  recentDonations: Donation[];
  monthlyGrowth: { month: string; amount: number }[];
}

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
      Omit<User, "id" | "role"> & { password: string; confirmPassword: string }
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
  query: () => '/funds/all', // Adjust the endpoint if needed
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
  useDonateFundMutation,
  useGetAllFundsQuery,
  useGetFundAnalyticsQuery,
  useGetFundByIdQuery,
  useDeleteFundMutation,
  useGetRecentDonationsQuery,
} = api;
