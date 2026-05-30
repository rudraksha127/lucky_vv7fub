/**
 * Rate Limiter Middleware
 *
 * Specialized rate limiters for different API endpoints:
 *   - globalLimit:    General API (100/15min)
 *   - submissionLimit: Code submission spam (10/min)
 *   - aiLimit:         AI cost protection (10/hour)
 *   - authLimit:       Auth brute force (30/15min)
 */

import rateLimit from 'express-rate-limit'

// ─── Global API Rate Limit ────────────────────────────────
export const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Slow down warrior!' },
  skip: () => process.env.NODE_ENV !== 'production',
})

// ─── Submission Rate Limit (anti-spam) ─────────────────────
export const submissionLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: req => req.user?._id?.toString() || req.ip,
  message: { error: 'Submission rate limit reached. Wait a minute before submitting again.' },
  skip: () => process.env.NODE_ENV !== 'production',
})

// ─── AI Rate Limit (cost protection) ──────────────────────
export const aiLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: req => req.user?._id?.toString() || req.ip,
  message: { error: 'AlgoGuru needs rest! Come back in an hour.' },
  skip: () => process.env.NODE_ENV !== 'production',
})

// ─── Auth Route Limit (brute force prevention) ─────────────
export const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Auth rate limit exceeded. Try again later.' },
  skip: () => process.env.NODE_ENV !== 'production',
})
