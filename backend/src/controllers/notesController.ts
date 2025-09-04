import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { db } from '../drizzle'
import { studyNote, users, studyGroup, studyGroupMembership } from '../drizzle/schema'
import { eq, and, or, desc, ilike, sql } from 'drizzle-orm'
import { AppError, asyncHandler } from '../middleware/errorHandler'
import { 
  CreateNoteRequest, 
  UpdateNoteRequest, 
  NoteResponse, 
  ApiResponse, 
  PaginatedResponse 
} from '../types/socialTypes'

// Create a new note
export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, noteType = 'text', tags, relatedModuleId }: CreateNoteRequest = req.body
  const userId = req.user!.id

  const [newNote] = await db.insert(studyNote).values({
    userId,
    title,
    content: content || '',
    noteType,
    tags: tags ? JSON.stringify(tags) : null,
    relatedModuleId,
    visibilityScope: 'private',
    isShared: false
  }).returning()

  const response: ApiResponse<NoteResponse> = {
    success: true,
    message: 'Note created successfully',
    data: {
      noteId: newNote.noteId,
      userId: newNote.userId,
      title: newNote.title,
      content: newNote.content,
      visibilityScope: newNote.visibilityScope,
      relatedModuleId: newNote.relatedModuleId,
      isShared: newNote.isShared,
      sharedWithGroupId: newNote.sharedWithGroupId,
      noteType: newNote.noteType,
      tags: newNote.tags,
      attachments: newNote.attachments,
      likeCount: newNote.likeCount || 0,
      viewCount: newNote.viewCount || 0,
      lastEditedBy: newNote.lastEditedBy,
      forkedFromNoteId: newNote.forkedFromNoteId,
      createdAt: newNote.createdAt!,
      updatedAt: newNote.updatedAt!
    }
  }

  res.status(StatusCodes.CREATED).json(response)
})

