'use client';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import { authApi } from './authApi';
import { bannerApi } from './bannerApi';
import { categoryApi } from './categoryApi';
import { productApi } from './productApi';
import { wishlistApi } from './wishlistApi';
import { cartApi } from './cartApi';
import { orderApi } from './orderApi';
import { reviewApi } from './reviewApi';
import { frameApi } from './frameApi';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [wishlistApi.reducerPath]: wishlistApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [frameApi.reducerPath]: frameApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, bannerApi.middleware, categoryApi.middleware, productApi.middleware, wishlistApi.middleware, cartApi.middleware, orderApi.middleware, reviewApi.middleware, frameApi.middleware),
});
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
