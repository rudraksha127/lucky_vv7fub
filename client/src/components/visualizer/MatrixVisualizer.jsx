import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * MatrixVisualizer — renders a 2D grid of cells with traversal highlighting,
 * supports spiral, transpose, and path-following animations.
 */
export default function MatrixVisualizer({ matrix = [[]], step }) {
  // Parse matrix input — supports [[a,b],[c,d]] or flat array for 1-row display
  let grid
  if (Array.isArray(matrix) && matrix.length > 0) {
    if (Array.isArray(matrix[0])) {
      grid = matrix
    } else {
      // Flat array — show as single row
      grid = [matrix]
    }
  } else {
    grid = [[]]
  }

  const indices = step?.indices || []
  const type = step?.type
  const found = step?.found

  // Convert flat indices to [row, col] pairs
  const highlightedCells = []
  if (indices.length === 2 && typeof indices[0] === 'number' && typeof indices[1] === 'number') {
    // Direct [row, col] format
    if (indices[0] >= 0 && indices[0] < grid.length && indices[1] >= 0 && indices[1] < (grid[0]?.length || 0)) {
      highlightedCells.push({ row: indices[0], col: indices[1] })
    }
  } else if (indices.length > 0) {
    // Try flat array indices — assume they're [r1,c1,r2,c2,...]
    for (let i = 0; i + 1 < indices.length; i += 2) {
      if (indices[i] >= 0 && indices[i] < grid.length && indices[i+1] >= 0 && indices[i+1] < (grid[indices[i]]?.length || 0)) {
        highlightedCells.push({ row: indices[i], col: indices[i+1] })
      }
    }
  }

  const rows = grid.length
  const cols = grid[0]?.length || 0

  if (rows === 0 || cols === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-xs">
        Enter matrix data (e.g. [[1,2,3],[4,5,6],[7,8,9]])
      </div>
    )
  }

  function getCellColor(row, col) {
    const isHighlighted = highlightedCells.some(h => h.row === row && h.col === col)
    if (!isHighlighted) return 'bg-dark-700 border-dark-500 text-slate-300'

    if (type === STEP_TYPES.ARRAY_HIGHLIGHT) {
      return found !== false
        ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200'
        : 'bg-red-500/30 border-red-500 text-red-200'
    }
    if (type === STEP_TYPES.ARRAY_SWAP) return 'bg-yellow-500/30 border-yellow-500 text-yellow-200'
    if (type === STEP_TYPES.ARRAY_COMPARE) return 'bg-cyan-500/30 border-cyan-500 text-cyan-200'
    if (type === STEP_TYPES.ARRAY_POINTER) return 'bg-indigo-500/30 border-indigo-400 text-indigo-200'
    if (type === STEP_TYPES.ARRAY_SET) return 'bg-emerald-500/20 border-emerald-600 text-emerald-200'
    return 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Grid */}
      <div className="flex flex-col gap-1 overflow-x-auto pb-2 px-2">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1">
            {row.map((val, cIdx) => {
              const isHighlighted = highlightedCells.some(h => h.row === rIdx && h.col === cIdx)
              return (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isHighlighted ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2, delay: (rIdx * cols + cIdx) * 0.02 }}
                  className={clsx(
                    'flex items-center justify-center w-12 h-12 rounded-lg border-2 font-mono text-sm font-bold transition-all duration-300',
                    getCellColor(rIdx, cIdx)
                  )}
                >
                  {val}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Dimension label */}
      <div className="flex gap-3 text-[10px] text-slate-600 font-mono">
        <span>{rows} × {cols}</span>
        {step?.labels && step.labels.length > 0 && (
          <span className="text-slate-500">|</span>
        )}
        {step?.labels?.map((label, i) => (
          <span key={i} className="text-indigo-400">{label}</span>
        ))}
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
