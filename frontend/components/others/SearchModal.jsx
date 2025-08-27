import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Verified, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const SearchModal = ({ open, setOpen }) => {
    const user = useSelector((state) => state.user.user);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            async function getResults() {
                try {
                    setLoading(true);
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/search?search=${query}`, {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                        }
                    });
                    if (res.data.success) {
                        setResults(res.data.users);
                        console.log(res.data.users);
                    }
                }
                catch (error) {
                    toast.error(error?.response?.data?.message || "Something went wrong");
                    console.log(error);
                }
                finally {
                    setLoading(false);
                }
            }
            if (query.trim().length === 0) {
                setResults([]);
            }
            else if (query.trim().length > 0) {
                getResults();
            }

        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>

                    </DialogHeader>
                    <div className="relative">
                        <Search className="w-4.5 h-4.5 absolute top-2.25 left-2" />
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" placeholder="Search by name or username..." />
                    </div>
                    <div className="flex flex-col max-h-94 overflow-y-auto gap-2 mt-4">
                        {results.length > 0 ? results.map((user) => {
                            return <Link key={user._id} href={`/profile/${user._id}`}>
                                <div className="flex px-4 items-center gap-2 w-full hover:bg-gray-100 py-2 rounded-full dark:hover:bg-neutral-800">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatar?.url} />
                                        <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0])}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h1 className="font-medium text-md dark:text-white">{user?.fullName}</h1>
                                            {user?.isVerified && (
                                                <Verified className="text-blue-500 w-4 h-4" />
                                            )}
                                        </div>
                                        <h4 className="text-sm dark:text-gray-400">@{user?.username}</h4>

                                    </div>
                                </div>
                            </Link>
                        }) :
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No results found</p>
                        }


                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default SearchModal