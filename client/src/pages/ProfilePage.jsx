import { useEffect, useState } from 'react'
import { useAuth, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import {
  CheckCircle, Activity, Calendar,
  ChevronRight, Code, Star,
  Target,
} from 'lucide-react'

import useUserStore from '../stores/useUserStore'
import api from '../lib/api'
import {
  LEVEL_THRESHOLDS, CREATURE_EMOJIS, EVOLUTION_STAGES,
  cardVariants,
} from '../lib/gameConstants'
import {
  getLevel, getLevelProgress, getRank, timeAgo, statusLabel, statusStyle,
} from '../lib/utils'
import useNotificationStore from '../stores/useNotificationStore'
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react'
import { XpChart, AchievementBadges, ActivityHeatmap } from '../components/shared/Charts'
import { EvolutionPath, DifficultyChart, TopicProgress } from '../components/shared/StatsComponents'
import { ProfileSkeleton, SkeletonBlock } from '../components/ui/Skeletons'

// ─── Helper Functions (unique to ProfilePage, not shared) ──

// ProfilePage uses a slightly faster stagger for its card grid
const profileContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

// ─── Hero / Profile Card ───────────────────────────────────
function HeroCard({ user, stats }) {
  const xp = user?.xp ?? 0
  const level = getLevel(xp)
  const { pct } = getLevelProgress(xp, level)
  const stage = user?.creature?.stage ?? 0
  const rank = getRank(level)
  const radius = 45
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-800/60 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">

        {/* Left – Creature & Name */}
        <div className="flex flex-col items-center gap-2 min-w-[140px]">
          <div className="relative">
            <span className="text-6xl select-none">{CREATURE_EMOJIS[Math.min(stage, 4)]}</span>
            <div className="absolute -bottom-1 -right-1 bg-dark-800 rounded-full px-2 py-0.5 text-[10px] font-bold text-primary-400 border border-primary-500/30">
              Lv.{level}
            </div>
          </div>
          <p className="text-white font-semibold text-sm">{user?.creature?.name ?? 'Unnamed'}</p>
          <div className="flex gap-1">
            {EVOLUTION_STAGES.map((s) => (
              <div
                key={s.stage}
                className={clsx(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  s.stage <= stage ? 'bg-primary-500 shadow-sm shadow-primary-500/50' : 'bg-dark-600'
                )}
              />
            ))}
          </div>
        </div>

        {/* Center – XP Ring + Details */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <p className="text-2xl font-bold text-white">{user?.username ?? 'Unknown'}</p>
          <p className="text-sm text-slate-400">{user?.email ?? ''}</p>

          <svg width="110" height="110" viewBox="0 0 120 120" className="my-1">
            <defs>
              <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a1a27" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="url(#xpGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              className="transition-all duration-700 ease-out"
            />
            <text x="60" y="65" textAnchor="middle" fontWeight="bold" fontSize="22" fill="white">
              {level}
            </text>
          </svg>

          <div className="flex gap-2 flex-wrap justify-center">
            <span className="bg-primary-600/30 text-primary-400 text-xs font-semibold px-3 py-1 rounded-full border border-primary-500/20">
              Level {level}
            </span>
            <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full border', rank.bg, rank.color, rank.border)}>
              {rank.rank}
            </span>
          </div>

          {/* XP Progress mini bar */}
          <div className="w-full max-w-xs mt-1">
            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
              <span>XP Progress</span>
              <span>{xp.toLocaleString()} / {LEVEL_THRESHOLDS[level + 1]?.toLocaleString() || '∞'}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-dark-600 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Right – Quick Stats */}
        <div className="grid grid-cols-2 gap-2.5 min-w-[200px]">
          {[
            { icon: '🔥', label: 'Current Streak', value: `${user?.streak?.current ?? 0}d`, color: 'text-orange-400' },
            { icon: '📅', label: 'Longest Streak', value: `${user?.streak?.longest ?? 0}d`, color: 'text-blue-400' },
            { icon: '✅', label: 'Total Solved', value: `${stats?.totals?.uniqueSolved ?? user?.solvedProblems?.length ?? 0}`, color: 'text-emerald-400' },
            { icon: '🏆', label: 'Total XP', value: `${(user?.xp ?? 0).toLocaleString()}`, color: 'text-indigo-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-700 rounded-xl p-3 flex flex-col gap-0.5">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-[10px] text-slate-400 leading-tight">{stat.label}</p>
              <p className={clsx('text-white font-bold text-sm', stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Recent Submissions ─────────────────────────────────────
function RecentSubmissions({ submissions, loading }) {
  if (loading) {
    return (
      <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
        <h2 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <Code className="h-4 w-4 text-cyan-400" />
          Recent Submissions
        </h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg h-12">
              <SkeletonBlock className="h-3 w-1/3" />
              <SkeletonBlock className="h-3 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (!submissions?.length) {
    return (
      <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
        <h2 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <Code className="h-4 w-4 text-cyan-400" />
          Recent Submissions
        </h2>
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-dark-700/30 border border-dark-600/50 rounded-xl border-dashed">
          <Code className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No submissions yet</p>
          <p className="text-xs text-slate-500 mt-1 text-center max-w-[200px]">
            Start solving problems to build your profile and earn XP!
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <Code className="h-4 w-4 text-cyan-400" />
          Recent Submissions
        </h2>
        <Link to="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {submissions.slice(0, 5).map((sub, idx) => (
          <div
            key={sub._id ?? idx}
            className="flex items-center gap-2 p-3 bg-dark-700 border border-dark-500/50 rounded-lg"
          >
            <span className="text-sm font-medium text-slate-200 flex-1 min-w-0 truncate">
              {sub.problem?.title ?? sub.problemTitle ?? 'Problem'}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {sub.language && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-600 text-slate-400 border border-dark-500">
                  {sub.language}
                </span>
              )}
              <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap', statusStyle(sub.status))}>
                {statusLabel(sub.status)}
              </span>
              <span className="text-[10px] text-slate-500">{timeAgo(sub.createdAt ?? sub.submittedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Stats Summary ──────────────────────────────────────────
function StatsSummary({ stats }) {
  if (!stats) return null

  const items = [
    { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'Accepted', value: stats.totals?.accepted ?? 0 },
    { icon: <Activity className="w-4 h-4 text-cyan-400" />, label: 'Total Submissions', value: stats.totals?.submissions ?? 0 },
    { icon: <Target className="w-4 h-4 text-orange-400" />, label: 'Unique Problems', value: stats.totals?.uniqueSolved ?? 0 },
    { icon: <Calendar className="w-4 h-4 text-purple-400" />, label: 'Active Days', value: stats.totals?.daysActive ?? 0 },
  ]

  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-4">
        <Star className="h-4 w-4 text-yellow-400" />
        Stats Summary
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-dark-700 rounded-lg p-3 flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-dark-600">{item.icon}</div>
            <div>
              <p className="text-lg font-bold text-white font-mono">{item.value.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Notification Preferences ──────────────────────────────
function NotificationPreferences() {
  const {
    preferences,
    updatePreference,
    notificationSound,
    toggleSound,
    browserPermission,
    requestBrowserPermission,
  } = useNotificationStore()

  const SETTINGS = [
    {
      key: 'streakReminder',
      label: 'Streak Reminders',
      desc: 'Get reminded when your streak is at risk',
    },
    {
      key: 'contestAlerts',
      label: 'Contest Alerts',
      desc: 'Get notified when a contest is about to start',
    },
    {
      key: 'battleInvites',
      label: 'Battle Invites',
      desc: 'Get notified when someone invites you to a battle',
    },
    {
      key: 'questComplete',
      label: 'Quest Completion',
      desc: 'Get notified when you complete a daily quest',
    },
    {
      key: 'levelUp',
      label: 'Level Up',
      desc: 'Celebrate when you level up',
    },
    {
      key: 'acceptedSubmission',
      label: 'Accepted Submissions',
      desc: 'Get notified when your code is accepted',
    },
  ]

  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4 text-primary-400" />
        <h2 className="text-white font-semibold text-base">Notifications</h2>
      </div>

      {/* Browser permission status */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-dark-700 text-sm">
        <div className="flex items-center gap-2">
          {browserPermission === 'granted' ? (
            <Bell className="h-4 w-4 text-emerald-400" />
          ) : (
            <BellOff className="h-4 w-4 text-slate-500" />
          )}
          <span className="text-slate-300">Browser Notifications</span>
        </div>
        {browserPermission === 'granted' ? (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Enabled
          </span>
        ) : browserPermission === 'denied' ? (
          <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
            Blocked
          </span>
        ) : (
          <button
            onClick={requestBrowserPermission}
            className="text-xs font-semibold text-primary-400 hover:text-primary-300 bg-primary-500/10 px-2 py-1 rounded-md transition-colors"
          >
            Enable
          </button>
        )}
      </div>

      {/* Sound toggle */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-dark-700 text-sm">
        <div className="flex items-center gap-2">
          {notificationSound ? (
            <Volume2 className="h-4 w-4 text-slate-300" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
          <span className="text-slate-300">Notification Sound</span>
        </div>
        <button
          onClick={toggleSound}
          className={clsx(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
            notificationSound ? 'bg-primary-600' : 'bg-dark-500'
          )}
        >
          <span
            className={clsx(
              'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
              notificationSound ? 'translate-x-[18px]' : 'translate-x-[3px]'
            )}
          />
        </button>
      </div>

      {/* Toggle list */}
      <div className="space-y-1">
        {SETTINGS.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">{s.label}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
            <button
              onClick={() => updatePreference(s.key, !preferences[s.key])}
              className={clsx(
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ml-3',
                preferences[s.key] ? 'bg-primary-600' : 'bg-dark-500'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                  preferences[s.key] ? 'translate-x-[18px]' : 'translate-x-[3px]'
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Profile Page ──────────────────────────────────────
export default function ProfilePage() {
  const { getToken } = useAuth()
  const { user, loading, fetchUser } = useUserStore()
  const [stats, setStats] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true)
      try {
        const [{ data: statsData }, { data: subData }] = await Promise.all([
          api.get('/submissions/stats?days=90'),
          api.get('/submissions/my?limit=5'),
        ])
        setStats(statsData)
        setSubmissions(subData?.submissions ?? subData ?? [])
      } catch {
        // Fail silently — stats are enhancement
      } finally {
        setStatsLoading(false)
      }
    }
    if (user) loadStats()
  }, [user])

  const level = getLevel(user?.xp ?? 0)
  const stage = user?.creature?.stage ?? 0

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        {loading ? (
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <ProfileSkeleton />
          </div>
        ) : user ? (
          <motion.div
            variants={profileContainerVariants}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto p-6 space-y-6"
          >
            {/* Hero */}
            <HeroCard user={user} stats={stats} />

            {/* Stats Row */}
            <motion.div variants={profileContainerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatsSummary stats={stats} />
              <div className="lg:col-span-2">
                <XpChart dailyStats={stats?.dailyStats} />
              </div>
            </motion.div>

            {/* Achievements + Difficulty + Evolution */}
            <motion.div variants={profileContainerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AchievementBadges stats={stats} />
              <DifficultyChart byDifficulty={stats?.byDifficulty} />
              <EvolutionPath stage={stage} level={level} />
            </motion.div>

            {/* Activity Heatmap + Recent Submissions + Topic Progress */}
            <motion.div variants={profileContainerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ActivityHeatmap dailyStats={stats?.dailyStats} colorScheme="emerald" />
                <RecentSubmissions submissions={submissions} loading={statsLoading && !submissions.length} />
              </div>
              <div className="space-y-6">
                <TopicProgress byTopic={stats?.byTopic} />
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <NotificationPreferences />

            {/* Footer note */}
            {!stats && !statsLoading && (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500">
                  Start submitting code to see your stats and achievements!
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <p className="text-center py-20 text-slate-500">
            Could not load profile. Please make sure you are registered.
          </p>
        )}
      </SignedIn>
    </>
  )
}
