import { createSlice } from "@reduxjs/toolkit";
import { StateType } from "./types";

const initialState: StateType = {
    activeChat: {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        googleImgUrl: 'https://www.meme-arsenal.com/memes/b6a18f0ffd345b22cd219ef0e73ea5fe.jpg',
        friendIds: [],
        roles: []
    }
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setActiveChat(state, action) {
            state.activeChat = action.payload
        }
    }
})

export default userSlice.reducer

export const { setActiveChat } = userSlice.actions