'use client';

import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, clearCredentials, updateUser } from './authSlice';
import type { AuthUser, IAddress, IEyePower } from './authSlice';
import type { RootState } from './store';

// ── Response types ──────────────────────────────────────────
interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

interface RegisterResponse {
  email: string;
}

interface RefreshResponse {
  accessToken: string;
}

// ── Base query with automatic re-auth on 401 ───────────────
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include', // send cookies
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refreshing the token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as ApiResponse<RefreshResponse>;
      const state = api.getState() as RootState;
      if (state.auth.user) {
        api.dispatch(setCredentials({ user: state.auth.user, accessToken: data.data.accessToken }));
      }
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

// ── API slice ───────────────────────────────────────────────
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<RegisterResponse>, { name: string; email: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    verifyEmail: builder.mutation<ApiResponse<LoginResponse>, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-email', method: 'POST', body }),
    }),

    login: builder.mutation<ApiResponse<LoginResponse>, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    logout: builder.mutation<ApiResponse, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),

    forgotPassword: builder.mutation<ApiResponse<{ email: string }>, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),

    resetPassword: builder.mutation<ApiResponse, { email: string; otp: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    getProfile: builder.query<ApiResponse<AuthUser>, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<ApiResponse<AuthUser>, FormData>({
      query: (body) => ({
        url: '/users/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch { }
      },
    }),
    updateEyePower: builder.mutation<ApiResponse<AuthUser>, IEyePower>({
      query: (body) => ({
        url: '/users/eye-power',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch { }
      },
    }),
    addAddress: builder.mutation<ApiResponse<AuthUser>, Omit<IAddress, '_id'>>({
      query: (body) => ({
        url: '/users/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch { }
      },
    }),
    updateAddress: builder.mutation<ApiResponse<AuthUser>, { addressId: string; address: Partial<IAddress> }>({
      query: ({ addressId, address }) => ({
        url: `/users/addresses/${addressId}`,
        method: 'PATCH',
        body: address,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch { }
      },
    }),
    deleteAddress: builder.mutation<ApiResponse<AuthUser>, string>({
      query: (addressId) => ({
        url: `/users/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch { }
      },
    }),
    requestAccountDeletion: builder.mutation<ApiResponse<{ email: string }>, void>({
      query: () => ({
        url: '/users/request-delete',
        method: 'POST',
      }),
    }),
    deleteAccount: builder.mutation<ApiResponse, string>({
      query: (otp) => ({
        url: '/users/account',
        method: 'DELETE',
        body: { otp },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateEyePowerMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useRequestAccountDeletionMutation,
  useDeleteAccountMutation,
} = authApi;
