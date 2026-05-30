import { Router } from 'express'
import Quest from '../models/Quest.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get today's quest status
router.get('/today', requireAuth, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let quest = await Quest.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    })

    if (!quest) {
      quest = await Quest.create({
        userId: req.user._id,
        date: today,
        quests: { solveOne: false, submitThree: false, tryRealWorld: false },
      })
    }

    // Auto-compute quest progress from today's submissions
    const submissions = await Submission.find({
      userId: req.user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    })

    const accepted = submissions.filter(s => s.status === 'Accepted')
    const realWorldAttempts = submissions.filter(s => s.problemId && s.problemId.track === 'RealWorld')

    // Solve 1 problem
    if (!quest.quests.solveOne && accepted.length >= 1) {
      quest.quests.solveOne = true
    }

    // Submit 3 solutions
    if (!quest.quests.submitThree && submissions.length >= 3) {
      quest.quests.submitThree = true
    }

    // Try a Real World problem
    if (!quest.quests.tryRealWorld && realWorldAttempts.length >= 1) {
      quest.quests.tryRealWorld = true
    }

    // Check bonus (all 3 completed)
    const allCompleted = quest.quests.solveOne && quest.quests.submitThree && quest.quests.tryRealWorld
    if (allCompleted && !quest.bonusClaimed) {
      quest.bonusClaimed = true
    }

    await quest.save()

    res.json({
      quests: quest.quests,
      bonusClaimed: quest.bonusClaimed,
      progress: {
        accepted: accepted.length,
        totalSubmissions: submissions.length,
        realWorldAttempts: realWorldAttempts.length,
      },
      rewards: {
        quest1: 50,
        quest2: 75,
        quest3: 100,
        bonus: 200,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Manually trigger quest check
router.post('/check', requireAuth, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const submissions = await Submission.find({
      userId: req.user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    }).populate('problemId', 'track')

    const accepted = submissions.filter(s => s.status === 'Accepted')
    const realWorldAttempts = submissions.filter(s => s.problemId?.track === 'RealWorld')

    let quest = await Quest.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    })

    if (!quest) {
      quest = await Quest.create({
        userId: req.user._id,
        date: today,
        quests: { solveOne: false, submitThree: false, tryRealWorld: false },
      })
    }

    quest.quests.solveOne = accepted.length >= 1
    quest.quests.submitThree = submissions.length >= 3
    quest.quests.tryRealWorld = realWorldAttempts.length >= 1

    const allCompleted = quest.quests.solveOne && quest.quests.submitThree && quest.quests.tryRealWorld
    if (allCompleted) quest.bonusClaimed = true

    await quest.save()

    res.json({
      quests: quest.quests,
      bonusClaimed: quest.bonusClaimed,
      progress: {
        accepted: accepted.length,
        totalSubmissions: submissions.length,
        realWorldAttempts: realWorldAttempts.length,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
