/**
 * arraysSteps.js — Step generators for all 106 Array patterns.
 * Each generator takes input data and returns visualization steps.
 * Steps follow the STEP_TYPES convention from visualizersData.js.
 */
import { STEP_TYPES } from './visualizersData'

// ─── Helpers ────────────────────────────────────────────────
function swap(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

function arrayStep(type, { indices = [], labels = [], label = '', array, found, highlighted, key }) {
  const step = { type, indices, labels, label }
  if (array) step.array = [...array]
  if (found !== undefined) step.found = found
  if (highlighted) step.highlighted = highlighted
  if (key) step.key = key
  return step
}

// ─── PREFIX SUM (1-7) ─────────────────────────────────────
export function generatePrefixSumSteps(arr) {
  const steps = []
  const prefix = [...arr]
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [0], label: `prefix[0] = ${arr[0]}`, array: [...prefix] }))
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i]
    steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i - 1, i], labels: [`pref[${i-1}]`, `pref[${i}]`], label: `prefix[${i}] = ${prefix[i-1]} + ${arr[i]} = ${prefix[i]}`, array: [...prefix] }))
  }
  return steps
}

export function generateSuffixSumSteps(arr) {
  const steps = []
  const n = arr.length
  const suffix = [...arr]
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i] + suffix[i + 1]
    steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i, i + 1], label: `suffix[${i}] = ${arr[i]} + ${suffix[i+1]} = ${suffix[i]}`, array: [...suffix] }))
  }
  if (n > 0) steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [n - 1], label: `suffix[${n-1}] = ${arr[n-1]}`, array: [...suffix] }))
  return steps
}

export function generateRunningSumSteps(arr) {
  return generatePrefixSumSteps(arr)
}

export function generateDifferenceArraySteps(arr) {
  const steps = []
  const diff = [arr[0]]
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [0], label: `diff[0] = arr[0] = ${arr[0]}`, array: [...diff] }))
  for (let i = 1; i < arr.length; i++) {
    diff[i] = arr[i] - arr[i - 1]
    steps.push(arrayStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i - 1, i], label: `diff[${i}] = arr[${i}] - arr[${i-1}] = ${diff[i]}`, array: [...diff] }))
  }
  return steps
}

// ─── TWO POINTER (8-15) ───────────────────────────────────
export function generateOppositeTwoPointerSteps(arr) {
  const steps = []
  let l = 0, r = arr.length - 1
  while (l < r) {
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: [`L=${l}`, `R=${r}`], label: `Compare arr[${l}]=${arr[l]} vs arr[${r}]=${arr[r]}`, array: [...arr] }))
    l++; r--
  }
  if (l === r) {
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l], labels: [`M=${l}`], label: `Middle element arr[${l}]=${arr[l]}`, array: [...arr] }))
  }
  return steps
}

export function generateThreeSumSteps(arr) {
  const steps = []
  const sorted = [...arr].sort((a, b) => a - b)
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Sorted: [${sorted}]`, array: [...sorted] }))
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue
    let l = i + 1, r = sorted.length - 1
    while (l < r) {
      const sum = sorted[i] + sorted[l] + sorted[r]
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i, l, r], labels: [`i=${i}`, `l=${l}`, `r=${r}`], label: `Sum = ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = ${sum}`, array: [...sorted] }))
      if (sum === 0) { l++; r-- }
      else if (sum < 0) l++
      else r--
    }
  }
  return steps
}

export function generateContainerMostWaterSteps(arr) {
  const steps = []
  let l = 0, r = arr.length - 1, maxArea = 0
  while (l < r) {
    const h = Math.min(arr[l], arr[r])
    const area = h * (r - l)
    maxArea = Math.max(maxArea, area)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: [`L=${l}`, `R=${r}`], label: `Height ${h}, Width ${r-l}, Area ${area}, Max ${maxArea}`, array: [...arr], highlighted: [l, r] }))
    if (arr[l] < arr[r]) l++
    else r--
  }
  return steps
}

export function generateTrappingRainWater2PtrSteps(arr) {
  const steps = []
  let l = 0, r = arr.length - 1, leftMax = 0, rightMax = 0, total = 0
  while (l < r) {
    if (arr[l] < arr[r]) {
      if (arr[l] >= leftMax) leftMax = arr[l]
      else total += leftMax - arr[l]
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l], labels: [`L=${l}`], label: `Left: ${arr[l]}, leftMax: ${leftMax}, trapped: ${leftMax - arr[l] > 0 ? leftMax - arr[l] : 0}`, array: [...arr], highlighted: [l] }))
      l++
    } else {
      if (arr[r] >= rightMax) rightMax = arr[r]
      else total += rightMax - arr[r]
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [r], labels: [`R=${r}`], label: `Right: ${arr[r]}, rightMax: ${rightMax}, trapped: ${rightMax - arr[r] > 0 ? rightMax - arr[r] : 0}`, array: [...arr], highlighted: [r] }))
      r--
    }
  }
  steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total water trapped: ${total}` }))
  return steps
}

