import { Request, Response } from 'express'

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string }
}
import { StatusCodes } from 'http-status-codes'
import { db } from '../drizzle'
import { friendRequest, users } from '../drizzle/schema'
import { eq, and, or, desc, sql } from 'drizzle-orm'
import { AppError, asyncHandler } from '../middleware/errorHandler'
import { 
  FriendRequestResponse,
  FriendResponse,
  ApiResponse, 
  PaginatedResponse 
} from '../types/socialTypes'

// Send a friend request
export const sendFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const receiverId = req.params.userId as unknown as number
  const senderId = req.user!.id

  if (senderId === receiverId) {
    throw new AppError('You cannot send a friend request to yourself', StatusCodes.BAD_REQUEST)
  }

  // Check if receiver exists
  const receiver = await db.query.users.findFirst({
    where: eq(users.userId, receiverId)
  })

  if (!receiver) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND)
  }

  // Check if there's already a pending or accepted request between these users
  const existingRequest = await db.query.friendRequest.findFirst({
    where: or(
      and(
        eq(friendRequest.senderId, senderId),
        eq(friendRequest.receiverId, receiverId)
      ),
      and(
        eq(friendRequest.senderId, receiverId),
        eq(friendRequest.receiverId, senderId)
      )
    )
  })

  if (existingRequest) {
    if (existingRequest.status === 'pending') {
      throw new AppError('Friend request already exists', StatusCodes.BAD_REQUEST)
    } else if (existingRequest.status === 'accepted') {
      throw new AppError('You are already friends', StatusCodes.BAD_REQUEST)
    } else if (existingRequest.status === 'blocked') {
      throw new AppError('Cannot send friend request', StatusCodes.FORBIDDEN)
    }
  }

  const [newRequest] = await db.insert(friendRequest).values({
    senderId,
    receiverId,
    status: 'pending'
  }).returning()

  const response: ApiResponse<FriendRequestResponse> = {
    success: true,
    message: 'Friend request sent successfully',
    data: {
      requestId: newRequest.requestId,
      senderId: newRequest.senderId,
      receiverId: newRequest.receiverId,
      status: newRequest.status,
      sentAt: newRequest.sentAt!,
      acceptedAt: newRequest.acceptedAt
    }
  }

  res.status(StatusCodes.CREATED).json(response)
})

