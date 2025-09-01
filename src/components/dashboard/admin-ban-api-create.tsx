import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { toast } from "sonner"
import { Shield, Ban } from "lucide-react"
import { useCreateBanIpMutation } from "../../redux/features/admin/adminNotification"

const createBanSchema = z.object({
  ip: z
    .string()
    .min(1, "IP address is required")
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Please enter a valid IP address",
    ),
  reason: z
    .string()
    .min(1, "Reason is required")
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be less than 500 characters"),
  isPermanent: z.boolean().default(false),
  expiresAt: z.string().optional(),
})

type CreateBanFormData = z.infer<typeof createBanSchema>

interface CreateBanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateBanDialog({ open, onOpenChange }: CreateBanDialogProps) {
  const [createBan, { isLoading }] = useCreateBanIpMutation()

  const form = useForm<CreateBanFormData>({
    // resolver: zodResolver(createBanSchema),
    defaultValues: {
      ip: "",
      reason: "",
      isPermanent: false,
      expiresAt: "",
    },
  })

  const isPermanent = form.watch("isPermanent")

  const onSubmit = async (data: CreateBanFormData) => {
    try {
      const banData = {
        ip: data.ip,
        reason: data.reason,
        expiresAt: data.isPermanent ? null : data.expiresAt || null,
      }

      await createBan(banData).unwrap()
      toast.success("Ban created successfully!")
      form.reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create ban")
      console.error("Create ban error:", error)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  // Set default expiry time (24 hours from now)
  const getDefaultExpiryTime = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().slice(0, 16) // Format for datetime-local input
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Create New Ban
          </DialogTitle>
          <DialogDescription>Ban an IP address from accessing the system</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* IP Address */}
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 192.168.1.1" {...field} />
                  </FormControl>
                  <FormDescription>The IP address to ban from the system</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Ban</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Spamming comments, Malicious activity, Terms of service violation..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a detailed reason for this ban</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permanent Ban Checkbox */}
            <FormField
              control={form.control}
              name="isPermanent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Permanent Ban
                    </FormLabel>
                    <FormDescription>
                      If checked, this ban will never expire. Otherwise, set an expiry date below.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Expiry Date (only show if not permanent) */}
            {!isPermanent && (
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={new Date().toISOString().slice(0, 16)}
                        defaultValue={getDefaultExpiryTime()}
                      />
                    </FormControl>
                    <FormDescription>When should this ban expire? Leave empty for 24 hours from now.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} variant="destructive">
                {isLoading ? "Creating Ban..." : "Create Ban"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
