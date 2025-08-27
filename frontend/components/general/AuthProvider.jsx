'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'
import { useSession } from 'next-auth/react';
import { setUser } from '@/redux/slices/userSlice';

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const user = useSelector((state) => state.user.user);
  const publicPaths = ['/auth/account', '/auth/verify-otp', "/auth/forget-password"];
  useEffect(() => {
    if (user && pathname.startsWith('/auth')) {
      router.push('/');
    }
    else if (status === "authenticated" && session?.user && !user) {
      localStorage.setItem("auth-token", JSON.stringify(session.authToken));
      dispatch(setUser(session.user));
    }
    else if (status !== "loading" && !user && !publicPaths.includes(pathname) && !pathname.startsWith('/auth/reset-password')) {
      router.push('/auth/account');
    }
  }, [user, router, pathname, status, dispatch]);

  if ((status === "loading") || (!user && !publicPaths.includes(pathname) && !pathname.startsWith('/auth/reset-password'))) {
    // Return null or a loader while redirecting
    return <div className="flex justify-center items-center h-screen">
      <LineSpinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      />
    </div>
  }

  return children;
};

export default AuthProvider;
