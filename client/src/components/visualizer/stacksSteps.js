/**
 * stacksSteps.js — Step generators for 24 Stack patterns (IDs 198-220)
 */
import { STEP_TYPES } from './visualizersData'

function sStep(type, data) {
  return { type, ...data }
}

// ─── NEXT GREATER ELEMENT ──────────────────────────────────
export function generateNextGreater1Steps(nums, queryNums) {
  const steps = []
  const arr = Array.isArray(nums) ? nums : JSON.parse(nums || '[]')
  const stack = [], result = {}
  for (let i = arr.length - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] <= arr[i]) {
      const popped = stack.pop()
      steps.push(sStep(STEP_TYPES.STACK_POP, { value: popped, label: `Pop ${popped} (≤ ${arr[i]})` }))
    }
    result[arr[i]] = stack.length ? stack[stack.length - 1] : -1
    stack.push(arr[i])
    steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: arr[i], label: `Push ${arr[i]}, NGE=${result[arr[i]]}` }))
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `NGE map: ${JSON.stringify(result)}` }))
  return steps
}

export function generateNextGreater2Steps(nums) {
  const arr = Array.isArray(nums) ? nums : JSON.parse(nums || '[]')
  const n = arr.length, result = new Array(n).fill(-1), stack = []
  const steps = []
  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n
    while (stack.length && arr[stack[stack.length - 1]] < arr[idx]) {
      const top = stack.pop()
      result[top] = arr[idx]
      steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [top], label: `NGE of ${arr[top]} = ${arr[idx]}` }))
    }
    if (i < n) {
      stack.push(idx)
      steps.push(sStep(STEP_TYPES.ARRAY_POINTER, { indices: [idx], label: `Push index ${idx} (value ${arr[idx]})` }))
    }
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Result: [${result}]` }))
  return steps
}

export function generateLargestRectHistSteps(heights) {
  const arr = Array.isArray(heights) ? heights : JSON.parse(heights || '[]')
  const steps = [], stack = []
  let maxArea = 0
  for (let i = 0; i <= arr.length; i++) {
    const h = i < arr.length ? arr[i] : 0
    while (stack.length && h < arr[stack[stack.length - 1]]) {
      const height = arr[stack.pop()]
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i
      const area = height * width
      maxArea = Math.max(maxArea, area)
      steps.push(sStep(STEP_TYPES.ARRAY_SWAP, { indices: [i], label: `Height=${height}, Width=${width}, Area=${area}, Max=${maxArea}` }))
    }
    stack.push(i)
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Largest Rectangle Area = ${maxArea}` }))
  return steps
}

// ─── INFIX TO POSTFIX ─────────────────────────────────────
export function generateInfixToPostfixSteps(expr) {
  const s = typeof expr === 'string' ? expr : expr.toString()
  const steps = [], stack = [], output = []
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
  for (const c of s) {
    if (/[a-zA-Z0-9]/.test(c)) {
      output.push(c)
      steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Output: ${output.join('')}` }))
    } else if (c === '(') {
      stack.push(c)
      steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: c, label: `Push ( to stack` }))
    } else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop())
        steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Pop → Output: ${output.join('')}` }))
      }
      stack.pop()
    } else if (prec[c]) {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[c] && c !== '^') {
        output.push(stack.pop())
        steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Output: ${output.join('')}` }))
      }
      stack.push(c)
      steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: c, label: `Push ${c} to stack` }))
    }
  }
  while (stack.length) {
    output.push(stack.pop())
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Output: ${output.join('')}` }))
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Postfix: ${output.join('')}` }))
  return steps
}

export function generatePostfixEvalSteps(expr) {
  const s = typeof expr === 'string' ? expr : expr.toString()
  const steps = [], stack = []
  for (const c of s) {
    if (/\d/.test(c)) {
      stack.push(parseInt(c))
      steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: parseInt(c), label: `Push ${c}, stack: [${stack}]` }))
    } else {
      const b = stack.pop(), a = stack.pop()
      let r = 0
      if (c === '+') r = a + b; else if (c === '-') r = a - b; else if (c === '*') r = a * b; else if (c === '/') r = Math.floor(a / b)
      stack.push(r)
      steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `${a} ${c} ${b} = ${r}, stack: [${stack}]` }))
    }
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Result = ${stack[0]}` }))
  return steps
}

