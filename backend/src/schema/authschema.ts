import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    user_name : z.string("Name is required"),
    user_email: z.string("Email is Required").email("Not a valid email"),
    password: z.string("Password is required")
  })
});

export const loginSchema = z.object({
  body: z.object({
    user_email: z.string("Email is Required").email("Not a valid email"),
    password: z.string("Password is required")
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    user_email: z.string("Email is Required").email("Not a valid email")
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string("Reset token is required"),
    new_password: z.string("New password is required")
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    user_email: z.string("Email is Required").email("Not a valid email"),
    otp_code: z.string("OTP code is required")
  })
});

export const resendOTPSchema = z.object({
  body: z.object({
    user_email: z.string("Email is Required").email("Not a valid email")
  })
});

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;
export type ResendOTPPayload = z.infer<typeof resendOTPSchema>;