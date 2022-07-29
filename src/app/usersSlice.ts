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
        friends: [],
        online: false
    },
    rooms: [],
    usersBySearch: [],
    friends: []
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentChat(state, action) {
            state.activeChat = action.payload
        },
        removeCurrentChat(state) {
            state.activeChat = initialState.activeChat
        },
        setMessages(state, action) {
            state.messages = state.messages.concat(action.payload)
        },
        removeMessages(state) {
            state.messages = []
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
        },
        removeRoom(state, action) {
            state.rooms = state.rooms.filter(room => room.id !== action.payload)
        },
        setUsersBySearch(state, action) {
            state.usersBySearch = action.payload
        },
        setOnline(state, action) {
            const user = state.usersBySearch.find(user => user.id === action.payload.id)
            if (user) {
                user.online = true
            }
            const friend = state.friends.find(friend => friend.id === action.payload.id)
            if (friend) {
                friend.online = true
            }
            const rooms = state.rooms
            rooms.forEach(room => room.users.forEach(user => {
                if (user.id === action.payload.id) {
                    user.online = true
                }
            }))
        },
        setOffline(state, action) {
            const user = state.usersBySearch.find(user => user.id === action.payload.id)
            if (user) {
                user.online = false
            }
            const friend = state.friends.find(friend => friend.id === action.payload.id)
            if (friend) {
                friend.online = false
            }
            const rooms = state.rooms
            rooms.forEach(room => room.users.forEach(user => {
                if (user.id === action.payload.id) {
                    user.online = false
                }
            }))
        },
        setFriends(state, action) {
            state.friends = action.payload
        }
    }
})

export default userSlice.reducer

export const { setCurrentChat, setMessages, removeMessages, setCurrentUser, setRoom, setRooms, setUsersBySearch, setOnline, setOffline, setFriends, removeRoom, removeCurrentChat } = userSlice.actions