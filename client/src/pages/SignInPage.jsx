import { useState } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, LogIn, Loader2 } from 'lucide-react'
import api from '@/lib/api'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isDevMode = !CLERK_KEY || CLERK_KEY === 'pk_test_xxxx' || CLERK_KEY === 'pk_test_placeholder'

function DevLoginPanel() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDevLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/dev-login')
      localStorage.setItem('algozen_dev_token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Failed to connect to server. Is it running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-sm"
    >
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 shadow-2xl shadow-primary-500/5">
        {/* Dev badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-warning/20 text-warning border border-warning/30 text-xs font-bold uppercase tracking-wider">
            ⚡ Dev Mode
          </span>
        </div>

        <p className="text-sm text-slate-400 text-center mb-6">
          Clerk auth keys not configured. Login as a demo user to test the full application.
        </p>

        <button
          onClick={handleDevLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold py-3.5 px-5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          {loading ? 'Logging in...' : 'Login as Demo User'}
        </button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-danger text-center bg-danger/10 border border-danger/20 rounded-lg p-3"
          >
            {error}
          </motion.p>
        )}

        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-3 w-3 text-primary-400" />
            <span>Username: <code className="text-slate-300">demo_coder</code></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-3 w-3 text-primary-400" />
            <span>Role: <code className="text-slate-300">Admin</code> (full access)</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          AlgoZen
        </h1>
        <p className="mt-1 text-slate-400 text-sm">Welcome back, coder.</p>
      </motion.div>

      {isDevMode ? (
        <DevLoginPanel />
      ) : (
        <SignIn routing="path" path="/sign-in" />
      )}
    </div>
  )
}
