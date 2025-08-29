"use client";
import React, { useEffect, useState } from 'react'
import { Camera, MessageCircle, UserPlus, Edit, VerifiedIcon } from 'lucide-react';
import UserPosts from './UserPosts';
import ImageModal from './ImageModal';
import PostCommentModal from '../others/PostCommentModal';
import { useDispatch, useSelector } from 'react-redux';
import { EditProfileModal } from '@/app/profile/_components/EditProfileModal';
import axios from 'axios';
import { setUser } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';
import { EditAvatarPicture } from '@/app/profile/_components/EditAvatarPicture';
import { Reuleaux } from 'ldrs/react'
import 'ldrs/react/Reuleaux.css'
import useAllUserPosts from '@/hooks/useAllUserPosts';
const UserProfile = ({ id }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const [changeUserPosts, setChangeUserPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const { allUserPosts, loading: postsLoading } = useAllUserPosts(changeUserPosts, id);
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState(allUserPosts || []);
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const [updateUser, setUpdateUser] = useState({
    fullName: user.fullName,
    username: user.username,
    bio: user.bio,
  });
  useEffect(() => {
    setUserPosts(allUserPosts);
  }, [allUserPosts, changeUserPosts])



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
    setChangeUserPosts(true);
  };
  useEffect(() => {
    if (!avatarModalOpen) {
      setAvatarFile(null);
    }
  }, [avatarModalOpen]);

  async function handleUpdateUser() {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`, updateUser, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
        }
      });
      if (res.data.success) {
        setUpdateUser({
          fullName: res.data.user.fullName,
          username: res.data.user.username,
          bio: res.data.user.bio,
        });
        dispatch(setUser(res.data.user));
        setOpen(false);
        toast.success(res.data.message);
      }
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }
  async function handleUpdatePicture() {
    if (!avatarFile) {
      toast.error("Please select an image file to upload.");
      return;
    }
    let formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      setLoading(true);
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${user?.avatar?.publicId ? "update-avatar" : "upload-avatar"}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
        }
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setAvatarModalOpen(false);
        toast.success(res.data.message);
      }
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
      setAvatarFile(null);
    }
  }

  useEffect(() => {
    async function getUserProfileById() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get-profile-by-id/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
          }
        });
        if (res.data.success) {
          setUserProfile(res.data.user);
        }
      }
      catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
      finally {
        setIsLoading(false);
      }
    }
    getUserProfileById();
  }, [id]);


  // If no user is found, show loading state
  if (isLoading || postsLoading) {
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
    <div className='p-6'>
      <div className="p-4 dark:bg-gray-800 rounded-2xl  mb-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div onClick={() => userProfile?._id === user?._id && setAvatarModalOpen(true)} className="relative group">
            <div onClick={() => userProfile?._id !== user?._id && handleImageClick(userProfile?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png")} className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 transition-all duration-300 group-hover:border-blue-500">
              <img
                src={userProfile?._id === user?._id ? user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png" : userProfile?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={`${userProfile?._id === user?._id ? user.fullName : userProfile?.fullName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            {userProfile?._id === user?._id && <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110">
              <Camera size={20} />
            </button>}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {userProfile?._id === user?._id ? user.fullName : userProfile?.fullName}
                </h1>
                {(userProfile?._id === user?._id ? user.isVerified : userProfile?.isVerified) && <VerifiedIcon className="text-blue-500 w-6 h-6" />}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">@{userProfile?._id === user?._id ? user.username : userProfile?.username}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{userPosts.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
              </div>


            </div>

            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {userProfile?._id === user?._id ? user.bio : userProfile?.bio}
            </p>

            {/* Action Buttons */}
            {user._id === id &&
              <div className="flex justify-center md:justify-start">
                <button onClick={() => setOpen(true)} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                  <Edit size={20} />
                  Edit Profile
                </button>
              </div>
              }
          </div>
        </div>
      </div>
      <hr className='my-6' />
      <div>
        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {userPosts.length} posts
            </div>
          </div>

          <div className="grid gap-6">
            {userPosts.length > 0 ? userPosts?.map((post) => (
              <UserPosts
                key={post._id}
                post={post}
                setChangePosts={setChangeUserPosts}
                onImageClick={handleImageClick}
                onCommentClick={handleCommentClick}
              />
            )) :
              <p className='text-black dark:text-white text-center py-4'>No posts available</p>
            }
          </div>
        </div>
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
      {/* Edit Profile Modal */}
      <EditProfileModal
        open={open}
        setOpen={setOpen}
        user={user}
        updateUser={updateUser}
        setUpdateUser={setUpdateUser}
        handleUpdateUser={handleUpdateUser}
      />
      {/*Avatar Picture Modal */}
      <EditAvatarPicture
        open={avatarModalOpen}
        setOpen={setAvatarModalOpen}
        avatarFile={avatarFile}
        setAvatarFile={setAvatarFile}
        user={user}
        handleUpdatePicture={handleUpdatePicture}
        loading={loading}
      />
    </div>
  )
}

export default UserProfile