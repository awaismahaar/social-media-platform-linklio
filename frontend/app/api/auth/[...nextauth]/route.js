import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
             // For social login, fetch from your backend
            if (user?.email && account) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/social-login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fullName: user.name,
                            email: user.email,
                            avatar: {
                                url: user.image,
                                publicId: "",
                            },
                            provider: account?.provider
                        }),
                    });
                    const data = await res.json();
                    token.authToken = data.token;
                    token.user = data.user;
                } catch (error) {
                    console.error("Error syncing user with backend:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.authToken = token.authToken;
            session.user = token.user;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
