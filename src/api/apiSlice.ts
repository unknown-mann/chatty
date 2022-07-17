import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserType, CommentType, UserMeType } from '../app/types'

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
        }),
        fetchCurrentUser: builder.query<UserMeType, void>({
            query: () => ({
                url: 'https://chatty-back.herokuapp.com/user/me',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
        })
    })
})

export const { useFetchUsersQuery, useFetchCommentsQuery, useFetchCurrentUserQuery } = apiSlice