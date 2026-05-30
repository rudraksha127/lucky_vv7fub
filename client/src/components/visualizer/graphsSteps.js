/**
 * graphsSteps.js — Step generators for 66 Graph patterns.
 */
import { STEP_TYPES } from './visualizersData'

function graphStep(type, data) {
  return { type, ...data }
}

function parseAdjList(input) {
  if (typeof input === 'string') {
    try { return JSON.parse(input) }
    catch { return {} }
  }
  return input
}

// ─── BFS (388-392) ──────────────────────────────────────
export function generateShortestPathUnweightedSteps(adjList) {
  const adj = parseAdjList(adjList)
  const steps = []
  const visited = new Set()
  const keys = Object.keys(adj)
  if (!keys.length) return steps
  const start = keys[0]
  const queue = [start]
  visited.add(start)
  steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: start, label: `Start BFS from ${start}` }))
  while (queue.length) {
    const node = queue.shift()
    const neighbors = adj[node] || []
    for (const nb of neighbors) {
      steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `Edge ${node}→${nb}` }))
      if (!visited.has(nb)) {
        visited.add(nb)
        queue.push(nb)
        steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: nb, label: `Visit ${nb}`, queued: true }))
      }
    }
  }
  return steps
}

export function generateBipartiteBFSSteps(adjList) {
  const adj = parseAdjList(adjList)
  const steps = []
  const color = {}
  const keys = Object.keys(adj)
  for (const start of keys) {
    if (color[start] !== undefined) continue
    color[start] = 0
    const queue = [start]
    while (queue.length) {
      const node = queue.shift()
      for (const nb of (adj[node] || [])) {
        if (color[nb] === undefined) {
          color[nb] = 1 - color[node]
          queue.push(nb)
          steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: nb, label: `Color ${nb}=${color[nb]}`, color: color[nb] }))
        } else if (color[nb] === color[node]) {
          steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `❌ Not bipartite! ${node} & ${nb} same color ${color[node]}` }))
          return steps
        }
      }
    }
  }
  steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: '', label: '✅ Graph is bipartite!' }))
  return steps
}

// ─── DIJKSTRA (401-405) ─────────────────────────────────
export function generateDijkstraSteps(adjList) {
  const steps = []
  const adj = parseAdjList(adjList)
  const dist = {}
  const visited = new Set()
  const keys = Object.keys(adj)
  if (!keys.length) return steps
  const start = keys[0]
  for (const k of keys) dist[k] = Infinity
  dist[start] = 0
  const pq = [{ node: start, d: 0 }]
  steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: start, label: `Start Dijkstra: dist[${start}]=0` }))
  while (pq.length) {
    pq.sort((a, b) => a.d - b.d)
    const { node } = pq.shift()
    if (visited.has(node)) continue
    visited.add(node)
    steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node, label: `Process ${node}: dist=${dist[node]}` }))
    for (const edge of (adj[node] || [])) {
      const v = edge.v || edge.to || edge.node
      const w = edge.w || edge.weight || edge.c || 1
      if (dist[node] + w < (dist[v] || Infinity)) {
        dist[v] = dist[node] + w
        pq.push({ node: v, d: dist[v] })
        steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: v, label: `Update dist[${v}]=${dist[v]}` }))
      }
    }
  }
  return steps
}

// ─── DFS (393-397) ──────────────────────────────────────
export function generateConnectedComponentsSteps(adjList) {
  const adj = parseAdjList(adjList)
  const steps = []
  const visited = new Set()
  let comp = 0
  function dfs(node) {
    visited.add(node)
    steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node, label: `Component ${comp+1}: visit ${node}` }))
    for (const nb of (adj[node] || [])) {
      steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `Explore ${node}→${nb}` }))
      if (!visited.has(nb)) dfs(nb)
    }
  }
  for (const k of Object.keys(adj)) {
    if (!visited.has(k)) { comp++; dfs(k) }
  }
  steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: '', label: `Total components: ${comp}` }))
  return steps
}

// ─── KAHN'S TOPO (426-429) ──────────────────────────────
export function generateKahnTopoSteps(adjList) {
  const adj = parseAdjList(adjList)
  const steps = []
  const indegree = {}
  for (const k of Object.keys(adj)) indegree[k] = 0
  for (const k of Object.keys(adj)) {
    for (const nb of (adj[k] || [])) {
      indegree[nb] = (indegree[nb] || 0) + 1
    }
  }
  const queue = Object.keys(indegree).filter(k => indegree[k] === 0)
  const order = []
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node, label: `Topo: ${node} (indegree=0)` }))
    for (const nb of (adj[node] || [])) {
      indegree[nb]--
      steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `Decrease indegree[${nb}]=${indegree[nb]}` }))
      if (indegree[nb] === 0) queue.push(nb)
    }
  }
  return steps
}

