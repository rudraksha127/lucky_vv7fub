/**
 * Shared types, step generators, and parsing helpers for algorithm visualizers.
 */

// ─── Step Types ────────────────────────────────────────────

export const STEP_TYPES = {
  // Array operations
  ARRAY_COMPARE:    'array_compare',
  ARRAY_SWAP:       'array_swap',
  ARRAY_SET:        'array_set',
  ARRAY_POINTER:    'array_pointer',
  ARRAY_HIGHLIGHT:  'array_highlight',

  // Tree operations
  TREE_VISIT:       'tree_visit',
  TREE_BACKTRACK:   'tree_backtrack',

  // Graph operations
  GRAPH_VISIT_NODE: 'graph_visit_node',
  GRAPH_TRAVERSE:   'graph_traverse_edge',

  // Stack/Queue
  STACK_PUSH:       'stack_push',
  STACK_POP:        'stack_pop',
  QUEUE_ENQUEUE:    'queue_enqueue',
  QUEUE_DEQUEUE:    'queue_dequeue',

  // Recursion
  RECURSE_CALL:     'recurse_call',
  RECURSE_RETURN:   'recurse_return',
}

// ─── Manual Step Generators ─────────────────────────────────

/**
 * Generate visualization steps for common array algorithms.
 */
export function generateArraySortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({ type: STEP_TYPES.ARRAY_POINTER, indices: [i], label: `i = ${i}` })
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: STEP_TYPES.ARRAY_COMPARE, indices: [minIdx, j], label: `Compare ${a[minIdx]} vs ${a[j]}` })
      if (a[j] < a[minIdx]) {
        minIdx = j
        steps.push({ type: STEP_TYPES.ARRAY_POINTER, indices: [minIdx], label: `New min at ${minIdx}` })
      }
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      steps.push({ type: STEP_TYPES.ARRAY_SWAP, indices: [i, minIdx], label: `Swap ${a[i]} ↔ ${a[minIdx]}`, array: [...a] })
    }
  }

  return steps
}

/**
 * Generate steps for binary search.
 */
export function generateBinarySearchSteps(arr, target) {
  const steps = []
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({
      type: STEP_TYPES.ARRAY_POINTER,
      indices: [left, right, mid],
      labels: [`L=${left}`, `R=${right}`, `M=${mid}`],
      highlighted: [mid],
    })
    steps.push({
      type: STEP_TYPES.ARRAY_COMPARE,
      indices: [mid],
      label: `${arr[mid]} vs target ${target}`,
    })
    if (arr[mid] === target) {
      steps.push({ type: STEP_TYPES.ARRAY_HIGHLIGHT, indices: [mid], label: `Found at ${mid}!`, found: true })
      return steps
    }
    if (arr[mid] < target) left = mid + 1
    else right = mid - 1
  }
  steps.push({ type: STEP_TYPES.ARRAY_HIGHLIGHT, indices: [], label: 'Not found', found: false })
  return steps
}

/**
 * Generate BFS steps for a graph (adjacency list).
 */
export function generateBFSSteps(adjList, startNode) {
  const steps = []
  const visited = new Set()
  const queue = [startNode]
  visited.add(startNode)

  steps.push({ type: STEP_TYPES.GRAPH_VISIT_NODE, node: startNode, label: `Start BFS from ${startNode}` })

  while (queue.length > 0) {
    const node = queue.shift()
    const neighbors = adjList[node] || []
    steps.push({ type: STEP_TYPES.GRAPH_VISIT_NODE, node, label: `Visit node ${node}` })

    for (const neighbor of neighbors) {
      steps.push({ type: STEP_TYPES.GRAPH_TRAVERSE, from: node, to: neighbor, label: `Edge ${node} → ${neighbor}` })
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({ type: STEP_TYPES.GRAPH_VISIT_NODE, node: neighbor, label: `Queue node ${neighbor}`, queued: true })
      }
    }
  }

  return steps
}

/**
 * Generate DFS steps for a graph (adjacency list).
 */
