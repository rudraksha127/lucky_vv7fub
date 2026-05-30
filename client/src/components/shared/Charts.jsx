import { useState, useMemo } from 'react'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, CartesianGrid,
} from 'recharts'
import {
  TrendingUp, Activity, Award,
} from 'lucide-react'
import clsx from 'clsx'
import {
  ACHIEVEMENTS,
} from '@/lib/gameConstants'

// ─── Shared Chart Tooltip ───────────────────────────────────
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-dark-500 bg-dark-800/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ─── XP Chart (unified: 'full' with range toggle, 'simple' bar only) ──
export function XpChart({ dailyStats, variant = 'simple', title }) {
  const [range, setRange] = useState(7)
  const isFull = variant === 'full'

  const chartData = useMemo(() => {
    if (!dailyStats?.length) return []
    const sliced = isFull ? dailyStats.slice(-range) : dailyStats.slice(-30)
    return sliced.map((d) => ({
      date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      XP: d.xpEarned,
      Solved: d.accepted,
    }))
  }, [dailyStats, range, isFull])

  if (!chartData.length) return null

  const defaultTitle = isFull ? 'XP Progression' : 'XP Activity (Last 30 Days)'

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          {title ?? defaultTitle}
        </h2>
        {isFull && (
          <div className="flex gap-1">
            {[7, 30].map((n) => (
              <button
                key={n}
                onClick={() => setRange(n)}
                className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                  range === n
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white bg-dark-700 border border-dark-500'
                }`}
              >
                {n}d
              </button>
            ))}
          </div>
        )}
      </div>

      {isFull ? (
        <>
          {/* Area chart for XP (Dashboard style) */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="XP" stroke="#6366f1" fill="url(#xpGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Solved bar chart */}
          <div className="h-32 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Solved" fill="#34d399" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        // Simple bar chart (Profile style)
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="XP" fill="#6366f1" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ─── Achievement Badges (unified: accepts stats object or individual props) ──
export function AchievementBadges({ stats, totals: totalsProp, byDifficulty: byDiffProp, currentStreak: streakProp, dense }) {
  const totals = stats?.totals ?? totalsProp
  const byDifficulty = stats?.byDifficulty ?? byDiffProp
  const currentStreak = stats?.currentStreak ?? streakProp

  const earned = useMemo(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: a.check({ uniqueSolved: totals?.uniqueSolved || 0, totals, byDifficulty, currentStreak }),
    }))
  }, [totals, byDifficulty, currentStreak])

  const unlockedCount = earned.filter((a) => a.unlocked).length
  if (!earned.length) return null

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-400" />
          {dense ? 'Achievements' : 'Achievement Badges'}
        </h2>
        <span className={clsx('text-xs text-slate-400', !dense && 'font-mono')}>
          {unlockedCount}/{earned.length}
        </span>
      </div>
      <div className={clsx('grid gap-2', dense ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-6')}>
        {earned.map((a) => (
          <div
            key={a.id}
            title={a.desc}
            className={clsx(
              'flex flex-col items-center gap-1 rounded-lg p-2 transition-all',
              a.unlocked
                ? dense
                  ? 'bg-dark-700 border border-dark-500 hover:border-yellow-500/30'
                  : 'bg-dark-700 border border-dark-500 hover:border-yellow-500/40 hover:shadow-sm hover:shadow-yellow-500/10'
                : 'bg-dark-700/50 border border-dark-600 opacity-40'
            )}
          >
            <span className="text-xl">{a.unlocked ? a.icon : '🔒'}</span>
            <span className={clsx(
              'text-[9px] text-center font-medium leading-tight',
              a.unlocked ? (dense ? 'text-slate-300' : 'text-slate-300') : 'text-slate-600'
            )}>
              {a.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Heatmap (GitHub-style Mini, colorScheme: 'indigo' | 'emerald') ──
export function ActivityHeatmap({ dailyStats, colorScheme = 'indigo', title }) {
  const heatmapData = useMemo(() => {
    if (!dailyStats?.length) return []
    const weeks = []
    const today = new Date()
    const totalDays = 84 // 12 weeks

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const stat = dailyStats.find((s) => s.date === key)
      weeks.push({ date: key, count: stat?.accepted || 0 })
    }

    const grouped = []
    for (let i = 0; i < weeks.length; i += 7) {
      grouped.push(weeks.slice(i, i + 7))
    }
    return grouped
  }, [dailyStats])

  if (!heatmapData.length) return null

  const isEmerald = colorScheme === 'emerald'

  const cellColor = (count) => {
    if (count === 0) return 'bg-dark-600'
    if (count === 1) return isEmerald ? 'bg-emerald-900/70' : 'bg-indigo-900/70'
    if (count <= 3) return isEmerald ? 'bg-emerald-600' : 'bg-indigo-600'
    return isEmerald ? 'bg-emerald-400' : 'bg-indigo-400'
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity className={clsx('h-4 w-4', isEmerald ? 'text-emerald-400' : 'text-indigo-400')} />
        <h2 className="text-white font-semibold text-base">{title ?? 'Activity (12 weeks)'}</h2>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} solved`}
                  className={clsx('w-3 h-3 rounded-sm', cellColor(day.count))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-slate-500">Less</span>
        <div className="w-3 h-3 rounded-sm bg-dark-600" />
        <div className={clsx('w-3 h-3 rounded-sm', isEmerald ? 'bg-emerald-900/70' : 'bg-indigo-900/70')} />
        <div className={clsx('w-3 h-3 rounded-sm', isEmerald ? 'bg-emerald-600' : 'bg-indigo-600')} />
        <div className={clsx('w-3 h-3 rounded-sm', isEmerald ? 'bg-emerald-400' : 'bg-indigo-400')} />
        <span className="text-[10px] text-slate-500">More</span>
      </div>
    </div>
  )
}
