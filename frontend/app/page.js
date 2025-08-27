"use client";
import Navbar from "@/components/general/Navbar";
import Sidebar from "@/components/general/Sidebar";
import Homepage from "./_components/Homepage";
import UserRightSidebar from "./_components/UserRightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, setOnlineUsers } from "@/redux/slices/socketSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const dispatch = useDispatch();
  const { socket } = useSelector(state => state.socket);
  const user = useSelector(state => state.user.user);
  useEffect(() => {
    dispatch(initializeSocket(user?._id));
    console.log("init socket");
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("onlineUsers", (onlineUsers) => {
      // console.log("Online users:", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });
  }, [dispatch, socket]);
  return (
    <>

      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
        {/* Navbar */}
        <Navbar />

        <div className="flex w-full pt-[80px]">
          {/* Left Sidebar */}
          <Sidebar />


          {/* Main Content */}
          <main className="flex-1 w-full lg:ml-[250px] lg:mr-[320px] px-2 sm:px-4 flex justify-center">
            <div className="w-full max-w-3xl">
              <Homepage />
            </div>
          </main>

          {/* Right Sidebar */}
          <UserRightSidebar />

        </div>
      </div>

    </>
  );
}
