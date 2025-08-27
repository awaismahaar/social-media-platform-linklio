"use client";
import React, { useEffect, useState } from 'react';
import {
    Users,
    UserPlus,
    ChevronRight,
    MoreVertical,
    Crown,
    Circle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAllUser from '@/hooks/useAllUsers';
import Link from 'next/link';
import { useSelector } from 'react-redux';



const UserRightSidebar = () => {
    const [expandedSection, setExpandedSection] = useState(null);
    const onlineUsers = useSelector((state) => state.socket.onlineUsers);
    const { allUser, loading } = useAllUser();
    const [showAllUsers, setShowAllUsers] = useState(allUser || []);
    console.log("showAllUsers", showAllUsers);
    const router = useRouter();

    useEffect(() => {
        setShowAllUsers(allUser);
    }, [allUser]);

    // Mock data for friends
    const friends = [
        { id: '1', name: 'Alex Johnson', username: 'alexj', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isOnline: true, isPremium: true, mutualFriends: 12, lastSeen: 'now' },
        { id: '6', name: 'Jessica Park', username: 'jesspark', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isOnline: true, mutualFriends: 8, lastSeen: 'now' },
        { id: '7', name: 'Robert Wilson', username: 'robw', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isOnline: false, mutualFriends: 5, lastSeen: '2h ago' },
        { id: '8', name: 'Lisa Garcia', username: 'lisag', avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isOnline: true, mutualFriends: 15, lastSeen: 'now' },
    ];

    const handleNavigateToUsers = () => {
        router.push('/users');
    };

    const handleNavigateToFriends = () => {
        router.push('/friends');
    };
    const UserCard = ({
        user,
        showMutualFriends = false,
        mutualFriends = 0
    }) => (
        <Link href={`/profile/${user._id}`}>
            <div className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer">
                <div className="relative">
                    <img
                        src={user.avatar.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-gray-400'
                        }`} />

                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.fullName}
                        </h4>
                        <Circle className={`w-1.5 h-1.5 ${onlineUsers.includes(user._id) ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{user.username}
                    </p>
                    {showMutualFriends && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            {mutualFriends} mutual friends
                        </p>
                    )}
                </div>


            </div>
        </Link>
    );


    return (
        <div>
            <div className="fixed pr-6 right-0 top-[72px] h-[calc(100vh - 72px)] w-full max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-800 hidden lg:flex flex-col max-xl:hidden">


                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* All Users Section */}
                    <div className="flex-1 max-h-104 overflow-y-auto">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Users
                                    </h3>
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                        {showAllUsers.length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleNavigateToUsers}
                                    className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    <span>View All</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                {showAllUsers.map((user) => (
                                    <UserCard key={user._id} user={user} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Friends Section */}
                    {/* <div className="flex-1 max-h-76 overflow-y-auto border-t border-gray-200 dark:border-gray-800">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Friends
                                </h3>
                                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                                    {friends.length}
                                </span>
                            </div>
                            <button
                                onClick={handleNavigateToFriends}
                                className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                            >
                                <span>View All</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            {friends.slice(0, 4).map((friend) => (
                                <UserCard
                                    key={friend.id}
                                    user={friend}
                                    showMutualFriends={true}
                                    mutualFriends={friend.mutualFriends}
                                />
                            ))}
                        </div>
                    </div>
                </div> */}
                </div>

                {/* Footer */}
                {/* <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{allUsers.filter(u => u.isOnline).length} online</span>
                    <span>{friends.length} friends</span>
                </div>
            </div> */}
            </div>
        </div>

    )
}

export default UserRightSidebar