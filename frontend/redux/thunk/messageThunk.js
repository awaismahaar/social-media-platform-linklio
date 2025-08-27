const { createAsyncThunk } = require("@reduxjs/toolkit")
const { default: axios } = require("axios")

export const sendMessage = createAsyncThunk(
    'message/sendMessage',
    async ({ receiverId, message }, { rejectWithValue }) => {
       console.log(receiverId, message)
            try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/send-message/${receiverId}`, {
                message
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                return res.data.message;
            }
            else {
                return rejectWithValue(res.data.message);
            }
        }
        catch (error) {
            return rejectWithValue(error?.message);
        }
    },
)
export const getMessages = createAsyncThunk(
    'message/getMessages',
    async ({ receiverId}, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/get-messages/${receiverId}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                return res.data.messages;
            }
        }
        catch (error) {
            return rejectWithValue(error?.message);
        }
    },
)