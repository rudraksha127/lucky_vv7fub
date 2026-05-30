/**
 * Device Tier Detection
 *
 * Detects device capabilities and returns a tier for progressive
 * 3D rendering:
 *   'low'  → No Three.js, CSS animations only
 *   'mid'  → Three.js at reduced quality
 *   'high' → Full Three.js experience
 *
 * Usage:
 *   const tier = getDeviceTier()
 *   // tier === 'low' → use static content
 *   // tier === 'mid' → use LiteCanvas
 *   // tier === 'high' → use FullCanvas
 */

import { useState, useEffect } from 'react'

export function getDeviceTier() {
  // Check for touch device (usually lower performance)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4

  // Check device memory (Chrome-only)
  const memory = navigator.deviceMemory || 8

  // Check for mobile user agent
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion || cores < 4 || memory <= 2) {
    return 'low'
  }

  if (isMobile || cores < 6 || memory <= 4 || isTouchDevice) {
    return 'mid'
  }

  return 'high'
}

export function useDeviceTier() {
  const [tier, setTier] = useState('mid') // Default mid, update after mount

  useEffect(() => {
    setTier(getDeviceTier())
  }, [])

  return tier
}

export default useDeviceTier
