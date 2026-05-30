import { SignUp } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isDevMode = !CLERK_KEY || CLERK_KEY === 'pk_test_xxxx' || CLERK_KEY === 'pk_test_placeholder'

export default function SignUpPage() {
  // In dev mode, redirect to sign-in (which has the dev login button)
  if (isDevMode) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          AlgoZen
        </h1>
        <p className="mt-1 text-slate-400 text-sm">Join the arena. Start your journey.</p>
      </motion.div>
      <SignUp routing="path" path="/sign-up" />
    </div>
  )
}
