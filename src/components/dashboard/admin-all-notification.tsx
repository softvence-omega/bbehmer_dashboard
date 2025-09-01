
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
import { Trash2, ChevronLeft, ChevronRight, Loader2, Bell, User } from "lucide-react"
import { useAdminGetAllNotificationsQuery, useDeleteNotificationMutation } from "../../redux/features/admin/adminNotification"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const NotificationsList=()=> {
  const [currentPage, setCurrentPage] = useState(0)
  const [limit] = useState(10)
//   const { toast } = useToast()

  const offset = currentPage * limit

  const { data: notificationsData, isLoading, error, refetch } = useAdminGetAllNotificationsQuery({ limit, offset })

  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation()


  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap()
    //   toast({
    //     title: "Success",
    //     description: "Notification deleted successfully",
    //   })
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete notification",
    //     variant: "destructive",
    //   })
    }
  }

//   const handleBulkDelete = async () => {
//     if (selectedNotifications.length === 0) return

//     try {
//       await bulkDeleteNotifications(selectedNotifications).unwrap()
//       toast({
//         title: "Success",
//         description: `${selectedNotifications.length} notifications deleted successfully`,
//       })
//       setSelectedNotifications([])
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete notifications",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedNotifications(notificationsData?.notifications.map((n) => n.id) || [])
//     } else {
//       setSelectedNotifications([])
//     }
//   }



//   const isNotificationActive = (notification: Notification) => {
//     const now = new Date()
//     // const startsAt = notification.startsAt ? new Date(notification.startsAt) : null
//     // const endsAt = notification.endsAt ? new Date(notification.endsAt) : null

//     if (startsAt && now < startsAt) return false
//     if (endsAt && now > endsAt) return false
//     return true
//   }

  const totalPages = notificationsData ? Math.ceil(notificationsData?.data?.total / limit) : 0
  // const allSelected =
  //   selectedNotifications.length === notificationsData?.data?.length &&
  //   notificationsData?.notifications.length > 0
  // const someSelected =
  //   selectedNotifications?.length > 0 && selectedNotifications.length < (notificationsData?.notifications.length || 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading notifications...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <p className="text-red-400 mb-4">Failed to load notifications</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">All Notifications</h1>
            <p className="text-gray-400">Manage your push notifications</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">Total: {notificationsData?.data?.length || 0} notifications</div>
      </div>

      {/* Bulk Actions */}
      {/* {notificationsData && notificationsData?.data?.length > 0 && (
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="border-gray-600"
              ref={(ref) => {
                if (ref) {
                  ref.indeterminate = someSelected
                }
              }}
            />
            <span className="text-sm text-gray-300">
              {selectedNotifications.length > 0 ? `${selectedNotifications.length} selected` : "Select all"}
            </span>
          </div>

          {selectedNotifications.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Notifications</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    Are you sure you want to delete {selectedNotifications.length} notification(s)? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )} */}

      {/* Notifications List */}
      <div className="space-y-4">
        {notificationsData?.data?.map((notification:any, index:number) => (
          <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                    className="border-gray-600 mt-1"
                  /> */}
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-white text-xl">{notification?.notification?.title}</CardTitle>
                    <CardContent className=" px-0">
                      {notification?.notification?.message}
                    </CardContent>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {index === 0 && currentPage === 0 && <Badge className="bg-blue-600 hover:bg-blue-700">Latest</Badge>}

                  {/* {isNotificationActive(notification) ? (
                    <Badge variant="outline" className="border-green-600 text-green-400">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      Inactive
                    </Badge>
                  )} */}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Notification</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Are you sure you want to delete "{notification.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(notification?.notification?.id)}
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

            <CardContent className="space-y-3">
              <p className="text-gray-300">{notification.message}</p>

              {/* FCM Tokens */}
              {/* {notification.fcmTokens && notification.fcmTokens.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      Recipients ({notification.fcmTokens.length})
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {notification.fcmTokens.length === 1
                      ? "1 device token"
                      : `${notification.fcmTokens.length} device tokens`}
                  </div>
                </div>
              )} */}
              <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification?.user?.avatar || "/placeholder.svg"} alt={notification?.user?.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{notification?.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{notification?.user?.email}</p>
                      </div>
                    </div>

              {/* Created At */}
              <div className="text-xs text-gray-500">Created: {new Date(notification?.notification?.createdAt).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">
            Showing {offset + 1} to {Math.min(offset + limit, notificationsData?.total || 0)} of{" "}
            {notificationsData?.total || 0} results
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

      {/* Empty State */}
      {notificationsData?.data?.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No notifications found</p>
          <p className="text-gray-500 text-sm">Create your first notification to get started</p>
        </div>
      )}
    </div>
  )
}

export default NotificationsList;
