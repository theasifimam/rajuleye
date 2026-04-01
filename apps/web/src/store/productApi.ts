import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
    id: string;
    _id?: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
    images: string[];
    category: string | { _id: string; name: string; slug: string };
    inStock: boolean;
    rating: number;
    reviews: number;
    features?: string[];
    brand?: string;
    type?: string;
    frameColor?: string;
    size?: {
        lensWidth?: number;
        bridge?: number;
        templeLength?: number;
        frameWidth?: number;
    };
    lensType?: string;
}

interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    gender?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    frameShape?: string;
    frameMaterial?: string;
    sort?: string;
}

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<{ success: boolean; data: { products: Product[]; pagination: any } }, GetProductsParams | void>({
            query: (params) => ({
                url: '/products',
                params: params || {},
            }),
            providesTags: ['Product'],
            transformResponse: (response: { success: boolean; data: { products: any[]; pagination: any } }) => {
                return {
                    success: response.success,
                    data: {
                        pagination: response.data.pagination,
                        products: response.data.products.map(p => ({
                            ...p,
                            id: p._id,
                            image: p.images && p.images.length > 0 ? p.images[0] : '',
                            images: p.images || [],
                            inStock: p.stock > 0,
                            rating: p.avgRating || 0,
                            reviews: p.totalReviews || 0,
                            discountPrice: p.discount ? p.price - (p.price * p.discount / 100) : undefined,
                            category: typeof p.category === 'object' && p.category ? p.category.name : p.category,
                        }))
                    }
                };
            }
        }),
        getProductById: builder.query<{ success: boolean; data: Product }, string>({
            query: (idOrSlug) => `/products/${idOrSlug}`,
            providesTags: (result, error, idOrSlug) => [{ type: 'Product', id: idOrSlug }],
            transformResponse: (response: { success: boolean; data: any }) => {
                const p = response.data;
                return {
                    success: response.success,
                    data: {
                        ...p,
                        id: p._id,
                        image: p.images && p.images.length > 0 ? p.images[0] : '',
                        images: p.images || [],
                        inStock: p.stock > 0,
                        rating: p.avgRating || 0,
                        reviews: p.totalReviews || 0,
                        discountPrice: p.discount ? p.price - (p.price * p.discount / 100) : undefined,
                        category: typeof p.category === 'object' && p.category ? p.category.name : p.category,
                    }
                };
            }
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
} = productApi;
