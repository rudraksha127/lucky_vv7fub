/**
 * stringsSteps.js — Step generators for all 64 String patterns (IDs 107-170)
 * Each generator returns visualization steps using STEP_TYPES conventions.
 */
import { STEP_TYPES } from './visualizersData'

function strStep(type, data) {
  return { type, ...data }
}

// ─── KMP (107-111) ────────────────────────────────────────
export function generateKMPSearchSteps(text, pattern) {
  const steps = []
  const n = text.length, m = pattern.length
  // Build LPS array
  const lps = new Array(m).fill(0)
  let len = 0, i = 1
  steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Building LPS array for pattern "${pattern}"` }))
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++
      steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [i-1], label: `LPS[${i-1}] = ${len} (match at ${i-1})` }))
    } else {
      if (len !== 0) { len = lps[len - 1] }
      else { lps[i] = 0; i++ }
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `LPS = [${lps}]` }))
  // Search phase
  i = 0; let j = 0
  while (i < n) {
    if (pattern[j] === text[i]) { i++; j++ }
    if (j === m) {
      steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [i - j], label: `✅ Pattern found at index ${i - j}` }))
      j = lps[j - 1]
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) j = lps[j - 1]
      else i++
    }
  }
  return steps
}

export function generateLPSArraySteps(input) {
  const steps = []
  const pattern = typeof input === 'string' ? input : input.toString()
  const m = pattern.length
  const lps = new Array(m).fill(0)
  let len = 0, i = 1
  steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [0], label: `Pattern: ${pattern}` }))
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++
      steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [i-1], label: `LPS[${i-1}] = ${len}` }))
    } else {
      if (len !== 0) len = lps[len - 1]
      else { lps[i] = 0; i++ }
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Final LPS = [${lps}]` }))
  return steps
}

// ─── RABIN-KARP (112-115) ─────────────────────────────────
export function generateRKSinglePatternSteps(text, pattern) {
  const steps = []
  const d = 256, q = 101
  const n = text.length, m = pattern.length
  let p = 0, t = 0, h = 1
  for (let i = 0; i < m - 1; i++) h = (h * d) % q
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q
    t = (d * t + text.charCodeAt(i)) % q
  }
  steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Pattern hash: ${p}, Initial text hash: ${t}` }))
  for (let i = 0; i <= n - m; i++) {
    if (p === t) {
      let match = true
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) { match = false; break }
      }
      steps.push(strStep(match ? STEP_TYPES.ARRAY_HIGHLIGHT : STEP_TYPES.ARRAY_COMPARE, {
        indices: [i], label: match ? `✅ Match at ${i}` : `Hash collision at ${i} (spurious hit)`
      }))
      if (match) return steps
    }
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q
      if (t < 0) t += q
      steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [i + 1], label: `Sliding hash to ${i + 1}: hash=${t}` }))
    }
  }
  return steps
}

export function generateRepeatedDNASteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = [], seen = new Set(), repeated = new Set()
  for (let i = 0; i + 10 <= s.length; i++) {
    const sub = s.substring(i, i + 10)
    if (seen.has(sub) && !repeated.has(sub)) {
      repeated.add(sub)
      steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [i], label: `Repeated: ${sub} at ${i}` }))
    }
    seen.add(sub)
  }
  if (repeated.size === 0) steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [], label: 'No repeated sequences found' }))
  return steps
}

// ─── ANAGRAM / PERMUTATION (122-125) ──────────────────────
export function generateCheckAnagramSteps(s1, s2) {
  const steps = []
  const freq = {}
  for (const c of s1) { freq[c] = (freq[c] || 0) + 1 }
  steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [], label: `Frequency of "${s1}": ${JSON.stringify(freq)}` }))
  for (const c of s2) {
    if (!freq[c]) {
      steps.push(strStep(STEP_TYPES.ARRAY_COMPARE, { indices: [], label: `❌ "${c}" not in freq → Not anagram` }))
      return steps
    }
    freq[c]--
    if (freq[c] === 0) delete freq[c]
  }
  const isAnagram = Object.keys(freq).length === 0
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: isAnagram ? '✅ Anagram!' : '❌ Not anagram (remaining chars)' }))
  return steps
}

export function generateGroupAnagramsSteps(input) {
  const words = Array.isArray(input) ? input : JSON.parse(input || '[]')
  const steps = [], groups = {}
  for (const w of words) {
    const key = w.split('').sort().join('')
    if (!groups[key]) groups[key] = []
    groups[key].push(w)
    steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `"${w}" → key "${key}" → group ${groups[key].length}` }))
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Groups: ${Object.values(groups).map(g => `[${g}]`).join(', ')}` }))
  return steps
}

