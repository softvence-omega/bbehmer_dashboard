
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Trash2, Edit, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useAdminGetAllAnnouncementsQuery, useDeleteAnnouncementMutation, useUpdateAnnouncementMutation } from "../../redux/features/admin/adminNotification"
import { toast } from "sonner"

const AnnouncementsList =() => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeletedDialogOpen,setIsDeletedDialogOpen] = useState(false)
  const [limit] = useState(10)
  type EditFormType = {
    title?: string
    message?: string
    startsAt?: string
    endsAt?: string
  }

  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)
  const [editForm, setEditForm] = useState<EditFormType>({})
//   const { toast } = useToast()

  const offset = currentPage * limit

  const { data: announcementsData, isLoading, error, refetch } = useAdminGetAllAnnouncementsQuery({ limit, offset })

  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation()
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation()

 const handleDelete = async (id: string) => {
  try {
    await deleteAnnouncement(id).unwrap()

    toast.success("Announcement deleted successfully", {
      description: "The announcement has been removed.",
    })

    setIsDeletedDialogOpen(false)
  } catch (error) {
    toast.error("Failed to delete announcement", {
      description: "Please try again.",
    })
  }
}

  const handleUpdate = async () => {
  if (!editingAnnouncement) return

  try {
    await updateAnnouncement({
      id: editingAnnouncement.id,
      data: editForm,
    }).unwrap()

    toast.success("Announcement updated successfully", {
      description: "Your changes have been saved.",
    })
    setIsEditDialogOpen(false)

    setEditingAnnouncement(null)
    setEditForm({})
  } catch (error) {
    toast.error("Failed to update announcement", {
      description: "Please try again.",
    })
  }
}

  const openEditDialog = (announcement: any) => {
    setIsEditDialogOpen(true)
    setEditingAnnouncement(announcement)
    setEditForm({
      title: announcement.title,
      message: announcement.message,
      startsAt: announcement.startsAt,
      endsAt: announcement.endsAt,
    })
  }

  const totalPages = announcementsData?.data ? Math.ceil(announcementsData?.data?.length / limit) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Failed to load announcements</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Announcements</h1>
        <div className="text-sm text-gray-400">Total: {announcementsData?.data?.length || 0} announcements</div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcementsData?.data?.map((announcement:any, index:number) => (
          <Card key={announcement.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-white text-xl">{announcement.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {index === 0 && currentPage === 0 && <Badge className="bg-blue-600 hover:bg-blue-700">Latest</Badge>}

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(announcement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">Edit Announcement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-white">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-white">
                            Message
                          </Label>
                          <Textarea
                            id="message"
                            value={editForm.message || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, message: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startsAt" className="text-white">
                              Starts At
                            </Label>
                            <Input
                              id="startsAt"
                              type="datetime-local"
                              value={editForm.startsAt ? new Date(editForm?.startsAt).toISOString().slice(0, 16) : ""}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, startsAt: e.target.value }))}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="endsAt" className="text-white">
                              Ends At
                            </Label>
                            <Input
                              id="endsAt"
                              type="datetime-local"
                              value={editForm.endsAt ? new Date(editForm.endsAt).toISOString().slice(0, 16) : ""}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, endsAt: e.target.value }))}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingAnnouncement(null)
                              setEditForm({})
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Update
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={isDeletedDialogOpen} onOpenChange={setIsDeletedDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Announcement</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Are you sure you want to delete this announcement? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(announcement.id)}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{announcement.message}</p>
              {announcement.startsAt && announcement.endsAt && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Active: {new Date(announcement.startsAt).toDateString()}</span>
                    <span>Until: {new Date(announcement.endsAt).toDateString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {offset + 1} to {Math.min(offset + limit, announcementsData?.total || 0)} of{" "}
            {announcementsData?.total || 0} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage < 3 ? i : currentPage - 2 + i
                if (pageNum >= totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    }
                  >
                    {pageNum + 1}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {announcementsData?.data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No announcements found</p>
        </div>
      )}
    </div>
  )
}


export default AnnouncementsList;