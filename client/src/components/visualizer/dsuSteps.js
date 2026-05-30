/**
 * dsuSteps.js — Step generators for 14 DSU patterns (IDs 667-680)
 */
import { STEP_TYPES } from './visualizersData'

function dStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── DSU CORE ──────────────────────────────────────────────
export function generateDSUFindSteps(edges) {
  const arr = parseArr(edges)
  const nodes = new Set(arr.flat())
  const parent = {}, rank = {}
  for (const n of nodes) { parent[n] = n; rank[n] = 0 }
  const steps = []
  function find(x, path = []) {
    path.push(x)
    if (parent[x] !== x) {
      parent[x] = find(parent[x], path)
    }
    return parent[x]
  }
  function union(a, b) {
    const ra = find(a), rb = find(b)
    if (ra === rb) return false
    if (rank[ra] < rank[rb]) parent[ra] = rb
    else if (rank[ra] > rank[rb]) parent[rb] = ra
    else { parent[rb] = ra; rank[ra]++ }
    return true
  }
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Initial: each node its own parent [${[...nodes]}]` }))
  for (const [a, b] of arr) {
    union(a, b)
    const sets = {}
    for (const n of nodes) {
      const r = find(n)
      if (!sets[r]) sets[r] = []
      sets[r].push(n)
    }
    steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Union(${a},${b}): sets=${Object.values(sets).map(s => `[${s}]`).join(', ')}` }))
  }
  const components = new Set([...nodes].map(n => find(n))).size
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Connected components = ${components}` }))
  return steps
}

export function generateDSUComponentsSteps(edges) {
  return generateDSUFindSteps(edges)
}

// ─── CYCLE DETECTION ──────────────────────────────────────
export function generateCycleDSU2Steps(edges) {
  const arr = Array.isArray(edges) ? edges : JSON.parse(edges || '[[0,1],[1,2],[2,0]]')
  const nodes = new Set(arr.flat())
  const parent = {}
  for (const n of nodes) parent[n] = n
  const steps = []
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }
  function union(a, b) {
    const ra = find(a), rb = find(b)
    if (ra === rb) return false
    parent[ra] = rb; return true
  }
  for (const [a, b] of arr) {
    if (!union(a, b)) {
      steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Cycle detected at edge (${a},${b})` }))
      return steps
    }
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Added (${a},${b}): parent=${JSON.stringify(parent)}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '✅ No cycle detected' }))
  return steps
}

// ─── NUMBER OF PROVINCES ──────────────────────────────────
export function generateNumProvincesSteps(matrix) {
  const mat = Array.isArray(matrix) ? matrix : JSON.parse(matrix || '[[1,1,0],[1,1,0],[0,0,1]]')
  const n = mat.length
  const parent = Array.from({length: n}, (_, i) => i)
  const steps = []
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }
  function union(a, b) {
    const ra = find(a), rb = find(b)
    if (ra !== rb) parent[ra] = rb
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (mat[i][j] === 1) union(i, j)
    }
  }
  const provinces = new Set(Array.from({length: n}, (_, i) => find(i))).size
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Number of provinces = ${provinces}` }))
  return steps
}
