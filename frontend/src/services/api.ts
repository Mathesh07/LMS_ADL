// API Configuration and Base Service
// Use relative URL to leverage Vite proxy
const API_BASE_URL = '/api'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Base API Service Class
class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      credentials: 'include', // Include cookies for session management
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : ''
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint
    
    return this.request<T>(url, {
      method: 'GET',
    })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Create API service instance
export const apiService = new ApiService(API_BASE_URL)

// Specific API Services

// Auth Service
export const authApi = {
  login: (user_email: string, password: string) =>
    apiService.post('/auth/login', { user_email, password }),
  
  register: (user_name: string, user_email: string, password: string) =>
    apiService.post('/auth/register', { user_name, user_email, password }),
  
  logout: () =>
    apiService.post('/auth/logout'),
  
  me: () =>
    apiService.get('/auth/me'),
  
  verifyEmail: (user_email: string, otp_code: string) =>
    apiService.post('/auth/verify-email', { user_email, otp_code }),
  
  forgotPassword: (email: string) =>
    apiService.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiService.post('/auth/reset-password', { token, password }),
}

// Notes Service
export interface Note {
  noteId: number
  title: string
  content: string
  noteType: 'text' | 'image' | 'audio' | 'video' | 'pdf'
  tags: string[]
  visibilityScope: 'private' | 'group' | 'public'
  viewCount: number
  createdAt: string
  updatedAt: string
  user: {
    userId: number
    userName: string
  }
}

export interface CreateNoteRequest {
  title: string
  content: string
  noteType?: 'text' | 'image' | 'audio' | 'video' | 'pdf'
  tags?: string[]
  relatedModuleId?: number
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  tags?: string[]
  relatedModuleId?: number
}

export const notesApi = {
  // Create a new note
  create: (data: CreateNoteRequest) =>
    apiService.post<Note>('/notes', data),
  
  // Get user's notes
  getUserNotes: (userId: number, params?: {
    page?: number
    limit?: number
    search?: string
    noteType?: string
    tags?: string
  }) =>
    apiService.get<PaginatedResponse<Note>>(`/notes/user/${userId}`, params),
  
  // Get a single note
  getById: (noteId: number) =>
    apiService.get<Note>(`/notes/${noteId}`),
  
  // Update a note
  update: (noteId: number, data: UpdateNoteRequest) =>
    apiService.put<Note>(`/notes/${noteId}`, data),
  
  // Delete a note
  delete: (noteId: number) =>
    apiService.delete(`/notes/${noteId}`),
  
  // Get public notes
  getPublic: (params?: {
    page?: number
    limit?: number
    search?: string
    noteType?: string
    tags?: string
    sortBy?: 'newest' | 'oldest' | 'popular'
  }) =>
    apiService.get<PaginatedResponse<Note>>('/notes/public', params),
  
  // Update note visibility
  updateVisibility: (noteId: number, visibilityScope: 'private' | 'group' | 'public') =>
    apiService.patch(`/notes/${noteId}/visibility`, { visibilityScope }),
  
  // Share note to group
  shareToGroup: (noteId: number, groupId: number) =>
    apiService.post(`/notes/${noteId}/share/${groupId}`),
}

// Comments Service
export interface Comment {
  commentId: number
  noteId: number
  userId: number
  commentText: string
  createdAt: string
  updatedAt: string
  user: {
    userId: number
    userName: string
  }
}

export interface CreateCommentRequest {
  commentText: string
}

export const commentsApi = {
  // Create a comment
  create: (noteId: number, data: CreateCommentRequest) =>
    apiService.post<Comment>(`/comments/${noteId}`, data),
  
  // Get comments for a note
  getByNoteId: (noteId: number, params?: {
    page?: number
    limit?: number
    sortBy?: 'newest' | 'oldest'
  }) =>
    apiService.get<PaginatedResponse<Comment>>(`/comments/${noteId}`, params),
  
  // Update a comment
  update: (commentId: number, data: CreateCommentRequest) =>
    apiService.put<Comment>(`/comments/${commentId}`, data),
  
  // Delete a comment
  delete: (commentId: number) =>
    apiService.delete(`/comments/${commentId}`),
}

// Groups Service
export interface Group {
  groupId: number
  groupName: string
  description: string
  createdBy: number
  memberCount: number
  createdAt: string
  updatedAt: string
}

export const groupsApi = {
  // Create a group
  create: (data: { groupName: string; description: string }) =>
    apiService.post<Group>('/groups', data),
  
  // Get user's groups
  getUserGroups: (params?: { page?: number; limit?: number }) =>
    apiService.get<PaginatedResponse<Group>>('/groups/my-groups', params),
  
  // Get group details
  getById: (groupId: number) =>
    apiService.get<Group>(`/groups/${groupId}`),
  
  // Update group
  update: (groupId: number, data: { groupName?: string; description?: string }) =>
    apiService.put<Group>(`/groups/${groupId}`, data),
  
  // Delete group
  delete: (groupId: number) =>
    apiService.delete(`/groups/${groupId}`),
  
  // Join group
  join: (groupId: number) =>
    apiService.post(`/groups/${groupId}/join`),
  
  // Leave group
  leave: (groupId: number) =>
    apiService.post(`/groups/${groupId}/leave`),
}

// Friends Service
export interface Friend {
  friendshipId: number
  userId: number
  friendId: number
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: string
  friend: {
    userId: number
    userName: string
    email: string
  }
}

export const friendsApi = {
  // Send friend request
  sendRequest: (friendId: number) =>
    apiService.post('/friends/request', { friendId }),
  
  // Accept friend request
  acceptRequest: (friendshipId: number) =>
    apiService.post(`/friends/${friendshipId}/accept`),
  
  // Reject friend request
  rejectRequest: (friendshipId: number) =>
    apiService.post(`/friends/${friendshipId}/reject`),
  
  // Get friends list
  getFriends: (params?: { page?: number; limit?: number }) =>
    apiService.get<PaginatedResponse<Friend>>('/friends', params),
  
  // Get pending requests
  getPendingRequests: (params?: { page?: number; limit?: number }) =>
    apiService.get<PaginatedResponse<Friend>>('/friends/pending', params),
  
  // Remove friend
  remove: (friendshipId: number) =>
    apiService.delete(`/friends/${friendshipId}`),
}
