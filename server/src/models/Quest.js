import mongoose from 'mongoose'

const questSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:   { type: Date, required: true },

  // Quest types tracked
  quests: {
    solveOne:   { type: Boolean, default: false },
    submitThree: { type: Boolean, default: false },
    tryRealWorld: { type: Boolean, default: false },
  },

  bonusClaimed: { type: Boolean, default: false },

}, { timestamps: true })

questSchema.index({ userId: 1, date: 1 }, { unique: true })

export default mongoose.model('Quest', questSchema)
