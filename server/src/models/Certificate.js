import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  track: {
    type: String,
    enum: ['DSA', 'RealWorld'],
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  // Unique certificate number: ALGOZEN-{YYYY}-{XXXXX}
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },

  // Metadata
  userName:      { type: String, required: true },
  userEmail:     { type: String, default: '' },
  userLevel:     { type: Number, default: 1 },
  userRank:      { type: String, default: 'Rookie' },
  problemsSolved: { type: Number, default: 0 },
  totalXpEarned:  { type: Number, default: 0 },

  // Completion info
  completedAt: { type: Date, default: Date.now },

  // Generate a sharable URL
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
  },

  // College co-branding (future)
  collegeName: { type: String, default: '' },

  // PDF metadata
  pdfGenerated: { type: Boolean, default: false },
  pdfPath:      { type: String, default: '' },

  // Stats snapshot at time of generation
  snapshot: {
    streakDays:    { type: Number, default: 0 },
    rank:          { type: String, default: 'Rookie' },
    totalSubmissions: { type: Number, default: 0 },
  },

}, { timestamps: true })

certificateSchema.index({ userId: 1, track: 1 }, { unique: true })
certificateSchema.index({ shareToken: 1 })

// Generate unique certificate number
certificateSchema.statics.generateNumber = async function () {
  const year = new Date().getFullYear()
  const prefix = `ALGOZEN-${year}-`
  const last = await this.findOne({ certificateNumber: { $regex: `^${prefix}` } })
    .sort({ certificateNumber: -1 })
    .lean()

  let seq = 1
  if (last) {
    const parts = last.certificateNumber.split('-')
    seq = parseInt(parts[parts.length - 1]) + 1
  }
  return `${prefix}${String(seq).padStart(5, '0')}`
}

// Generate share token
certificateSchema.statics.generateShareToken = async function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  for (let attempt = 0; attempt < 10; attempt++) {
    let token = ''
    for (let i = 0; i < 10; i++) {
      token += chars[Math.floor(Math.random() * chars.length)]
    }
    const exists = await this.findOne({ shareToken: token })
    if (!exists) return token
  }
  return `cert_${Date.now()}`
}

export default mongoose.model('Certificate', certificateSchema)
