/**
 * heapSteps.js — Step generators for 17 Heap / Priority Queue patterns (IDs 371-387)
 */
import { STEP_TYPES } from './visualizersData'

function hStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── KTH LARGEST USING MIN-HEAP ───────────────────────────
export function generateKthLargestMinHeapSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 3)
  const steps = [], heap = []
  for (const v of arr) {
    heap.push(v)
    heap.sort((a, b) => a - b)
    if (heap.length > K) heap.shift()
    steps.push(hStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Heap (size ≤${K}): [${heap}]${heap.length === K ? ` → ${K}th largest = ${heap[0]}` : ''}` }))
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${K}th largest = ${heap[0]}` }))
  return steps
}

// ─── K CLOSEST POINTS ──────────────────────────────────────
export function generateKClosestPointsSteps(points, k) {
  const pts = Array.isArray(points) ? points : JSON.parse(points || '[[1,3],[-2,2]]')
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 2)
  const steps = []
  const dists = pts.map(([x, y], i) => ({ i, d: x * x + y * y }))
  dists.sort((a, b) => a.d - b.d)
  for (let i = 0; i < K && i < dists.length; i++) {
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [dists[i].i], label: `Point [${pts[dists[i].i]}] dist²=${dists[i].d} selected` }))
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${K} closest: [${dists.slice(0, K).map(d => `[${pts[d.i]}]`).join(', ')}]` }))
  return steps
}

// ─── TOP K FREQUENT ────────────────────────────────────────
export function generateTopKFreqElementsSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 2)
  const steps = [], freq = {}
  for (const v of arr) freq[v] = (freq[v] || 0) + 1
  steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Freq: ${JSON.stringify(freq)}` }))
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(e => parseInt(e[0])).slice(0, K)
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Top ${K} frequent: [${sorted}]` }))
  return steps
}

// ─── MEDIAN FROM DATA STREAM ──────────────────────────────
export function generateMedianTwoHeapsSteps(nums) {
  const arr = parseArr(nums)
  const steps = [], maxHeap = [], minHeap = []
  for (const v of arr) {
    maxHeap.push(v)
    maxHeap.sort((a, b) => b - a)
    if (maxHeap.length > minHeap.length + 1) {
      minHeap.push(maxHeap.shift())
      minHeap.sort((a, b) => a - b)
    }
    if (minHeap.length && maxHeap[0] > minHeap[0]) {
      const t = maxHeap.shift()
      maxHeap.push(minHeap.shift())
      minHeap.push(t)
      maxHeap.sort((a, b) => b - a)
      minHeap.sort((a, b) => a - b)
    }
    const median = maxHeap.length > minHeap.length
      ? maxHeap[0]
      : (maxHeap[0] + minHeap[0]) / 2
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `After ${v}: max[${maxHeap}] min[${minHeap}] → median=${median}` }))
  }
  return steps
}

// ─── TASK SCHEDULER ────────────────────────────────────────
export function generateTaskSchedulerSteps(tasks, n) {
  const t = Array.isArray(tasks) ? tasks : JSON.parse(tasks || '["A","A","A","B","B","B"]')
  const N = n !== undefined ? parseInt(n) : (Array.isArray(n) ? n[0] : 2)
  const steps = [], freq = {}
  for (const task of t) freq[task] = (freq[task] || 0) + 1
  const counts = Object.values(freq).sort((a, b) => b - a)
  const maxFreq = counts[0]
  let idle = (maxFreq - 1) * N
  for (let i = 1; i < counts.length; i++) idle -= Math.min(counts[i], maxFreq - 1)
  const total = t.length + Math.max(0, idle)
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Tasks=${t.length}, idle=${Math.max(0, idle)} → total intervals=${total}` }))
  return steps
}
