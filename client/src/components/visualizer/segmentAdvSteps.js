/**
 * segmentAdvSteps.js — Step generators for 29 Segment Tree & Advanced DS patterns (IDs 681-709)
 */
import { STEP_TYPES } from './visualizersData'

function sStep(type, data) {
  return { type, ...data }
}

function parseArr(input) {
  return Array.isArray(input) ? input : JSON.parse(input || '[]')
}

// ─── SEGMENT TREE BUILD ────────────────────────────────────
export function generateBuildSegTree2Steps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const steps = []
  const segTree = new Array(4 * n).fill(0)
  function build(node, l, r) {
    if (l === r) { segTree[node] = arr[l]; steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Leaf: seg[${node}] = ${arr[l]}` })); return }
    const mid = Math.floor((l + r) / 2)
    build(node * 2, l, mid)
    build(node * 2 + 1, mid + 1, r)
    segTree[node] = segTree[node * 2] + segTree[node * 2 + 1]
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Node ${node}: seg[${node}] = seg[${node*2}] + seg[${node*2+1}] = ${segTree[node*2]} + ${segTree[node*2+1]} = ${segTree[node]}` }))
  }
  if (n > 0) build(1, 0, n - 1)
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Segment tree built: [${segTree.filter(v => v !== 0).join(', ')}]` }))
  return steps
}

export function generateSegTreePointUpdateRangeSumSteps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const steps = []
  const segTree = new Array(4 * n).fill(0)
  function build(node, l, r) {
    if (l === r) { segTree[node] = arr[l]; return }
    const mid = Math.floor((l + r) / 2)
    build(node * 2, l, mid)
    build(node * 2 + 1, mid + 1, r)
    segTree[node] = segTree[node * 2] + segTree[node * 2 + 1]
  }
  function update(node, l, r, idx, val) {
    if (l === r) { segTree[node] = val; steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [idx], label: `Update idx ${idx} to ${val}` })); return }
    const mid = Math.floor((l + r) / 2)
    if (idx <= mid) update(node * 2, l, mid, idx, val)
    else update(node * 2 + 1, mid + 1, r, idx, val)
    segTree[node] = segTree[node * 2] + segTree[node * 2 + 1]
  }
  function query(node, l, r, ql, qr) {
    if (ql > r || qr < l) { steps.push(sStep(STEP_TYPES.ARRAY_COMPARE, { indices: [], label: `Query [${ql},${qr}] no overlap with [${l},${r}] → 0` })); return 0 }
    if (ql <= l && r <= qr) { steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Query [${ql},${qr}] fully covers [${l},${r}] → ${segTree[node]}` })); return segTree[node] }
    const mid = Math.floor((l + r) / 2)
    return query(node * 2, l, mid, ql, qr) + query(node * 2 + 1, mid + 1, r, ql, qr)
  }
  if (n > 0) {
    build(1, 0, n - 1)
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Tree built. Update idx=2 to 10, then query [0,3]` }))
    update(1, 0, n - 1, 2, 10)
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Updated. Tree: [${segTree.filter(v => v !== 0).join(', ')}]` }))
    const sum = query(1, 0, n - 1, 0, 3)
    steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Sum [0,3] = ${sum}` }))
  }
  return steps
}

// ─── FENWICK / BIT ─────────────────────────────────────────
export function generateBITPointUpdatePrefixSumSteps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const steps = [], bit = new Array(n + 1).fill(0)
  function update(i, val) {
    i++
    while (i <= n) { bit[i] += val; i += i & -i }
  }
  function prefix(i) {
    let sum = 0; i++
    while (i > 0) { sum += bit[i]; i -= i & -i }
    return sum
  }
  for (let i = 0; i < n; i++) update(i, arr[i])
  steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `BIT built: [${bit.slice(1).join(', ')}]` }))
  const sum = prefix(4)
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Prefix sum [0,4] = ${sum}` }))
  return steps
}

// ─── SPARSE TABLE ─────────────────────────────────────────
export function generateBuildSparseTableSteps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const steps = []
  const k = Math.floor(Math.log2(n)) + 1
  const st = Array.from({length: k}, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) st[0][i] = arr[i]
  steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Sparse table: row 0 = [${st[0]}]` }))
  for (let j = 1; j < k; j++) {
    for (let i = 0; i + (1 << j) <= n; i++) {
      st[j][i] = Math.min(st[j-1][i], st[j-1][i + (1 << (j-1))])
    }
    steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Row ${j}: [${st[j].filter(v => v !== 0).join(', ')}] (len ${1<<j})` }))
  }
  steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Sparse table built with ${k} rows` }))
  return steps
}

// ─── BLOCK DECOMPOSITION ──────────────────────────────────
export function generateBlockDecompSumSteps(nums) {
  const arr = parseArr(nums)
  const n = arr.length
  const blockSize = Math.ceil(Math.sqrt(n))
  const blocks = new Array(Math.ceil(n / blockSize)).fill(0)
  const steps = []
  for (let i = 0; i < n; i++) blocks[Math.floor(i / blockSize)] += arr[i]
  steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Block size=${blockSize}, blocks: [${blocks}]` }))
  const l = 1, r = 7
  let sum = 0
  for (let i = l; i <= r;) {
    if (i % blockSize === 0 && i + blockSize - 1 <= r) {
      sum += blocks[Math.floor(i / blockSize)]
      steps.push(sStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [i], label: `Add whole block ${Math.floor(i/blockSize)}: sum=${sum}` }))
      i += blockSize
    } else {
      sum += arr[i]; i++
    }
  }
  steps.push(sStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Sum [${l},${r}] = ${sum}` }))
  return steps
}
