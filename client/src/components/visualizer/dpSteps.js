/**
 * dpSteps.js — Step generators for 94 Dynamic Programming patterns (IDs 454-547)
 */
import { STEP_TYPES } from './visualizersData'

function dStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── 1D DP (454-460) ───────────────────────────────────────
export function generateFibonacciSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 10)
  const steps = [], dp = [0, 1]
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [0, 1], label: `Base: dp[0]=0, dp[1]=1` }))
  for (let i = 2; i <= N; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [N], label: `Fibonacci(${N}) = ${dp[N]}` }))
  return steps
}

export function generateClimbingStairsSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 5)
  const steps = [], dp = [1, 1]
  for (let i = 2; i <= N; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Ways to climb ${i} stairs = dp[${i-1}]+dp[${i-2}] = ${dp[i-1]}+${dp[i-2]} = ${dp[i]}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Ways to climb ${N} stairs = ${dp[N]}` }))
  return steps
}

export function generateHouseRobber1Steps(nums) {
  const arr = parseArr(nums)
  if (!arr.length) return [dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: 'Empty array' })]
  const steps = [], dp = [arr[0], Math.max(arr[0], arr[1] || 0)]
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [0], label: `dp[0] = ${arr[0]}` }))
  for (let i = 2; i < arr.length; i++) {
    dp[i] = Math.max(dp[i - 1], arr[i] + dp[i - 2])
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `dp[${i}] = max(dp[${i-1}]=${dp[i-1]}, ${arr[i]}+dp[${i-2}]=${arr[i]+dp[i-2]}) = ${dp[i]}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max robbed = ${dp[arr.length - 1]}` }))
  return steps
}

export function generateCoinChangeMinSteps(coins, amount) {
  const c = Array.isArray(coins) ? coins : JSON.parse(coins || '[1,2,5]')
  const a = amount !== undefined ? parseInt(amount) : 11
  const steps = [], dp = new Array(a + 1).fill(Infinity)
  dp[0] = 0
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [0], label: `dp[0] = 0` }))
  for (let i = 1; i <= a; i++) {
    for (const coin of c) {
      if (i >= coin) dp[i] = Math.min(dp[i], 1 + dp[i - coin])
    }
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `dp[${i}] = ${dp[i] === Infinity ? '∞' : dp[i]}${dp[i] !== Infinity ? ` (coins: ${c.filter(coin => i>=coin && dp[i] === 1+dp[i-coin]).join(',')})` : ''}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: dp[a] === Infinity ? `❌ Cannot make ${a}` : `Min coins for ${a} = ${dp[a]}` }))
  return steps
}

// ─── HOUSE ROBBER PATTERN (462-464) ───────────────────────
export function generateHouseRobberCircularSteps(nums) {
  const arr = parseArr(nums)
  const steps = []
  function robLinear(a) {
    if (!a.length) return 0
    let prev2 = 0, prev1 = a[0]
    for (let i = 1; i < a.length; i++) {
      const curr = Math.max(prev1, a[i] + prev2)
      prev2 = prev1; prev1 = curr
    }
    return prev1
  }
  const n = arr.length
  if (n === 1) {
    steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max robbed = ${arr[0]}` }))
  } else {
    const skipFirst = robLinear(arr.slice(1))
    const skipLast = robLinear(arr.slice(0, -1))
    const result = Math.max(skipFirst, skipLast)
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Skip first: ${skipFirst}, Skip last: ${skipLast}` }))
    steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max robbed (circular) = ${result}` }))
  }
  return steps
}

// ─── 2D / GRID DP (465-472) ──────────────────────────────
export function generateUniquePathsSteps(m, n) {
  const M = parseInt(m) || (Array.isArray(m) ? m[0] : 3)
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 7)
  const steps = [], dp = Array.from({length: M}, () => new Array(N).fill(1))
  steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Grid ${M}×${N}: fill first row/col with 1` }))
  for (let i = 1; i < M; i++) {
    for (let j = 1; j < N; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
      steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i, j], label: `dp[${i}][${j}] = ${dp[i-1][j]} + ${dp[i][j-1]} = ${dp[i][j]}` }))
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Unique paths = ${dp[M - 1][N - 1]}` }))
  return steps
}

export function generateMinPathSumSteps(grid) {
  const g = Array.isArray(grid) ? grid : JSON.parse(grid || '[[1,3,1],[1,5,1],[4,2,1]]')
  const steps = [], m = g.length, n = g[0].length
  const dp = g.map(r => [...r])
  for (let i = 1; i < m; i++) dp[i][0] += dp[i - 1][0]
  for (let j = 1; j < n; j++) dp[0][j] += dp[0][j - 1]
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1])
      steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i, j], label: `Min path to (${i},${j}) = ${dp[i][j]}` }))
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Min path sum = ${dp[m - 1][n - 1]}` }))
  return steps
}

