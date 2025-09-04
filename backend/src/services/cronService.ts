import cron from 'node-cron'
import { db } from '../drizzle'
import { userEmailVerification } from '../drizzle/schema'
import { lt } from 'drizzle-orm'

// OTP cleanup service - runs every minute to clean expired OTPs
export const startOtpCleanupCron = () => {
  // Run every minute to check for expired OTPs
  cron.schedule('*/5 * * * *', async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const deletedOtps = await db
        .delete(userEmailVerification)
        .where(lt(userEmailVerification.createdAt, fiveMinutesAgo))
        .returning()

      if (deletedOtps.length > 0) {
        console.log(`🧹 Cleaned up ${deletedOtps.length} expired OTPs`)
      }
    } catch (error) {
      console.error('❌ Error cleaning up expired OTPs:', error)
    }
  })

  console.log('✅ OTP cleanup cron job started - runs every minute')
}

// Manual cleanup function for immediate use
export const cleanupExpiredOtps = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const deletedOtps = await db
      .delete(userEmailVerification)
      .where(lt(userEmailVerification.createdAt, fiveMinutesAgo))
      .returning()

    console.log(`🧹 Manually cleaned up ${deletedOtps.length} expired OTPs`)
    return deletedOtps.length
  } catch (error) {
    console.error('❌ Error in manual OTP cleanup:', error)
    throw error
  }
}
