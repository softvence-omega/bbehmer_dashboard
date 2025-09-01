
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import {
  Search,
  Eye,
  MoreVertical,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Hash,
  Tag,
} from "lucide-react"
import { useAllPlanQuery } from "../../redux/features/admin/adminNotification"

// Mock hook - replace with your actual RTK Query hook
// const useAllPlanQuery = (params: any) => {
//   // Mock data based on your schema
//   // const mockData = {
//   //   success: true,
//   //   message: "Plans fetched successfully",
//   //   data: [
//   //     {
//   //       id: "price_1RnQKSQNJ9V9C9o5xhhxP5UG",
//   //       object: "price",
//   //       active: true,
//   //       billing_scheme: "per_unit",
//   //       created: 1753129736,
//   //       currency: "usd",
//   //       custom_unit_amount: null,
//   //       livemode: false,
//   //       lookup_key: null,
//   //       metadata: {
//   //         features: '"feature1,feature2"',
//   //       },
//   //       nickname: null,
//   //       product: "prod_Sis42PuOR7v6EO",
//   //       recurring: {
//   //         interval: "month",
//   //         interval_count: 1,
//   //         meter: null,
//   //         trial_period_days: null,
//   //         usage_type: "licensed",
//   //       },
//   //       tax_behavior: "unspecified",
//   //       tiers_mode: null,
//   //       transform_quantity: null,
//   //       type: "recurring",
//   //       unit_amount: 10000,
//   //       unit_amount_decimal: "10000",
//   //     },
//   //     {
//   //       id: "price_1Rm1oaQNJ9V9C9o56mcOQqS8",
//   //       object: "price",
//   //       active: true,
//   //       billing_scheme: "per_unit",
//   //       created: 1752797176,
//   //       currency: "usd",
//   //       custom_unit_amount: null,
//   //       livemode: false,
//   //       lookup_key: "pro-test-new",
//   //       metadata: {
//   //         features: '"feature1,feature2"',
//   //       },
//   //       nickname: "pro-test-new",
//   //       product: "prod_ShQfhEvFSKAiAW",
//   //       recurring: {
//   //         interval: "month",
//   //         interval_count: 1,
//   //         meter: null,
//   //         trial_period_days: null,
//   //         usage_type: "licensed",
//   //       },
//   //       tax_behavior: "unspecified",
//   //       tiers_mode: null,
//   //       transform_quantity: null,
//   //       type: "recurring",
//   //       unit_amount: 10000,
//   //       unit_amount_decimal: "10000",
//   //     },
//   //     {
//   //       id: "price_1Rly75QNJ9V9C9o5nslK9NPw",
//   //       object: "price",
//   //       active: true,
//   //       billing_scheme: "per_unit",
//   //       created: 1752782947,
//   //       currency: "usd",
//   //       custom_unit_amount: null,
//   //       livemode: false,
//   //       lookup_key: "amdadul-hq",
//   //       metadata: {
//   //         features: '"Developer"',
//   //       },
//   //       nickname: "amdadul-hq",
//   //       product: "prod_ShMqRX4nkydmho",
//   //       recurring: {
//   //         interval: "month",
//   //         interval_count: 1,
//   //         meter: null,
//   //         trial_period_days: null,
//   //         usage_type: "licensed",
//   //       },
//   //       tax_behavior: "unspecified",
//   //       tiers_mode: null,
//   //       transform_quantity: null,
//   //       type: "recurring",
//   //       unit_amount: 100000,
//   //       unit_amount_decimal: "100000",
//   //     },
//   //     {
//   //       id: "price_1RldDcQNJ9V9C9o55x9JnlTL",
//   //       object: "price",
//   //       active: true,
//   //       billing_scheme: "per_unit",
//   //       created: 1752702628,
//   //       currency: "usd",
//   //       custom_unit_amount: null,
//   //       livemode: false,
//   //       lookup_key: null,
//   //       metadata: {
//   //         features: '"feature1,feature2"',
//   //       },
//   //       nickname: "pro",
//   //       product: "prod_Sh1G9e7h21CG7b",
//   //       recurring: {
//   //         interval: "month",
//   //         interval_count: 1,
//   //         meter: null,
//   //         trial_period_days: null,
//   //         usage_type: "licensed",
//   //       },
//   //       tax_behavior: "unspecified",
//   //       tiers_mode: null,
//   //       transform_quantity: null,
//   //       type: "recurring",
//   //       unit_amount: 10000,
//   //       unit_amount_decimal: "10000",
//   //     },
//   //     {
//   //       id: "price_1RldDWQNJ9V9C9o50F2NGGQs",
//   //       object: "price",
//   //       active: false,
//   //       billing_scheme: "per_unit",
//   //       created: 1752702622,
//   //       currency: "usd",
//   //       custom_unit_amount: null,
//   //       livemode: false,
//   //       lookup_key: "pro",
//   //       metadata: {
//   //         features: '"feature1,feature2"',
//   //       },
//   //       nickname: "pro",
//   //       product: "prod_Sh1G9e7h21CG7b",
//   //       recurring: {
//   //         interval: "month",
//   //         interval_count: 1,
//   //         meter: null,
//   //         trial_period_days: null,
//   //         usage_type: "licensed",
//   //       },
//   //       tax_behavior: "unspecified",
//   //       tiers_mode: null,
//   //       transform_quantity: null,
//   //       type: "recurring",
//   //       unit_amount: 10000,
//   //       unit_amount_decimal: "10000",
//   //     },
//   //   ],
//   // }

