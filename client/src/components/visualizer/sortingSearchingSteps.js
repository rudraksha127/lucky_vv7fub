/**
 * sortingSearchingSteps.js — Step generators for 32 Sorting & Searching patterns (IDs 252-283)
 */
import { STEP_TYPES } from './visualizersData'

function ssStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── BINARY SEARCH CLASSIC (252-258) ──────────────────────
export function generateStdBinarySearchSteps(nums, target) {
  const arr = parseArr(nums)
  const t = target !== undefined ? parseInt(target) : (Array.isArray(nums) ? nums[0] : 5)
  const steps = []
  let left = 0, right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [left, right, mid], labels: [`L=${left}`, `R=${right}`, `M=${mid}`], label: `Search ${t}: arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] === t) {
      steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [mid], label: `✅ Found ${t} at index ${mid}!` }))
      return steps
    }
    if (arr[mid] < t) left = mid + 1
    else right = mid - 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `❌ ${t} not found` }))
  return steps
}

export function generateFirstOccurrenceSteps(nums, target) {
  const arr = parseArr(nums), t = target !== undefined ? parseInt(target) : 2
  const steps = []
  let left = 0, right = arr.length - 1, result = -1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [left, mid, right], labels: ['L','M','R'], label: `arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] === t) { result = mid; right = mid - 1; steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [mid], label: `Found at ${mid}, search left for first` })) }
    else if (arr[mid] < t) left = mid + 1
    else right = mid - 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: result >= 0 ? [result] : [], label: result >= 0 ? `First occurrence of ${t} = ${result}` : `${t} not found` }))
  return steps
}

export function generateLastOccurrenceSteps(nums, target) {
  const arr = parseArr(nums), t = target !== undefined ? parseInt(target) : 2
  const steps = []
  let left = 0, right = arr.length - 1, result = -1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [left, mid, right], labels: ['L','M','R'], label: `arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] === t) { result = mid; left = mid + 1; steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [mid], label: `Found at ${mid}, search right for last` })) }
    else if (arr[mid] < t) left = mid + 1
    else right = mid - 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: result >= 0 ? [result] : [], label: result >= 0 ? `Last occurrence of ${t} = ${result}` : `${t} not found` }))
  return steps
}

export function generateFindPeakElementSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  let left = 0, right = arr.length - 1
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [mid], label: `arr[${mid}]=${arr[mid]} vs arr[${mid+1}]=${arr[mid+1]}` }))
    if (arr[mid] > arr[mid + 1]) right = mid
    else left = mid + 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [left], label: `✅ Peak element = ${arr[left]} at index ${left}` }))
  return steps
}

// ─── SEARCH IN ROTATED (259-261) ──────────────────────────
export function generateSearchRotatedSteps(nums, target) {
  const arr = parseArr(nums), t = target !== undefined ? parseInt(target) : 0
  const steps = []
  let left = 0, right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [left, mid, right], labels: ['L','M','R'], label: `Rotated search: arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] === t) {
      steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [mid], label: `✅ Found ${t} at ${mid}` }))
      return steps
    }
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= t && t < arr[mid]) right = mid - 1
      else left = mid + 1
    } else {
      if (arr[mid] < t && t <= arr[right]) left = mid + 1
      else right = mid - 1
    }
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `❌ ${t} not found` }))
  return steps
}

export function generateMinRotatedSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  let left = 0, right = arr.length - 1
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [left, mid, right], labels: ['L','M','R'], label: `Min search: arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] > arr[right]) left = mid + 1
    else right = mid
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [left], label: `✅ Minimum = ${arr[left]} at index ${left}` }))
  return steps
}

// ─── LOWER / UPPER BOUND (262-264) ────────────────────────
export function generateLowerBoundSteps(nums, target) {
  const arr = parseArr(nums), t = target !== undefined ? parseInt(target) : 5
  const steps = []
  let left = 0, right = arr.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [mid], label: `Lower bound of ${t}: arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] >= t) right = mid
    else left = mid + 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: left < arr.length ? [left] : [], label: `Lower bound (first ≥ ${t}) = ${left}${left < arr.length ? ` (value ${arr[left]})` : ' (end)'}` }))
  return steps
}

export function generateUpperBoundSteps(nums, target) {
  const arr = parseArr(nums), t = target !== undefined ? parseInt(target) : 5
  const steps = []
  let left = 0, right = arr.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [mid], label: `Upper bound of ${t}: arr[${mid}]=${arr[mid]}` }))
    if (arr[mid] > t) right = mid
    else left = mid + 1
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: left < arr.length ? [left] : [], label: `Upper bound (first > ${t}) = ${left}${left < arr.length ? ` (value ${arr[left]})` : ' (end)'}` }))
  return steps
}

