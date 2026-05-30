import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const NOTIFICATION_EVENTS = {
  STREAK_REMINDER: 'streak_reminder',
  CONTEST_STARTING: 'contest_starting',
  BATTLE_INVITE: 'battle_invite',
  QUEST_COMPLETE: 'quest_complete',
  LEVEL_UP: 'level_up',
  SUBMISSION_ACCEPTED: 'submission_accepted',
}

const DEFAULT_PREFERENCES = {
  streakReminder: true,
  contestAlerts: true,
  battleInvites: true,
  questComplete: true,
  levelUp: true,
  acceptedSubmission: true,
}

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // ─── State ────────────────────────────────────────────
      notifications: [],
      unreadCount: 0,
      preferences: { ...DEFAULT_PREFERENCES },
      // Derive browser permission once on store creation — the persist
      // middleware may load a stale value from localStorage on rehydrate,
      // but `browserPermission` is excluded from partialize.
      browserPermission: typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'default',
      notificationSound: true,
      notificationCenterOpen: false,

      // ─── Actions ──────────────────────────────────────────

      /** Toggle or set notification center dropdown */
      setNotificationCenterOpen: (open) => {
        set({ notificationCenterOpen: open })
      },

      /** Request browser notification permission */
      requestBrowserPermission: async () => {
        if (!('Notification' in window)) {
          console.log('⚠️ Browser notifications not supported')
          return 'unsupported'
        }
        if (Notification.permission === 'granted') {
          set({ browserPermission: 'granted' })
          return 'granted'
        }
        if (Notification.permission === 'denied') {
          set({ browserPermission: 'denied' })
          return 'denied'
        }
        const result = await Notification.requestPermission()
        set({ browserPermission: result })
        return result
      },

      /** Show a browser notification (if permission granted) */
      showBrowserNotification: (title, options = {}) => {
        if (Notification.permission !== 'granted') return false
        try {
          const notification = new Notification(title, {
            icon: '/vite.svg',
            badge: '/vite.svg',
            vibrate: [200, 100, 200],
            ...options,
          })
          // Auto-close after 8 seconds
          setTimeout(() => notification.close(), 8000)
          return true
        } catch {
          return false
        }
      },

      /** Add a notification (from socket or internal) */
      addNotification: (notification) => {
        const { preferences } = get()

        // Check user preference for this notification type
        const prefKey = {
          [NOTIFICATION_EVENTS.STREAK_REMINDER]: 'streakReminder',
          [NOTIFICATION_EVENTS.CONTEST_STARTING]: 'contestAlerts',
          [NOTIFICATION_EVENTS.BATTLE_INVITE]: 'battleInvites',
          [NOTIFICATION_EVENTS.QUEST_COMPLETE]: 'questComplete',
          [NOTIFICATION_EVENTS.LEVEL_UP]: 'levelUp',
          [NOTIFICATION_EVENTS.SUBMISSION_ACCEPTED]: 'acceptedSubmission',
        }[notification.type]

        if (prefKey && !preferences[prefKey]) return

        const newNotification = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          title: notification.title,
          message: notification.message || '',
          type: notification.type || 'general',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: notification.actionUrl || null,
          data: notification.data || {},
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // keep last 50
          unreadCount: state.unreadCount + 1,
        }))

        // Also show browser notification
        const { showBrowserNotification, notificationSound } = get()
        const didShow = showBrowserNotification(notification.title, {
          body: notification.message,
          data: { url: notification.actionUrl },
        })

        // Play notification sound if enabled and browser notification wasn't shown
        if (!didShow && notificationSound) {
          // Sound is played via a separate mechanism (optional)
        }
      },

      /** Mark a notification as read */
      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          const unreadCount = notifications.filter((n) => !n.read).length
          return { notifications, unreadCount }
        })
      },

      /** Mark all notifications as read */
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      /** Remove a notification */
      dismissNotification: (id) => {
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== id)
          const unreadCount = notifications.filter((n) => !n.read).length
          return { notifications, unreadCount }
        })
      },

      /** Clear all notifications */
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 })
      },

      // ─── Preferences ──────────────────────────────────────

      /** Update a single preference */
      updatePreference: (key, value) => {
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        }))
      },

      /** Reset preferences to defaults */
      resetPreferences: () => {
        set({ preferences: { ...DEFAULT_PREFERENCES } })
      },

      /** Toggle notification sound */
      toggleSound: () => {
        set((state) => ({ notificationSound: !state.notificationSound }))
      },

      // ─── Helper: create inline notification (no socket) ───
      notify: (type, title, message, actionUrl = null) => {
        get().addNotification({ type, title, message, actionUrl })
      },
    }),
    {
      name: 'algozen-notifications',
      partialize: (state) => ({
        preferences: state.preferences,
        notificationSound: state.notificationSound,
        browserPermission: state.browserPermission,
      }),
    }
  )
)

export { NOTIFICATION_EVENTS }
export default useNotificationStore
