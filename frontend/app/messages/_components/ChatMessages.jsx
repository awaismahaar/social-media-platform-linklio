import { MessageCircle } from 'lucide-react'
import React from 'react'

const ChatMessages = ({ messages, user }) => {
    console.log(user , messages)
    return (
        <div className='flex flex-col gap-4 h-full p-4'>
            {messages.length > 0 ? messages.map((msg, index) => (
                <div key={index} className={`flex ${user?._id === msg?.senderId ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5 border-gray-200 dark:border-gray-700 rounded-e-xl rounded-es-xl`}>
                    <div className="flex items-start gap-2.5">
                        
                        <div className="flex flex-col gap-1 w-full max-w-[320px]">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">

                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(msg?.createdAt).toLocaleString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}</span>
                            </div>
                            <div className={`flex flex-col leading-1.5 p-4 border-gray-200 ${user?._id === msg?.senderId ? 'bg-blue-300 dark:bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'}  rounded-e-xl rounded-es-xl`}>
                                <p className="text-sm font-normal text-gray-900 dark:text-white">{msg?.message}</p>
                            </div>
                            {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span> */}
                        </div>

                    </div>
                </div>
            )) :
                <div className='flex flex-col gap-2 items-center h-full'>

                    <MessageCircle className='w-20 h-20 text-blue-500 dark:text-blue-700' />

                    <p className="text-xl text-center font-normal text-gray-700 dark:text-white">No messages</p>
                </div>
            }





        </div>
    )
}

export default ChatMessages