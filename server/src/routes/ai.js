import { Router } from 'express'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import {
  algoguruChat,
  getHint,
  getReview,
  recordFeedback,
  getFeedbackStats,
} from '../services/algoguru.js'

const router = Router()

// ─── GET / — API info ─────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    name: 'AlgoGuru AI API',
    description: 'AI-powered tutoring, hints, and code review',
    endpoints: {
      'POST /algoguru/chat': 'Full HITL RAG chat with AlgoGuru',
      'POST /algoguru/hint': 'Tiered hints (1-3)',
      'POST /algoguru/review': 'Enhanced code review',
      'POST /hint': 'Legacy hint endpoint',
      'POST /review': 'Legacy review endpoint',
      'POST /feedback': 'Submit human feedback (HITL)',
      'GET /feedback/stats': 'Get feedback analytics',
    },
    status: process.env.GROQ_API_KEY ? 'ready' : 'offline',
    message: process.env.GROQ_API_KEY ? 'AlgoGuru is online and ready' : 'Set GROQ_API_KEY in .env to enable AlgoGuru',
  })
})

// ─── POST /api/ai/algoguru/chat — Full HITL RAG Chat ────
router.post('/algoguru/chat', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language, message, hintLevel, history } = req.body
    if (!message) {
      return res.status(400).json({ error: 'message is required' })
    }

    // Get problem if problemId provided
    let problem = null
    if (problemId && mongoose.isValidObjectId(problemId)) {
      problem = await Problem.findById(problemId).select(
        'title description difficulty topic constraints hints'
      )
    }

    const result = await algoguruChat({
      problem,
      studentCode: code && language ? { content: code, language } : undefined,
      message,
      hintLevel: hintLevel ?? 2,
      conversationHistory: history || [],
    })

    res.json(result)
  } catch (err) {
    console.error('❌ /algoguru/chat error:', err)
    res.status(500).json({
      answer: 'AlgoGuru encountered an error. Please try again.',
      confidence: 0,
      humanAction: 'ESCALATE',
      humanActionReason: err.message,
      error: err.message,
    })
  }
})

// ─── POST /api/ai/algoguru/hint — Tiered Hints ───────────
router.post('/algoguru/hint', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language, message, hintLevel } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problemId' })
    }

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId).select(
      'title description difficulty topic constraints hints'
    )
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const level = Math.min(Math.max(hintLevel ?? 2, 1), 3) // Clamp 1-3

    const result = await algoguruChat({
      problem,
      studentCode: { content: code, language },
      message: message || `Give me a level ${level} hint for this problem.`,
      hintLevel: level,
    })

    res.json(result)
  } catch (err) {
    console.error('❌ /algoguru/hint error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/algoguru/review — Enhanced Code Review ─
router.post('/algoguru/review', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problemId' })
    }

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId).select(
      'title description difficulty topic constraints'
    )
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const reviewText = await getReview(problem, { content: code, language })

    res.json({
      review: reviewText,
      problem: problem.title,
      language,
    })
  } catch (err) {
    console.error('❌ /algoguru/review error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/hint — Legacy hint (uses AlgoGuru backend) ──
router.post('/hint', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language, message } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problemId' })
    }

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId).select(
      'title description difficulty topic constraints hints'
    )
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const hint = await getHint(problem, { content: code, language }, message)
    res.json({ hint })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/review — Legacy review ─────────────────
router.post('/review', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problemId' })
    }

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId).select(
      'title description difficulty topic constraints'
    )
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const reviewText = await getReview(problem, { content: code, language })
    res.json({ review: reviewText })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/feedback — Human Feedback (HITL) ──────
router.post('/feedback', requireAuth, async (req, res) => {
  try {
    const { query, answer, rating, correction } = req.body
    if (!query || !answer || !rating) {
      return res.status(400).json({ error: 'query, answer, rating required' })
    }
    if (!['helpful', 'unhelpful', 'needs_correction'].includes(rating)) {
      return res.status(400).json({ error: 'rating must be helpful, unhelpful, or needs_correction' })
    }

    const feedback = recordFeedback({
      userId: req.user._id?.toString() || req.user.clerkId || 'anonymous',
      query,
      answer,
      rating,
      correction,
      originalConfidence: req.body.confidence,
    })

    res.json({ success: true, feedbackId: feedback.timestamp })
  } catch (err) {
    console.error('❌ /feedback error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/ai/feedback/stats — Feedback Analytics ─────
router.get('/feedback/stats', requireAuth, async (req, res) => {
  try {
    const stats = getFeedbackStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
