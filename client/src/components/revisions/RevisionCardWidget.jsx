import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  ChevronRight,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  TrendingDown,
} from 'lucide-react'
import clsx from 'clsx'
import { difficultyStyle } from '@/lib/utils'

function getRetentionColor(probability) {
  if (probability >= 0.7) return 'text-emerald-400'
  if (probability >= 0.5) return 'text-yellow-400'
  return 'text-red-400'
}

function getRetentionBg(probability) {
  if (probability >= 0.7) return 'bg-emerald-500/10 border-emerald-500/20'
  if (probability >= 0.5) return 'bg-yellow-500/10 border-yellow-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

export default function RevisionCardWidget({ card, onStart }) {
  const retentionPct = Math.round((card.retentionProbability || 0) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-lg border p-3 transition-all hover:shadow-md',
        getRetentionBg(card.retentionProbability || 0)
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx(
              'text-xs font-semibold px-1.5 py-0.5 rounded',
              difficultyStyle(card.problem?.difficulty || 'Rookie')
            )}>
              {card.problem?.difficulty || 'Rookie'}
            </span>
            {retentionPct < 50 && (
              <span className="text-[10px] font-semibold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                At Risk
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-200 truncate">
            {card.problem?.title || 'Problem'}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Retention: <span className={clsx('font-semibold', getRetentionColor(card.retentionProbability || 0))}>{retentionPct}%</span>
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {card.repetitions || 0}x revised
            </span>
          </div>
        </div>

        <button
          onClick={() => onStart(card)}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
        >
          Re-solve
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Stats Card for Overview ─────────────────────────────
export function RevisionStatsCard({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-lg bg-dark-700 border border-dark-500 p-2.5 text-center">
        <p className="text-xl font-bold text-indigo-400 font-mono">{stats.totalDue}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Due Today</p>
      </div>
      <div className="rounded-lg bg-dark-700 border border-dark-500 p-2.5 text-center">
        <p className="text-xl font-bold text-emerald-400 font-mono">{stats.totalCards}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Total Cards</p>
      </div>
      <div className="rounded-lg bg-dark-700 border border-dark-500 p-2.5 text-center">
        <p className={clsx(
          'text-xl font-bold font-mono',
          stats.weakCount > 0 ? 'text-red-400' : 'text-emerald-400'
        )}>
          {stats.weakCount}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">Weak Topics</p>
      </div>
    </div>
  )
}

// ─── Insights Section for Dashboard ──────────────────────
export function RevisionInsightsCard({ insights, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-dark-600 rounded w-1/3" />
          <div className="h-20 bg-dark-600 rounded" />
          <div className="h-4 bg-dark-600 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!insights) return null

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          Revision Insights
        </h3>
        <span className={clsx(
          'text-xs font-bold px-2 py-0.5 rounded-full',
          insights.averageRetention >= 60
            ? 'bg-emerald-500/20 text-emerald-400'
            : insights.averageRetention >= 40
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        )}>
          {insights.averageRetention}% Avg Retention
        </span>
      </div>

      {/* Forgetting Curve */}
      {insights.forgettingCurve && insights.forgettingCurve.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Retention Trend (30 days)</p>
          <div className="flex items-end gap-0.5 h-16">
            {insights.forgettingCurve.filter((_, i) => i % 3 === 0).map((point, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t transition-all"
                style={{
                  height: `${point.retention}%`,
                  backgroundColor: point.retention >= 60
                    ? 'rgba(16, 185, 129, 0.5)'
                    : point.retention >= 40
                    ? 'rgba(245, 158, 11, 0.5)'
                    : 'rgba(239, 68, 68, 0.5)',
                }}
                title={`${point.date}: ${point.retention}%`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Weak Topics */}
      {insights.weakTopics && insights.weakTopics.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-400" />
            Weak Topics — Needs Revision
          </p>
          <div className="flex flex-wrap gap-1.5">
            {insights.weakTopics.map((topic, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {!(insights.weakTopics?.length > 0) && (
        <p className="text-xs text-slate-500 text-center py-3">
          All topics looking strong! Keep it up! 🎯
        </p>
      )}
    </div>
  )
}
