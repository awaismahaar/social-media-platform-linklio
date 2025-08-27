"use client";
import { Account } from '@/components/auth/Account'
import PasswordInput from '@/components/others/PasswordInput'
import ScrollBaseAnimation from '@/components/text/text-marquee'
import { IconBrandFacebookFilled, IconBrandGoogleFilled } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { removeUser, setUser } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { signIn } from "next-auth/react"
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'
import { Spinner } from 'flowbite-react';
import Link from 'next/link';

const Tab1 = () => {
    const dispatch = useDispatch();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [disabledButton, setDisabledButton] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(removeUser());
    }, [dispatch])

    const router = useRouter();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    function handleChange(e) {
        setData({
            ...data, [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (data.email && data.password) {
            setDisabledButton(false)
        }
        else {
            setDisabledButton(true)
        }
    }, [data])
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setData({
                    email: "",
                    password: "",
                })
                dispatch(setUser(res.data.user));
                router.push("/")
            }
        } catch (error) {
            console.log(error)
            const errors = error?.response?.data.errors
            const message = error?.response?.data.message
            errors && toast.error(errors[0]?.msg)
            message && toast.error(message)
        } finally {
            setLoading(false);
        }
    }
    async function handleGoogleSignIn() {
        setGoogleLoading(true);
        try {

            await signIn("google", { callbackUrl: "/" })
        }
        catch (error) {
            console.log(error);
            setGoogleLoading(false);
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-start justify-start gap-4 rounded-xl p-3 pb-4">
                <div>
                    <h1 className="font-font text-lg">Sign in to your account</h1>
                </div>
                <div className="w-full">
                    <label htmlFor="email" className="text-sm">
                        Enter your Email Address
                    </label>
                    <input
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        type="email"
                        className="mt-1 h-10 w-full rounded-md border px-1 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-800 dark:border-neutral-800 dark:placeholder-neutral-500"
                    />
                </div>
                <div className="w-full">
                    <PasswordInput password={data.password} onChange={handleChange} />
                </div>
                <div className="mt-2.5 w-full">
                    {!loading ?
                        <button disabled={disabledButton} type="submit" className={`h-10 w-full ${disabledButton ? "cursor-not-allowed" : "cursor-pointer"} rounded-md bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-950`}>
                            Login
                        </button>
                        :
                        <button className={`h-10 w-full cursor-progress! rounded-md bg-neutral-900 font-medium !text-white !bg-black/50! dark:bg-white/50 dark:text-neutral-950`}>
                            Processing...
                        </button>}


                </div>
                <div className="flex w-full items-center justify-center">
                    <p>Forget password? <Link href="/auth/forget-password" className="text-blue-700 hover:underline">Click here</Link></p>
                </div>


                <div className="relative mt-6 w-full">
                    <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-neutral-400 dark:bg-black dark:text-neutral-500">
                        Or
                    </div>
                    <div className="border-b border-neutral-300 dark:border-neutral-800"></div>
                </div>

            </form>
            <div className="mt-6 flex w-full flex-col gap-4">
                {!googleLoading ? <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150">
                    <IconBrandGoogleFilled /> <div>Continue with Google</div>
                </button> :
                    <button className={`h-10 w-full flex items-center justify-center gap-2 cursor-progress! rounded-md bg-neutral-900 font-medium text-white dark:bg-white/50 dark:text-gray-100`}>
                        <Spinner size="md" />  <p className="text-sm font-medium dark:text-white">Processing please wait...</p>
                    </button>
                }
                
            </div>
        </>
    )
}


