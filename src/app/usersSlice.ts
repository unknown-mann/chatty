import { createSlice } from "@reduxjs/toolkit";
import { StateType } from "../types";

const initialState: StateType = {
    activeChat: {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        googleImgUrl: 'https://www.meme-arsenal.com/memes/b6a18f0ffd345b22cd219ef0e73ea5fe.jpg'
    },
    messages: []
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentChat(state, action) {
            state.activeChat = action.payload
        },
        setMessages(state, action) {
            state.messages = state.messages.concat(action.payload)
        }
    }
})

export default userSlice.reducer

export const { setCurrentChat, setMessages } = userSlice.actions