import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { Product } from './productApi';

export interface WishlistResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        user: string;
        products: Product[];
    } | null;
}

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Wishlist'],
    endpoints: (builder) => ({
        getWishlist: builder.query<WishlistResponse, void>({
            query: () => '/wishlist',
            providesTags: ['Wishlist'],
        }),
        toggleWishlist: builder.mutation<{ success: boolean; data: { action: string; productId: string } }, Product>({
            query: (product) => ({
                url: `/wishlist/toggle/${product.id || (product as any)._id}`,
                method: 'POST',
            }),
            async onQueryStarted(product, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
                        if (!draft.data) draft.data = { _id: '', user: '', products: [] };
                        if (!draft.data.products) draft.data.products = [];

                        const productId = product.id || (product as any)._id;
                        const index = draft.data.products.findIndex(
                            (p) => p.id === productId || (p as any)._id === productId
                        );

                        if (index !== -1) {
                            draft.data.products.splice(index, 1);
                        } else {
                            draft.data.products.push(product);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useToggleWishlistMutation,
} = wishlistApi;
