"use client";
import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        socket: null,
        onlineUsers: [],
    },
    reducers: {
        initializeSocket: (state, action) => {
            state.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
                query: {
                    userId: action.payload,
                }
            });
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
                state.socket = null;
            }
        }
    }
})

export const { initializeSocket, setOnlineUsers, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;