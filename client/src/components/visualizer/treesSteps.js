/**
 * treesSteps.js — Step generators for 67 Tree patterns.
 * Each generator returns visualization steps compatible with TreeVisualizer.
 */
import { STEP_TYPES } from './visualizersData'

// ─── Tree helpers ──────────────────────────────────────────
function treeStep(type, { node, label, depth, nodes }) {
  return { type, node, label, depth, ...(nodes ? { nodes } : {}) }
}

// Build binary tree from level-order array
function buildTree(arr) {
  if (!arr || !arr.length) return null
  const root = { value: arr[0], left: null, right: null }
  const queue = [root]
  let i = 1
  while (i < arr.length) {
    const curr = queue.shift()
    if (arr[i] !== null && arr[i] !== undefined) {
      curr.left = { value: arr[i], left: null, right: null }
      queue.push(curr.left)
    }
    i++
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      curr.right = { value: arr[i], left: null, right: null }
      queue.push(curr.right)
    }
    i++
  }
  return root
}

// ─── DFS TRAVERSALS (304-309) ────────────────────────────
function generateTraversalSteps(arr, order) {
  const steps = []
  const root = typeof arr === 'string' ? buildTree(JSON.parse(arr)) : buildTree(arr)
  function traverse(node) {
    if (!node) return
    if (order === 'preorder') steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Preorder visit ${node.value}` }))
    if (node.left) traverse(node.left)
    if (order === 'inorder') steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Inorder visit ${node.value}` }))
    if (node.right) traverse(node.right)
    if (order === 'postorder') steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Postorder visit ${node.value}` }))
  }
  if (root) traverse(root)
  return steps
}

export function generateInorderSteps(arr) { return generateTraversalSteps(arr, 'inorder') }
export function generatePreorderSteps(arr) { return generateTraversalSteps(arr, 'preorder') }
export function generatePostorderSteps(arr) { return generateTraversalSteps(arr, 'postorder') }

// ─── LEVEL ORDER (310-315) ──────────────────────────────
export function generateLevelOrderSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [root]
  let level = 0
  while (queue.length) {
    const size = queue.length
    const levelVals = []
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      levelVals.push(node.value)
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Level ${level}: visit ${node.value}` }))
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    level++
  }
  return steps
}

export function generateZigzagLevelOrderSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [root]
  let leftToRight = true, level = 0
  while (queue.length) {
    const size = queue.length
    const levelVals = []
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      levelVals.push(node.value)
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Level ${level} (${leftToRight ? 'L→R' : 'R→L'}): ${node.value}` }))
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    leftToRight = !leftToRight
    level++
  }
  return steps
}

export function generateRightSideViewSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [root]
  while (queue.length) {
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      if (i === size - 1) steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Right view: ${node.value}` }))
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  return steps
}

// ─── HEIGHT / DIAMETER (318-321) ─────────────────────────
export function generateHeightSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  function height(node) {
    if (!node) return 0
    const l = height(node.left)
    const r = height(node.right)
    const h = Math.max(l, r) + 1
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Node ${node.value}: left=${l}, right=${r}, height=${h}`, depth: h }))
    return h
  }
  height(root)
  return steps
}

export function generateDiameterSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  let diam = 0
  function dfs(node) {
    if (!node) return 0
    const l = dfs(node.left)
    const r = dfs(node.right)
    diam = Math.max(diam, l + r)
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Node ${node.value}: leftH=${l}, rightH=${r}, diam=${diam}` }))
    return Math.max(l, r) + 1
  }
  dfs(root)
  return steps
}

// ─── LCA (322-326) ───────────────────────────────────────
export function generateLCASteps(arr, p = 5, q = 1) {
  const steps = []
  const root = buildTree(arr)
  function dfs(node) {
    if (!node) return null
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Visiting ${node.value}` }))
    if (node.value === p || node.value === q) { steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Found ${node.value}!` })); return node }
    const l = dfs(node.left)
    const r = dfs(node.right)
    if (l && r) { steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `LCA = ${node.value}` })); return node }
    return l || r
  }
  dfs(root)
  return steps
}

