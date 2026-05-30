import { motion } from 'framer-motion'
import clsx from 'clsx'
import { STEP_TYPES } from './visualizersData'

/**
 * Tree / BST Visualizer — renders nodes with connecting lines, highlights visited nodes.
 */
export default function TreeVisualizer({ root, step }) {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Enter tree data to visualize
      </div>
    )
  }

  const visitedValue = step?.node

  // Calculate tree dimensions
  function getDepth(node) {
    if (!node) return 0
    return 1 + Math.max(getDepth(node.left), getDepth(node.right))
  }
  const depth = getDepth(root)
  const svgWidth = Math.max(600, depth * 200)
  const startX = svgWidth / 2

  // Layout nodes with x, y positions
  function layoutTree(node, x, y, spread) {
    if (!node) return null
    return {
      ...node,
      x,
      y,
      leftNode: layoutTree(node.left, x - spread, y + 80, spread / 1.8),
      rightNode: layoutTree(node.right, x + spread, y + 80, spread / 1.8),
    }
  }

  const layouted = layoutTree(root, startX, 40, 160)

  // Collect edges and nodes
  function flatten(node, edges = [], nodes = []) {
    if (!node) return { edges, nodes }
    nodes.push(node)
    if (node.leftNode) {
      edges.push({ x1: node.x, y1: node.y, x2: node.leftNode.x, y2: node.leftNode.y })
      flatten(node.leftNode, edges, nodes)
    }
    if (node.rightNode) {
      edges.push({ x1: node.x, y1: node.y, x2: node.rightNode.x, y2: node.rightNode.y })
      flatten(node.rightNode, edges, nodes)
    }
    return { edges, nodes }
  }

  const { edges, nodes } = flatten(layouted)
  const svgHeight = depth * 80 + 100

  return (
    <div className="flex flex-col items-center">
      {/* Step label */}
      {step?.label && (
        <p className="text-xs text-slate-500 font-medium mb-3">{step.label}</p>
      )}

      {/* SVG Tree */}
      <svg width={svgWidth} height={svgHeight} className="overflow-visible">
        {/* Edges */}
        {edges.map((e, i) => (
          <motion.line
            key={i}
            x1={e.x1} y1={e.y1}
            x2={e.x2} y2={e.y2}
            stroke="#334155"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedValue === node.value
          return (
            <g key={`${node.value}-${node.x}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="22"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  fill: isVisited ? '#6366f1' : '#1e293b',
                  stroke: isVisited ? '#818cf8' : '#334155',
                  strokeWidth: 2,
                }}
                transition={{ duration: 0.3 }}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className={clsx('text-xs font-mono font-bold', isVisited ? 'fill-white' : 'fill-slate-300')}
              >
                {node.value}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Traversal info */}
      <p className="text-[10px] text-slate-500 mt-2">
        {step?.type === STEP_TYPES.TREE_VISIT ? `Visited: ${step.node}` : ''}
      </p>
    </div>
  )
}
