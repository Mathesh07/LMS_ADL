import { useState, useEffect } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Mail, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/services/api'
import { toast } from 'sonner'

const verifyEmailSchema = z.object({
  otpCode: z.string().min(4, 'OTP must be at least 4 characters').max(10, 'OTP must be at most 10 characters'),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { verifyEmail, isAuthenticated, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Redirect to register if no email provided
  if (!email) {
    return <Navigate to="/register" replace />
  }

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmail(data.otpCode)
    } catch (error) {
      // Error is handled in the AuthContext
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) return

    setIsResending(true)
    try {
      const response = await apiService.post('/auth/resend-otp', { user_email: email })
      
      if (response.success) {
        toast.success('New verification code sent to your email!')
        setResendCooldown(60) // 60 second cooldown
      } else {
        toast.error(response.message || 'Failed to resend verification code')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification code'
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otpCode">Verification Code</Label>
              <Input
                id="otpCode"
                type="text"
                placeholder="Enter verification code"
                maxLength={10}
                {...register('otpCode')}
                className={errors.otpCode ? 'border-destructive' : ''}
              />
              {errors.otpCode && (
                <p className="text-sm text-destructive">{errors.otpCode.message}</p>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the code?</p>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend code'
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
