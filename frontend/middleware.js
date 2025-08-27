 import { NextResponse } from 'next/server'
 export function middleware(request) {
   const userToken = request.cookies.get('authToken') || request.cookies.get('next-auth.session-token') || "";
   const isAuthPage = request.nextUrl.pathname.startsWith('/auth/account')
   const isVerifyOtpPage = request.nextUrl.pathname.startsWith('/auth/verify-otp')
   const isForgetPasswordPage = request.nextUrl.pathname.startsWith('/auth/forget-password')
   const isResetPasswordPage = request.nextUrl.pathname.startsWith('/auth/reset-password')
   const isPublicRoutes = isAuthPage || isVerifyOtpPage || isForgetPasswordPage || isResetPasswordPage;
   if (!userToken && !isPublicRoutes) {
     // Not logged in and trying to access website, redirect to login
     return NextResponse.redirect(new URL('/auth/account', request.url))
   }
  //  if (userToken && isPublicRoutes) {
  //    // Logged in and trying to access /auth/account or /auth/verify-otp, redirect to home
  //    return NextResponse.redirect(new URL('/', request.url))
  //  }
   return NextResponse.next()
 }
 export const config = {
   matcher: ['/', '/profile/:path*' , '/auth/:path*'],
 }
