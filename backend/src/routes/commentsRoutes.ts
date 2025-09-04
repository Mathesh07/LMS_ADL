/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Note comment management endpoints
 */

import { Router } from 'express'
import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from '../controllers/commentsController'
import { authenticateUser } from '../middleware/authMiddleware'
import validate from '../middleware/validateResource'
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
  deleteCommentSchema
} from '../schemas/socialSchemas'

const commentsRouter = Router()

// All routes require authentication
commentsRouter.use(authenticateUser)

/**
 * @swagger
 * /notes/{noteId}/comments:
 *   post:
 *     summary: Add a comment to a note
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *           example:
 *             commentText: "Great explanation! This really helped me understand the concept."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     comment:
 *                       $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot comment on private note
 *       404:
 *         description: Note not found
 *   get:
 *     summary: Get comments for a note
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
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
 *           default: 20
 *         description: Number of comments per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *         description: Sort order for comments
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                         $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot view comments on private note
 *       404:
 *         description: Note not found
 */
commentsRouter.route('/:noteId/comments')
  .post(validate(createCommentSchema), createComment)
  .get(validate(getCommentsSchema), getComments)

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *           example:
 *             commentText: "Updated comment with more detailed feedback."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     comment:
 *                       $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Can only update your own comments
 *       404:
 *         description: Comment not found
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Can only delete your own comments
 *       404:
 *         description: Comment not found
 */
commentsRouter.route('/:commentId')
  .put(validate(updateCommentSchema), updateComment)
  .delete(validate(deleteCommentSchema), deleteComment)

export default commentsRouter
