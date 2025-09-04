import { z } from 'zod'

// Register schema
export const registerSchema = z.object({
  body: z.object({
    user_name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    user_email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
})

// Login schema
export const loginSchema = z.object({
  body: z.object({
    userEmail: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    userPassword: z.string()
      .min(1, 'Password is required')
  })
})

// Verify email schema
export const verifyEmailSchema = z.object({
  body: z.object({
    userEmail: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    otp: z.string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only numbers')
  })
})

// Resend OTP schema
export const resendOTPSchema = z.object({
  body: z.object({
    userEmail: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
  })
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    userEmail: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
  })
})

// Reset password schema
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string()
      .min(1, 'Reset token is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
})

// OAuth schema
export const oauthSchema = z.object({
  params: z.object({
    provider: z.enum(['google', 'github', 'facebook'], {
      message: 'Invalid OAuth provider. Supported providers: google, github, facebook'
    })
  }),
  body: z.object({
    code: z.string().optional(),
    state: z.string().optional(),
    access_token: z.string().optional()
  })
})

// OAuth callback schema
export const oauthCallbackSchema = z.object({
  params: z.object({
    provider: z.enum(['google', 'github', 'facebook'], {
      message: 'Invalid OAuth provider. Supported providers: google, github, facebook'
    })
  }),
  body: z.object({
    code: z.string().min(1, 'Authorization code is required'),
    state: z.string().optional()
  })
})
