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

export interface OrderUser {
    _id: string;
    name: string;
    email: string;
}

export interface Order {
    _id: string;
    user: OrderUser;
    items: OrderItem[];
    shippingAddress: {
        fullName: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        mobile: string;
    };
    paymentMethod: 'cod' | 'online';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    notes?: string;
    trackingNumber?: string;
    paidAt?: string;
    deliveredAt?: string;
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
        getAllOrders: builder.query<ApiResponse<OrdersResponse>, { page?: number; limit?: number; status?: string }>({
            query: ({ page = 1, limit = 20, status }) => {
                let url = `/orders?page=${page}&limit=${limit}`;
                if (status && status !== 'All Status') url += `&status=${status.toLowerCase()}`;
                return url;
            },
            providesTags: ['Order'],
        }),
        getOrderById: builder.query<ApiResponse<Order>, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        updateOrderStatus: builder.mutation<ApiResponse<Order>, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { orderStatus: status },
            }),
            invalidatesTags: (result, error, { id }) => ['Order', { type: 'Order', id }],
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
} = orderApi;
