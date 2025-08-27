import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/general/theme-provider";
import ReduxProvider from "@/components/general/ReduxProvider";
import FlowbiteReactThemeProvider from "@/components/general/FlowbiteReactThemeProvider";
import ReactToaster from "@/components/general/ReactToaster";
import AuthProvider from "@/components/general/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import HandleSocketDisconnect from "@/components/general/HandleSocketDisconnect";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Linklio",
  description: "Linklio is a social media platform for sharing links and content. It allows users to create profiles, share links, and connect with others.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactToaster />
          <Toaster />
          <ReduxProvider>
            <FlowbiteReactThemeProvider>
            <AuthProvider>
              <HandleSocketDisconnect />
               {children}
            </AuthProvider>
            </FlowbiteReactThemeProvider>
          </ReduxProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
