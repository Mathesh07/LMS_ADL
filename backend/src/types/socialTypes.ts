// Notes interfaces
export interface CreateNoteRequest {
  title: string
  content?: string
  noteType?: 'text' | 'document' | 'link' | 'multimedia'
  tags?: string[]
  relatedModuleId?: number
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  tags?: string[]
  relatedModuleId?: number
}

export interface NoteResponse {
  noteId: number
  userId: number
  title: string
  content?: string | null
  visibilityScope: 'private' | 'group' | 'public' | null
  relatedModuleId?: number | null
  isShared: boolean | null
  sharedWithGroupId?: number | null
  noteType: 'text' | 'document' | 'link' | 'multimedia' | null
  tags?: any
  attachments?: any
  likeCount: number
  viewCount: number
  lastEditedBy?: number | null
  forkedFromNoteId?: number | null
  createdAt: string
  updatedAt: string
  author?: {
    userId: number
    userName: string
  }
}

export interface ShareNoteRequest {
  groupId: number
}

// Study Groups interfaces
export interface CreateGroupRequest {
  groupName: string
  description?: string
  visibility?: 'public' | 'private' | 'restricted'
}

export interface UpdateGroupRequest {
  groupName?: string
  description?: string
  visibility?: 'public' | 'private' | 'restricted'
}

export interface GroupResponse {
  groupId: number
  groupName: string
  createdBy: number
  description?: string | null
  visibility: 'public' | 'private' | 'restricted' | null
  createdAt: string
  updatedAt: string
  memberCount?: number
  creator?: {
    userId: number
    userName: string
  }
}

export interface GroupMemberResponse {
  membershipId: number
  groupId: number
  userId: number
  role: 'admin' | 'moderator' | 'member' | null
  joinedAt: string
  leftAt?: string | null
  user: {
    userId: number
    userName: string
    userEmail: string
  }
}

export interface JoinGroupRequest {
  // No additional fields needed - user comes from auth
}

// Friend Requests interfaces
export interface SendFriendRequestRequest {
  receiverId: number
}

export interface FriendRequestResponse {
  requestId: number
  senderId: number
  receiverId: number
  status: 'pending' | 'accepted' | 'rejected' | 'blocked' | null
  sentAt: string
  acceptedAt?: string | null
  sender?: {
    userId: number
    userName: string
    userEmail: string
  }
  receiver?: {
    userId: number
    userName: string
    userEmail: string
  }
}

export interface FriendResponse {
  userId: number
  userName: string
  userEmail: string
  profilePicture?: string | null
  friendshipDate: string
}

// Common response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface PaginatedResponse<T = any> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query parameters
export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface NotesQuery extends PaginationQuery {
  search?: string
  noteType?: 'text' | 'document' | 'link' | 'multimedia'
  tags?: string
}

export interface GroupsQuery extends PaginationQuery {
  search?: string
  visibility?: 'public' | 'private' | 'restricted'
}
