import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Code2,
  Trophy,
  Swords,
  GraduationCap,
  User,
  Flame,
  Menu,
  X,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { setAuthInterceptor, setDevAuthInterceptor } from '@/lib/api'
import useNotificationStore, { NOTIFICATION_EVENTS } from '@/stores/useNotificationStore'
import NotificationCenter from './NotificationCenter'
import { clsx } from 'clsx'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isDevMode = !CLERK_KEY || CLERK_KEY === 'pk_test_xxxx' || CLERK_KEY === 'pk_test_placeholder'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/problems',  label: 'Problems',  icon: Code2 },
  { to: '/contests',  label: 'Contests',  icon: Trophy },
  { to: '/battle',    label: 'Battle',    icon: Swords },
  { to: '/classroom/join', label: 'Classroom', icon: GraduationCap },
  { to: '/profile',        label: 'Profile',   icon: User },
]

function NavItem({ to, label, Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
          isActive
            ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
            : 'text-slate-400 hover:text-white hover:bg-dark-700 border-l-2 border-transparent',
        )
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </NavLink>
  )
}

const XP_PER_LEVEL = 500

function SidebarXPBar() {
  const userState = useUserStore()
  const xp    = userState.user?.xp    ?? 0
  const level = userState.user?.level ?? 1
  const xpForNext = level * XP_PER_LEVEL
  const pct = Math.min(100, Math.round((xp % xpForNext) / xpForNext * 100))

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">Level {level}</span>
        <span className="text-xs text-primary-400 font-semibold">{xp} XP</span>
      </div>
      <div className="h-2 w-full rounded-full bg-dark-600 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{pct}% to Level {level + 1}</p>
    </div>
  )
}

function Sidebar({ onClose }) {
  const userState = useUserStore()
  const streakCurrent = userState.user?.streak?.current ?? 0
  const displayName = userState.user?.username ?? 'Coder'
  const displayEmail = userState.user?.email ?? ''
  const role = userState.user?.role ?? 'student'

  const activeLinks = [...NAV_LINKS]
  if (role === 'professor' || role === 'admin') {
    activeLinks.push({ to: '/professor', label: 'Manage Class', icon: GraduationCap })
  }
  if (role === 'admin') {
    activeLinks.push({ to: '/admin', label: 'Admin Panel', icon: ShieldCheck })
  }

  return (
    <aside className="flex h-full w-64 flex-col glass-dark border-r-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">
          AlgoZen
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2">
        {activeLinks.map(({ to, label, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
        ))}
      </nav>

      {/* Streak badge */}
      {streakCurrent > 0 && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-dark-700 px-3 py-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-300">{streakCurrent} day streak</span>
        </div>
      )}

      {/* XP bar */}
      <SidebarXPBar />

      {/* User row */}
      <div className="border-t border-dark-600 px-4 py-3 flex items-center gap-3">
        {isDevMode ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
            DC
          </div>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-200">
            {displayName}
          </p>
          <p className="truncate text-xs text-slate-500">
            {displayEmail}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const navigate = useNavigate()

  const userState  = useUserStore()
  const streakCurrent = userState.user?.streak?.current ?? 0
  const xp     = userState.user?.xp     ?? 0

  // Setup auth interceptor once
  useEffect(() => {
    if (isDevMode) {
      // Dev mode: check if we have a dev token
      const devToken = localStorage.getItem('algozen_dev_token')
      if (!devToken) {
        // Redirect to sign-in for dev login
        navigate('/sign-in')
        return
      }
      setDevAuthInterceptor()
      setAuthReady(true)
    } else {
      // Production mode: use Clerk
      setAuthReady(true)
    }
  }, [navigate])

  // Socket URL
  const WS_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')

  // Setup socket for real-time notifications
  useEffect(() => {
    if (!authReady) return
    const socket = io(WS_URL, { withCredentials: true })

    // Join user's personal notification room
    if (userState.user?._id) {
      socket.emit('join-user', userState.user._id)
    }

    // Listen for notification events
    socket.on('notification', (data) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        type: data.type || 'general',
        title: data.title || 'Notification',
        message: data.message || '',
        actionUrl: data.actionUrl || null,
      })
    })

    socket.on('streak-reminder', (data) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        type: NOTIFICATION_EVENTS.STREAK_REMINDER,
        title: data.title || '🔥 Streak at Risk!',
        message: data.message || 'Solve a problem today to keep your streak alive!',
        actionUrl: '/problems',
      })
    })

    socket.on('contest-starts-soon', (data) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        type: NOTIFICATION_EVENTS.CONTEST_STARTING,
        title: data.title || '🏆 Contest Starting Soon!',
        message: data.message || 'The contest is about to begin. Get ready!',
        actionUrl: `/contests/${data.contestId}`,
      })
    })

    socket.on('battle-invite', (data) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        type: NOTIFICATION_EVENTS.BATTLE_INVITE,
        title: data.title || '⚔️ Battle Invite!',
        message: data.message || `${data.from || 'Someone'} invited you to a battle!`,
        actionUrl: `/battle?room=${data.roomCode}`,
      })
    })

    return () => {
      socket.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, userState.user?._id])

  // Fetch user data when auth is ready
  useEffect(() => {
    if (authReady && !userState.user && !userState.loading) {
      userState.fetchUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, userState.user, userState.loading])

  // Setup Clerk interceptor if available
  if (!isDevMode) {
    return <ClerkAppLayout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
  }

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900">
        <div className="animate-pulse text-primary-400 text-lg font-semibold">Loading AlgoZen...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right column: topbar + content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/5 bg-dark-800/80 backdrop-blur-md px-4">
          {/* Left: hamburger (mobile) + logo text (mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AlgoZen
            </span>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden lg:block" />

          {/* Right: notifications + streak + xp + user button */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            {streakCurrent > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-dark-700 px-3 py-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">{streakCurrent}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-sm font-semibold text-primary-300">{xp} XP</span>
            </div>
            {isDevMode ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                DC
              </div>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Separate component when Clerk is available
function ClerkAppLayout({ mobileOpen, setMobileOpen }) {
  const { getToken } = useAuth()
  const userState = useUserStore()
  const streakCurrent = userState.user?.streak?.current ?? 0
  const xp = userState.user?.xp ?? 0

  useEffect(() => {
    setAuthInterceptor(getToken)
  }, [getToken])

  useEffect(() => {
    if (!userState.user && !userState.loading) {
      userState.fetchUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.user, userState.loading])

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/5 bg-dark-800/80 backdrop-blur-md px-4">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AlgoZen
            </span>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <NotificationCenter />
            {streakCurrent > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-dark-700 px-3 py-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">{streakCurrent}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-sm font-semibold text-primary-300">{xp} XP</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
