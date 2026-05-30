import mongoose from 'mongoose'

const revisionCardSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },

  // ─── Algorithm State (FSRS-based) ───────────────────────
  algorithm: {
    type: String,
    enum: ['FSRS', 'SM-2'],
    default: 'FSRS',
  },

  // FSRS parameters
  stability:   { type: Number, default: 0 },     // Memory stability in days
  difficulty:  { type: Number, default: 5 },      // 1 (easiest) → 10 (hardest)
  dueDate:     { type: Date, default: Date.now }, // Next review date

  // Review history
  repetitions: { type: Number, default: 0 },      // Times successfully reviewed
  lapses:      { type: Number, default: 0 },      // Times forgotten / re-solved incorrectly
  lastInterval: { type: Number, default: 0 },     // Last interval in days

  // Last review result
  lastVerdict: {
    type: String,
    enum: ['Accepted', 'WrongAnswer', 'TimeLimitExceeded', 'RuntimeError', 'CompileError', 'Skipped'],
    default: null,
  },
  lastTimeTakenMs: { type: Number, default: 0 },
  lastReviewedAt:  { type: Date, default: null },

  // ─── Metadata ───────────────────────────────────────────
  isActive: { type: Boolean, default: true },     // Soft delete / archive
  sourceSubmissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },

}, { timestamps: true })

// Compound index: one revision card per user per problem
revisionCardSchema.index({ userId: 1, problemId: 1 }, { unique: true })
revisionCardSchema.index({ userId: 1, dueDate: 1 })     // "Today's Revisions" query
revisionCardSchema.index({ userId: 1, isActive: 1 })

export default mongoose.model('RevisionCard', revisionCardSchema)
