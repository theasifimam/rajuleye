'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, clearCredentials } from './authSlice';
const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);
        if (refreshResult.data) {
            const data = refreshResult.data;
            const state = api.getState();
            if (state.auth.user) {
                api.dispatch(setCredentials({ user: state.auth.user, accessToken: data.data.accessToken }));
            }
            result = await baseQuery(args, api, extraOptions);
        }
        else {
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
        login: builder.mutation({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
        }),
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['AdminUser'],
        }),
    }),
});
export const { useLoginMutation, useLogoutMutation, useGetProfileQuery, } = authApi;
