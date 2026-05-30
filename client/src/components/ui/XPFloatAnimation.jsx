/**
 * XPFloatAnimation
 *
 * Shows a floating "+XP" animation that drifts upward and fades out.
 * Trigger with the `trigger` prop — increment to re-trigger.
 *
 * Usage:
 *   <XPFloatAnimation trigger={submissionCount} xpAmount={150} />
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSettingsStore from '../../stores/useSettingsStore'

export default function XPFloatAnimation({
  trigger = 0,
  xpAmount = 0,
  className = '',
}) {
  const xpParticlesEnabled = useSettingsStore((s) => s.xpParticles)

  // If particles are disabled, render nothing
  if (!xpParticlesEnabled) return null
  const [particles, setParticles] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!trigger || !xpAmount) return

    const newParticles = []
    const count = Math.min(5, Math.ceil(xpAmount / 50))

    for (let i = 0; i < count; i++) {
      idRef.current += 1
      newParticles.push({
        id: idRef.current,
        xp: Math.round(xpAmount / count),
        x: (Math.random() - 0.5) * 60,
        delay: i * 0.1,
      })
    }

    setParticles((prev) => [...prev, ...newParticles])

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      )
    }, 2000)

    return () => clearTimeout(timer)
  }, [trigger, xpAmount])

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 1,
              y: 0,
              x: particle.x,
              scale: 0.5,
            }}
            animate={{
              opacity: 0,
              y: -120,
              x: particle.x + (Math.random() - 0.5) * 20,
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="absolute left-1/2 top-1/2 font-extrabold text-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))',
            }}
          >
            +{particle.xp} XP ⚡
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
