import 'dotenv/config'
import express, {Express,Request, Response, NextFunction} from 'express'
import cors,{CorsOptions} from 'cors'

const app:Express = express()

const corsOptions:CorsOptions = {
    origin: ['*'],
    credentials:true
}

app.use(cors(corsOptions))
app.use(express.json({ limit : '10mb' }))



export default app