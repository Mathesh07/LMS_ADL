import { z } from 'zod'

// Notes validation schemas
export const createNoteSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .trim(),
    content: z.string()
      .max(10000, 'Content must be less than 10000 characters')
      .optional(),
    noteType: z.enum(['text', 'document', 'link', 'multimedia'])
      .optional()
      .default('text'),
    tags: z.array(z.string().trim()).optional(),
    relatedModuleId: z.number().int().positive().optional()
  })
})

export const updateNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  }),
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .trim()
      .optional(),
    content: z.string()
      .max(10000, 'Content must be less than 10000 characters')
      .optional(),
    tags: z.array(z.string().trim()).optional(),
    relatedModuleId: z.number().int().positive().optional()
  })
})

export const getNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  })
})

export const getUserNotesSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    search: z.string().trim().optional(),
    noteType: z.enum(['text', 'document', 'link', 'multimedia']).optional(),
    tags: z.string().optional()
  })
})

export const shareNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number),
    groupId: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  })
})

export const deleteNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  })
})

// Study Groups validation schemas
export const createGroupSchema = z.object({
  body: z.object({
    groupName: z.string()
      .min(1, 'Group name is required')
      .max(255, 'Group name must be less than 255 characters')
      .trim(),
    description: z.string()
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),
    visibility: z.enum(['public', 'private', 'restricted'])
      .optional()
      .default('public')
  })
})

export const updateGroupSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  }),
  body: z.object({
    groupName: z.string()
      .min(1, 'Group name is required')
      .max(255, 'Group name must be less than 255 characters')
      .trim()
      .optional(),
    description: z.string()
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),
    visibility: z.enum(['public', 'private', 'restricted']).optional()
  })
})

export const getGroupSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  })
})

export const joinGroupSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  })
})

export const leaveGroupSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  })
})

export const getGroupMembersSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20)
  })
})

export const getGroupNotesSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid group ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    search: z.string().trim().optional()
  })
})

// Friend Requests validation schemas
export const sendFriendRequestSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number)
  })
})

export const acceptFriendRequestSchema = z.object({
  params: z.object({
    requestId: z.string().regex(/^\d+$/, 'Invalid request ID').transform(Number)
  })
})

export const rejectFriendRequestSchema = z.object({
  params: z.object({
    requestId: z.string().regex(/^\d+$/, 'Invalid request ID').transform(Number)
  })
})

export const getUserFriendsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20),
    search: z.string().trim().optional()
  })
})

export const getFriendRequestsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20),
    type: z.enum(['sent', 'received', 'all']).optional().default('received')
  })
})

// Comment validation schemas
export const createCommentSchema = z.object({
  params: z.object({
    noteId: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  }),
  body: z.object({
    commentText: z.string().min(1, 'Comment text is required').max(1000, 'Comment text too long')
  })
})

export const getCommentsSchema = z.object({
  params: z.object({
    noteId: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20),
    sortBy: z.enum(['newest', 'oldest']).optional().default('newest')
  })
})

export const updateCommentSchema = z.object({
  params: z.object({
    commentId: z.string().regex(/^\d+$/, 'Invalid comment ID').transform(Number)
  }),
  body: z.object({
    commentText: z.string().min(1, 'Comment text is required').max(1000, 'Comment text too long')
  })
})

export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: z.string().regex(/^\d+$/, 'Invalid comment ID').transform(Number)
  })
})

// Public notes validation schemas
export const getPublicNotesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    search: z.string().trim().optional(),
    noteType: z.enum(['text', 'document', 'link', 'multimedia']).optional(),
    tags: z.string().optional(),
    sortBy: z.enum(['newest', 'oldest', 'popular', 'mostViewed']).optional().default('newest')
  })
})

export const updateNoteVisibilitySchema = z.object({
  params: z.object({
    noteId: z.string().regex(/^\d+$/, 'Invalid note ID').transform(Number)
  }),
  body: z.object({
    visibilityScope: z.enum(['private', 'group', 'public'])
  })
})
