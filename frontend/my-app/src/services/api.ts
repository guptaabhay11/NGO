import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { Key } from "readline";
import { ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Fund {
  plan: ReactNode;
  _id: Key | null | undefined;
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export interface Donation {
  id: string;
  fundId: string;
  userId: string;
  userName: string;
  amount: number;
  interval: string;
  date: string;
}

export interface FundAnalytics {
  totalDonations: number;
  donors: number;
  recentDonations: Donation[];
  monthlyGrowth: { month: string; amount: number }[];
}

const baseUrl = "http://localhost:5000/api/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    me: builder.query<User, void>({
      query: () => `/users/me`,
    }),
    login: builder.mutation<
    ApiResponse<{ accessToken: string; refreshToken: string }>,
    { email: string; password: string }
  >({
    query: (body) => ({
      url: `/users/login`,
      method: "POST",
      body,
    }),
  }),
    register: builder.mutation<{ user: User; token: string }, Omit<User, 'id' | 'role'> & { password: string, confirmPassword: string }>({
      query: (body) => {
        return {
          url: `/users/register`,
          method: 'POST',
          body
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/users/logout`,
          method: 'POST',
        }
      },
    }),
    createFund: builder.mutation<Fund, { name: string, description: string, targetAmount: number }>({
      query: (body) => ({
        url: `/funds/create`,
        method: 'POST',
        body,
      }),
    }),
    donateFund: builder.mutation<Donation, { fundId: string, amount: number, interval: string }>({
      query: (body) => ({
        url: `/funds/donate/${body.fundId}`,
        method: 'PATCH',
        body: { amount: body.amount, interval: body.interval },
      }),
    }),
    getAllFunds: builder.query<Fund[], void>({
      query: () => `/funds/all`,
    }),
    getFundAnalytics: builder.query<FundAnalytics, { fundId: string }>({
      query: (body) => `/funds/analytics/${body.fundId}`,
    }),
    deleteFund: builder.mutation<void, { fundId: string }>({
      query: (body) => ({
        url: `/funds/delete/${body.fundId}`,
        method: 'DELETE',
      }),
    }),
    getRecentDonations: builder.query<Donation[], void>({
      query: () => `/funds/recentDonations`,
    }),
  }),
});

export const {
  useCreateFundMutation,
  useDonateFundMutation,
  useGetAllFundsQuery,
  useGetFundAnalyticsQuery,
  useDeleteFundMutation,
  useGetRecentDonationsQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery
} = api;