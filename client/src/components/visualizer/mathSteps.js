/**
 * mathSteps.js — Step generators for 49 Math & Number Theory patterns (IDs 603-651)
 */
import { STEP_TYPES } from './visualizersData'

function mStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── EUCLIDEAN GCD ─────────────────────────────────────────
export function generateEuclideanGCDSteps(a, b) {
  const A = parseInt(a) || (Array.isArray(a) ? a[0] : 48)
  const B = parseInt(b) || (Array.isArray(b) ? b[0] : 18)
  const steps = []
  let x = A, y = B
  steps.push(mStep(STEP_TYPES.RECURSE_CALL, { label: `GCD(${x}, ${y})`, depth: 0 }))
  while (y) {
    const r = x % y
    steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `${x} = ${y}×${Math.floor(x/y)} + ${r}` }))
    x = y; y = r
    steps.push(mStep(STEP_TYPES.RECURSE_CALL, { label: `GCD(${x}, ${y})`, depth: 0 }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `GCD(${A}, ${B}) = ${x}` }))
  return steps
}

// ─── SIEVE ─────────────────────────────────────────────────
export function generateStdSieveSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 30)
  const steps = []
  const isPrime = new Array(N + 1).fill(true)
  isPrime[0] = isPrime[1] = false
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Initialize 0..${N} all true` }))
  for (let i = 2; i * i <= N; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= N; j += i) {
        isPrime[j] = false
      }
      steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Mark multiples of ${i}: ${Array.from({length: Math.floor(N/i)-i+1}, (_, k) => i*(i+k)).filter(p => p<=N).join(', ')}` }))
    }
  }
  const primes = Array.from({length: N+1}, (_, i) => i).filter(i => isPrime[i])
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Primes ≤ ${N}: [${primes}] (${primes.length} primes)` }))
  return steps
}

export function generateSegmentedSieveSteps(l, r) {
  const L = parseInt(l) || (Array.isArray(l) ? l[0] : 100)
  const R = parseInt(r) || (Array.isArray(r) ? r[0] : 150)
  const steps = []
  const limit = Math.floor(Math.sqrt(R))
  const isPrime = new Array(limit + 1).fill(true)
  isPrime[0] = isPrime[1] = false
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) for (let j = i * i; j <= limit; j += i) isPrime[j] = false
  }
  const basePrimes = Array.from({length: limit+1}, (_, i) => i).filter(i => isPrime[i])
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Base primes up to √${R} = ${limit}: [${basePrimes}]` }))
  const segment = new Array(R - L + 1).fill(true)
  for (const p of basePrimes) {
    const start = Math.max(p * p, Math.ceil(L / p) * p)
    for (let j = start; j <= R; j += p) segment[j - L] = false
  }
  const primesInRange = Array.from({length: R-L+1}, (_, i) => L + i).filter((_, i) => segment[i])
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Primes in [${L},${R}]: [${primesInRange}] (${primesInRange.length} primes)` }))
  return steps
}

export function generateSieveSPFSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 30)
  const steps = []
  const spf = Array.from({length: N + 1}, (_, i) => i)
  for (let i = 2; i * i <= N; i++) {
    if (spf[i] === i) {
      for (let j = i * i; j <= N; j += i) {
        if (spf[j] === j) spf[j] = i
      }
    }
  }
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `SPF array: [${spf.slice(0, N+1)}]` }))
  return steps
}

// ─── PRIME FACTORIZATION ──────────────────────────────────
export function generateTrialDivisionSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 84)
  const steps = []
  let x = N, factors = []
  steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Factorizing ${N}:` }))
  for (let i = 2; i * i <= x; i++) {
    while (x % i === 0) {
      factors.push(i); x /= i
      steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Divide by ${i} → ${x}, factors: [${factors}]` }))
    }
  }
  if (x > 1) { factors.push(x); steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Remaining prime: ${x}` })) }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${N} = ${factors.join(' × ')}` }))
  return steps
}

// ─── PASCAL'S TRIANGLE ────────────────────────────────────
export function generatePascalTriangle2Steps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 5)
  const steps = [], triangle = []
  for (let i = 0; i < N; i++) {
    triangle[i] = []
    for (let j = 0; j <= i; j++) {
      triangle[i][j] = (j === 0 || j === i) ? 1 : triangle[i-1][j-1] + triangle[i-1][j]
    }
    steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Row ${i}: [${triangle[i]}]` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Pascal's triangle (${N} rows) complete` }))
  return steps
}

// ─── CATALAN NUMBERS ──────────────────────────────────────
export function generateCatalanNumberSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 3)
  const steps = []
  const dp = [1]
  for (let i = 1; i <= N; i++) {
    let c = 0
    for (let j = 0; j < i; j++) c += dp[j] * dp[i - 1 - j]
    dp[i] = c
    steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `C(${i}) = Σ C(${j})×C(${i-1-j}) = ${c}` }))
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Catalan(${N}) = ${dp[N]}` }))
  return steps
}

// ─── FIBONACCI O(LOG N) ───────────────────────────────────
export function generateFibonacciLogNSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 10)
  const steps = []
  function matMul(A, B) {
    return [
      [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
      [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ]
  }
  function matPow(M, p) {
    if (p === 1) return M
    if (p % 2 === 0) {
      const half = matPow(M, p / 2)
      return matMul(half, half)
    }
    return matMul(M, matPow(M, p - 1))
  }
  const base = [[1, 1], [1, 0]]
  const result = N <= 1 ? [[BigInt(1), BigInt(1)], [BigInt(1), BigInt(0)]] : matPow(base, N - 1)
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Fibonacci(${N}) = ${result[0][0]} (matrix exponentiation)` }))
  return steps
}

// ─── COUNT DIVISORS ────────────────────────────────────────
export function generateCountDivisorsSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 36)
  const steps = []
  let count = 0
  for (let i = 1; i * i <= N; i++) {
    if (N % i === 0) {
      count += (i * i === N) ? 1 : 2
      steps.push(mStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Divisor ${i}${i*i!==N ? ` and ${N/i}` : ''}, count=${count}` }))
    }
  }
  steps.push(mStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Divisors of ${N} = ${count}` }))
  return steps
}
