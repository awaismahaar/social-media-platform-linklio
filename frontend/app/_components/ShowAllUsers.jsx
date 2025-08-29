"use client";
import React, { useEffect, useState } from 'react';
import {
    User,
    CheckCircle,
    Calendar,
    Users,
    MapPin,
    Link as LinkIcon,
    MessageCircle,
    UserPlus,
    MoreHorizontal,
    Sun,
    Moon,
    UserPen
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAllUser from '@/hooks/useAllUsers';
import { Reuleaux } from 'ldrs/react'
import 'ldrs/react/Reuleaux.css'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const mockUsers = [
    {
        id: 1,
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "UX Designer & Creative Director. Building beautiful digital experiences that matter. 🎨✨",
        isVerified: true,
        isOnline: true,
        followers: 12500,
        following: 892,
        joinDate: "March 2020",
        location: "San Francisco, CA",
        website: "sarahchen.design",
        isFollowing: false
    },
    {
        id: 2,
        name: "Alex Rodriguez",
        username: "alexdev",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "Full-stack developer | Open source enthusiast | Coffee addict ☕ Building the future one line of code at a time.",
        isVerified: true,
        isOnline: false,
        followers: 8900,
        following: 567,
        joinDate: "January 2019",
        location: "Austin, TX",
        website: "alexdev.io",
        isFollowing: true
    },
    {
        id: 3,
        name: "Maya Patel",
        username: "mayacreates",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "Digital artist & illustrator. Creating magic through pixels and paint. 🎭🖌️",
        isVerified: false,
        isOnline: true,
        followers: 3400,
        following: 1200,
        joinDate: "August 2021",
        location: "Mumbai, India",
        isFollowing: false
    },
    {
        id: 4,
        name: "David Kim",
        username: "davidkim_photo",
        avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "Professional photographer capturing life's beautiful moments. Available for shoots worldwide 📸🌍",
        isVerified: true,
        isOnline: true,
        followers: 25600,
        following: 445,
        joinDate: "June 2018",
        location: "Seoul, South Korea",
        website: "davidkimphotography.com",
        isFollowing: false
    },
    {
        id: 5,
        name: "Emma Thompson",
        username: "emmawrites",
        avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "Writer & Content Creator. Storytelling through words and experiences. 📚✍️ Currently working on my debut novel.",
        isVerified: false,
        isOnline: false,
        followers: 5200,
        following: 890,
        joinDate: "November 2020",
        location: "London, UK",
        website: "emmathompsonwrites.com",
        isFollowing: true
    },
    {
        id: 6,
        name: "Carlos Martinez",
        username: "carlosfit",
        avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        bio: "Fitness coach & nutritionist. Helping people transform their lives through health and wellness 💪🥗",
        isVerified: true,
        isOnline: true,
        followers: 18900,
        following: 324,
        joinDate: "April 2019",
        location: "Miami, FL",
        website: "carlosfitness.com",
        isFollowing: false
    }
];
const ShowAllUsers = () => {
    const { allUser, loading } = useAllUser();
    const onlineUsers = useSelector((state) => state.socket.onlineUsers);
    const [showAllUsers, setShowAllUsers] = useState(allUser)
    useEffect(() => {
        setShowAllUsers(allUser);
    }, [allUser]);

    // If no users are found, show loading state
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

    function UserCard({ user }) {
        const router = useRouter();
        const [isFollowing, setIsFollowing] = useState(user?.isFollowing);

        const formatNumber = (num) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        };

        const handleFollowToggle = () => {
            setIsFollowing(!isFollowing);
        };

        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:-translate-y-1">
                {/* Header with avatar and online status */}
                <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                        <img
                            src={user.avatar.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={user.fullName}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                        />
                        {user?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800"></div>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>


                            <DropdownMenuItem onClick={() => {
                                router.push(`/profile/${user?._id}`)
                            }}><UserPen className="mr-2 h-4 w-4" />User Profile</DropdownMenuItem>
                            

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Name and verification */}
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{user.fullName}</h3>
                        {user.isVerified && (
                            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</p>
                </div>

                {/* Bio */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                    {user.bio}
                </p>

                {/* Stats */}
                <div className="flex justify-between mb-4 text-sm">
                    {/* <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">{formatNumber(user?.followers || 0)}</p>
                        <p className="text-gray-500 dark:text-gray-400">Posts</p>
                    </div> */}
                    {/* <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">{formatNumber(user?.following || 0)}</p>
                        <p className="text-gray-500 dark:text-gray-400">Friends</p>
                    </div> */}
                    <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</p>
                        <p className="text-gray-500 dark:text-gray-400">Status</p>
                    </div>
                </div>

                {/* Additional info */}
                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

               
            </div>
        );
    }
    return (

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">


            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats header */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Discover Amazing People
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Connect with creators, developers, and innovators from around the world
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Users grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showAllUsers.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>

                {/* Load more button */}
                {/* <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl">
                        Load More Users
                    </button>
                </div> */}
            </div>
        </div>

    )
}


export default ShowAllUsers;