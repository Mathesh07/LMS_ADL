import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi, Note, CreateNoteRequest, UpdateNoteRequest } from '@/services/api'
import { toast } from 'sonner'

// Query Keys
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...noteKeys.lists(), { filters }] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: number) => [...noteKeys.details(), id] as const,
  userNotes: (userId: number) => [...noteKeys.all, 'user', userId] as const,
  publicNotes: () => [...noteKeys.all, 'public'] as const,
}

// Get user's notes
export const useUserNotes = (
  userId: number,
  params?: {
    page?: number
    limit?: number
    search?: string
    noteType?: string
    tags?: string
  }
) => {
  return useQuery({
    queryKey: noteKeys.list({ userId, ...params }),
    queryFn: () => notesApi.getUserNotes(userId, params),
    enabled: !!userId,
  })
}

// Get public notes
export const usePublicNotes = (params?: {
  page?: number
  limit?: number
  search?: string
  noteType?: string
  tags?: string
  sortBy?: 'newest' | 'oldest' | 'popular'
}) => {
  return useQuery({
    queryKey: noteKeys.list({ public: true, ...params }),
    queryFn: () => notesApi.getPublic(params),
  })
}

// Get single note
export const useNote = (noteId: number) => {
  return useQuery({
    queryKey: noteKeys.detail(noteId),
    queryFn: () => notesApi.getById(noteId),
    enabled: !!noteId,
  })
}

// Create note mutation
export const useCreateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => notesApi.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
        toast.success('Note created successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create note')
    },
  })
}

// Update note mutation
export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: number; data: UpdateNoteRequest }) =>
      notesApi.update(noteId, data),
    onSuccess: (response, { noteId }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: noteKeys.detail(noteId) })
        queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
        toast.success('Note updated successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update note')
    },
  })
}

// Delete note mutation
export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: number) => notesApi.delete(noteId),
    onSuccess: (response, noteId) => {
      if (response.success) {
        queryClient.removeQueries({ queryKey: noteKeys.detail(noteId) })
        queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
        toast.success('Note deleted successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete note')
    },
  })
}

// Update note visibility mutation
export const useUpdateNoteVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, visibilityScope }: { 
      noteId: number; 
      visibilityScope: 'private' | 'group' | 'public' 
    }) => notesApi.updateVisibility(noteId, visibilityScope),
    onSuccess: (response, { noteId }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: noteKeys.detail(noteId) })
        queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
        toast.success('Note visibility updated successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update note visibility')
    },
  })
}

// Share note to group mutation
export const useShareNoteToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, groupId }: { noteId: number; groupId: number }) =>
      notesApi.shareToGroup(noteId, groupId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
        toast.success('Note shared to group successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to share note to group')
    },
  })
}
