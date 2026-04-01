import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
    id: string;
    _id?: string;
    name: string;
    slug: string;
    image?: string;
    parent?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<{ success: boolean; data: Category[] }, { isActive?: boolean }>({
            query: (params) => ({
                url: '/categories',
                params: { ...params, limit: 100 },
            }),
            providesTags: ['Category'],
            transformResponse: (response: { success: boolean; data: any[] }) => {
                return {
                    success: response.success,
                    data: response.data.map((c) => ({ ...c, id: c._id })),
                };
            },
        }),
        getCategoryBySlug: builder.query<{ success: boolean; data: Category }, string>({
            query: (slug) => `/categories/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
            transformResponse: (response: { success: boolean; data: any }) => {
                return {
                    success: response.success,
                    data: { ...response.data, id: response.data._id },
                };
            },
        }),
        getTopNavCategories: builder.query<{ success: boolean; data: Category[] }, void>({
            query: () => '/categories/top-nav',
            providesTags: ['Category'],
            transformResponse: (response: { success: boolean; data: any[] }) => {
                return {
                    success: response.success,
                    data: response.data.map((c) => ({ ...c, id: c._id })),
                };
            },
        }),
    }),
});
export const {
    useGetCategoriesQuery,
    useGetCategoryBySlugQuery,
    useGetTopNavCategoriesQuery,
} = categoryApi;
