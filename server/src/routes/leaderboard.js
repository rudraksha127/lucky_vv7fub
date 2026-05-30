import { Router } from 'express'
import User from '../models/User.js'

const VALID_PERIODS = ['weekly', 'monthly', 'alltime']

const router = Router()

/**
 * GET /api/leaderboard?period=weekly&limit=20
 *
 * Returns top users sorted by XP descending.
 *
 * Period filters:
 *   - weekly   → users active in last 7 days (streak.lastActive)
 *   - monthly  → users active in last 30 days
 *   - alltime  → all users (default)
 */
router.get('/', async (req, res) => {
  try {
    const period = VALID_PERIODS.find((p) => p === (req.query.period || 'alltime')) || 'alltime'
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100)

    // Build date filter for activity-based periods
    let dateFilter = {}
    if (period !== 'alltime') {
      const days = period === 'weekly' ? 7 : 30
      const since = new Date()
      since.setDate(since.getDate() - days)
      dateFilter = { 'streak.lastActive': { $gte: since } }
    }

    const users = await User.find(dateFilter)
      .select('username avatar xp level rank streak.current streak.longest solvedProblems')
      .sort({ xp: -1 })
      .limit(limit)
      .lean()

    // Build ranked response
    const leaderboard = users.map((u, idx) => ({
      rank: idx + 1,
      userId: u._id,
      username: u.username,
      avatar: u.avatar || '',
      xp: u.xp,
      level: u.level,
      rankTitle: u.rank,
      currentStreak: u.streak?.current || 0,
      longestStreak: u.streak?.longest || 0,
      solvedCount: u.solvedProblems?.length || 0,
    }))

    // Compute stats about the requesting user (passed as query param)
    let currentUser = null
    const requesterId = req.query.currentUserId
    if (requesterId) {
      try {
        const cu = await User.findById(requesterId).select('username xp')
        if (cu) {
          const rank = leaderboard.findIndex((e) => e.username === cu.username) + 1
          currentUser = {
            username: cu.username,
            xp: cu.xp,
            rank: rank > 0 ? rank : leaderboard.length + 1,
          }
        }
      } catch {
        // Ignore errors for current user lookup
      }
    }

    res.json({
      period,
      leaderboard,
      totalPlayers: await User.countDocuments(dateFilter),
      currentUser,
    })
  } catch (err) {
    console.error('❌ /leaderboard error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
