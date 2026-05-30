import { motion } from 'framer-motion'
import clsx from 'clsx'
import {
  MousePointer2,
  Magnet,
  Sparkles,
  Zap,
  Eye,
  RotateCcw,
} from 'lucide-react'
import useSettingsStore from '../stores/useSettingsStore'

// ─── Toggle Switch ──────────────────────────────────────────
function Toggle({ enabled, onChange, label, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 border-b border-dark-600 last:border-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-0.5',
          enabled ? 'bg-primary-600' : 'bg-dark-500'
        )}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            enabled ? 'translate-x-[26px]' : 'translate-x-[4px]'
          )}
        />
      </button>
    </div>
  )
}

// ─── Section Header ─────────────────────────────────────────
function SectionHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      )}
    </div>
  )
}

// ─── Settings Card ───────────────────────────────────────────
function SettingsCard({ children, className }) {
  return (
    <div
      className={clsx(
        'bg-dark-800 border border-dark-600 rounded-2xl p-5',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Main Settings Page ─────────────────────────────────────
export default function SettingsPage() {
  const {
    customCursor,
    magneticButtons,
    xpParticles,
    supernovaEffect,
    reducedMotion,
    toggle,
    resetDefaults,
  } = useSettingsStore()

  const SETTINGS_GROUPS = [
    {
      title: 'Visual Effects',
      description: 'Control the visual flair and micro-interactions across the platform.',
      settings: [
        {
          key: 'customCursor',
          icon: MousePointer2,
          label: 'Custom Cursor',
          description: 'Dot + ring cursor with spring physics. Replaces the default cursor on hover over interactive elements.',
          enabled: customCursor,
        },
        {
          key: 'magneticButtons',
          icon: Magnet,
          label: 'Magnetic Buttons',
          description: 'Buttons gently follow your cursor on hover, creating a premium magnetic feel.',
          enabled: magneticButtons,
        },
        {
          key: 'xpParticles',
          icon: Sparkles,
          label: 'XP Float Particles',
          description: 'Floating "+XP" animation that drifts upward when your submission is accepted.',
          enabled: xpParticles,
        },
        {
          key: 'supernovaEffect',
          icon: Zap,
          label: 'Level Up Supernova',
          description: 'Particle burst explosion on the level-up modal when you gain a new level.',
          enabled: supernovaEffect,
        },
      ],
    },
    {
      title: 'Accessibility',
      description: 'Override all animations for accessibility.',
      settings: [
        {
          key: 'reducedMotion',
          icon: Eye,
          label: 'Reduced Motion',
          description: 'Disables ALL animations and micro-interactions. Respects your system preference.',
          enabled: reducedMotion,
        },
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your experience. Changes take effect immediately.
        </p>
      </motion.div>

      {/* Settings groups */}
      {SETTINGS_GROUPS.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: gi * 0.1 }}
        >
          <SectionHeader title={group.title} description={group.description} />
          <SettingsCard>
            {group.settings.map((setting) => (
              <Toggle
                key={setting.key}
                icon={setting.icon}
                label={setting.label}
                description={setting.description}
                enabled={setting.enabled}
                onChange={() => toggle(setting.key)}
              />
            ))}
          </SettingsCard>
        </motion.div>
      ))}

      {/* Reset to defaults */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={resetDefaults}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-dark-800 hover:bg-dark-700 border border-dark-600 px-5 py-2.5 rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </motion.div>
    </div>
  )
}
