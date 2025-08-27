'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useAllUser from '../../../hooks/useAllUsers'
import { Ping } from 'ldrs/react'
import 'ldrs/react/Ping.css'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages } from '@/redux/thunk/messageThunk'

const MessagesSidebar = ({ selectedUser, setSelectedUser }) => {
    const { allUser, loading } = useAllUser();
    const { onlineUsers } = useSelector((state) => state.socket);
    const [searchInput, setSearchInput] = useState("");
    const dispatch = useDispatch();
    const [users, setUsers] = useState(allUser || []);
    useEffect(() => {
        if (allUser) {
            setUsers(allUser);
        }
    }, [allUser]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(getMessages({ receiverId: selectedUser?._id }));
        }
    }, [selectedUser]);

    useEffect(() => {
        if (searchInput.trim() !== "") {
            const filteredUsers = allUser.filter(user => user.fullName.toLowerCase().includes(searchInput.toLowerCase()) || user.username.toLowerCase().includes(searchInput.toLowerCase()));
            setUsers(filteredUsers)
        } else {
            setUsers(allUser || []);
        }
    }, [searchInput]);

    return (
        <div className='w-100 bg-white dark:bg-gray-900 h-[90vh] border-r overflow-y-hidden' >
            <div className='flex flex-col gap-4 p-4'>
                <div>
                    <p className='text-xl font-medium text-gray-500 dark:text-gray-400'>Messages</p>
                </div>

                <div className="relative w-full">
                    <Search className="w-4.5 h-4.5 absolute top-2.25 left-2" />
                    <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-8 w-[320px]" placeholder="Search chats..." />
                </div>
                <div className="flex flex-col max-h-124 overflow-y-auto gap-2 mt-2">
                    {loading && (
                        <div className='flex flex-col items-center justify-center h-screen'>
                            <Ping
                                size="45"
                                speed="2"
                                color="blue"
                            />
                            <p className='text-black dark:text-white font-medium mt-1'>Loading...</p>
                        </div>
                    )
                    }

                    {!loading && users.map((user, index) => {

                        return <div key={index} onClick={() => setSelectedUser(user)} className={`flex px-4 items-center gap-2 w-full hover:bg-gray-100 py-2 rounded-full dark:hover:bg-neutral-900 ${selectedUser?._id == user?._id ? "bg-gray-100 dark:bg-neutral-900" : ""}`}>
                            <div className="relative">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.avatar?.url} />
                                    <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
                                </Avatar>
                                {onlineUsers?.includes(user?._id) && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800"></div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h1 className="font-medium text-md dark:text-white">{user?.fullName}</h1>

                                </div>
                                <h4 className="text-xs dark:text-gray-400">Messages and calls are secured</h4>

                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default MessagesSidebar