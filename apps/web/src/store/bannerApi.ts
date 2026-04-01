import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Banner {
    id: string; // Mapped from _id
    _id?: string;
    title: string;
    description: string;
    label?: string;
    buttonLink?: string;
    image: string;
    status: 'Active' | 'Inactive' | 'Scheduled';
    placement: string;
    clicks: number;
    expiry?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const bannerApi = createApi({
    reducerPath: 'bannerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getBanners: builder.query<{ success: boolean; data: Banner[] }, { status?: string; placement?: string }>({
            query: (params) => ({
                url: '/banners',
                params,
            }),
            providesTags: ['Banner'],
            transformResponse: (response: { success: boolean; data: any[] }) => {
                return {
                    success: response.success,
                    data: response.data.map(b => ({ ...b, id: b._id }))
                };
            }
        }),
    }),
});

export const {
    useGetBannersQuery,
} = bannerApi;
