import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * Array/List Visualizer — highlights indices, shows pointers, animates swaps.
 */
export default function ArrayVisualizer({ array = [], step, highlightColor = 'indigo' }) {
  const values = step?.array || array
  const compareIndices = step?.indices || []
  const labels = step?.labels || []
  const isSwapping = step?.type === STEP_TYPES.ARRAY_SWAP
  const found = step?.found

  const colorMap = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Array bars */}
      <div className="flex items-end gap-1.5 h-48">
        {values.map((val, idx) => {
          const isCompared = compareIndices.includes(idx)
          const isPointer = step?.type === STEP_TYPES.ARRAY_POINTER && compareIndices.includes(idx)
          const isSwap = isSwapping && compareIndices.includes(idx)
          const isHighlighted = step?.highlighted?.includes(idx)
          const maxVal = Math.max(...values, 1)
          const height = ((Math.abs(val) + 1) / (maxVal + 1)) * 100

          return (
            <div key={idx} className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                {isSwap && (
                  <motion.span
                    key={`swap-${idx}-${val}`}
                    initial={{ y: idx === compareIndices[0] ? 20 : -20 }}
                    animate={{ y: 0 }}
                    className="text-[10px] font-mono text-slate-400 mb-1"
                  >
                    {val}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.div
                layout
                key={`bar-${idx}-${val}`}
                className={clsx(
                  'w-8 rounded-t transition-all duration-300',
                  isPointer && found === true ? 'bg-emerald-500'
                    : isPointer && found === false ? 'bg-red-500'
                    : isPointer ? colorMap[highlightColor] || 'bg-indigo-500'
                    : isSwap ? 'bg-yellow-500'
                    : isHighlighted ? 'bg-primary-500'
                    : isCompared ? 'bg-cyan-500'
                    : 'bg-slate-600'
                )}
                style={{ height: `${height}%` }}
                animate={{
                  scale: isCompared ? 1.05 : 1,
                  opacity: isCompared ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1">{val}</span>
              {isPointer && labels[idx] !== undefined && (
                <span className="text-[9px] font-bold text-indigo-400 -mt-1">{labels[idx]}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend / pointers */}
      {compareIndices.length > 0 && (
        <div className="flex gap-4 text-[10px] font-mono text-slate-400">
          {compareIndices.map((idx, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className={clsx('w-2 h-2 rounded-full', colorMap[highlightColor])} />
              {labels[i] || `idx ${idx}`}
            </span>
          ))}
        </div>
      )}

      {/* Step label */}
      {step?.label && (
        <p className="text-xs text-slate-500 font-medium text-center">{step.label}</p>
      )}
    </div>
  )
}
