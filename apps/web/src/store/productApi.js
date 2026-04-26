import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params: params || {},
            }),
            providesTags: ['Product'],
            transformResponse: (response) => {
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
        getProductById: builder.query({
            query: (idOrSlug) => `/products/${idOrSlug}`,
            providesTags: (result, error, idOrSlug) => [{ type: 'Product', id: idOrSlug }],
            transformResponse: (response) => {
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
export const { useGetProductsQuery, useGetProductByIdQuery, } = productApi;
