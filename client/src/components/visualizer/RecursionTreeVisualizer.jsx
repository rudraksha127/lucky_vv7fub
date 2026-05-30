import { motion } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * Recursion Tree Visualizer — shows recursive call stack as a tree.
 * Each recursive call is a node, with children for deeper calls.
 */
export default function RecursionTreeVisualizer({ steps = [] }) {
  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Enter a value to visualize recursion
      </div>
    )
  }

  // Build call tree from steps
  let maxDepth = 0
  const tree = []
  let currentPath = []

  for (const step of steps) {
    if (step.type === STEP_TYPES.RECURSE_CALL) {
      currentPath.push(step)
      maxDepth = Math.max(maxDepth, step.depth || 0)
    }
    if (step.type === STEP_TYPES.RECURSE_RETURN) {
      // Pop the matching call
      currentPath.pop()
    }
  }

  // For a linear display, flatten showing active calls at each depth
  const activeCalls = []
  for (const step of steps) {
    if (step.type === STEP_TYPES.RECURSE_CALL) {
      activeCalls.push({ ...step, state: 'active' })
    }
    if (step.type === STEP_TYPES.RECURSE_RETURN) {
      activeCalls.push({ ...step, state: 'returned' })
    }
  }

  const currentActive = activeCalls.filter(c => c.state === 'active').length

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Call tree visualization */}
      <div className="flex flex-col items-center gap-1">
        {activeCalls.map((call, idx) => {
          const isActive = call.state === 'active'
          const isCall = call.type === STEP_TYPES.RECURSE_CALL
          const indent = (call.depth || 0) * 24

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              {/* Indentation */}
              <div style={{ width: indent }} className="flex-shrink-0">
                {call.depth > 0 && (
                  <div className="flex items-center">
                    <div className="w-4 h-px bg-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                  </div>
                )}
              </div>

              {/* Node */}
              <div className={clsx(
                'px-3 py-1.5 rounded-lg border text-xs font-mono transition-all',
                isCall && isActive
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold'
                  : isCall
                  ? 'bg-dark-700 border-dark-500 text-slate-400'
                  : isActive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-dark-700 border-dark-500 text-slate-500'
              )}>
                <span className="flex items-center gap-2">
                  {isCall ? '📞' : '✅'}
                  {call.label}
                  {call.result !== undefined && (
                    <span className="text-emerald-400 font-bold">= {call.result}</span>
                  )}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-[10px] text-slate-500">
        <span>Total calls: <strong className="text-slate-300">{steps.length}</strong></span>
        <span>Max depth: <strong className="text-slate-300">{maxDepth}</strong></span>
        <span>Active: <strong className="text-indigo-400">{currentActive}</strong></span>
      </div>
    </div>
  )
}
