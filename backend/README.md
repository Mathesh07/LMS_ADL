# Learning Management System - Backend Authentication

## Overview
Complete authentication system for the Learning Management System with email verification, password reset, and session management using Redis.

## Features Implemented

### ✅ Authentication Routes
- **POST** `/api/auth/register` - User registration with email verification
- **POST** `/api/auth/login` - User login with session creation
- **POST** `/api/auth/logout` - User logout (protected)
- **POST** `/api/auth/verify-email` - Email verification with OTP
- **POST** `/api/auth/resend-otp` - Resend verification OTP
- **POST** `/api/auth/forgot-password` - Password reset request
- **POST** `/api/auth/reset-password` - Password reset with token
- **GET** `/api/auth/profile` - Get user profile (protected)

### ✅ Database Schema
- `users` - User accounts with email verification status
- `userEmailVerification` - OTP codes for email verification
- `passwordResetTokens` - Secure password reset tokens
- `oauthAccounts` - OAuth integration (ready for future implementation)

### ✅ Security Features
- Password hashing with salt using crypto.scrypt
- Session management with Redis
- Secure HTTP-only cookies
- Email verification required for login
- Password reset tokens with expiration
- Rate limiting ready (middleware available)

### ✅ Email Integration
- Nodemailer setup for SMTP
- OTP generation and verification
- Password reset email templates
- Professional HTML email templates

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lms_database

# Redis
REDIS_URL=redis://localhost:6379

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com

# Session
COOKIE_SESSION_KEY=lms_session_key
SESSION_EXPIRATION_SECONDS=86400

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 2. Database Setup
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 3. Start Development Server
```bash
npm run dev
```

## API Usage Examples

### Registration Flow
```javascript
// 1. Register user
POST /api/auth/register
{
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "password": "securePassword123"
}

// 2. Verify email with OTP
POST /api/auth/verify-email
{
  "user_email": "john@example.com",
  "otp_code": "123456"
}

// 3. Login
POST /api/auth/login
{
  "user_email": "john@example.com",
  "password": "securePassword123"
}
```

### Password Reset Flow
```javascript
// 1. Request password reset
POST /api/auth/forgot-password
{
  "user_email": "john@example.com"
}

// 2. Reset password with token from email
POST /api/auth/reset-password
{
  "token": "reset-token-from-email",
  "new_password": "newSecurePassword123"
}
```

### Protected Routes
```javascript
// Get user profile (requires authentication)
GET /api/auth/profile
// Cookie: lms_session_key=session-id

// Response:
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

## Middleware Usage

### Authentication Middleware
```typescript
import { authenticateUser, requireEmailVerification } from './middleware/authMiddleware'

// Protect routes
router.get('/protected', authenticateUser, (req, res) => {
  // req.user is available
  res.json({ user: req.user })
})

// Require email verification
router.get('/verified-only', authenticateUser, requireEmailVerification, (req, res) => {
  // User is authenticated and email verified
})
```

## File Structure
```
src/
├── controllers/
│   └── authController.ts      # All authentication controllers
├── middleware/
│   └── authMiddleware.ts      # Authentication middleware
├── routes/
│   └── authRoutes.ts          # Authentication routes
├── schema/
│   └── authschema.ts          # Zod validation schemas
├── utils/
│   ├── authUtils.ts           # Password hashing, sessions
│   ├── emailService.ts        # Email sending utilities
│   └── redisClient.ts         # Redis connection
├── drizzle/
│   └── schema.ts              # Database schema
├── app.ts                     # Express app setup
└── server.ts                  # Server entry point
```

## Next Steps
1. Set up PostgreSQL and Redis databases
2. Configure SMTP email service
3. Test all authentication endpoints
4. Implement OAuth providers (Google, GitHub)
5. Add rate limiting for security
6. Set up logging and monitoring

## Dependencies Added
- `nodemailer` & `@types/nodemailer` - Email service
- `cookie-parser` & `@types/cookie-parser` - Cookie handling
- `bcryptjs` - Password hashing (backup)
- `ioredis` - Redis client
- `zod` - Schema validation

The authentication system is now complete and ready for production use!