// Get a single note by ID
export const getNote = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id as unknown as number
  const userId = req.user!.id

  const note = await db.query.studyNote.findFirst({
    where: eq(studyNote.noteId, noteId),
    with: {
      user: {
        columns: {
          userId: true,
          userName: true
        }
      }
    }
  })

  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND)
  }

  // Check if user has permission to view the note
  const canView = note.userId === userId || 
                  note.visibilityScope === 'public' ||
                  (note.isShared && note.sharedWithGroupId)

  if (!canView) {
    // Check if user is member of the group the note is shared with
    if (note.sharedWithGroupId) {
      const membership = await db.query.studyGroupMembership.findFirst({
        where: and(
          eq(studyGroupMembership.groupId, note.sharedWithGroupId),
          eq(studyGroupMembership.userId, userId),
          sql`${studyGroupMembership.leftAt} IS NULL`
        )
      })
      
      if (!membership) {
        throw new AppError('Access denied', StatusCodes.FORBIDDEN)
      }
    } else {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }
  }

  // Increment view count if not the owner
  if (note.userId !== userId) {
    await db.update(studyNote)
      .set({ viewCount: (note.viewCount || 0) + 1 })
      .where(eq(studyNote.noteId, noteId))
  }

  const response: ApiResponse<NoteResponse> = {
    success: true,
    message: 'Note retrieved successfully',
    data: {
      noteId: note.noteId,
      userId: note.userId,
      title: note.title,
      content: note.content,
      visibilityScope: note.visibilityScope,
      relatedModuleId: note.relatedModuleId,
      isShared: note.isShared,
      sharedWithGroupId: note.sharedWithGroupId,
      noteType: note.noteType,
      tags: note.tags,
      attachments: note.attachments,
      likeCount: note.likeCount || 0,
      viewCount: (note.viewCount || 0) + (note.userId !== userId ? 1 : 0),
      lastEditedBy: note.lastEditedBy,
      forkedFromNoteId: note.forkedFromNoteId,
      createdAt: note.createdAt!,
      updatedAt: note.updatedAt!,
      author: {
        userId: note.user.userId,
        userName: note.user.userName
      }
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Get user's notes with pagination and filtering
export const getUserNotes = asyncHandler(async (req: Request, res: Response) => {
  const targetUserId = req.params.userId as unknown as number
  const currentUserId = req.user!.id
  const { page = 1, limit = 10, search, noteType, tags } = req.query as any

  // Check if user can view target user's notes
  const canViewAll = targetUserId === currentUserId

  let whereConditions = [eq(studyNote.userId, targetUserId)]
  
  if (!canViewAll) {
    // Only show public notes if viewing another user's notes
    whereConditions.push(eq(studyNote.visibilityScope, 'public'))
  }

  if (search) {
    whereConditions.push(
      or(
        ilike(studyNote.title, `%${search}%`),
        ilike(studyNote.content, `%${search}%`)
      )!
    )
  }

  if (noteType) {
    whereConditions.push(eq(studyNote.noteType, noteType))
  }

  const offset = (page - 1) * limit

  const [notes, totalCount] = await Promise.all([
    db.query.studyNote.findMany({
      where: and(...whereConditions),
      with: {
        user: {
          columns: {
            userId: true,
            userName: true
          }
        }
      },
      orderBy: [desc(studyNote.updatedAt)],
      limit,
      offset
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(studyNote)
      .where(and(...whereConditions))
  ])

  const total = Number(totalCount[0].count)
  const totalPages = Math.ceil(total / limit)

  const response: PaginatedResponse<NoteResponse> = {
    success: true,
    message: 'Notes retrieved successfully',
    data: notes.map(note => ({
      noteId: note.noteId,
      userId: note.userId,
      title: note.title,
      content: note.content,
      visibilityScope: note.visibilityScope,
      relatedModuleId: note.relatedModuleId,
      isShared: note.isShared,
      sharedWithGroupId: note.sharedWithGroupId,
      noteType: note.noteType,
      tags: note.tags,
      attachments: note.attachments,
      likeCount: note.likeCount || 0,
      viewCount: note.viewCount || 0,
      lastEditedBy: note.lastEditedBy,
      forkedFromNoteId: note.forkedFromNoteId,
      createdAt: note.createdAt!,
      updatedAt: note.updatedAt!,
      author: {
        userId: note.user.userId,
        userName: note.user.userName
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

// Update a note
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id as unknown as number
  const userId = req.user!.id
  const { title, content, tags, relatedModuleId }: UpdateNoteRequest = req.body

  const note = await db.query.studyNote.findFirst({
    where: eq(studyNote.noteId, noteId)
  })

  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND)
  }

  if (note.userId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  const updateData: any = {
    lastEditedBy: userId,
    updatedAt: new Date().toISOString()
  }

  if (title !== undefined) updateData.title = title
  if (content !== undefined) updateData.content = content
  if (tags !== undefined) updateData.tags = JSON.stringify(tags)
  if (relatedModuleId !== undefined) updateData.relatedModuleId = relatedModuleId

  const [updatedNote] = await db.update(studyNote)
    .set(updateData)
    .where(eq(studyNote.noteId, noteId))
    .returning()

  const response: ApiResponse<NoteResponse> = {
    success: true,
    message: 'Note updated successfully',
    data: {
      noteId: updatedNote.noteId,
      userId: updatedNote.userId,
      title: updatedNote.title,
      content: updatedNote.content,
      visibilityScope: updatedNote.visibilityScope,
      relatedModuleId: updatedNote.relatedModuleId,
      isShared: updatedNote.isShared,
      sharedWithGroupId: updatedNote.sharedWithGroupId,
      noteType: updatedNote.noteType,
      tags: updatedNote.tags,
      attachments: updatedNote.attachments,
      likeCount: updatedNote.likeCount || 0,
      viewCount: updatedNote.viewCount || 0,
      lastEditedBy: updatedNote.lastEditedBy,
      forkedFromNoteId: updatedNote.forkedFromNoteId,
      createdAt: updatedNote.createdAt!,
      updatedAt: updatedNote.updatedAt!
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Delete a note
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id as unknown as number
  const userId = req.user!.id

  const note = await db.query.studyNote.findFirst({
    where: eq(studyNote.noteId, noteId)
  })

  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND)
  }

  if (note.userId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  await db.delete(studyNote).where(eq(studyNote.noteId, noteId))

  const response: ApiResponse = {
    success: true,
    message: 'Note deleted successfully'
  }

  res.status(StatusCodes.OK).json(response)
})

// Share a note to a study group
export const shareNoteToGroup = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id as unknown as number
  const groupId = req.params.groupId as unknown as number
  const userId = req.user!.id

  const note = await db.query.studyNote.findFirst({
    where: eq(studyNote.noteId, noteId)
  })

  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND)
  }

  if (note.userId !== userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN)
  }

  // Check if user is a member of the group
  const membership = await db.query.studyGroupMembership.findFirst({
    where: and(
      eq(studyGroupMembership.groupId, groupId),
      eq(studyGroupMembership.userId, userId),
      sql`${studyGroupMembership.leftAt} IS NULL`
    )
  })

  if (!membership) {
    throw new AppError('You are not a member of this group', StatusCodes.FORBIDDEN)
  }

  // Check if group exists
  const group = await db.query.studyGroup.findFirst({
    where: eq(studyGroup.groupId, groupId)
  })

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND)
  }

  // Update note to be shared with the group
  const [updatedNote] = await db.update(studyNote)
    .set({
      isShared: true,
      sharedWithGroupId: groupId,
      visibilityScope: 'group',
      updatedAt: new Date().toISOString()
    })
    .where(eq(studyNote.noteId, noteId))
    .returning()

  const response: ApiResponse<NoteResponse> = {
    success: true,
    message: 'Note shared to group successfully',
    data: {
      noteId: updatedNote.noteId,
      userId: updatedNote.userId,
      title: updatedNote.title,
      content: updatedNote.content,
      visibilityScope: updatedNote.visibilityScope,
      relatedModuleId: updatedNote.relatedModuleId,
      isShared: updatedNote.isShared,
      sharedWithGroupId: updatedNote.sharedWithGroupId,
      noteType: updatedNote.noteType,
      tags: updatedNote.tags,
      attachments: updatedNote.attachments,
      likeCount: updatedNote.likeCount || 0,
      viewCount: updatedNote.viewCount || 0,
      lastEditedBy: updatedNote.lastEditedBy,
      forkedFromNoteId: updatedNote.forkedFromNoteId,
      createdAt: updatedNote.createdAt!,
      updatedAt: updatedNote.updatedAt!
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Get public notes
export const getPublicNotes = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, noteType, tags, sortBy = 'newest' } = req.query as any

  let whereConditions = [eq(studyNote.visibilityScope, 'public')]

  // Add search filter
  if (search) {
    whereConditions.push(
      or(
        ilike(studyNote.title, `%${search}%`),
        ilike(studyNote.content, `%${search}%`)
      )!
    )
  }

  // Add note type filter
  if (noteType) {
    whereConditions.push(eq(studyNote.noteType, noteType))
  }

  // Add tags filter
  if (tags) {
    const tagArray = tags.split(',').map((tag: string) => tag.trim())
    whereConditions.push(
      sql`${studyNote.tags}::jsonb ?| array[${tagArray.map((tag: string) => `'${tag}'`).join(',')}]`
    )
  }

  const offset = (page - 1) * limit
  
  // Determine sort order
  let orderBy
  switch (sortBy) {
    case 'oldest':
      orderBy = studyNote.createdAt
      break
    case 'popular':
      orderBy = desc(studyNote.likeCount)
      break
    case 'mostViewed':
      orderBy = desc(studyNote.viewCount)
      break
    default:
      orderBy = desc(studyNote.createdAt)
  }

  const [notes, totalCount] = await Promise.all([
    db.query.studyNote.findMany({
      where: and(...whereConditions),
      with: {
        user: {
          columns: {
            userId: true,
            userName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [orderBy],
      limit,
      offset
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(studyNote)
      .where(and(...whereConditions))
  ])

  const total = Number(totalCount[0].count)
  const totalPages = Math.ceil(total / limit)

  const response: PaginatedResponse<NoteResponse> = {
    success: true,
    message: 'Public notes retrieved successfully',
    data: notes.map(note => ({
      noteId: note.noteId,
      userId: note.userId,
      title: note.title,
      content: note.content,
      visibilityScope: note.visibilityScope,
      relatedModuleId: note.relatedModuleId,
      isShared: note.isShared,
      sharedWithGroupId: note.sharedWithGroupId,
      noteType: note.noteType,
      tags: note.tags,
      attachments: note.attachments,
      likeCount: note.likeCount || 0,
      viewCount: note.viewCount || 0,
      lastEditedBy: note.lastEditedBy,
      forkedFromNoteId: note.forkedFromNoteId,
      createdAt: note.createdAt!,
      updatedAt: note.updatedAt!,
      author: {
        userId: note.user.userId,
        userName: note.user.userName
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

// Update note visibility
export const updateNoteVisibility = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as unknown as number
  const { visibilityScope } = req.body
  const userId = req.user!.id

  // Check if note exists and belongs to user
  const note = await db.query.studyNote.findFirst({
    where: eq(studyNote.noteId, noteId)
  })

  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND)
  }

  if (note.userId !== userId) {
    throw new AppError('Can only update visibility of your own notes', StatusCodes.FORBIDDEN)
  }

  // Update note visibility
  const [updatedNote] = await db.update(studyNote)
    .set({ 
      visibilityScope,
      updatedAt: new Date().toISOString()
    })
    .where(eq(studyNote.noteId, noteId))
    .returning()

  const response: ApiResponse = {
    success: true,
    message: 'Note visibility updated successfully',
    data: {
      noteId: updatedNote.noteId,
      visibilityScope: updatedNote.visibilityScope
    }
  }

  res.status(StatusCodes.OK).json(response)
})
