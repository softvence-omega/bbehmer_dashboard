"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Loader2, User, Mail, Lock, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useCreadintialsChangeMutation, useUserInformationQuery } from "../../redux/features/auth/authApi"

// Validation schema
const credentialsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
})

type CredentialsFormData = z.infer<typeof credentialsSchema>

const AdminCreadintialsChange = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showpass,setShowPass] = useState(false)

  const [creadintialsChange, { isLoading: isChangingPassword }] = useCreadintialsChangeMutation()
  const { data, isLoading } = useUserInformationQuery(undefined)

  // Always call useForm hook - never conditionally
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  // Update form values when data is loaded
  useEffect(() => {
    if (data?.data?.user) {
      const userInfo = data.data.user
      reset({
        name: userInfo.name || "",
        email: userInfo.email || "",
        password: "",
      })
    }
  }, [data, reset])

  const onSubmit = async (formData: CredentialsFormData) => {
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const res = await creadintialsChange(formData)

      // Check if the mutation was successful
      if (res.data) {
        setSubmitSuccess(true)
        // Reset form after successful submission
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 3000)
      } else if (res.error) {
        setSubmitError("Failed to update credentials. Please try again.")
      }
    } catch (error) {
      setSubmitError("Failed to update credentials. Please try again.")
    }
  }

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading user information...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Update Credentials</CardTitle>
          <CardDescription className="text-center">Update your account information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`pl-10 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showpass? "text" : "password"}
                  placeholder="Enter new password"
                  className={`pl-10 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("password")}
                />
                {showpass ? <Eye onClick={()=>setShowPass(false)} className="absolute right-3 top-3 h-4 w-4 text-gray-400"/> : <EyeOff onClick={()=>setShowPass(true)} className="absolute right-3 top-3 h-4 w-4 text-gray-400"/>}
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              <p className="text-xs text-gray-500">
                Password must contain at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Credentials updated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {submitError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={!isValid || !isDirty || isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Credentials"
              )}
            </Button>

            {/* Reset Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                if (data?.data?.user) {
                  const userInfo = data.data.user
                  reset({
                    name: userInfo.name || "",
                    email: userInfo.email || "",
                    password: "",
                  })
                }
                setSubmitError(null)
                setSubmitSuccess(false)
              }}
              disabled={isChangingPassword}
            >
              Reset Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminCreadintialsChange
