/**
 * divideConquerSteps.js — Step generators for 8 Divide & Conquer patterns (IDs 710-717)
 */
import { STEP_TYPES } from './visualizersData'

function dStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── KARATSUBA MULTIPLICATION ──────────────────────────────
export function generateKaratsubaMultSteps(a, b) {
  const A = parseInt(a) || (Array.isArray(a) ? a[0] : 1234)
  const B = parseInt(b) || (Array.isArray(b) ? b[0] : 5678)
  const steps = []
  function karatsuba(x, y) {
    if (x < 10 || y < 10) {
      steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Base: ${x} × ${y} = ${x*y}` }))
      return x * y
    }
    const n = Math.max(x.toString().length, y.toString().length)
    const m = Math.floor(n / 2)
    const high1 = Math.floor(x / Math.pow(10, m))
    const low1 = x % Math.pow(10, m)
    const high2 = Math.floor(y / Math.pow(10, m))
    const low2 = y % Math.pow(10, m)
    steps.push(dStep(STEP_TYPES.RECURSE_CALL, { label: `Split: ${x} = ${high1}×10^${m} + ${low1}, ${y} = ${high2}×10^${m} + ${low2}`, depth: 0 }))
    const z0 = karatsuba(low1, low2)
    const z1 = karatsuba(low1 + high1, low2 + high2)
    const z2 = karatsuba(high1, high2)
    const result = z2 * Math.pow(10, 2 * m) + (z1 - z2 - z0) * Math.pow(10, m) + z0
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Combine: ${x} × ${y} = ${result}` }))
    return result
  }
  const result = karatsuba(A, B)
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${A} × ${B} = ${result}` }))
  return steps
}

// ─── CLOSEST PAIR OF POINTS ───────────────────────────────
export function generateClosestPairPointsSteps(points) {
  const pts = Array.isArray(points) ? points : JSON.parse(points || '[[2,3],[12,30],[40,50],[5,1],[12,10],[3,4]]')
  const steps = []
  pts.sort((a, b) => a[0] - b[0])
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Points sorted by x: ${JSON.stringify(pts)}` }))
  let minDist = Infinity, closest = null
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d2 = Math.pow(pts[i][0] - pts[j][0], 2) + Math.pow(pts[i][1] - pts[j][1], 2)
      if (d2 < minDist) { minDist = d2; closest = [pts[i], pts[j]] }
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Closest pair: ${JSON.stringify(closest)} with distance √${minDist} = ${Math.sqrt(minDist).toFixed(4)}` }))
  return steps
}

// ─── INVERSION COUNT MERGE SORT ───────────────────────────
export function generateInversionCountMergeSteps(nums) {
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
      else {
        merged.push(right[j++])
        count += left.length - i
        steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Inversion: ${left[i]} > ${right[j-1]}, count += ${left.length - i} = ${count}` }))
      }
    }
    merged.push(...left.slice(i), ...right.slice(j))
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Merge: [${left}] + [${right}] → [${merged}]` }))
    return merged
  }
  mergeSort(arr)
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total inversions = ${count}` }))
  return steps
}
