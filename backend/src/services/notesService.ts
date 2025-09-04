import { db } from '../drizzle'
import { studyNote, users, studyGroupMembership } from '../drizzle/schema'
import { eq, and, or, desc, ilike, sql } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'
import { StatusCodes } from 'http-status-codes'

export class NotesService {
  static async createNote(userId: number, noteData: {
    title: string
    content?: string
    noteType?: 'text' | 'document' | 'link' | 'multimedia'
    tags?: string[]
    relatedModuleId?: number
  }) {
    const { title, content, noteType = 'text', tags, relatedModuleId } = noteData

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

    return newNote
  }

  static async getNoteById(noteId: number, userId: number) {
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

    // Check permissions
    const canView = await this.canUserViewNote(note, userId)
    if (!canView) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }

    return note
  }

  static async canUserViewNote(note: any, userId: number): Promise<boolean> {
    if (note.userId === userId || note.visibilityScope === 'public') {
      return true
    }

    if (note.isShared && note.sharedWithGroupId) {
      const membership = await db.query.studyGroupMembership.findFirst({
        where: and(
          eq(studyGroupMembership.groupId, note.sharedWithGroupId),
          eq(studyGroupMembership.userId, userId),
          sql`${studyGroupMembership.leftAt} IS NULL`
        )
      })
      return !!membership
    }

    return false
  }

  static async updateNote(noteId: number, userId: number, updateData: {
    title?: string
    content?: string
    tags?: string[]
    relatedModuleId?: number
  }) {
    const note = await db.query.studyNote.findFirst({
      where: eq(studyNote.noteId, noteId)
    })

    if (!note) {
      throw new AppError('Note not found', StatusCodes.NOT_FOUND)
    }

    if (note.userId !== userId) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }

    const { title, content, tags, relatedModuleId } = updateData
    const updateFields: any = {
      lastEditedBy: userId,
      updatedAt: new Date().toISOString()
    }

    if (title !== undefined) updateFields.title = title
    if (content !== undefined) updateFields.content = content
    if (tags !== undefined) updateFields.tags = JSON.stringify(tags)
    if (relatedModuleId !== undefined) updateFields.relatedModuleId = relatedModuleId

    const [updatedNote] = await db.update(studyNote)
      .set(updateFields)
      .where(eq(studyNote.noteId, noteId))
      .returning()

    return updatedNote
  }

  static async deleteNote(noteId: number, userId: number) {
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
    return true
  }

  static async shareNoteToGroup(noteId: number, groupId: number, userId: number) {
    const note = await db.query.studyNote.findFirst({
      where: eq(studyNote.noteId, noteId)
    })

    if (!note) {
      throw new AppError('Note not found', StatusCodes.NOT_FOUND)
    }

    if (note.userId !== userId) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }

    // Check if user is member of the group
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

    const [updatedNote] = await db.update(studyNote)
      .set({
        isShared: true,
        sharedWithGroupId: groupId,
        visibilityScope: 'group',
        updatedAt: new Date().toISOString()
      })
      .where(eq(studyNote.noteId, noteId))
      .returning()

    return updatedNote
  }

  static async incrementViewCount(noteId: number, viewerId: number) {
    const note = await db.query.studyNote.findFirst({
      where: eq(studyNote.noteId, noteId)
    })

    if (note && note.userId !== viewerId) {
      await db.update(studyNote)
        .set({ viewCount: (note.viewCount || 0) + 1 })
        .where(eq(studyNote.noteId, noteId))
    }
  }
}
