import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { Product } from './productApi';

export interface CartItem {
    product: Product;
    qty: number;
    priceAtAdd: number;
    lensType?: string;
    lensCoating?: string[];
    selectedPower?: object;
    _id?: string;
}

export interface CartResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        user: string;
        items: CartItem[];
    } | null;
}

export interface AddToCartArgs {
    product: Product;
    qty?: number;
    lensType?: string;
    lensCoating?: string[];
    selectedPower?: object;
}

export interface UpdateCartItemArgs {
    productId: string;
    qty: number;
}

export const cartApi = createApi({
    reducerPath: 'cartApi',
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
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        getCart: builder.query<CartResponse, void>({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation<CartResponse, AddToCartArgs>({
            query: ({ product, ...rest }) => ({
                url: '/cart/add',
                method: 'POST',
                body: { productId: product.id || (product as any)._id, ...rest },
            }),
            async onQueryStarted({ product, qty = 1, lensType, lensCoating, selectedPower }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        if (!draft.data) draft.data = { _id: '', user: '', items: [] };
                        if (!draft.data.items) draft.data.items = [];

                        const productId = product.id || (product as any)._id;
                        const existingItem = draft.data.items.find(
                            (i) => i.product?.id === productId || (i.product as any)?._id === productId
                        );

                        if (existingItem) {
                            existingItem.qty = qty;
                            if (lensType) existingItem.lensType = lensType;
                            if (lensCoating) existingItem.lensCoating = lensCoating;
                            if (selectedPower) existingItem.selectedPower = selectedPower;
                        } else {
                            const finalPrice = product.discountPrice || product.price;
                            draft.data.items.push({
                                product,
                                qty,
                                priceAtAdd: finalPrice,
                                lensType,
                                lensCoating,
                                selectedPower
                            });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation<CartResponse, UpdateCartItemArgs>({
            query: ({ productId, qty }) => ({
                url: `/cart/item/${productId}`,
                method: 'PATCH',
                body: { qty },
            }),
            async onQueryStarted({ productId, qty }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        if (draft.data && draft.data.items) {
                            const item = draft.data.items.find(
                                (i) => i.product?.id === productId || (i.product as any)?._id === productId
                            );
                            if (item) {
                                item.qty = qty;
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation<CartResponse, string>({
            query: (productId) => ({
                url: `/cart/item/${productId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        if (draft.data && draft.data.items) {
                            draft.data.items = draft.data.items.filter(
                                (i) => i.product?.id !== productId && (i.product as any)?._id !== productId
                            );
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation<CartResponse, void>({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        if (draft.data) {
                            draft.data.items = [];
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApi;
