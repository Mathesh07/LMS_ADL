import { db } from '../drizzle'
import { friendRequest, users } from '../drizzle/schema'
import { eq, and, or, sql } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'
import { StatusCodes } from 'http-status-codes'

export class FriendsService {
  static async sendFriendRequest(senderId: number, receiverId: number) {
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

    // Check for existing requests
    const existingRequest = await this.getExistingRequest(senderId, receiverId)
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

    return newRequest
  }

  static async getExistingRequest(userId1: number, userId2: number) {
    return await db.query.friendRequest.findFirst({
      where: or(
        and(
          eq(friendRequest.senderId, userId1),
          eq(friendRequest.receiverId, userId2)
        ),
        and(
          eq(friendRequest.senderId, userId2),
          eq(friendRequest.receiverId, userId1)
        )
      )
    })
  }

  static async acceptFriendRequest(requestId: number, userId: number) {
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

    return { updatedRequest, sender: request.sender }
  }

  static async rejectFriendRequest(requestId: number, userId: number) {
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

    return true
  }

  static async blockUser(requestId: number, userId: number) {
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

    return true
  }

  static async removeFriend(currentUserId: number, friendUserId: number) {
    const friendship = await db.query.friendRequest.findFirst({
      where: and(
        or(
          and(
            eq(friendRequest.senderId, currentUserId),
            eq(friendRequest.receiverId, friendUserId)
          ),
          and(
            eq(friendRequest.senderId, friendUserId),
            eq(friendRequest.receiverId, currentUserId)
          )
        ),
        eq(friendRequest.status, 'accepted')
      )
    })

    if (!friendship) {
      throw new AppError('Friendship not found', StatusCodes.NOT_FOUND)
    }

    await db.delete(friendRequest)
      .where(eq(friendRequest.requestId, friendship.requestId))

    return true
  }

  static async areFriends(userId1: number, userId2: number): Promise<boolean> {
    const friendship = await db.query.friendRequest.findFirst({
      where: and(
        or(
          and(
            eq(friendRequest.senderId, userId1),
            eq(friendRequest.receiverId, userId2)
          ),
          and(
            eq(friendRequest.senderId, userId2),
            eq(friendRequest.receiverId, userId1)
          )
        ),
        eq(friendRequest.status, 'accepted')
      )
    })

    return !!friendship
  }
}
