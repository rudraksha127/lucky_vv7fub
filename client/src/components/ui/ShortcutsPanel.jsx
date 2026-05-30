import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, Keyboard } from 'lucide-react'

const SHORTCUTS = [
  {
    group: 'Navigation',
    items: [
      { keys: ['⌘', ','], label: 'Settings' },
      { keys: ['⌘', '9'], label: 'Notifications' },
    ],
  },
  {
    group: 'General',
    items: [
      { keys: ['?'], label: 'Toggle shortcuts panel' },
      { keys: ['⌘', '/'], label: 'Toggle shortcuts panel' },
      { keys: ['Esc'], label: 'Close this panel' },
    ],
  },
]

function KeyBadge({ keys }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i}>
          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-dark-600 border border-dark-500 px-1.5 text-[11px] font-mono font-semibold text-slate-300 shadow-sm">
            {key === '⌘' ? (
              <Command className="h-3 w-3" />
            ) : (
              key
            )}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-slate-600 text-xs mx-0.5">+</span>
          )}
        </span>
      ))}
    </span>
  )
}

export default function ShortcutsPanel({ open, onClose }) {
  // Close on Esc
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="shortcuts-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="shortcuts-panel"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full max-w-md mx-4 rounded-2xl border border-dark-500 bg-dark-800 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600/20">
                  <Keyboard className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Press <kbd className="inline-flex items-center justify-center min-w-[18px] h-4 rounded bg-dark-600 px-1 text-[10px] font-mono text-slate-400">?</kbd> or{' '}
                    <kbd className="inline-flex items-center justify-center min-w-[18px] h-4 rounded bg-dark-600 px-1 text-[10px] font-mono text-slate-400">
                      <Command className="h-2.5 w-2.5" /> + /
                    </kbd>{' '}
                    to reopen
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
                aria-label="Close shortcuts panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcut groups */}
            <div className="max-h-[50vh] overflow-y-auto px-5 py-4 space-y-5">
              {SHORTCUTS.map((group) => (
                <div key={group.group}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                    {group.group}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-dark-700 transition-colors"
                      >
                        <span className="text-sm text-slate-300">{item.label}</span>
                        <KeyBadge keys={item.keys} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-dark-600 bg-dark-850">
              <p className="text-[11px] text-slate-600 text-center">
                More shortcuts coming soon
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
