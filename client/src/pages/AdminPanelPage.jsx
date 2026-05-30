import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Code, Send, Trophy, Search, 
  ShieldAlert, Shield, User, Loader2, 
  ChevronLeft, ChevronRight, RefreshCw 
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function AdminPanelPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to fetch admin stats')
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const { data } = await api.get(`/admin/users?page=${page}&limit=10&search=${search}`)
      setUsers(data.users || [])
      setTotalPages(data.pages || 1)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId)
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.role } : u))
      toast.success(`Successfully updated role to ${newRole}`)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to update user role')
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldAlert className="w-9 h-9 text-indigo-400" /> Admin Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage user roles, platform statistics, and settings.
          </p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchUsers(); }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-slate-300 hover:text-white transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: <Users className="w-5 h-5 text-indigo-400" />, 
            label: 'Total Platform Users', 
            value: stats?.totalUsers,
            color: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/20'
          },
          { 
            icon: <Code className="w-5 h-5 text-emerald-400" />, 
            label: 'Active Challenges', 
            value: stats?.totalProblems,
            color: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20'
          },
          { 
            icon: <Send className="w-5 h-5 text-amber-400" />, 
            label: 'Submissions Made', 
            value: stats?.totalSubmissions,
            color: 'from-amber-500/10 to-orange-500/5 border-amber-500/20'
          },
          { 
            icon: <Trophy className="w-5 h-5 text-pink-400" />, 
            label: 'Code Acceptance Rate', 
            value: stats ? `${stats.acceptanceRate}%` : null,
            color: 'from-pink-500/10 to-rose-500/5 border-pink-500/20'
          }
        ].map((item, idx) => (
          <div 
            key={idx}
            className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 flex items-center justify-between shadow-lg backdrop-blur-sm`}
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{item.label}</p>
              {loadingStats ? (
                <div className="h-8 w-24 bg-dark-700/50 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className="text-3xl font-extrabold text-white font-mono">{item.value ?? 0}</p>
              )}
            </div>
            <div className="p-3 bg-dark-800/80 rounded-xl border border-dark-600 shadow-inner">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" /> User Directory & Role Assignment
          </h2>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-dark-600 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm transition-colors"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl border border-dark-600/60 bg-dark-900/40">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="bg-dark-800/60 border-b border-dark-600 text-slate-400 font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Stats & Level</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/40">
              {loadingUsers ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-dark-700/60 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-dark-700/60 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-dark-700/60 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-24 bg-dark-700/60 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-dark-700/60 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No users found matching your search parameters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-800/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-primary-400 font-bold">Level {user.level || 1}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{user.xp || 0} XP</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {updatingUserId === user._id ? (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </div>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="professor">Professor</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-600 bg-dark-900/60 hover:bg-dark-800 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-xs text-slate-400">
              Page <strong className="text-white font-semibold">{page}</strong> of <strong className="text-white font-semibold">{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-600 bg-dark-900/60 hover:bg-dark-800 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
