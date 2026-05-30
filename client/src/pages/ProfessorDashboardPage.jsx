import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Users,
  BarChart3,
  Megaphone,
  BookOpen,
  Plus,
  X,
  Send,
  Loader2,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '@/lib/api'

export default function ProfessorDashboardPage() {
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAnnounceModal, setShowAnnounceModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [problems, setProblems] = useState([])
  const [createForm, setCreateForm] = useState({ name: '', college: '', semester: '', subject: '' })
  const [announceText, setAnnounceText] = useState('')
  const [assignForm, setAssignForm] = useState({ problemId: '', dueDate: '' })
  const [submitting, setSubmitting] = useState(false)

  // Fetch classrooms on mount
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get('/classrooms/my-classrooms')
        setClassrooms(Array.isArray(data) ? data : [])
      } catch {
        setClassrooms([])
        toast.error('Failed to load classrooms')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Fetch analytics when classroom selected
  useEffect(() => {
    if (!selectedClassroom) {
      setAnalytics(null)
      return
    }
    async function loadAnalytics() {
      setAnalyticsLoading(true)
      try {
        const { data } = await api.get(`/classrooms/${selectedClassroom._id}/analytics`)
        setAnalytics(data)
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setAnalyticsLoading(false)
      }
    }
    loadAnalytics()
  }, [selectedClassroom])

  // Fetch problems for assignment
  const fetchProblems = async () => {
    try {
      const { data } = await api.get('/problems?limit=100')
      setProblems(data.problems || [])
    } catch {
      toast.error('Failed to load problems')
    }
  }

  const handleCreateClassroom = async (e) => {
    e.preventDefault()
    if (!createForm.name.trim()) return toast.error('Classroom name required')
    setSubmitting(true)
    try {
      const { data } = await api.post('/classrooms', createForm)
      setClassrooms(prev => [data, ...prev])
      setShowCreateModal(false)
      setCreateForm({ name: '', college: '', semester: '', subject: '' })
      toast.success('Classroom created!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create classroom')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnnounce = async (e) => {
    e.preventDefault()
    if (!announceText.trim() || !selectedClassroom) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/classrooms/${selectedClassroom._id}/announce`, { text: announceText })
      setSelectedClassroom(data)
      setShowAnnounceModal(false)
      setAnnounceText('')
      toast.success('Announcement sent!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to send announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!assignForm.problemId || !selectedClassroom) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/classrooms/${selectedClassroom._id}/assign`, assignForm)
      setSelectedClassroom(data)
      setShowAssignModal(false)
      setAssignForm({ problemId: '', dueDate: '' })
      toast.success('Problem assigned!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to assign problem')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary-400" />
            Professor Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage your classrooms, track student progress, and assign problems</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Classroom
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classroom List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Your Classrooms</h2>
          {classrooms.length === 0 ? (
            <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 text-center">
              <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No classrooms yet.</p>
              <p className="text-slate-600 text-xs mt-1">Create one to get started.</p>
            </div>
          ) : (
            classrooms.map((c) => (
              <motion.button
                key={c._id}
                onClick={() => setSelectedClassroom(c)}
                className={clsx(
                  'w-full text-left p-4 rounded-xl border transition-all',
                  selectedClassroom?._id === c._id
                    ? 'bg-primary-600/10 border-primary-500/40'
                    : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                )}
              >
                <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-500">{c.students?.length || 0} students</span>
                  {c.code && (
                    <span className="text-xs font-mono text-primary-400 bg-primary-600/10 px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                  )}
                </div>
                {c.subject && (
                  <p className="text-xs text-slate-600 mt-1">{c.subject}{c.semester ? ` • Sem ${c.semester}` : ''}</p>
                )}
              </motion.button>
            ))
          )}
        </div>

        {/* Classroom Details & Analytics */}
        <div className="lg:col-span-2">
          {!selectedClassroom ? (
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-12 text-center">
              <BarChart3 className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400">Select a Classroom</h3>
              <p className="text-sm text-slate-600 mt-2">Choose a classroom from the left to view its analytics and manage it.</p>
            </div>
          ) : analyticsLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Classroom Info Banner */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{analytics.classroom.name}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                      <span>Code: <span className="font-mono text-primary-400">{analytics.classroom.code}</span></span>
                      {analytics.classroom.college && <span>• {analytics.classroom.college}</span>}
                      {analytics.classroom.semester && <span>• Sem {analytics.classroom.semester}</span>}
                      {analytics.classroom.subject && <span>• {analytics.classroom.subject}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAnnounceModal(true)
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-700 border border-dark-500 text-slate-300 text-xs font-semibold hover:bg-dark-600 transition-colors"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      Announce
                    </button>
                    <button
                      onClick={() => {
                        fetchProblems()
                        setShowAssignModal(true)
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-700 border border-dark-500 text-slate-300 text-xs font-semibold hover:bg-dark-600 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Assign Problem
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: analytics.analytics.totalStudents, icon: Users, color: 'text-blue-400' },
                  { label: 'Avg Level', value: analytics.analytics.avgLevel, icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Avg Solved', value: analytics.analytics.avgSolved, icon: CheckCircle2, color: 'text-green-400' },
                  { label: 'Avg XP', value: analytics.analytics.avgXP?.toLocaleString(), icon: Zap, color: 'text-yellow-400' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-800 border border-dark-600 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={clsx('w-4 h-4', stat.color)} />
                      <span className="text-xs text-slate-500">{stat.label}</span>
                    </div>
                    <p className={clsx('text-2xl font-bold font-mono', stat.color)}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Students Table */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  Students ({analytics.students?.length || 0})
                </h3>
                {analytics.students?.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No students have joined yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 text-xs uppercase">
                          <th className="pb-3 pr-4 font-medium">Student</th>
                          <th className="pb-3 pr-4 font-medium">Level</th>
                          <th className="pb-3 pr-4 font-medium">Rank</th>
                          <th className="pb-3 pr-4 font-medium">Solved</th>
                          <th className="pb-3 pr-4 font-medium">Streak</th>
                          <th className="pb-3 font-medium">XP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-600">
                        {analytics.students.map((s) => (
                          <tr key={s._id} className="hover:bg-dark-700/50 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-[10px] font-bold text-white">
                                  {(s.username || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-slate-200 font-medium truncate max-w-[140px]">{s.username}</p>
                                  {s.lastActive && (
                                    <p className="text-[10px] text-slate-600">
                                      Active: {new Date(s.lastActive).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-slate-300 font-mono">{s.level}</td>
                            <td className="py-3 pr-4">
                              <span className={clsx(
                                'text-xs font-semibold px-2 py-0.5 rounded-full',
                                s.rank === 'Rookie' && 'bg-slate-700 text-slate-300',
                                s.rank === 'Warrior' && 'bg-yellow-900/60 text-yellow-400',
                                s.rank === 'Legend' && 'bg-red-900/60 text-red-400',
                                s.rank === 'Master' && 'bg-purple-900/60 text-purple-400',
                              )}>
                                {s.rank}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-300 font-mono">{s.solvedCount}</td>
                            <td className="py-3 pr-4">
                              <span className={clsx(
                                'text-xs font-semibold',
                                s.streak > 0 ? 'text-orange-400' : 'text-slate-600'
                              )}>
                                {s.streak > 0 ? `🔥 ${s.streak}` : '-'}
                              </span>
                            </td>
                            <td className="py-3 text-slate-300 font-mono">{s.xp?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Announcements */}
              {analytics.announcements?.length > 0 && (
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-slate-400" />
                    Announcements
                  </h3>
                  <div className="space-y-3">
                    {analytics.announcements.map((a, i) => (
                      <div key={i} className="bg-dark-700 rounded-lg p-3">
                        <p className="text-sm text-slate-200">{a.text}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {analytics.assignments?.length > 0 && (
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    Assignments
                  </h3>
                  <div className="space-y-3">
                    {analytics.assignments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-dark-700 rounded-lg p-3">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{a.title || 'Problem'}</p>
                          {a.dueDate && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              Due: {new Date(a.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-primary-400 font-medium">Assigned</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Create Classroom Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Create Classroom</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <form onSubmit={handleCreateClassroom} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Classroom Name *</label>
                    <input
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. CS301 - Data Structures"
                      className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-medium">College</label>
                      <input
                        value={createForm.college}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, college: e.target.value }))}
                        placeholder="e.g. Acropolis"
                        className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-medium">Semester</label>
                      <input
                        value={createForm.semester}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, semester: e.target.value }))}
                        placeholder="e.g. 5"
                        className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Subject</label>
                    <input
                      value={createForm.subject}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g. Data Structures"
                      className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !createForm.name.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                    Create Classroom
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Announce Modal */}
      <AnimatePresence>
        {showAnnounceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowAnnounceModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Send Announcement</h3>
                  <button
                    onClick={() => setShowAnnounceModal(false)}
                    className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">To: {selectedClassroom?.name}</p>
                <form onSubmit={handleAnnounce} className="space-y-3">
                  <textarea
                    value={announceText}
                    onChange={(e) => setAnnounceText(e.target.value)}
                    placeholder="Type your announcement..."
                    rows={4}
                    className="w-full rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !announceText.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Announcement
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Assign Problem Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowAssignModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Assign Problem</h3>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">To: {selectedClassroom?.name}</p>
                <form onSubmit={handleAssign} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Problem</label>
                    <select
                      value={assignForm.problemId}
                      onChange={(e) => setAssignForm(prev => ({ ...prev, problemId: e.target.value }))}
                      className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200"
                    >
                      <option value="">Select a problem...</option>
                      {problems.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} ({p.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Due Date (optional)</label>
                    <input
                      type="date"
                      value={assignForm.dueDate}
                      onChange={(e) => setAssignForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full mt-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !assignForm.problemId}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                    Assign Problem
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
