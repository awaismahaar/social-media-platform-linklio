"use client";
import { PanelRightOpen } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { CreatePostDialog } from '../others/CreatePostDialog';
import {
    Home,
    MessageCircle,
    Users,
    UserCheck,
    Bell,
    PlusSquare,
    Search,
    X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SearchModal from '../others/SearchModal';
import { usePathname } from 'next/navigation';

const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'All Users', href: '/users' },
    { icon: PlusSquare, label: 'Create Post', href: 'create' },
    { icon: Search, label: 'Search Users', href: 'search' },
];




const Sidebar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const sidebarRef = useRef(null);


    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !(sidebarRef.current).contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            <div>
                {/* Toggle Button - only visible on mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden fixed top-4 left-24 z-50 p-1 rounded-md border"
                >
                    <PanelRightOpen className='w-6 h-6' />
                </button>
                {/* Backdrop when sidebar is open on mobile */}
                {isOpen && (
                    <div className="fixed inset-0 z-30 bg-slate-800/50 dark:bg-slate-700/30 backdrop-blur lg:hidden" />
                )}

                {/* Sidebar */}
                <div
                    ref={sidebarRef}
                    className={`fixed left-0 top-0 lg:top-[70px] h-screen w-full max-w-[250px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50 lg:z-10 lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >

                    {/* Mobile close button */}
                    <div className='lg:hidden flex items-center justify-between px-4 w-full'>
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" priority className='w-full h-full object-cover' width={50} height={50}></Image>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            if (item.href === 'create' || item.href === 'search') {
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => { item.href === 'create' && setOpen(true); item.href === 'search' && setIsModalOpen(true) }}
                                        className={`flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className={`w-5 h-5 transition-transform duration-200 ${item.active ? 'scale-110' : 'group-hover:scale-105'
                                                }`} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>

                                        {item.badge && (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.active
                                                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                                                : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                                                }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            }
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${item.href === pathname
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-5 h-5 transition-transform duration-200 ${item.active ? 'scale-110' : 'group-hover:scale-105'
                                            }`} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>

                                    {item.badge && (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.active
                                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                                            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
            <CreatePostDialog open={open} setOpen={setOpen} />
            <SearchModal open={isModalOpen} setOpen={setIsModalOpen} />
        </>
    )
}

export default Sidebar

