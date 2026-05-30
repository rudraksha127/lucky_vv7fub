import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { globalLimit, submissionLimit, aiLimit } from './middleware/rateLimiter.js'

// Routes
import authRoutes from './routes/auth.js'
import problemRoutes from './routes/problems.js'
import submissionRoutes from './routes/submissions.js'
import contestRoutes from './routes/contests.js'
import battleRoutes from './routes/battles.js'
import aiRoutes from './routes/ai.js'
import adminRoutes from './routes/admin.js'
import classroomRoutes from './routes/classroom.js'
import questRoutes from './routes/quests.js'
import leaderboardRoutes from './routes/leaderboard.js'
import revisionRoutes from './routes/revisions.js'
import communityRoutes from './routes/community.js'
import certificateRoutes from './routes/certificates.js'

const app = express()
const isDev = process.env.NODE_ENV !== 'production'

// In development, allow any localhost origin. In production, restrict to CLIENT_URL.
function corsOriginCheck(origin, cb) {
  const allowed = process.env.CLIENT_URL
  if (!allowed || !origin) {
    // Allow requests with no origin (server-to-server, curl, etc.) or when CLIENT_URL is unset
    cb(null, true)
  } else if (allowed === origin) {
    cb(null, true)
  } else if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?:\:\d+)?$/.test(origin)) {
    // In dev mode, allow any localhost or loopback IP on any port
    cb(null, true)
  } else {
    cb(new Error(`Origin ${origin} not allowed by CORS`))
  }
}

app.use(helmet())
app.use(cors({ origin: corsOriginCheck, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// Global rate limit
app.use('/api/', globalLimit)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '⚔️  AlgoZen API is alive',
    timestamp: new Date().toISOString(),
    mode: isDev ? 'development' : 'production',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/submissions', submissionLimit, submissionRoutes)
app.use('/api/contests', contestRoutes)
app.use('/api/battles', battleRoutes)
app.use('/api/ai', aiLimit, aiRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/classrooms', classroomRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/revisions', revisionRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/certificates', certificateRoutes)

export default app
