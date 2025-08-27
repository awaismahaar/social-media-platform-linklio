"use client";
import React, { useState } from 'react'
import MessagesSidebar from './MessagesSidebar'
import MessagesContainer from './MessagesContainer'

const Messages = () => {
   const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="flex w-full">
  {/*Chat Sidebar */}
  <div
    className={`
      ${selectedUser ? "hidden md:flex" : "flex"} 
      flex-col 
      border-r 
      bg-white dark:bg-gray-900
    `}
  >
    <MessagesSidebar
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />
  </div>

  {/* Chat container */}
  <div
    className={`
      ${selectedUser ? "flex" : "hidden md:flex"} 
      flex-col 
      w-full 
      bg-white dark:bg-gray-900
    `}
  >
    <MessagesContainer
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />
  </div>
</div>

  )
}

export default Messages