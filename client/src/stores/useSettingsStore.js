/**
 * useSettingsStore
 *
 * Persistent store for micro-interaction preferences.
 * Each toggle controls whether an effect renders.
 *
 * Settings:
 *   customCursor     — Dot + ring cursor with spring physics
 *   magneticButtons  — Button follows cursor on hover
 *   xpParticles      — Floating +XP animation on submissions
 *   supernovaEffect  — Particle burst on level up
 *   reducedMotion    — Disables all animations (overrides others)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULTS = {
  customCursor: true,
  magneticButtons: true,
  xpParticles: true,
  supernovaEffect: true,
  reducedMotion: false,
}

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // ─── State ────────────────────────────────────────────
      ...DEFAULTS,

      // ─── Actions ──────────────────────────────────────────
      toggle: (key) =>
        set((state) => ({
          [key]: !state[key],
        })),

      setSetting: (key, value) =>
        set({ [key]: value }),

      resetDefaults: () =>
        set({ ...DEFAULTS }),

      /** Check if a specific effect is allowed (respects reducedMotion) */
      isEnabled: (key) => {
        const state = get()
        if (state.reducedMotion && key !== 'reducedMotion') return false
        return state[key] ?? true
      },
    }),
    {
      name: 'algozen-settings',
      partialize: (state) => ({
        customCursor: state.customCursor,
        magneticButtons: state.magneticButtons,
        xpParticles: state.xpParticles,
        supernovaEffect: state.supernovaEffect,
        reducedMotion: state.reducedMotion,
      }),
    }
  )
)

export default useSettingsStore
