"use client";
import { createSlice } from "@reduxjs/toolkit";


const user = typeof window !== 'undefined' && (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
const userSlice = createSlice({
    name: "user",
    initialState: {
        user,
        postUpload : null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        removeUser: (state) => {
            state.user = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem("user");
            }
        },
        setPostUpload: (state, action) => {
            state.postUpload = action.payload;
        }
    }
})

export const { setUser, removeUser , setPostUpload } = userSlice.actions;
export default userSlice.reducer;