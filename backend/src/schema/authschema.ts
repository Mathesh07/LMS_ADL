import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    user_name : z.string("Name is required"),
    user_email: z.string("Email is Required").email("Not a valid email"),
    password: z.string("Password is required")
  })
});

export type RegisterPayload = z.infer<typeof registerSchema>;