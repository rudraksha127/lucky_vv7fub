/**
 * bitManipSteps.js — Step generators for 29 Bit Manipulation patterns (IDs 574-602)
 */
import { STEP_TYPES } from './visualizersData'

function bStep(type, data) {
  return { type, ...data }
}

function toBin(n, bits = 8) {
  return (n >>> 0).toString(2).padStart(bits, '0').slice(-bits)
}

// ─── SET / UNSET / TOGGLE / CHECK ──────────────────────────
export function generateSetIthBitSteps(num, i) {
  const n = Array.isArray(num) ? num[0] : parseInt(num)
  const bitIdx = Array.isArray(i) ? i[0] : (i !== undefined ? parseInt(i) : 1)
  const steps = []
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Before: ${n} = ${toBin(n)}` }))
  const result = n | (1 << bitIdx)
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Set bit ${bitIdx}: ${n} | (1<<${bitIdx}) = ${n} | ${1<<bitIdx} = ${result} = ${toBin(result)}` }))
  return steps
}

export function generateUnsetIthBitSteps(num, i) {
  const n = Array.isArray(num) ? num[0] : parseInt(num)
  const bitIdx = Array.isArray(i) ? i[0] : (i !== undefined ? parseInt(i) : 1)
  const steps = []
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Before: ${n} = ${toBin(n)}` }))
  const result = n & ~(1 << bitIdx)
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Unset bit ${bitIdx}: ${n} & ~(1<<${bitIdx}) = ${result} = ${toBin(result)}` }))
  return steps
}

export function generateToggleIthBitSteps(num, i) {
  const n = Array.isArray(num) ? num[0] : parseInt(num)
  const bitIdx = Array.isArray(i) ? i[0] : (i !== undefined ? parseInt(i) : 1)
  const steps = []
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Before: ${n} = ${toBin(n)}` }))
  const result = n ^ (1 << bitIdx)
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Toggle bit ${bitIdx}: ${n} ^ (1<<${bitIdx}) = ${result} = ${toBin(result)}` }))
  return steps
}

export function generateCheckIthBitSteps(num, i) {
  const n = Array.isArray(num) ? num[0] : parseInt(num)
  const bitIdx = Array.isArray(i) ? i[0] : (i !== undefined ? parseInt(i) : 2)
  const steps = []
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `${n} = ${toBin(n)}, check bit ${bitIdx}` }))
  const isSet = (n & (1 << bitIdx)) !== 0
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Bit ${bitIdx} is ${isSet ? '✅ SET' : '❌ UNSET'}` }))
  return steps
}

export function generateCountSetBitsSteps(num) {
  const n = Array.isArray(num) ? num[0] : parseInt(num)
  const steps = []
  let count = 0, x = n
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `${n} = ${toBin(n)}` }))
  while (x) {
    const lsb = x & -x
    x &= x - 1
    count++
    steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Clear ${lsb} (Brian Kernighan): x=${x} (${toBin(x)}), count=${count}` }))
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Set bits in ${n} = ${count}` }))
  return steps
}

// ─── SINGLE NUMBER (XOR) ──────────────────────────────────
export function generateSingleNumberSteps(nums) {
  const arr = Array.isArray(nums) ? nums : JSON.parse(nums || '[4,1,2,1,2]')
  const steps = []
  let result = 0
  for (const v of arr) {
    steps.push(bStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `XOR ${result} ^ ${v} = ${result ^ v}` }))
    result ^= v
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Single number = ${result}` }))
  return steps
}

export function generateTwoNonRepeatingSteps(nums) {
  const arr = Array.isArray(nums) ? nums : JSON.parse(nums || '[1,2,1,3,2,5]')
  const steps = []
  let xor = 0
  for (const v of arr) xor ^= v
  const rightmost = xor & -xor
  let a = 0, b = 0
  for (const v of arr) {
    if (v & rightmost) a ^= v
    else b ^= v
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `XOR = ${xor} (rightmost bit=${rightmost}), two numbers: ${a} and ${b}` }))
  return steps
}

// ─── FAST POWER ────────────────────────────────────────────
export function generateFastPowerSteps(base, exp) {
  const b = parseInt(base) || (Array.isArray(base) ? base[0] : 3)
  const e = parseInt(exp) || (Array.isArray(exp) ? exp[0] : 5)
  const steps = []
  let result = 1, power = b, expo = e
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Computing ${b}^${e}: start` }))
  while (expo > 0) {
    if (expo & 1) {
      result *= power
      steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Bit set: result = ${result}, power = ${power}` }))
    }
    power *= power
    expo >>= 1
    steps.push(bStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Power = ${power}, remaining exp = ${expo}` }))
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `${b}^${e} = ${result}` }))
  return steps
}

// ─── REVERSE BITS ──────────────────────────────────────────
export function generateReverseBits32Steps(num) {
  const n = parseInt(num) || (Array.isArray(num) ? num[0] : 43261596)
  const steps = []
  let result = 0, x = n
  steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Original: ${n} = ${toBin(n, 32)}` }))
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (x & 1)
    x >>= 1
    if (i % 8 === 7) steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `After ${i+1} bits: partial = ${toBin(result, 32)}` }))
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Reversed: ${n} → ${result} = ${toBin(result, 32)}` }))
  return steps
}

// ─── GRAY CODE ────────────────────────────────────────────
export function generateGrayCodeGenSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : 3)
  const steps = []
  const result = []
  for (let i = 0; i < (1 << N); i++) {
    result.push(i ^ (i >> 1))
    steps.push(bStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `G(${i}) = ${i} ^ (${i}>>1) = ${i} ^ ${i>>1} = ${result[i]} = ${toBin(result[i], N)}` }))
  }
  steps.push(bStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Gray code (${N}-bit): [${result}]` }))
  return steps
}
