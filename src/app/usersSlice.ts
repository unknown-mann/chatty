import { createSlice } from "@reduxjs/toolkit";
import { StateType } from "./types";

const initialState: StateType = {
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
    }
})

export default userSlice.reducer

export const { setActiveChat } = userSlice.actions