// ─── PALINDROME (126-130) ─────────────────────────────────
export function generatePalindromeCheckSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = []
  let l = 0, r = s.length - 1
  while (l < r) {
    steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], labels: [`L=${l}`, `R=${r}`], label: `Compare '${s[l]}' vs '${s[r]}'` }))
    if (s[l] !== s[r]) {
      steps.push(strStep(STEP_TYPES.ARRAY_COMPARE, { indices: [], label: `❌ Not a palindrome` }))
      return steps
    }
    l++; r--
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Is a palindrome!` }))
  return steps
}

export function generateLongestPalSubstrExpandSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = []
  let start = 0, maxLen = 1
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1 }
      steps.push(strStep(STEP_TYPES.ARRAY_POINTER, { indices: [l, r], label: `Expand: [${l},${r}] = "${s.substring(l, r+1)}" (len=${r-l+1})` }))
      l--; r++
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i)
    if (i + 1 < s.length) expand(i, i + 1)
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [start, start+maxLen-1], label: `✅ Longest: "${s.substring(start, start+maxLen)}" at [${start},${start+maxLen-1}]` }))
  return steps
}

// ─── VALID PARENTHESES (140-144) ─────────────────────────
export function generateValidParenthesesSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = [], stack = []
  const pairs = { ')': '(', ']': '[', '}': '{' }
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c)
      steps.push(strStep(STEP_TYPES.STACK_PUSH, { value: c, label: `Push: ${c}, stack: [${stack.join(',')}]` }))
    } else {
      const top = stack.pop()
      const valid = top === pairs[c]
      steps.push(strStep(valid ? STEP_TYPES.STACK_POP : STEP_TYPES.STACK_PUSH, {
        value: c, label: valid ? `Pop: ${top} matches ${c}` : `❌ Mismatch: ${top} vs ${c}`
      }))
      if (!valid) return steps
    }
  }
  const valid = stack.length === 0
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: valid ? '✅ Valid parentheses!' : `❌ Unmatched left: [${stack.join(',')}]` }))
  return steps
}

// ─── LCS (145-148) ────────────────────────────────────────
export function generateLCSSteps(s1, s2) {
  const steps = []
  const m = s1.length, n = s2.length
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1
        steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [i, j], label: `Match '${s1[i-1]}': dp[${i}][${j}] = ${dp[i][j]}` }))
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
      }
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `LCS length = ${dp[m][n]}` }))
  return steps
}

// ─── EDIT DISTANCE (149-152) ─────────────────────────────
export function generateMinEditDistanceSteps(s1, s2) {
  const steps = []
  const m = s1.length, n = s2.length
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
      }
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Edit distance: ${s1} → ${s2} = ${dp[m][n]}` }))
  return steps
}

// ─── STRING COMPRESSION / RLE (137-139) ────────────────────
export function generateRunLengthEncodingSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = []
  let result = '', count = 1
  for (let i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] === s[i-1]) {
      count++
    } else {
      result += s[i-1] + count
      steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [i-1], label: `'${s[i-1]}' × ${count} → "${result}"` }))
      count = 1
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Encoded: "${result}"` }))
  return steps
}

// ─── WILDCARD / REGEX (169-170) ──────────────────────────
export function generateWildcardMatchSteps(s, p) {
  const steps = []
  const m = s.length, n = p.length
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false))
  dp[0][0] = true
  for (let j = 1; j <= n; j++) if (p[j-1] === '*') dp[0][j] = dp[0][j-1]
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j-1] === '*') dp[i][j] = dp[i-1][j] || dp[i][j-1]
      else if (p[j-1] === '?' || s[i-1] === p[j-1]) dp[i][j] = dp[i-1][j-1]
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: dp[m][n] ? `✅ "${s}" matches "${p}"` : `❌ "${s}" does NOT match "${p}"` }))
  return steps
}

// ─── LEXICOGRAPHIC — ALIEN DICTIONARY (167) ──────────────
export function generateAlienDictionaryOrderSteps(words) {
  const steps = []
  const adj = {}, indeg = {}
  for (const w of words) {
    for (const c of w) { if (!adj[c]) adj[c] = []; if (!(c in indeg)) indeg[c] = 0 }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i+1]
    let found = false
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        adj[a[j]].push(b[j])
        indeg[b[j]]++
        steps.push(strStep(STEP_TYPES.GRAPH_TRAVERSE, { from: a[j], to: b[j], label: `Edge ${a[j]} → ${b[j]}` }))
        found = true; break
      }
    }
    if (!found && a.length > b.length) {
      steps.push(strStep(STEP_TYPES.ARRAY_COMPARE, { indices: [], label: '❌ Invalid order' }))
      return steps
    }
  }
  const queue = Object.keys(indeg).filter(k => indeg[k] === 0)
  const order = []
  while (queue.length) {
    const c = queue.shift()
    order.push(c)
    for (const nb of (adj[c] || [])) {
      indeg[nb]--
      if (indeg[nb] === 0) queue.push(nb)
    }
  }
  steps.push(strStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: order.length === Object.keys(indeg).length ? `Order: ${order.join(' → ')}` : '❌ Cycle detected' }))
  return steps
}

// ─── SUFFIX ARRAY (156-160) ──────────────────────────────
export function generateBuildSuffixArraySteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = []
  const suffixes = []
  for (let i = 0; i < s.length; i++) suffixes.push({ idx: i, suffix: s.substring(i) })
  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix))
  for (const sf of suffixes) {
    steps.push(strStep(STEP_TYPES.ARRAY_SET, { indices: [sf.idx], label: `Suffix[${sf.idx}] = "${sf.suffix}"` }))
  }
  return steps
}
