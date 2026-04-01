import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { type ProductFormValues } from '@/lib/zod-schemas';

interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T;
}

export interface ImportResults {
    created: number;
    updated: number;
    failed: number;
    errors: { sku?: string; error: string }[];
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    brand: string;
    sku: string;
    category: string | { _id: string; name: string; slug: string };
    type: 'eyeglasses' | 'sunglasses' | 'reading-glasses' | 'contact-lenses' | 'accessories';
    frameShape?: 'round' | 'square' | 'rectangle' | 'oval' | 'cat-eye' | 'wayfarer' | 'aviator' | 'clubmaster';
    frameMaterial?: 'metal' | 'acetate' | 'tr90' | 'wood' | 'titanium' | 'mixed';
    frameColor?: string;
    lensType?: 'single-vision' | 'bifocal' | 'progressive' | 'non-prescription';
    lensCoating: string[];
    gender: 'men' | 'women' | 'unisex' | 'kids';
    size?: {
        lensWidth?: number;
        bridge?: number;
        templeLength?: number;
        frameWidth?: number;
    };
    weight?: number;
    images: string[];
    price: number;
    discount: number;
    stock: number;
    tags: string[];
    isActive: boolean;
    avgRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    gender?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    frameShape?: string;
    frameMaterial?: string;
    sort?: string;
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

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<ApiResponse<{
            products: Product[]; pagination: {
                pages: number; total: number; page: number; limit: number; totalPages: number
            }
        }>, GetProductsParams | void>({
            query: (params) => ({
                url: '/products',
                params: params || {},
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.products.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),
        getProductById: builder.query<ApiResponse<Product>, string>({
            query: (idOrSlug) => `/products/${idOrSlug}`,
            providesTags: (_result, _error, idOrSlug) => [{ type: 'Product', id: idOrSlug }],
        }),
        createProduct: builder.mutation<ApiResponse<Product>, ProductFormValues>({
            query: (body) => ({
                url: '/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: builder.mutation<ApiResponse<Product>, { id: string; body: ProductFormValues }>({
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
        deleteProduct: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        bulkImportProducts: builder.mutation<ApiResponse<ImportResults>, FormData>({
            query: (body) => {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.11:5000';
                return {
                    url: `${apiBase}/api/v1/products/bulk-import`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        bulkUploadImages: builder.mutation<ApiResponse<{ uploads: { url: string; sku: string }[]; autoMatched: number }>, { body: FormData; autoMatch?: boolean }>({
            query: ({ body, autoMatch }) => {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.11:5000';
                return {
                    url: `${apiBase}/api/v1/products/bulk-images${autoMatch ? '?autoMatch=true' : ''}`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        addProductImages: builder.mutation<ApiResponse<string[]>, { id: string; body: FormData }>({
            query: ({ id, body }) => {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.11:5000';
                return {
                    url: `${apiBase}/api/v1/products/${id}/images`,
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

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAddProductImagesMutation,
    useBulkImportProductsMutation,
    useBulkUploadImagesMutation,
} = productApi;
