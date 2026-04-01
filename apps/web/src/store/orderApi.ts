'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T;
}

export interface OrderItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    lensType?: string;
    lensCoating?: string[];
    selectedPower?: object;
    _id?: string;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingAddress: object;
    paymentMethod: 'cod' | 'online';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface OrdersResponse {
    orders: Order[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getMyOrders: builder.query<ApiResponse<OrdersResponse>, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 } = {}) => `/orders/my?page=${page}&limit=${limit}`,
            providesTags: ['Order'],
        }),
        getOrderById: builder.query<ApiResponse<Order>, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation<ApiResponse<Order>, { shippingAddress: object; paymentMethod?: string; notes?: string }>({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Order'],
        }),
        cancelOrder: builder.mutation<ApiResponse<Order>, string>({
            query: (id) => ({
                url: `/orders/${id}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
        }),
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useCancelOrderMutation,
} = orderApi;
