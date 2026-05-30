import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Plus, Minus, ArrowDown, ArrowUp } from 'lucide-react'

/**
 * Stack & Queue Visualizer — interactive push/pop/enqueue/dequeue with animations.
 */
export default function StackQueueVisualizer({ items: initialItems = [], mode = 'stack', step }) {
  const [items, setItems] = useState(initialItems)
  const [inputVal, setInputVal] = useState('')
  const [lastOp, setLastOp] = useState(null)
  const isStack = mode === 'stack'

  function handlePush() {
    const val = parseInt(inputVal)
    if (isNaN(val)) return
    setItems(prev => isStack ? [...prev, val] : [val, ...prev])
    setLastOp({ type: isStack ? 'push' : 'enqueue', value: val })
    setInputVal('')
  }

  function handlePop() {
    if (items.length === 0) return
    const val = isStack ? items[items.length - 1] : items[0]
    setItems(prev => isStack ? prev.slice(0, -1) : prev.slice(1))
    setLastOp({ type: isStack ? 'pop' : 'dequeue', value: val })
  }

  function handleResetDemo() {
    setItems(isStack ? [10, 20, 30, 40, 50] : [10, 20, 30, 40, 50])
    setLastOp(null)
    setInputVal('')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {isStack ? 'Stack' : 'Queue'}
        </span>
        <span className={clsx(
          'text-[10px] font-mono px-1.5 py-0.5 rounded',
          isStack ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'
        )}>
          {isStack ? 'LIFO' : 'FIFO'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          placeholder="Value"
          className="w-20 rounded-md border border-dark-600 bg-dark-700 px-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
        />
        <button
          onClick={handlePush}
          className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Plus className="w-3 h-3" />
          {isStack ? 'Push' : 'Enqueue'}
        </button>
        <button
          onClick={handlePop}
          disabled={items.length === 0}
          className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3 h-3" />
          {isStack ? 'Pop' : 'Dequeue'}
        </button>
        <button
          onClick={handleResetDemo}
          className="rounded-md bg-dark-700 px-2 py-1.5 text-xs text-slate-400 hover:text-white border border-dark-500 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Container */}
      <div className={clsx(
        'relative flex',
        isStack ? 'flex-col-reverse items-center' : 'flex-row items-center',
        'bg-dark-700 rounded-lg border border-dark-500 p-2 min-h-[120px] min-w-[120px]'
      )}>
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => {
            const isTop = isStack ? idx === items.length - 1 : idx === 0

            return (
              <motion.div
                key={`${item}-${idx}`}
                layout
                initial={lastOp && (lastOp.type === 'push' || lastOp.type === 'enqueue') && isTop
                  ? { scale: 0, opacity: 0, y: isStack ? -20 : 0, x: isStack ? 0 : 20 }
                  : { scale: 1, opacity: 1 }
                }
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }}
                exit={
                  isTop && lastOp && (lastOp.type === 'pop' || lastOp.type === 'dequeue')
                    ? { scale: 0, opacity: 0, y: isStack ? 20 : 0, x: isStack ? 0 : -20 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={clsx(
                  'flex items-center justify-center rounded-md border font-mono text-sm font-bold',
                  isStack
                    ? 'w-16 h-10 mb-1 border-indigo-500/30 bg-indigo-500/10 text-slate-200'
                    : 'w-12 h-12 mx-1 border-cyan-500/30 bg-cyan-500/10 text-slate-200',
                  isTop && 'ring-1 ring-primary-500/50'
                )}
              >
                {item}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex items-center justify-center w-full h-20 text-slate-600 text-xs">
            {isStack ? 'Stack is empty' : 'Queue is empty'}
          </div>
        )}
      </div>

      {/* Last operation indicator */}
      {lastOp && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {(lastOp.type === 'push' || lastOp.type === 'enqueue') && <ArrowUp className="w-3 h-3 text-emerald-400" />}
          {(lastOp.type === 'pop' || lastOp.type === 'dequeue') && <ArrowDown className="w-3 h-3 text-red-400" />}
          <span className="capitalize">{lastOp.type}</span>
          <span className="font-mono font-bold text-indigo-400">{lastOp.value}</span>
        </div>
      )}
    </div>
  )
}
