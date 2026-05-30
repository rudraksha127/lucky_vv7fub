/**
 * trieSteps.js — Step generators for 15 Trie patterns (IDs 652-666)
 */
import { STEP_TYPES } from './visualizersData'

function tStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── TRIE INSERT / SEARCH ─────────────────────────────────
export function generateTrieInsertSteps(words) {
  const w = Array.isArray(words) ? words : JSON.parse(words || '["apple","app","apricot"]')
  const steps = []
  const root = {}
  for (const word of w) {
    let node = root
    steps.push(tStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Insert "${word}":` }))
    for (const c of word) {
      if (!node[c]) node[c] = {}
      node = node[c]
      steps.push(tStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `  Traverse to '${c}'` }))
    }
    node._end = true
    steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `  ✅ "${word}" inserted` }))
  }
  const count = Object.keys(root).length
  steps.push(tStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Trie built with ${count} root branches` }))
  return steps
}

export function generateTrieSearchSteps(words) {
  const w = Array.isArray(words) ? words : JSON.parse(words || '["apple","app"]')
  const steps = []
  const root = {}
  for (const word of w) {
    let node = root
    for (const c of word) {
      if (!node[c]) node[c] = {}
      node = node[c]
    }
    node._end = true
  }
  steps.push(tStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Searching in trie built from [${w}]` }))
  for (const word of w) {
    let node = root, found = true
    for (const c of word) {
      if (!node[c]) { found = false; break }
      node = node[c]
    }
    steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `"${word}" ${found && node._end ? '✅ found' : '❌ not found'}` }))
  }
  return steps
}

export function generateTriePrefixSteps(words) {
  const w = Array.isArray(words) ? words : JSON.parse(words || '["apple","app","apricot"]')
  const steps = []
  const root = {}
  for (const word of w) {
    let node = root
    for (const c of word) {
      if (!node[c]) node[c] = { _count: 0 }
      node = node[c]
      node._count = (node._count || 0) + 1
    }
    node._end = true
  }
  const prefix = 'ap'
  let node = root, count = 0
  for (const c of prefix) {
    if (!node[c]) { count = 0; break }
    node = node[c]
    count = node._count || 0
  }
  steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Words with prefix "${prefix}": ${count}` }))
  return steps
}

// ─── LONGEST COMMON PREFIX ─────────────────────────────────
export function generateLongestCommonPrefixAllSteps(words) {
  const w = Array.isArray(words) ? words : JSON.parse(words || '["flower","flow","flight"]')
  const steps = []
  if (!w.length) { steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: 'Empty array' })); return steps }
  let prefix = w[0]
  for (let i = 1; i < w.length; i++) {
    while (w[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      steps.push(tStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Shrink prefix to "${prefix}"` }))
      if (!prefix) {
        steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: 'No common prefix' }))
        return steps
      }
    }
  }
  steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Longest common prefix: "${prefix}"` }))
  return steps
}

// ─── MAX XOR ──────────────────────────────────────────────
export function generateMaxXorTwoNumbersSteps(nums) {
  const arr = Array.isArray(nums) ? nums : JSON.parse(nums || '[3,10,5,25,2,8]')
  const steps = []
  let max = 0, mask = 0
  for (let i = 31; i >= 0; i--) {
    mask |= (1 << i)
    const set = new Set(arr.map(v => v & mask))
    const candidate = max | (1 << i)
    for (const prefix of set) {
      if (set.has(prefix ^ candidate)) {
        max = candidate
        steps.push(tStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Bit ${i}: candidate=${candidate}, max XOR=${max}` }))
        break
      }
    }
  }
  steps.push(tStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Maximum XOR = ${max}` }))
  return steps
}
