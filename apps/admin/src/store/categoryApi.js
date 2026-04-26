'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params) => ({
                url: '/categories',
                params: params || {},
            }),
            providesTags: (result) => result
                ? [
                    ...result.data.map(({ _id }) => ({ type: 'Category', id: _id })),
                    { type: 'Category', id: 'LIST' },
                ]
                : [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query({
            query: (idOrSlug) => `/categories/${idOrSlug}`,
            providesTags: (_result, _error, idOrSlug) => [{ type: 'Category', id: idOrSlug }],
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        updateCategory: builder.mutation({
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
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});
export const { useGetCategoriesQuery, useGetCategoryByIdQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, } = categoryApi;