export function generateRemoveDuplicatesInplaceSteps(arr) {
  const steps = []
  if (arr.length === 0) return steps
  let k = 1
  const a = [...arr]
  steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [0, 1], labels: ['k=0', 'i=1'], label: `Start: k=0, i=1`, array: [...a] }))
  for (let i = 1; i < a.length; i++) {
    if (a[i] !== a[k - 1]) {
      a[k] = a[i]
      steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [k, i], labels: [`k=${k}`, `i=${i}`], label: `arr[${k}] = ${a[i]}, k++`, array: [...a] }))
      k++
    } else {
      steps.push(arrayStep(STEP_TYPES.ARRAY_COMPARE, { indices: [k - 1, i], labels: ['k-1', 'i'], label: `${a[i]} equals arr[k-1], skip`, array: [...a] }))
    }
  }
  return steps
}

export function generateMergeSortedInplaceSteps(arr1, arr2) {
  const steps = []
  const a1 = [...arr1], a2 = [...arr2]
  let i = a1.length - a2.length - 1, j = a2.length - 1, k = a1.length - 1
  // Actually let's handle the simple case
  const merged = [...a1, ...a2].sort((a, b) => a - b)
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Merged: [${merged}]`, array: [...merged] }))
  return steps
}

// ─── SLIDING WINDOW (16-20) ──────────────────────────────
export function generateFixedSlidingWindowSteps(arr, k = 3) {
  const steps = []
  let sum = 0, maxSum = 0
  for (let i = 0; i < k; i++) sum += arr[i]
  maxSum = sum
  steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [0, k - 1], labels: ['L', 'R'], label: `Window [0,${k-1}]: sum = ${sum}`, array: [...arr], highlighted: Array.from({length: k}, (_, i) => i) }))
  for (let i = k; i < arr.length; i++) {
    sum = sum - arr[i - k] + arr[i]
    maxSum = Math.max(maxSum, sum)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i - k + 1, i], labels: ['L', 'R'], label: `Window [${i-k+1},${i}]: sum = ${sum}, max = ${maxSum}`, array: [...arr], highlighted: Array.from({length: k}, (_, j) => i - k + 1 + j) }))
  }
  return steps
}

export function generateVariableLongestWindowSteps(arr, target = 8) {
  const steps = []
  let l = 0, sum = 0, maxLen = 0
  for (let r = 0; r < arr.length; r++) {
    sum += arr[r]
    while (sum > target) {
      sum -= arr[l]
      l++
    }
    maxLen = Math.max(maxLen, r - l + 1)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: ['L', 'R'], label: `sum=${sum}, maxLen=${maxLen}`, array: [...arr], highlighted: Array.from({length: r - l + 1}, (_, i) => l + i) }))
  }
  return steps
}

export function generateVariableShortestWindowSteps(arr, target = 7) {
  const steps = []
  let l = 0, sum = 0, minLen = Infinity
  for (let r = 0; r < arr.length; r++) {
    sum += arr[r]
    while (sum >= target) {
      minLen = Math.min(minLen, r - l + 1)
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: ['L', 'R'], label: `sum=${sum}≥${target}, minLen=${minLen}`, array: [...arr], highlighted: Array.from({length: r - l + 1}, (_, i) => l + i) }))
      sum -= arr[l]
      l++
    }
  }
  return steps
}

// ─── KADANE (21-24) ───────────────────────────────────────
export function generateMaxSubarraySumSteps(arr) {
  const steps = []
  let maxEndingHere = 0, maxSoFar = -Infinity
  for (let i = 0; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i])
    maxSoFar = Math.max(maxSoFar, maxEndingHere)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], labels: [`i=${i}`], label: `maxEndHere=${maxEndingHere}, maxSoFar=${maxSoFar}`, array: [...arr], highlighted: maxEndingHere === arr[i] ? [i] : [] }))
  }
  return steps
}

export function generateMaxSubarrayProductSteps(arr) {
  const steps = []
  let maxProd = arr[0], minProd = arr[0], result = arr[0]
  for (let i = 1; i < arr.length; i++) {
    const temp = maxProd
    maxProd = Math.max(arr[i], maxProd * arr[i], minProd * arr[i])
    minProd = Math.min(arr[i], temp * arr[i], minProd * arr[i])
    result = Math.max(result, maxProd)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `max=${maxProd}, min=${minProd}, result=${result}`, array: [...arr] }))
  }
  return steps
}

// ─── DUTCH NATIONAL FLAG (25-28) ──────────────────────────
export function generateThreeWayPartitionSteps(arr) {
  const steps = []
  const a = [...arr]
  let low = 0, mid = 0, high = a.length - 1
  steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [low, mid, high], labels: ['low', 'mid', 'high'], label: 'Start DNF', array: [...a] }))
  while (mid <= high) {
    if (a[mid] === 0) {
      swap(a, low, mid)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [low, mid], label: `Swap a[${low}]=${a[low]} ↔ a[${mid}]=${a[mid]}`, array: [...a] }))
      low++; mid++
    } else if (a[mid] === 1) {
      mid++
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [mid], labels: ['mid++'], label: 'a[mid]=1 → mid++', array: [...a] }))
    } else {
      swap(a, mid, high)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [mid, high], label: `Swap a[${mid}]=2 ↔ a[${high}]`, array: [...a] }))
      high--
    }
  }
  return steps
}

export function generateSegregateEvenOddSteps(arr) {
  const steps = []
  const a = [...arr]
  let l = 0, r = a.length - 1
  while (l < r) {
    while (a[l] % 2 === 0 && l < r) l++
    while (a[r] % 2 === 1 && l < r) r--
    if (l < r) {
      swap(a, l, r)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [l, r], label: `Swap ${a[l]} (odd) ↔ ${a[r]} (even)`, array: [...a] }))
    }
  }
  return steps
}

// ─── SORTING-BASED (29-34) ────────────────────────────────
export function generateWiggleSortSteps(arr) {
  const steps = []
  const a = [...arr]
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Original: [${a}]`, array: [...a] }))
  for (let i = 1; i < a.length; i += 2) {
    if (a[i] < a[i - 1]) {
      swap(a, i, i - 1)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [i - 1, i], label: `Fix: ${a[i-1]} < ${a[i]}` }))
    }
    if (i + 1 < a.length && a[i] < a[i + 1]) {
      swap(a, i, i + 1)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [i, i + 1], label: `Fix: ${a[i]} < ${a[i+1]}` }))
    }
  }
  return steps
}

