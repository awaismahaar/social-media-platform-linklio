"use client";
import { Button } from "@/components/ui/button"
import { toast as sonnertoast } from "sonner"
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const ResetPasswordCP = ({token}) => {
     const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
            if (password !== confirmPassword) {
               return sonnertoast.error("Password and Confirm Password do not match")
            }
            try {
                setLoading(true);
                const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/${token}`, {
                    password: password
                })
                if (res.data.success) {
                    toast.success(res.data.message)
                    router.push("/auth/account")
                }
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            } finally {
                setLoading(false);
            }
        }
  return (
     <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-medium">Reset your password</CardTitle>
                        <CardDescription>
                            Please enter your new password.
                        </CardDescription>

                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label>Password</Label>
                                    <Input

                                        type="password"
                                        disabled={loading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Confirm Password</Label>
                                    <Input

                                        type="password"
                                        disabled={loading}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </div>

                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        {!loading ? <Button disabled={password.trim() === "" || confirmPassword.trim() === ""} onClick={handleSubmit} className="w-full">
                            Reset password
                        </Button> :
                            <Button className="w-full cursor-progress">
                                Processing...
                            </Button>
                        }
                        <div className="flex items-center justify-center w-full">
                            <p className="text-sm text-center max-w-xs w-full text-neutral-500 dark:text-neutral-400">If token expire then again request for reset password link? <Link href="/auth/forget-password" className="text-blue-700 hover:underline">Click here</Link></p>
                        </div>
                    </CardFooter>
                </Card>
  )
}

export default ResetPasswordCP