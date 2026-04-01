import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

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
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getBanners: builder.query<{ success: boolean; data: Banner[] }, void>({
            query: () => '/banners',
            providesTags: ['Banner'],
            transformResponse: (response: { success: boolean; message: string; data: Record<string, unknown>[] }) => {
                return {
                    success: response.success,
                    data: response.data.map(b => ({ ...b, id: b._id as string }) as unknown as Banner)
                };
            }
        }),
        createBanner: builder.mutation<{ success: boolean; data: Banner }, FormData>({
            query: (formData) => ({
                url: '/banners',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Banner'],
        }),
        updateBanner: builder.mutation<{ success: boolean; data: Banner }, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/banners/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Banner'],
        }),
        deleteBanner: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannerApi;