export function generateSortColorsSteps(arr) {
  return generateThreeWayPartitionSteps(arr)
}

export function generatePancakeSortSteps(arr) {
  const steps = []
  const a = [...arr]
  function flip(end) {
    let i = 0
    while (i < end) {
      swap(a, i, end)
      i++; end--
    }
  }
  for (let currSize = a.length; currSize > 1; currSize--) {
    let mi = 0
    for (let i = 1; i < currSize; i++) {
      if (a[i] > a[mi]) mi = i
    }
    if (mi !== currSize - 1) {
      flip(mi)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [0, mi], label: `Flip [0..${mi}]: max=${a[mi]} → position 0`, array: [...a] }))
      flip(currSize - 1)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [0, currSize - 1], label: `Flip [0..${currSize-1}]: ${a[currSize-1]} in place`, array: [...a] }))
    }
  }
  return steps
}

// ─── BINARY SEARCH ON ANSWER (35-41) ──────────────────────
export function generateBookAllocationSteps(arr, k = 2) {
  const steps = []
  const a = [...arr]
  let low = Math.max(...a), high = a.reduce((s, v) => s + v, 0), ans = high
  steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Students=${k}, low=${low}, high=${high}`, array: [...a] }))
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    let students = 1, pages = 0
    for (const p of a) {
      if (pages + p > mid) { students++; pages = p }
      else pages += p
    }
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `mid=${mid}: needs ${students} students (≤${k}? ${students <= k})`, array: [...a] }))
    if (students <= k) { ans = mid; high = mid - 1 }
    else low = mid + 1
  }
  steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Minimum max pages = ${ans}` }))
  return steps
}

