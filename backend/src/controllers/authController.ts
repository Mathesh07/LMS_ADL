import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  RegisterPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ResendOTPPayload
} from '../schema/authschema'
import { db } from '../drizzle'
import { users, userEmailVerification, passwordResetTokens } from '../drizzle/schema'
import { eq, and, gt } from 'drizzle-orm'
import {
  createSession,
  generateSalt,
  generateSessionId,
  hashPassword,
  comparePasswords,
  getSession,
  deleteSession,
  generatePasswordResetToken,
  generateOTP
} from '../utils/authUtils'
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/emailService'

export const registerController = async (
  req: Request<{},{} , RegisterPayload["body"]>,
  res: Response
) => {
    try {
      const {user_name, user_email, password} = req.body
      const user = await db.query.users.findFirst({
        where: eq(users.userEmail, user_email)
      })
      if(user){
          res.status(StatusCodes.BAD_REQUEST).json({success: false, message :'User already exists'})
          return;
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt)

      const [new_user] = await db.insert(users).values({
        userEmail : user_email,
        userName: user_name,
        password : hashedPassword, 
        salt: salt
      }).returning({ id : users.userId, userName: users.userName })

      if(!new_user){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message: "Error While creating user"})
        return
      }

      // Generate and send OTP
      const otpCode = generateOTP()
      await db.insert(userEmailVerification).values({
        userId: new_user.id,
        userEmail: user_email,
        otpCode: otpCode
      })

      // Send OTP email
      const emailSent = await sendOTPEmail(user_email, otpCode, new_user.userName)
      if (!emailSent) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error sending verification email"})
        return
      }

      res.status(StatusCodes.CREATED).json({
        success: true, 
        message: "User successfully created. Please check your email for verification code.",
        userId: new_user.id
      })

    } catch (error) {
      console.log('Register error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error while registering the user"})
    }
}

export const loginController = async (
  req: Request<{},{}, LoginPayload["body"]>,
  res: Response
) => {
    try {
      const { user_email, password } = req.body
      
      const user = await db.query.users.findFirst({
        where: eq(users.userEmail, user_email)
      })
      
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: 'Invalid credentials'})
        return
      }
      
      if (!user.isVerified) {
        res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: 'Please verify your email first'})
        return
      }
      
      if (!user.salt || !user.password) {
        res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: 'Invalid credentials'})
        return
      }
      
      const isPasswordValid = await comparePasswords({
        password,
        salt: user.salt,
        hashedPassword: user.password
      })
      
      if (!isPasswordValid) {
        res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: 'Invalid credentials'})
        return
      }
      
      const sessionId = generateSessionId()
      await createSession(sessionId, user.userId)
      
      res.cookie(process.env.COOKIE_SESSION_KEY!, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.SESSION_EXPIRATION_SECONDS ?? "0", 10) * 1000,
        sameSite: "lax",
      })
      
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Login successful",
        data: {
          id: user.userId,
          name: user.userName,
          email: user.userEmail,
          isVerified: user.isVerified
        }
      })
      
    } catch (error) {
      console.error('Login error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error during login"})
    }
}

export const logoutController = async (
  req: Request,
  res: Response
) => {
    try {
      const sessionId = req.cookies[process.env.COOKIE_SESSION_KEY!]
      
      if (sessionId) {
        await deleteSession(sessionId)
      }
      
      res.clearCookie(process.env.COOKIE_SESSION_KEY!)
      res.status(StatusCodes.OK).json({success: true, message: "Logout successful"})
      
    } catch (error) {
      console.error('Logout error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error during logout"})
    }
}

export const verifyEmailController = async (
  req: Request<{},{}, VerifyEmailPayload["body"]>,
  res: Response
) => {
    try {
      const { user_email, otp_code } = req.body
      
      const verification = await db.query.userEmailVerification.findFirst({
        where: and(
          eq(userEmailVerification.userEmail, user_email),
          eq(userEmailVerification.otpCode, otp_code)
        )
      })
      
      if (!verification) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: 'Invalid OTP code'})
        return
      }
      
      // Check if OTP is expired (10 minutes)
      const otpAge = Date.now() - new Date(verification.createdAt!).getTime()
      // if (otpAge > 10 * 60 * 1000) {
      //   res.status(StatusCodes.BAD_REQUEST).json({success: false, message: 'OTP code has expired'})
      //   return
      // }
      
      // Update user as verified
      await db.update(users)
        .set({ isVerified: true })
        .where(eq(users.userId, verification.userId))
      
      // Get updated user data
      const user = await db.query.users.findFirst({
        where: eq(users.userId, verification.userId)
      })
      
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "User not found after verification"})
        return
      }
      
      // Create session for the verified user
      const sessionId = generateSessionId()
      await createSession(sessionId, user.userId)
      
      // Set session cookie
      res.cookie(process.env.COOKIE_SESSION_KEY!, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.SESSION_EXPIRATION_SECONDS ?? "0", 10) * 1000,
        sameSite: "lax",
      })
      
      // Delete the verification record
      await db.delete(userEmailVerification)
        .where(eq(userEmailVerification.verificationId, verification.verificationId))
      
      res.status(StatusCodes.OK).json({
        success: true, 
        message: "Email verified successfully",
        data: {
          id: user.userId,
          name: user.userName,
          email: user.userEmail,
          isVerified: true
        }
      })
      
    } catch (error) {
      console.error('Verify email error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error verifying email"})
    }
}

export const resendOTPController = async (
  req: Request<{},{}, ResendOTPPayload["body"]>,
  res: Response
) => {
    try {
      const { user_email } = req.body
      
      const user = await db.query.users.findFirst({
        where: eq(users.userEmail, user_email)
      })
      
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({success: false, message: 'User not found'})
        return
      }
      
      if (user.isVerified) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: 'Email already verified'})
        return
      }
      
      // Check if existing OTP exists and update, otherwise insert
      const existingOtp = await db.query.userEmailVerification.findFirst({
        where: eq(userEmailVerification.userId, user.userId)
      })
      
      const otpCode = generateOTP()
      
      if (existingOtp) {
        // Update existing OTP
        await db.update(userEmailVerification)
          .set({
            otpCode: otpCode,
            updatedAt: new Date().toISOString()
          })
          .where(eq(userEmailVerification.userId, user.userId))
      } else {
        // Insert new OTP
        await db.insert(userEmailVerification).values({
          userId: user.userId,
          userEmail: user_email,
          otpCode: otpCode
        })
      }
      
      // Send OTP email
      const emailSent = await sendOTPEmail(user_email, otpCode, user.userName)
      if (!emailSent) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error sending verification email"})
        return
      }
      
      res.status(StatusCodes.OK).json({success: true, message: "New verification code sent to your email"})
      
    } catch (error) {
      console.error('Resend OTP error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error resending verification code"})
    }
}

export const forgotPasswordController = async (
  req: Request<{},{}, ForgotPasswordPayload["body"]>,
  res: Response
) => {
    try {
      const { user_email } = req.body
      
      const user = await db.query.users.findFirst({
        where: eq(users.userEmail, user_email)
      })
      
      if (!user) {
        // Don't reveal if user exists or not for security
        res.status(StatusCodes.OK).json({success: true, message: "If the email exists, a password reset link has been sent"})
        return
      }
      
      // Delete existing reset tokens
      await db.delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.userId))
      
      // Generate reset token
      const resetToken = generatePasswordResetToken()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      
      await db.insert(passwordResetTokens).values({
        userId: user.userId,
        token: resetToken,
        expiresAt: expiresAt.toISOString()
      })
      
      // Send reset email
      const emailSent = await sendPasswordResetEmail(user_email, resetToken, user.userName)
      if (!emailSent) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error sending password reset email"})
        return
      }
      
      res.status(StatusCodes.OK).json({success: true, message: "If the email exists, a password reset link has been sent"})
      
    } catch (error) {
      console.error('Forgot password error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error processing password reset request"})
    }
}

