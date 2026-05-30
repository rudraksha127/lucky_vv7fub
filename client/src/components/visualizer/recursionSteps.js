/**
 * recursionSteps.js — Step generators for 26 Recursion & Backtracking patterns (IDs 226-251)
 */
import { STEP_TYPES } from './visualizersData'

function rStep(type, data) {
  return { type, ...data }
}

// ─── SUBSETS (226-229) ─────────────────────────────────────
export function generateAllSubsetsSteps(input) {
  const arr = Array.isArray(input) ? input : JSON.parse(input || '[]')
  const steps = [], result = []
  function backtrack(start, cur) {
    result.push([...cur])
    steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Subset: [${cur}]`, depth: start }))
    for (let i = start; i < arr.length; i++) {
      cur.push(arr[i])
      backtrack(i + 1, cur)
      cur.pop()
    }
  }
  backtrack(0, [])
  steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total subsets: ${result.length} → [${result.map(r => `[${r}]`).join(', ')}]` }))
  return steps
}

export function generateSubsetsWithDupsSteps(input) {
  const arr = Array.isArray(input) ? [...input].sort((a,b)=>a-b) : JSON.parse(input || '[]').sort((a,b)=>a-b)
  const steps = [], result = []
  function backtrack(start, cur) {
    result.push([...cur])
    steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Subset: [${cur}]`, depth: start }))
    for (let i = start; i < arr.length; i++) {
      if (i > start && arr[i] === arr[i-1]) continue
      cur.push(arr[i])
      backtrack(i + 1, cur)
      cur.pop()
    }
  }
  backtrack(0, [])
  steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total unique subsets: ${result.length}` }))
  return steps
}

// ─── PERMUTATIONS (230-234) ────────────────────────────────
export function generateAllPermutationsSteps(input) {
  const arr = Array.isArray(input) ? input : JSON.parse(input || '[]')
  const steps = [], result = [], used = new Array(arr.length).fill(false)
  function backtrack(cur) {
    if (cur.length === arr.length) {
      result.push([...cur])
      steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Perm: [${cur}]` }))
      return
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue
      used[i] = true; cur.push(arr[i])
      steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Pick ${arr[i]} → [${cur}]`, depth: cur.length-1 }))
      backtrack(cur)
      cur.pop(); used[i] = false
    }
  }
  backtrack([])
  steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Total permutations: ${result.length}` }))
  return steps
}

// ─── COMBINATIONS (235-239) ────────────────────────────────
export function generateCombinationsNCRSteps(n, k) {
  const N = typeof n === 'object' ? n[0] : parseInt(n)
  const K = typeof k === 'object' ? k[0] : parseInt(k)
  const steps = [], result = []
  function backtrack(start, cur) {
    if (cur.length === K) {
      result.push([...cur])
      steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Comb: [${cur}]` }))
      return
    }
    for (let i = start; i <= N; i++) {
      cur.push(i)
      steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Pick ${i} → [${cur}]`, depth: cur.length-1 }))
      backtrack(i + 1, cur)
      cur.pop()
    }
  }
  backtrack(1, [])
  steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `C(${N},${K}) = ${result.length} combinations` }))
  return steps
}

export function generateComboSumUnlimitedSteps(candidates, target) {
  const arr = Array.isArray(candidates) ? candidates : JSON.parse(candidates || '[]')
  const t = typeof target === 'number' ? target : (Array.isArray(target) ? target[0] : parseInt(target) || 7)
  const steps = [], result = []
  function backtrack(start, cur, sum) {
    if (sum === t) {
      result.push([...cur])
      steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Sum ${t}: [${cur}]` }))
      return
    }
    if (sum > t) return
    for (let i = start; i < arr.length; i++) {
      cur.push(arr[i])
      steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Pick ${arr[i]}, sum=${sum+arr[i]}`, depth: cur.length-1 }))
      backtrack(i, cur, sum + arr[i])
      cur.pop()
    }
  }
  backtrack(0, [], 0)
  steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Total combos: ${result.length}` }))
  return steps
}

