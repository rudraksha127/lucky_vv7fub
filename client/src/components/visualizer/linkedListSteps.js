/**
 * linkedListSteps.js — Step generators for 26 Linked List patterns (IDs 171-196)
 */
import { STEP_TYPES } from './visualizersData'

function llStep(type, data) {
  return { type, ...data }
}

// ─── FAST & SLOW POINTER (171-176) ───────────────────────
export function generateDetectCycleSteps(arr) {
  const steps = []
  const a = Array.isArray(arr) ? arr : JSON.parse(arr || '[]')
  const n = a.length
  let slow = 0, fast = 0
  steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Start: slow=${slow}, fast=${fast}` }))
  let hasCycle = n >= 2
  if (hasCycle) {
    slow = 1; fast = 2
    steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Move: slow=${slow}, fast=${fast} (simulating cycle at end→middle)` }))
    while (slow !== fast && fast < n && fast >= 0) {
      slow = (slow + 1) % n
      fast = (fast + 2) % n
      steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Slow=${slow}, Fast=${fast}${slow === fast ? ' — COLLISION!' : ''}` }))
    }
    steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [slow], label: '✅ Cycle detected!' }))
  } else {
    steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: 'No cycle (linear list)' }))
  }
  return steps
}

export function generateFindMiddleLLSteps(arr) {
  const steps = []
  const a = Array.isArray(arr) ? arr : JSON.parse(arr || '[]')
  let slow = 0, fast = 0
  steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Start: slow=${slow}, fast=${fast}` }))
  while (fast + 1 < a.length) {
    slow++; fast += 2
    const label = fast >= a.length
      ? `Slow=${slow}, Fast=end → Middle=${slow} (value: ${a[slow]})`
      : `Slow=${slow}, Fast=${fast}`
    steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow], labels: ['S'], label }))
  }
  steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [slow], label: `✅ Middle = ${a[slow]} at index ${slow}` }))
  return steps
}

// ─── REVERSAL (177-180) ───────────────────────────────────
export function generateReverseEntireLLSteps(arr) {
  const steps = []
  const a = [...(Array.isArray(arr) ? arr : JSON.parse(arr || '[]'))]
  let prev = -1, curr = 0
  steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [curr], label: `Reverse: prev=None, curr=${a[curr]}` }))
  while (curr < a.length) {
    const next = curr + 1
    steps.push(llStep(STEP_TYPES.ARRAY_SWAP, { indices: [curr], label: `Point ${a[curr]} → ${prev >= 0 ? a[prev] : 'None'}` }))
    prev = curr
    curr = next
  }
  // Build reversed array
  const reversed = [...a].reverse()
  steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `✅ Reversed: [${reversed}]` }))
  return steps
}

export function generateReverseKGroupSteps(arr, k = 3) {
  const steps = []
  const a = [...(Array.isArray(arr) ? arr : JSON.parse(arr || '[]'))]
  const reversed = []
  for (let i = 0; i < a.length; i += k) {
    const group = a.slice(i, i + k)
    if (group.length === k) reversed.push(...group.reverse())
    else reversed.push(...group)
  }
  steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Reverse in groups of ${k}: [${reversed}]` }))
  return steps
}

// ─── MERGE SORTED LISTS (181-183) ─────────────────────────
export function generateMergeTwoSortedLLSteps(arr1, arr2) {
  const steps = []
  const a = Array.isArray(arr1) ? arr1 : JSON.parse(arr1 || '[]')
  const b = Array.isArray(arr2) ? arr2 : JSON.parse(arr2 || '[]')
  const result = []
  let i = 0, j = 0
  steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [i, j], labels: ['A', 'B'], label: `Merge [${a}] + [${b}]` }))
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i])
      steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Take ${a[i]} from A → result: [${result}]` }))
      i++
    } else {
      result.push(b[j])
      steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Take ${b[j]} from B → result: [${result}]` }))
      j++
    }
  }
  while (i < a.length) { result.push(a[i]); i++ }
  while (j < b.length) { result.push(b[j]); j++ }
  steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Merged: [${result}]` }))
  return steps
}

// ─── TWO POINTER ON LL (184-186) ─────────────────────────
export function generateNthFromEndSteps(arr, n = 2) {
  const steps = []
  const a = Array.isArray(arr) ? arr : JSON.parse(arr || '[]')
  let slow = 0, fast = n
  steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Fast ahead by ${n}: slow=${slow}, fast=${fast}` }))
  while (fast < a.length) {
    slow++; fast++
    steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [slow, fast], labels: ['S', 'F'], label: `Move: slow=${slow}, fast=${fast}` }))
  }
  steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [slow], label: `✅ ${n}th from end = ${a[slow]} at index ${slow}` }))
  return steps
}

// ─── PALINDROME LINKED LIST (175) ────────────────────────
export function generatePalindromeLLSteps(arr) {
  const steps = []
  const a = Array.isArray(arr) ? arr : JSON.parse(arr || '[]')
  let l = 0, r = a.length - 1
  while (l < r) {
    steps.push(llStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: ['L', 'R'], label: `Compare ${a[l]} vs ${a[r]}` }))
    if (a[l] !== a[r]) {
      steps.push(llStep(STEP_TYPES.ARRAY_COMPARE, { indices: [], label: '❌ Not palindrome' }))
      return steps
    }
    l++; r--
  }
  steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '✅ Palindrome linked list!' }))
  return steps
}

// ─── MERGE SORT ON LL (196) ──────────────────────────────
export function generateMergeSortLLSteps(arr) {
  const steps = []
  const a = [...(Array.isArray(arr) ? arr : JSON.parse(arr || '[]'))]
  function mergeSort(array) {
    if (array.length <= 1) return array
    const mid = Math.floor(array.length / 2)
    const left = mergeSort(array.slice(0, mid))
    const right = mergeSort(array.slice(mid))
    const merged = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++])
      else merged.push(right[j++])
    }
    merged.push(...left.slice(i), ...right.slice(j))
    steps.push(llStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Merge: [${left}] + [${right}] → [${merged}]` }))
    return merged
  }
  const result = mergeSort(a)
  steps.push(llStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Sorted: [${result}]` }))
  return steps
}