const Tab2 = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [disabledButton, setDisabledButton] = useState(true);
    const [data, setData] = useState({
        fullName: "",
        email: "",
        password: "",
    })

    function handleChange(e) {
        setData({
            ...data, [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (data.fullName && data.email && data.password) {
            setDisabledButton(false)
        } else {
            setDisabledButton(true)
        }
    }, [data]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                localStorage.setItem("email", data.email)
                setData({
                    fullName: "",
                    email: "",
                    password: "",
                })
                router.push("/auth/verify-otp")
            }
        } catch (error) {
            console.log(error)
            const errors = error?.response?.data.errors
            const message = error?.response?.data.message
            errors && toast.error(errors[0]?.msg)
            message && toast.error(message)
        }
        finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setGoogleLoading(true);
        try {

            await signIn("google", { callbackUrl: "/" })
        }
        catch (error) {
            console.log(error);
            setGoogleLoading(false);
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-start justify-start gap-4 rounded-xl p-3 pb-4">
                <div>
                    <h1 className="font-font text-lg">Create an account</h1>
                </div>
                <div className="w-full">
                    <label htmlFor="fullName" className="text-sm">
                        Enter your Full Name
                    </label>
                    <input
                        name="fullName"
                        value={data.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        type="text"
                        className="mt-1 h-10 w-full rounded-md border px-1 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-800 dark:border-neutral-800 dark:placeholder-neutral-500"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="email" className="text-sm">
                        Enter your Email Address
                    </label>
                    <input
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        type="email"
                        className="mt-1 h-10 w-full rounded-md border px-1 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-800 dark:border-neutral-800 dark:placeholder-neutral-500"
                    />
                </div>
                <div className="w-full">
                    <PasswordInput password={data.password} onChange={handleChange} />
                </div>
                <div className="mt-2.5 w-full">
                    {!loading ?
                        <button disabled={disabledButton} type="submit" className={`h-10 w-full ${disabledButton ? "cursor-not-allowed" : "cursor-pointer"} rounded-md bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-950`}>
                            Sign up
                        </button>
                        :
                        <button className={`h-10 w-full !cursor-progress rounded-md !bg-neutral-900 font-medium !text-white dark:bg-white/50 dark:text-gray-100`}>
                            Processing...
                        </button>}
                </div>

                <div className="relative mt-6 w-full">
                    <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-neutral-400 dark:bg-black dark:text-neutral-500">
                        Or
                    </div>
                    <div className="border-b border-neutral-300 dark:border-neutral-800"></div>
                </div>

            </form>
            <div className="mt-6 flex w-full flex-col gap-4">
                {!googleLoading ? <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150">
                    <IconBrandGoogleFilled /> <div>Continue with Google</div>
                </button> :
                    <button className={`h-10 w-full flex items-center justify-center gap-2 cursor-progress! rounded-md bg-neutral-900 font-medium text-white dark:bg-white/50 dark:text-gray-100`}>
                        <Spinner size="md" />  <p className="text-sm font-medium dark:text-white">Processing please wait...</p>
                    </button>
                }
                
            </div>
        </>
    )
}
const Page = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(false);
    }, [])
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <LineSpinner
                size="40"
                stroke="3"
                speed="1"
                color="black"
            />
        </div>
    }
    return (
        <div className='dark:bg-neutral-900 h-screen'>
            <div className='flex p-4 sm:px-12 xl:px-24 h-[100vh] w-full items-center justify-center lg:justify-between'>
                <div className='hidden lg:block relative flex-1'>
                    <Image alt="Linklio" src="/logo.png" width="400" height="400" />
                    <p className='text-lg font-medium dark:text-white absolute bottom-8'>Linklio is a social media platform for sharing links and content</p>
                </div>

                <div className="relative z-10">
                    <Account firstTab={<Tab1 />} secondTab={<Tab2 />} defaultTab={0} />
                </div>
            </div>
            <div className='absolute bottom-[3%] left-4 right-4'>
                <div className="grid place-content-center">
                    <ScrollBaseAnimation
                        baseVelocity={1}
                        delay={2}
                        scrollDependent={true}
                        clasname="font-bold tracking-[-0.07em] leading-[90%]">
                        Linklio is a social media platform for sharing links and content. It allows users to create profiles, share links, and connect with others.
                    </ScrollBaseAnimation>
                </div>
            </div>
        </div>


    )
}

export default Page