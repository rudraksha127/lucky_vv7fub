import { motion } from 'framer-motion'
import clsx from 'clsx'
import { cardVariants } from '@/lib/gameConstants'

export function SkeletonBlock({ className }) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-dark-700/50 rounded-lg relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <motion.div variants={cardVariants} className="bg-dark-800/60 backdrop-blur-sm border border-dark-600 rounded-xl p-5 space-y-4">
      <div className="flex gap-4 items-center">
        <SkeletonBlock className="w-12 h-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
    </motion.div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <SkeletonBlock className="w-24 h-24 rounded-full mx-auto lg:mx-0" />
        <div className="flex-1 space-y-4 text-center lg:text-left mt-4 lg:mt-0">
          <SkeletonBlock className="h-6 w-48 mx-auto lg:mx-0" />
          <SkeletonBlock className="h-4 w-32 mx-auto lg:mx-0" />
          <div className="flex gap-2 justify-center lg:justify-start mt-2">
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6 lg:mt-0 lg:min-w-[200px]">
          {[1, 2, 3, 4].map(i => (
            <SkeletonBlock key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-dark-800/40 rounded-xl border border-dark-600/50">
          <SkeletonBlock className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-3 w-1/4" />
          </div>
          <SkeletonBlock className="h-6 w-16 rounded-full flex-shrink-0 self-center" />
        </div>
      ))}
    </div>
  )
}
