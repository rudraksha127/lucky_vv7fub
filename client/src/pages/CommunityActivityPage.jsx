import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Award, Activity, Clock, CheckCircle, XCircle,
  Loader2, TrendingUp, Zap, User, Calendar, Shield,
  ChevronRight, GitCommit, ExternalLink, Search,
  Trophy, Medal, Flame,
} from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { SkeletonBlock } from '../components/ui/Skeletons'

// ─── Constants ──────────────────────────────────────────────
const MEDAL_EMOJIS = { 1: '🥇', 2: '🥈', 3: '🥉' }
const RANK_COLORS = {
  1: 'from-amber-400/20 to-yellow-500/10 border-amber-500/30',
  2: 'from-slate-300/20 to-slate-400/10 border-slate-400/30',
  3: 'from-orange-500/20 to-amber-600/10 border-orange-500/30',
}

const ACTIVITY_ICONS = {
  submitted: { icon: GitCommit, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  approved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
}

const AVATAR_COLORS = [
  'from-primary-500 to-accent-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
]

// ─── Sub-Components ─────────────────────────────────────────

function ContributorCard({ contributor, rank }) {
  const medal = MEDAL_EMOJIS[rank]
  const avatarColor = AVATAR_COLORS[rank % AVATAR_COLORS.length]
  const initials = (contributor.username || '??').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.04 }}
      className={clsx(
        'bg-dark-800/60 rounded-xl p-4 border transition-all hover:border-primary-500/40',
        rank <= 3 ? RANK_COLORS[rank] : 'border-dark-600'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className="shrink-0 w-10 text-center">
          {medal ? (
            <span className="text-2xl">{medal}</span>
          ) : (
            <span className="text-sm font-mono font-bold text-slate-500">#{rank}</span>
          )}
        </div>

        {/* Avatar */}
        <div className={clsx(
          'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shrink-0',
          avatarColor
        )}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate">
              {contributor.username}
            </span>
            <span className={clsx(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
              contributor.rankTitle === 'Rookie' && 'text-green-400 bg-green-900/30 border border-green-700/30',
              contributor.rankTitle === 'Warrior' && 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30',
              contributor.rankTitle === 'Legend' && 'text-red-400 bg-red-900/30 border border-red-700/30',
              contributor.rankTitle === 'Master' && 'text-purple-400 bg-purple-900/30 border border-purple-700/30',
            )}>
              {contributor.rankTitle}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-400" />
              {contributor.totalApproved} approved
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {contributor.totalXpEarned} XP
            </span>
            <span className="text-[10px] text-slate-500">
              {contributor.approvalRate}% rate
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-sm font-bold text-white">
            {contributor.totalSubmitted}
          </p>
          <p className="text-[10px] text-slate-500">submitted</p>
        </div>
      </div>
    </motion.div>
  )
}

