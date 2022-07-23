import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserType } from '../types'
import { ACCESS_TOKEN } from '../constants'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://chatty-back.herokuapp.com' }),
    endpoints: builder => ({
        fetchCurrentUser: builder.query<UserType, void>({
            query: () => ({
                url: '/user/me',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
                }
            })
        }),
        fetchUserFriends: builder.query<UserType[], void>({
            query: () => ({
                url: '/user/me/friends',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
                }
            })
        }),
    })
})

export const { useFetchCurrentUserQuery, useFetchUserFriendsQuery } = apiSlice