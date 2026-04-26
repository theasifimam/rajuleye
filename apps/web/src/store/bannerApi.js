import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const bannerApi = createApi({
    reducerPath: 'bannerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
    }),
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: (params) => ({
                url: '/banners',
                params,
            }),
            providesTags: ['Banner'],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: response.data.map(b => ({ ...b, id: b._id }))
                };
            }
        }),
    }),
});
export const { useGetBannersQuery, } = bannerApi;
