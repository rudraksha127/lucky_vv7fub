import { motion } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * Graph Visualizer — renders nodes and edges, animates BFS/DFS traversals.
 * Uses single step data from the parent VisualizationPanel's playback controls.
 */
export default function GraphVisualizer({ adjList, steps: traversalSteps, currentStep }) {
  const steps = traversalSteps || []

  // Compute node positions using a simple circular layout
  const nodeKeys = Object.keys(adjList)
  const centerX = 250
  const centerY = 200
  const radius = 140

  const nodePositions = {}
  nodeKeys.forEach((node, idx) => {
    const angle = (2 * Math.PI * idx) / nodeKeys.length - Math.PI / 2
    nodePositions[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  // Compute visited nodes and traversed edges up to current step
  const visitedNodes = new Set()
  const traversedEdges = new Set()
  let currentNode = null
  let currentLabel = ''

  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const s = steps[i]
    if (s.type === STEP_TYPES.GRAPH_VISIT_NODE) {
      visitedNodes.add(s.node)
      currentNode = s.node
      currentLabel = s.label || ''
    }
    if (s.type === STEP_TYPES.GRAPH_TRAVERSE) {
      traversedEdges.add(`${s.from}-${s.to}`)
    }
  }

  const svgWidth = 500
  const svgHeight = 400

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Step Label */}
      {currentLabel && (
        <p className="text-xs text-slate-500 font-medium">{currentLabel}</p>
      )}

      {/* SVG Canvas */}
      <svg width={svgWidth} height={svgHeight} className="overflow-visible">
        {/* Edges */}
        {nodeKeys.map((from) => {
          const neighbors = adjList[from] || []
          return neighbors.map((to) => {
            if (!nodePositions[from] || !nodePositions[to]) return null
            const { x: x1, y: y1 } = nodePositions[from]
            const { x: x2, y: y2 } = nodePositions[to]
            const isTraversed = traversedEdges.has(`${from}-${to}`) || traversedEdges.has(`${to}-${from}`)

            return (
              <motion.line
                key={`${from}-${to}`}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke={isTraversed ? '#818cf8' : '#334155'}
                strokeWidth={isTraversed ? 2.5 : 1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            )
          })
        })}

        {/* Nodes */}
        {nodeKeys.map((node) => {
          const pos = nodePositions[node]
          if (!pos) return null
          const isVisited = visitedNodes.has(node)
          const isCurrent = currentNode === node

          return (
            <g key={node}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="24"
                initial={{ scale: 0 }}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  fill: isVisited ? (isCurrent ? '#6366f1' : '#4f46e5') : '#1e293b',
                  stroke: isCurrent ? '#a5b4fc' : isVisited ? '#6366f1' : '#334155',
                  strokeWidth: isCurrent ? 3 : 2,
                }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className={clsx('text-sm font-mono font-bold', isVisited ? 'fill-white' : 'fill-slate-300')}
              >
                {node}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
