import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { STEP_TYPES } from './visualizersData'

/**
 * LinkedListVisualizer — renders linked list nodes with arrows, pointer highlighting,
 * cycle detection, and reversal animations.
 */
export default function LinkedListVisualizer({ array = [], step }) {
  const values = step?.array || array
  const indices = step?.indices || []
  const labels = step?.labels || []
  const isSwapping = step?.type === STEP_TYPES.ARRAY_SWAP
  const isCompare = step?.type === STEP_TYPES.ARRAY_COMPARE
  const isHighlight = step?.type === STEP_TYPES.ARRAY_HIGHLIGHT
  const found = step?.found

  if (!values || values.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-xs">
        Enter linked list values (e.g. [1,2,3,4,5])
      </div>
    )
  }

  function getNodeColor(idx) {
    const isInIndices = indices.includes(idx)
    if (isHighlight && isInIndices) return found ? 'bg-emerald-500/30 border-emerald-500' : 'bg-red-500/30 border-red-500'
    if (isSwapping && isInIndices) return 'bg-yellow-500/30 border-yellow-500'
    if (isCompare && isInIndices) return 'bg-cyan-500/30 border-cyan-500'
    if (step?.type === STEP_TYPES.ARRAY_POINTER) {
      if (isInIndices) return 'bg-indigo-500/30 border-indigo-400'
    }
    return 'bg-dark-700 border-dark-500'
  }

  function getPointerLabel(idx) {
    const i = indices.indexOf(idx)
    return i >= 0 && labels[i] ? labels[i] : null
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Nodes row */}
      <div className="flex items-center overflow-x-auto pb-4 px-4 max-w-full">
        <AnimatePresence mode="popLayout">
          {values.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              layout
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="flex items-center"
            >
              {/* Node */}
              <motion.div
                className={clsx(
                  'flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 font-mono text-sm font-bold transition-all duration-300',
                  getNodeColor(idx)
                )}
                animate={{
                  scale: indices.includes(idx) ? 1.08 : 1,
                  y: indices.includes(idx) && step?.type === STEP_TYPES.ARRAY_POINTER ? -4 : 0,
                }}
              >
                <span className={clsx(
                  'text-sm',
                  indices.includes(idx) ? 'text-white' : 'text-slate-300'
                )}>
                  {val}
                </span>
                {getPointerLabel(idx) && (
                  <span className="text-[8px] font-bold text-indigo-400 -mt-0.5">
                    {getPointerLabel(idx)}
                  </span>
                )}
              </motion.div>

              {/* Arrow → */}
              <motion.div
                className="flex items-center mx-1"
                animate={{ opacity: idx < values.length - 1 ? 1 : 0.3 }}
              >
                <ArrowRight className={clsx(
                  'w-5 h-5',
                  indices.includes(idx) && indices.includes(idx + 1)
                    ? 'text-indigo-400'
                    : 'text-slate-600'
                )} />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      {indices.length > 0 && (
        <div className="flex flex-wrap gap-3 text-[10px] font-mono text-slate-400">
          {indices.map((idx, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className={clsx(
                'w-2.5 h-2.5 rounded-sm border',
                step?.type === STEP_TYPES.ARRAY_POINTER ? 'bg-indigo-500/50 border-indigo-400' :
                isCompare ? 'bg-cyan-500/50 border-cyan-400' :
                isSwapping ? 'bg-yellow-500/50 border-yellow-400' :
                'bg-slate-600 border-slate-500'
              )} />
              <span>{labels[i] || `Node ${idx}`} = {values[idx]}</span>
            </span>
          ))}
        </div>
      )}

      {/* Step label */}
      {step?.label && (
        <p className="text-xs text-slate-500 font-medium text-center px-4">{step.label}</p>
      )}
    </div>
  )
}
