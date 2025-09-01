
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DollarSign, CreditCard, CheckCircle, XCircle, Database, ExternalLink, Tag, Clock, Hash } from "lucide-react"

interface PlanDetailsDialogProps {
  planId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  dbPlans: any[]
  stripePlans: any[]
}

export default function PlanDetailsDialog({
  planId,
  open,
  onOpenChange,
  dbPlans,
  stripePlans,
}: PlanDetailsDialogProps) {
  const dbPlan = dbPlans.find((plan) => plan.id === planId)
  const stripePlan = stripePlans.find((plan) => plan.id === dbPlan?.stripePriceId)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

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

  const formatUnixTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const parseMetadata = (metadata: string | object) => {
    try {
      if (typeof metadata === "string") {
        if (metadata.startsWith("{")) {
          return JSON.parse(metadata)
        }
        return { raw: metadata.replace(/"/g, "") }
      }
      return metadata
    } catch {
      return { raw: metadata }
    }
  }

  if (!dbPlan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan Details: {dbPlan.lookupKey}
          </DialogTitle>
          <DialogDescription>Complete information about this subscription plan</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database Info</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Info Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{dbPlan.lookupKey}</CardTitle>
                    <p className="text-muted-foreground">Price ID: {dbPlan.stripePriceId}</p>
                  </div>
                  <Badge variant={dbPlan.active ? "default" : "secondary"} className="text-sm">
                    {dbPlan.active ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                    {dbPlan.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pricing */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(dbPlan.unitAmount, dbPlan.currency)}</span>
                        <span className="text-muted-foreground">/{dbPlan.interval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Currency: {dbPlan.currency.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Database Status:</span>
                        <Badge variant={dbPlan.active ? "default" : "secondary"}>
                          {dbPlan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {stripePlan && (
                        <div className="flex justify-between">
                          <span>Stripe Status:</span>
                          <Badge variant={stripePlan.active ? "default" : "secondary"}>
                            {stripePlan.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            {dbPlan.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Features & Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(parseMetadata(dbPlan.metadata)).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Plan ID</p>
                      <p className="font-mono text-xs break-all">{dbPlan.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Product ID</p>
                      <p className="font-mono text-xs break-all">{dbPlan.productId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stripe Price ID</p>
                      <p className="font-mono text-xs break-all">{dbPlan.stripePriceId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lookup Key</p>
                      <p className="font-medium">{dbPlan.lookupKey}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Lookup Key in Stripe</p>
                      <p className="font-medium">{dbPlan.lookupKeyInStripe || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created At</p>
                      <p className="font-medium">{formatDate(dbPlan.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Updated At</p>
                      <p className="font-medium">{formatDate(dbPlan.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Status</p>
                      <Badge variant={dbPlan.active ? "default" : "secondary"}>
                        {dbPlan.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stripe" className="space-y-6">
            {stripePlan ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Stripe Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Price ID</p>
                          <p className="font-mono text-xs">{stripePlan.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Product ID</p>
                          <p className="font-mono text-xs">{stripePlan.product}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Nickname</p>
                          <p className="font-medium">{stripePlan.nickname || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Billing Scheme</p>
                          <p className="font-medium capitalize">{stripePlan.billing_scheme}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">{stripePlan.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tax Behavior</p>
                          <p className="font-medium capitalize">{stripePlan.tax_behavior}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Live Mode</p>
                          <Badge variant={stripePlan.livemode ? "default" : "secondary"}>
                            {stripePlan.livemode ? "Live" : "Test"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{formatUnixTimestamp(stripePlan.created)}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recurring Details */}
                    {stripePlan.recurring && (
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recurring Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Interval</p>
                            <p className="font-medium capitalize">{stripePlan.recurring.interval}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interval Count</p>
                            <p className="font-medium">{stripePlan.recurring.interval_count}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Usage Type</p>
                            <p className="font-medium capitalize">{stripePlan.recurring.usage_type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Trial Period Days</p>
                            <p className="font-medium">{stripePlan.recurring.trial_period_days || "None"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Metadata */}
                    {stripePlan.metadata && Object.keys(stripePlan.metadata).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Stripe Metadata
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(stripePlan.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No Stripe data found for this plan</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
