// ─── Level & XP Constants ──────────────────────────────────
export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]

export const CREATURE_EMOJIS = ['🥚', '🐣', '🦎', '🐉', '⚡']

export const EVOLUTION_STAGES = [
  { stage: 0, emoji: '🥚', name: 'Egg',      label: 'Level 1',  desc: 'Just starting your DSA journey' },
  { stage: 1, emoji: '🐣', name: 'Hatchling', label: 'Level 5',  desc: 'Learning the basics' },
  { stage: 2, emoji: '🦎', name: 'Lizard',   label: 'Level 15', desc: 'Getting comfortable with patterns' },
  { stage: 3, emoji: '🐉', name: 'Dragon',   label: 'Level 30', desc: 'Advanced problem-solving mastery' },
  { stage: 4, emoji: '⚡', name: 'Legend',   label: 'Level 50', desc: 'Peak algorithmic excellence' },
]

// ─── Rank Constants ────────────────────────────────────────
export const RANK_STAGES = [
  { rank: 'Rookie',  minLevel: 1,  maxLevel: 10,  color: 'text-slate-300', bg: 'bg-slate-700',          border: 'border-slate-600' },
  { rank: 'Warrior', minLevel: 11, maxLevel: 25,  color: 'text-yellow-400', bg: 'bg-yellow-900/60',      border: 'border-yellow-700/40' },
  { rank: 'Legend',  minLevel: 26, maxLevel: 35,  color: 'text-red-400',    bg: 'bg-red-900/60',         border: 'border-red-700/40' },
  { rank: 'Master',  minLevel: 36, maxLevel: 999, color: 'text-purple-400', bg: 'bg-purple-900/60',      border: 'border-purple-700/40' },
]

export const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

// ─── Achievement Definitions ────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_solve',  label: 'First Blood',      desc: 'Solve your first problem',          icon: '🎯', check: (t) => t.uniqueSolved >= 1 },
  { id: 'five_solved',  label: 'Getting Started',   desc: 'Solve 5 problems',                  icon: '🌟', check: (t) => t.uniqueSolved >= 5 },
  { id: 'ten_solved',   label: 'DSA Learner',       desc: 'Solve 10 problems',                 icon: '💪', check: (t) => t.uniqueSolved >= 10 },
  { id: 'streak_3',     label: 'On Fire',            desc: '3-day streak',                     icon: '🔥', check: (t) => t.currentStreak >= 3 },
  { id: 'streak_7',     label: 'Week Warrior',       desc: '7-day streak',                     icon: '⚡', check: (t) => t.currentStreak >= 7 },
  { id: 'xp_500',       label: 'XP Hunter',          desc: 'Earn 500 XP',                      icon: '🏅', check: (t) => t.totals?.xpEarned >= 500 },
  { id: 'xp_1000',      label: 'XP Champion',        desc: 'Earn 1000 XP',                     icon: '👑', check: (t) => t.totals?.xpEarned >= 1000 },
  { id: 'all_diff',     label: 'All Rounder',        desc: 'Solve in all 3 difficulties',      icon: '🌈', check: (t) => t.byDifficulty?.Rookie > 0 && t.byDifficulty?.Warrior > 0 && t.byDifficulty?.Legend > 0 },
  { id: 'sub_50',       label: 'Code Machine',       desc: 'Submit 50 solutions',              icon: '🤖', check: (t) => t.totals?.submissions >= 50 },
  { id: 'days_10',      label: 'Dedicated',          desc: 'Active on 10+ days',               icon: '📆', check: (t) => t.totals?.daysActive >= 10 },
  { id: 'days_30',      label: 'Regular',            desc: 'Active on 30+ days',               icon: '📅', check: (t) => t.totals?.daysActive >= 30 },
]

// ─── Avatar / UI Constants ──────────────────────────────────
export const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-purple-600', 'bg-pink-600',
  'bg-cyan-600', 'bg-emerald-600', 'bg-orange-600',
]

export const DIFFICULTY_COLORS = {
  Rookie: '#34d399',
  Warrior: '#fbbf24',
  Legend: '#f87171',
}

// ─── Animation Variants (reused across pages) ───────────────
export const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}
