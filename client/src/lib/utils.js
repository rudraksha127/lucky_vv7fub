import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LEVEL_THRESHOLDS, RANK_STAGES, AVATAR_COLORS } from './gameConstants'

export const cn = (...inputs) => twMerge(clsx(inputs))

// ─── XP / Level Helpers ─────────────────────────────────────
export function getLevel(xp) {
  const level = LEVEL_THRESHOLDS.findIndex((t, i) => {
    const next = LEVEL_THRESHOLDS[i + 1]
    return next === undefined || xp < next
  })
  return Math.max(0, level)
}

export function getLevelProgress(xp, level) {
  const current = LEVEL_THRESHOLDS[level] ?? 0
  const next = LEVEL_THRESHOLDS[level + 1]
  if (!next) return { current, next: null, pct: 100 }
  const pct = Math.max(0, Math.min(100, ((xp - current) / (next - current)) * 100))
  return { current, next, pct }
}

export function xpProgress(xp) {
  const level = getLevel(xp)
  const current = LEVEL_THRESHOLDS[level] ?? 0
  const next = LEVEL_THRESHOLDS[level + 1]
  if (!next) return { level, pct: 100, xpInLevel: xp - current, xpNeeded: 0 }
  const xpInLevel = xp - current
  const xpNeeded = next - current
  const pct = Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100))
  return { level, pct, xpInLevel, xpNeeded }
}

// ─── Rank Helpers ───────────────────────────────────────────
export function getRank(level) {
  for (const r of RANK_STAGES) {
    if (level >= r.minLevel && level <= r.maxLevel) return r
  }
  return RANK_STAGES[0]
}

export function rankStyle(rank) {
  switch (rank) {
    case 'Rookie':  return 'bg-slate-700 text-slate-200'
    case 'Warrior': return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/40'
    case 'Legend':  return 'bg-red-900/60 text-red-300 border border-red-700/40'
    case 'Master':  return 'bg-purple-900/60 text-purple-300 border border-purple-700/40'
    default:        return 'bg-slate-700 text-slate-200'
  }
}

// ─── Difficulty Helpers ─────────────────────────────────────
export function difficultyStyle(difficulty) {
  switch (difficulty) {
    case 'Rookie':  return 'bg-green-900/40 text-green-400 border border-green-700/30'
    case 'Warrior': return 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30'
    case 'Legend':  return 'bg-red-900/40 text-red-400 border border-red-700/30'
    default:        return 'bg-slate-700 text-slate-300'
  }
}

export function difficultyBorder(difficulty) {
  switch (difficulty) {
    case 'Rookie':  return 'border-green-700/30'
    case 'Warrior': return 'border-yellow-700/30'
    case 'Legend':  return 'border-red-700/30'
    default:        return 'border-slate-600'
  }
}

// ─── Submission Status Helpers ──────────────────────────────
export function statusLabel(status) {
  switch (status) {
    case 'Accepted':           return 'Accepted'
    case 'WrongAnswer':        return 'Wrong Answer'
    case 'TimeLimitExceeded':  return 'TLE'
    case 'CompileError':       return 'Compile Error'
    case 'RuntimeError':       return 'Runtime Error'
    default:                   return status
  }
}

export function statusStyle(status) {
  switch (status) {
    case 'Accepted':          return 'text-green-400 bg-green-900/30 border border-green-700/30'
    case 'WrongAnswer':       return 'text-red-400 bg-red-900/30 border border-red-700/30'
    case 'TimeLimitExceeded': return 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30'
    case 'CompileError':      return 'text-orange-400 bg-orange-900/30 border border-orange-700/30'
    case 'RuntimeError':      return 'text-rose-400 bg-rose-900/30 border border-rose-700/30'
    default:                  return 'text-orange-400 bg-orange-900/30 border border-orange-700/30'
  }
}

// ─── Time & Avatar Helpers ──────────────────────────────────
export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function avatarColor(username) {
  let hash = 0
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
