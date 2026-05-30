/**
 * useSettingsStore Tests
 *
 * Tests the persistent settings store for micro-interaction preferences.
 * Uses vi.mock to inject a working in-memory storage for the persist middleware.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ─── Mock persist middleware with in-memory storage ─────────
// vi.mock is hoisted by vitest, so this runs before the store module is loaded.
// This is necessary because jsdom's localStorage may not be fully functional
// in this vitest version, causing zustand's persist middleware to fail.

const memoryStore = {}

vi.mock('zustand/middleware', async (importOriginal) => {
  const actual = await importOriginal()

  const inMemoryStorage = {
    getItem: (key) => memoryStore[key] ?? null,
    setItem: (key, value) => {
      memoryStore[key] = String(value)
    },
    removeItem: (key) => {
      delete memoryStore[key]
    },
  }

  return {
    ...actual,
    persist: (config, options) => {
      return actual.persist(config, {
        ...options,
        storage: actual.createJSONStorage(() => inMemoryStorage),
      })
    },
  }
})

// Import the store AFTER the mock is installed
import useSettingsStore from '../stores/useSettingsStore'

// ─── Helpers ──────────────────────────────────────────────────

const DEFAULTS = {
  customCursor: true,
  magneticButtons: true,
  xpParticles: true,
  supernovaEffect: true,
  reducedMotion: false,
}

const ALL_SETTING_KEYS = Object.keys(DEFAULTS)

function getState() {
  return useSettingsStore.getState()
}

function setState(next) {
  return useSettingsStore.setState(next)
}

function getPersistedState() {
  const raw = memoryStore['algozen-settings']
  if (!raw) return null
  return JSON.parse(raw).state
}

function storeIsEmpty() {
  return Object.keys(memoryStore).length === 0
}

// ─── Setup ─────────────────────────────────────────────────────

beforeEach(() => {
  // Clear the in-memory storage
  Object.keys(memoryStore).forEach((k) => delete memoryStore[k])
  // Reset store state to defaults
  setState({ ...DEFAULTS })
})

// ─── Tests ─────────────────────────────────────────────────────

describe('useSettingsStore', () => {
  describe('default values', () => {
    it('should have all settings enabled by default except reducedMotion', () => {
      const state = getState()

      expect(state.customCursor).toBe(true)
      expect(state.magneticButtons).toBe(true)
      expect(state.xpParticles).toBe(true)
      expect(state.supernovaEffect).toBe(true)
      expect(state.reducedMotion).toBe(false)
    })

    it('should have all required actions defined', () => {
      const state = getState()

      expect(typeof state.toggle).toBe('function')
      expect(typeof state.setSetting).toBe('function')
      expect(typeof state.resetDefaults).toBe('function')
      expect(typeof state.isEnabled).toBe('function')
    })
  })

  describe('toggle', () => {
    it('should flip a setting from true to false', () => {
      getState().toggle('customCursor')
      expect(getState().customCursor).toBe(false)
    })

    it('should flip a setting from false to true', () => {
      setState({ reducedMotion: true })
      getState().toggle('reducedMotion')
      expect(getState().reducedMotion).toBe(false)
    })

    it('should toggle each setting independently', () => {
      getState().toggle('magneticButtons')
      getState().toggle('xpParticles')

      expect(getState().customCursor).toBe(true)
      expect(getState().magneticButtons).toBe(false)
      expect(getState().xpParticles).toBe(false)
      expect(getState().supernovaEffect).toBe(true)
      expect(getState().reducedMotion).toBe(false)
    })

    it('should toggle multiple times in sequence', () => {
      getState().toggle('customCursor')
      expect(getState().customCursor).toBe(false)

      getState().toggle('customCursor')
      expect(getState().customCursor).toBe(true)

      getState().toggle('customCursor')
      expect(getState().customCursor).toBe(false)
    })
  })

  describe('setSetting', () => {
    it('should set a setting to a specific value', () => {
      getState().setSetting('magneticButtons', false)
      expect(getState().magneticButtons).toBe(false)
    })

    it('should set multiple settings to different values', () => {
      getState().setSetting('customCursor', false)
      getState().setSetting('xpParticles', false)
      getState().setSetting('reducedMotion', true)

      expect(getState().customCursor).toBe(false)
      expect(getState().xpParticles).toBe(false)
      expect(getState().reducedMotion).toBe(true)
      expect(getState().magneticButtons).toBe(true)
      expect(getState().supernovaEffect).toBe(true)
    })

    it('should set a setting back and forth', () => {
      getState().setSetting('reducedMotion', true)
      expect(getState().reducedMotion).toBe(true)

      getState().setSetting('reducedMotion', false)
      expect(getState().reducedMotion).toBe(false)
    })
  })

  describe('resetDefaults', () => {
    it('should restore all settings to default values', () => {
      ALL_SETTING_KEYS.forEach((key) => {
        getState().setSetting(key, key === 'reducedMotion')
      })

      getState().resetDefaults()

      ALL_SETTING_KEYS.forEach((key) => {
        expect(getState()[key]).toBe(DEFAULTS[key])
      })
    })

    it('should reset from any mixed state', () => {
      getState().toggle('customCursor')
      getState().toggle('reducedMotion')
      getState().toggle('xpParticles')

      getState().resetDefaults()

      ALL_SETTING_KEYS.forEach((key) => {
        expect(getState()[key]).toBe(DEFAULTS[key])
      })
    })

    it('should be idempotent when all settings are already defaults', () => {
      getState().resetDefaults()

      ALL_SETTING_KEYS.forEach((key) => {
        expect(getState()[key]).toBe(DEFAULTS[key])
      })
    })
  })

  describe('isEnabled', () => {
    it('should return true for all effects when reducedMotion is off', () => {
      ALL_SETTING_KEYS.forEach((key) => {
        expect(getState().isEnabled(key)).toBe(DEFAULTS[key])
      })
    })

    it('should return false for all effects when reducedMotion is on', () => {
      getState().setSetting('reducedMotion', true)

      const effectKeys = ALL_SETTING_KEYS.filter((k) => k !== 'reducedMotion')
      effectKeys.forEach((key) => {
        expect(getState().isEnabled(key)).toBe(false)
      })
    })

    it('should return true for reducedMotion itself even when it is true', () => {
      getState().setSetting('reducedMotion', true)
      expect(getState().isEnabled('reducedMotion')).toBe(true)
    })

    it('should return false for disabled effects when reducedMotion is off', () => {
      getState().setSetting('customCursor', false)
      getState().setSetting('xpParticles', false)

      expect(getState().isEnabled('customCursor')).toBe(false)
      expect(getState().isEnabled('xpParticles')).toBe(false)
      expect(getState().isEnabled('magneticButtons')).toBe(true)
    })

    it('should override individual settings when reducedMotion is on', () => {
      getState().setSetting('magneticButtons', true)
      getState().setSetting('reducedMotion', true)

      expect(getState().isEnabled('magneticButtons')).toBe(false)

      getState().setSetting('magneticButtons', false)
      expect(getState().isEnabled('magneticButtons')).toBe(false)
    })

    it('should return default truthy for unknown keys', () => {
      expect(getState().isEnabled('someFutureSetting')).toBe(true)
    })
  })

  describe('persist behavior', () => {
    it('should write state to storage on toggle', () => {
      getState().toggle('customCursor')

      const persisted = getPersistedState()
      expect(persisted).not.toBeNull()
      expect(persisted.customCursor).toBe(false)
    })

    it('should write state to storage on setSetting', () => {
      getState().setSetting('reducedMotion', true)

      const persisted = getPersistedState()
      expect(persisted).not.toBeNull()
      expect(persisted.reducedMotion).toBe(true)
    })

    it('should persist only the 5 partialized keys', () => {
      // The persist middleware's partialize only allows the 5 DEFAULTS keys
      getState().toggle('xpParticles')

      const persisted = getPersistedState()
      expect(persisted).not.toBeNull()
      expect(Object.keys(persisted)).toEqual(ALL_SETTING_KEYS)
    })

    it('should persist the correct boolean values', () => {
      getState().setSetting('customCursor', false)
      getState().setSetting('magneticButtons', false)
      getState().setSetting('xpParticles', true)
      getState().setSetting('supernovaEffect', false)
      getState().setSetting('reducedMotion', true)

      const persisted = getPersistedState()
      expect(persisted).toEqual({
        customCursor: false,
        magneticButtons: false,
        xpParticles: true,
        supernovaEffect: false,
        reducedMotion: true,
      })
    })

    it('should update persisted state after resetDefaults', () => {
      getState().setSetting('customCursor', false)
      getState().setSetting('reducedMotion', true)
      getState().resetDefaults()

      const persisted = getPersistedState()
      expect(persisted).toEqual(DEFAULTS)
    })

    it('should not persist action functions or internal keys', () => {
      const persisted = getPersistedState()
      expect(persisted).not.toBeNull()
      // Action functions should not be in the persisted state
      expect(persisted.toggle).toBeUndefined()
      expect(persisted.setSetting).toBeUndefined()
      expect(persisted.resetDefaults).toBeUndefined()
      expect(persisted.isEnabled).toBeUndefined()
    })
  })
})
