"use client";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function ForgetPassword() {
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/forget-password`, {
                email: userEmail
            })
            if (res.data.success) {
                toast.success(res.data.message);
                setUserEmail("");
                // router.push("/auth/reset-password")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className='dark:bg-neutral-900 h-screen flex items-center justify-center w-full'>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-medium">Find your account</CardTitle>
                        <CardDescription>
                            Please enter your email address to reset your password.
                        </CardDescription>

                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        disabled={loading}
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>

                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="w-full flex-col gap-2">
                        {!loading ? <Button disabled={userEmail.trim() === ""} onClick={handleSubmit} className="w-full">
                            Send reset link
                        </Button> :
                            <Button className="w-full cursor-progress">
                                Processing...
                            </Button>
                        }

                        <Button variant="outline" className="w-full" onClick={() => router.push("/auth/account")}> <ArrowLeft size={16}/> Back to Sign in</Button>

                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
export default ForgetPassword;