// Accept a friend request
export const acceptFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = req.params.requestId as unknown as number
  const userId = req.user!.id

  const request = await db.query.friendRequest.findFirst({
    where: eq(friendRequest.requestId, requestId),
    with: {
      sender: {
        columns: {
          userId: true,
          userName: true,
          userEmail: true
        }
      }
    }
  })

  if (!request) {
    throw new AppError('Friend request not found', StatusCodes.NOT_FOUND)
  }

  if (request.receiverId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  if (request.status !== 'pending') {
    throw new AppError('Friend request is not pending', StatusCodes.BAD_REQUEST)
  }

  const [updatedRequest] = await db.update(friendRequest)
    .set({ 
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    })
    .where(eq(friendRequest.requestId, requestId))
    .returning()

  const response: ApiResponse<FriendRequestResponse> = {
    success: true,
    message: 'Friend request accepted successfully',
    data: {
      requestId: updatedRequest.requestId,
      senderId: updatedRequest.senderId,
      receiverId: updatedRequest.receiverId,
      status: updatedRequest.status,
      sentAt: updatedRequest.sentAt!,
      acceptedAt: updatedRequest.acceptedAt,
      sender: {
        userId: (request.sender as any)?.userId,
        userName: (request.sender as any)?.userName,
        userEmail: (request.sender as any)?.userEmail
      }
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Reject a friend request
export const rejectFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = req.params.requestId as unknown as number
  const userId = req.user!.id

  const request = await db.query.friendRequest.findFirst({
    where: eq(friendRequest.requestId, requestId)
  })

  if (!request) {
    throw new AppError('Friend request not found', StatusCodes.NOT_FOUND)
  }

  if (request.receiverId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  if (request.status !== 'pending') {
    throw new AppError('Friend request is not pending', StatusCodes.BAD_REQUEST)
  }

  await db.update(friendRequest)
    .set({ status: 'rejected' })
    .where(eq(friendRequest.requestId, requestId))

  const response: ApiResponse = {
    success: true,
    message: 'Friend request rejected successfully'
  }

  res.status(StatusCodes.OK).json(response)
})

// Get user's friends
export const getFriends = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const targetUserId = req.params.userId as unknown as number
  const currentUserId = req.user!.id
  const { page = 1, limit = 20, search } = req.query as any

  // Check if user can view target user's friends (for now, anyone can view)
  // You might want to add privacy settings later

  const offset = (page - 1) * limit

  // Get accepted friend requests where the target user is either sender or receiver
  let query = db.select({
    userId: sql<number>`CASE 
      WHEN ${friendRequest.senderId} = ${targetUserId} THEN ${friendRequest.receiverId}
      ELSE ${friendRequest.senderId}
    END`,
    userName: users.userName,
    userEmail: users.userEmail,
    profilePicture: users.profilePicture,
    friendshipDate: friendRequest.acceptedAt
  })
  .from(friendRequest)
  .innerJoin(users, sql`${users.userId} = CASE 
    WHEN ${friendRequest.senderId} = ${targetUserId} THEN ${friendRequest.receiverId}
    ELSE ${friendRequest.senderId}
  END`)
  .where(and(
    or(
      eq(friendRequest.senderId, targetUserId),
      eq(friendRequest.receiverId, targetUserId)
    ),
    eq(friendRequest.status, 'accepted')
  ))

  if (search) {
    query = query.where(and(
      or(
        eq(friendRequest.senderId, targetUserId),
        eq(friendRequest.receiverId, targetUserId)
      ),
      eq(friendRequest.status, 'accepted'),
      sql`${users.userName} ILIKE ${'%' + search + '%'}`
    ))
  }

  const [friends, totalCount] = await Promise.all([
    query
      .orderBy(desc(friendRequest.acceptedAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(friendRequest)
      .where(and(
        or(
          eq(friendRequest.senderId, targetUserId),
          eq(friendRequest.receiverId, targetUserId)
        ),
        eq(friendRequest.status, 'accepted')
      ))
  ])

  const total = Number(totalCount[0].count)
  const totalPages = Math.ceil(total / limit)

  const response: PaginatedResponse<FriendResponse> = {
    success: true,
    message: 'Friends retrieved successfully',
    data: friends.map(friend => ({
      userId: (friend as any)?.userId,
      userName: (friend as any)?.userName,
      userEmail: (friend as any)?.userEmail,
      profilePicture: friend.profilePicture,
      friendshipDate: friend.friendshipDate!
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Get friend requests for a user
export const getFriendRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const targetUserId = req.params.userId as unknown as number
  const currentUserId = req.user!.id
  const { page = 1, limit = 20, type = 'received' } = req.query as any

  // Only allow users to view their own friend requests
  if (targetUserId !== currentUserId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  const offset = (page - 1) * limit
  let whereConditions: any[] = []

  if (type === 'sent') {
    whereConditions = [eq(friendRequest.senderId, targetUserId)]
  } else if (type === 'received') {
    whereConditions = [
      eq(friendRequest.receiverId, targetUserId),
      eq(friendRequest.status, 'pending')
    ]
  } else {
    // type === 'all'
    whereConditions = [
      or(
        eq(friendRequest.senderId, targetUserId),
        eq(friendRequest.receiverId, targetUserId)
      )
    ]
  }

  const [requests, totalCount] = await Promise.all([
    db.query.friendRequest.findMany({
      where: and(...whereConditions),
      with: {
        sender: {
          columns: {
            userId: true,
            userName: true,
            userEmail: true
          }
        },
        receiver: {
          columns: {
            userId: true,
            userName: true,
            userEmail: true
          }
        }
      },
      orderBy: [desc(friendRequest.sentAt)],
      limit,
      offset
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(friendRequest)
      .where(and(...whereConditions))
  ])

  const total = Number(totalCount[0].count)
  const totalPages = Math.ceil(total / limit)

  const response: PaginatedResponse<FriendRequestResponse> = {
    success: true,
    message: 'Friend requests retrieved successfully',
    data: requests.map(request => ({
      requestId: request.requestId,
      senderId: request.senderId,
      receiverId: request.receiverId,
      status: request.status,
      sentAt: request.sentAt!,
      acceptedAt: request.acceptedAt,
      sender: {
        userId: (request as any)?.userId,
        userName: (request as any)?.userName,
        userEmail: (request as any)?.userEmail,
      },
      receiver: {
        userId: (request as any)?.userId,
        userName: (request as any)?.userName,
        userEmail: (request as any)?.userEmail,
      }
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Block a user (reject and prevent future requests)
export const blockUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = req.params.requestId as unknown as number
  const userId = req.user!.id

  const request = await db.query.friendRequest.findFirst({
    where: eq(friendRequest.requestId, requestId)
  })

  if (!request) {
    throw new AppError('Friend request not found', StatusCodes.NOT_FOUND)
  }

  if (request.receiverId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  await db.update(friendRequest)
    .set({ status: 'blocked' })
    .where(eq(friendRequest.requestId, requestId))

  const response: ApiResponse = {
    success: true,
    message: 'User blocked successfully'
  }

  res.status(StatusCodes.OK).json(response)
})

// Remove friend (for accepted friendships)
export const removeFriend = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const friendUserId = req.params.userId as unknown as number
  const userId = req.user!.id

  const friendship = await db.query.friendRequest.findFirst({
    where: and(
      or(
        and(
          eq(friendRequest.senderId, userId),
          eq(friendRequest.receiverId, friendUserId)
        ),
        and(
          eq(friendRequest.senderId, friendUserId),
          eq(friendRequest.receiverId, userId)
        )
      ),
      eq(friendRequest.status, 'accepted')
    )
  })

  if (!friendship) {
    throw new AppError('Friendship not found', StatusCodes.NOT_FOUND)
  }

  // Delete the friendship record
  await db.delete(friendRequest)
    .where(eq(friendRequest.requestId, friendship.requestId))

  const response: ApiResponse = {
    success: true,
    message: 'Friend removed successfully'
  }

  res.status(StatusCodes.OK).json(response)
})
