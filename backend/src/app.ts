import 'dotenv/config'
import express, {Express,Request, Response, NextFunction} from 'express'
import cors,{CorsOptions} from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes'
import notesRouter from './routes/notesRoutes'
import groupsRouter from './routes/groupsRoutes'
import friendsRouter from './routes/friendsRoutes'
import commentsRouter from './routes/commentsRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { setupSwagger } from './config/swagger'
import morgan from 'morgan'

const app:Express = express()

const corsOptions:CorsOptions = {
    origin: '*',
    credentials:true
}

app.use(cors(corsOptions))
app.use(express.json({ limit : '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))

// Setup Swagger documentation
setupSwagger(app)

// Routes
app.use('/api/auth', authRouter)
app.use('/api/notes', notesRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/friends', friendsRouter)
app.use('/api/comments', commentsRouter)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Server is running' })
})

// 404 handler for undefined routes
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

export default app