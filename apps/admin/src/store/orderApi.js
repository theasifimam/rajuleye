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
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: ({ page = 1, limit = 20, status }) => {
                let url = `/orders?page=${page}&limit=${limit}`;
                if (status && status !== 'All Status')
                    url += `&status=${status.toLowerCase()}`;
                return url;
            },
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { orderStatus: status },
            }),
            invalidatesTags: (result, error, { id }) => ['Order', { type: 'Order', id }],
        }),
    }),
});
export const { useGetAllOrdersQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation, } = orderApi;
