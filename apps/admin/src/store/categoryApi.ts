'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T;
}

export interface Category {
    id: string;
    _id: string;
    name: string;
    slug: string;
    image?: string;
    parent?: string | { _id: string; name: string; slug: string } | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    productsCount?: number;
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

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<ApiResponse<Category[]>, { all?: boolean; parent?: string } | void>({
            query: (params) => ({
                url: '/categories',
                params: params || {},
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
                        { type: 'Category', id: 'LIST' },
                    ]
                    : [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query<ApiResponse<Category>, string>({
            query: (idOrSlug) => `/categories/${idOrSlug}`,
            providesTags: (_result, _error, idOrSlug) => [{ type: 'Category', id: idOrSlug }],
        }),
        createCategory: builder.mutation<ApiResponse<Category>, FormData>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        updateCategory: builder.mutation<ApiResponse<Category>, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Category', id },
                { type: 'Category', id: 'LIST' },
            ],
        }),
        deleteCategory: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