//   return {
//     data: mockData,
//     isLoading: false,
//     error: null,
//     refetch: () => {},
//   }
// }

interface StripePlan {
  id: string
  object: string
  active: boolean
  billing_scheme: string
  created: number
  currency: string
  custom_unit_amount: null
  livemode: boolean
  lookup_key: string | null
  metadata: {
    features?: string
    [key: string]: any
  }
  nickname: string | null
  product: string
  recurring: {
    interval: string
    interval_count: number
    meter: null
    trial_period_days: null
    usage_type: string
  }
  tax_behavior: string
  tiers_mode: null
  transform_quantity: null
  type: string
  unit_amount: number
  unit_amount_decimal: string
}

const StripePlansList = () => {
  const [currentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<StripePlan | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [pageSize] = useState(10)

  const skip = (currentPage - 1) * pageSize

  const { data, isLoading, error, refetch } = useAllPlanQuery({
    skip,
    take: pageSize,
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const parseFeatures = (metadata: any) => {
    try {
      if (metadata?.features) {
        // Remove extra quotes and parse
        const features = metadata.features.replace(/"/g, "")
        return features.split(",").filter(Boolean)
      }
      return []
    } catch {
      return []
    }
  }

  const handleViewDetails = (plan: StripePlan) => {
    setSelectedPlan(plan)
    setDetailsDialogOpen(true)
  }

  const filterPlans = (plans: StripePlan[]) => {
    return plans?.filter((plan) => {
      const matchesSearch =
        plan?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan?.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan?.lookup_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan?.currency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan?.product?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "all" || (activeTab === "active" && plan.active) || (activeTab === "inactive" && !plan.active)

      return matchesSearch && matchesTab
    })
  }

  const stripePlans = data?.data || []
  const filteredPlans = filterPlans(stripePlans)

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading plans</p>
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
          <h1 className="text-2xl font-bold">Stripe Plans Management</h1>
          <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {stripePlans.length} Total Plans
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
                placeholder="Search by ID, nickname, lookup key, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Plans</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-8 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPlans.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No plans found</p>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "No plans have been created yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const features = parseFeatures(plan.metadata)
            return (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {plan.nickname || plan.lookup_key || "Unnamed Plan"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        ID: {plan.id.substring(0, 10)}...{plan.id.substring(plan.id.length - 6)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(plan)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {plan.active ? (
                              <XCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {plan.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold">{formatCurrency(plan.unit_amount, plan.currency)}</span>
                      <span className="text-muted-foreground">/{plan.recurring.interval}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Currency:</span>
                        <span className="font-medium">{plan.currency.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interval:</span>
                        <span className="font-medium capitalize">
                          {plan.recurring.interval_count > 1
                            ? `${plan.recurring.interval_count} ${plan.recurring.interval}s`
                            : plan.recurring.interval}
                        </span>
                      </div>
                      {plan.lookup_key && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lookup Key:</span>
                          <span className="font-medium text-xs truncate max-w-[120px]" title={plan.lookup_key}>
                            {plan.lookup_key}
                          </span>
                        </div>
                      )}
                      {features.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Features:</span>
                          <span className="font-medium text-xs">{features.join(", ")}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">{formatDate(plan.created)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">{plan.type}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(plan)}
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

      {/* Plan Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan Details</DialogTitle>
            <DialogDescription>Detailed information about this Stripe plan</DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Plan ID</Label>
                    <p className="font-mono text-sm break-all">{selectedPlan.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Product ID</Label>
                    <p className="font-mono text-sm break-all">{selectedPlan.product}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Nickname</Label>
                    <p className="font-medium">{selectedPlan.nickname || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Lookup Key</Label>
                    <p className="font-medium">{selectedPlan.lookup_key || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <Badge variant={selectedPlan.active ? "default" : "secondary"}>
                      {selectedPlan.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Live Mode</Label>
                    <Badge variant={selectedPlan.livemode ? "default" : "secondary"}>
                      {selectedPlan.livemode ? "Live" : "Test"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Amount</Label>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedPlan.unit_amount, selectedPlan.currency)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Currency</Label>
                    <p className="font-medium">{selectedPlan.currency.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Billing Scheme</Label>
                    <p className="font-medium capitalize">{selectedPlan.billing_scheme.replace("_", " ")}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{selectedPlan.type}</p>
                  </div>
                </div>
              </div>

              {/* Recurring Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Recurring Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Interval</Label>
                    <p className="font-medium capitalize">{selectedPlan.recurring.interval}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Interval Count</Label>
                    <p className="font-medium">{selectedPlan.recurring.interval_count}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Usage Type</Label>
                    <p className="font-medium capitalize">{selectedPlan.recurring.usage_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Trial Period</Label>
                    <p className="font-medium">
                      {selectedPlan.recurring.trial_period_days
                        ? `${selectedPlan.recurring.trial_period_days} days`
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata & Features */}
              {Object.keys(selectedPlan.metadata).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Metadata & Features
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedPlan.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <Label className="text-sm text-muted-foreground capitalize">{key}:</Label>
                        <p className="font-medium text-sm">
                          {key === "features" ? parseFeatures(selectedPlan.metadata).join(", ") : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Created</Label>
                    <p className="font-medium">{formatDate(selectedPlan.created)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StripePlansList
