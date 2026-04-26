import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const subscriberApi = createApi({
    reducerPath: 'subscriberApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1/subscribers',
        prepareHeaders: (headers) => {
            // We assume token is handled by cookie or existing mechanism since other APIs do it this way
            return headers;
        }
    }),
    tagTypes: ['Subscriber'],
    endpoints: (builder) => ({
        getSubscribers: builder.query({
            query: () => '/',
            providesTags: ['Subscriber'],
        }),
        sendNewsletter: builder.mutation({
            query: (body) => ({
                url: '/send',
                method: 'POST',
                body,
            }),
        }),
    }),
});
export const { useGetSubscribersQuery, useSendNewsletterMutation, } = subscriberApi;
