import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export interface RecentOrder {
    id: string;
    customer: string;
    amount: number;
    status: string;
    time: string;
}

export interface DashboardMetrics {
    totalRevenue: number;
    growth: number;
    activeOrders: number;
    newCustomers: number;
    customerGrowth: number;
    monthlyRevenue: number[];
    monthLabels: string[];
    recentOrders: RecentOrder[];
}

interface DashboardMetricsResponse {
    success: boolean;
    message: string;
    data: DashboardMetrics;
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
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
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getDashboardMetrics: builder.query<DashboardMetricsResponse, void>({
            query: () => '/dashboard/metrics',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetDashboardMetricsQuery } = dashboardApi;
