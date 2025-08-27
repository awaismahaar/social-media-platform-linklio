import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MoreHorizontal, Send, Verified, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserComments from "../general/UserComments";

const PostCommentModal = ({ isOpen, post, onClose }) => {
    const user = useSelector((state) => state.user.user);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        if (isOpen && post) {
            setComments(post?.comments);
            setCurrentImageIndex(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, post]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleAddComment = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/comment-post/${post?._id}`, { comment: newComment }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }

            });
            if (res.data.success) {
                toast.success(res.data.message);
                setNewComment('');
                setComments([...comments, res.data.comment]);
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    if (!isOpen || !post) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
                {/* Main Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] sm:max-h-[90vh] relative overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                        {/* Post Info */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 w-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={post?.author?.avatar?.url} />
                                        <AvatarFallback>
                                            {post?.author?.fullName.split(" ").map((word) => word[0])}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h1 className="font-medium text-md dark:text-white">{post?.author?.fullName}</h1>
                                            {post?.author?.isVerified && (
                                                <Verified className="text-blue-500 w-4 h-4" />
                                            )}
                                        </div>
                                        <h4 className="text-sm dark:text-gray-400">@{post?.author?.username}</h4>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Post Content */}
                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                {post.content}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 my-2">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </div>

                            {/* Image Carousel */}
                            {post.media.length > 0 && (
                                <div className="relative w-full">
                                    <img
                                        src={post.media[currentImageIndex]}
                                        alt={`Post image ${currentImageIndex + 1}`}
                                        className="w-full max-h-[220px] sm:max-h-[400px] object-contain rounded-lg transition-transform duration-500 ease-in-out"
                                    />
                                    {/* Arrows */}
                                    {post.media.length > 1 && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex(
                                                        currentImageIndex === 0
                                                            ? post.media.length - 1
                                                            : currentImageIndex - 1
                                                    )
                                                }
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex(
                                                        currentImageIndex === post.media.length - 1
                                                            ? 0
                                                            : currentImageIndex + 1
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                                            >
                                                →
                                            </button>
                                        </>
                                    )}
                                    {/* Dots */}
                                    {post.media.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                            {post.media.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                                                            ? "bg-blue-500 scale-110"
                                                            : "bg-gray-400 hover:bg-gray-600"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="space-y-4">
                            {comments?.length > 0 ? (
                                comments.map((comment) => (
                                    <UserComments key={comment._id} comment={comment} user={user} />
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                    No comments yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Add Comment */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0">
                        <div className="flex items-center gap-3">
                            <img
                                src={user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt="Your avatar"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a comment..."
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl px-4 py-3 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows={1}
                                    style={{ minHeight: "44px", maxHeight: "120px" }}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${newComment.trim()
                                            ? "bg-blue-500 hover:bg-blue-600 text-white hover:scale-110"
                                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PostCommentModal