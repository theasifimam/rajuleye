import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const frameApi = createApi({
  reducerPath: 'frameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  endpoints: (builder) => ({
    getFrames: builder.query({
      query: () => '/frames',
    }),
  }),
});

export const { useGetFramesQuery } = frameApi;
