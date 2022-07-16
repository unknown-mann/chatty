import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        return response.data
    }
)

export const fetchComments = createAsyncThunk(
    'users/fetchComments',
    async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments?_limit=15')
        return response.data
    }
)

type UserType = {
    id: number,
    name: string
    body: string
}

type CommentType = {
    id: number,
    name: string,
    body: string
    email: string
}

type StateType = {
    users: UserType[],
    comments: CommentType[]
    activeChat: UserType
}

const initialState: StateType = {
    users: [],
    comments: [],
    activeChat: {
        id: 0,
        name: 'Name Surname',
        body: ''
    }
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setActiveChat(state, action) {
            state.activeChat = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload
            })
    },
})

export const { setActiveChat } = userSlice.actions

export default userSlice.reducer