// ─── LCS DP (473-477) ─────────────────────────────────────
export function generateLCS2Steps(s1, s2) {
  const a = typeof s1 === 'string' ? s1 : (Array.isArray(s1) ? s1[0] : 'abcde')
  const b = typeof s2 === 'string' ? s2 : (Array.isArray(s2) ? s2[0] : 'ace')
  const steps = [], m = a.length, n = b.length
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Match '${a[i-1]}' → dp[${i}][${j}] = ${dp[i][j]}` }))
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `LCS length = ${dp[m][n]}` }))
  return steps
}

// ─── LIS (478-483) ─────────────────────────────────────────
export function generateLISOn2Steps(nums) {
  const arr = parseArr(nums)
  const steps = [], dp = new Array(arr.length).fill(1)
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1)
    }
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `LIS ending at ${arr[i]} = ${dp[i]}` }))
  }
  const max = Math.max(...dp)
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `LIS length = ${max}` }))
  return steps
}

export function generateLISOnLogNSteps(nums) {
  const arr = parseArr(nums)
  const steps = [], tails = []
  for (const v of arr) {
    let l = 0, r = tails.length
    while (l < r) {
      const m = Math.floor((l + r) / 2)
      if (tails[m] < v) l = m + 1
      else r = m
    }
    tails[l] = v
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Insert ${v} → tails: [${tails}] (len=${tails.length})` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `LIS length = ${tails.length}` }))
  return steps
}

// ─── MATRIX CHAIN MULTIPLICATION (493-500) ────────────────
export function generateMatrixChainMultSteps(dims) {
  const arr = Array.isArray(dims) ? dims : JSON.parse(dims || '[10,20,30,40]')
  const n = arr.length
  const steps = [], dp = Array.from({length: n}, () => new Array(n).fill(0))
  for (let len = 2; len < n; len++) {
    for (let i = 1; i < n - len + 1; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j]
        if (cost < dp[i][j]) dp[i][j] = cost
      }
      steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `dp[${i}][${j}] = ${dp[i][j]} operations` }))
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Min multiplications = ${dp[1][n - 1]}` }))
  return steps
}

// ─── 0/1 KNAPSACK (501-507) ───────────────────────────────
export function generateKnapsack01StdSteps(values, weights, capacity) {
  const v = Array.isArray(values) ? values : JSON.parse(values || '[1,2,3]')
  const w = Array.isArray(weights) ? weights : JSON.parse(weights || '[10,15,40]')
  const cap = capacity !== undefined ? parseInt(capacity) : 6
  const n = v.length
  const steps = [], dp = Array.from({length: n + 1}, () => new Array(cap + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= cap; c++) {
      if (w[i - 1] <= c) {
        dp[i][c] = Math.max(dp[i - 1][c], v[i - 1] + dp[i - 1][c - w[i - 1]])
      } else {
        dp[i][c] = dp[i - 1][c]
      }
    }
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `Item ${i} (val=${v[i-1]}, wt=${w[i-1]}): dp[${i}][${cap}] = ${dp[i][cap]}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max value = ${dp[n][cap]}` }))
  return steps
}

export function generateSubsetSumSteps(nums, sum) {
  const arr = parseArr(nums)
  const target = sum !== undefined ? parseInt(sum) : 9
  const n = arr.length
  const steps = [], dp = Array.from({length: n + 1}, () => new Array(target + 1).fill(false))
  for (let i = 0; i <= n; i++) dp[i][0] = true
  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= target; s++) {
      if (arr[i - 1] > s) dp[i][s] = dp[i - 1][s]
      else dp[i][s] = dp[i - 1][s] || dp[i - 1][s - arr[i - 1]]
    }
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `After item ${arr[i-1]}: subset sum ${target} ${dp[i][target] ? '✅ possible' : '❌ not yet'}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Subset sum ${target} ${dp[n][target] ? '✅ exists' : '❌ not possible'}` }))
  return steps
}

// ─── BURST BALLOONS (496) ────────────────────────────────
export function generateBurstBalloonsSteps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const padded = [1, ...arr, 1]
  const steps = [], dp = Array.from({length: n + 2}, () => new Array(n + 2).fill(0))
  for (let len = 1; len <= n; len++) {
    for (let i = 1; i <= n - len + 1; i++) {
      const j = i + len - 1
      for (let k = i; k <= j; k++) {
        const coins = padded[i - 1] * padded[k] * padded[j + 1] + dp[i][k - 1] + dp[k + 1][j]
        dp[i][j] = Math.max(dp[i][j], coins)
      }
      steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `dp[${i}][${j}] = ${dp[i][j]} burst range` }))
    }
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Max coins = ${dp[1][n]}` }))
  return steps
}

// ─── TARGET SUM (507) ─────────────────────────────────────
export function generateTargetSumAssignSteps(nums, target) {
  const arr = parseArr(nums)
  const t = target !== undefined ? parseInt(target) : (Array.isArray(target) ? target[0] : 3)
  const total = arr.reduce((a, b) => a + b, 0)
  const steps = []
  if (t > total || (total + t) % 2 !== 0) {
    steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: '❌ Not possible' }))
    return steps
  }
  const sum = (total + t) / 2
  const dp = new Array(sum + 1).fill(0); dp[0] = 1
  for (const v of arr) {
    for (let s = sum; s >= v; s--) dp[s] += dp[s - v]
    steps.push(dStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `After ${v}: ways to get ${sum} = ${dp[sum]}` }))
  }
  steps.push(dStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Ways to get target ${t} = ${dp[sum]}` }))
  return steps
}
