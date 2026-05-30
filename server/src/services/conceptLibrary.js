/**
 * AlgoZen Concept Library — RAG Knowledge Base
 *
 * Every concept has:
 *   - title, tags     → for retrieval matching
 *   - explanation      → plain-text explanation
 *   - complexity       → time & space
 *   - codeExamples     → multi-language snippets
 *   - relatedConcepts  → for multi-hop retrieval
 *   - analogies        → Hinglish analogies for Indian students
 */

const concepts = [
  // ─── Arrays ─────────────────────────────────────────────────────
  {
    title: 'Arrays',
    tags: ['array', 'arrays', 'arr', 'index', 'element', 'subarray'],
    explanation:
      'An array is a contiguous block of memory storing elements of the same type. ' +
      'Elements are accessed in O(1) via index. Insertion/deletion at arbitrary positions is O(n) ' +
      'because elements must be shifted. Common patterns: two-pointer, sliding window, prefix sum, Kadane.',
    complexity: { time: 'O(1) access, O(n) insert/delete', space: 'O(n)' },
    codeExamples: {
      python: 'arr = [1, 2, 3]\narr.append(4)     # O(1) amortized\narr.insert(0, 0) # O(n)\nx = arr[2]        # O(1)',
      javascript: 'const arr = [1, 2, 3];\narr.push(4);       // O(1) amortized\narr.unshift(0);    // O(n)\nconst x = arr[2];  // O(1)',
      cpp: 'vector<int> arr = {1, 2, 3};\narr.push_back(4);  // O(1) amortized\narr.insert(begin(arr), 0); // O(n)\nint x = arr[2];    // O(1)',
      java: 'int[] arr = {1, 2, 3};\nint x = arr[2]; // O(1)',
    },
    analogies: [
      'Array ko train ke bogie samjho — har bogie ka fixed seat number hai, seedha access mil jaata hai',
      'Naya element beech me daalna = train me beech ke bogie me extra seat lagwana — saare aage waalon ko shift karna padega',
    ],
    relatedConcepts: ['Strings', 'Sorting', 'Searching', 'Two Pointers', 'Sliding Window'],
  },

  {
    title: 'Two Pointers',
    tags: ['two pointer', 'two pointers', '2 pointer', '2 pointers'],
    explanation:
      'Two pointers technique uses two indices (usually start & end) that move toward each other ' +
      'to solve problems in O(n) time and O(1) space. Great for sorted arrays, palindrome checking, ' +
      'and finding pairs that satisfy a condition. Variants: opposite-direction (start+end) and ' +
      'same-direction (slow+fast).',
    complexity: { time: 'O(n)', space: 'O(1)' },
    codeExamples: {
      python:
        'def two_sum_sorted(arr, target):\n    l, r = 0, len(arr) - 1\n    while l < r:\n        s = arr[l] + arr[r]\n        if s == target: return [l, r]\n        elif s < target: l += 1\n        else: r -= 1\n    return [-1, -1]',
      javascript:
        'function twoSumSorted(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l < r) {\n    const sum = arr[l] + arr[r];\n    if (sum === target) return [l, r];\n    sum < target ? l++ : r--;\n  }\n  return [-1, -1];\n}',
      cpp:
        'vector<int> twoSum(vector<int>& arr, int target) {\n  int l = 0, r = arr.size() - 1;\n  while (l < r) {\n    int sum = arr[l] + arr[r];\n    if (sum == target) return {l, r};\n    sum < target ? l++ : r--;\n  }\n  return {-1, -1};\n}',
      java:
        'int[] twoSum(int[] arr, int target) {\n  int l = 0, r = arr.length - 1;\n  while (l < r) {\n    int sum = arr[l] + arr[r];\n    if (sum == target) return new int[]{l, r};\n    if (sum < target) l++; else r--;\n  }\n  return new int[]{-1, -1};\n}',
    },
    analogies: [
      'Do aadmi ek line ke dono end se chalna shuru karte hain — jab tak milte nahi. Agar sum chota hai to left wala aage badhta hai, bada hai to right wala peeche',
    ],
    relatedConcepts: ['Arrays', 'Sorting', 'Sliding Window'],
  },

  {
    title: 'Sliding Window',
    tags: ['sliding window', 'window', 'subarray', 'substring', 'contiguous'],
    explanation:
      'Sliding window maintains a dynamic subarray/substring range using two pointers. ' +
      'The window expands by moving the right pointer and contracts by moving the left pointer. ' +
      'Used for problems involving contiguous subarrays/substrings with constraints ' +
      '(max sum, longest substring without repeating, etc.). Fixed-size and variable-size variants.',
    complexity: { time: 'O(n)', space: 'O(1) or O(k) where k = window size' },
    codeExamples: {
      python:
        'def max_sum_subarray(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum',
      javascript:
        'function maxSumSubarray(arr, k) {\n  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);\n  let max = sum;\n  for (let i = k; i < arr.length; i++) {\n    sum += arr[i] - arr[i - k];\n    max = Math.max(max, sum);\n  }\n  return max;\n}',
      cpp:
        'int maxSumSubarray(vector<int>& arr, int k) {\n  int sum = accumulate(begin(arr), begin(arr) + k, 0);\n  int mx = sum;\n  for (int i = k; i < arr.size(); i++) {\n    sum += arr[i] - arr[i - k];\n    mx = max(mx, sum);\n  }\n  return mx;\n}',
      java:
        'int maxSumSubarray(int[] arr, int k) {\n  int sum = 0;\n  for (int i = 0; i < k; i++) sum += arr[i];\n  int mx = sum;\n  for (int i = k; i < arr.length; i++) {\n    sum += arr[i] - arr[i - k];\n    mx = Math.max(mx, sum);\n  }\n  return mx;\n}',
    },
    analogies: [
      'Window jaisa hota hai — ek frame jo left-right ghumta hai. Jaise train ki khidki se view badalta hai waise',
      'Fixed size window = chashma. Variable size = telescope — zoom in/out karte ho',
    ],
    relatedConcepts: ['Arrays', 'Strings', 'Two Pointers'],
  },

  // ─── Strings ────────────────────────────────────────────────────
  {
    title: 'Strings',
    tags: ['string', 'strings', 'str', 'palindrome', 'anagram', 'substring'],
    explanation:
      'Strings are sequences of characters. In most languages they are immutable (Python, Java, JS) ' +
      'but can be treated as character arrays. Common patterns: character frequency counting, ' +
      'two pointers for palindrome checking, sliding window for substring problems, ' +
      'trie for prefix matching, KMP/Rabin-Karp for pattern matching.',
    complexity: { time: 'O(n) traversal, O(n log n) sort-based', space: 'O(n)' },
    codeExamples: {
      python: 's = "hello"\n# Character frequency\nfreq = {}\nfor c in s:\n    freq[c] = freq.get(c, 0) + 1',
      javascript: 'const s = "hello";\nconst freq = {};\nfor (const c of s) {\n  freq[c] = (freq[c] || 0) + 1;\n}',
      cpp:
        'string s = "hello";\nunordered_map<char, int> freq;\nfor (char c : s) freq[c]++;',
      java: 'String s = "hello";\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray())\n  freq.put(c, freq.getOrDefault(c, 0) + 1);',
    },
    analogies: [
      'String = moti (pearls) ki mala. Har character ek moti. Tum mala me moti jod/sakta ho (concat), nikal sakte ho (slice), aur search kar sakte ho',
    ],
    relatedConcepts: ['Arrays', 'Two Pointers', 'Sliding Window', 'Trie'],
  },

  // ─── Stack ──────────────────────────────────────────────────────
  {
    title: 'Stack',
    tags: ['stack', 'lifo', 'push', 'pop', 'peek', 'parentheses', 'brackets'],
    explanation:
      'Stack is a LIFO (Last-In-First-Out) data structure. Operations: push (O(1)), pop (O(1)), ' +
      'peek/top (O(1)). Used for: balanced parentheses, undo/redo, DFS, expression evaluation, ' +
      'monotonic stack problems (next greater element, largest rectangle in histogram).',
    complexity: { time: 'O(1) push/pop/peek', space: 'O(n)' },
    codeExamples: {
      python: 'stack = []\nstack.append(1)  # push\nstack.pop()      # pop\nstack[-1]        # peek',
      javascript: 'const stack = [];\nstack.push(1);  // push\nstack.pop();    // pop\nstack[stack.length - 1]; // peek',
      cpp: 'stack<int> st;\nst.push(1);\nst.pop();\nst.top(); // peek',
      java: 'Stack<Integer> stack = new Stack<>();\nstack.push(1);\nstack.pop();\nstack.peek();',
    },
    analogies: [
      'Stack = plate ka stack (thali). Jo plate upar rakhi, wahi pehle niklegi — LIFO. Dirty plates dhone ka system!',
      'Browser ka back button stack hai — har naya page upar jaata hai, back karne pe top page nikalti hai',
    ],
    relatedConcepts: ['Queue', 'DFS', 'Monotonic Stack'],
  },

  // ─── Queue ──────────────────────────────────────────────────────
  {
    title: 'Queue',
    tags: ['queue', 'fifo', 'enqueue', 'dequeue', 'bfs', 'level order'],
    explanation:
      'Queue is a FIFO (First-In-First-Out) data structure. Operations: enqueue/push (O(1)), ' +
      'dequeue/pop (O(1)). Used for: BFS, level-order tree traversal, scheduling, ' +
      'sliding window maximum (deque). Variants: circular queue, deque, priority queue.',
    complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
    codeExamples: {
      python: 'from collections import deque\nq = deque()\nq.append(1)  # enqueue\nq.popleft()  # dequeue\nq[0]         # front',
      javascript:
        '// JS array (not ideal for large data)\nconst q = [];\nq.push(1);  // enqueue O(1)\nq.shift();  // dequeue O(n)',
      cpp: 'queue<int> q;\nq.push(1);\nq.pop();\nq.front();',
      java: 'Queue<Integer> q = new LinkedList<>();\nq.offer(1);\nq.poll();\nq.peek();',
    },
    analogies: [
      'Queue = cinema ke ticket counter ki line. Jo pehle aaya, woh pehle ticket lega — FIFO. Simple!',
      'Printer queue same hai — pehle submit karo, pehle print hoga',
    ],
    relatedConcepts: ['Stack', 'BFS', 'Deque', 'Priority Queue'],
  },

  // ─── Trees ──────────────────────────────────────────────────────
  {
    title: 'Trees',
    tags: ['tree', 'trees', 'binary tree', 'bst', 'binary search tree', 'traversal', 'inorder', 'preorder', 'postorder', 'level order'],
    explanation:
      'A tree is a hierarchical data structure with a root node and child nodes forming subtrees. ' +
      'Binary Tree: each node has at most 2 children (left, right). BST: left < root < right. ' +
      'Traversals: Inorder (L-root-R → sorted for BST), Preorder (root-L-R), Postorder (L-R-root), ' +
      'Level-order (BFS). Height is O(log n) for balanced trees, O(n) for skewed.',
    complexity: { time: 'O(log n) search/insert in balanced BST, O(n) worst', space: 'O(n)' },
    codeExamples: {
      python:
        'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)',
      javascript:
        'class TreeNode {\n  constructor(val, left, right) {\n    this.val = val;\n    this.left = left ?? null;\n    this.right = right ?? null;\n  }\n}\n\nfunction inorder(root) {\n  if (!root) return [];\n  return [...inorder(root.left), root.val, ...inorder(root.right)];\n}',
      cpp:
        'struct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nvoid inorder(TreeNode* root) {\n  if (!root) return;\n  inorder(root->left);\n  cout << root->val << " ";\n  inorder(root->right);\n}',
      java:
        'class TreeNode {\n  int val;\n  TreeNode left, right;\n  TreeNode(int v) { val = v; }\n}\n\nvoid inorder(TreeNode root) {\n  if (root == null) return;\n  inorder(root.left);\n  System.out.print(root.val + " ");\n  inorder(root.right);\n}',
    },
    analogies: [
      'Tree = family tree (vansh vriksh). Daada (root) ke do bete (left/right child), unke aur bete...',
      'Folder structure in computer is a tree. Root C: drive hai, folders children hain',
    ],
    relatedConcepts: ['BST', 'DFS', 'BFS', 'Heap', 'Trie'],
  },

  // ─── Graphs ─────────────────────────────────────────────────────
  {
    title: 'Graphs',
    tags: ['graph', 'graphs', 'bfs', 'dfs', 'adjacency', 'connected components', 'cycle'],
    explanation:
      'A graph is a collection of nodes (vertices) connected by edges. ' +
      'Types: directed/undirected, weighted/unweighted, cyclic/acyclic. ' +
      'Representations: adjacency list (O(V+E) memory, preferred) and adjacency matrix (O(V²)). ' +
      'Key algorithms: BFS (shortest path in unweighted), DFS (connectivity, cycles, topological sort), ' +
      'Dijkstra (weighted shortest path), Union-Find (connected components).',
    complexity: { time: 'O(V+E) BFS/DFS, O((V+E)log V) Dijkstra', space: 'O(V+E) adjacency list' },
    codeExamples: {
      python:
        'from collections import defaultdict, deque\n\ngraph = defaultdict(list)\ngraph[1].append(2)\n\ndef bfs(start):\n    visited = {start}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nei in graph[node]:\n            if nei not in visited:\n                visited.add(nei)\n                q.append(nei)\n    return visited',
      javascript:
        'const graph = new Map();\n\nfunction bfs(start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const nei of (graph.get(node) || [])) {\n      if (!visited.has(nei)) {\n        visited.add(nei);\n        queue.push(nei);\n      }\n    }\n  }\n  return visited;\n}',
      cpp:
        'vector<int> graph[100];\nvector<bool> visited(100);\n\nvoid bfs(int start) {\n  queue<int> q;\n  q.push(start);\n  visited[start] = true;\n  while (!q.empty()) {\n    int node = q.front(); q.pop();\n    for (int nei : graph[node]) {\n      if (!visited[nei]) {\n        visited[nei] = true;\n        q.push(nei);\n      }\n    }\n  }\n}',
      java:
        'Map<Integer, List<Integer>> graph = new HashMap<>();\nSet<Integer> visited = new HashSet<>();\n\nvoid bfs(int start) {\n  Queue<Integer> q = new LinkedList<>();\n  q.offer(start);\n  visited.add(start);\n  while (!q.isEmpty()) {\n    int node = q.poll();\n    for (int nei : graph.getOrDefault(node, List.of())) {\n      if (!visited.contains(nei)) {\n        visited.add(nei);\n        q.offer(nei);\n      }\n    }\n  }\n}',
    },
    analogies: [
      'Graph = city ka map. Nodes = chaurahe (crossings), Edges = sadak. Adjacency list bataati hai ki har chaurahe se kaun si galiya jaati hain',
      'BFS = flood-fill. Ek node se paani chhodo, woh saare connected nodes tak phail jaayega level by level',
    ],
    relatedConcepts: ['Trees', 'DFS', 'BFS', 'Union Find', 'Dijkstra', 'Topological Sort'],
  },

  // ─── Dynamic Programming ────────────────────────────────────────
  {
    title: 'Dynamic Programming',
    tags: ['dynamic programming', 'dp', 'memoization', 'tabulation', 'optimal substructure', 'overlapping subproblems'],
    explanation:
      'DP solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation. ' +
      'Key conditions: 1) Optimal substructure (optimal answer uses optimal answers to subproblems), ' +
      '2) Overlapping subproblems (same subproblem appears multiple times). ' +
      'Two approaches: Top-down (memoization = recursion + cache) and Bottom-up (tabulation = iterative table). ' +
      'Common patterns: 0/1 Knapsack, Longest Common Subsequence, Unbounded Knapsack, Fibonacci, Grid DP.',
    complexity: { time: 'O(n) to O(n²) depending on problem', space: 'O(n) to O(n²)' },
    codeExamples: {
      python:
        '# Fibonacci — Top Down (Memoization)\nfrom functools import lru_cache\n\n@lru_cache(None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\n# Bottom-Up (Tabulation)\ndef fib_tab(n):\n    dp = [0, 1]\n    for i in range(2, n+1):\n        dp.append(dp[i-1] + dp[i-2])\n    return dp[n]',
      javascript:
        '// Fibonacci — Bottom Up\nfunction fib(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}',
      cpp:
        'int fib(int n) {\n  vector<int> dp(n+1);\n  dp[0] = 0; dp[1] = 1;\n  for (int i = 2; i <= n; i++)\n    dp[i] = dp[i-1] + dp[i-2];\n  return dp[n];\n}',
      java:
        'int fib(int n) {\n  int[] dp = new int[n+1];\n  dp[0] = 0; dp[1] = 1;\n  for (int i = 2; i <= n; i++)\n    dp[i] = dp[i-1] + dp[i-2];\n  return dp[n];\n}',
    },
    analogies: [
      'DP = yaad rakhna (memoize). Jaise exam me formula yaad karte ho — ek baar solve kiya to yaad rakh lo. Dobara solve mat karo!',
      'Bottom-up = chhoti building se upar jaana. Pehle base case (floor 0,1), phir upar waali floor calculate karte jao',
    ],
    relatedConcepts: ['Recursion', 'Greedy', 'Memoization', 'Tabulation'],
  },

  {
    title: 'Memoization',
    tags: ['memoization', 'memo', 'cache', 'top down', 'recursion cache'],
    explanation:
      'Memoization stores results of expensive function calls and returns the cached result when the same inputs occur again. ' +
      'It is a top-down approach to DP. You write recursive code normally, but before returning a result, you store it in a cache (usually a hash map or array). ' +
      'Key insight: "Why recalculate what you already know?"',
    complexity: { time: 'Same as tabulation alternative', space: 'O(number of unique states)' },
    codeExamples: {
      python:
        'def climb_stairs(n):\n    memo = {}\n    def dfs(i):\n        if i <= 2: return i\n        if i in memo: return memo[i]\n        memo[i] = dfs(i-1) + dfs(i-2)\n        return memo[i]\n    return dfs(n)',
      javascript:
        'function climbStairs(n) {\n  const memo = {};\n  function dfs(i) {\n    if (i <= 2) return i;\n    if (memo[i] !== undefined) return memo[i];\n    memo[i] = dfs(i-1) + dfs(i-2);\n    return memo[i];\n  }\n  return dfs(n);\n}',
    },
    analogies: [
      'Memoization = chits (slip) system. Ek baar answer nikaala to chit pe likh kar rakh do. Phir koi puche to chit utha kar de do — dubara calculate mat karo!',
    ],
    relatedConcepts: ['Dynamic Programming', 'Recursion', 'Tabulation'],
  },

  // ─── Recursion ──────────────────────────────────────────────────
  {
    title: 'Recursion',
    tags: ['recursion', 'recursive', 'divide and conquer', 'base case', 'recurrence'],
    explanation:
      'Recursion solves a problem by solving smaller instances of the same problem. ' +
      'Every recursive function must have: 1) Base case (termination condition), 2) Recursive case (function calls itself with smaller input). ' +
      'Think: "Trust the function to solve the subproblem." Used in tree traversals, divide-and-conquer (merge sort, quicksort), backtracking, and DP.',
    complexity: { time: 'Depends on depth & branching factor', space: 'O(depth) for call stack' },
    codeExamples: {
      python:
        'def factorial(n):\n    if n <= 1: return 1          # base case\n    return n * factorial(n - 1)  # recursive case',
      javascript:
        'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
      cpp:
        'int factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
      java:
        'int factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
    },
    analogies: [
      'Recursion = Russian nesting dolls (matryoshka). Ek doll kholo to uske andar chhoti doll. Tab tak kholo jab tak smallest na mil jaaye — that is base case!',
      'Mirror ke saamne mirror rakh do — infinite reflections. Base case nahi to infinite loop!',
    ],
    relatedConcepts: ['Dynamic Programming', 'Trees', 'Backtracking', 'Divide and Conquer'],
  },

  // ─── Hashing ────────────────────────────────────────────────────
  {
    title: 'Hashing',
    tags: ['hashing', 'hash map', 'hash set', 'hash table', 'dictionary', 'map', 'set', 'frequency'],
    explanation:
      'Hash maps store key-value pairs with O(1) average time for insert, delete, and lookup. ' +
      'Hash sets store unique elements with same O(1) operations. Internally uses a hash function to map keys to buckets. ' +
      'Collisions handled by chaining (linked list) or open addressing. ' +
      'Common uses: frequency counting, duplicate detection, caching, two-sum style lookups.',
    complexity: { time: 'O(1) average, O(n) worst-case for insert/search/delete', space: 'O(n)' },
    codeExamples: {
      python: 'freq = {}\nfor x in arr:\n    freq[x] = freq.get(x, 0) + 1\n\nseen = set()\nseen.add(1)\n1 in seen  # True',
      javascript:
        'const freq = new Map();\nfor (const x of arr) {\n  freq.set(x, (freq.get(x) ?? 0) + 1);\n}\n\nconst seen = new Set();\nseen.add(1);\nseen.has(1);  // true',
      cpp:
        'unordered_map<int, int> freq;\nfor (int x : arr) freq[x]++;\n\nunordered_set<int> seen;\nseen.insert(1);\nseen.count(1); // 1 or 0',
      java:
        'Map<Integer, Integer> freq = new HashMap<>();\nfor (int x : arr)\n  freq.put(x, freq.getOrDefault(x, 0) + 1);\n\nSet<Integer> seen = new HashSet<>();\nseen.add(1);\nseen.contains(1); // true',
    },
    analogies: [
      'Hash map = hostel room number system. Har student ka naam (key) → room number (value). Seedha jaanta hai kaunsa banda kaha rehta hai — O(1)!',
      'Hash set = guest list. Sirf naam hai, koi extra info nahi. Pata karo ki party me X aaya ki nahi',
    ],
    relatedConcepts: ['Arrays', 'Strings', 'Caching'],
  },

  // ─── Sorting ────────────────────────────────────────────────────
  {
    title: 'Sorting',
    tags: ['sorting', 'sort', 'quicksort', 'mergesort', 'bubble sort', 'comparator'],
    explanation:
      'Sorting arranges elements in a specific order (ascending/descending). ' +
      'Comparison-based sorts: QuickSort (O(n log n) average, O(n²) worst), MergeSort (O(n log n) guaranteed), HeapSort (O(n log n)). ' +
      'Non-comparison sorts: Counting Sort (O(n+k)), Radix Sort (O(nk)). ' +
      'Python/JS/Java all use TimSort (hybrid of merge + insertion sort, O(n log n)).',
    complexity: { time: 'O(n log n) for comparison sorts', space: 'O(1) in-place to O(n)' },
    codeExamples: {
      python: 'arr.sort()  # O(n log n) TimSort\nsorted_arr = sorted(arr)\n\n# Custom comparator\narr.sort(key=lambda x: x[1])',
      javascript:
        'arr.sort((a, b) => a - b);  // ascending\narr.sort((a, b) => b - a);  // descending',
      cpp:
        'sort(arr.begin(), arr.end());  // O(n log n) Introsort\nsort(arr.begin(), arr.end(), greater<int>());  // descending',
      java:
        'Arrays.sort(arr);  // O(n log n) Dual-Pivot QuickSort\nCollections.sort(list);',
    },
    analogies: [
      'Sorting = class me students ko height ke hisaab se line lagwana. MergeSort = do lines ko merge karna. QuickSort = ek pivot chun ke chhote-bade alag karna',
    ],
    relatedConcepts: ['Arrays', 'Divide and Conquer', 'Searching'],
  },

  // ─── Searching ──────────────────────────────────────────────────
  {
    title: 'Binary Search',
    tags: ['binary search', 'search', 'bisect', 'log n', 'sorted'],
    explanation:
      'Binary search finds an element in a sorted array in O(log n) time by repeatedly dividing the search interval in half. ' +
      'Works on sorted data. Variants: lower bound (first occurrence), upper bound (last occurrence), search in rotated array. ' +
      'Can also be applied to answer-space problems (e.g., "find minimum capacity to ship packages within D days").',
    complexity: { time: 'O(log n)', space: 'O(1) iterative' },
    codeExamples: {
      python:
        'def binary_search(arr, target):\n    l, r = 0, len(arr) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1',
      javascript:
        'function binarySearch(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const mid = (l + r) >> 1;\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? (l = mid + 1) : (r = mid - 1);\n  }\n  return -1;\n}',
      cpp:
        'int binarySearch(vector<int>& arr, int target) {\n  int l = 0, r = arr.size() - 1;\n  while (l <= r) {\n    int mid = l + (r - l) / 2;\n    if (arr[mid] == target) return mid;\n    arr[mid] < target ? l = mid + 1 : r = mid - 1;\n  }\n  return -1;\n}',
      java:
        'int binarySearch(int[] arr, int target) {\n  int l = 0, r = arr.length - 1;\n  while (l <= r) {\n    int mid = l + (r - l) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}',
    },
    analogies: [
      'Binary search = dictionary me word dhundhna. Beech me kholo → word us side hai to aadha dictionary discard karo → repeat',
      'Ek kitaab me page number bataye bina ek number socho. Main har baar aadhi possibilities eliminate karta hoon — that is binary search!',
    ],
    relatedConcepts: ['Sorting', 'Arrays', 'Divide and Conquer'],
  },

  // ─── Greedy ─────────────────────────────────────────────────────
  {
    title: 'Greedy Algorithms',
    tags: ['greedy', 'local optimum', 'optimal', 'activity selection', 'huffman'],
    explanation:
      'Greedy algorithms make the locally optimal choice at each step, hoping to find the global optimum. ' +
      'Works when the problem has greedy choice property (local optimum leads to global optimum) and optimal substructure. ' +
      'Examples: Activity Selection, Huffman Coding, Coin Change (canonical systems), Kruskal/Prim for MST, Dijkstra.',
    complexity: { time: 'O(n log n) typically (sorting then linear scan)', space: 'O(1)' },
    codeExamples: {
      python:
        'def activity_selection(activities):\n    # activities = [(start, end), ...]\n    activities.sort(key=lambda x: x[1])  # sort by end time\n    count = 1\n    last_end = activities[0][1]\n    for s, e in activities[1:]:\n        if s >= last_end:\n            count += 1\n            last_end = e\n    return count',
    },
    analogies: [
      'Greedy = aaj ka khao, kal ka socho mat — literally! Har step pe best dikh raha hai woh lo',
      'Jaise exam me pehle easy questions karo, phir hard — yeh greedy hai!',
    ],
    relatedConcepts: ['Dynamic Programming', 'Sorting'],
  },

  // ─── Backtracking ───────────────────────────────────────────────
  {
    title: 'Backtracking',
    tags: ['backtracking', 'backtrack', 'permutation', 'combination', 'subset', 'n queens', 'sudoku'],
    explanation:
      'Backtracking systematically tries all possible solutions and backtracks when a path cannot lead to a valid solution. ' +
      'Essentially DFS with pruning. Useful for: permutations, combinations, subsets, N-Queens, Sudoku, maze solving. ' +
      'Template: explore → if valid → recurse → undo (backtrack).',
    complexity: { time: 'O(n!) to O(2^n) exponential', space: 'O(n) recursion depth' },
    codeExamples: {
      python:
        'def subsets(nums):\n    result = []\n    def backtrack(start, path):\n        result.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()  # backtrack!\n    backtrack(0, [])\n    return result',
      javascript:
        'function subsets(nums) {\n  const result = [];\n  function backtrack(start, path) {\n    result.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();  // backtrack!\n    }\n  }\n  backtrack(0, []);\n  return result;\n}',
    },
    analogies: [
      'Backtracking = maze me rasta dhundhna. Ek rasta chalo → dead end aaye to wapas aao (backtrack) → doosra rasta try karo',
      'N-Queens = 8 queens ko 8×8 board pe aise rakhna ki ek doosre ko na maar sake. Ek jagah rakh do → agar aage problem to hatao → nayi jagah try karo',
    ],
    relatedConcepts: ['Recursion', 'DFS', 'Permutations'],
  },

  // ─── Heap / Priority Queue ─────────────────────────────────────
  {
    title: 'Heap (Priority Queue)',
    tags: ['heap', 'priority queue', 'min heap', 'max heap', 'heapify'],
    explanation:
      'A heap is a complete binary tree where each node is ≤ (min-heap) or ≥ (max-heap) its children. ' +
      'Insert and extract-min/max both take O(log n). Peek is O(1). ' +
      'Used for: priority scheduling, Dijkstra, K smallest/largest elements, median finding, Huffman coding. ' +
      'In Python: heapq (min-heap). In JS/Java/C++: PriorityQueue (min or max).',
    complexity: { time: 'O(log n) insert/extract, O(1) peek', space: 'O(n)' },
    codeExamples: {
      python:
        'import heapq\nheap = []\nheapq.heappush(heap, 3)  # O(log n)\nheapq.heappush(heap, 1)\nheapq.heappush(heap, 2)\nsmallest = heapq.heappop(heap)  # 1, O(log n)\n\n# Max heap trick: push negative values\nheapq.heappush(heap, -val)\nlargest = -heapq.heappop(heap)',
      javascript:
        '// JS doesn\'t have built-in heap; manual impl or use array + sort\nclass MinHeap {\n  constructor() { this.heap = []; }\n  push(v) { this.heap.push(v); this._bubbleUp(); }\n  pop() { const t = this.heap[0]; const e = this.heap.pop(); if (this.heap.length) { this.heap[0] = e; this._sinkDown(); } return t; }\n  _bubbleUp() { /* implement */ }\n  _sinkDown() { /* implement */ }\n}',
      cpp:
        'priority_queue<int> maxHeap;\npriority_queue<int, vector<int>, greater<int>> minHeap;\nmaxHeap.push(3);  // O(log n)\nmaxHeap.top();    // O(1)\nmaxHeap.pop();    // O(log n)',
      java:
        'PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nminHeap.offer(3);  // O(log n)\nminHeap.peek();    // O(1)\nminHeap.poll();    // O(log n)',
    },
    analogies: [
      'Heap = hospital emergency queue. Sabse critical patient (min value) pehle treat hoga — min-heap. O(log n) me admit/treat!',
      'Normal queue = FIFO. Priority queue = VIP queue — jo sabse重要 (important) hai woh pehle!',
    ],
    relatedConcepts: ['Queue', 'Trees', 'Sorting'],
  },

  // ─── Trie ───────────────────────────────────────────────────────
  {
    title: 'Trie (Prefix Tree)',
    tags: ['trie', 'prefix tree', 'prefix', 'autocomplete', 'dictionary'],
    explanation:
      'A trie is a tree-like data structure for storing strings where each node represents a character. ' +
      'All descendants share a common prefix (hence "prefix tree"). ' +
      'Search and insert both take O(L) where L is word length. ' +
      'Used for: autocomplete, spell checker, IP routing, word search in matrix.',
    complexity: { time: 'O(L) search/insert, L = word length', space: 'O(total characters × alphabet size)' },
    codeExamples: {
      python:
        'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children:\n                node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children: return False\n            node = node.children[c]\n        return node.is_end',
    },
    analogies: [
      'Trie = phone ka contacts app. "Ra" type karo to "Rahul", "Raj", "Ram" dikhte hain — common prefix share karte hain!',
    ],
    relatedConcepts: ['Trees', 'Strings', 'Hashing'],
  },

  // ─── Union Find ─────────────────────────────────────────────────
  {
    title: 'Union-Find (Disjoint Set)',
    tags: ['union find', 'disjoint set', 'dsu', 'connected components', 'path compression', 'union by rank'],
    explanation:
      'Union-Find tracks elements partitioned into disjoint (non-overlapping) sets. ' +
      'Two main operations: find(x) — returns representative of set containing x, ' +
      'union(x, y) — merges sets containing x and y. ' +
      'With path compression and union by rank, both operations are nearly O(α(n)) (inverse Ackermann — practically constant). ' +
      'Used for: connected components in graphs, detecting cycles, Kruskal\'s MST.',
    complexity: { time: 'O(α(n)) per operation (amortized)', space: 'O(n)' },
    codeExamples: {
      python:
        'class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])  # path compression\n        return self.parent[x]\n\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py: return False\n        if self.rank[px] < self.rank[py]: self.parent[px] = py\n        elif self.rank[px] > self.rank[py]: self.parent[py] = px\n        else: self.parent[py] = px; self.rank[px] += 1\n        return True',
    },
    analogies: [
      'Union-Find = group project me teams. Find bataata hai ki X konse team me hai. Union do teams ko merge karta hai. Sab friendships O(α(n)) me pata chal jaata hai!',
    ],
    relatedConcepts: ['Graphs', 'Connected Components'],
  },
]

/**
 * Retrieve relevant concepts for a query
 */
export function retrieveConcepts(query, maxResults = 3) {
  if (!query || typeof query !== 'string') return []

  const q = query.toLowerCase()
  const scored = concepts
    .map((c) => {
      let score = 0
      // Check tags
      for (const tag of c.tags) {
        if (q.includes(tag)) score += 10
      }
      // Check title
      if (q.includes(c.title.toLowerCase())) score += 20
      // Check explanation for keyword matches
      if (c.explanation.toLowerCase().includes(q)) score += 5
      return { concept: c, score }
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)

  return scored.map((s) => ({
    title: s.concept.title,
    explanation: s.concept.explanation,
    complexity: s.concept.complexity,
    analogies: s.concept.analogies.slice(0, 1),
    relatedConcepts: s.concept.relatedConcepts,
  }))
}

/**
 * Get all concept titles (for hint routing)
 */
export function getAllConceptTitles() {
  return concepts.map((c) => c.title)
}

/**
 * Get a concept by exact title match
 */
export function getConceptByTitle(title) {
  return concepts.find((c) => c.title.toLowerCase() === title.toLowerCase()) || null
}

export default concepts
