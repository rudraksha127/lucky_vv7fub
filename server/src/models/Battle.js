import mongoose from 'mongoose'

const battleSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    length: 6,
  },

  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  players: [{
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    status: {
      type: String,
      enum: ['waiting', 'solving', 'solved', 'gave_up'],
      default: 'waiting',
    },
    solveTime: { type: Number, default: null }, // seconds
    attempts:  { type: Number, default: 0 },
  }],

  status: {
    type: String,
    enum: ['waiting', 'countdown', 'live', 'ended'],
    default: 'waiting',
  },

  startTime: { type: Date, default: null },
  endTime:   { type: Date, default: null },
  winnerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  duration:  { type: Number, default: 1800 }, // 30 min in seconds

}, { timestamps: true })

// Generate a unique 6-char room code
battleSchema.statics.generateRoomCode = async function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    const exists = await this.findOne({ roomCode: code })
    if (!exists) return code
  }
  throw new Error('Could not generate unique room code')
}

export default mongoose.model('Battle', battleSchema)
