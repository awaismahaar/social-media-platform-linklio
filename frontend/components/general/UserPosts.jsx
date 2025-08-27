"use client";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Verified, Link, UserPen, Trash } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserPosts = ({ post, onImageClick, onCommentClick, setChangePosts }) => {
    // console.log(post);
    const pathname = usePathname();
    const router = useRouter();
    const user = useSelector((state) => state.user.user);
    const [isLiked, setIsLiked] = useState(post.likes.map(like => like._id).includes(user?._id));
    const [isSaved, setIsSaved] = useState(post?.isSaved);
    const [likes, setLikes] = useState(post.likes.length);
    const [likesLoading, setLikesLoading] = useState(false);

    const handleLike = () => {
        handleLikePost();
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };
    const handleCommentClick = () => {
        onCommentClick(post);
    };

    const getImageLayout = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-2';
        return 'grid-cols-2 md:grid-cols-3';
    };

    async function handleLikePost() {
        try {
            setLikesLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/like-post/${post?._id}`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                setIsLiked(!isLiked);
                setLikes(prev => isLiked ? prev - 1 : prev + 1);
                //  toast.success(res.data.message);

            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally {
            setLikesLoading(false);
        }
    }
    async function handleDeletePost() {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/delete-post/${post?._id}`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            });
            if (res.data.success) {
                setChangePosts(true);
                toast.success(res.data.message);
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }

    }

    return (
        <>
            <div className={`bg-white my-6 w-full ${pathname === "/" ? "max-w-3xl" : "max-w-4xl m-auto"} dark:bg-gray-800 rounded-2xl inset-shadow-2xs overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                {/* Post Header */}
                <div className="p-6 pb-4">

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 w-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={post?.author?.avatar?.url} />
                                <AvatarFallback>{post?.author?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    <MoreHorizontal size={20} />

                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>


                                <DropdownMenuItem onClick={() => {
                                    router.push(`/profile/${post?.author?._id}`)
                                }}><UserPen className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>

                                <DropdownMenuItem onClick={handleCommentClick}> <MessageCircle className="mr-2 h-4 w-4" /> Comments</DropdownMenuItem>
                                {
                                    user?._id === post?.author?._id && (
                                        <DropdownMenuItem onClick={handleDeletePost}> <Trash className="mr-2 h-4 w-4" /> Delete Post</DropdownMenuItem>
                                    )
                                }

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                        {post.content}
                    </p>
                </div>

                {/* Images */}
                {post.media.length > 0 && (
                    <div
                        className={`grid ${getImageLayout(post.media.length)} place-items-center px-4 gap-2 sm:gap-3`}
                    >
                        {post.media.map((image, index) => (
                            <div
                                key={index}
                                className="
          relative 
          w-full 
          h-48 sm:h-64 md:h-80 lg:h-[400px] 
          cursor-pointer 
          group 
          overflow-hidden
        "
                                onClick={() => onImageClick(image)}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="
            w-full h-full 
            object-cover 
            rounded-lg 
            border border-gray-500
            transition-transform 
            duration-300 
            group-hover:scale-105
          "
                                />
                                <div className="absolute inset-0 w-full h-full rounded-lg bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-10" />
                            </div>
                        ))}
                    </div>
                )}


                {/* Post Actions */}
                <div className="p-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                disabled={likesLoading}
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition-all duration-300 hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <p className="text-sm font-medium">Likes</p>
                                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />

                                <span className="text-sm font-medium">{likes}</span>
                            </button>

                            <button onClick={handleCommentClick} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110">
                                <p className="text-sm font-medium">Comments</p>
                                <MessageCircle size={20} />
                                <span className="text-sm font-medium">{post?.comments?.length}</span>
                            </button>

                            {/* <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all duration-300 hover:scale-110">
                                <p className="text-sm font-medium">Share</p>
                                <Share size={20} />

                            </button> */}
                        </div>

                        {/* <button
                            onClick={handleSave}
                            className={`transition-all flex items-center gap-1 duration-300 hover:scale-110 ${isSaved ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                                }`}
                        >
                            <p className="text-sm font-medium">Save</p>
                            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserPosts