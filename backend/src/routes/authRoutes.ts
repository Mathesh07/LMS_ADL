/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management endpoints
 */

import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  resendOTPController,
  forgotPasswordController,
  resetPasswordController,
  oauthInitController,
  oauthCallbackController,
  meController
} from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../schema/authschema";
import {
  oauthSchema,
  oauthCallbackSchema
} from "../schemas/authSchemas";

const auth_router = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             user_name: "John Doe"
 *             user_email: "john@example.com"
 *             password: "Password123"
 *             confirmPassword: "Password123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: Created user ID
 *             example:
 *               success: true
 *               message: "User successfully created. Please check your email for verification code."
 *               userId: 123
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "User already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
auth_router.route("/register").post(validate(registerSchema), registerController)
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             userEmail: "john@example.com"
 *             userPassword: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Session cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               user:
 *                 id: 123
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *       401:
 *         description: Invalid credentials or email not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               invalid_credentials:
 *                 summary: Invalid credentials
 *                 value:
 *                   success: false
 *                   message: "Invalid credentials"
 *               not_verified:
 *                 summary: Email not verified
 *                 value:
 *                   success: false
 *                   message: "Please verify your email first"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/login").post(validate(loginSchema), loginController)
/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP verification code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOTPRequest'
 *           example:
 *             userEmail: "john@example.com"
 *     responses:
 *       200:
 *         description: New verification code sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "New verification code sent to your email"
 *       400:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
auth_router.route("/resend-otp").post(validate(resendOTPSchema), resendOTPController)
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *           example:
 *             userEmail: "john@example.com"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Email verified successfully"
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               invalid_otp:
 *                 summary: Invalid OTP
 *                 value:
 *                   success: false
 *                   message: "Invalid OTP code"
 *               expired_otp:
 *                 summary: Expired OTP
 *                 value:
 *                   success: false
 *                   message: "OTP code has expired"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/verify-email").post(validate(verifyEmailSchema), verifyEmailController)
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             userEmail: "john@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent (if email exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "If the email exists, a password reset link has been sent"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPasswordController)
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           example:
 *             token: "reset_token_here"
 *             newPassword: "NewPassword123"
 *             confirmPassword: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Password reset successful"
 *       400:
 *         description: Invalid or expired reset token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid or expired reset token"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/reset-password").post(validate(resetPasswordSchema), resetPasswordController)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Logout successful"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/logout").post(authenticateUser, logoutController)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               data:
 *                 id: 123
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 isVerified: true
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/me").get(authenticateUser, meController)

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               user:
 *                 id: 123
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 isVerified: true
 *       401:
 *         description: Unauthorized - Invalid or missing session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
auth_router.route("/profile").get(authenticateUser, (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

/**
 * @swagger
 * /auth/oauth/{provider}:
 *   post:
 *     summary: Initialize OAuth authentication
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, github, facebook]
 *         description: OAuth provider name
 *     responses:
 *       200:
 *         description: OAuth initialization successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OAuthResponse'
 *             example:
 *               success: true
 *               message: "OAuth initialization successful for google"
 *               authUrl: "https://accounts.google.com/oauth/authorize?..."
 *               provider: "google"
 *               state: "random_state_string"
 *       400:
 *         description: Invalid OAuth provider
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid OAuth provider: invalid. Supported providers: google, github, facebook"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/oauth/:provider").post(validate(oauthSchema), oauthInitController)

/**
 * @swagger
 * /auth/oauth/{provider}/callback:
 *   post:
 *     summary: Handle OAuth callback
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, github, facebook]
 *         description: OAuth provider name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OAuthCallbackRequest'
 *           example:
 *             code: "authorization_code_from_provider"
 *             state: "random_state_string"
 *     responses:
 *       200:
 *         description: OAuth login successful
 *         headers:
 *           Set-Cookie:
 *             description: Session cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "OAuth login successful with google"
 *               user:
 *                 id: 123
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 isVerified: true
 *       400:
 *         description: Invalid provider or state parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               invalid_provider:
 *                 summary: Invalid provider
 *                 value:
 *                   success: false
 *                   message: "Invalid OAuth provider: invalid"
 *               invalid_state:
 *                 summary: Invalid state
 *                 value:
 *                   success: false
 *                   message: "Invalid state parameter"
 *       500:
 *         description: Internal server error
 */
auth_router.route("/oauth/:provider/callback").post(validate(oauthCallbackSchema), oauthCallbackController)

export default auth_router

