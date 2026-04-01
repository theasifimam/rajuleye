'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T;
}

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    product: string;
    order: string;
    rating: number;
    title?: string;
    comment: string;
    images: string[];
    isVerifiedPurchase: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ReviewsResponse {
    reviews: Review[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
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
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getProductReviews: builder.query<ApiResponse<ReviewsResponse>, { productId: string; page?: number; limit?: number }>({
            query: ({ productId, page = 1, limit = 10 }) => `/reviews/product/${productId}?page=${page}&limit=${limit}`,
            providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
        }),
        createReview: builder.mutation<ApiResponse<Review>, FormData>({
            query: (formData) => ({
                url: '/reviews',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error) =>
                result ? [{ type: 'Review', id: result.data.product }] : [],
        }),
        deleteReview: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
