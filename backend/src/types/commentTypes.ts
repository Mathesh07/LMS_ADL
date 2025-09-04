import { z } from 'zod'
import { 
  createCommentSchema, 
  getCommentsSchema, 
  updateCommentSchema, 
  deleteCommentSchema 
} from '../schemas/socialSchemas'

export type CreateCommentPayload = z.infer<typeof createCommentSchema>
export type GetCommentsPayload = z.infer<typeof getCommentsSchema>
export type UpdateCommentPayload = z.infer<typeof updateCommentSchema>
export type DeleteCommentPayload = z.infer<typeof deleteCommentSchema>
