"use client"

import { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Search,
  Eye,
  MoreVertical,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Shield,
  Crown,
  Ban,
  UserCheck,
  CreditCard,
} from "lucide-react"
import CustomerDetailsDialog from "./customer-details"
import { useGetAllCustomerQuery } from "../../redux/features/admin/adminNotification"

interface Customer {
  id: string
  name: string
  email: string
  xp: number
  ipAddress: string
  createdAt: string
  subscriptionPlan: string
  planStartedAt: string
  isAdmin: boolean
  isLogIn: boolean
  lastLoginAt: string
  isSuspend: boolean
  stripeCustomerId: string
  stripeSubscriptionId: string | null
}

interface StripeCustomer {
  id: string
  object: string
  balance: number
  created: number
  currency: string | null
  delinquent: boolean
  email: string
  name: string
  metadata: Record<string, any>
  next_invoice_sequence: number
  tax_exempt: string
}

const StripeCustomersList = () => {
  const [currentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [pageSize] = useState(12)

  const skip = (currentPage - 1) * pageSize
  const { data, isLoading, error, refetch } = useGetAllCustomerQuery({
    skip,
    take: pageSize,
  })

//   const [toggleSuspension, { isLoading: isToggling }] = useToggleCustomerSuspensionMutation()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "pro":
      case "premium":
        return "default"
      case "free":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleViewDetails = (stripeCustomerId: string) => {
    setSelectedCustomerId(stripeCustomerId)
    setDetailsDialogOpen(true)
  }


  const filterCustomers = (customers: Customer[]) => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.stripeCustomerId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && customer.isLogIn && !customer.isSuspend) ||
        (activeTab === "suspended" && customer.isSuspend) ||
        (activeTab === "admin" && customer.isAdmin) ||
        (activeTab === "premium" && customer.subscriptionPlan !== "free")

      return matchesSearch && matchesTab
    })
  }

  const dbCustomers = data?.data?.db || []
  const stripeCustomers = data?.data?.stripe || []
  const filteredCustomers = filterCustomers(dbCustomers)

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading customers</p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customers and their subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {dbCustomers.length} Total Customers
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No customers found</p>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "No customers have been registered yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const stripeCustomer = stripeCustomers.find((sc: StripeCustomer) => sc.id === customer.stripeCustomerId)

            return (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={customer.name} />
                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {customer.name}
                          {customer.isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(customer.stripeCustomerId)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        //   disabled={isToggling}
                        >
                          {customer.isSuspend ? (
                            <UserCheck className="h-4 w-4 mr-2" />
                          ) : (
                            <Ban className="h-4 w-4 mr-2" />
                          )}
                          {customer.isSuspend ? "Unsuspend" : "Suspend"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getPlanBadgeVariant(customer.subscriptionPlan)}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        {customer.subscriptionPlan}
                      </Badge>
                      <Badge variant={customer.isLogIn ? "default" : "secondary"}>
                        {customer.isLogIn ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {customer.isLogIn ? "Online" : "Offline"}
                      </Badge>
                      {customer.isSuspend && (
                        <Badge variant="destructive">
                          <Ban className="h-3 w-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                      {customer.isAdmin && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">XP Points:</span>
                        <span className="font-medium">{customer.xp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined:</span>
                        <span className="font-medium">{formatDate(customer.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Login:</span>
                        <span className="font-medium">{formatDate(customer.lastLoginAt)}</span>
                      </div>
                      {stripeCustomer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stripe Balance:</span>
                          <span className="font-medium">
                            {stripeCustomer.balance === 0 ? "$0.00" : `$${(stripeCustomer.balance / 100).toFixed(2)}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(customer.stripeCustomerId)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Customer Details Dialog */}
     {
        selectedCustomerId &&  <CustomerDetailsDialog
        stripeCustomerId={selectedCustomerId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
     }
    </div>
  )
}

export default StripeCustomersList
