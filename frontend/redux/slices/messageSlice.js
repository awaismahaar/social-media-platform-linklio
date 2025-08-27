"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getMessages, sendMessage } from "../thunk/messageThunk";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        loading: false,
        messages: [],
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.messages.push(action.payload);
            state.loading = false;
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            console.error("Failed to send message:", action.payload);
            state.loading = false;
        });
        builder.addCase(getMessages.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
            state.loading = false;
        });
        builder.addCase(getMessages.rejected, (state, action) => {
            console.error("Failed to get messages:", action.payload);
            state.loading = false;
        });
    }
})

export const { setMessages } = messageSlice.actions;
export default messageSlice.reducer;