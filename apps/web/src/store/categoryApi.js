import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params) => ({
                url: '/categories',
                params: { ...params, limit: 100 },
            }),
            providesTags: ['Category'],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: response.data.map((c) => ({ ...c, id: c._id })),
                };
            },
        }),
        getCategoryBySlug: builder.query({
            query: (slug) => `/categories/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: { ...response.data, id: response.data._id },
                };
            },
        }),
        getTopNavCategories: builder.query({
            query: () => '/categories/top-nav',
            providesTags: ['Category'],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: response.data.map((c) => ({ ...c, id: c._id })),
                };
            },
        }),
    }),
});
export const { useGetCategoriesQuery, useGetCategoryBySlugQuery, useGetTopNavCategoriesQuery, } = categoryApi;
