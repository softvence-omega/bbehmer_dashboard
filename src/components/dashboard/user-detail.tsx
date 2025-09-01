import { ArrowLeft, Mail, Calendar, Activity, Star, FileText, Heart, Ban, RotateCcw, CreditCard, Bell } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useGetUserDetailsQuery } from "../../redux/features/admin/adminManagementApi"
interface UserDetailProps {
  userId: string
  onBack: () => void
  setActionType:any
}

const UserDetail = ({userId, onBack, setActionType }: UserDetailProps) => {
    const {
     data,
   } = useGetUserDetailsQuery({id:userId});

   const user = data?.data
  // const user = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   subscriptionPlan: "paid",
  //   createdAt: "2024-01-01T10:00:00Z",
  //   lastActivity: "2024-07-05T14:30:00Z",
  //   isSuspend: false,
  //   ratings: 25,
  //   notes: 12,
  //   favorites: 8,
  //   subscriptionStart: "2024-01-01T00:00:00Z",
  //   subscriptionEnd: "2025-01-01T00:00:00Z",
  //   totalSpent: "99.99"
  // }

  // const recentActivity = [
  //   { action: "Created note", item: "Meeting Notes", date: "2024-01-20" },
  //   { action: "Added favorite", item: "Project Alpha", date: "2024-01-19" },
  //   { action: "Rated item", item: "Design System", date: "2024-01-18" },
  //   { action: "Updated profile", item: "Profile Settings", date: "2024-01-17" },
  // ]

  const getStatusBadge = (status:boolean) => {
  

    return <Badge variant={status ? "default" : "secondary"}>{status ? "Suspended" : "Active"}</Badge>
  }

  const getSubscriptionBadge = (subscription: string) => {
    return <Badge variant={subscription === "paid" ? "default" : "outline"}>{subscription}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {
            user?.isSuspend ? <Button onClick={()=>{setActionType("Unsuspend")}} variant="outline" size="sm">
            <Ban className="h-4 w-4 mr-2" />
            UnSuspend User
          </Button> : <Button onClick={()=>{setActionType("suspend")}} variant="outline" size="sm">
            <Ban className="h-4 w-4 mr-2" />
            Suspend User
          </Button>
          }
          <Button onClick={() => setActionType("reset")} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
          <Button onClick={()=>{setActionType("notification")}} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.ratings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.notes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.favorites}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.totalSpent}</div>
          </CardContent>
        </Card>
      </div>

      {/* User? Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {getStatusBadge(user?.isSuspend)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Subscription</span>
              {getSubscriptionBadge(user?.subscriptionPlan)}
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Joined {new Date(user?.createdAt).toDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last active {user?.lastActivity}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan</span>
              <span className="text-sm">Premium Monthly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Started</span>
              <span className="text-sm">{new Date(user?.planStartedAt).toDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expires</span>
              <span className="text-sm">{user?.subscriptionEnd}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="text-sm font-bold">{user?.totalSpent}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>{activity.item}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  )
}


export default UserDetail;