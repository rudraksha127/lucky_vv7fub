/**
 * miscSteps.js — Step generators for 21 Miscellaneous patterns (IDs 718-738)
 */
import { STEP_TYPES } from './visualizersData'

function mStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── BIDIRECTIONAL BFS ─────────────────────────────────────
export function generateBidirectionalBFSSteps(adjList) {
  const adj = typeof adjList === 'string' ? JSON.parse(adjList) : adjList
  const steps = []
  const start = 'start', end = 'goal'
  const qStart = [start], qEnd = [end]
  const visitedStart = new Set([start]), visitedEnd = new Set([end])
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Bidirectional BFS: start=${start}, goal=${end}` }))
  while (qStart.length && qEnd.length) {
    const s = qStart.shift()
    for (const nb of (adj[s] || [])) {
      if (!visitedStart.has(nb)) {
        visitedStart.add(nb); qStart.push(nb)
        if (visitedEnd.has(nb)) {
          steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Met at ${nb}!` }))
          return steps
        }
      }
    }
    const e = qEnd.shift()
    for (const nb of (adj[e] || [])) {
      if (!visitedEnd.has(nb)) {
        visitedEnd.add(nb); qEnd.push(nb)
        if (visitedStart.has(nb)) {
          steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Met at ${nb}!` }))
          return steps
        }
      }
    }
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '❌ No path found' }))
  return steps
}

// ─── RESERVOIR SAMPLING ────────────────────────────────────
export function generateReservoirSampleStreamSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k || 1
  const steps = []
  const reservoir = []
  for (let i = 0; i < K && i < arr.length; i++) reservoir.push(arr[i])
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Initial reservoir: [${reservoir}]` }))
  for (let i = K; i < arr.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    if (j < K) reservoir[j] = arr[i]
    steps.push(mStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Stream[${i}]=${arr[i]}, rand=${j}${j < K ? ` → replace reservoir[${j}]` : ' → skip'}, reservoir: [${reservoir}]` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Final sample: [${reservoir}]` }))
  return steps
}

// ─── FISHER-YATES SHUFFLE ──────────────────────────────────
export function generateFisherYatesShuffleSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Before: [${arr}]` }))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
    steps.push(mStep(STEP_TYPES.ARRAY_SWAP, { indices: [i, j], label: `Swap [${i}]↔[${j}], array: [${arr}]` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Shuffled: [${arr}]` }))
  return steps
}

// ─── K-WAY MERGE ────────────────────────────────────────────
export function generateMergeKSortedArraysSteps(arrays) {
  const arrs = Array.isArray(arrays) ? arrays : JSON.parse(arrays || '[[1,4,7],[2,5,8],[3,6,9]]')
  const steps = []
  const result = []
  const indices = new Array(arrs.length).fill(0)
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `K-way merge of ${arrs.length} arrays` }))
  while (true) {
    let minVal = Infinity, minIdx = -1
    for (let i = 0; i < arrs.length; i++) {
      if (indices[i] < arrs[i].length && arrs[i][indices[i]] < minVal) {
        minVal = arrs[i][indices[i]]
        minIdx = i
      }
    }
    if (minIdx === -1) break
    result.push(minVal)
    indices[minIdx]++
    steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Pick ${minVal} from array ${minIdx}, result: [${result}]` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Merged: [${result}]` }))
  return steps
}

// ─── EVENT-BASED ──────────────────────────────────────────
export function generateCoordEventsSteps(intervals) {
  const arr = parseArr(intervals)
  const events = []
  for (const [s, e] of arr) { events.push([s, 1]); events.push([e, -1]) }
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])
  let maxCount = 0, curr = 0
  const steps = []
  for (const [t, type] of events) {
    curr += type
    maxCount = Math.max(maxCount, curr)
    steps.push(mStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `At ${t}: ${type > 0 ? 'start' : 'end'}, active=${curr}, max=${maxCount}` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max overlapping = ${maxCount}` }))
  return steps
}
