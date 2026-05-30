import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  BookOpen,
  Loader2,
  CheckCircle2,
  ArrowRight,
  LogIn,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import useUserStore from '@/stores/useUserStore'

export default function ClassroomJoinPage() {
  const navigate = useNavigate()
  const { user, fetchUser } = useUserStore()
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [myClassroom, setMyClassroom] = useState(null)
  const [loadingClassroom, setLoadingClassroom] = useState(true)

  useEffect(() => {
    if (!user) fetchUser()
  }, [user, fetchUser])

  // Check if already in a classroom
  useEffect(() => {
    async function checkClassroom() {
      try {
        const { data } = await api.get('/classrooms/mine')
        if (data) setMyClassroom(data)
      } catch {
        // Not in a classroom
      } finally {
        setLoadingClassroom(false)
      }
    }
    checkClassroom()
  }, [])

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return toast.error('Enter a classroom code')

    setLoading(true)
    try {
      const { data } = await api.post('/classrooms/join', { code: joinCode.trim().toUpperCase() })
      setMyClassroom(data.classroom)
      setJoinCode('')
      toast.success('Joined classroom!')
      await fetchUser()
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to join classroom')
    } finally {
      setLoading(false)
    }
  }

  if (loadingClassroom) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  // Already in a classroom
  if (myClassroom) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full space-y-6"
        >
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30">
                <GraduationCap className="w-10 h-10 text-primary-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Your Classroom</h1>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-600/20">
                <BookOpen className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{myClassroom.name}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  {myClassroom.code && (
                    <span className="font-mono text-primary-400">{myClassroom.code}</span>
                  )}
                  {myClassroom.subject && <span>• {myClassroom.subject}</span>}
                  {myClassroom.semester && <span>• Sem {myClassroom.semester}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{myClassroom.students?.length || 0} classmates</span>
              </div>
              {myClassroom.professor && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Prof. {myClassroom.professor.username}</span>
                </div>
              )}
            </div>

            {/* Assignments */}
            {myClassroom.assignments?.length > 0 && (
              <div className="border-t border-dark-600 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Assignments</h3>
                <div className="space-y-2">
                  {myClassroom.assignments.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-dark-700 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-200">{a.title || a.problemId?.title || 'Problem'}</p>
                          {a.dueDate && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              Due: {new Date(a.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/problems/${a.problemId?.slug}`)}
                        className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                      >
                        Solve <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 transition-all"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  // Join classroom form
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <GraduationCap className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Join Classroom</h1>
          <p className="text-slate-400">Enter the code provided by your professor to join a classroom</p>
        </div>

        <form onSubmit={handleJoin} className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Classroom Code</label>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code..."
              maxLength={6}
              className="w-full rounded-xl border border-dark-600 bg-dark-700 px-4 py-3 text-lg text-slate-200 placeholder-slate-600 text-center font-bold tracking-[0.3em] uppercase focus:border-primary-500/50 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !joinCode.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            Join Classroom
          </button>

          <p className="text-center text-xs text-slate-600">
            Ask your professor for the classroom code if you don't have one.
          </p>
        </form>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  )
}