// ─── PATH SUM (327-330) ─────────────────────────────────
export function generatePathSumSteps(arr, target = 22) {
  const steps = []
  const root = buildTree(arr)
  function dfs(node, sum) {
    if (!node) return false
    const newSum = sum + node.value
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Node ${node.value}: sum=${newSum} (target=${target})` }))
    if (!node.left && !node.right && newSum === target)
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `✅ Found path sum ${target} at leaf ${node.value}!` }))
    return dfs(node.left, newSum) || dfs(node.right, newSum)
  }
  dfs(root, 0)
  return steps
}

// ─── BST INSERT (342-345) ───────────────────────────────
export function generateBSTInsertSteps(arr, val = 5) {
  const steps = []
  const root = buildTree(arr)
  function insert(node, v) {
    if (!node) return { value: v, left: null, right: null }
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Compare ${v} vs ${node.value}` }))
    if (v < node.value) node.left = insert(node.left, v)
    else node.right = insert(node.right, v)
    return node
  }
  insert(root, val)
  steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: val, label: `✅ Inserted ${val}` }))
  return steps
}

export function generateBSTSearchSteps(arr, target = 5) {
  const steps = []
  const root = buildTree(arr)
  function search(node, val) {
    if (!node) { steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: val, label: `❌ ${val} not found` })); return null }
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Searching ${val}: at ${node.value}` }))
    if (node.value === val) { steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: val, label: `✅ Found ${val}!` })); return node }
    return val < node.value ? search(node.left, val) : search(node.right, val)
  }
  search(root, target)
  return steps
}

// ─── VALIDATE BST (346-347) ─────────────────────────────
export function generateValidateBSTMinMaxSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  function isValid(node, min, max) {
    if (!node) return true
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Check ${node.value}: min=${min}, max=${max}` }))
    if (node.value <= min || node.value >= max) {
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `❌ ${node.value} violates [${min},${max}}]` }))
      return false
    }
    return isValid(node.left, min, node.value) && isValid(node.right, node.value, max)
  }
  isValid(root, -Infinity, Infinity)
  return steps
}

// ─── TREE VIEWS (337-341) ───────────────────────────────
export function generateTopViewSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [{ node: root, hd: 0 }]
  const map = new Map()
  while (queue.length) {
    const { node, hd } = queue.shift()
    if (!map.has(hd)) {
      map.set(hd, node.value)
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: node.value, label: `Top view at HD=${hd}: ${node.value}` }))
    }
    if (node.left) queue.push({ node: node.left, hd: hd - 1 })
    if (node.right) queue.push({ node: node.right, hd: hd + 1 })
  }
  return steps
}

export function generateBottomViewSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [{ node: root, hd: 0 }]
  const map = new Map()
  while (queue.length) {
    const { node, hd } = queue.shift()
    map.set(hd, node.value)
    if (node.left) queue.push({ node: node.left, hd: hd - 1 })
    if (node.right) queue.push({ node: node.right, hd: hd + 1 })
  }
  for (const [hd, val] of map) {
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: val, label: `Bottom view at HD=${hd}: ${val}` }))
  }
  return steps
}

export function generateVerticalOrderSteps(arr) {
  const steps = []
  const root = buildTree(arr)
  if (!root) return steps
  const queue = [{ node: root, hd: 0 }]
  const map = new Map()
  while (queue.length) {
    const { node, hd } = queue.shift()
    if (!map.has(hd)) map.set(hd, [])
    map.get(hd).push(node.value)
    if (node.left) queue.push({ node: node.left, hd: hd - 1 })
    if (node.right) queue.push({ node: node.right, hd: hd + 1 })
  }
  const sorted = [...map.entries()].sort((a, b) => a[0] - b[0])
  for (const [hd, vals] of sorted) {
    vals.forEach(v => steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: v, label: `Vertical HD=${hd}: ${v}` })))
  }
  return steps
}

// ─── SEGMENT TREE (358-362) ─────────────────────────────
export function generateBuildSegmentTreeSteps(arr) {
  const steps = []
  const a = Array.isArray(arr) ? arr : JSON.parse(arr)
  const n = a.length
  const tree = new Array(4 * n)
  function build(node, l, r) {
    if (l === r) {
      tree[node] = a[l]
      steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: tree[node], label: `Leaf [${l}]: ${tree[node]}` }))
      return
    }
    const mid = Math.floor((l + r) / 2)
    build(node * 2, l, mid)
    build(node * 2 + 1, mid + 1, r)
    tree[node] = tree[node * 2] + tree[node * 2 + 1]
    steps.push(treeStep(STEP_TYPES.TREE_VISIT, { node: tree[node], label: `Node [${l},${r}]: sum = ${tree[node]}` }))
  }
  build(1, 0, n - 1)
  return steps
}
