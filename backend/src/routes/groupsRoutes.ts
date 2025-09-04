/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Study group management endpoints
 */

import { Router } from 'express'
import {
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
  getGroupNotes
} from '../controllers/groupsController'
import { authenticateUser } from '../middleware/authMiddleware'
import validate from '../middleware/validateResource'
import {
  createGroupSchema,
  joinGroupSchema,
  leaveGroupSchema,
  getGroupMembersSchema,
  getGroupNotesSchema
} from '../schemas/socialSchemas'

const groupsRouter = Router()

// All routes require authentication
groupsRouter.use(authenticateUser)

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new study group
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupRequest'
 *           example:
 *             name: "JavaScript Study Group"
 *             description: "Weekly study sessions for JavaScript fundamentals"
 *             isPrivate: false
 *             maxMembers: 20
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     group:
 *                       $ref: '#/components/schemas/Group'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
groupsRouter.route('/')
  .post(validate(createGroupSchema), createGroup)

/**
 * @swagger
 * /groups/{id}/join:
 *   post:
 *     summary: Join a study group
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               joinCode:
 *                 type: string
 *                 description: Join code for private groups
 *           example:
 *             joinCode: "ABC123"
 *     responses:
 *       200:
 *         description: Successfully joined the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid join code or group is full
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       409:
 *         description: Already a member of this group
 */
groupsRouter.route('/:id/join')
  .post(validate(joinGroupSchema), joinGroup)

/**
 * @swagger
 * /groups/{id}/leave:
 *   post:
 *     summary: Leave a study group
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Successfully left the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found or not a member
 *       403:
 *         description: Group owner cannot leave (must transfer ownership first)
 */
groupsRouter.route('/:id/leave')
  .post(validate(leaveGroupSchema), leaveGroup)

/**
 * @swagger
 * /groups/{id}/members:
 *   get:
 *     summary: Get group members with pagination
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
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
 *         description: Number of members per page
 *     responses:
 *       200:
 *         description: Group members retrieved successfully
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
 *                         $ref: '#/components/schemas/GroupMember'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not a member of this group
 *       404:
 *         description: Group not found
 */
groupsRouter.route('/:id/members')
  .get(validate(getGroupMembersSchema), getGroupMembers)

/**
 * @swagger
 * /groups/{id}/notes:
 *   get:
 *     summary: Get notes shared with the group
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
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
 *         description: Number of notes per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for note title/content
 *       - in: query
 *         name: noteType
 *         schema:
 *           type: string
 *           enum: [text, document, link, multimedia]
 *         description: Filter by note type
 *     responses:
 *       200:
 *         description: Group notes retrieved successfully
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
 *                         $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not a member of this group
 *       404:
 *         description: Group not found
 */
groupsRouter.route('/:id/notes')
  .get(validate(getGroupNotesSchema), getGroupNotes)

export default groupsRouter