function ActivityItem({ activity }) {
  const cfg = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.submitted
  const Icon = cfg.icon
  const timestamp = new Date(activity.timestamp)
  const timeStr = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  const isToday = new Date().toDateString() === timestamp.toDateString()
  const initials = (activity.user?.username || '??').slice(0, 2).toUpperCase()
  const avatarColor = AVATAR_COLORS[Math.abs(hashCode(activity.user?.username || '')) % AVATAR_COLORS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 group"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center border',
          cfg.bg
        )}>
          <Icon className={clsx('w-4 h-4', cfg.color)} />
        </div>
        <div className="w-0.5 flex-1 bg-dark-600 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={clsx(
              'w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white',
              avatarColor
            )}>
              {initials}
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[120px]">
              {activity.user?.username || 'System'}
            </span>
          </div>
          {activity.recipient && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-1.5">
                <div className={clsx(
                  'w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white',
                  AVATAR_COLORS[Math.abs(hashCode(activity.recipient?.username || '')) % AVATAR_COLORS.length]
                )}>
                  {(activity.recipient?.username || '??').slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm text-slate-400 truncate max-w-[100px]">
                  {activity.recipient?.username}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-1">
          <Link
            to={`/problems/${activity.problemSlug}/solve`}
            className="text-primary-400 hover:text-primary-300 underline underline-offset-2 decoration-primary-500/30"
          >
            {activity.problemTitle}
          </Link>
          {' '}— {activity.detail}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] text-slate-600">
            {isToday
              ? timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : timeStr
            }
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Simple string hash for consistent avatar colors
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

// ─── Main Page ──────────────────────────────────────────────
export default function CommunityActivityPage() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'contributors'

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, activityRes, contributorsRes] = await Promise.all([
        api.get('/community/stats'),
        api.get('/community/activity?limit=50'),
        api.get('/community/contributors?limit=20'),
      ])
      setStats(statsRes.data)
      setActivities(activityRes.data.activities || [])
      setContributors(contributorsRes.data.contributors || [])
    } catch (err) {
      toast.error('Failed to load community activity')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups = {}
    for (const a of activities) {
      const date = new Date(a.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(a)
    }
    return groups
  }, [activities])

  const filteredActivities = useMemo(() => {
    const entries = Object.entries(groupedActivities)
    return activeTab === 'feed' ? entries : entries.slice(0, 3)
  }, [groupedActivities, activeTab])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* ── Header ─────────────────────────────────── */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-400" /> Community Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            See what's happening in the AlgoZen community — top contributors and latest activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/community"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-slate-300 hover:text-white text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" /> Browse Problems
          </Link>
          <Link
            to="/community/submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Zap className="w-4 h-4" /> Submit Problem
          </Link>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-5 animate-pulse">
              <SkeletonBlock className="h-4 w-20 mb-2" />
              <SkeletonBlock className="h-8 w-16" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Activity, label: 'Total Problems', value: stats.totalProblems, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: CheckCircle, label: 'Approved', value: stats.approvedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Clock, label: 'Pending', value: stats.pendingCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Users, label: 'Contributors', value: stats.contributorCount, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Award, label: 'XP Awarded', value: stats.totalXpAwarded, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-dark-800 border border-dark-600 rounded-xl p-4 flex items-center gap-3"
            >
              <div className={clsx('p-2 rounded-lg', s.bg)}>
                <s.icon className={clsx('w-5 h-5', s.color)} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* ── Tab Navigation ────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-dark-600 pb-1">
        {[
          { id: 'feed', label: 'Activity Feed', icon: Activity },
          { id: 'contributors', label: 'Top Contributors', icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'text-primary-400 bg-primary-500/10 border-b-2 border-primary-500'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ───────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-4 bg-dark-800 border border-dark-600 rounded-xl animate-pulse">
                <SkeletonBlock className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-48" />
                  <SkeletonBlock className="h-3 w-32" />
                </div>
                <SkeletonBlock className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : activeTab === 'feed' ? (
          /* ── Activity Feed ──────────────────────── */
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6"
          >
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Activity className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-300 font-medium text-lg">No activity yet</p>
                <p className="text-slate-500 text-sm mt-1 text-center max-w-md">
                  Community activity will appear here when problems are submitted and reviewed.
                </p>
                <Link
                  to="/community/submit"
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
                >
                  Be the first to contribute!
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredActivities.map(([date, items]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4 mt-2 first:mt-0">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {date}
                      </h3>
                      <div className="flex-1 h-px bg-dark-600" />
                    </div>
                    {items.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── Contributors Leaderboard ────────────── */
          <motion.div
            key="contributors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {contributors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-dark-800/50 border border-dark-600/50 rounded-2xl">
                <Trophy className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-300 font-medium text-lg">No contributors yet</p>
                <p className="text-slate-500 text-sm mt-1">Start contributing to climb the leaderboard!</p>
                <Link
                  to="/community/submit"
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
                >
                  Submit a Problem
                </Link>
              </div>
            ) : (
              <>
                {/* Podium (Top 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                  {contributors.slice(0, 3).map((c, i) => (
                    <motion.div
                      key={c.userId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={clsx(
                        'rounded-2xl p-5 border text-center bg-gradient-to-b',
                        i === 0 && 'from-amber-500/10 to-yellow-500/5 border-amber-500/30',
                        i === 1 && 'from-slate-300/10 to-slate-400/5 border-slate-400/30',
                        i === 2 && 'from-orange-500/10 to-amber-600/5 border-orange-500/30',
                      )}
                    >
                      <span className="text-3xl">{MEDAL_EMOJIS[i + 1]}</span>
                      <p className="text-lg font-bold text-white mt-2">{c.username}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {c.totalApproved} approved
                        </span>
                        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          +{c.totalXpEarned} XP
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        {c.totalSubmitted} total submissions · {c.approvalRate}% approval
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Rest of Contributors */}
                <div className="space-y-2">
                  {contributors.slice(3).map((c, i) => (
                    <ContributorCard key={c.userId} contributor={c} rank={i + 4} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info Footer ───────────────────────────── */}
      <div className="bg-dark-800/30 border border-dark-600/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white">Community Guidelines</h3>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li>Submit high-quality problems with clear descriptions and test cases</li>
              <li>Get XP rewards when your problems are approved by professors</li>
              <li>Top contributors are featured on the leaderboard</li>
              <li>Help build the largest DSA & engineering problem library!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
