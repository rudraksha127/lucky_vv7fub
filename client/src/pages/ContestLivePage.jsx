import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Clock,
  Users,
  Zap,
  ChevronUp,
  ChevronDown,
  Minus,
  Loader2,
  TrendingUp,
  Medal,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '@/lib/api'
import { io } from 'socket.io-client'

const SOCKET_URL = process.env.VITE_SOCKET_URL || (process.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')

const RANK_ICONS = {
  1: <Trophy className="w-5 h-5 text-yellow-400" />,
  2: <Medal className="w-5 h-5 text-slate-300" />,
  3: <Medal className="w-5 h-5 text-amber-600" />,
}

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-purple-600', 'bg-pink-600',
  'bg-cyan-600', 'bg-emerald-600', 'bg-orange-600',
]

function getAvatarColor(username) {
  let hash = 0
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ContestLivePage() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [contest, setContest] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [socket, setSocket] = useState(null)
  const leaderboardRef = useRef([])
  const [previousRanks, setPreviousRanks] = useState({})

  // Connect socket
  useEffect(() => {
    const s = io(SOCKET_URL, { withCredentials: true })
    setSocket(s)
    return () => s.disconnect()
  }, [])

  // Fetch contest data
  useEffect(() => {
    async function loadContest() {
      setLoading(true)
      try {
        const { data } = await api.get(`/contests/${contestId}`)
        setContest(data.contest || data)

        // Generate leaderboard from participants if available
        const participants = data.participants || data.leaderboard || []
        const sorted = [...participants]
          .sort((a, b) => (b.score || 0) - (a.score || 0) || (a.solveTime || Infinity) - (b.solveTime || Infinity))
        setLeaderboard(sorted)
        leaderboardRef.current = sorted
      } catch {
        toast.error('Failed to load contest')
        navigate('/contests')
      } finally {
        setLoading(false)
      }
    }
    if (contestId) loadContest()
  }, [contestId, navigate])

  // Socket event handlers — use ref to avoid stale closures
  useEffect(() => {
    if (!socket || !contestId) return

    socket.emit('join-contest', contestId)

    const handleLeaderboardUpdate = (data) => {
      // Capture previous ranks from ref (not stale closure)
      const currentLeaderboard = leaderboardRef.current
      const newRanks = {}
      currentLeaderboard.forEach((entry, i) => {
        newRanks[entry.userId || entry.username] = i + 1
      })
      setPreviousRanks(newRanks)

      const sorted = [...data.leaderboard]
        .sort((a, b) => (b.score || 0) - (a.score || 0) || (a.solveTime || Infinity) - (b.solveTime || Infinity))
      setLeaderboard(sorted)
      leaderboardRef.current = sorted
    }

    const handleContestEnded = () => {
      toast('🏁 Contest has ended!')
      setContest(prev => prev ? { ...prev, status: 'ended' } : prev)
    }

    socket.on('leaderboard-update', handleLeaderboardUpdate)
    socket.on('contest-ended', handleContestEnded)

    return () => {
      socket.emit('leave-contest', contestId)
      socket.off('leaderboard-update', handleLeaderboardUpdate)
      socket.off('contest-ended', handleContestEnded)
    }
  }, [socket, contestId])

  // Timer
  useEffect(() => {
    if (!contest?.startTime || contest?.status === 'ended') return

    const endTime = contest.endTime
      ? new Date(contest.endTime).getTime()
      : new Date(contest.startTime).getTime() + (contest.duration || 3600) * 1000

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000))
      if (diff <= 0) {
        setTimeRemaining('Ended')
        return
      }
      setTimeRemaining(formatTime(diff))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [contest])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Contest not found</p>
      </div>
    )
  }

  const isLive = contest.status === 'live'
  const isEnded = contest.status === 'ended'

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/contests')}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contests
      </button>

      {/* Contest Header */}
      <div className={clsx(
        'rounded-2xl p-6 border',
        isLive
          ? 'bg-gradient-to-r from-emerald-900/30 to-dark-800 border-emerald-500/30'
          : isEnded
            ? 'bg-dark-800 border-dark-600'
            : 'bg-dark-800 border-dark-600'
      )}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={clsx(
              'p-3 rounded-xl',
              isLive ? 'bg-emerald-500/20' : 'bg-dark-700'
            )}>
              <Trophy className={clsx('w-8 h-8', isLive ? 'text-emerald-400' : 'text-slate-400')} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-400">
                <span className={clsx(
                  'text-xs font-semibold px-2 py-0.5 rounded-full border',
                  isLive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  isEnded ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                )}>
                  {isLive ? 'LIVE' : isEnded ? 'ENDED' : 'UPCOMING'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {leaderboard.length} participants
                </span>
              </div>
            </div>
          </div>

          {isLive && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 border border-dark-500">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-xl font-bold font-mono text-white">{timeRemaining}</span>
              </div>
            </div>
          )}

          {isEnded && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 border border-dark-500">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-mono text-slate-400">Ended</span>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-dark-600 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Participant</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Solved</div>
          <div className="col-span-2 text-center">Time</div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-sm">No participants yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              const prevRank = previousRanks[entry.userId || entry.username]
              const rankChange = prevRank ? prevRank - rank : 0

              return (
                <motion.div
                  key={entry.userId || entry.username || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={clsx(
                    'grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors',
                    index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-800/50',
                    rank <= 3 && 'hover:bg-yellow-900/10',
                    entry.isCurrentUser && 'bg-primary-600/10 border-l-2 border-primary-500'
                  )}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    {rank <= 3 ? (
                      <span className="scale-110">{RANK_ICONS[rank]}</span>
                    ) : (
                      <span className="text-sm font-mono text-slate-500">#{rank}</span>
                    )}
                    {rankChange > 0 && (
                      <ChevronUp className="w-3 h-3 text-emerald-400 ml-0.5" />
                    )}
                    {rankChange < 0 && (
                      <ChevronDown className="w-3 h-3 text-red-400 ml-0.5" />
                    )}
                    {rankChange === 0 && rank > 3 && (
                      <Minus className="w-3 h-3 text-slate-600 ml-0.5" />
                    )}
                  </div>

                  {/* Participant */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                      getAvatarColor(entry.username || 'User')
                    )}>
                      {(entry.username || '?').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {entry.username}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-[10px] text-primary-400 font-semibold">(You)</span>
                        )}
                      </p>
                      {entry.lastSolved && (
                        <p className="text-[10px] text-slate-500">
                          Last solve: {new Date(entry.lastSolved).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-bold font-mono text-white">
                      {entry.score || 0}
                    </span>
                  </div>

                  {/* Solved */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-sm font-mono text-emerald-400">
                      {entry.solvedCount || 0}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-xs font-mono text-slate-500">
                      {entry.solveTime ? entry.solveTime + 'ms' : '-'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
