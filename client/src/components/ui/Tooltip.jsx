'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Tooltip — a small hover tooltip that appears above or below its children.
 *
 * Props:
 *   children   — The trigger element
 *   label      — Tooltip text
 *   position   — 'top' | 'bottom' (default: 'bottom')
 *
 * Animation is handled by framer-motion and automatically respects
 * the global reducedMotion setting via MotionConfig.
 */
export default function Tooltip({ children, label, position = 'bottom' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 whitespace-nowrap rounded-md bg-dark-800 px-2.5 py-1 text-xs font-medium text-slate-200 border border-dark-600 shadow-lg pointer-events-none ${
              position === 'top'
                ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
                : 'top-full left-1/2 -translate-x-1/2 mt-2'
            }`}
          >
            {label}
            {/* Arrow pointing toward the trigger */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-800 border-dark-600 rotate-45 ${
                position === 'top'
                  ? 'bottom-[-4px] border-b border-r'
                  : 'top-[-4px] border-t border-l'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
