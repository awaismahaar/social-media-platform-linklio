import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String, required: true },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    },
    {
        timestamps: true,
    }
);

export const Comment = model("Comment", commentSchema);