/**
 * greedySteps.js — Step generators for 26 Greedy patterns (IDs 548-573)
 */
import { STEP_TYPES } from './visualizersData'

function gStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── ACTIVITY SELECTION ───────────────────────────────────
export function generateMaxNonOverlapIntervalsSteps(intervals) {
  const arr = Array.isArray(intervals) ? intervals : JSON.parse(intervals || '[[1,2],[2,3],[3,4],[1,3]]')
  const steps = []
  arr.sort((a, b) => a[1] - b[1])
  let count = 1, end = arr[0][1]
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [0], label: `Pick [${arr[0]}] (earliest end = ${end})` }))
  for (let i = 1; i < arr.length; i++) {
    if (arr[i][0] >= end) {
      count++
      end = arr[i][1]
      steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [i], label: `Pick [${arr[i]}], count=${count}` }))
    } else {
      steps.push(gStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i], label: `Skip [${arr[i]}] (overlaps ${end})` }))
    }
  }
  steps.push(gStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Max non-overlapping = ${count}` }))
  return steps
}

export function generateMinPlatformsSteps(times) {
  const arr = parseArr(times)
  const events = []
  for (const [s, e] of arr) { events.push([s, 1]); events.push([e, -1]) }
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])
  let maxPlatforms = 0, curr = 0
  const steps = []
  for (const [t, type] of events) {
    curr += type
    maxPlatforms = Math.max(maxPlatforms, curr)
    steps.push(gStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `At ${t}: ${type === 1 ? 'arrival' : 'departure'}, platforms=${curr}, max=${maxPlatforms}` }))
  }
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Minimum platforms needed = ${maxPlatforms}` }))
  return steps
}

// ─── JUMP GAME ────────────────────────────────────────────
export function generateJumpGame1Steps(nums) {
  const arr = parseArr(nums)
  const steps = []
  let maxReach = 0
  for (let i = 0; i < arr.length; i++) {
    if (i > maxReach) {
      steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '❌ Cannot reach end' }))
      return steps
    }
    maxReach = Math.max(maxReach, i + arr[i])
    steps.push(gStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `At ${i} (val=${arr[i]}), maxReach=${maxReach}` }))
  }
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '✅ Can reach end!' }))
  return steps
}

export function generateJumpGame2Steps(nums) {
  const arr = parseArr(nums)
  const steps = []
  let jumps = 0, currEnd = 0, farthest = 0
  for (let i = 0; i < arr.length - 1; i++) {
    farthest = Math.max(farthest, i + arr[i])
    if (i === currEnd) {
      jumps++; currEnd = farthest
      steps.push(gStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Jump ${jumps}: reach ${currEnd}` }))
    }
  }
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Min jumps = ${jumps}` }))
  return steps
}

// ─── REMOVE K DIGITS ─────────────────────────────────────
export function generateRemoveKDigitsSteps(num, k) {
  const s = typeof num === 'string' ? num : (Array.isArray(num) ? num[0].toString() : '1432219')
  const K = k !== undefined ? parseInt(k) : (Array.isArray(k) ? k[0] : 3)
  const steps = [], stack = []
  let remove = K
  for (const c of s) {
    while (remove > 0 && stack.length && stack[stack.length - 1] > c) {
      steps.push(gStep(STEP_TYPES.STACK_POP, { value: stack.pop(), label: `Remove ${stack[stack.length-1]||'?'} > ${c}, remaining removals=${remove-1}` }))
      remove--
    }
    stack.push(c)
    steps.push(gStep(STEP_TYPES.STACK_PUSH, { value: c, label: `Push ${c}, stack: [${stack.join('')}]` }))
  }
  while (remove > 0) { stack.pop(); remove-- }
  const result = stack.join('').replace(/^0+/, '') || '0'
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `After removing ${K} digits: ${result}` }))
  return steps
}

// ─── CANDY DISTRIBUTION ──────────────────────────────────
export function generateCandyDistributionSteps(ratings) {
  const arr = parseArr(ratings)
  const n = arr.length, candies = new Array(n).fill(1)
  const steps = []
  for (let i = 1; i < n; i++) {
    if (arr[i] > arr[i - 1]) candies[i] = candies[i - 1] + 1
  }
  steps.push(gStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Left pass: [${candies}]` }))
  for (let i = n - 2; i >= 0; i--) {
    if (arr[i] > arr[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1)
  }
  steps.push(gStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Right pass: [${candies}]` }))
  const total = candies.reduce((a, b) => a + b, 0)
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total candies = ${total}` }))
  return steps
}

// ─── GAS STATION ──────────────────────────────────────────
export function generateGasStationSteps(gas, cost) {
  const g = Array.isArray(gas) ? gas : JSON.parse(gas || '[1,2,3,4,5]')
  const c = Array.isArray(cost) ? cost : JSON.parse(cost || '[3,4,5,1,2]')
  const steps = []
  let total = 0, curr = 0, start = 0
  for (let i = 0; i < g.length; i++) {
    const diff = g[i] - c[i]
    total += diff; curr += diff
    if (curr < 0) { start = i + 1; curr = 0 }
    steps.push(gStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Station ${i}: gas=${g[i]}, cost=${c[i]}, diff=${diff}, total=${total}, curr=${curr}${curr < 0 ? ' → reset start' : ''}` }))
  }
  steps.push(gStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: total >= 0 ? `✅ Start at station ${start}` : '❌ Cannot complete circuit' }))
  return steps
}
