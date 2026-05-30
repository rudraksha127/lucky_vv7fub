import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

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

const app = express()
const isDev = process.env.NODE_ENV !== 'production'

const corsOrigin = process.env.CLIENT_URL || true

app.use(helmet())
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// Rate limiter — relaxed in development
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 100,
    message: { error: 'Too many requests, slow down warrior!' },
  })
)

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
app.use('/api/submissions', submissionRoutes)
app.use('/api/contests', contestRoutes)
app.use('/api/battles', battleRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/classrooms', classroomRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

export default app
