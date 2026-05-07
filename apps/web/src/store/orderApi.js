'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Order', 'Cart'],
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => `/orders/my?page=${page}&limit=${limit}`,
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
        }),
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: '/orders/verify-payment',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});
export const { useGetMyOrdersQuery, useGetOrderByIdQuery, useCreateOrderMutation, useCancelOrderMutation, useVerifyPaymentMutation } = orderApi;
