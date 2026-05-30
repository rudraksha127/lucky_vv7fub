import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  BellOff,
  Flame,
  Trophy,
  Swords,
  CheckCircle,
  Zap,
  Circle,
  CheckCheck,
  X,
  Info,
} from 'lucide-react'
import clsx from 'clsx'
import useNotificationStore, { NOTIFICATION_EVENTS } from '@/stores/useNotificationStore'

const NOTIFICATION_ICONS = {
  [NOTIFICATION_EVENTS.STREAK_REMINDER]: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  [NOTIFICATION_EVENTS.CONTEST_STARTING]: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  [NOTIFICATION_EVENTS.BATTLE_INVITE]: { icon: Swords, color: 'text-red-400', bg: 'bg-red-500/10' },
  [NOTIFICATION_EVENTS.QUEST_COMPLETE]: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  [NOTIFICATION_EVENTS.LEVEL_UP]: { icon: Zap, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  [NOTIFICATION_EVENTS.SUBMISSION_ACCEPTED]: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

function getIconForType(type) {
  const cfg = NOTIFICATION_ICONS[type]
  if (cfg) return cfg
  return { icon: Info, color: 'text-primary-400', bg: 'bg-primary-500/10' }
}

function timeAgoShort(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString()
}

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    browserPermission,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    requestBrowserPermission,
    notificationSound,
    toggleSound,
  } = useNotificationStore()

  const [isOpen, setIsOpen] = useState(false)
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const dropdownRef = useRef(null)
  const bellRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show permission prompt if not yet decided
  useEffect(() => {
    if (browserPermission === 'default' && 'Notification' in window) {
      // Delay prompt so it doesn't show immediately on page load
      const timer = setTimeout(() => setShowPermissionPrompt(true), 15000)
      return () => clearTimeout(timer)
    }
  }, [browserPermission])

  const handlePermissionRequest = async () => {
    const result = await requestBrowserPermission()
    setShowPermissionPrompt(false)
    // If granted, show a test notification
    if (result === 'granted') {
      const store = useNotificationStore.getState()
      store.notify(
        NOTIFICATION_EVENTS.QUEST_COMPLETE,
        '🔔 Notifications Enabled!',
        'You\'ll now get streak reminders, contest alerts, and more.',
      )
    }
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      // React Router navigation happens via Link, so this is handled by the Link wrapper
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={() => setIsOpen((v) => !v)}
        className="relative rounded-full p-2 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        {unreadCount > 0 ? (
          <>
            <Bell className="h-5 w-5" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
              style={{ minWidth: '18px', minHeight: '18px' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          </>
        ) : (
          <BellOff className="h-5 w-5" />
        )}
      </button>

      {/* Permission Prompt Tooltip */}
      <AnimatePresence>
        {showPermissionPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-primary-500/30 bg-dark-800 p-4 shadow-2xl shadow-primary-500/10"
          >
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  Stay in the zone!
                </p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Get notified about streak reminders, contest starting soon, and battle invites.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handlePermissionRequest}
                    className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-500 transition-colors"
                  >
                    Enable Notifications
                  </button>
                  <button
                    onClick={() => setShowPermissionPrompt(false)}
                    className="rounded-lg bg-dark-700 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionPrompt(false)}
                className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-xl border border-dark-600 bg-dark-800 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-600 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleSound}
                  className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                  title={notificationSound ? 'Mute sounds' : 'Enable sounds'}
                >
                  {notificationSound ? (
                    <Bell className="h-3.5 w-3.5" />
                  ) : (
                    <BellOff className="h-3.5 w-3.5" />
                  )}
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 rounded-md p-1.5 text-xs text-primary-400 hover:text-primary-300 hover:bg-dark-700 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <BellOff className="h-8 w-8 text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Streak reminders, contest alerts, and more will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-dark-600/50">
                  {notifications.map((n) => {
                    const iconConfig = getIconForType(n.type)
                    const IconComponent = iconConfig.icon
                    return (
                      <div
                        key={n.id}
                        className={clsx(
                          'group relative flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                          n.read
                            ? 'bg-transparent hover:bg-dark-700/50'
                            : 'bg-primary-500/5 hover:bg-primary-500/10'
                        )}
                        onClick={() => handleNotificationClick(n)}
                      >
                        {/* Unread indicator dot */}
                        {!n.read && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-500" />
                        )}

                        {/* Icon */}
                        <div className={clsx('rounded-lg p-2 flex-shrink-0 mt-0.5', iconConfig.bg)}>
                          <IconComponent className={clsx('h-4 w-4', iconConfig.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={clsx('text-sm font-medium leading-tight', n.read ? 'text-slate-300' : 'text-white')}>
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="mt-0.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          )}
                          <p className="mt-1 text-[10px] text-slate-500">
                            {timeAgoShort(n.timestamp)}
                          </p>
                        </div>

                        {/* Dismiss button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissNotification(n.id)
                          }}
                          className="rounded-md p-1 text-slate-500 hover:text-white hover:bg-dark-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-dark-600 px-4 py-2">
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    Notification Settings
                  </Link>
                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
