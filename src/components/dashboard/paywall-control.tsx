import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Plus, Settings, Trash } from "lucide-react"
import { Switch } from "../ui/switch"
import { useAdminPaywallControlDeleteMutation, useAdminPaywallControlMutation, useAdminpaywallControlQuery, useAdminPaywallControlUpdateMutation } from "../../redux/features/admin/adminNotification"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import DeleteConfirmDialog from "./notes-delete"
import { useState } from "react"


type FeatureFlagFormData = {
  id: string
  featureTitle: string
  featureKey: string
  featureDescription: string
  plan: string
  enabled: boolean
}

const PaywallControl =() => {

  const {data} = useAdminpaywallControlQuery(undefined)
  const [adminPaywallControl] =useAdminPaywallControlMutation()
  const [adminPaywallControlUpdate] = useAdminPaywallControlUpdateMutation()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId,setSelectedId] = useState<string | null>()
  const [deletePaywall,{isLoading:isDeleting}]= useAdminPaywallControlDeleteMutation()

  const confirmDelete = async () => {
      if (!selectedId) return
  
      try {
        await deletePaywall({id:selectedId}).unwrap()
        toast.success("Paywall removed successfully")
        setDeleteDialogOpen(false)
        setSelectedId(null)
      } catch (error) {
        toast.error("Failed to remove ban")
        console.error("Delete ban error:", error)
      }
    }
  // const [features, setFeatures] = useState<Feature[]>([
    //   {
      //     id: "1",
      //     name: "Advanced Analytics",
      //     description: "Detailed analytics and reporting features",
      //     isPaid: true,
      //     isEnabled: true,
      //   },
      //   {
        //     id: "2",
        //     name: "Export Data",
        //     description: "Export data in various formats",
        //     isPaid: true,
        //     isEnabled: true,
        //   },
        //   {
          //     id: "3",
          //     name: "Basic Dashboard",
          //     description: "Standard dashboard view",
          //     isPaid: false,
          //     isEnabled: true,
          //   },
          //   {
            //     id: "4",
            //     name: "Premium Templates",
            //     description: "Access to premium template library",
            //     isPaid: true,
            //     isEnabled: false,
            //   },
            // ])
            
            // const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
            //   {
            //     id: "1",
            //     name: "Beta UI",
            //     description: "New user interface design",
            //     isEnabled: true,
            //     targetUsers: ["user1", "user2"],
            //     targetGroups: ["beta-testers"],
            //   },
            //   {
            //     id: "2",
            //     name: "AI Assistant",
            //     description: "AI-powered assistant feature",
            //     isEnabled: false,
            //     targetUsers: [],
            //     targetGroups: ["premium-users"],
            //   },
            // ])
            
            // const [newFeature, setNewFeature] = useState({
            //   name: "",
            //   description: "",
            //   isPaid: false,
            // })
            
            // const [newFlag, setNewFlag] = useState({
            //   name: "",
            //   description: "",
            //   targetGroup: "",
            // })
            
            // const toggleFeature = (id: string, field: "isPaid" | "isEnabled") => {
            //   // setFeatures(features.map((feature) => (feature.id === id ? { ...feature, [field]: !feature[field] } : feature)))
            // }
            
            // const toggleFeatureFlag = (id: string) => {
            //   setFeatureFlags(featureFlags.map((flag) => (flag.id === id ? { ...flag, isEnabled: !flag.isEnabled } : flag)))
            // }
            
            // const addFeature = () => {
            //   if (newFeature.name && newFeature.description) {
            //     const feature: Feature = {
            //       id: Date.now().toString(),
            //       name: newFeature.name,
            //       description: newFeature.description,
            //       isPaid: newFeature.isPaid,
            //       isEnabled: true,
            //     }
            //     // setFeatures([...features, feature])
            //     setNewFeature({ name: "", description: "", isPaid: false })
            //   }
            // }
            
            // const addFeatureFlag = () => {
            //   if (newFlag.name && newFlag.description) {
            //     const flag: FeatureFlag = {
            //       id: Date.now().toString(),
            //       name: newFlag.name,
            //       description: newFlag.description,
            //       isEnabled: false,
            //       targetUsers: [],
            //       targetGroups: newFlag.targetGroup ? [newFlag.targetGroup] : [],
            //     }
            //     setFeatureFlags([...featureFlags, flag])
            //     setNewFlag({ name: "", description: "", targetGroup: "" })
            //   }
            // }

              const { register, handleSubmit, control, formState: { errors } } = useForm<FeatureFlagFormData>({
              defaultValues: {
                enabled: true,
              },
            })

            // if(isLoading || isPaywallControlLoading || isPaywallUpdateLoading) return <div>Loading...</div>
            const features = data?.data || []
            const onSubmit = async(data: FeatureFlagFormData) => {
              console.log(data)

              try{
                const res =  await adminPaywallControl(data)
                console.log(res)
                if(res.data.success){
                  // Optionally, you can show a success message or update the UI
                 toast.success("Paywall control updated successfully")
                  // console.log("Paywall control updated successfully")
                }
              }catch(error){
                console.error("Failed to update paywall control:", error)
                toast.error("Failed to update paywall control")
              }
              
              // const newFlag: FeatureFlag = {
              //   id: Date.now().toString(),
              //   name: data.name,
              //   description: data.description,
              //   isEnabled: data.enabled,
              //   targetUsers: [],
              //   targetGroups: [data.targetGroup],
              // }
              // setFeatureFlags([...featureFlags, newFlag])
              // setNewFlag({ name: "", description: "", targetGroup: "" })
            }
            
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Paywall Control</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{features.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{features.filter((f:any) => f.plan === "pro").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{features.filter((f:FeatureFlagFormData) => f.enabled).length}</div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beta Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card> */}
      </div>

      {/* Feature Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Management
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </DialogTrigger>
                <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="featureTitle">Feature Title</Label>
          <Input
            id="featureTitle"
            placeholder="Enter Feature Title"
            {...register("featureTitle", { required: "Feature Title is required" })}
          />
          {errors.featureTitle && <p className="text-sm text-red-500">{errors.featureTitle.message}</p>}
        </div>

        <div>
          <Label htmlFor="featurekey">Feature Key</Label>
          {/* <Input
            id="feature-key"
            placeholder="Enter feature key"
            {...register("featureKey", { required: "Feature key is required" })}
          /> */}
          <Controller
            name="featureKey"
            control={control}
            rules={{ required: "Target group is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Feature Key" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="share">Share</SelectItem>
                  <SelectItem value="cafe-log">Cafe log</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  {/* <SelectItem value="admin-users">Admin Users</SelectItem> */}
                  {/* <SelectItem value="all-users">All Users</SelectItem> */}
                </SelectContent>
              </Select>
            )}
          />
          {errors.featureKey && <p className="text-sm text-red-500">{errors.featureKey.message}</p>}
        </div>

        {/* export enum FeatureKey {
  SHARE = 'share',
  CAFE_LOG = 'cafe-log',
  ANALYTICS = 'analytics',
  EXPORT = 'export',
} */}

        <div>
          <Label htmlFor="flag-description">Description</Label>
          <Input
            id="flag-description"
            placeholder="Enter flag description"
            {...register("featureDescription", { required: "Description is required" })}
          />
          {errors.featureDescription && <p className="text-sm text-red-500">{errors.featureDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="target-group">Plan Select</Label>
          <Controller
            name="plan"
            control={control}
            rules={{ required: "Target group is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  {/* <SelectItem value="admin-users">Admin Users</SelectItem> */}
                  {/* <SelectItem value="all-users">All Users</SelectItem> */}
                </SelectContent>
              </Select>
            )}
          />
          {errors.plan && <p className="text-sm text-red-500">{errors.plan.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">Enabled</Label>
          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Add Feature Flag
        </Button>
      </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Behind Paywall</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature:FeatureFlagFormData) => (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{feature.featureTitle}</div>
                        <div className="text-sm text-muted-foreground">{feature.featureDescription}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={feature.plan === "free" ? "outline" :  "default"}>{feature.plan === "free" ? "Free" : "Paid"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => adminPaywallControlUpdate({id:feature.id, data:{ enabled:!feature.enabled }})}
                        />
                        <span className="text-sm">{feature.enabled ? "Enabled" : "Disabled"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* <Switch checked={feature.isPaid} onCheckedChange={() => toggleFeature(feature.id, "isPaid")} /> */}
                        <span className="text-sm">{feature.plan === "pro" ? "Paid" : "Free"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div onClick={()=>{setSelectedId(feature.id);setDeleteDialogOpen(true)}} className="flex items-end">
                         <Trash/>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DeleteConfirmDialog
            open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
            title="Delete Paywall Feature?"
  description="Are you sure you want to delete this paywall feature? This action cannot be undone."
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Feature Flags & Beta Access
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Flag
              </Button>
            </DialogTrigger>
            <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="flag-name">Flag Name</Label>
          <Input
            id="flag-name"
            placeholder="Enter flag name"
            {...register("name", { required: "Flag name is required" })}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="feature-key">Feature Key</Label>
          <Input
            id="feature-key"
            placeholder="Enter feature key"
            {...register("featureKey", { required: "Feature key is required" })}
          />
          {errors.featureKey && <p className="text-sm text-red-500">{errors.featureKey.message}</p>}
        </div>

        <div>
          <Label htmlFor="flag-description">Description</Label>
          <Input
            id="flag-description"
            placeholder="Enter flag description"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="target-group">Target Group</Label>
          <Controller
            name="targetGroup"
            control={control}
            rules={{ required: "Target group is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beta-testers">Beta Testers</SelectItem>
                  <SelectItem value="premium-users">Premium Users</SelectItem>
                  <SelectItem value="admin-users">Admin Users</SelectItem>
                  <SelectItem value="all-users">All Users</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.targetGroup && <p className="text-sm text-red-500">{errors.targetGroup.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">Enabled</Label>
          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Add Feature Flag
        </Button>
      </form>
    </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Target Groups</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featureFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.name}</div>
                        <div className="text-sm text-muted-foreground">{flag.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {flag.targetGroups.map((group:any) => (
                          <Badge key={group} variant="outline" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={flag.isEnabled ? "default" : "secondary"}>
                        {flag.isEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={flag.isEnabled} onCheckedChange={() => toggleFeatureFlag(flag.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}


export default PaywallControl;