import {Request, Response} from 'express'
import {RegisterPayload} from '../schema/authschema'
import { db } from '../drizzle'
import { users } from '../drizzle/schema'
import { eq } from 'drizzle-orm'
import {StatusCodes} from 'http-status-codes'
import { createSession, generateSalt, generateSessionId, hashPassword } from '../utils/authUtils'

export const registerController = async (
  req: Request<{},{} , RegisterPayload["body"]>,
  res: Response
) => {
    try {
      const {user_name, user_email , password} = req.body
      const user = await db.query.users.findFirst({
        where: eq(users.userEmail, user_email)
      })
      if(user){
          res.status(StatusCodes.BAD_REQUEST).json({success: false, message :'User already exists'})
          return;
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt)

      const [new_user] = await db.insert(users).values({
        userEmail : user_email,
        userName: user_name,
        password : hashedPassword, salt: salt
      }).returning({ id : users.userId })


      if(!new_user){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message: "Error While creating user"})
        return
      }
      const sessionId = generateSessionId()

      await createSession(sessionId, new_user.id)

      res.cookie(process.env.COOKIE_SESSION_KEY!, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.SESSION_EXPIRATION_SECONDS ?? "0", 10) * 1000, // ms
        sameSite: "lax",
      })

      res.status(StatusCodes.CREATED).json({success: true, message: "User sucessfully created"})

    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: "Error while registering  the user"})
    }
}
