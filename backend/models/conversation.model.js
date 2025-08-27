import { Schema, model } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
    }],
});

export const Conversation = model("Conversation", conversationSchema);