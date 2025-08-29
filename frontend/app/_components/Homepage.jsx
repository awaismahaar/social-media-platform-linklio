"use client";
import React, { useEffect, useState } from 'react'
import useAllPosts from '@/hooks/useAllPosts'
import UserPosts from '@/components/general/UserPosts';
import { Reuleaux } from 'ldrs/react'
import 'ldrs/react/Reuleaux.css'
import ImageModal from '@/components/general/ImageModal';
import PostCommentModal from '@/components/others/PostCommentModal';
import { useSelector } from 'react-redux';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/src/components/lightswind/avatar';
import { Input } from '@/src/components/lightswind/input';
import { CreatePostDialog } from '@/components/others/CreatePostDialog';
import { OctagonX } from 'lucide-react';

const Homepage = () => {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const { user, postUpload } = useSelector((state) => state.user);
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedPost, setSelectedPost] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const [changePosts, setChangePosts] = useState(false);
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };
    const handleCommentClick = (post) => {
        setSelectedPost(post);
        setIsOpen(true);

    };
    const handleCloseCommentModal = () => {
        setIsOpen(false);
        setSelectedPost(null);
        setChangePosts(!changePosts);
    };
    const { allPosts, loading } = useAllPosts(changePosts, postUpload);
    const [showAllPosts, setShowAllPosts] = useState(allPosts || []);
    useEffect(() => {
        setShowAllPosts(allPosts);
    }, [allPosts, changePosts]);

    // If no user is found, show loading state
    if (loading) {
        return (
            // Default values shown
            <div className='flex flex-col items-center justify-center h-screen'>
                <Reuleaux
                    size="37"
                    stroke="5"
                    strokeLength="0.15"
                    bgOpacity="0.1"
                    speed="1.2"
                    color="blue"
                />
                <p className='text-black dark:text-white font-medium mt-1'>Loading...</p>
            </div>
        )
    }

    return (
        <div className='w-full'>
        <div className='max-lg:flex max-lg:w-full max-lg:items-center max-lg:justify-center'>
            <div className='bg-white max-lg:w-full max-w-3xl dark:bg-gray-800 shadow-md rounded-lg p-6 my-4'>
                <div className='flex w-full items-center justify-between gap-4'>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar?.url} />
                        <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
                    </Avatar>
                    <Input onFocus={() => setOpen(true)} text="text" placeholder="What's on your mind?" className="w-full bg-gray-200 dark:bg-gray-900 p-6 rounded-full" />
                </div>
            </div>
            </div>
            <div className="grid gap-6 max-lg:place-items-center">
                {showAllPosts.length > 0 ? showAllPosts?.map((post) => (
                    <UserPosts
                        key={post._id}
                        post={post}
                        setChangePosts={setChangePosts}
                        onImageClick={handleImageClick}
                        onCommentClick={handleCommentClick}
                    />
                )) :
                <div className='flex flex-col max-w-3xl w-full items-center py-6 h-screen gap-4'>
                    <OctagonX className='w-20 h-20 text-red-500' />
                      <p className='text-gray-700 dark:text-white text-lg lg:text-xl'>No posts available</p>
                </div>
                  
                }
            </div>
            {/* Image Modal */}
            <ImageModal
                image={selectedImage}
                onClose={handleCloseModal}
            />
            {/* Comment Modal */}
            <PostCommentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                post={selectedPost}
                onClose={handleCloseCommentModal}
            />
            <CreatePostDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Homepage