import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Code2, Users, Search, ChevronLeft, ChevronRight,
  Check, Clock, User, Shield, Loader2,
} from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { SkeletonBlock } from '../components/ui/Skeletons'

const DIFFICULTY_STYLES = {
  Rookie: 'text-green-400 bg-green-900/30 border border-green-700/30',
  Warrior: 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30',
  Legend: 'text-red-400 bg-red-900/30 border border-red-700/30',
}

export default function CommunityProblemsPage() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [track, setTrack] = useState('')
  const [isModerator, setIsModerator] = useState(false)

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: '20' })
      if (search) params.set('search', search)
      if (difficulty) params.set('difficulty', difficulty)
      if (track) params.set('track', track)

      const { data } = await api.get(`/community?${params}`)
      setProblems(data.problems || [])
      setTotalPages(data.pages || 1)
      setIsModerator(data.isModerator || false)
    } catch (err) {
      toast.error('Failed to load community problems')
    } finally {
      setLoading(false)
    }
  }

  // Fetch whenever page, difficulty, or track changes
  useEffect(() => {
    fetchProblems()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, difficulty, track])

  // Debounce search — reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-400" /> Community Problems
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Problems submitted by the AlgoZen community — reviewed and approved by professors.
          </p>
        </div>
        <Link
          to="/community/submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Code2 className="w-4 h-4" /> Submit a Problem
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search community problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1) }}
            className="rounded-xl bg-dark-800 border border-dark-600 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Difficulty</option>
            <option value="Rookie">Rookie</option>
            <option value="Warrior">Warrior</option>
            <option value="Legend">Legend</option>
          </select>
          <select
            value={track}
            onChange={(e) => { setTrack(e.target.value); setPage(1) }}
            className="rounded-xl bg-dark-800 border border-dark-600 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Tracks</option>
            <option value="DSA">DSA</option>
            <option value="RealWorld">Real World</option>
          </select>
          {isModerator && (
            <Link
              to="/community/moderation"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors"
            >
              <Shield className="w-4 h-4" /> Moderate
            </Link>
          )}
        </div>
      </div>

      {/* Problems Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-4 space-y-3">
              <SkeletonBlock className="h-5 w-2/3" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-4 w-16 rounded" />
                <SkeletonBlock className="h-4 w-20 rounded" />
              </div>
              <div className="flex justify-between">
                <SkeletonBlock className="h-3 w-1/3" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-slate-300 font-medium text-lg">No community problems yet</p>
          <p className="text-slate-500 text-sm mt-1 mb-4">Be the first to contribute!</p>
          <Link
            to="/community/submit"
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
          >
            Submit a Problem
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((problem) => (
            <motion.div
              key={problem._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-dark-600 rounded-xl p-5 hover:border-primary-500/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <Link
                  to={`/problems/${problem.slug}/solve`}
                  className="text-sm font-semibold text-white hover:text-primary-400 transition-colors leading-snug group-hover:text-primary-400"
                >
                  {problem.title}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', DIFFICULTY_STYLES[problem.difficulty])}>
                  {problem.difficulty}
                </span>
                {problem.topic && (
                  <span className="text-slate-400 bg-dark-700 rounded px-2 py-0.5 text-xs">{problem.topic}</span>
                )}
                <span className="text-xs font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-700/30 rounded px-2 py-0.5">
                  +{problem.xpReward} XP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {problem.submittedBy?.username || 'Anonymous'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(problem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-sm text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-slate-400">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-sm text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
