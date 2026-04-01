'use client';

import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, clearCredentials } from './authSlice';
import type { AuthUser } from './authSlice';
import type { RootState } from './store';

interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include',
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
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as ApiResponse<{ accessToken: string }>;
      const state = api.getState() as RootState;
      if (state.auth.user) {
        api.dispatch(setCredentials({ user: state.auth.user, accessToken: data.data.accessToken }));
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminUser'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getProfile: builder.query<ApiResponse<AuthUser>, void>({
      query: () => '/users/profile',
      providesTags: ['AdminUser'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
