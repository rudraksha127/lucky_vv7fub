import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, CheckCircle, XCircle, Clock, User, Loader2,
  FileText, ExternalLink, MessageSquare, AlertTriangle,
  ChevronDown, ChevronUp, Search, Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../lib/api'

const DIFFICULTY_STYLES = {
  Rookie: 'text-green-400 bg-green-900/30 border border-green-700/30',
  Warrior: 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30',
  Legend: 'text-red-400 bg-red-900/30 border border-red-700/30',
}

function ProblemReviewCard({ problem, onAction, processing }) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState('')

  return (
    <motion.div
      layout
      className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all"
    >
      {/* Summary */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{problem.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', DIFFICULTY_STYLES[problem.difficulty])}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-400 bg-dark-700 rounded px-2 py-0.5">{problem.track}</span>
              <span className="text-xs text-slate-400 bg-dark-700 rounded px-2 py-0.5">{problem.topic}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {problem.submittedBy?.username || 'Unknown'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {new Date(problem.createdAt).toLocaleDateString()}
              </p>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-dark-600"
          >
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Description
                </p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap line-clamp-6 font-mono text-xs bg-dark-900 rounded-lg p-3">
                  {problem.description.slice(0, 500)}
                  {problem.description.length > 500 && '...'}
                </p>
              </div>

              {/* Examples */}
              {problem.examples?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Examples ({problem.examples.length})</p>
                  <div className="space-y-2">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-dark-900 rounded-lg p-3 text-xs space-y-1">
                        <p className="text-slate-500">Input: <span className="text-slate-300 font-mono">{ex.input}</span></p>
                        <p className="text-slate-500">Output: <span className="text-slate-300 font-mono">{ex.output}</span></p>
                        {ex.explanation && <p className="text-slate-500">Explanation: <span className="text-slate-300">{ex.explanation}</span></p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Cases Summary */}
              {problem.testCases?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                    Test Cases ({problem.testCases.length})
                    <span className="ml-2 text-amber-400 font-normal">
                      ({problem.testCases.filter(t => t.isHidden).length} hidden)
                    </span>
                  </p>
                </div>
              )}

              {/* Hints */}
              {problem.hints?.length > 0 && problem.hints.some(h => h) && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                    Hints ({problem.hints.filter(h => h).length})
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                    {problem.hints.filter(h => h).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Moderation Actions */}
              <div className="pt-3 border-t border-dark-600 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Moderator Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    rows={2}
                    placeholder="Add feedback for the submitter..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAction('approve', problem._id, notes)}
                    disabled={processing === problem._id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                  >
                    {processing === problem._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => onAction('reject', problem._id, notes)}
                    disabled={processing === problem._id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600/80 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CommunityModerationPage() {
  const [pendingProblems, setPendingProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [processing, setProcessing] = useState(null)
  const [search, setSearch] = useState('')

  const fetchPending = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/community/pending')
      setPendingProblems(data.problems || [])
      setCount(data.count || 0)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to load pending problems')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleAction = async (action, id, notes) => {
    setProcessing(id)
    try {
      const endpoint = action === 'approve' ? `/community/${id}/approve` : `/community/${id}/reject`
      const { data } = await api.put(endpoint, { notes })

      toast.success(data.message || `Problem ${action}d successfully!`)
      setPendingProblems(prev => prev.filter(p => p._id !== id))
      setCount(prev => prev - 1)
    } catch (err) {
      toast.error(err?.response?.data?.error || `Failed to ${action} problem`)
    } finally {
      setProcessing(null)
    }
  }

  const filteredProblems = pendingProblems.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.submittedBy?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" /> Problem Moderation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review community-submitted problems before publishing them to the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 w-48"
            />
          </div>
          <button
            onClick={fetchPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <Loader2 className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-800/50 border border-dark-600/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-400">{count}</p>
          <p className="text-xs text-slate-400 mt-1">Pending Review</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-600/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-400">
            {pendingProblems.filter(p => p.testCases?.length > 0).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">With Test Cases</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-600/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-blue-400">
            {new Set(pendingProblems.map(p => p.submittedBy?._id)).size}
          </p>
          <p className="text-xs text-slate-400 mt-1">Unique Contributors</p>
        </div>
      </div>

      {/* Pending List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-4 animate-pulse">
              <div className="h-5 w-48 bg-dark-700/60 rounded mb-3" />
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-dark-700/60 rounded" />
                <div className="h-4 w-20 bg-dark-700/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {search ? (
            <>
              <Search className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-300 font-medium">No problems match your search</p>
              <p className="text-slate-500 text-sm mt-1">Try different search terms.</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 text-emerald-500/60 mb-3" />
              <p className="text-slate-300 font-medium text-lg">All caught up! 🎉</p>
              <p className="text-slate-500 text-sm mt-1">No pending problems to review right now.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map(problem => (
            <ProblemReviewCard
              key={problem._id}
              problem={problem}
              onAction={handleAction}
              processing={processing}
            />
          ))}
        </div>
      )}

      {/* Moderation Tips */}
      <div className="bg-dark-800/30 border border-dark-600/30 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Moderation Tips
        </h3>
        <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
          <li>Verify that test cases are correct and the expected output matches</li>
          <li>Check that the problem description is clear and complete</li>
          <li>Ensure the difficulty rating is appropriate</li>
          <li>Provide constructive feedback when rejecting — helps contributors improve!</li>
          <li>Approved problems earn the contributor XP automatically</li>
        </ul>
      </div>
    </div>
  )
}