// ─── N-QUEENS (240-241) ────────────────────────────────────
export function generateNQueensSteps(n) {
  const N = parseInt(n) || (Array.isArray(n) ? n[0] : typeof n === 'number' ? n : 4)
  const steps = [], cols = new Set(), diag1 = new Set(), diag2 = new Set()
  const board = Array.from({length: N}, () => new Array(N).fill('.'))
  let count = 0
  function backtrack(row) {
    if (row === N) {
      count++
      steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Solution ${count}: ${board.map(r => r.join('')).join(' | ')}` }))
      return
    }
    for (let col = 0; col < N; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) continue
      board[row][col] = 'Q'
      cols.add(col); diag1.add(row + col); diag2.add(row - col)
      steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Place Q at row=${row}, col=${col}`, depth: row }))
      backtrack(row + 1)
      board[row][col] = '.'
      cols.delete(col); diag1.delete(row + col); diag2.delete(row - col)
    }
  }
  backtrack(0)
  steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Total solutions for ${N}-Queens: ${count}` }))
  return steps
}

// ─── WORD SEARCH (245) ─────────────────────────────────────
export function generateWordSearchSteps(board, word) {
  const grid = Array.isArray(board) ? board : JSON.parse(board || '[["A","B"],["C","D"]]')
  const w = typeof word === 'string' ? word : (Array.isArray(word) ? word[0] : 'ABC')
  const steps = []
  function dfs(r, c, idx) {
    if (idx === w.length) return true
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== w[idx]) return false
    const temp = grid[r][c]; grid[r][c] = '#'
    steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Match '${w[idx]}' at (${r},${c}) idx=${idx}`, depth: idx }))
    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1)
    grid[r][c] = temp
    if (idx === w.length - 1) steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: found ? `✅ Word "${w}" found!` : `❌ Dead end at (${r},${c})` }))
    return found
  }
  let found = false
  for (let i = 0; i < grid.length && !found; i++)
    for (let j = 0; j < grid[0].length && !found; j++)
      if (grid[i][j] === w[0]) found = dfs(i, j, 0)
  if (!found) steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `❌ Word "${w}" not found` }))
  return steps
}

// ─── RAT IN A MAZE (244) ──────────────────────────────────
export function generateRatInMazeSteps(input) {
  const maze = Array.isArray(input) ? input : JSON.parse(input || '[[1,0,0],[1,1,0],[0,1,1]]')
  const steps = [], n = maze.length, paths = []
  const dirs = [['D',1,0],['R',0,1],['U',-1,0],['L',0,-1]]
  function dfs(r, c, path, visited) {
    if (r === n-1 && c === n-1) {
      paths.push(path)
      steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `✅ Path found: ${path}` }))
      return
    }
    for (const [d, dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && maze[nr][nc] === 1 && !visited[nr][nc]) {
        visited[nr][nc] = true
        steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `Move ${d} to (${nr},${nc}), path: ${path+d}`, depth: path.length }))
        dfs(nr, nc, path + d, visited)
        visited[nr][nc] = false
      }
    }
  }
  const visited = Array.from({length: n}, () => new Array(n).fill(false))
  if (maze[0][0] === 1) { visited[0][0] = true; dfs(0, 0, '', visited) }
  steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: paths.length ? `All paths: ${paths.join(', ')}` : 'No path found' }))
  return steps
}

// ─── PALINDROME PARTITIONING (248) ─────────────────────────
export function generateAllPalPartitionsSteps(input) {
  const s = typeof input === 'string' ? input : input.toString()
  const steps = [], result = []
  function isPal(str) { let l=0,r=str.length-1; while(l<r) if(str[l++]!==str[r--]) return false; return true }
  function backtrack(start, cur) {
    if (start === s.length) {
      result.push([...cur])
      steps.push(rStep(STEP_TYPES.ARRAY_HIGHLIGHT, { indices: [], label: `Partition: ${cur.join(' | ')}` }))
      return
    }
    for (let end = start; end < s.length; end++) {
      const sub = s.substring(start, end + 1)
      if (isPal(sub)) {
        cur.push(sub)
        steps.push(rStep(STEP_TYPES.RECURSE_CALL, { label: `"${sub}" is palindrome`, depth: cur.length-1 }))
        backtrack(end + 1, cur)
        cur.pop()
      }
    }
  }
  backtrack(0, [])
  steps.push(rStep(STEP_TYPES.ARRAY_SET, { indices: [], label: `Total partitions: ${result.length}` }))
  return steps
}
