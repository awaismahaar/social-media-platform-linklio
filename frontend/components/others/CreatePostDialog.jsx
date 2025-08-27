import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { ImageIcon, Loader2, Smile, Verified, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import EmojiPicker from 'emoji-picker-react';
import { setPostUpload } from "@/redux/slices/userSlice";
export function CreatePostDialog({ open, setOpen }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            toast.error('You can upload a maximum of 5 images');
            return;
        }
        setImages((prevImages) => [...prevImages, ...files]);
        console.log(files);
        // Generate previews
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prevImages) => [...prevImages, ...filePreviews]);
        console.log(filePreviews);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        const updatedPreviews = [...previews];
        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setImages(updatedImages);
        setPreviews(updatedPreviews);
    };

    const handleEmojiClick = (emojiData) => {
        setContent(prev => prev + emojiData.emoji);
        setShowPicker(false); // Close the picker after selecting an emoji
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        images.forEach((image, _) => {
            formData.append('images', image); // "images" matches the backend field name
        });
        formData.append('content', content);

        try {
            setIsSubmitting(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/create-post`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                     "Authorization" : `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                },
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setImages([]);
                setPreviews([]);
                setContent('');
                setOpen(false);
                dispatch(setPostUpload(true));
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>

                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>

                    </DialogHeader>
                    <div className="flex px-4 items-center gap-2 w-full">
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

                    <form className="p-4">
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full min-h-[150px] p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPicker(!showPicker)}
                                className="absolute bottom-2 right-0 z-20 p-2 rounded-lg hover:text-gray-500 dark:hover:text-gray-700"
                            >
                                <Smile size={20} className="inline-block" />
                            </button>
                            {showPicker && (
                                <div className="absolute top-14 left-10 z-10 w-full">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}

                        </div>

                        <div className="mt-4">
                            <label className="block mb-2">
                                <div className="flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <ImageIcon size={20} className="text-gray-500 dark:text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">Upload Images</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </label>

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 max-h-32 overflow-y-auto">
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="h-32 w-32 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-8">
                            <DialogClose asChild>
                                <Button disabled={isSubmitting} onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={!content.trim() || isSubmitting} onClick={handleSubmit} type="submit" className="dark:text-white">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} /> Please wait...
                                    </>

                                ) : (
                                    "Post"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </form>
        </Dialog>
    )
}
