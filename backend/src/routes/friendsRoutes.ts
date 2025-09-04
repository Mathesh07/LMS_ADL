/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend management and social networking endpoints
 */

import { Router } from 'express'
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  blockUser,
  getFriends,
  getFriendRequests
} from '../controllers/friendsController'
import { authenticateUser } from '../middleware/authMiddleware'
import validate from '../middleware/validateResource'
import {
  sendFriendRequestSchema,
  acceptFriendRequestSchema,
  rejectFriendRequestSchema,
  getUserFriendsSchema,
  getFriendRequestsSchema
} from '../schemas/socialSchemas'

const friendsRouter = Router()

// All routes require authentication
friendsRouter.use(authenticateUser)

/**
 * @swagger
 * /friends/request:
 *   post:
 *     summary: Send a friend request to another user
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendFriendRequestRequest'
 *           example:
 *             receiverId: 123
 *             message: "Hi! I'd like to connect and study together."
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid request or already friends/blocked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Friend request already exists
 */
friendsRouter.route('/request')
  .post(validate(sendFriendRequestSchema), sendFriendRequest)

/**
 * @swagger
 * /friends/request/{id}/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend request not found
 *       403:
 *         description: Not authorized to accept this request
 */
friendsRouter.route('/request/:id/accept')
  .post(validate(acceptFriendRequestSchema), acceptFriendRequest)

/**
 * @swagger
 * /friends/request/{id}/reject:
 *   post:
 *     summary: Reject a friend request
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend request not found
 *       403:
 *         description: Not authorized to reject this request
 */
friendsRouter.route('/request/:id/reject')
  .post(validate(rejectFriendRequestSchema), rejectFriendRequest)

// Block user functionality - schema not implemented yet
// friendsRouter.route('/block')
//   .post(validate(blockUserSchema), blockUser)

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get user's friends list with pagination
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of friends per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search friends by name or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [online, offline, all]
 *           default: all
 *         description: Filter by online status
 *     responses:
 *       200:
 *         description: Friends list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Friend'
 *       401:
 *         description: Unauthorized
 */
friendsRouter.route('/')
  .get(validate(getUserFriendsSchema), getFriends)

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: Get pending friend requests (sent and received)
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of requests per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [sent, received, all]
 *           default: all
 *         description: Filter by request type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           default: pending
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: Friend requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FriendRequest'
 *       401:
 *         description: Unauthorized
 */
friendsRouter.route('/requests')
  .get(validate(getFriendRequestsSchema), getFriendRequests)

export default friendsRouter
