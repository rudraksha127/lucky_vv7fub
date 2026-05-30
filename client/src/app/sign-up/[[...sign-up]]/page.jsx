"use client";

import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

const isDevMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('xxxx');

export default function SignUpPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (isDevMode) {
      router.replace('/sign-in')
    }
  }, [router]);

  if (isDevMode) return null;

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
      <SignUp routing="path" path="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  )
}
