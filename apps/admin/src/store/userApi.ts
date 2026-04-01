import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
    role: 'admin' | "moderator" | 'user';
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: Date | string;
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    isEmailVerified?: boolean;
}

interface UsersResponse {
    success: boolean;
    message: string;
    data: User[];
}

interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/users' }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query<UsersResponse, void>({
            query: () => '/',
            providesTags: ['User'],
        }),
        getUserById: builder.query<UserResponse, string>({
            query: (id) => `/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'User', id }],
        }),
        createUser: builder.mutation<UserResponse, Partial<User>>({
            query: (body) => ({
                url: '/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<UserResponse, { id: string; body: Partial<User> }>({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => ['User', { type: 'User', id }],
        }),
        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;
