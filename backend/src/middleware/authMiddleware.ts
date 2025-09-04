import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getSession } from '../utils/authUtils'
import { db } from '../drizzle'
import { users } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        name: string
        email: string
        isVerified: boolean
      }
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies[process.env.COOKIE_SESSION_KEY!]
    
    if (!sessionId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      })
      return
    }
    
    const session = await getSession(sessionId)
    if (!session) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired session'
      })
      return
    }
    
    // Get user details
    const user = await db.query.users.findFirst({
      where: eq(users.userId, session.userId)
    })
    
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found'
      })
      return
    }
    
    // Attach user to request
    req.user = {
      id: user.userId,
      name: user.userName,
      email: user.userEmail,
      isVerified: user.isVerified || false
    }
    
    next()
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication error'
    })
  }
}

export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isVerified) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Email verification required'
    })
    return
  }
  
  next()
}
