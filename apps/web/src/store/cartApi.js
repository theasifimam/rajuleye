import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ product, ...rest }) => ({
                url: '/cart/add',
                method: 'POST',
                body: { productId: product.id || product._id, ...rest },
            }),
            async onQueryStarted({ product, qty = 1, lensType, lensCoating, selectedPower }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                    if (!draft.data)
                        draft.data = { _id: '', user: '', items: [] };
                    if (!draft.data.items)
                        draft.data.items = [];
                    const productId = product.id || product._id;
                    const existingItem = draft.data.items.find((i) => i.product?.id === productId || i.product?._id === productId);
                    if (existingItem) {
                        existingItem.qty = qty;
                        if (lensType)
                            existingItem.lensType = lensType;
                        if (lensCoating)
                            existingItem.lensCoating = lensCoating;
                        if (selectedPower)
                            existingItem.selectedPower = selectedPower;
                    }
                    else {
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
                }));
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ productId, qty }) => ({
                url: `/cart/item/${productId}`,
                method: 'PATCH',
                body: { qty },
            }),
            async onQueryStarted({ productId, qty }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                    if (draft.data && draft.data.items) {
                        const item = draft.data.items.find((i) => i.product?.id === productId || i.product?._id === productId);
                        if (item) {
                            item.qty = qty;
                        }
                    }
                }));
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/item/${productId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                    if (draft.data && draft.data.items) {
                        draft.data.items = draft.data.items.filter((i) => i.product?.id !== productId && i.product?._id !== productId);
                    }
                }));
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                    if (draft.data) {
                        draft.data.items = [];
                    }
                }));
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
    }),
});
export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation, } = cartApi;
