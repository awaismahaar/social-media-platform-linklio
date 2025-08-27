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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function EditProfileModal({open, setOpen,user,updateUser,setUpdateUser,handleUpdateUser}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Full Name</Label>
              <Input id="name-1" name="name" value={updateUser.fullName} onChange={(e)=>setUpdateUser({...updateUser,fullName:e.target.value})} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" disabled value={"@"+updateUser.username} onChange={(e)=>setUpdateUser({...updateUser,username:e.target.value})} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="bio-1">Bio</Label>
              <Textarea id="bio-1" name="bio" value={updateUser.bio} onChange={(e)=>setUpdateUser({...updateUser,bio:e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={()=> setOpen(false)}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser} disabled={user?.fullName === updateUser.fullName && user?.bio === updateUser.bio}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
