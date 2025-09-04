import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { db } from '../drizzle'
import { noteComment, studyNote, users } from '../drizzle/schema'
import { eq, desc, asc, and } from 'drizzle-orm'

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    name: string
    email: string
    isVerified: boolean
  }
}

// Create a new comment on a note
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const noteId = parseInt(req.params.noteId)
    const { commentText } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    // Check if note exists and is accessible
    const note = await db.query.studyNote.findFirst({
      where: eq(studyNote.noteId, noteId)
    })

    if (!note) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Note not found'
      })
    }

    // Check if user can comment on this note
    // Users can comment on public notes or their own notes
    if (note.visibilityScope === 'private' && note.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Cannot comment on private note'
      })
    }

    // Create the comment
    const [newComment] = await db.insert(noteComment).values({
      noteId: noteId,
      userId: userId,
      commentText: commentText
    }).returning()

    // Get the comment with user details
    const commentWithUser = await db.query.noteComment.findFirst({
      where: eq(noteComment.commentId, newComment.commentId),
      with: {
        user: {
          columns: {
            userId: true,
            userName: true,
            avatarUrl: true
          }
        }
      }
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Comment created successfully',
      comment: commentWithUser
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create comment'
    })
  }
}

// Get comments for a note
export const getComments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const noteId = parseInt(req.params.noteId)
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const sortBy = req.query.sortBy as string || 'newest'
    const userId = req.user?.id

    // Check if note exists and is accessible
    const note = await db.query.studyNote.findFirst({
      where: eq(studyNote.noteId, noteId)
    })

    if (!note) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Note not found'
      })
    }

    // Check if user can view comments on this note
    if (note.visibilityScope === 'private' && note.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Cannot view comments on private note'
      })
    }

    const offset = (page - 1) * limit
    const orderBy = sortBy === 'oldest' ? asc(noteComment.createdAt) : desc(noteComment.createdAt)

    // Get comments with user details
    const comments = await db.query.noteComment.findMany({
      where: eq(noteComment.noteId, noteId),
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
    })

    // Get total count for pagination
    const totalComments = await db.select({ count: noteComment.commentId })
      .from(noteComment)
      .where(eq(noteComment.noteId, noteId))

    const totalCount = totalComments.length
    const totalPages = Math.ceil(totalCount / limit)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error getting comments:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve comments'
    })
  }
}

// Update a comment
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId)
    const { commentText } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    // Check if comment exists and belongs to user
    const comment = await db.query.noteComment.findFirst({
      where: eq(noteComment.commentId, commentId)
    })

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found'
      })
    }

    if (comment.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Can only update your own comments'
      })
    }

    // Update the comment
    const [updatedComment] = await db.update(noteComment)
      .set({ 
        commentText,
        updatedAt: new Date().toISOString()
      })
      .where(eq(noteComment.commentId, commentId))
      .returning()

    // Get updated comment with user details
    const commentWithUser = await db.query.noteComment.findFirst({
      where: eq(noteComment.commentId, commentId),
      with: {
        user: {
          columns: {
            userId: true,
            userName: true,
            avatarUrl: true
          }
        }
      }
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comment updated successfully',
      comment: commentWithUser
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update comment'
    })
  }
}

// Delete a comment
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId)
    const userId = req.user?.id

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    // Check if comment exists and belongs to user
    const comment = await db.query.noteComment.findFirst({
      where: eq(noteComment.commentId, commentId)
    })

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found'
      })
    }

    if (comment.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Can only delete your own comments'
      })
    }

    // Delete the comment
    await db.delete(noteComment)
      .where(eq(noteComment.commentId, commentId))

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete comment'
    })
  }
}
