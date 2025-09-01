import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"


interface PlanDetailsDialogProps {
  plan: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PlanDetailsDialog =({ plan, open, onOpenChange }: PlanDetailsDialogProps) => {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plan Details: {plan.plan}</DialogTitle>
          <DialogDescription>Detailed information about the {plan.plan} plan.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Plan ID:</span>
            <span className="col-span-2 text-sm text-muted-foreground break-all">{plan.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Max Logs Per Month:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{plan.maxLogsPerMonth}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Max Share Count:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{plan.maxShareCount}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Data Retention Days:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{plan.dataRetentionDays}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Upgrade CTA Enabled:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{plan.upgradeCtaEnabled ? "Yes" : "No"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Created At:</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {new Date(plan.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-2">Updated At:</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {new Date(plan.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlanDetailsDialog
