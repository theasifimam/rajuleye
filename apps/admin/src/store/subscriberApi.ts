import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Subscriber {
    _id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

interface SubscribersResponse {
    success: boolean;
    message: string;
    data: Subscriber[];
}

interface SendNewsletterRequest {
    subject: string;
    message: string;
}

interface SendNewsletterResponse {
    success: boolean;
    message: string;
    data: {
        totalSent: number;
    };
}

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
        getSubscribers: builder.query<SubscribersResponse, void>({
            query: () => '/',
            providesTags: ['Subscriber'],
        }),
        sendNewsletter: builder.mutation<SendNewsletterResponse, SendNewsletterRequest>({
            query: (body) => ({
                url: '/send',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetSubscribersQuery,
    useSendNewsletterMutation,
} = subscriberApi;
