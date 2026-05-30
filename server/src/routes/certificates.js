import { Router } from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import Certificate from '../models/Certificate.js'
import Problem from '../models/Problem.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'
import { generateCertificate, getCertificatePath } from '../services/certificateGenerator.js'

const router = Router()

const VALID_TRACKS = ['DSA', 'RealWorld']

// ─── GET / — List user's certificates ──────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ completedAt: -1 })

    res.json({ certificates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /check/:track — Check eligibility for a track ────
router.get('/check/:track', requireAuth, async (req, res) => {
  try {
    const track = req.params.track
    if (!VALID_TRACKS.includes(track)) {
      return res.status(400).json({ error: 'Invalid track. Must be DSA or RealWorld' })
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ userId: req.user._id, track })
    if (existing) {
      return res.json({
        eligible: true,
        alreadyGenerated: true,
        certificate: existing,
      })
    }

    // Count total problems in this track
    const totalProblems = await Problem.countDocuments({ track, isActive: true })

    // Count solved problems by user in this track
    const solvedSubmissions = await Submission.distinct('problemId', {
      userId: req.user._id,
      status: 'Accepted',
    })
    const solvedProblems = await Problem.countDocuments({
      _id: { $in: solvedSubmissions },
      track,
      isActive: true,
    })

    // User is eligible if they solved at least 80% of problems OR
    // DSA: at least 5 problems solved, RealWorld: at least 2 problems solved
    const pctComplete = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0
    let eligible = false

    if (track === 'DSA') {
      eligible = solvedProblems >= 5 || pctComplete >= 80
    } else {
      eligible = solvedProblems >= 2 || pctComplete >= 80
    }

    // Also check if user has solved enough problems in general
    const totalSolved = await Submission.distinct('problemId', {
      userId: req.user._id,
      status: 'Accepted',
    })

    res.json({
      eligible,
      alreadyGenerated: false,
      track,
      solvedProblems,
      totalProblems,
      pctComplete,
      totalUniqueSolved: totalSolved.length,
      requirement: track === 'DSA'
        ? 'Solve at least 5 DSA problems (or complete 80% of track)'
        : 'Solve at least 2 Real World problems (or complete 80% of track)',
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /generate/:track — Generate certificate for a track ──
router.post('/generate/:track', requireAuth, async (req, res) => {
  try {
    const track = req.params.track
    if (!VALID_TRACKS.includes(track)) {
      return res.status(400).json({ error: 'Invalid track. Must be DSA or RealWorld' })
    }

    // Check for existing
    const existing = await Certificate.findOne({ userId: req.user._id, track })
    if (existing) {
      return res.status(400).json({
        error: 'Certificate already exists for this track',
        certificate: existing,
      })
    }

    // Check eligibility
    const totalProblems = await Problem.countDocuments({ track, isActive: true })
    const solvedSubmissions = await Submission.distinct('problemId', {
      userId: req.user._id,
      status: 'Accepted',
    })
    const solvedProblems = await Problem.countDocuments({
      _id: { $in: solvedSubmissions },
      track,
      isActive: true,
    })

    let eligible = false
    if (track === 'DSA') {
      eligible = solvedProblems >= 5
    } else {
      eligible = solvedProblems >= 2
    }

    if (!eligible) {
      return res.status(400).json({
        error: `Not yet eligible. You need ${track === 'DSA' ? '5' : '2'} solved problems in the ${track} track. You have ${solvedProblems}.`,
        solvedProblems,
        needed: track === 'DSA' ? 5 : 2,
      })
    }

    // Get total XP earned
    const xpData = await Submission.aggregate([
      { $match: { userId: req.user._id, status: 'Accepted' } },
      { $group: { _id: null, totalXp: { $sum: '$xpEarned' } } },
    ])
    const totalXpEarned = xpData[0]?.totalXp || 0

    // Get streak info
    const streakCurrent = req.user.streak?.current || 0

    // Count total unique submissions
    const totalUniqueSolved = solvedSubmissions.length

    // Generate certificate number
    const certificateNumber = await Certificate.generateNumber()
    const shareToken = await Certificate.generateShareToken()

    const trackTitle = track === 'DSA' ? 'DSA Mastery Track' : 'Real World Engineering Track'

    // Create certificate record
    const certificate = await Certificate.create({
      userId: req.user._id,
      track,
      title: trackTitle,
      certificateNumber,
      userName: req.user.username || 'Coder',
      userEmail: req.user.email || '',
      userLevel: req.user.level || 1,
      userRank: req.user.rank || 'Rookie',
      problemsSolved: solvedProblems,
      totalXpEarned,
      completedAt: new Date(),
      shareToken,
      snapshot: {
        streakDays: streakCurrent,
        rank: req.user.rank || 'Rookie',
        totalSubmissions: totalUniqueSolved,
      },
    })

    // Generate PDF
    try {
      const pdfResult = await generateCertificate(certificate, req.user)
      certificate.pdfGenerated = true
      certificate.pdfPath = pdfResult.fileName
      await certificate.save()
    } catch (pdfErr) {
      console.error('❌ PDF generation failed:', pdfErr)
      // Certificate record still created even if PDF generation fails
    }

    res.status(201).json({
      message: `🎉 ${trackTitle} certificate generated!`,
      certificate,
      shareUrl: `/certificates/${certificate._id}`,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /:id — Get certificate details ────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' })
    }
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const certificate = await Certificate.findById(safeId)
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    // Only the owner or share token holder can view
    const isOwner = certificate.userId.toString() === req.user._id.toString()
    const isShareAccess = req.query.share === certificate.shareToken

    if (!isOwner && !isShareAccess) {
      return res.status(403).json({ error: 'Not authorized to view this certificate' })
    }

    res.json({ certificate })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /:id/download — Download certificate PDF ──────────
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' })
    }
    const safeId = new mongoose.Types.ObjectId(req.params.id)

    const certificate = await Certificate.findById(safeId)
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    // Only owner can download
    if (certificate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to download this certificate' })
    }

    if (!certificate.pdfGenerated || !certificate.pdfPath) {
      return res.status(404).json({ error: 'PDF not yet generated' })
    }

    const filePath = getCertificatePath(certificate.pdfPath)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file not found. Try regenerating.' })
    }

    res.download(filePath, `AlgoZen_${certificate.track}_Certificate.pdf`)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /share/:shareToken — Public certificate view ──────
router.get('/share/:shareToken', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ shareToken: req.params.shareToken })
      .populate('userId', 'username avatar')

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    res.json({
      certificate: {
        ...certificate.toObject(),
        // Don't expose internal fields
        _id: undefined,
        userId: certificate.userId?._id || certificate.userId,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
