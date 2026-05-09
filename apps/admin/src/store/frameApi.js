import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const frameApi = createApi({
  reducerPath: 'frameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Frame'],
  endpoints: (builder) => ({
    getFrames: builder.query({
      query: () => '/frames',
      providesTags: ['Frame'],
    }),
    createFrame: builder.mutation({
      query: (body) => ({
        url: '/frames',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Frame'],
    }),
    updateFrame: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/frames/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Frame'],
    }),
    deleteFrame: builder.mutation({
      query: (id) => ({
        url: `/frames/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Frame'],
    }),
  }),
});

export const { useGetFramesQuery, useCreateFrameMutation, useUpdateFrameMutation, useDeleteFrameMutation } = frameApi;
