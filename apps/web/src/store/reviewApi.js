'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const reviewApi = createApi({
    reducerPath: 'reviewApi',
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
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: ({ productId, page = 1, limit = 10 }) => `/reviews/product/${productId}?page=${page}&limit=${limit}`,
            providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
        }),
        createReview: builder.mutation({
            query: (formData) => ({
                url: '/reviews',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error) => result ? [{ type: 'Review', id: result.data.product }] : [],
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});
export const { useGetProductReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation, } = reviewApi;
