import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Calendar, Shield, User, Mail } from "lucide-react"
import { useGetNoteQuery } from "../../redux/features/admin/adminNotification"
interface NoteDetailsDialogProps {
  noteId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NoteDetailsDialog({ noteId, open, onOpenChange }: NoteDetailsDialogProps) {
  const {
    data,
    isLoading,
    error,
  } = useGetNoteQuery(noteId)

  const note = data?.data?.[0]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Note Details</DialogTitle>
          <DialogDescription>Complete information about this administrative note</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading note details</p>
          </div>
        ) : note ? (
          <div className="space-y-6">
            {/* User Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">User Information</h3>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={note?.user?.avatar || "/placeholder.svg"} alt={note?.user?.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{note?.user?.name}</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm">{note?.user?.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">User ID: {note?.user?.id}</p>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Administrative Note</h3>
              <div className="p-4 bg-background border rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{note?.user_admin_notes?.note}</p>
              </div>
            </div>

            {/* Admin Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Created By</h3>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={note?.admin?.avatar || "/placeholder.svg"} alt={note?.admin?.name} />
                  <AvatarFallback>
                    <Shield className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{note?.admin?.name || "Admin User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {note?.admin?.email || `Admin ID: ${note?.user_admin_notes?.adminId}`}
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(note?.user_admin_notes?.createdAt)}
                </Badge>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Metadata</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Note ID</p>
                  <p className="font-mono text-xs">{note?.user_admin_notes?.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{formatDate(note?.user_admin_notes?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
