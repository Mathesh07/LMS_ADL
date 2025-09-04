import { db } from '../drizzle'
import { studyGroup, studyGroupMembership, users } from '../drizzle/schema'
import { eq, and, sql } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'
import { StatusCodes } from 'http-status-codes'

export class GroupsService {
  static async createGroup(userId: number, groupData: {
    groupName: string
    description?: string
    visibility?: 'public' | 'private' | 'restricted'
  }) {
    const { groupName, description, visibility = 'public' } = groupData

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

    return newGroup
  }

  static async getGroupById(groupId: number, userId: number) {
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

    // Check permissions for private groups
    if (group.visibility === 'private') {
      const membership = await this.getUserMembership(groupId, userId)
      if (!membership) {
        throw new AppError('Access denied', StatusCodes.FORBIDDEN)
      }
    }

    return group
  }

  static async getUserMembership(groupId: number, userId: number) {
    return await db.query.studyGroupMembership.findFirst({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.userId, userId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })
  }

  static async joinGroup(groupId: number, userId: number) {
    const group = await db.query.studyGroup.findFirst({
      where: eq(studyGroup.groupId, groupId)
    })

    if (!group) {
      throw new AppError('Group not found', StatusCodes.NOT_FOUND)
    }

    // Check if already a member
    const existingMembership = await this.getUserMembership(groupId, userId)
    if (existingMembership) {
      throw new AppError('You are already a member of this group', StatusCodes.BAD_REQUEST)
    }

    // Check for previous membership
    const previousMembership = await db.query.studyGroupMembership.findFirst({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.userId, userId)
      )
    })

    if (previousMembership && previousMembership.leftAt) {
      // Rejoin
      await db.update(studyGroupMembership)
        .set({ 
          leftAt: null,
          joinedAt: new Date().toISOString()
        })
        .where(eq(studyGroupMembership.membershipId, previousMembership.membershipId))
    } else {
      // New membership
      await db.insert(studyGroupMembership).values({
        groupId,
        userId,
        role: 'member'
      })
    }

    return true
  }

  static async leaveGroup(groupId: number, userId: number) {
    const membership = await this.getUserMembership(groupId, userId)
    if (!membership) {
      throw new AppError('You are not a member of this group', StatusCodes.BAD_REQUEST)
    }

    const group = await db.query.studyGroup.findFirst({
      where: eq(studyGroup.groupId, groupId)
    })

    // Handle group ownership transfer or deletion
    if (group?.createdBy === userId) {
      await this.handleOwnerLeaving(groupId, userId)
    }

    // Mark membership as left
    await db.update(studyGroupMembership)
      .set({ leftAt: new Date().toISOString() })
      .where(eq(studyGroupMembership.membershipId, membership.membershipId))

    return true
  }

  private static async handleOwnerLeaving(groupId: number, userId: number) {
    // Get other admins
    const otherAdmins = await db.query.studyGroupMembership.findMany({
      where: and(
        eq(studyGroupMembership.groupId, groupId),
        eq(studyGroupMembership.role, 'admin'),
        sql`${studyGroupMembership.userId} != ${userId}`,
        sql`${studyGroupMembership.leftAt} IS NULL`
      )
    })

    // Get all other members
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
      return
    }

    if (otherAdmins.length > 0) {
      // Transfer to first admin
      await db.update(studyGroup)
        .set({ createdBy: otherAdmins[0].userId })
        .where(eq(studyGroup.groupId, groupId))
    } else {
      // Promote first member to admin and transfer ownership
      await db.update(studyGroupMembership)
        .set({ role: 'admin' })
        .where(eq(studyGroupMembership.membershipId, allMembers[0].membershipId))
      
      await db.update(studyGroup)
        .set({ createdBy: allMembers[0].userId })
        .where(eq(studyGroup.groupId, groupId))
    }
  }

  static async getMemberCount(groupId: number): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(studyGroupMembership)
      .where(and(
        eq(studyGroupMembership.groupId, groupId),
        sql`${studyGroupMembership.leftAt} IS NULL`
      ))

    return Number(result[0].count)
  }
}
