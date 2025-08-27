"use client";
import {
    Avatar as FlowbiteAvatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar as FlowbiteNavbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
} from "flowbite-react";
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ModeToggle } from './ModeToggle'
import { Bell, Home, LogOut, UserPen, Verified } from 'lucide-react'
import { Button } from '../ui/button'
import SearchInput from './SearchInput'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { removeUser } from "@/redux/slices/userSlice";
import SearchModal from "../others/SearchModal";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { disconnectSocket } from "@/redux/slices/socketSlice";

const Navbar = () => {
    const user = useSelector((state) => state.user.user);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    // logout function
    async function handleLogout() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                }
            })
            if (res.data.success) {
                await signOut({
                    redirect: false,
                })
                toast.success(res.data.message)
                dispatch(removeUser());
                dispatch(disconnectSocket());
                localStorage.removeItem("auth-token");
                router.push("/auth/account")
            }
        } catch (error) {
            const message = error?.response?.data.message
            message && toast.error(message)
        }
    }
    return (
        <>
            <FlowbiteNavbar className="fixed z-20 top-0 left-0 w-full border-b p-0.75 px-2" fluid>

                <NavbarBrand as={Link} href="/">
                    <Image src="/logo.png" alt="Logo" priority className='w-full h-full object-cover' width={50} height={50}></Image>
                </NavbarBrand>

                <div className="flex items-center gap-2 lg:gap-4 md:order-2">
                    <div className="hidden md:block">
                        <SearchInput setOpen={setOpen} />
                    </div>
                    <ModeToggle />
                    <div className="hidden md:block">
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <FlowbiteAvatar rounded bordered color="success" className='cursor-pointer' alt="avatar" img={user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                            }
                        >
                            <DropdownHeader>
                                <div className="flex items-center gap-2 w-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatar?.url} />
                                        <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h1 className="font-medium text-md dark:text-white">{user?.fullName}</h1>
                                            {user?.isVerified && (
                                                <Verified className="text-blue-500 w-4 h-4" />
                                            )}
                                        </div>

                                        <h4 className="text-sm dark:text-gray-400">@{user?.username}</h4>
                                    </div>
                                </div>
                            </DropdownHeader>
                            <DropdownItem onClick={() => router.push("/")}><Home className="mr-2 h-4 w-4" /> Home</DropdownItem>
                            <Link href={`/profile/${user?._id}`}>
                                <DropdownItem><UserPen className="mr-2 h-4 w-4" />Profile</DropdownItem>
                            </Link>

                            <DropdownDivider />
                            <DropdownItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownItem>
                        </Dropdown>
                    </div>
                    <NavbarToggle />
                </div>
                <NavbarCollapse className="p-2 m-0">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex-2 block md:hidden">
                            <SearchInput setOpen={setOpen} />
                        </div>
                        <div className="block md:hidden">
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={
                                    <FlowbiteAvatar rounded bordered color="success" className='cursor-pointer' alt="avatar" img={user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                                }
                            >
                                <DropdownHeader>
                                    <div className="flex items-center gap-2 w-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user?.avatar?.url} />
                                            <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <h1 className="font-medium text-md dark:text-white">{user?.fullName}</h1>
                                                {user?.isVerified && (
                                                    <Verified className="text-blue-500 w-4 h-4" />
                                                )}
                                            </div>

                                            <h4 className="text-sm dark:text-gray-400">@{user?.username}</h4>
                                        </div>
                                    </div>
                                </DropdownHeader>
                                <DropdownItem onClick={() => router.push("/")}><Home className="mr-2 h-4 w-4" /> Home</DropdownItem>
                                <Link href={`/profile/${user?._id}`}>
                                    <DropdownItem><UserPen className="mr-2 h-4 w-4" />Profile</DropdownItem>
                                </Link>

                                <DropdownDivider />
                                <DropdownItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    </div>

                </NavbarCollapse>
            </FlowbiteNavbar>

            {/* Search Modal */}
            <SearchModal open={open} setOpen={setOpen} />

        </>
    )
}

export default Navbar;