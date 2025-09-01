"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { ScrollText, Hash, Info } from "lucide-react"
import { useAdminGetLogQuery } from "../../redux/features/admin/adminNotification"

interface AdminLogDetailsDialogProps {
  logId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AdminLogDetailsDialog({ logId, open, onOpenChange }: AdminLogDetailsDialogProps) {
  const {
    data: logDetails,
    isLoading,
    error,
  } = useAdminGetLogQuery(logId!, {
    skip: !logId || !open,
  })

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

  const getActionBadgeVariant = (action: string) => {
    if (action?.startsWith("CREATE")) return "default"
    if (action?.startsWith("UPDATE")) return "secondary"
    if (action?.startsWith("DELETE")) return "destructive"
    return "outline"
  }

  if (!logId) return null

  const log = logDetails?.data?.[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Audit Log Details
          </DialogTitle>
          <DialogDescription>Detailed information about this administrative action</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading log details</p>
          </div>
        ) : log ? (
          <div className="space-y-6">
            {/* Log Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{log.action.replace(/_/g, " ")}</CardTitle>
                    <p className="text-muted-foreground">Action performed by an administrator</p>
                  </div>
                  <Badge variant={getActionBadgeVariant(log.action)} className="text-sm">
                    {log.action.split("_")[0]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Admin ID</p>
                      <p className="font-mono text-xs break-all">{log.adminId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timestamp</p>
                      <p className="font-medium">{formatDate(log.createdAt)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Entity Type</p>
                      <p className="font-medium">{log.entity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Entity ID</p>
                      <p className="font-mono text-xs break-all">{log.entityId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            {log.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{JSON.stringify(log.metadata, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Raw Log Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Raw Log Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Log ID:</span>
                    <span className="font-mono text-xs break-all">{log.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{log.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entity:</span>
                    <span className="font-medium">{log.entity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entity ID:</span>
                    <span className="font-mono text-xs break-all">{log.entityId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At:</span>
                    <span className="font-medium">{formatDate(log.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
