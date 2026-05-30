import { Router } from 'express'
import mongoose from 'mongoose'
import RevisionCard from '../models/RevisionCard.js'
import Problem from '../models/Problem.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'
import {
  calculateNextReview,
  getRetentionProbability,
  getInitialState,
} from '../services/spacedRepetition.js'

const router = Router()

// ─── GET /today — Today's due revisions ───────────────────
router.get('/today', requireAuth, async (req, res) => {
  try {
    const now = new Date()
    const cards = await RevisionCard.find({
      userId: req.user._id,
      isActive: true,
      dueDate: { $lte: now },
    })
      .populate('problemId', 'title slug difficulty track topic xpReward timeLimit')
      .sort({ dueDate: 1 })

    // Get the last submission for each card to pre-fill previous code
    const cardsWithCode = await Promise.all(
      cards.map(async (card) => {
        const lastSub = await Submission.findOne({
          userId: req.user._id,
          problemId: card.problemId._id,
        })
          .sort({ createdAt: -1 })
          .select('code language')

        return {
          _id: card._id,
          problem: card.problemId,
          stability: card.stability,
          difficulty: card.difficulty,
          dueDate: card.dueDate,
          repetitions: card.repetitions,
          lapses: card.lapses,
          lastVerdict: card.lastVerdict,
          lastTimeTakenMs: card.lastTimeTakenMs,
          lastReviewedAt: card.lastReviewedAt,
          previousCode: lastSub?.code || '',
          previousLanguage: lastSub?.language || 'python',
          retentionProbability: card.stability > 0
            ? getRetentionProbability(card.stability, daysBetween(card.lastReviewedAt || card.createdAt, now))
            : 0,
        }
      })
    )

    // Stats
    const totalDue = cards.length
    const totalCards = await RevisionCard.countDocuments({
      userId: req.user._id,
      isActive: true,
    })

    res.json({
      cards: cardsWithCode,
      stats: {
        totalDue,
        totalCards,
        weakCount: cardsWithCode.filter(c => c.retentionProbability < 0.5).length,
      },
    })
  } catch (err) {
    console.error('❌ /revisions/today error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET / — All revision cards (paginated, for history) ──
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [cards, total] = await Promise.all([
      RevisionCard.find({ userId: req.user._id, isActive: true })
        .populate('problemId', 'title slug difficulty topic')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dueDate: -1 }),
      RevisionCard.countDocuments({ userId: req.user._id, isActive: true }),
    ])

    res.json({
      cards,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /:id/result — Record a revision result ─────────
router.post('/:id/result', requireAuth, async (req, res) => {
  try {
    const { verdict, timeTakenMs } = req.body
    if (!verdict) {
      return res.status(400).json({ error: 'verdict required' })
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid revision card ID' })
    }

    const card = await RevisionCard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!card) {
      return res.status(404).json({ error: 'Revision card not found' })
    }

    const problem = await Problem.findById(card.problemId)
    const timeLimitMs = (problem?.timeLimit || 5) * 1000

    // Calculate next review schedule
    const nextState = calculateNextReview({
      verdict,
      timeTakenMs: timeTakenMs || 0,
      timeLimitMs,
      previousStability: card.stability,
      previousDifficulty: card.difficulty,
      previousRepetitions: card.repetitions,
      previousLapses: card.lapses,
    })

    // Update card
    card.stability = nextState.stability
    card.difficulty = nextState.difficulty
    card.dueDate = nextState.dueDate
    card.repetitions = nextState.repetitions
    card.lapses = nextState.lapses
    card.lastInterval = nextState.interval
    card.lastVerdict = verdict
    card.lastTimeTakenMs = timeTakenMs || 0
    card.lastReviewedAt = new Date()

    await card.save()

    res.json({
      card,
      nextReview: {
        dueDate: nextState.dueDate,
        interval: nextState.interval,
        stability: nextState.stability,
        difficulty: nextState.difficulty,
        grade: nextState.grade,
      },
    })
  } catch (err) {
    console.error('❌ /revisions/:id/result error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /insights — Forgetting curve + weak topics ──────
router.get('/insights', requireAuth, async (req, res) => {
  try {
    const cards = await RevisionCard.find({
      userId: req.user._id,
      isActive: true,
    })
      .populate('problemId', 'title slug topic difficulty')
      .lean()

    const now = new Date()
    let totalRetention = 0
    const topicRetention = {}
    const difficultyRetention = { Rookie: [], Warrior: [], Legend: [] }

    for (const card of cards) {
      const lastReview = card.lastReviewedAt || card.createdAt
      const daysSince = daysBetween(lastReview, now)
      const retention = card.stability > 0
        ? getRetentionProbability(card.stability, daysSince)
        : 0

      totalRetention += retention

      // By topic
      const topic = card.problemId?.topic || 'Unknown'
      if (!topicRetention[topic]) topicRetention[topic] = { count: 0, totalRetention: 0 }
      topicRetention[topic].count++
      topicRetention[topic].totalRetention += retention

      // By difficulty
      const diff = card.problemId?.difficulty || 'Rookie'
      if (difficultyRetention[diff]) {
        difficultyRetention[diff].push(retention)
      }
    }

    // Compute averages
    const avgRetention = cards.length > 0 ? totalRetention / cards.length : 0

    const topicInsights = Object.entries(topicRetention).map(([topic, data]) => ({
      topic,
      count: data.count,
      retention: Math.round((data.totalRetention / data.count) * 100),
      status: data.totalRetention / data.count < 0.5 ? 'weak' : data.totalRetention / data.count < 0.7 ? 'needs_review' : 'strong',
    }))

    const difficultyInsights = Object.entries(difficultyRetention).map(([diff, rets]) => ({
      difficulty: diff,
      count: rets.length,
      avgRetention: rets.length > 0 ? Math.round((rets.reduce((a, b) => a + b, 0) / rets.length) * 100) : 0,
    }))

    // Forgetting curve data points (last 30 days)
    const forgettingCurve = []
    for (let i = 30; i >= 0; i--) {
      const dayDate = new Date(now)
      dayDate.setDate(dayDate.getDate() - i)
      const dayRetentions = cards.map(c => {
        const lastReview = c.lastReviewedAt || c.createdAt
        const daysSince = daysBetween(lastReview, dayDate)
        return c.stability > 0 ? getRetentionProbability(c.stability, daysSince) : 0
      })
      const avg = dayRetentions.length > 0
        ? Math.round((dayRetentions.reduce((a, b) => a + b, 0) / dayRetentions.length) * 100)
        : 0
      forgettingCurve.push({
        date: dayDate.toISOString().slice(0, 10),
        retention: avg,
      })
    }

    res.json({
      totalCards: cards.length,
      averageRetention: Math.round(avgRetention * 100),
      topicInsights: topicInsights.sort((a, b) => a.retention - b.retention), // Weakest first
      difficultyInsights,
      forgettingCurve,
      weakTopics: topicInsights.filter(t => t.status === 'weak').map(t => t.topic),
    })
  } catch (err) {
    console.error('❌ /revisions/insights error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /:id — Remove a revision card ────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid revision card ID' })
    }

    const card = await RevisionCard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    )

    if (!card) {
      return res.status(404).json({ error: 'Revision card not found' })
    }

    res.json({ message: 'Revision card removed', card })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Helper ──────────────────────────────────────────────
function daysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.max(0, (d2 - d1) / (1000 * 60 * 60 * 24))
}

export default router