// ─── DSU (437-442) ──────────────────────────────────────
export function generateDSUFindSteps(edges) {
  const steps = []
  const parent = {}
  function find(x) {
    if (parent[x] !== x) {
      const orig = parent[x]
      parent[x] = find(parent[x])
      steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: x.toString(), label: `Find(${x}): path compress ${orig}→${parent[x]}` }))
    }
    return parent[x]
  }
  function union(a, b) {
    const pa = find(a), pb = find(b)
    if (pa !== pb) { parent[pa] = pb; steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: a.toString(), to: b.toString(), label: `Union(${a},${b}) → ${pa}→${pb}` })) }
  }
  for (const [a, b] of edges) {
    if (!(a in parent)) parent[a] = a
    if (!(b in parent)) parent[b] = b
    union(a, b)
  }
  return steps
}

// ─── CYCLE DETECTION (419-423) ──────────────────────────
export function generateCycleDetectionDFSSteps(adjList) {
  const adj = parseAdjList(adjList)
  const steps = []
  const WHITE = 0, GRAY = 1, BLACK = 2
  const color = {}
  for (const k of Object.keys(adj)) color[k] = WHITE
  function dfs(node) {
    color[node] = GRAY
    steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node, label: `DFS: ${node} → GRAY` }))
    for (const nb of (adj[node] || [])) {
      if (!(nb in color)) { steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `Explore ${node}→${nb}` })); color[nb] = WHITE }
      if (color[nb] === GRAY) {
        steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: node, to: nb, label: `❌ Back edge ${node}→${nb}: cycle!` }))
        return true
      }
      if (color[nb] === WHITE) if (dfs(nb)) return true
    }
    color[node] = BLACK
    return false
  }
  for (const k of Object.keys(adj)) {
    if (color[k] === WHITE && dfs(k)) break
  }
  return steps
}

// ─── KRUSKAL'S MST (415-416) ────────────────────────────
export function generateKruskalSteps(edges) {
  const steps = []
  const sorted = [...edges].sort((a, b) => a[2] - b[2])
  const parent = {}
  function find(x) { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x] }
  let mstWeight = 0
  for (const [u, v, w] of sorted) {
    if (!(u in parent)) parent[u] = u
    if (!(v in parent)) parent[v] = v
    const pu = find(u), pv = find(v)
    if (pu !== pv) {
      parent[pu] = pv
      mstWeight += w
      steps.push(graphStep(STEP_TYPES.GRAPH_TRAVERSE, { from: u.toString(), to: v.toString(), label: `MST edge (${u},${v},${w}): total=${mstWeight}` }))
    }
  }
  return steps
}

// ─── SCC KOSARAJU (430-431) ─────────────────────────────
export function generateKosarajuSteps(adjList) {
  const steps = []
  const adj = parseAdjList(adjList)
  const visited = new Set()
  const stack = []
  function dfs1(node) {
    visited.add(node)
    for (const nb of (adj[node] || [])) {
      if (!visited.has(nb)) dfs1(nb)
    }
    stack.push(node)
  }
  for (const k of Object.keys(adj)) {
    if (!visited.has(k)) dfs1(k)
  }
  steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: '', label: 'Phase 1: Ordering done — building reverse graph' }))
  const rev = {}
  for (const k of Object.keys(adj)) {
    for (const nb of (adj[k] || [])) {
      if (!rev[nb]) rev[nb] = []
      rev[nb].push(k)
    }
  }
  const sccs = []
  const visited2 = new Set()
  function dfs2(node, scc) {
    visited2.add(node)
    scc.push(node)
    for (const nb of (rev[node] || [])) {
      if (!visited2.has(nb)) dfs2(nb, scc)
    }
  }
  while (stack.length) {
    const node = stack.pop()
    if (!visited2.has(node)) {
      const scc = []
      dfs2(node, scc)
      sccs.push(scc)
      steps.push(graphStep(STEP_TYPES.GRAPH_VISIT_NODE, { node: '', label: `SCC: {${scc.join(',')}}` }))
    }
  }
  return steps
}
