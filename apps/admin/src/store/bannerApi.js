import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const bannerApi = createApi({
    reducerPath: 'bannerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: () => '/banners',
            providesTags: ['Banner'],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: response.data.map(b => ({ ...b, id: b._id }))
                };
            }
        }),
        createBanner: builder.mutation({
            query: (formData) => ({
                url: '/banners',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Banner'],
        }),
        updateBanner: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/banners/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Banner'],
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/banners/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'],
        }),
    }),
});
export const { useGetBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation, } = bannerApi;
