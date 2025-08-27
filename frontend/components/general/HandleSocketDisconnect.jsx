"use client";
import { disconnectSocket } from '@/redux/slices/socketSlice';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const HandleSocketDisconnect = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const handleBeforeUnload = () => {
            dispatch(disconnectSocket());
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
}

export default HandleSocketDisconnect;