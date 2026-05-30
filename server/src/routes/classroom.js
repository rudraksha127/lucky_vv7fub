import { Router } from 'express'
import mongoose from 'mongoose'
import Classroom from '../models/Classroom.js'
import User from '../models/User.js'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

// ─── GET / — API info ─────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    name: 'Classrooms API',
    description: 'Professor-student classroom management',
    endpoints: {
      'POST /': 'Create classroom (professor only)',
      'POST /join': 'Join classroom with code',
      'GET /mine': 'Get my classroom (for students)',
      'GET /my-classrooms': 'Get my classrooms (for professors)',
      'GET /:id/analytics': 'Get classroom analytics (professor only)',
      'POST /:id/announce': 'Send announcement (professor only)',
      'POST /:id/assign': 'Assign problem (professor only)',
    },
  })
})

// Create classroom (professor only)
router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'professor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only professors can create classrooms' })
    }

    const { name, college, semester, subject } = req.body
    if (!name) return res.status(400).json({ error: 'Classroom name is required' })

    const code = await Classroom.generateCode()
    const classroom = await Classroom.create({
      name,
      code,
      professor: req.user._id,
      college: college || '',
      semester: semester || '',
      subject: subject || '',
    })

    res.status(201).json(classroom)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Join classroom with code
router.post('/join', requireAuth, async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ error: 'Classroom code required' })

    const classroom = await Classroom.findOne({ code: String(code).toUpperCase(), isActive: true })
    if (!classroom) return res.status(404).json({ error: 'Classroom not found' })

    if (classroom.students.some(s => s.toString() === req.user._id.toString())) {
      return res.json({ message: 'Already joined', classroom })
    }

    classroom.students.push(req.user._id)
    await classroom.save()

    // Link user to classroom
    await User.findByIdAndUpdate(req.user._id, { classroomId: classroom._id })

    res.json({ message: 'Joined classroom', classroom })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get my classroom (for students)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    let classroom = null
    if (req.user.classroomId) {
      classroom = await Classroom.findById(req.user.classroomId)
        .populate('professor', 'username email avatar')
        .populate('assignments.problemId', 'title slug difficulty xpReward')
    }
    res.json(classroom)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get my classrooms (for professors)
router.get('/my-classrooms', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'professor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }
    const classrooms = await Classroom.find({ professor: req.user._id })
      .populate('students', 'username email avatar xp level rank streak')
      .populate('assignments.problemId', 'title slug difficulty xpReward')
      .sort({ createdAt: -1 })

    res.json(classrooms)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get classroom analytics (professor only)
router.get('/:id/analytics', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const classroom = await Classroom.findById(safeId)
      .populate('students', 'username email avatar xp level rank streak solvedProblems attemptedProblems createdAt lastActive')
      .populate('professor', 'username email')

    if (!classroom) return res.status(404).json({ error: 'Classroom not found' })
    if (classroom.professor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Compute aggregate stats
    const students = classroom.students
    const totalStudents = students.length
    const avgLevel = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.level || 1), 0) / totalStudents)
      : 0
    const avgSolved = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.solvedProblems?.length || 0), 0) / totalStudents)
      : 0
    const avgXP = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.xp || 0), 0) / totalStudents)
      : 0

    // Topic-wise weakness analysis
    const topicWeakness = {}
    students.forEach(s => {
      // Track student level and solved counts
      if (!topicWeakness['overall']) {
        topicWeakness['overall'] = { studentsWithData: 0, avgLevel: 0, avgSolved: 0 }
      }
      topicWeakness['overall'].studentsWithData++
      topicWeakness['overall'].avgLevel += s.level || 1
      topicWeakness['overall'].avgSolved += s.solvedProblems?.length || 0
    })

    if (topicWeakness['overall']) {
      topicWeakness['overall'].avgLevel = Math.round(topicWeakness['overall'].avgLevel / topicWeakness['overall'].studentsWithData)
      topicWeakness['overall'].avgSolved = Math.round(topicWeakness['overall'].avgSolved / topicWeakness['overall'].studentsWithData)
    }

    res.json({
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        code: classroom.code,
        college: classroom.college,
        semester: classroom.semester,
        subject: classroom.subject,
      },
      analytics: {
        totalStudents,
        avgLevel,
        avgSolved,
        avgXP,
        topicWeakness,
      },
      students: students.map(s => ({
        _id: s._id,
        username: s.username,
        email: s.email,
        avatar: s.avatar,
        xp: s.xp || 0,
        level: s.level || 1,
        rank: s.rank || 'Rookie',
        streak: s.streak?.current || 0,
        solvedCount: s.solvedProblems?.length || 0,
        lastActive: s.lastActive || s.createdAt,
      })),
      announcements: classroom.announcements,
      assignments: classroom.assignments,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send announcement (professor only)
router.post('/:id/announce', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const classroom = await Classroom.findById(safeId)
    if (!classroom) return res.status(404).json({ error: 'Classroom not found' })
    if (classroom.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'Announcement text required' })

    classroom.announcements.push({ text: String(text), createdAt: new Date() })
    await classroom.save()

    res.json(classroom)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Assign problem (professor only)
router.post('/:id/assign', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const classroom = await Classroom.findById(safeId)
    if (!classroom) return res.status(404).json({ error: 'Classroom not found' })
    if (classroom.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { problemId, dueDate } = req.body
    if (!problemId) return res.status(400).json({ error: 'problemId required' })
    if (!mongoose.isValidObjectId(problemId)) return res.status(400).json({ error: 'Invalid problemId' })

    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    classroom.assignments.push({
      problemId: problem._id,
      title: problem.title,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    await classroom.save()

    res.json(classroom)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
