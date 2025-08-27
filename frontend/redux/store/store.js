import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../slices/userSlice"
import messageReducer from "../slices/messageSlice"
import socketReducer from "../slices/socketSlice"
export const store = configureStore({
    reducer: {
        user: userReducer,
        message: messageReducer,
        socket: socketReducer,
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['socketReducer.socket']
            }
        })
    )
});