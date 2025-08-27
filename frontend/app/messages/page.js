"use client";
import Navbar from '@/components/general/Navbar'
import Sidebar from '@/components/general/Sidebar'
import Messages from './_components/Messages'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { initializeSocket, setOnlineUsers } from '@/redux/slices/socketSlice';
import { setMessages } from '@/redux/slices/messageSlice';

const MessagesPage = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(state => state.socket);
    const user = useSelector(state => state.user.user);
    useEffect(() => {
        dispatch(initializeSocket(user?._id));
    }, [dispatch, user?._id]);
    useEffect(() => {
        if (!socket) return;
        socket.on("onlineUsers", (onlineUsers) => {
            console.log("Online users:", onlineUsers);
            dispatch(setOnlineUsers(onlineUsers));
        });
        socket.on("newMessage", (msg) => {
            dispatch(setMessages(msg));
        });
    }, [dispatch, socket]);
    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className='lg:pl-[250px] pt-[70px]'>
                    <Messages />
                </div>
            </div>
        </>
    )
}

export default MessagesPage