export const resetPasswordController = async (
  req: Request<{},{}, ResetPasswordPayload["body"]>,
  res: Response
) => {
    try {
      const { token, new_password } = req.body
      
      const resetToken = await db.query.passwordResetTokens.findFirst({
        where: and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.isUsed, false),
          gt(passwordResetTokens.expiresAt, new Date().toISOString())
        )
      })
      
      if (!resetToken) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: 'Invalid or expired reset token'})
        return
      }
      
      // Update password
      const salt = generateSalt()
      const hashedPassword = await hashPassword(new_password, salt)
      
      await db.update(users)
        .set({ 
          password: hashedPassword,
          salt: salt
        })
        .where(eq(users.userId, resetToken.userId))
      
      // Mark token as used
      await db.update(passwordResetTokens)
        .set({ isUsed: true })
        .where(eq(passwordResetTokens.tokenId, resetToken.tokenId))
      
      res.status(StatusCodes.OK).json({success: true, message: "Password reset successful"})
      
    } catch (error) {
      console.error('Reset password error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error resetting password"})
    }
}

// OAuth initialization controller
export const oauthInitController = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params
    const { generateAuthUrl, isValidProvider } = await import('../services/oauthService')
    
    if (!isValidProvider(provider)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid OAuth provider: ${provider}. Supported providers: google, github, facebook`
      })
      return
    }
    
    // Generate a state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)
    
    // Generate authorization URL
    const authUrl = generateAuthUrl(provider, state)
    
    // Store state in session/cookie for validation (optional but recommended)
    res.cookie(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000 // 10 minutes
    })
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `OAuth initialization successful for ${provider}`,
      authUrl,
      provider,
      state
    })
  } catch (error) {
    console.error('OAuth init error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'OAuth initialization error'
    })
  }
}

// OAuth callback controller
export const meController = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isVerified
      }
    })
  } catch (error) {
    console.error('Me controller error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching user data'
    })
  }
}

export const oauthCallbackController = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params
    const { code, state } = req.body
    
    const { exchangeCodeForToken, fetchUserInfo, isValidProvider } = await import('../services/oauthService')
    
    if (!isValidProvider(provider)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid OAuth provider: ${provider}`
      })
      return
    }
    
    // Validate state parameter (optional but recommended)
    const storedState = req.cookies[`oauth_state_${provider}`]
    if (state && storedState && state !== storedState) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid state parameter'
      })
      return
    }
    
    // Exchange authorization code for access token
    const accessToken = await exchangeCodeForToken(provider, code)
    
    // Fetch user information from OAuth provider
    const oauthUser = await fetchUserInfo(provider, accessToken)
    
    // Check if user exists in database
    let user = await db.query.users.findFirst({
      where: eq(users.userEmail, oauthUser.email)
    })
    
    if (!user) {
      // Create new user from OAuth data
      const [newUser] = await db.insert(users).values({
        userEmail: oauthUser.email,
        userName: oauthUser.name,
        isVerified: true, // OAuth users are pre-verified
      }).returning()
      
      user = newUser
    } else if (user && !user.oauthProvider) {
      // Link OAuth account to existing user
      await db.update(users)
        .set({
          oauthProvider: oauthUser.provider,
          oauthId: oauthUser.id,
          profilePicture: oauthUser.picture,
          isVerified: true
        })
        .where(eq(users.userId, user.userId))
    }
    
    // Ensure user exists at this point
    if (!user) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'User creation failed'
      })
      return
    }
    
    // Create session
    const sessionId = generateSessionId()
    await createSession(sessionId, user.userId)
    
    // Set session cookie
    res.cookie(process.env.COOKIE_SESSION_KEY!, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    // Clear OAuth state cookie
    res.clearCookie(`oauth_state_${provider}`)
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `OAuth login successful with ${provider}`,
      user: {
        id: user.userId,
        name: user.userName,
        email: user.userEmail,
        isVerified: user.isVerified
      }
    })
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'OAuth callback error'
    })
  }
}
