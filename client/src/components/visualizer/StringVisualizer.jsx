import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * StringVisualizer — renders characters in a row with index labels,
 * two-pointer highlighting, pattern matching visualization.
 */
export default function StringVisualizer({ text = '', step }) {
  const str = typeof text === 'string' ? text : (text || '').toString()
  const chars = str.split('')
  const indices = step?.indices || []
  const labels = step?.labels || []
  const type = step?.type

  if (!str) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-xs">
        Enter a string to visualize (e.g. "racecar")
      </div>
    )
  }

  function getCharColor(idx) {
    const isInIndices = indices.includes(idx)
    if (type === STEP_TYPES.ARRAY_HIGHLIGHT && isInIndices) {
      return step?.found !== false ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200' : 'bg-red-500/30 border-red-500 text-red-200'
    }
    if (type === STEP_TYPES.ARRAY_SWAP && isInIndices) return 'bg-yellow-500/30 border-yellow-500 text-yellow-200'
    if (type === STEP_TYPES.ARRAY_COMPARE && isInIndices) return 'bg-cyan-500/30 border-cyan-500 text-cyan-200'
    if (type === STEP_TYPES.ARRAY_POINTER && isInIndices) {
      const i = indices.indexOf(idx)
      if (i === 0) return 'bg-indigo-500/30 border-indigo-400 text-indigo-200'
      if (i === 1) return 'bg-pink-500/30 border-pink-400 text-pink-200'
      if (i === 2) return 'bg-amber-500/30 border-amber-400 text-amber-200'
      return 'bg-indigo-500/30 border-indigo-400 text-indigo-200'
    }
    return 'bg-dark-700 border-dark-500 text-slate-300'
  }

  function getPointerLabel(idx) {
    const i = indices.indexOf(idx)
    if (i >= 0 && labels[i]) return labels[i]
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Characters row */}
      <div className="flex items-end gap-1 overflow-x-auto pb-4 px-4 max-w-full">
        <AnimatePresence mode="popLayout">
          {chars.map((char, idx) => (
            <motion.div
              key={`${idx}-${char}`}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="flex flex-col items-center"
            >
              {/* Index label */}
              <span className={clsx(
                'text-[9px] font-mono mb-1',
                indices.includes(idx) ? 'text-slate-400 font-bold' : 'text-slate-600'
              )}>
                {idx}
              </span>

              {/* Character box */}
              <motion.div
                className={clsx(
                  'flex items-center justify-center w-10 h-10 rounded-lg border-2 font-mono text-lg font-bold transition-all duration-300',
                  getCharColor(idx)
                )}
                animate={{
                  scale: indices.includes(idx) ? 1.1 : 1,
                  y: indices.includes(idx) && type === STEP_TYPES.ARRAY_POINTER ? -3 : 0,
                }}
              >
                {char}
              </motion.div>

              {/* Pointer label */}
              {getPointerLabel(idx) && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] font-bold mt-1"
                >
                  <span className={clsx(
                    'px-1 py-0.5 rounded',
                    indices.indexOf(idx) === 0 ? 'text-indigo-400 bg-indigo-500/20' :
                    indices.indexOf(idx) === 1 ? 'text-pink-400 bg-pink-500/20' :
                    'text-amber-400 bg-amber-500/20'
                  )}>
                    {getPointerLabel(idx)}
                  </span>
                </motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Step label */}
      {step?.label && (
        <motion.p
          key={step.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-500 font-medium text-center px-4"
        >
          {step.label}
        </motion.p>
      )}
    </div>
  )
}