// ─── MERGE SORT (268-270) ──────────────────────────────────
export function generateMergeSort2Steps(nums) {
  const arr = parseArr(nums)
  const steps = []
  function mergeSort(array, depth = 0) {
    if (array.length <= 1) return array
    const mid = Math.floor(array.length / 2)
    const left = mergeSort(array.slice(0, mid), depth + 1)
    const right = mergeSort(array.slice(mid), depth + 1)
    const merged = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++])
      else merged.push(right[j++])
    }
    merged.push(...left.slice(i), ...right.slice(j))
    steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Merge: [${left}] + [${right}] → [${merged}]` }))
    return merged
  }
  const result = mergeSort(arr)
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Sorted: [${result}]` }))
  return steps
}

export function generateCountInversionsSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  let count = 0
  function mergeSort(array) {
    if (array.length <= 1) return array
    const mid = Math.floor(array.length / 2)
    const left = mergeSort(array.slice(0, mid))
    const right = mergeSort(array.slice(mid))
    const merged = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++])
      else { merged.push(right[j++]); count += left.length - i }
    }
    merged.push(...left.slice(i), ...right.slice(j))
    steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Inversions so far: ${count}` }))
    return merged
  }
  mergeSort(arr)
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total inversions = ${count}` }))
  return steps
}

// ─── QUICK SORT (271-274) ──────────────────────────────────
export function generateStdQuickSortSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  function quickSort(l, r) {
    if (l >= r) return
    const pivot = arr[r]
    let p = l
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [r], label: `Pivot = ${pivot} at index ${r}` }))
    for (let i = l; i < r; i++) {
      if (arr[i] < pivot) {
        [arr[i], arr[p]] = [arr[p], arr[i]]
        steps.push(ssStep(STEP_TYPES.ARRAY_SWAP, { indices: [i, p], label: `Swap ${arr[i]} ↔ ${arr[p]}` }))
        p++
      }
    }
    [arr[p], arr[r]] = [arr[r], arr[p]]
    steps.push(ssStep(STEP_TYPES.ARRAY_SWAP, { indices: [p, r], label: `Place pivot ${pivot} at ${p}` }))
    quickSort(l, p - 1)
    quickSort(p + 1, r)
  }
  quickSort(0, arr.length - 1)
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Sorted: [${arr}]` }))
  return steps
}

export function generateQuickSelectSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 3)
  const steps = []
  function quickSelect(l, r, targetIdx) {
    if (l === r) return arr[l]
    const pivot = arr[r]
    let p = l
    steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [r], label: `QuickSelect: pivot=${pivot} for kth=${K}` }))
    for (let i = l; i < r; i++) {
      if (arr[i] < pivot) { [arr[i], arr[p]] = [arr[p], arr[i]]; p++ }
    }
    [arr[p], arr[r]] = [arr[r], arr[p]]
    if (targetIdx === p) return arr[p]
    if (targetIdx < p) return quickSelect(l, p - 1, targetIdx)
    return quickSelect(p + 1, r, targetIdx)
  }
  const result = quickSelect(0, arr.length - 1, arr.length - K)
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${K}th largest = ${result}` }))
  return steps
}

// ─── COUNTING SORT (275-278) ──────────────────────────────
export function generateCountingSortSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  const max = Math.max(...arr), min = Math.min(...arr)
  const range = max - min + 1
  const count = new Array(range).fill(0)
  for (const v of arr) count[v - min]++
  steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Counts: [${count}] (range ${min}-${max})` }))
  let idx = 0
  for (let i = 0; i < range; i++) {
    while (count[i]-- > 0) arr[idx++] = i + min
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Counting sorted: [${arr}]` }))
  return steps
}

export function generateRadixSortLSDSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  const max = Math.max(...arr)
  steps.push(ssStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Radix sort: max=${max}` }))
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length).fill(0)
    const count = new Array(10).fill(0)
    for (const v of arr) count[Math.floor(v / exp) % 10]++
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i]
    steps.push(ssStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `After ${exp} place: [${arr}]` }))
  }
  steps.push(ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Radix sorted: [${arr}]` }))
  return steps
}

// ─── KTH LARGEST QUICKSELECT (281-282) ─────────────────────
export function generateKthLargestQSSteps(nums, k) {
  return generateQuickSelectSteps(nums, k)
}

export function generateKthSmallestSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k !== undefined ? parseInt(k) : 3
  arr.sort((a, b) => a - b)
  const steps = [ssStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [K-1], label: `${K}th smallest = ${arr[K-1]}` })]
  return steps
}
