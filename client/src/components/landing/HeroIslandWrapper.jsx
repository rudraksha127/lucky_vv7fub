/**
 * HeroIslandWrapper
 *
 * Dynamically imports AlgorithmIslandScene (React Three Fiber) for code splitting.
 * Gated by device tier — low-tier devices get a gradient placeholder instead.
 *
 * Phase 1 — Algorithm Island 3D Landing Page
 */

import { lazy, Suspense, memo } from 'react'
import useDeviceTier from '../../hooks/useDeviceTier'
import useSettingsStore from '../../stores/useSettingsStore'

const AlgorithmIslandScene = lazy(() => import('./AlgorithmIslandScene'))

// ─── Gradient Fallback ──────────────────────────────────────
function GradientFallback() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    >
      {/* Floating gradient orbs for visual richness while 3D loads */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/15 to-accent-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-primary-600/10 to-accent-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  )
}

// ─── Low-Tier Static Background ─────────────────────────────
function StaticBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800/80 via-dark-900 to-dark-900" />

      {/* Static glowing orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/8 to-accent-500/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr from-accent-500/8 to-primary-500/5 blur-3xl" />
    </div>
  )
}

// ─── Main Wrapper ───────────────────────────────────────────
function HeroIslandWrapperInner() {
  const tier = useDeviceTier()
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)

  // Low tier — no Three.js at all
  if (tier === 'low') {
    return <StaticBackground />
  }

  return (
    <Suspense fallback={<GradientFallback />}>
      <AlgorithmIslandScene tier={tier} reducedMotion={reducedMotion} />
    </Suspense>
  )
}

export default memo(HeroIslandWrapperInner)
