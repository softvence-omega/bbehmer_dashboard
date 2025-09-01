"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { toast } from "sonner"
import { DollarSign, Package } from "lucide-react"
import { useCreatePlanMutation } from "../../redux/features/admin/adminNotification"

const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name must be less than 100 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  interval: z.enum(["day", "week", "month", "year"], {
    required_error: "Please select a billing interval",
  }),
  currency: z.string().min(3, "Currency code is required").max(3, "Currency must be 3 characters"),
  lookupKey: z
    .string()
    .min(1, "Lookup key is required")
    .max(50, "Lookup key must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Lookup key can only contain letters, numbers, hyphens, and underscores"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  features: z.string().min(1, "At least one feature is required"),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const [createProduct, { isLoading }] = useCreatePlanMutation()

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      amount: 0,
      interval: "month",
      currency: "USD",
      lookupKey: "",
      description: "",
      features: "",
    },
  })

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      await createProduct({
        ...data,
        amount: data.amount * 100, // Convert to cents
      }).unwrap()

      toast.success("Product created successfully!")
      form.reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product")
      console.error("Create product error:", error)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: form.watch("currency") || "USD",
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Product
          </DialogTitle>
          <DialogDescription>Create a new subscription product with pricing and features</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pro Plan" {...field} />
                  </FormControl>
                  <FormDescription>The name of your product as it will appear to customers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product and what it includes..." rows={3} {...field} />
                  </FormControl>
                  <FormDescription>A detailed description of your product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="number"
                          placeholder="10.00"
                          step="0.01"
                          min="0"
                          className="pl-10"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value > 0 && `${formatCurrency(field.value)} per ${form.watch("interval")}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Interval</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Lookup Key */}
            <FormField
              control={form.control}
              name="lookupKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lookup Key</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., pro-plan" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for this product. Use lowercase letters, numbers, hyphens, and underscores only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Features */}
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., feature1,feature2,feature3" rows={2} {...field} />
                  </FormControl>
                  <FormDescription>List the features included in this product, separated by commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
