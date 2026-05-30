"use client";
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Flame,
  Trophy,
  Zap,
  Check,
  Circle,
  ChevronRight,
  Code,
  RefreshCw,
} from 'lucide-react'
import clsx from 'clsx'
import useUserStore from '@/stores/useUserStore'
import useNotificationStore, { NOTIFICATION_EVENTS } from '@/stores/useNotificationStore'
import api from '@/lib/api'
import MagneticButton from '@/components/ui/MagneticButton'

import {
  CREATURE_EMOJIS, RANK_MEDAL,
  containerVariants, cardVariants,
} from '@/lib/gameConstants'
import {
  xpProgress, rankStyle, difficultyStyle, statusLabel, statusStyle, timeAgo, avatarColor,
} from '@/lib/utils'
import { XpChart, AchievementBadges, ActivityHeatmap } from '@/components/shared/Charts'
import { StreakCalendar, RankProgression } from '@/components/shared/StatsComponents'
import { SkeletonBlock } from '@/components/ui/Skeletons'
import RevisionCardWidget, { RevisionStatsCard, RevisionInsightsCard } from '@/components/revisions/RevisionCardWidget'



// ─── Main Dashboard ─────────────────────────────────────────
export default function DashboardPage() {
  const { user, fetchUser } = useUserStore()
  const [submissions, setSubmissions] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(true)
  const [attemptedProblems, setAttemptedProblems] = useState([])
  const [quests, setQuests] = useState(null)
  const [stats, setStats] = useState(null)
  const [, setStatsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('weekly')
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState(null)
  const [revisions, setRevisions] = useState(null)
  const [revisionsLoading, setRevisionsLoading] = useState(true)
  const [insights, setInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(true)

  // Streak reminder notification
  const { notify } = useNotificationStore()

  // Check if user should be reminded about their streak
  useEffect(() => {
    if (!user || !submissions.length) return
    const hasSolvedToday = submissions.some(s => {
      if (s.status !== 'Accepted') return false
      const d = new Date(s.createdAt ?? s.submittedAt)
      const today = new Date()
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      )
    })
    if (!hasSolvedToday && (user.streak?.current ?? 0) > 0) {
      // Delay the notification so it doesn't overwhelm on page load
      const timer = setTimeout(() => {
        notify(
          NOTIFICATION_EVENTS.STREAK_REMINDER,
          '🔥 Streak at Risk!',
          `You're on a ${user.streak.current}-day streak! Solve one problem today to keep it alive.`,
          '/problems'
        )
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, submissions, notify])

  useEffect(() => {
    if (!user) fetchUser()
  }, [user, fetchUser])

  useEffect(() => {
    async function loadSubmissions() {
      setSubmissionsLoading(true)
      try {
        const res = await api.get('/submissions/my?limit=6')
        setSubmissions(res.data?.submissions ?? res.data ?? [])
      } catch {
        setSubmissions([])
      } finally {
        setSubmissionsLoading(false)
      }
    }
    loadSubmissions()
  }, [])

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true)
      try {
        const { data } = await api.get('/submissions/stats?days=90')
        setStats(data)
      } catch {
        setStats(null)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  // Fetch today's revisions
  useEffect(() => {
    async function loadRevisions() {
      setRevisionsLoading(true)
      try {
        const { data } = await api.get('/revisions/today')
        setRevisions(data)
      } catch {
        setRevisions(null)
      } finally {
        setRevisionsLoading(false)
      }
    }
    loadRevisions()
  }, [])

  // Fetch revision insights
  useEffect(() => {
    async function loadInsights() {
      setInsightsLoading(true)
      try {
        const { data } = await api.get('/revisions/insights')
        setInsights(data)
      } catch {
        setInsights(null)
      } finally {
        setInsightsLoading(false)
      }
    }
    loadInsights()
  }, [])

  // Fetch leaderboard
  useEffect(() => {
    async function loadLeaderboard() {
      setLeaderboardLoading(true)
      try {
        const { data } = await api.get(`/leaderboard?period=${leaderboardPeriod}&limit=10&currentUserId=${user?._id || ''}`)
        setLeaderboard(data.leaderboard ?? [])
        setCurrentUserRank(data.currentUser ?? null)
      } catch {
        setLeaderboard([])
      } finally {
        setLeaderboardLoading(false)
      }
    }
    loadLeaderboard()
  }, [leaderboardPeriod, user?._id])

  useEffect(() => {
    async function loadAttempted() {
      if (!user?.attemptedProblems?.length) return
      try {
        const ids = user.attemptedProblems.slice(-2).reverse()
        const results = await Promise.all(
          ids.map(id => api.get('/problems/' + id).then(r => r.data).catch(() => null))
        )
        setAttemptedProblems(results.filter(Boolean))
      } catch {
        setAttemptedProblems([])
      }
    }
    loadAttempted()
  }, [user])

  // Fetch real quest data from API
  useEffect(() => {
    api.get('/quests/today')
      .then(({ data }) => setQuests(data))
      .catch(() => setQuests(null))
  }, [user])

  const xp = user?.xp ?? 0
  const { level, pct, xpInLevel, xpNeeded } = xpProgress(xp)
  const stage = user?.creature?.stage ?? 0
  const creatureEmoji = CREATURE_EMOJIS[Math.min(stage, 4)]
  const creatureName = user?.creature?.name ?? 'Hatchling'

  const todaySolved = submissions.filter(s => {
    const d = new Date(s.createdAt ?? s.submittedAt)
    const today = new Date()
    return (
      s.status === 'Accepted' &&
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  }).length

  const dailyQuests = quests ? [
    {
      id: 1,
      label: 'Solve 1 problem today',
      xpReward: quests.rewards?.quest1 || 50,
      completed: quests.quests?.solveOne || false,
      progress: quests.progress ? `${quests.progress.accepted}/1 solved` : '',
    },
    {
      id: 2,
      label: 'Submit 3 solutions',
      xpReward: quests.rewards?.quest2 || 75,
      completed: quests.quests?.submitThree || false,
      progress: quests.progress ? `${quests.progress.totalSubmissions}/3 submitted` : '',
    },
    {
      id: 3,
      label: 'Try a Real World problem',
      xpReward: quests.rewards?.quest3 || 100,
      completed: quests.quests?.tryRealWorld || false,
      progress: quests.progress ? `${quests.progress.realWorldAttempts}/1 attempted` : '',
    },
  ] : [
    {
      id: 1,
      label: 'Solve 1 problem today',
      xpReward: 50,
      completed: (user?.solvedProblems?.length ?? 0) > 0,
      progress: '',
    },
    {
      id: 2,
      label: 'Submit 3 solutions',
      xpReward: 75,
      completed: false,
      progress: '??/3',
    },
    {
      id: 3,
      label: 'Try a Real World problem',
      xpReward: 100,
      completed: false,
      progress: '',
    },
  ]

  const { dailyStats, totals, byDifficulty, currentStreak } = stats || {}

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* ── Welcome Card ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Creature */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-5xl select-none">{creatureEmoji}</span>
            <div>
              <p className="text-white font-semibold font-mono text-lg leading-tight">{creatureName}</p>
              <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                Level {level}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">XP Progress</span>
              <span className="text-xs text-slate-400 font-mono">
                {xpInLevel.toLocaleString()} / {xpNeeded > 0 ? xpNeeded.toLocaleString() : '∞'} XP
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-dark-600 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Rank + Username */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full', rankStyle(user?.rank))}>
              {user?.rank ?? 'Rookie'}
            </span>
            <span className="text-slate-300 font-semibold text-sm">
              @{user?.username ?? '—'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Solved Today',
            value: todaySolved,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
            color: 'text-emerald-400',
          },
          {
            label: 'Current Streak',
            value: `${currentStreak ?? user?.streak?.current ?? 0} days`,
            icon: <Flame className="w-5 h-5 text-orange-400" />,
            color: 'text-orange-400',
          },
          {
            label: 'Rank',
            value: user?.rank ?? '—',
            icon: <Trophy className="w-5 h-5 text-yellow-400" />,
            color: 'text-yellow-400',
          },
          {
            label: 'Total XP',
            value: xp.toLocaleString(),
            icon: <Zap className="w-5 h-5 text-indigo-400" />,
            color: 'text-indigo-400',
          },
        ].map(stat => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-dark-700">{stat.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className={clsx('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts Row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <XpChart dailyStats={dailyStats} variant="full" />
        </div>
        <div className="space-y-6">
          <RankProgression currentRank={user?.rank} level={level} />
          <AchievementBadges
            totals={totals}
            byDifficulty={byDifficulty}
            currentStreak={currentStreak}
          />
        </div>
      </div>

      {/* ── Activity Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityHeatmap dailyStats={dailyStats} colorScheme="indigo" />
        </div>
        <div>
          <StreakCalendar dailyStats={dailyStats} />
        </div>
      </div>

      {/* ── Today's Revisions ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-base flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Today's Revisions
          </h2>
          {revisions && (
            <Link
              href="/revisions"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {revisionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-700/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !revisions || revisions.cards?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-center gap-2 bg-dark-700/30 border border-dark-600/50 rounded-xl border-dashed">
            <RefreshCw className="w-5 h-5 text-slate-600" />
            <p className="text-xs text-slate-500">No revisions due today! Solve problems to build your revision queue.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revisions.stats && <RevisionStatsCard stats={revisions.stats} />}
            <div className="space-y-2 mt-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500 pr-1">
              {revisions.cards.slice(0, 5).map(card => (
                <RevisionCardWidget
                  key={card._id}
                  card={card}
                  onStart={(c) => {
                    window.location.href = `/problems/${c.problem.slug}/solve?revision=${c._id}`
                  }}
                />
              ))}
              {revisions.cards.length > 5 && (
                <p className="text-center text-xs text-slate-500 pt-1">
                  +{revisions.cards.length - 5} more revisions due
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Insights + Quests Row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevisionInsightsCard insights={insights} loading={insightsLoading} />

        <div className="space-y-6">
          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-base">Daily Quests 🎯</h2>
              <span className="text-xs text-slate-500">Resets at midnight</span>
            </div>
            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <div
                  key={quest.id}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    quest.completed
                      ? 'bg-emerald-900/10 border-emerald-700/20'
                      : 'bg-dark-700 border-dark-500'
                  )}
                >
                  {quest.completed ? (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm font-medium', quest.completed ? 'line-through text-slate-500' : 'text-slate-200')}>
                      {quest.label}
                    </p>
                    {quest.progress && !quest.completed && (
                      <p className="text-xs text-slate-500 mt-0.5">{quest.progress}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/30 border border-indigo-700/30 px-2 py-0.5 rounded-full flex-shrink-0">
                    +{quest.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="glass-card p-5"
          >
            <h2 className="text-white font-semibold text-base mb-4">Continue Learning 📚</h2>
            {attemptedProblems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-center gap-2">
                <p className="text-slate-500 text-sm">No problems attempted yet.</p>
                <MagneticButton
                  as={Link}
                  href="/problems"
                  innerClassName="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  Start your journey →
                </MagneticButton>
              </div>
            ) : (
              <div className="space-y-3">
                {attemptedProblems.map(problem => (
                  <div
                    key={problem._id}
                    className="flex items-center gap-3 p-3 bg-dark-700 border border-dark-500 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{problem.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', difficultyStyle(problem.difficulty))}>
                          {problem.difficulty}
                        </span>
                        <span className="text-xs text-indigo-400 flex items-center gap-0.5 font-mono">
                          <Zap className="w-3 h-3" />
                          {problem.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/problems/${problem.slug}/solve`}
                      className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                    >
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Row: Submissions + Leaderboard ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="glass-card lg:col-span-2 p-5"
        >
          <h2 className="text-white font-semibold text-base mb-4">Recent Submissions</h2>
          {submissionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg h-14">
                  <SkeletonBlock className="h-3 w-1/3" />
                  <SkeletonBlock className="h-3 w-16 ml-auto" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 bg-dark-700/30 border border-dark-600/50 rounded-xl border-dashed">
              <Code className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-slate-500 text-xs text-center">No submissions yet.<br/>Solve a problem to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub, idx) => (
                <div
                  key={sub._id ?? idx}
                  className="flex flex-wrap items-center gap-2 p-3 bg-dark-700 border border-dark-500/50 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-200 flex-1 min-w-0 truncate">
                    {sub.problem?.title ?? sub.problemTitle ?? 'Problem'}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {sub.problem?.difficulty && (
                      <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', difficultyStyle(sub.problem.difficulty))}>
                        {sub.problem.difficulty}
                      </span>
                    )}
                    {sub.language && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-dark-600 text-slate-400 border border-dark-500">
                        {sub.language}
                      </span>
                    )}
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', statusStyle(sub.status))}>
                      {statusLabel(sub.status)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {timeAgo(sub.createdAt ?? sub.submittedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="glass-card lg:col-span-1 p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-base">Leaderboard 🏆</h2>
            <div className="flex gap-1">
              {['weekly', 'monthly', 'alltime'].map((p) => (
                <button
                  key={p}
                  onClick={() => setLeaderboardPeriod(p)}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-colors ${
                    leaderboardPeriod === p
                      ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-500 hover:text-white bg-dark-700 border border-dark-500'
                  }`}
                >
                  {p === 'weekly' ? '7d' : p === 'monthly' ? '30d' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {leaderboardLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2.5 p-2">
                  <SkeletonBlock className="w-6 h-4" />
                  <SkeletonBlock className="w-7 h-7 rounded-full" />
                  <SkeletonBlock className="flex-1 h-3" />
                  <SkeletonBlock className="w-12 h-3" />
                </div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 mt-2 bg-dark-700/30 border border-dark-600/50 rounded-xl border-dashed">
              <Trophy className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 text-center">
                No warriors in this period yet.
                <br />Solve a problem to claim the top!
              </p>
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              {leaderboard.map((entry) => (
                <div key={entry.userId ?? entry.rank} className="flex items-center gap-2.5">
                  <span className="text-base w-6 text-center flex-shrink-0">
                    {RANK_MEDAL[entry.rank] ?? (
                      <span className="text-slate-500 font-mono text-sm">{entry.rank}</span>
                    )}
                  </span>
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                    avatarColor(entry.username)
                  )}>
                    {entry.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-200 truncate block leading-tight">
                      {entry.username}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Lv.{entry.level} · {entry.solvedCount} solved
                    </span>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 flex items-center gap-0.5 flex-shrink-0">
                    <Zap className="w-3 h-3" />
                    {entry.xp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {currentUserRank && currentUserRank.rank > 10 && (
            <div className="mt-3 pt-3 border-t border-dark-600">
              <div className="flex items-center gap-2.5 opacity-70">
                <span className="text-base w-6 text-center flex-shrink-0 text-slate-500 font-mono text-sm">
                  {currentUserRank.rank > 999 ? '999+' : currentUserRank.rank}
                </span>
                <div className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-1 ring-primary-500/50',
                  avatarColor(currentUserRank.username)
                )}>
                  {currentUserRank.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-medium text-primary-300 truncate">
                  {currentUserRank.username}
                  <span className="text-[10px] text-slate-500 ml-1">(you)</span>
                </span>
                <span className="text-xs font-mono text-indigo-400 flex items-center gap-0.5 flex-shrink-0">
                  <Zap className="w-3 h-3" />
                  {currentUserRank.xp?.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <MagneticButton
            as={Link}
            href="/contests"
            innerClassName="mt-4 block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-700/30 rounded-lg py-2 transition-colors"
          >
            View Full Leaderboard
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
