/**
 * Database Connection Module
 *
 * Handles MongoDB connection lifecycle:
 *   - Connection pooling with optimized pool size
 *   - Graceful shutdown on SIGINT/SIGTERM
 *   - Auto-reconnect on disconnect
 *   - In-memory MongoDB fallback for development
 */

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true)

    if (MONGODB_URI) {
      // Production / local MongoDB
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      console.log('🍃 MongoDB connected:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))
    } else {
      // Auto-start in-memory MongoDB (no install needed!)
      console.log('📦 No MONGODB_URI set — starting in-memory MongoDB...')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      const uri = mongod.getUri()
      await mongoose.connect(uri)
      console.log(`🍃 In-memory MongoDB started at ${uri}`)
    }

    // ─── Event Handlers ──────────────────────────────────────
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting reconnect...')
    })

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB reconnected')
    })

    return mongoose.connection
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }
}

// ─── Graceful Shutdown ─────────────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing MongoDB connection...`)
  try {
    await mongoose.connection.close()
    console.log('🍃 MongoDB connection closed.')
  } catch (err) {
    console.error('Error closing MongoDB:', err)
  }
  process.exit(0)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

export default connectDB