export function generateDFSSteps(adjList, startNode) {
  const steps = []
  const visited = new Set()

  function dfs(node) {
    if (visited.has(node)) return
    visited.add(node)
    steps.push({ type: STEP_TYPES.GRAPH_VISIT_NODE, node, label: `Visit node ${node}` })
    const neighbors = adjList[node] || []
    for (const neighbor of neighbors) {
      steps.push({ type: STEP_TYPES.GRAPH_TRAVERSE, from: node, to: neighbor, label: `Explore ${node} → ${neighbor}` })
      dfs(neighbor)
    }
  }

  steps.push({ type: STEP_TYPES.GRAPH_VISIT_NODE, node: startNode, label: `Start DFS from ${startNode}` })
  dfs(startNode)
  return steps
}

/**
 * Generate steps for tree traversals (inorder/preorder/postorder).
 */
export function generateTreeTraversalSteps(tree, type = 'inorder') {
  const steps = []

  function traverse(node) {
    if (!node) return
    if (type === 'preorder') {
      steps.push({ type: STEP_TYPES.TREE_VISIT, node: node.value, label: `Visit ${node.value}` })
    }
    if (node.left) traverse(node.left)
    if (type === 'inorder') {
      steps.push({ type: STEP_TYPES.TREE_VISIT, node: node.value, label: `Visit ${node.value}` })
    }
    if (node.right) traverse(node.right)
    if (type === 'postorder') {
      steps.push({ type: STEP_TYPES.TREE_VISIT, node: node.value, label: `Visit ${node.value}` })
    }
  }

  if (tree) traverse(tree)
  return steps
}

/**
 * Generate steps for factorial recursion (example).
 */
export function generateRecursionSteps(n) {
  const steps = []

  function fact(x, depth = 0) {
    steps.push({
      type: STEP_TYPES.RECURSE_CALL,
      label: `fact(${x})`,
      params: { n: x },
      depth,
    })
    if (x <= 1) {
      steps.push({
        type: STEP_TYPES.RECURSE_RETURN,
        label: `fact(${x}) = 1`,
        result: 1,
        depth,
      })
      return 1
    }
    const result = x * fact(x - 1, depth + 1)
    steps.push({
      type: STEP_TYPES.RECURSE_RETURN,
      label: `fact(${x}) = ${x} × ${x > 1 ? `fact(${x-1})` : '1'} = ${result}`,
      result,
      depth,
    })
    return result
  }

  fact(n)
  return steps
}

/**
 * Parse numeric input string into an array.
 */
export function parseArrayInput(input) {
  if (!input) return []
  try {
    return JSON.parse(input).map(Number).filter(n => !isNaN(n))
  } catch {
    return input.split(/[,\s]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n))
  }
}

/**
 * Parse adjacency list from a simple format: "1:2,3;2:4;3:5;4:;5:"
 * Means: node 1 → [2, 3], node 2 → [4], etc.
 */
export function parseAdjList(input) {
  if (!input) return {}
  try {
    return JSON.parse(input)
  } catch {
    const adjList = {}
    input.split(';').forEach(part => {
      const [node, neighbors] = part.split(':')
      if (node) adjList[node.trim()] = (neighbors || '').split(',').map(n => n.trim()).filter(Boolean)
    })
    return adjList
  }
}

/**
 * Parse tree from array format [3,9,20,null,null,15,7] (level order).
 */
export function parseTreeInput(arr) {
  if (!arr || !arr.length) return null
  const values = typeof arr === 'string' ? JSON.parse(arr) : arr
  if (!values.length) return null

  const root = { value: values[0], left: null, right: null }
  const queue = [root]
  let i = 1

  while (i < values.length) {
    const current = queue.shift()
    if (values[i] !== null && values[i] !== undefined) {
      current.left = { value: values[i], left: null, right: null }
      queue.push(current.left)
    }
    i++
    if (i < values.length && values[i] !== null && values[i] !== undefined) {
      current.right = { value: values[i], left: null, right: null }
      queue.push(current.right)
    }
    i++
  }

  return root
}