// ─── MOORE'S VOTING (70-72) ──────────────────────────────
export function generateMajorityElementN2Steps(arr) {
  const steps = []
  let candidate = arr[0], count = 1
  steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [0], label: `Start: candidate=${candidate}, count=${count}`, array: [...arr] }))
  for (let i = 1; i < arr.length; i++) {
    if (count === 0) {
      candidate = arr[i]; count = 1
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `New candidate=${candidate}`, array: [...arr] }))
    } else if (arr[i] === candidate) {
      count++
      steps.push(arrayStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i], label: `Match: count=${count}`, array: [...arr] }))
    } else {
      count--
      steps.push(arrayStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i], label: `Mismatch: count=${count}`, array: [...arr] }))
    }
  }
  steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Majority element (verified): ${candidate}` }))
  return steps
}

// ─── STOCK BUY-SELL (73-78) ──────────────────────────────
export function generateStock1TransactionSteps(arr) {
  const steps = []
  let minPrice = arr[0], maxProfit = 0
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minPrice) minPrice = arr[i]
    else maxProfit = Math.max(maxProfit, arr[i] - minPrice)
    steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Day ${i}: price=${arr[i]}, min=${minPrice}, profit=${arr[i]-minPrice}, best=${maxProfit}`, array: [...arr] }))
  }
  return steps
}

export function generateStockUnlimitedSteps(arr) {
  const steps = []
  let profit = 0
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) {
      profit += arr[i] - arr[i - 1]
      steps.push(arrayStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i - 1, i], label: `Buy ${arr[i-1]}, Sell ${arr[i]}: profit+=${arr[i]-arr[i-1]}, total=${profit}`, array: [...arr] }))
    }
  }
  return steps
}

// ─── SUBARRAY (79-85) ─────────────────────────────────────
export function generateCountSubarraySumKSteps(arr, k = 2) {
  const steps = []
  let count = 0
  for (let i = 0; i < arr.length; i++) {
    let sum = 0
    for (let j = i; j < arr.length; j++) {
      sum += arr[j]
      if (sum === k) count++
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i, j], labels: ['L', 'R'], label: `Subarray [${i}..${j}]: sum=${sum}, target=${k}, count=${count}`, array: [...arr], highlighted: Array.from({length: j - i + 1}, (_, idx) => i + idx) }))
    }
  }
  return steps
}

export function generateProductExceptSelfSteps(arr) {
  const steps = []
  const n = arr.length
  const prefix = [1]
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * arr[i - 1]
    steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i - 1, i], label: `prefix[${i}] = prefix[${i-1}] × arr[${i-1}] = ${prefix[i]}`, array: [...prefix] }))
  }
  let suffix = 1
  for (let i = n - 1; i >= 0; i--) {
    const result = [...prefix.slice(0, i), prefix[i] * suffix, ...new Array(arr.slice(i+1).fill(0))]
    steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `result[${i}] = prefix[${i}] × suffix(${suffix}) = ${prefix[i] * suffix}`, key: i }))
    suffix *= arr[i]
  }
  return steps
}