// ─── BASIC CALCULATOR ─────────────────────────────────────
export function generateBasicCalc1Steps(expr) {
  const s = typeof expr === 'string' ? expr : expr.toString().replace(/\s/g, '')
  const steps = []
  let sum = 0, sign = 1, i = 0
  while (i < s.length) {
    if (/\d/.test(s[i])) {
      let num = 0
      while (i < s.length && /\d/.test(s[i])) { num = num * 10 + parseInt(s[i]); i++ }
      sum += sign * num
      steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Add ${sign * num}, running sum = ${sum}` }))
      continue
    }
    if (s[i] === '+') sign = 1
    else if (s[i] === '-') sign = -1
    i++
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Result = ${sum}` }))
  return steps
}

// ─── MIN STACK ─────────────────────────────────────────────
export function generateMinStackSteps(ops) {
  const arr = Array.isArray(ops) ? ops : JSON.parse(ops || '[]')
  const steps = [], stack = [], minStack = []
  for (const val of arr) {
    stack.push(val)
    const min = minStack.length ? Math.min(minStack[minStack.length - 1], val) : val
    minStack.push(min)
    steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: val, label: `Push ${val}, Min=${min}, Stack: [${stack}]` }))
  }
  while (stack.length) {
    const val = stack.pop(); const min = minStack.pop()
    steps.push(sStep(STEP_TYPES.STACK_POP, { value: val, label: `Pop ${val}, Min became ${minStack.length ? minStack[minStack.length-1] : 'Empty'}` }))
  }
  return steps
}

// ─── DECODE STRING ─────────────────────────────────────────
export function generateDecodeKEncodedSteps(s) {
  const str = typeof s === 'string' ? s : s.toString()
  const steps = [], stack = []
  let num = 0, curr = ''
  for (const c of str) {
    if (/\d/.test(c)) { num = num * 10 + parseInt(c) }
    else if (c === '[') {
      stack.push([curr, num])
      steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: `"${curr}" ×${num}`, label: `Save: curr="${curr}", num=${num}` }))
      curr = ''; num = 0
    } else if (c === ']') {
      const [prev, k] = stack.pop()
      curr = prev + curr.repeat(k)
      steps.push(sStep(STEP_TYPES.STACK_POP, { value: `]`, label: `Decode: "${prev}" + "${curr.slice(prev.length)}" = "${curr}"` }))
    } else { curr += c }
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Decoded: "${curr}"` }))
  return steps
}

// ─── VALID PARENTHESES (BALANCED PARENS CHECK) ──────────────
export function generateValidParenthesesSteps(s) {
  const str = typeof s === 'string' ? s : s.toString()
  const steps = [], stack = []
  const map = { ')': '(', ']': '[', '}': '{' }
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c)
      steps.push(sStep(STEP_TYPES.STACK_PUSH, { value: c, label: `Push '${c}'`, indices: [i] }))
    } else if (c === ')' || c === ']' || c === '}') {
      if (stack.length && stack[stack.length - 1] === map[c]) {
        const top = stack.pop()
        steps.push(sStep(STEP_TYPES.STACK_POP, { value: top, label: `Match '${map[c]}' with '${c}' → pop`, indices: [i] }))
      } else {
        steps.push(sStep(STEP_TYPES.ARRAY_COMPARE, { indices: [i], label: `Mismatch! '${c}' doesn't match top '${stack.length ? stack[stack.length-1] : 'empty'}'` }))
      }
    }
  }
  const valid = stack.length === 0
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: valid ? '✅ Valid parentheses!' : `❌ Invalid: ${stack.length} unmatched opening(s) remaining: [${stack.join(', ')}]` }))
  return steps
}

// ─── STOCK SPAN ────────────────────────────────────────────
export function generateStockSpanSteps(prices) {
  const arr = Array.isArray(prices) ? prices : JSON.parse(prices || '[]')
  const steps = [], stack = [], span = []
  for (let i = 0; i < arr.length; i++) {
    let count = 1
    while (stack.length && arr[stack[stack.length - 1]] <= arr[i]) {
      count += span[stack.pop()]
    }
    stack.push(i)
    span[i] = count
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [i], label: `Price ${arr[i]}, Span=${count}${count > 1 ? ' (consecutive lower)' : ''}` }))
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Spans: [${span}]` }))
  return steps
}

export function generateDailyTempsSteps(temps) {
  const arr = Array.isArray(temps) ? temps : JSON.parse(temps || '[]')
  const steps = [], result = new Array(arr.length).fill(0), stack = []
  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {
      const idx = stack.pop()
      result[idx] = i - idx
      steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [idx], label: `Temp ${arr[idx]} → warmer in ${result[idx]} day(s)` }))
    }
    stack.push(i)
    steps.push(sStep(STEP_TYPES.ARRAY_POINTER, { indices: [i], label: `Push day ${i} (${arr[i]}°C)` }))
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Days to warmer: [${result}]` }))
  return steps
}
