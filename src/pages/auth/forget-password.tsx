'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Loader2,
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useResetCodeSendMutation } from '../../redux/features/auth/authApi';
import { useResetPasswordMutation } from '../../redux/features/admin/adminManagementApi';
import { useNavigate } from 'react-router-dom';

// Step 1 Schema - Email verification
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Step 2 Schema - Password reset
const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    code: z
      .string()
      .min(6, 'Verification code must be 6 characters')
      .max(6, 'Verification code must be 6 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type Step = 'email' | 'reset' | 'success';

export default function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendCode] = useResetCodeSendMutation();
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  // Form for email step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  // Form for password reset step
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Step 1: Send verification code
  const onSendCode = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to send verification code
      const response = await sendCode({ email: data.email });

      if (response.data.success === false) {
        throw new Error('Failed to send verification code');
      }
      console.log(response);
      // Store email and move to next step
      setUserEmail(data.email);
      resetForm.setValue('email', data.email);
      setCurrentStep('reset');
    } catch (error) {
      setError('Failed to send verification code. Please try again.');
      console.error('Send code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password
  const onResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const userInFo = {
        email: data.email,
        newPassword: data.newPassword,
        code: data.code,
      };

      const response = await resetPassword(userInFo);

      if (!response.data) {
        throw new Error('Failed to reset password');
      }

      setCurrentStep('success');
    } catch (error) {
      setError(
        'Failed to reset password. Please check your verification code and try again.',
      );
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToEmail = () => {
    setCurrentStep('email');
    setError(null);
    resetForm.reset();
  };

  const goToLogin = () => {
    // Redirect to login page or reset the flow
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Step Indicator */}
        <div className="flex justify-center pt-6 pb-2">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'email'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'reset' || currentStep === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div
              className={`w-12 h-0.5 ${
                currentStep === 'reset' || currentStep === 'success'
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'reset'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Email Step */}
        {currentStep === 'email' && (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={emailForm.handleSubmit(onSendCode)}
                className="space-y-4"
              >
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
                      className={`pl-10 ${emailForm.formState.errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      {...emailForm.register('email')}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!emailForm.formState.isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* Password Reset Step */}
        {currentStep === 'reset' && (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter the verification code sent to {userEmail} and your new
                password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={resetForm.handleSubmit(onResetPassword)}
                className="space-y-4"
              >
                {/* Email Field (readonly) */}
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      readOnly
                      className="pl-10 bg-gray-50"
                      {...resetForm.register('email')}
                    />
                  </div>
                </div>

                {/* Verification Code */}
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className={`pl-10 ${resetForm.formState.errors.code ? 'border-red-500 focus:border-red-500' : ''}`}
                      {...resetForm.register('code')}
                    />
                  </div>
                  {resetForm.formState.errors.code && (
                    <p className="text-sm text-red-600">
                      {resetForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className={`pl-10 ${resetForm.formState.errors.newPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      {...resetForm.register('newPassword')}
                    />
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className={`pl-10 ${resetForm.formState.errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      {...resetForm.register('confirmPassword')}
                    />
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Password must contain at least 8 characters with uppercase,
                    lowercase, and numbers
                  </p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!resetForm.formState.isValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={goBackToEmail}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Email
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-green-600">
                Password Reset Successful
              </CardTitle>
              <CardDescription className="text-center">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <p className="text-gray-600">
                You can now log in with your new password
              </p>
              <Button onClick={goToLogin} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
