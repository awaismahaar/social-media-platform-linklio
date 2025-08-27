"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ArrowLeft, BackpackIcon, MoreHorizontal, Paperclip, PhoneCall, SendIcon, SmileIcon, Verified, Video } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ChatMessages from './ChatMessages'
import EmojiPicker from 'emoji-picker-react'
import { sendMessage } from '@/redux/thunk/messageThunk'
import { useDispatch } from "react-redux";
import { Ping } from 'ldrs/react'
import 'ldrs/react/Ping.css'
import NotSelectedEmptyChat from './NotSelectedEmptyChat'
const MessagesContainer = ({ selectedUser,setSelectedUser }) => {
    const { onlineUsers } = useSelector((state) => state.socket);
    const { user } = useSelector((state) => state.user);
    const { messages, loading } = useSelector((state) => state.message);
    const [showPicker, setShowPicker] = useState(false);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch()
    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowPicker(false); // Close the picker after selecting an emoji
    }
    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handeSendMessage() {
        if (message.trim() !== "") {
            const sendObj = { receiverId: selectedUser?._id, message }
            const res = await dispatch(sendMessage(sendObj));
            console.log(res)
            if (res.type.includes("fulfilled")) {
                setMessage("");
            }
        }
    }
    return (
       <div className='relative w-full lg:w-[calc(100% - 400px)] bg-white dark:bg-gray-900 h-[90vh] overflow-y-hidden'>
  {selectedUser === null ? (
    <NotSelectedEmptyChat />
  ) : (
    <>
      <div className="py-3 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2 w-full rounded-full ">
          {/* Back button only on mobile */}
          <button
            className="md:hidden mr-2 text-gray-600 dark:text-gray-300"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft size={20} />
          </button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedUser?.avatar?.url} />
            <AvatarFallback>
              {selectedUser?.fullName.split(" ").map((word) => word[0])}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-medium text-md dark:text-white">
                {selectedUser?.fullName}
              </h1>
              {selectedUser?.isVerified && (
                <Verified className="text-blue-500 w-4 h-4" />
              )}
            </div>
            {onlineUsers.includes(selectedUser?._id) ? (
              <h4 className="text-sm text-green-700 dark:text-green-400">
                online
              </h4>
            ) : (
              <h4 className="text-sm text-red-700 dark:text-red-400">
                offline
              </h4>
            )}
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
          <Video className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 ml-4" />
          <MoreHorizontal className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 ml-4" />
        </div> */}
      </div>

      <div className="h-122 my-2 overflow-y-auto">
        {loading ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Ping size="45" speed="2" color="blue" />
          </div>
        ) : (
          <>
            <ChatMessages messages={messages} user={user} />
            {/* Invisible div to scroll into view */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className='absolute bottom-0 left-0 right-0 p-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-2">
            <Paperclip className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
            <SmileIcon
              onClick={() => setShowPicker(!showPicker)}
              className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
            />
            {showPicker && (
              <div className="absolute bottom-14 z-10 w-full">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-4 py-5 rounded-full bg-gray-100 dark:bg-gray-800"
            placeholder="Type a message..."
          />
          <button disabled={message.trim() === ""} onClick={handeSendMessage}>
            <SendIcon className="absolute right-6 flex items-center justify-center bottom-0 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
        </div>
      </div>
    </>
  )}
</div>

    )
}

export default MessagesContainer