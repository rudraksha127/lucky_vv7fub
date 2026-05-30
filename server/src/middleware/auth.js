import { createClerkClient } from '@clerk/backend'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const clerkSecretKey = process.env.CLERK_SECRET_KEY
const clerkClient = clerkSecretKey
  ? createClerkClient({ secretKey: clerkSecretKey })
  : null

// Dev-mode demo user ID
const DEV_CLERK_ID = 'dev_demo_user_001'

export const requireAuth = async (req, res, next) => {
  try {
    // ── Dev-mode bypass ─────────────────────────────────────
    // If no Clerk secret key is configured, use a demo user
    if (!clerkClient) {
      // Check for dev token
      const token = req.headers.authorization?.split(' ')[1]
      if (token === 'dev-token' || process.env.NODE_ENV === 'development') {
        let user = await User.findOne({ clerkId: DEV_CLERK_ID })
        if (!user) {
          user = await User.create({
            clerkId: DEV_CLERK_ID,
            username: 'demo_coder',
            email: 'demo@algozen.dev',
            avatar: '',
            role: 'admin', // Admin so we can test everything
          })
        }
        req.userId = DEV_CLERK_ID
        req.user = user
        return next()
      }
      return res.status(401).json({ error: 'Auth not configured — use dev login' })
    }

    // ── Production Clerk auth ───────────────────────────────
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const { sub: clerkId } = await clerkClient.verifyToken(token)

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(401).json({ error: 'User not registered' })

    req.userId = clerkId
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
