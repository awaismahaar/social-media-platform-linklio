import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const UserComments = ({ comment, user }) => {
    const [countLikes, setCountLikes] = useState(comment.likes.length);
    const [countDislikes, setCountDislikes] = useState(comment.dislikes.length);
    const [isCommentLiked, setIsCommentLiked] = useState(comment.likes.includes(user?._id));
    const [isCommentDisliked, setIsCommentDisliked] = useState(comment.dislikes.includes(user?._id));

    const handleLikeComment = async (commentId) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/like-comment/${commentId}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                     "Authorization" : `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                setIsCommentLiked(!isCommentLiked);
                setCountLikes(isCommentLiked ? countLikes - 1 : countLikes + 1);
                toast.success(res.data.message);
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
    const handleDislikeComment = async (commentId) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/dislike-comment/${commentId}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                     "Authorization" : `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                setIsCommentDisliked(!isCommentDisliked);
                setCountDislikes(isCommentDisliked ? countDislikes - 1 : countDislikes + 1);

                toast.success(res.data.message);
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="flex gap-3">
            <img
                src={comment.user.avatar.url}
                alt={comment.user.fullName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {comment.user.fullName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            @{comment.user.username}
                        </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.content}
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span> {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center gap-1 hover:text-blue-500 transition-colors ${isCommentLiked ? 'text-blue-500' : ''
                            }`}
                    >
                        <ThumbsUp size={12} fill={isCommentLiked ? 'currentColor' : 'none'} />
                        {countLikes > 0 && <span>{countLikes}</span>}
                    </button>
                    <button
                        onClick={() => handleDislikeComment(comment._id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${isCommentDisliked ? 'text-red-500' : ''
                            }`}
                    >
                        <ThumbsDown size={12} fill={isCommentDisliked ? 'currentColor' : 'none'} />
                        {countDislikes > 0 && <span>{countDislikes}</span>}
                    </button>


                </div>
            </div>
        </div>
    )
}

export default UserComments