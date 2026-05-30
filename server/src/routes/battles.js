import { Router } from 'express'
import mongoose from 'mongoose'
import Battle from '../models/Battle.js'
import Problem from '../models/Problem.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'
import { submitCode } from '../services/judge0.js'
import { awardXP, updateStreak } from '../services/xp.js'
import { io } from '../index.js'

const VALID_LANGUAGES = ['cpp', 'java', 'python', 'javascript']

const router = Router()

// ─── GET / — API info ─────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    name: 'Battles API',
    description: 'Real-time 1v1 battle mode endpoints',
    endpoints: {
      'POST /create': 'Create a battle room',
      'POST /join/:code': 'Join a battle room by code',
      'GET /:code': 'Get battle state by room code',
      'POST /:code/surrender': 'Surrender in a live battle',
      'POST /:code/submit': 'Submit solution in battle',
    },
  })
})

// Create a battle room
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { difficulty } = req.body
    const validDifficulties = ['Rookie', 'Warrior', 'Legend']
    const safeDifficulty = validDifficulties.find(d => d === difficulty) || 'Rookie'

    // Pick a random problem at the requested difficulty
    const problems = await Problem.find({ difficulty: safeDifficulty, isActive: true }).select('_id title slug difficulty')
    if (problems.length === 0) {
      return res.status(400).json({ error: 'No problems available for this difficulty' })
    }
    const problem = problems[Math.floor(Math.random() * problems.length)]

    const roomCode = await Battle.generateRoomCode()
    const battle = await Battle.create({
      roomCode,
      problemId: problem._id,
      createdBy: req.user._id,
      players: [{
        userId: req.user._id,
        username: req.user.username,
        status: 'waiting',
      }],
      status: 'waiting',
    })

    res.status(201).json({
      roomCode: battle.roomCode,
      battleId: battle._id,
      problem: { title: problem.title, slug: problem.slug, difficulty: problem.difficulty },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Join a battle room
router.post('/join/:code', requireAuth, async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase()
    const battle = await Battle.findOne({ roomCode: code }).populate('problemId', 'title slug difficulty description examples constraints starterCode supportedLanguages')
    if (!battle) return res.status(404).json({ error: 'Room not found' })
    if (battle.status !== 'waiting') return res.status(400).json({ error: 'Battle already started or ended' })
    if (battle.players.length >= 2) return res.status(400).json({ error: 'Room is full' })
    if (battle.players.some(p => p.userId.toString() === req.user._id.toString())) {
      return res.json({ battle })
    }

    battle.players.push({
      userId: req.user._id,
      username: req.user.username,
      status: 'solving',
    })

    battle.status = 'countdown'
    await battle.save()

    // Populate again after save
    await battle.populate('problemId', 'title slug difficulty description examples constraints starterCode supportedLanguages')

    // Emit countdown start
    io.to(`battle-${battle._id}`).emit('battle-countdown', {
      players: battle.players.map(p => ({ userId: p.userId, username: p.username })),
      seconds: 5,
    })

    // Start battle after countdown
    setTimeout(async () => {
      battle.status = 'live'
      battle.startTime = new Date()
      await battle.save()
      io.to(`battle-${battle._id}`).emit('battle-start', {
        startTime: battle.startTime,
      })
    }, 5000)

    res.json({ battle })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get battle state
router.get('/:code', async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase()
    const battle = await Battle.findOne({ roomCode: code })
      .populate('problemId', 'title slug difficulty description examples constraints starterCode supportedLanguages')
      .populate('players.userId', 'username avatar level rank')

    if (!battle) return res.status(404).json({ error: 'Battle not found' })
    res.json(battle)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Surrender / give up
router.post('/:code/surrender', requireAuth, async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase()
    const battle = await Battle.findOne({ roomCode: code })
    if (!battle) return res.status(404).json({ error: 'Battle not found' })
    if (battle.status !== 'live') return res.status(400).json({ error: 'Battle is not live' })

    const playerEntry = battle.players.find(
      p => p.userId.toString() === req.user._id.toString()
    )
    if (!playerEntry) return res.status(400).json({ error: 'You are not in this battle' })

    playerEntry.status = 'gave_up'

    // Opponent wins
    const opponent = battle.players.find(
      p => p.userId.toString() !== req.user._id.toString()
    )
    if (opponent) {
      battle.winnerId = opponent.userId
      opponent.status = 'solved'
      await awardXP(opponent.userId, 200)
    }

    battle.status = 'ended'
    battle.endTime = new Date()
    await battle.save()

    await awardXP(req.user._id, 25)

    const winnerName = opponent?.username || 'Opponent'
    io.to(`battle-${battle._id}`).emit('battle-ended', {
      winnerId: opponent?.userId,
      winnerName,
      solveTime: null,
      reason: 'surrender',
    })

    res.json({ message: 'You surrendered', winner: winnerName })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Submit solution in battle
router.post('/:code/submit', requireAuth, async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase()
    const { problemId, source_code, language } = req.body

    if (!problemId || !source_code || !language) {
      return res.status(400).json({ error: 'problemId, source_code, language required' })
    }
    const safeLanguage = VALID_LANGUAGES.find(l => l === language)
    if (!safeLanguage) return res.status(400).json({ error: 'Invalid language' })

    const battle = await Battle.findOne({ roomCode: code })
    if (!battle) return res.status(404).json({ error: 'Battle not found' })
    if (battle.status !== 'live') return res.status(400).json({ error: 'Battle is not live' })

    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    // Run against visible tests
    const visibleTests = problem.testCases.filter(tc => !tc.isHidden)
    const results = await submitCode(source_code, safeLanguage, visibleTests)
    const allPassed = results.every(r => r.passed)

    // Record attempt
    const playerEntry = battle.players.find(
      p => p.userId.toString() === req.user._id.toString()
    )
    if (playerEntry) {
      playerEntry.attempts += 1
    }

    if (allPassed) {
      const solveTime = Math.floor((Date.now() - new Date(battle.startTime).getTime()) / 1000)

      if (playerEntry) {
        playerEntry.status = 'solved'
        playerEntry.solveTime = solveTime
      }

      // Determine winner
      battle.winnerId = req.user._id
      battle.status = 'ended'
      battle.endTime = new Date()
      await battle.save()

      // Award XP
      await awardXP(req.user._id, 200)
      // Award participation XP to opponent
      const opponent = battle.players.find(
        p => p.userId.toString() !== req.user._id.toString()
      )
      if (opponent) {
        await awardXP(opponent.userId, 50)
      }

      // Update streak for both
      await updateStreak(req.user._id)
      if (opponent) await updateStreak(opponent.userId)

      // Emit battle ended
      io.to(`battle-${battle._id}`).emit('battle-ended', {
        winnerId: req.user._id,
        winnerName: req.user.username,
        solveTime,
      })
    } else {
      await battle.save()
      // Emit player update
      io.to(`battle-${battle._id}`).emit('player-update', {
        players: battle.players.map(p => ({
          userId: p.userId,
          username: p.username,
          status: p.status,
          attempts: p.attempts,
        })),
      })
    }

    res.json({
      passed: allPassed,
      results,
      solveTime: allPassed ? Math.floor((Date.now() - new Date(battle.startTime).getTime()) / 1000) : null,
      winner: allPassed ? req.user.username : null,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
