import mongoose from 'mongoose'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const server = createServer(app)
let io

try {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  })
} catch (err) {
  // Fallback for environments where Socket.io fails (e.g., serverless)
  console.warn('⚠️ Socket.io not available:', err.message)
}

export { io }

// ─── Socket.io (Battle Mode + Live Leaderboard) ──────────
if (io) {
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`)

  // Join personal notification room
  socket.on('join-user', (userId) => {
    socket.join(userId)
  })

  // Contest rooms
  socket.on('join-contest', (contestId) => {
    socket.join(`contest-${contestId}`)
  })

  // Battle rooms
  socket.on('join-battle', (battleId) => {
    socket.join(`battle-${battleId}`)
  })

  // Handle battle player status updates
  socket.on('player-update', (data) => {
    const { battleId } = data
    io.to(`battle-${battleId}`).emit('player-update', data)
  })

  // Real-time code streaming (debounced on client, relayed to opponent)
  socket.on('code-update', (data) => {
    const { battleId, code, language } = data
    socket.to(`battle-${battleId}`).emit('opponent-code-update', { code, language })
  })

  // Typing indicator
  socket.on('opponent-typing', (data) => {
    const { battleId, isTyping } = data
    socket.to(`battle-${battleId}`).emit('opponent-typing', { isTyping })
  })

  // Leave rooms
  socket.on('leave-battle', (battleId) => {
    socket.leave(`battle-${battleId}`)
  })

  socket.on('leave-contest', (contestId) => {
    socket.leave(`contest-${contestId}`)
  })

  socket.on('disconnect', () => {
    console.log(`💤 User disconnected: ${socket.id}`)
  })
})
}

// ─── Socket.io Emit Helpers ────────────────────────────────
// Import these from route handlers to emit events to rooms
export const emitToContest = (contestId, event, data) => {
  if (!io) return
  io.to(`contest-${contestId}`).emit(event, data)
}

export const emitToBattle = (roomCode, event, data) => {
  if (!io) return
  io.to(`battle-${roomCode}`).emit(event, data)
}

export const emitToUser = (userId, event, data) => {
  if (!io) return
  io.to(userId).emit(event, data)
}

export const emitToAll = (event, data) => {
  if (!io) return
  io.emit(event, data)
}

// ─── MongoDB Connection ───────────────────────────────────
const PORT = process.env.PORT || 5000
const shouldListen = process.env.VERCEL !== '1'

async function connectDB() {
  if (process.env.MONGODB_URI) {
    // Use provided MongoDB URI (Atlas / local)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🍃 MongoDB connected:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))
  } else {
    // Auto-start in-memory MongoDB (no install needed!)
    console.log('📦 No MONGODB_URI set — starting in-memory MongoDB...')
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
    console.log(`🍃 In-memory MongoDB started at ${uri}`)
  }
}

if (shouldListen) {
  connectDB()
    .then(async () => {
      // Warn if no AI API key is configured
      if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
        console.warn('⚠️  No AI API key set — AlgoGuru hints & AI features will be unavailable')
        console.warn('   Set GROQ_API_KEY or OPENAI_API_KEY in .env to enable AI features')
      }

      // Auto-seed if database is empty
      const { default: Problem } = await import('./models/Problem.js')
      const count = await Problem.countDocuments()
      if (count === 0) {
        console.log('🌱 Database empty — auto-seeding problems...')
        const { seed } = await import('./scripts/seed.js')
        await seed(false, false)
      }

      server.listen(PORT, () => {
        console.log(`🚀 AlgoZen server running on port ${PORT}`)
        console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
        console.log(`⚙️  Mode: ${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`)
      })
    })
    .catch((err) => {
      console.error('❌ Failed to start server:', err)
      process.exit(1)
    })
}
