import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import { authApi } from './authApi';
import { categoryApi } from './categoryApi';
import { productApi } from './productApi';
import { userApi } from './userApi';
import { bannerApi } from './bannerApi';
import { orderApi } from './orderApi';
import { dashboardApi } from './dashboardApi';
import { subscriberApi } from './subscriberApi';
import { settingApi } from './settingApi';
import { frameApi } from './frameApi';
import { notificationApi } from './notificationApi';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [subscriberApi.reducerPath]: subscriberApi.reducer,
        [settingApi.reducerPath]: settingApi.reducer,
        [frameApi.reducerPath]: frameApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, categoryApi.middleware, productApi.middleware, userApi.middleware, bannerApi.middleware, orderApi.middleware, dashboardApi.middleware, subscriberApi.middleware, settingApi.middleware, frameApi.middleware, notificationApi.middleware),
});
setupListeners(store.dispatch);
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