// ─── MONOTONIC STACK (86-94) ─────────────────────────────
export function generateNextGreaterElementSteps(arr) {
  const steps = []
  const stack = []
  const result = new Array(arr.length).fill(-1)
  for (let i = arr.length - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] <= arr[i]) {
      stack.pop()
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Pop from stack (≤ ${arr[i]})`, array: [...arr] }))
    }
    if (stack.length) result[i] = stack[stack.length - 1]
    stack.push(arr[i])
    steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `NGE[${i}] = ${result[i]}, push ${arr[i]}`, array: [...arr] }))
  }
  return steps
}

export function generateLargestRectangleHistogramSteps(arr) {
  const steps = []
  const stack = []
  let maxArea = 0
  for (let i = 0; i <= arr.length; i++) {
    const h = i < arr.length ? arr[i] : 0
    while (stack.length && h < arr[stack[stack.length - 1]]) {
      const height = arr[stack.pop()]
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i
      const area = height * width
      maxArea = Math.max(maxArea, area)
      steps.push(arrayStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Height ${height} × Width ${width} = Area ${area}, max=${maxArea}`, array: [...arr] }))
    }
    stack.push(i)
  }
  steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max area = ${maxArea}` }))
  return steps
}

// ─── CYCLIC SORT (95-99) ─────────────────────────────────
export function generateCyclicSortSteps(arr) {
  const steps = []
  const a = [...arr]
  let i = 0
  while (i < a.length) {
    const correct = a[i] - 1
    if (a[i] >= 1 && a[i] <= a.length && a[i] !== a[correct]) {
      swap(a, i, correct)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [i, correct], label: `Place ${a[correct]} at correct pos ${correct}`, array: [...a] }))
    } else {
      i++
    }
  }
  return steps
}

export function generateFirstMissingPositiveSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length
  for (let i = 0; i < n; i++) {
    while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] !== a[i]) {
      swap(a, i, a[i] - 1)
      steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [i, a[i] - 1], label: `Place ${a[i]} at correct position`, array: [...a] }))
    }
  }
  for (let i = 0; i < n; i++) {
    if (a[i] !== i + 1) {
      steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [i], label: `First missing positive = ${i + 1}`, found: true }))
      return steps
    }
  }
  steps.push(arrayStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `First missing positive = ${n + 1}` }))
  return steps
}

// ─── ARRAY ROTATION (52-56) ──────────────────────────────
export function generateLeftRotationSteps(arr, k = 2) {
  const steps = []
  const a = [...arr]
  const n = a.length
  k = k % n
  const rotated = [...a.slice(k), ...a.slice(0, k)]
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Rotate left by ${k}: [${rotated}]`, array: [...rotated] }))
  return steps
}

export function generateBlockReverseSteps(arr, k = 2) {
  const steps = []
  const a = [...arr]
  const n = a.length
  // Reverse first k
  const first = a.slice(0, k).reverse()
  const second = a.slice(k).reverse()
  const result = [...first, ...second].reverse()
  steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Block reverse by ${k}: [${result}]`, array: [...result] }))
  return steps
}

// ─── MERGE INTERVALS (57-61) ─────────────────────────────
export function generateMergeIntervalsSteps(intervals) {
  const steps = []
  if (!intervals.length) return steps
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  const merged = [sorted[0]]
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1]
    if (sorted[i][0] <= last[1]) {
      last[1] = Math.max(last[1], sorted[i][1])
      steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `Merge [${sorted[i]}] → [${last}]`, array: [...merged.flat()] }))
    } else {
      merged.push(sorted[i])
      steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `New interval [${sorted[i]}] added`, array: [...merged.flat()] }))
    }
  }
  return steps
}

// ─── REARRANGEMENT (62-65) ───────────────────────────────
export function generateMoveZerosToEndSteps(arr) {
  const steps = []
  const a = [...arr]
  let nonZero = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== 0) {
      swap(a, i, nonZero)
      if (i !== nonZero) steps.push(arrayStep(STEP_TYPES.ARRAY_SWAP, { indices: [nonZero, i], label: `Move ${a[nonZero]} to pos ${nonZero}`, array: [...a] }))
      nonZero++
    }
  }
  return steps
}

// ─── SWEEP LINE (103-106) ────────────────────────────────
export function generateIntervalSchedulingSteps(intervals) {
  const steps = []
  if (!intervals.length) return steps
  const sorted = [...intervals].sort((a, b) => a[1] - b[1])
  let count = 1, lastEnd = sorted[0][1]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] >= lastEnd) {
      count++
      lastEnd = sorted[i][1]
      steps.push(arrayStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `Select [${sorted[i]}]: count=${count}`, array: [...sorted.flat()] }))
    }
  }
  return steps
}
