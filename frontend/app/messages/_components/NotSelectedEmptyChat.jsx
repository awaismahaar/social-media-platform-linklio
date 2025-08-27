import { MessageCircle } from 'lucide-react'
import React from 'react'

const NotSelectedEmptyChat = () => {
    return (
        <div className="flex items-center justify-center h-full">

            <div className='flex flex-col items-center gap-2'>

                <MessageCircle className='w-24 h-24 text-blue-500 dark:text-blue-700' />

                <p className="text-xl text-center font-normal text-gray-500 dark:text-white">Select a user to start chatting.</p>
            </div>
        </div>
    )
}

export default NotSelectedEmptyChat