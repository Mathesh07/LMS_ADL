import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi, Comment, CreateCommentRequest } from '@/services/api'
import { toast } from 'sonner'

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (noteId: number, filters?: Record<string, any>) => [...commentKeys.lists(), noteId, { filters }] as const,
}

// Get comments for a note
export const useComments = (
  noteId: number,
  params?: {
    page?: number
    limit?: number
    sortBy?: 'newest' | 'oldest'
  }
) => {
  return useQuery({
    queryKey: commentKeys.list(noteId, params),
    queryFn: () => commentsApi.getByNoteId(noteId, params),
    enabled: !!noteId,
  })
}

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: number; data: CreateCommentRequest }) =>
      commentsApi.create(noteId, data),
    onSuccess: (response, { noteId }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
        toast.success('Comment added successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add comment')
    },
  })
}

// Update comment mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CreateCommentRequest }) =>
      commentsApi.update(commentId, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
        toast.success('Comment updated successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update comment')
    },
  })
}

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.delete(commentId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
        toast.success('Comment deleted successfully!')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete comment')
    },
  })
}
