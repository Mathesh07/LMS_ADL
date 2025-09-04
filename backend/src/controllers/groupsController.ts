import { Request, Response } from 'express'

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string }
}
import { StatusCodes } from 'http-status-codes'
import { db } from '../drizzle'
import { studyGroup, studyGroupMembership, users, studyNote } from '../drizzle/schema'
import { eq, and, or, desc, ilike, sql } from 'drizzle-orm'
import { AppError, asyncHandler } from '../middleware/errorHandler'
import { 
  CreateGroupRequest, 
  UpdateGroupRequest, 
  GroupResponse, 
  GroupMemberResponse,
  NoteResponse,
  ApiResponse, 
  PaginatedResponse 
} from '../types/socialTypes'

// Create a new study group
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { groupName, description, visibility = 'public' }: CreateGroupRequest = req.body
  const userId = req.user!.id

  const [newGroup] = await db.insert(studyGroup).values({
    groupName,
    description,
    createdBy: userId,
    visibility
  }).returning()

  // Add creator as admin member
  await db.insert(studyGroupMembership).values({
    groupId: newGroup.groupId,
    userId,
    role: 'admin'
  })

  const response: ApiResponse<GroupResponse> = {
    success: true,
    message: 'Study group created successfully',
    data: {
      groupId: newGroup.groupId,
      groupName: newGroup.groupName,
      createdBy: newGroup.createdBy,
      description: newGroup.description,
      visibility: newGroup.visibility,
      createdAt: newGroup.createdAt!,
      updatedAt: newGroup.updatedAt!,
      memberCount: 1
    }
  }

  res.status(StatusCodes.CREATED).json(response)
})

// Get group details
export const getGroup = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id as unknown as number
  const userId = req.user!.id

  const group = await db.query.studyGroup.findFirst({
    where: eq(studyGroup.groupId, groupId),
    with: {
      creator: {
        columns: {
          userId: true,
          userName: true
        }
      }
    }
  })

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND)
  }

  // Check if user can view the group
  if (group.visibility === 'private') {
    const membership = await db.query.studyGroupMembership.findFirst({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.userId, userId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })

    if (!membership) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }
  }

  // Get member count
  const memberCount = await db.select({ count: sql<number>`count(*)` })
    .from(studyGroupMembership)
    .where(and(
      eq(studyGroupMembership.groupId, groupId),
      sql`${studyGroupMembership.leftAt} IS NULL`
    ))

  const response: ApiResponse<GroupResponse> = {
    success: true,
    message: 'Group retrieved successfully',
    data: {
      groupId: group.groupId,
      groupName: group.groupName,
      createdBy: group.createdBy,
      description: group.description,
      visibility: group.visibility,
      createdAt: group.createdAt!,
      updatedAt: group.updatedAt!,
      memberCount: Number(memberCount[0].count),
      creator: {
        userId: (group.creator as any)?.userId,
        userName: (group.creator as any)?.userName
      }
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Join a study group
export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id as unknown as number
  const userId = req.user!.id

  const group = await db.query.studyGroup.findFirst({
    where: eq(studyGroup.groupId, groupId)
  })

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND)
  }

  // Check if user is already a member
  const existingMembership = await db.query.studyGroupMembership.findFirst({
    where: and(
      eq(studyGroupMembership.groupId, groupId),
      eq(studyGroupMembership.userId, userId),
      sql`${studyGroupMembership.leftAt} IS NULL`
    )
  })

  if (existingMembership) {
    throw new AppError('You are already a member of this group', StatusCodes.BAD_REQUEST)
  }

  // Check if user previously left and rejoin
  const previousMembership = await db.query.studyGroupMembership.findFirst({
    where: and(
      eq(studyGroupMembership.groupId, groupId),
      eq(studyGroupMembership.userId, userId)
    )
  })

  if (previousMembership && previousMembership.leftAt) {
    // Rejoin by clearing leftAt
    await db.update(studyGroupMembership)
      .set({ 
        leftAt: null,
        joinedAt: new Date().toISOString()
      })
      .where(eq(studyGroupMembership.membershipId, previousMembership.membershipId))
  } else {
    // Create new membership
    await db.insert(studyGroupMembership).values({
      groupId,
      userId,
      role: 'member'
    })
  }

  const response: ApiResponse = {
    success: true,
    message: 'Successfully joined the group'
  }

  res.status(StatusCodes.OK).json(response)
})

