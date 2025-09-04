/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Study notes management endpoints
 */

import { Router } from 'express'
import { createNote, getNote, updateNote, deleteNote, shareNoteToGroup, getUserNotes, getPublicNotes, updateNoteVisibility } from '../controllers/notesController'
import { authenticateUser } from '../middleware/authMiddleware'
import validate from '../middleware/validateResource'
import {
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema,
  getUserNotesSchema,
  shareNoteSchema,
  deleteNoteSchema,
  getPublicNotesSchema,
  updateNoteVisibilitySchema
} from '../schemas/socialSchemas'

const notesRouter = Router()

// All routes require authentication
notesRouter.use(authenticateUser)

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *           example:
 *             title: "JavaScript Fundamentals"
 *             content: "Variables, functions, and scope concepts"
 *             noteType: "text"
 *             tags: ["javascript", "programming", "fundamentals"]
 *             relatedModuleId: 1
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
notesRouter.route('/')
  .post(validate(createNoteSchema), createNote)

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *           example:
 *             title: "Advanced JavaScript Concepts"
 *             content: "Closures, prototypes, and async programming"
 *             tags: ["javascript", "advanced", "async"]
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this note
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this note
 */
notesRouter.route('/:id')
  .get(validate(getNoteSchema), getNote)
  .put(validate(updateNoteSchema), updateNote)
  .delete(validate(deleteNoteSchema), deleteNote)

/**
 * @swagger
 * /notes/user/{userId}:
 *   get:
 *     summary: Get user's notes with pagination and filtering
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *         description: Search term for title/content
 *       - in: query
 *         name: noteType
 *         schema:
 *           type: string
 *           enum: [text, document, link, multimedia]
 *         description: Filter by note type
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags to filter by
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
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
 *         description: Not authorized to view these notes
 */
notesRouter.route('/user/:userId')
  .get(validate(getUserNotesSchema), getUserNotes)

/**
 * @swagger
 * /notes/{id}/share/{groupId}:
 *   post:
 *     summary: Share a note with a study group
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID to share with
 *     responses:
 *       200:
 *         description: Note shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Note or group not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to share this note or access this group
 */
notesRouter.route('/:id/share/:groupId')
  .post(validate(shareNoteSchema), shareNoteToGroup)

/**
 * @swagger
 * /notes/public:
 *   get:
 *     summary: Get public notes
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: noteType
 *         schema:
 *           type: string
 *           enum: [text, image, audio, video, pdf]
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular]
 *           default: newest
 *     responses:
 *       200:
 *         description: Public notes retrieved successfully
 */
notesRouter.get('/public', validate(getPublicNotesSchema), getPublicNotes)

/**
 * @swagger
 * /notes/{noteId}/visibility:
 *   patch:
 *     summary: Update note visibility
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visibilityScope
 *             properties:
 *               visibilityScope:
 *                 type: string
 *                 enum: [private, group, public]
 *     responses:
 *       200:
 *         description: Note visibility updated successfully
 *       403:
 *         description: Not authorized to update this note
 *       404:
 *         description: Note not found
 */
notesRouter.patch('/:noteId/visibility', validate(updateNoteVisibilitySchema), updateNoteVisibility)

export default notesRouter
