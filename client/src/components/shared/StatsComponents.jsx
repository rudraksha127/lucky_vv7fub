import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Trophy, GitBranch, BarChart3,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import clsx from 'clsx'
import {
  RANK_STAGES, EVOLUTION_STAGES, DIFFICULTY_COLORS,
  cardVariants,
} from '@/lib/gameConstants'

// ─── Streak Calendar (Month View) ───────────────────────────
export function StreakCalendar({ dailyStats }) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const dayStats = useMemo(() => {
    const map = {}
    if (dailyStats) {
      for (const d of dailyStats) {
        map[d.date] = d
      }
    }
    return map
  }, [dailyStats])

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push(dateStr)
  }

  const heatColor = (count) => {
    if (!count) return 'bg-dark-600'
    if (count === 1) return 'bg-emerald-900/60'
    if (count <= 3) return 'bg-emerald-700'
    return 'bg-emerald-500'
  }

  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-orange-400" />
        <h2 className="text-white font-semibold text-base">{MONTHS[currentMonth]}</h2>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((l) => (
          <div key={l} className="text-[10px] text-slate-500 text-center font-medium">{l}</div>
        ))}
        {days.map((dateStr, idx) => {
          if (!dateStr) return <div key={`empty-${idx}`} />
          const stats = dayStats[dateStr]
          const isToday = dateStr === today.toISOString().slice(0, 10)
          const count = stats?.accepted || 0
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${count} solved`}
              className={clsx(
                'aspect-square rounded-md flex items-center justify-center text-xs transition-all',
                isToday ? 'ring-2 ring-primary-500 ring-offset-1 ring-offset-dark-800' : '',
                count > 0 ? heatColor(count) : 'bg-dark-600'
              )}
            >
              {count > 0 ? (
                <span className="text-[9px] font-bold text-white">{count}</span>
              ) : (
                <span className="text-[9px] text-dark-400">{parseInt(dateStr.slice(-2))}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-slate-500">Less</span>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={clsx('w-3 h-3 rounded-sm', heatColor(i))} />
        ))}
        <span className="text-[10px] text-slate-500">More</span>
      </div>
    </div>
  )
}

// ─── Rank Progression ────────────────────────────────────────
export function RankProgression({ currentRank }) {
  const currentIdx = RANK_STAGES.findIndex((r) => r.rank === currentRank)
  const safeIdx = currentIdx >= 0 ? currentIdx : 0

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-4 w-4 text-yellow-400" />
        <h2 className="text-white font-semibold text-base">Rank Progression</h2>
      </div>
      <div className="space-y-3">
        {RANK_STAGES.map((stage, idx) => {
          const unlocked = idx <= safeIdx
          const isCurrent = idx === safeIdx
          return (
            <div key={stage.rank} className="flex items-center gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center gap-0.5">
                <div className={clsx(
                  'w-3 h-3 rounded-full border-2',
                  unlocked ? 'border-yellow-400 bg-yellow-400' : 'border-dark-500 bg-dark-600'
                )}>
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white m-auto mt-[1px]" />}
                </div>
                {idx < RANK_STAGES.length - 1 && (
                  <div className={clsx('w-0.5 h-5', unlocked ? 'bg-yellow-400/50' : 'bg-dark-600')} />
                )}
              </div>
              <div className="flex-1">
                <p className={clsx('text-sm font-semibold', unlocked ? 'text-white' : 'text-slate-600')}>
                  {stage.rank}
                </p>
                <p className="text-[10px] text-slate-500">Level {stage.minLevel}+</p>
              </div>
              {isCurrent && (
                <span className="text-xs font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
              {unlocked && !isCurrent && (
                <span className="text-xs text-emerald-400">✓</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Evolution Path ─────────────────────────────────────────
export function EvolutionPath({ stage }) {
  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-4">
        <GitBranch className="h-4 w-4 text-emerald-400" />
        Evolution Path
      </h2>
      <div className="space-y-0">
        {EVOLUTION_STAGES.map((s, idx) => {
          const unlocked = s.stage <= stage
          const isCurrent = s.stage === stage
          return (
            <div key={s.stage} className="flex items-start gap-3 relative">
              {/* Timeline line */}
              {idx < EVOLUTION_STAGES.length - 1 && (
                <div className={clsx(
                  'absolute left-[11px] top-7 w-0.5 h-12',
                  unlocked ? 'bg-gradient-to-b from-primary-500 to-primary-500/30' : 'bg-dark-600'
                )} />
              )}
              {/* Circle indicator */}
              <div className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 flex-shrink-0 mt-0.5 z-10',
                unlocked
                  ? 'border-primary-500 bg-primary-600/30 text-primary-400'
                  : 'border-dark-500 bg-dark-700 text-slate-600'
              )}>
                {unlocked ? (isCurrent ? '●' : '✓') : idx + 1}
              </div>
              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <div>
                    <p className={clsx('text-sm font-semibold', unlocked ? 'text-white' : 'text-slate-600')}>
                      {s.name}
                    </p>
                    <p className={clsx('text-[10px]', unlocked ? 'text-slate-400' : 'text-slate-600')}>
                      {s.desc}
                    </p>
                  </div>
                </div>
                <span className={clsx(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded mt-1 inline-block',
                  unlocked ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-600 text-slate-600'
                )}>
                  {s.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Difficulty Distribution (Pie Chart) ────────────────────
export function DifficultyChart({ byDifficulty }) {
  const data = useMemo(() => {
    if (!byDifficulty) return []
    return Object.entries(byDifficulty)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }))
  }, [byDifficulty])

  if (!data.length) return null

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-indigo-400" />
        Difficulty Breakdown
      </h2>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={48}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={DIFFICULTY_COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS[d.name] }} />
              <span className="text-xs text-slate-400 flex-1">{d.name}</span>
              <span className="text-xs font-mono text-slate-300">{d.value}</span>
              <span className="text-[10px] text-slate-500 w-10 text-right">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
          <div className="border-t border-dark-600 pt-2 mt-2 flex justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Solved</span>
            <span className="text-xs font-mono text-white font-bold">{total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Topic Progress ──────────────────────────────────────────
export function TopicProgress({ byTopic }) {
  const data = useMemo(() => {
    if (!byTopic) return []
    return Object.entries(byTopic)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [byTopic])

  if (!data.length) return null

  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <motion.div variants={cardVariants} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
      <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-4">
        <GitBranch className="h-4 w-4 text-cyan-400" />
        Topic Proficiency
      </h2>
      <div className="space-y-3 max-h-56 overflow-y-auto pr-2 pb-2 custom-scrollbar">
        {data.map((d, i) => (
          <div key={d.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">{d.name}</span>
              <span className="text-slate-400 font-mono">
                {d.value} <span className="text-[10px]">solved</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-dark-700 overflow-hidden">
              <motion.div
                className={clsx(
                  "h-full rounded-full",
                  i === 0 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                  i === 1 ? "bg-gradient-to-r from-indigo-500 to-indigo-400" :
                  i === 2 ? "bg-gradient-to-r from-purple-500 to-purple-400" :
                  "bg-gradient-to-r from-blue-500 to-blue-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
