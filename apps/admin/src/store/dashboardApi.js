import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
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
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getDashboardMetrics: builder.query({
            query: () => '/dashboard/metrics',
            providesTags: ['Dashboard'],
        }),
    }),
});
export const { useGetDashboardMetricsQuery } = dashboardApi;
