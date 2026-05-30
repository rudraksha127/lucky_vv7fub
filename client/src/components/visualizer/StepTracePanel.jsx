import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEP_TYPE_META = {
  array_compare:      { icon: '⇄', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'Compare' },
  array_swap:         { icon: '⇄', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'Swap' },
  array_set:          { icon: '←', color: 'text-blue-400',  bg: 'bg-blue-500/10',   border: 'border-blue-500/30',  label: 'Set' },
  array_pointer:      { icon: '↓', color: 'text-green-400', bg: 'bg-green-500/10',   border: 'border-green-500/30', label: 'Pointer' },
  array_highlight:    { icon: '★', color: 'text-purple-400',bg: 'bg-purple-500/10',  border: 'border-purple-500/30',label: 'Found' },
  recurse_call:       { icon: '↴', color: 'text-cyan-400',  bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',  label: 'Call' },
  recurse_return:     { icon: '↗', color: 'text-teal-400',  bg: 'bg-teal-500/10',    border: 'border-teal-500/30',  label: 'Return' },
  tree_visit:         { icon: '◉', color: 'text-emerald-400',bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',label: 'Visit' },
  tree_backtrack:     { icon: '↩', color: 'text-rose-400',  bg: 'bg-rose-500/10',    border: 'border-rose-500/30',  label: 'Backtrack' },
  graph_visit_node:   { icon: '◉', color: 'text-indigo-400',bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',label: 'Visit' },
  graph_traverse_edge:{ icon: '→', color: 'text-violet-400',bg: 'bg-violet-500/10',  border: 'border-violet-500/30',label: 'Traverse' },
  stack_push:         { icon: '↑', color: 'text-amber-400', bg: 'bg-amber-500/10',   border: 'border-amber-500/30', label: 'Push' },
  stack_pop:          { icon: '↓', color: 'text-red-400',   bg: 'bg-red-500/10',     border: 'border-red-500/30',   label: 'Pop' },
  queue_enqueue:      { icon: '←', color: 'text-lime-400',  bg: 'bg-lime-500/10',    border: 'border-lime-500/30',  label: 'Enqueue' },
  queue_dequeue:      { icon: '→', color: 'text-pink-400',  bg: 'bg-pink-500/10',    border: 'border-pink-500/30',  label: 'Dequeue' },
}

const DEFAULT_META = { icon: '●', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'Step' }

function getStepMeta(step) {
  return STEP_TYPE_META[step?.type] || DEFAULT_META
}

function truncateLabel(label, maxLen = 80) {
  if (!label) return ''
  return label.length > maxLen ? label.slice(0, maxLen) + '…' : label
}

export default function StepTracePanel({ steps, currentStep, onStepClick }) {
  const listRef = useRef(null)
  const itemRefs = useRef({})

  // Auto-scroll to current step
  useEffect(() => {
    if (currentStep != null && itemRefs.current[currentStep]) {
      itemRefs.current[currentStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [currentStep])

  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 p-4">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
          <span className="text-xs">~</span>
        </div>
        <p className="text-[10px] text-center">Select a pattern and enter input to see the execution trace</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-dark-600 bg-dark-800/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Execution Trace</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">
          {currentStep + 1}/{steps.length}
        </span>
      </div>

      {/* Steps list */}
      <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500">
        <AnimatePresence initial={false}>
          {steps.map((step, idx) => {
            const meta = getStepMeta(step)
            const isCurrent = idx === currentStep
            const isPast = idx < currentStep
            const isFuture = idx > currentStep

            return (
              <motion.button
                key={idx}
                ref={(el) => (itemRefs.current[idx] = el)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.003, duration: 0.15 }}
                onClick={() => onStepClick?.(idx)}
                className={`
                  w-full text-left px-3 py-1.5 border-b border-dark-700/50 transition-all duration-200
                  ${isCurrent
                    ? 'bg-primary-500/15 border-l-2 border-l-primary-400'
                    : isPast
                      ? 'bg-dark-800/20 border-l-2 border-l-transparent hover:bg-dark-700/30'
                      : 'bg-dark-900/30 border-l-2 border-l-transparent hover:bg-dark-800/20'
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  {/* Step number badge */}
                  <span className={`
                    flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold mt-0.5
                    ${isCurrent
                      ? 'bg-primary-500/30 text-primary-300 border border-primary-400/50'
                      : isPast
                        ? 'bg-dark-600 text-slate-500 border border-dark-500'
                        : 'bg-dark-700/50 text-slate-400 border border-dark-600'
                    }
                  `}>
                    {idx + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Step type badge */}
                      <span className={`
                        inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono font-medium
                        ${isCurrent ? `${meta.bg} ${meta.color} ${meta.border} border` : 'text-slate-400 bg-dark-700/50'}
                      `}>
                        <span className="text-[10px]">{meta.icon}</span>
                        {meta.label}
                      </span>

                      {/* Indices / labels */}
                      {step.indices && step.indices.length > 0 && (
                        <span className="text-[9px] font-mono text-slate-400">
                          [{step.indices.join(', ')}]
                        </span>
                      )}
                    </div>

                    {/* Step description */}
                    {step.label && (
                      <p className={`
                        text-[10px] mt-0.5 leading-relaxed font-mono
                        ${isCurrent ? 'text-slate-300' : isPast ? 'text-slate-500' : 'text-slate-400'}
                      `}>
                        {truncateLabel(step.label)}
                      </p>
                    )}
                  </div>

                  {/* Current indicator */}
                  {isCurrent && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse mt-1.5" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-dark-600 bg-dark-800/30 flex-shrink-0">
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-400/60" />
            Current
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600/40" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-dark-600" />
            Pending
          </span>
        </div>
      </div>
    </div>
  )
}
