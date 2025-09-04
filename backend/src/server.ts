import 'dotenv/config'
import app from "./app";
import { startOtpCleanupCron } from './services/cronService'

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
    
    // Start OTP cleanup cron job
    startOtpCleanupCron()
})
