import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function EditAvatarPicture({ open, setOpen, user, avatarFile, setAvatarFile , handleUpdatePicture, loading}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Profile Picture</DialogTitle>
                        <DialogDescription>
                            Upload a new profile picture here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 transition-all duration-300 group-hover:border-blue-500">
                            <img
                                src={avatarFile && URL.createObjectURL(avatarFile) || user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt={`${user?.fullName}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <Input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogClose>
                        {loading ? <Button disabled>Loading...</Button> : <Button onClick={handleUpdatePicture}>Save changes</Button>}
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}