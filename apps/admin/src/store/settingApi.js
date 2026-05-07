import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const settingApi = createApi({
    reducerPath: 'settingApi',
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
    tagTypes: ['Setting'],
    endpoints: (builder) => ({
        getSetting: builder.query({
            query: () => '/settings',
            providesTags: ['Setting'],
            transformResponse: (response) => {
                return {
                    success: response.success,
                    data: response.data
                };
            }
        }),
        updateSetting: builder.mutation({
            query: (formData) => ({
                url: `/settings`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Setting'],
        }),
    }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;
