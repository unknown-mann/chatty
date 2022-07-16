import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserType, CommentType } from '../app/types'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
    endpoints: builder => ({
        fetchUsers: builder.query<UserType[], void>({
            query: () => ({
                url: '/users'
            }) 
        }),
        fetchComments: builder.query<CommentType[], void>({
            query: () => ({
                url: '/comments?_limit=15'
            })
        })
    })
})

export const { useFetchUsersQuery, useFetchCommentsQuery } = apiSlice