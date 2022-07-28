import { createSlice } from "@reduxjs/toolkit";
import { StateType } from "../types";

const initialState: StateType = {
    activeChat: {
        id: 0,
        users: [],
        isMultiChat: false,
        unread: 0
    },
    messages: [],
    currentUser: {
        id: 0,
        email: '',
        firstname: '',
        lastname: '',
        googleImgUrl: 'https://www.meme-arsenal.com/memes/b6a18f0ffd345b22cd219ef0e73ea5fe.jpg',
        friends: []
    },
    rooms: []
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
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setRoom(state, action) {
            const index = state.rooms.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms.splice(index, 1)
            }
            state.rooms.unshift(action.payload)
        },
        setRooms(state, action) {
            state.rooms = action.payload
        }
    }
})

export default userSlice.reducer

export const { setCurrentChat, setMessages, setCurrentUser, setRoom, setRooms } = userSlice.actions