// Leave a study group
export const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id as unknown as number
  const userId = req.user!.id

  const membership = await db.query.studyGroupMembership.findFirst({
    where: and(
      eq(studyGroupMembership.groupId, groupId),
      eq(studyGroupMembership.userId, userId),
      sql`${studyGroupMembership.leftAt} IS NULL`
    )
  })

  if (!membership) {
    throw new AppError('You are not a member of this group', StatusCodes.BAD_REQUEST)
  }

  // Check if user is the creator/admin
  const group = await db.query.studyGroup.findFirst({
    where: eq(studyGroup.groupId, groupId)
  })

  if (group?.createdBy === userId) {
    // Transfer ownership to another admin or delete group if no other members
    const otherAdmins = await db.query.studyGroupMembership.findMany({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.role, 'admin'),
        sql`${studyGroupMembership.userId} != ${userId}`,
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })

    const allMembers = await db.query.studyGroupMembership.findMany({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        sql`${studyGroupMembership.userId} != ${userId}`,
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })

    if (allMembers.length === 0) {
      // Delete the group if no other members
      await db.delete(studyGroup).where(eq(studyGroup.groupId, groupId))
      
      const response: ApiResponse = {
        success: true,
        message: 'Group deleted as you were the last member'
      }
      return res.status(StatusCodes.OK).json(response)
    } else if (otherAdmins.length > 0) {
      // Transfer ownership to first admin
      await db.update(studyGroup)
        .set({ createdBy: otherAdmins[0].userId })
        .where(eq(studyGroup.groupId, groupId))
    } else {
      // Promote first member to admin
      await db.update(studyGroupMembership)
        .set({ role: 'admin' })
        .where(eq(studyGroupMembership.membershipId, allMembers[0].membershipId))
      
      await db.update(studyGroup)
        .set({ createdBy: allMembers[0].userId })
        .where(eq(studyGroup.groupId, groupId))
    }
  }

  // Mark membership as left
  await db.update(studyGroupMembership)
    .set({ leftAt: new Date().toISOString() })
    .where(eq(studyGroupMembership.membershipId, membership.membershipId))

  const response: ApiResponse = {
    success: true,
    message: 'Successfully left the group'
  }

  res.status(StatusCodes.OK).json(response)
})

// Get group members
export const getGroupMembers = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id as unknown as number
  const userId = req.user!.id
  const { page = 1, limit = 20 } = req.query as any

  const group = await db.query.studyGroup.findFirst({
    where: eq(studyGroup.groupId, groupId)
  })

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND)
  }

  // Check if user can view members
  if (group.visibility === 'private') {
    const membership = await db.query.studyGroupMembership.findFirst({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.userId, userId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })

    if (!membership) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN)
    }
  }

  const offset = (page - 1) * limit

  const [members, totalCount] = await Promise.all([
    db.query.studyGroupMembership.findMany({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      ),
      with: {
        user: {
          columns: {
            userId: true,
            userName: true,
            userEmail: true,
            profilePicture: true
          }
        }
      },
      limit,
      offset
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(studyGroupMembership)
      .where(and(
        eq(studyGroupMembership.groupId, groupId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      ))
  ])

  const total = Number(totalCount[0].count)
  const totalPages = Math.ceil(total / limit)

  const membersData = members.map((member: any) => ({
    membershipId: member.membershipId,
    groupId: member.groupId,
    userId: member.userId,
    role: member.role,
    joinedAt: member.joinedAt!,
    leftAt: member.leftAt,
    user: {
      userId: member.user.userId,
      userName: member.user.userName,
      userEmail: member.user.userEmail,
      profilePicture: member.user.profilePicture
    }
  }))

  const response: PaginatedResponse<GroupMemberResponse> = {
    success: true,
    message: 'Group members retrieved successfully',
    data: membersData,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }

  res.status(StatusCodes.OK).json(response)
})

// Get shared notes in a group
export const getGroupNotes = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id as unknown as number
  const userId = req.user!.id
  const { page = 1, limit = 10, search } = req.query as any

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

  let whereConditions = [
    eq(studyNote.sharedWithGroupId, groupId),
    eq(studyNote.isShared, true)
  ]

  if (search) {
    whereConditions.push(
      or(
        ilike(studyNote.title, `%${search}%`),
        ilike(studyNote.content, `%${search}%`)
      )!
    )
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
    message: 'Group notes retrieved successfully',
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
        userId: (note.user as any)?.userId,
        userName: (note.user as any)?.userName
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
