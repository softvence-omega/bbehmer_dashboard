"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Megaphone, User, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useAdminAnnoucementMutation, useAdminGetAllAnnouncementsQuery } from "../../redux/features/admin/adminNotification"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../../lib/utils"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { Link } from "react-router-dom"

interface AnnouncementData {
  title: string
  message: string
  startsAt: string
  endsAt: string
}




const AnnouncementPage = () => {
  const {data:announcementsData,isLoading} = useAdminGetAllAnnouncementsQuery({})
  const announcements = announcementsData?.data
  // const [announcements, setAnnouncements] = useState<Announcement[]>([
  //   {
  //     id: "1",
  //     title: "Welcome to Our New Platform",
  //     message:
  //       "We're excited to announce the launch of our new company platform. This will serve as the central hub for all company communications and updates.",
  //     createdAt: "2024-01-15",
  //     author: "Admin",
  //     startsAt: "2024-01-15T09:00",
  //     endsAt: "2024-01-30T17:00",
  //   },
  // ])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [adminAnnounce, { isLoading: isMutating }] = useAdminAnnoucementMutation()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AnnouncementData>()
useEffect(() => {
  if (startDate) {
    setValue("startsAt", startDate.toISOString(), { shouldValidate: true })
  }
}, [startDate, setValue])

useEffect(() => {
  if (endDate) {
    setValue("endsAt", endDate.toISOString(), { shouldValidate: true })
  }
}, [endDate, setValue])

  const onSubmit = async (data: AnnouncementData) => {
    try {
      const announcementData = {
        ...data
      }
      console.log(data)
      // Use RTK Query mutation
      const result = await adminAnnounce({data:announcementData}).unwrap()
      console.log(result)


      // Add the new announcement to local state
      // const newAnnouncement: Announcement = {
      //   ...result,
      //   id: result.id || Date.now().toString(),
      //   createdAt: result.createdAt || new Date().toISOString().split("T")[0],
      //   author: result.author || "Admin",
      // }

      // setAnnouncements((prev) => [newAnnouncement, ...prev])

      // Reset form and show success message
      reset()
      setStartDate(undefined)
      setEndDate(undefined)
      // toast({
      //   title: "Success!",
      //   description: "Announcement published successfully.",
      // })
    } catch (error) {
      // Handle mutation error
      console.error("Failed to create announcement:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to publish announcement. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Megaphone className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold">Company Announcements</h1>
          </div>
          <p className="text-gray-400 text-lg">Stay updated with the latest company news and updates</p>
        </div>

        {/* Admin Form */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin Panel
            </CardTitle>
            <CardDescription className="text-gray-400">Create a new company announcement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Announcement Title
                </Label>
                <Input
                  id="title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters long",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must be less than 100 characters",
                    },
                  })}
                  placeholder="Enter announcement title..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isMutating}
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message
                </Label>
                <Textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters long",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Message must be less than 1000 characters",
                    },
                  })}
                  placeholder="Enter your announcement message..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                  disabled={isMutating}
                />
                {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
              </div>

              <div className="flex justify-between md:flex-row flex-col gap-x-3">

                  <div className="space-y-2 w-full">
                <Label className="text-white">Start Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                        !startDate && "text-gray-500",
                      )}
                      disabled={isMutating}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP p") : "Pick start date & time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="bg-gray-900 text-white"
                    />
                    <div className="p-3 border-t border-gray-700">
                      <Label className="text-white text-sm">Time</Label>
                      <Input
                        type="time"
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        onChange={(e) => {
                          if (startDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(startDate)
                            newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                            setStartDate(newDate)
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  {...register("startsAt", { required: "Start time is required" })}
                  value={startDate ? startDate.toDateString() : ""}
                />
                {errors.startsAt && <p className="text-red-400 text-sm">{errors.startsAt.message}</p>}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-white">End Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                        !endDate && "text-gray-500",
                      )}
                      disabled={isMutating}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP p") : "Pick end date & time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="bg-gray-900 text-white"
                      disabled={(date:any) => (startDate ? date < startDate : false)}
                    />
                    <div className="p-3 border-t border-gray-700">
                      <Label className="text-white text-sm">Time</Label>
                      <Input
                        type="time"
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        onChange={(e) => {
                          if (endDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(endDate)
                            newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                            setEndDate(newDate)
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  {...register("endsAt", { required: "End time is required" })}
                  value={endDate ? endDate.toDateString() : ""}
                />
                {errors.endsAt && <p className="text-red-400 text-sm">{errors.endsAt.message}</p>}
              </div>

              </div>

              <Button
                type="submit"
                disabled={isMutating}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              >
                {isMutating ? "Publishing..." : "Publish Announcement"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold text-white">Recent Announcements</h2>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {announcements?.length} {announcements?.length === 1 ? "announcement" : "announcements"}
                </Badge>
                <Link to="/dashboard/admin/all-announcement">
                  <Button variant={"link"} className="px-1 py-1 text-white text-right">See All</Button>
                </Link>
              </div>
            </div>
          </div>

          { isLoading ? <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Loading Annoucements...</p>
              </CardContent>
            </Card> : announcements?.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No announcements yet</p>
                <p className="text-gray-500 text-sm">Create your first announcement above</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {announcements?.slice(0,5)?.map((announcement:any, index:number) => (
                <Card key={announcement.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-white text-xl">{announcement.title}</CardTitle>
                      </div>
                      {index === 0 && <Badge className="bg-blue-600 hover:bg-blue-700">Latest</Badge>}
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
          )}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementPage
