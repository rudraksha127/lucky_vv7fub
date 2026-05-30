/**
 * hashingSteps.js — Step generators for 20 Hashing patterns (IDs 284-303)
 */
import { STEP_TYPES } from './visualizersData'

function hStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── CHAR FREQUENCY ────────────────────────────────────────
export function generateCharFreqSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = [], freq = {}
  for (const c of s) {
    if (c === ' ') continue
    freq[c] = (freq[c] || 0) + 1
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `'${c}' → ${freq[c]}` }))
  }
  const sorted = Object.entries(freq).sort((a,b) => b[1] - a[1])
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Freq: ${sorted.map(([c,f]) => `${c}:${f}`).join(', ')}` }))
  return steps
}

export function generateWordFreqSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = [], freq = {}
  for (const w of s.split(/\s+/)) {
    freq[w] = (freq[w] || 0) + 1
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `"${w}" → ${freq[w]}` }))
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Word freq: ${Object.entries(freq).map(([w,c]) => `${w}:${c}`).join(', ')}` }))
  return steps
}

// ─── TWO SUM ───────────────────────────────────────────────
export function generateTwoSumHashSteps(nums, target) {
  const arr = parseArr(nums)
  const t = target !== undefined ? parseInt(target) : (Array.isArray(target) ? target[0] : 9)
  const steps = [], map = {}
  for (let i = 0; i < arr.length; i++) {
    const complement = t - arr[i]
    steps.push(hStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `arr[${i}]=${arr[i]}, complement=${complement}` }))
    if (complement in map) {
      steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [map[complement], i], label: `✅ ${arr[map[complement]]} + ${arr[i]} = ${t}` }))
      return steps
    }
    map[arr[i]] = i
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Store ${arr[i]} at index ${i}` }))
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '❌ No pair found' }))
  return steps
}

// ─── SUBARRAY SUM EQUALS K ────────────────────────────────
export function generateSubarraySumKSteps(nums, k) {
  const arr = parseArr(nums)
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 3)
  const steps = [], map = { 0: [-1] }
  let sum = 0, count = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
    const diff = sum - K
    if (diff in map) {
      count += map[diff].length
      steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [map[diff][0]+1, i], label: `Sum ${K} at [${map[diff][0]+1},${i}], count=${count}` }))
    }
    if (!map[sum]) map[sum] = []
    map[sum].push(i)
    steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Sum=${sum}, count=${count}` }))
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total subarrays with sum ${K} = ${count}` }))
  return steps
}

// ─── LONGEST CONSECUTIVE SEQUENCE ─────────────────────────
export function generateLongestConsecutiveHashSetSteps(nums) {
  const arr = parseArr(nums)
  const steps = [], set = new Set(arr)
  let longest = 0
  for (const n of arr) {
    if (!set.has(n - 1)) {
      let len = 1
      while (set.has(n + len)) len++
      longest = Math.max(longest, len)
      steps.push(hStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Sequence starting at ${n}: length=${len}, longest=${longest}` }))
    }
  }
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Longest consecutive = ${longest}` }))
  return steps
}

// ─── 1D COORDINATE COMPRESSION ────────────────────────────
export function generateCoordCompress1DSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  const sorted = [...new Set(arr)].sort((a, b) => a - b)
  const map = {}
  sorted.forEach((v, i) => { map[v] = i })
  steps.push(hStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Original: [${arr}]` }))
  steps.push(hStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Compressed: [${arr.map(v => map[v])}] → ${JSON.stringify(map)}` }))
  return steps
}
