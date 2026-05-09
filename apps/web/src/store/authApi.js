'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, clearCredentials, updateUser } from './authSlice';
// ── Base query with automatic re-auth on 401 ───────────────
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
    credentials: 'include', // send cookies
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
        // Try refreshing the token
        const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);
        if (refreshResult.data) {
            const data = refreshResult.data;
            const state = api.getState();
            if (state.auth.user) {
                api.dispatch(setCredentials({ user: state.auth.user, accessToken: data.data.accessToken }));
            }
            // Retry the original request
            result = await baseQuery(args, api, extraOptions);
        }
        else {
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
        register: builder.mutation({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        verifyMobile: builder.mutation({
            query: (body) => ({ url: '/auth/verify-mobile', method: 'POST', body }),
        }),
        login: builder.mutation({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
        }),
        resetPassword: builder.mutation({
            query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
        }),
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
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
                }
                catch { }
            },
        }),
        updateEyePower: builder.mutation({
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
                }
                catch { }
            },
        }),
        addAddress: builder.mutation({
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
                }
                catch { }
            },
        }),
        updateAddress: builder.mutation({
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
                }
                catch { }
            },
        }),
        deleteAddress: builder.mutation({
            query: (addressId) => ({
                url: `/users/addresses/${addressId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateUser(data.data));
                }
                catch { }
            },
        }),
        requestAccountDeletion: builder.mutation({
            query: () => ({
                url: '/users/request-delete',
                method: 'POST',
            }),
        }),
        deleteAccount: builder.mutation({
            query: (otp) => ({
                url: '/users/account',
                method: 'DELETE',
                body: { otp },
            }),
        }),
    }),
});
export const { useRegisterMutation, useVerifyMobileMutation, useLoginMutation, useLogoutMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetProfileQuery, useUpdateProfileMutation, useUpdateEyePowerMutation, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation, useRequestAccountDeletionMutation, useDeleteAccountMutation, } = authApi;
