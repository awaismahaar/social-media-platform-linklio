"use client";
import { useTheme } from 'next-themes';
import React from 'react'
import { Toaster } from 'react-hot-toast'

const ReactToaster = () => {
    const { theme } = useTheme();
    console.log(theme);
    return (
        <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
                duration: 4000,
                removeDelay: 1000,
                style: {
                    background: theme === 'dark' ? '#363636' : "#fff",
                    color: theme === 'dark' ? '#fff' : "#000",
                },
            }}
        />
    )
}

export default ReactToaster