"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
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
import { useAdminPlanLimitsQuery } from "../../redux/features/admin/adminAnalytics"
import PlanDetailsDialog from "./plan-details-dialog"
import { PlanEditDialog } from "./plan-edit-dialog"


const PlanList=()=> {
  const { data: planLimits, error, isLoading } =useAdminPlanLimitsQuery(undefined)
//   const [deletePlanLimit, { isLoading: isDeleting }] = useDeletePlanLimitMutation()

console.log(planLimits)
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleDelete = async (id: string, planName: string) => {
    try {
      console.log(id,planName)
    //   await deletePlanLimit(id).unwrap()
    //   toast({
    //     title: "Success!",
    //     description: `Plan "${planName}" deleted successfully.`,
    //   })
    } catch (err) {
      console.error("Failed to delete plan:", err)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete plan. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading plans...</div>
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading plans
      </div>
    )

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Plan Limits Management</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {planLimits?.data?.map((plan:any) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="capitalize">{plan.plan} Plan</CardTitle>
              <CardDescription>
                Max Logs: {plan.maxLogsPerMonth}, Data Retention: {plan.dataRetentionDays} days
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPlan(plan)
                  setIsDetailsDialogOpen(true)
                }}
              >
                View Details
              </Button>
              <Button
                onClick={() => {
                  setSelectedPlan(plan)
                  setIsEditDialogOpen(true)
                }}
              >
                Edit Plan
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Plan"} */}
                  {/* </Button> */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the{" "}
                      <span className="font-bold capitalize">{plan.plan}</span> plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(plan.id, plan.plan)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        ))}
      </div>

     { isDetailsDialogOpen && (
        <PlanDetailsDialog
          plan={selectedPlan}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
     )}

      <PlanEditDialog plan={selectedPlan} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </div>
  )
}

export default PlanList;
