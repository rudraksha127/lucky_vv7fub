import { Router } from 'express'
import mongoose from 'mongoose'
import CommunityProblem from '../models/CommunityProblem.js'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'
import { awardXP } from '../services/xp.js'

const router = Router()

const VALID_TRACKS = ['DSA', 'RealWorld']
const VALID_DIFFICULTIES = ['Rookie', 'Warrior', 'Legend']

// Escape regex characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80) || 'untitled'
}

// ─── GET /stats — Community stats ──────────────────────────
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [
      totalProblems,
      pendingCount,
      approvedCount,
      contributorCount,
      totalXpAwarded,
    ] = await Promise.all([
      CommunityProblem.countDocuments(),
      CommunityProblem.countDocuments({ status: 'pending' }),
      CommunityProblem.countDocuments({ status: 'approved' }),
      CommunityProblem.distinct('submittedBy').then(u => u.length),
      CommunityProblem.aggregate([
        { $match: { communityBadgeAwarded: true } },
        { $group: { _id: null, total: { $sum: '$xpReward' } } },
      ]).then(r => r[0]?.total || 0),
    ])

    res.json({
      totalProblems,
      pendingCount,
      approvedCount,
      rejectedCount: totalProblems - pendingCount - approvedCount,
      contributorCount,
      totalXpAwarded,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /activity — Community activity feed ───────────────
router.get('/activity', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 30, 1), 100)

    const recentProblems = await CommunityProblem.find({})
      .populate('submittedBy', 'username avatar')
      .populate('moderatedBy', 'username')
      .select('title status createdAt moderatedAt xpReward submittedBy moderatedBy communityBadgeAwarded slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Build activity events
    const activities = []
    for (const p of recentProblems) {
      // Submission event
      activities.push({
        type: 'submitted',
        id: `${p._id}-submitted`,
        problemId: p._id,
        problemTitle: p.title,
        problemSlug: p.slug,
        user: p.submittedBy || { username: 'Anonymous', avatar: '' },
        timestamp: p.createdAt,
        detail: p.status === 'pending' ? 'Submitted for review' : 'Submitted',
      })

      // Moderation events (approved/rejected)
      if (p.status === 'approved' && p.moderatedAt) {
        activities.push({
          type: 'approved',
          id: `${p._id}-approved`,
          problemId: p._id,
          problemTitle: p.title,
          problemSlug: p.slug,
          user: p.moderatedBy || { username: 'Moderator', avatar: '' },
          recipient: p.submittedBy || { username: 'Anonymous', avatar: '' },
          timestamp: p.moderatedAt,
          xpAwarded: p.communityBadgeAwarded ? p.xpReward : 0,
          detail: p.communityBadgeAwarded
            ? `Approved & published · +${p.xpReward} XP awarded`
            : 'Approved & published',
        })
      } else if (p.status === 'rejected' && p.moderatedAt) {
        activities.push({
          type: 'rejected',
          id: `${p._id}-rejected`,
          problemId: p._id,
          problemTitle: p.title,
          problemSlug: p.slug,
          user: p.moderatedBy || { username: 'Moderator', avatar: '' },
          recipient: p.submittedBy || { username: 'Anonymous', avatar: '' },
          timestamp: p.moderatedAt,
          detail: 'Not approved',
        })
      }
    }

    // Sort by timestamp descending and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({ activities: activities.slice(0, limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /contributors — Top community contributors ────────
router.get('/contributors', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50)

    const contributors = await CommunityProblem.aggregate([
      { $group: {
        _id: '$submittedBy',
        totalSubmitted: { $sum: 1 },
        totalApproved: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        totalRejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
        },
        totalXpEarned: {
          $sum: { $cond: [{ $eq: ['$communityBadgeAwarded', true] }, '$xpReward', 0] },
        },
        lastActivity: { $max: '$createdAt' },
      }},
      { $sort: { totalApproved: -1, totalXpEarned: -1 } },
      { $limit: limit },
    ])

    // Populate user info
    const userIds = contributors.map(c => c._id).filter(Boolean)
    const users = await mongoose.model('User').find({
      _id: { $in: userIds },
    }).select('username avatar xp level rank').lean()

    const userMap = {}
    for (const u of users) {
      userMap[u._id.toString()] = u
    }

    const result = contributors.map((c, idx) => {
      const user = userMap[c._id?.toString()] || {}
      return {
        rank: idx + 1,
        userId: c._id,
        username: user.username || 'Unknown',
        avatar: user.avatar || '',
        level: user.level || 1,
        rankTitle: user.rank || 'Rookie',
        totalXp: user.xp || 0,
        totalSubmitted: c.totalSubmitted,
        totalApproved: c.totalApproved,
        totalPending: c.totalPending,
        totalRejected: c.totalRejected,
        totalXpEarned: c.totalXpEarned,
        lastActivity: c.lastActivity,
        approvalRate: c.totalSubmitted > 0
          ? Math.round((c.totalApproved / c.totalSubmitted) * 100)
          : 0,
      }
    })

    res.json({ contributors: result, totalContributors: result.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /submit — Submit a community problem ─────────────
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const {
      title, description, track, topic, difficulty,
      constraints, examples, testCases, hints, editorialLink,
      starterCode, xpReward,
    } = req.body

    if (!title || !description || !track || !topic || !difficulty) {
      return res.status(400).json({ error: 'title, description, track, topic, difficulty are required' })
    }
    if (!VALID_TRACKS.includes(track)) {
      return res.status(400).json({ error: 'Invalid track' })
    }
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' })
    }

    // Generate unique slug
    let baseSlug = slugify(title)
    let slug = baseSlug
    let attempts = 0
    while (await CommunityProblem.findOne({ slug }) || await Problem.findOne({ slug })) {
      attempts++
      slug = `${baseSlug}-${attempts}`
      if (attempts > 20) slug = `${baseSlug}-${Date.now()}`
    }

    const communityProblem = await CommunityProblem.create({
      submittedBy: req.user._id,
      title,
      slug,
      description,
      track,
      topic,
      difficulty,
      constraints: constraints || '',
      examples: examples || [],
      testCases: testCases || [],
      hints: hints || [],
      editorialLink: editorialLink || '',
      starterCode: starterCode || {},
      xpReward: Math.min(xpReward || 50, 200), // Cap at 200
      status: 'pending',
    })

    res.status(201).json({
      message: 'Problem submitted for review! A professor will review it shortly.',
      problem: communityProblem,
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ─── GET / — List community problems ──────────────────────
// For everyone: shows approved problems
// For professors/admins: can filter by status
router.get('/', requireAuth, async (req, res) => {
  try {
    const { track, topic, difficulty, search, status, page = '1', limit = '20' } = req.query
    const filter = {}

    // Professors/admins can see pending/rejected — others only see approved
    const isModerator = req.user.role === 'professor' || req.user.role === 'admin'
    if (status && isModerator) {
      filter.status = status
    } else {
      filter.status = 'approved'
    }

    if (track) filter.track = track
    if (topic) filter.topic = topic
    if (difficulty) filter.difficulty = difficulty
    if (search && typeof search === 'string' && search.length <= 100) {
      filter.title = { $regex: escapeRegex(search), $options: 'i' }
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum

    const [problems, total] = await Promise.all([
      CommunityProblem.find(filter)
        .populate('submittedBy', 'username avatar')
        .populate('moderatedBy', 'username')
        .select('-testCases')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      CommunityProblem.countDocuments(filter),
    ])

    res.json({
      problems,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      isModerator,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /my — My submissions ─────────────────────────────
router.get('/my', requireAuth, async (req, res) => {
  try {
    const problems = await CommunityProblem.find({ submittedBy: req.user._id })
      .select('-testCases')
      .sort({ createdAt: -1 })

    res.json({ problems })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /pending — Pending problems for moderation ──────
router.get('/pending', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'professor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Professor or admin access required' })
    }

    const problems = await CommunityProblem.find({ status: 'pending' })
      .populate('submittedBy', 'username avatar email')
      .select('-testCases')
      .sort({ createdAt: 1 }) // Oldest first

    res.json({ problems, count: problems.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /:id — Get single community problem ─────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' })
    }
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const problem = await CommunityProblem.findById(safeId)
      .populate('submittedBy', 'username avatar email')
      .populate('moderatedBy', 'username')

    if (!problem) return res.status(404).json({ error: 'Community problem not found' })

    // Only show test cases to moderators or the submitter
    const isModerator = req.user.role === 'professor' || req.user.role === 'admin'
    const isOwner = problem.submittedBy._id.toString() === req.user._id.toString()

    res.json({
      ...problem.toObject(),
      testCases: (isModerator || isOwner) ? problem.testCases : undefined,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /:id/approve — Approve a community problem ──────
router.put('/:id/approve', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'professor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Professor or admin access required' })
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' })
    }
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const communityProblem = await CommunityProblem.findById(safeId)
    if (!communityProblem) {
      return res.status(404).json({ error: 'Community problem not found' })
    }
    if (communityProblem.status !== 'pending') {
      return res.status(400).json({ error: `Problem already ${communityProblem.status}` })
    }

    // Create the actual Problem from community submission
    const problem = await Problem.create({
      title: communityProblem.title,
      slug: communityProblem.slug,
      description: communityProblem.description,
      track: communityProblem.track,
      topic: communityProblem.topic,
      difficulty: communityProblem.difficulty,
      xpReward: communityProblem.xpReward,
      constraints: communityProblem.constraints,
      examples: communityProblem.examples,
      testCases: communityProblem.testCases,
      hints: communityProblem.hints,
      editorialLink: communityProblem.editorialLink,
      starterCode: communityProblem.starterCode,
      source: 'community',
      sourceId: communityProblem._id.toString(),
      isActive: true,
    })

    // Mark as approved
    communityProblem.status = 'approved'
    communityProblem.moderatedBy = req.user._id
    communityProblem.moderatorNotes = req.body.notes || ''
    communityProblem.moderatedAt = new Date()
    communityProblem.approvedProblemId = problem._id
    await communityProblem.save()

    // Award XP to the submitter for contribution
    if (!communityProblem.communityBadgeAwarded) {
      await awardXP(communityProblem.submittedBy, communityProblem.xpReward)
      communityProblem.communityBadgeAwarded = true
      await communityProblem.save()
    }

    res.json({
      message: 'Problem approved and published!',
      problem,
      communityProblem,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /:id/reject — Reject a community problem ────────
router.put('/:id/reject', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'professor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Professor or admin access required' })
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' })
    }
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const communityProblem = await CommunityProblem.findById(safeId)
    if (!communityProblem) {
      return res.status(404).json({ error: 'Community problem not found' })
    }
    if (communityProblem.status !== 'pending') {
      return res.status(400).json({ error: `Problem already ${communityProblem.status}` })
    }

    communityProblem.status = 'rejected'
    communityProblem.moderatedBy = req.user._id
    communityProblem.moderatorNotes = req.body.notes || 'No feedback provided.'
    communityProblem.moderatedAt = new Date()
    await communityProblem.save()

    res.json({
      message: 'Problem rejected. The submitter has been notified.',
      communityProblem,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
