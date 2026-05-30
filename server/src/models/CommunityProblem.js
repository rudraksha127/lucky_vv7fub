import mongoose from 'mongoose'

const communityProblemSchema = new mongoose.Schema({
  // ─── Submitter ─────────────────────────────────────────
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // ─── Problem Fields ────────────────────────────────────
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },

  track: {
    type: String,
    enum: ['DSA', 'RealWorld'],
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Rookie', 'Warrior', 'Legend'],
    required: true,
  },

  xpReward: { type: Number, default: 50 },

  constraints:    { type: String, default: '' },
  examples:       [{ input: String, output: String, explanation: String }],
  testCases: [{
    input:       { type: String, required: true },
    output:      { type: String, required: true },
    explanation: { type: String, default: '' },
    isHidden:    { type: Boolean, default: false },
  }],
  hints: [{ type: String }],
  editorialLink: { type: String, default: '' },

  starterCode: {
    cpp:        { type: String, default: '' },
    java:       { type: String, default: '' },
    python:     { type: String, default: '' },
    javascript: { type: String, default: '' },
  },

  // ─── Moderation ────────────────────────────────────────
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  moderatorNotes: { type: String, default: '' },
  moderatedAt:    { type: Date, default: null },

  // Community contributor badge
  communityBadgeAwarded: { type: Boolean, default: false },

  // Reference to the Problem created after approval
  approvedProblemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    default: null,
  },

}, { timestamps: true })

communityProblemSchema.index({ status: 1, createdAt: -1 })
communityProblemSchema.index({ submittedBy: 1, createdAt: -1 })
communityProblemSchema.index({ status: 1, moderatedBy: 1 })

export default mongoose.model('CommunityProblem', communityProblemSchema)
