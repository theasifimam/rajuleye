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
export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params: params || {},
            }),
            providesTags: (result) => result
                ? [
                    ...result.data.products.map(({ _id }) => ({ type: 'Product', id: _id })),
                    { type: 'Product', id: 'LIST' },
                ]
                : [{ type: 'Product', id: 'LIST' }],
        }),
        getProductById: builder.query({
            query: (idOrSlug) => `/products/${idOrSlug}`,
            providesTags: (_result, _error, idOrSlug) => [{ type: 'Product', id: idOrSlug }],
        }),
        createProduct: builder.mutation({
            query: (body) => ({
                url: '/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        bulkImportProducts: builder.mutation({
            query: (body) => {
                return {
                    url: `/products/bulk-import`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        bulkUploadImages: builder.mutation({
            query: ({ body, autoMatch }) => {
                return {
                    url: `/products/bulk-images${autoMatch ? '?autoMatch=true' : ''}`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        addProductImages: builder.mutation({
            query: ({ id, body }) => {
                return {
                    url: `/products/${id}/images`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
    }),
});
export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useAddProductImagesMutation, useBulkImportProductsMutation, useBulkUploadImagesMutation, } = productApi;
