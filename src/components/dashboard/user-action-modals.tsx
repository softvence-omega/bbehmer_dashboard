import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useForceLogoutMutation, useResetPasswordMutation, useUserSuspendMutation, useUserUnSuspendMutation } from "../../redux/features/admin/adminManagementApi"
import UserDetail from "./user-detail"
import { toast } from "sonner"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { FormField } from "../ui/form"
import { Input } from "../ui/input"
import { useAdminSendUserNotificationMutation, useSetNotesMutation, useUserBanMutation, useUserUnBanMutation } from "../../redux/features/admin/adminNotification"

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: "free" | "paid";
  createdAt: string;
  lastActivity: string;
  isSuspend: boolean;
  ratings: number;
  notes: number;
  favorites: number;
  isIpBan:boolean
}


type TActionType ="ban"|"unban"| "notes" | "view" | "suspend" | "reset" | "subscription"| "Unsuspend" | "force-logout" | "notification" | null


interface UserActionModalsProps {
  user: User | null
  actionType: TActionType
  onClose: () => void
  setActionType: any
}
const notificationSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  message: z.string().min(1, "Message is required").optional(),
  note: z.string().min(1, "Note is required").optional(),
});
type NotificationFormData = z.infer<typeof notificationSchema>;

const UserActionModals =({ user, actionType, onClose,setActionType }: UserActionModalsProps) => {
  const [reason, setReason] = useState("")
  const [suspendUser] = useUserSuspendMutation();
  const [unSuspenndUser] = useUserUnSuspendMutation();
  const [forceLogout] = useForceLogoutMutation()
  const [resetPassword] = useResetPasswordMutation();
  const [setNotes,{isLoading:isLoadingNotes}] = useSetNotesMutation()
  const [banUser] = useUserBanMutation()
  const [unbanUser] = useUserUnBanMutation()
  const [newSubscription,setNewSubscription] = useState("")
  const [sendNotification, { isLoading, isError }] = useAdminSendUserNotificationMutation();
  const {control,
    handleSubmit,
    reset,
    register,
    formState: { errors },} = useForm<NotificationFormData>()



  const handleBan = async () => {
    if(user?.id && actionType === "ban"){
      const res = await banUser(user.id).unwrap();
      if(res?.success){
        toast.success(`${user.name} is Ban Successfully`)
      }
    }

    if(user?.id && actionType === "unban") {
      const res = await unbanUser(user.id).unwrap();
      if(res?.success){
        toast.success(`${user.name} is Unbanned Successfully`)
      }
    }
  }

  const handleSuspend = async () => {
    // Handle suspend/unsuspend logic
    if(user?.id && actionType === "suspend"){
      const res = await suspendUser({ id: user.id,reason:reason }).unwrap();
      console.log("Suspended user:", res);
      if(res?.success){
        toast.success(`${user.name} is Suspended Successfully`)
        setReason("")
      }
    }

    if(user?.id && actionType === "Unsuspend") {
      const res = await unSuspenndUser({ id: user.id }).unwrap();
      console.log("UnSuspended user:", res);
      if(res?.success){
        toast.success(`${user.name} is UnSuspended Successfully`)
        setReason("")
      }
    }

    // console.log(`${user?.isSuspend === "suspended" ? "Unsuspending" : "Suspending"} user:`, user?.id, "Reason:", reason)
    onClose()
    setReason("")
  }

  const handleResetPassword =async () => {

    // force logout
    if(user?.id && actionType === "force-logout"){
      const res = await forceLogout({id:user.id})

     
    if(res?.data?.success){
      toast.success(`${user.name}Force Logout Successfull`)
      onClose()
    }
    }
    
    // Handle password reset logic
    if(user?.id && actionType === "reset"){
      const res = await resetPassword({id:user.id})
      if(res?.data?.success){
      toast.success(`${user.name} Password Reset Successfull`)
      onClose()
    }
    }
  }

  const handleSubscriptionChange = () => {
    // Handle subscription change logic
    // console.log("Changing subscription for user:", user?.id, "to:", newSubscription)
    // onClose()
    // setNewSubscription("")
  }

  const onSubmit = async (data: NotificationFormData) => {
    try {
    const payload = {
      data: data, // title + message
      id: user?.id,     // user ID to send to
    };

    const res = await sendNotification(payload).unwrap();

     if(isLoading){
      toast.loading("Notification Sending")  
    }
    console.log(res)
    
    if(res.success){
      toast.success("Notification sent successfully!");
      reset();
      onClose();
    }
    if(isError){
      toast.error("something went wrong")
    }

  } catch (err) {
    toast.error("Failed to send notification");
    console.error(err);
  }
  };

  const onSubmitNotes = async(data:any) => {
    try {

    const res = await setNotes({id:user?.id,data:data}).unwrap();

     if(isLoadingNotes){
      toast.loading("Notification Sending")  
    }
    
    if(res?.success){
      toast.success("Notification sent successfully!");
      reset();
      onClose();
    }
    if(isError){
      toast.error("something went wrong")
    }

  } catch (err) {
    toast.error("Failed to send notification");
    console.error(err);
  }
  }

  if (!user || !actionType) return null

  return (
    <>

    <Dialog open={actionType === "ban"  || actionType === "unban"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user.isIpBan ? "Unban" : "Ban"} User</DialogTitle>
            <DialogDescription>
              {user.isIpBan
                ? `Are you sure you want to Unban ${user.name}? They will regain access to their account.`
                : `Are you sure you want to Ban ${user.name}? They will lose access to their account.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={user.isIpBan ? "default" : "destructive"} onClick={handleBan}>
              {user.isIpBan ? "Unban" : "Ban"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Suspend/Unsuspend Modal */}
      <Dialog open={actionType === "suspend"  || actionType === "Unsuspend"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user.isSuspend ? "Unsuspend" : "Suspend"} User</DialogTitle>
            <DialogDescription>
              {user.isSuspend
                ? `Are you sure you want to unsuspend ${user.name}? They will regain access to their account.`
                : `Are you sure you want to suspend ${user.name}? They will lose access to their account.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={user.isSuspend ? "default" : "destructive"} onClick={handleSuspend}>
              {user.isSuspend ? "Unsuspend" : "Suspend"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Logout Modal */}
      <Dialog open={actionType === "force-logout"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Logout</DialogTitle>
            <DialogDescription>
              This will send a password reset email to {user.email} and force logout from all devices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Force Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={actionType === "reset"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              This will send a password reset email to {user.email} and force logout from all devices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* User Details */}
      <Dialog open={actionType === "view"} onOpenChange={onClose}>
        <DialogContent className="max-w-[1000px] overflow-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <UserDetail setActionType={setActionType}  onBack={onClose} userId={user.id}/>
        </DialogContent>
      </Dialog>

      
      {/* Subscription Management Modal */}
      <Dialog open={actionType === "subscription"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Change the subscription plan for {user.name}. Current plan: {user.subscriptionPlan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subscription">New Subscription Plan</Label>
              <Select value={newSubscription} onValueChange={setNewSubscription}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Plan</SelectItem>
                  <SelectItem value="basic">Basic Plan ($9.99/month)</SelectItem>
                  <SelectItem value="premium">Premium Plan ($19.99/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan ($49.99/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubscriptionChange} disabled={!newSubscription}>
              Update Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Subscription Management Modal */}
      <Dialog open={actionType === "notification"} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a message to <strong>{user.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Hook Form Setup */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={control}
            name="title"
            render={({ }) => (
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Enter title" />
                {typeof errors.title?.message === "string" && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Write your message here..."
                  {...field}
                />
                {typeof errors.message?.message === "string" && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isLoading ? "Sending..." : "Send Notification"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/*  */}
    <Dialog open={actionType === "notes"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Admin Note</DialogTitle>
          <DialogDescription>
            Add an administrative note for a user. This will be visible to other administrators.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitNotes)} className="space-y-4">
          
           <FormField
            control={control}
            name="note"
            render={({ field }) => (
              <div>
                <Label htmlFor="note">Message</Label>
                <Textarea
                  id="note"
                  rows={4}
                  placeholder="Write your message here..."
                  {...field}
                />
                {typeof errors.note?.message === "string" && (
                  <p className="text-sm text-red-500">{errors.note.message}</p>
                )}
              </div>
            )}
          />
          
          {/* <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Enter your administrative note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              required
            />
          </div> */}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!user}>
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}


export default UserActionModals;
