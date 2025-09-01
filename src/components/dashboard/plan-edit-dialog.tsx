import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAdminUpdatePlanLimitMutation } from "../../redux/features/admin/adminAnalytics"
// import { useToast } from "@/hooks/use-toast"
// Assuming PlanLimit type is consistent with the data structure expected by the mutation
// import type { PlanLimit } from "@/api/planLimitsApi"

// IMPORTANT: Update this import path to match your project's structure
// For example: import { useAdminUpdatePlanLimitMutation } from "@/redux/features/admin/adminAnalytics";
// For this example, I'll use the mutation from the simulated API for consistency within the CodeProject.
// import { useUpdatePlanLimitMutation } from "@/api/planLimitsApi"

// Define the schema for the editable fields
const formSchema = z.object({
  maxLogsPerMonth: z.coerce.number().min(0, "Max Logs must be a non-negative number"),
  maxShareCount: z.coerce.number().min(0, "Max Share must be a non-negative number"),
  dataRetentionDays: z.coerce.number().min(0, "Data Retention must be a non-negative number"),
})

type FormValues = z.infer<typeof formSchema>

interface PlanEditDialogProps {
  plan: any | null // Using PlanLimit type for better type safety
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlanEditDialog({ plan, open, onOpenChange }: PlanEditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxLogsPerMonth: 0,
      maxShareCount: 0,
      dataRetentionDays: 0,
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form
  // Using useUpdatePlanLimitMutation from the simulated API for this CodeProject
  // If you are using useAdminUpdatePlanLimitMutation, replace this line:
  const [updatePlanLimit, { isLoading }] = useAdminUpdatePlanLimitMutation()
//   const { toast } = useToast()

  useEffect(() => {
    if (plan) {
      reset({
        maxLogsPerMonth: plan.maxLogsPerMonth,
        maxShareCount: plan.maxShareCount,
        dataRetentionDays: plan.dataRetentionDays,
      })
    }
  }, [plan, reset])

  const onSubmit = async (data: FormValues) => {
    if (!plan?.id) return

    try {
      // Construct the payload, including non-editable fields from the original plan
      const payload: any = {
        ...plan, // Keep all original plan properties
        ...data, // Override with updated editable fields
      }
      await updatePlanLimit(payload).unwrap()
    //   toast({
    //     title: "Success!",
    //     description: `Plan "${plan.plan}" updated successfully.`,
    //   })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update plan:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update plan. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Plan: {plan.plan}</DialogTitle>
          <DialogDescription>Make changes to the plan details here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plan" className="text-right">
              Plan Name
            </Label>
            <Input id="plan" readOnly value={plan.plan || ""} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxLogsPerMonth" className="text-right">
              Max Logs
            </Label>
            <Input
              id="maxLogsPerMonth"
              type="number"
              {...register("maxLogsPerMonth", { valueAsNumber: true })}
              className="col-span-3"
            />
            {errors.maxLogsPerMonth && (
              <p className="text-red-500 text-xs col-span-4 col-start-2">{errors.maxLogsPerMonth.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxShareCount" className="text-right">
              Max Share
            </Label>
            <Input
              id="maxShareCount"
              type="number"
              {...register("maxShareCount", { valueAsNumber: true })}
              className="col-span-3"
            />
            {errors.maxShareCount && (
              <p className="text-red-500 text-xs col-span-4 col-start-2">{errors.maxShareCount.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataRetentionDays" className="text-right">
              Retention Days
            </Label>
            <Input
              id="dataRetentionDays"
              type="number"
              {...register("dataRetentionDays", { valueAsNumber: true })}
              className="col-span-3"
            />
            {errors.dataRetentionDays && (
              <p className="text-red-500 text-xs col-span-4 col-start-2">{errors.dataRetentionDays.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="upgradeCtaEnabled" className="text-right">
              Upgrade CTA
            </Label>
            <Switch
              id="upgradeCtaEnabled"
              checked={plan.upgradeCtaEnabled ?? false}
              disabled // This field is not editable
              className="col-span-3 justify-self-start"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
