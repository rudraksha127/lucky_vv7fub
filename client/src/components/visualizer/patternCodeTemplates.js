/**
 * patternCodeTemplates.js — Code templates for all 20 DSA pattern categories.
 *
 * Each template has:
 *   language: string ('python' | 'javascript')
 *   code: string (the algorithm implementation)
 *   getHighlightedLines(step): function that returns [startLine, endLine] based on step type/data
 *
 * Steps are mapped to lines via their type and metadata.
 */

// ─── Helper: map STEP_TYPES to line ranges ─────────────────
function arrayStepToLines(step, lines) {
  if (!step) return []
  switch (step.type) {
    case 'array_compare':   return lines.compare || []
    case 'array_swap':      return lines.swap || []
    case 'array_set':       return lines.set || []
    case 'array_pointer':   return lines.pointer || []
    case 'array_highlight': return lines.highlight || []
    case 'stack_push':      return lines.push || []
    case 'stack_pop':       return lines.pop || []
    case 'recurse_call':    return lines.recurse || []
    case 'recurse_return':  return lines.return || []
    case 'graph_visit_node':return lines.visit || []
    case 'graph_traverse_edge': return lines.traverse || []
    case 'tree_visit':      return lines.visit || []
    default:                return lines.default || []
  }
}

function template(language, code, lineMap) {
  const codeLines = code.split('\n')
  return { language, code, codeLines, getHighlightedLines: lineMap }
}

// ═══════════════════════════════════════════════════════════════
//  1. ARRAYS — Prefix Sum / Two Pointer / Sliding Window / Kadane / etc.
// ═══════════════════════════════════════════════════════════════

const PREFIX_SUM_PY = template('python',
`def prefix_sum(arr):
    n = len(arr)
    prefix = [0] * n
    prefix[0] = arr[0]
    for i in range(1, n):
        prefix[i] = prefix[i-1] + arr[i]
    return prefix`,
  (s) => arrayStepToLines(s, {
    set:       [3, 5],      // prefix[0]=arr[0] or prefix[i]=...
    pointer:   [3, 4, 5],
    compare:   [4, 5],
    highlight: [6, 6],
  })
)

const TWO_POINTER_PY = template('python',
`def two_pointer(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Process arr[left] and arr[right]
        if condition(arr[left], arr[right]):
            left += 1
        else:
            right -= 1
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 2, 3],
    compare:   [3, 4],
    swap:      [4],
    set:       [6, 7],
    highlight: [8],
  })
)

const SLIDING_WINDOW_PY = template('python',
`def sliding_window(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 3, 4],
    compare:   [4],
    set:       [2, 5],
    highlight: [6],
  })
)

const KADANE_PY = template('python',
`def max_subarray_sum(arr):
    max_ending_here = 0
    max_so_far = float('-inf')
    for i in range(len(arr)):
        max_ending_here = max(arr[i], max_ending_here + arr[i])
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4],
    set:       [4, 5],
    compare:   [4],
    highlight: [6],
  })
)

const THREE_SUM_PY = template('python',
`def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                result.append([nums[i], nums[l], nums[r]])
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 5, 6, 7],
    compare:   [7, 9, 10, 11],
    set:       [3, 8, 9],
    swap:      [8],
    highlight: [13],
  })
)

const CONTAINER_WATER_PY = template('python',
`def max_area(height):
    l, r = 0, len(height) - 1
    max_area = 0
    while l < r:
        h = min(height[l], height[r])
        area = h * (r - l)
        max_area = max(max_area, area)
        if height[l] < height[r]: l += 1
        else: r -= 1
    return max_area`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 3],
    compare:   [4],
    set:       [5, 6],
    highlight: [9],
  })
)

const TRAPPING_RAIN_WATER_PY = template('python',
`def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = total = 0
    while l < r:
        if height[l] < height[r]:
            if height[l] >= left_max:
                left_max = height[l]
            else:
                total += left_max - height[l]
            l += 1
        else:
            if height[r] >= right_max:
                right_max = height[r]
            else:
                total += right_max - height[r]
            r -= 1
    return total`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 3],
    compare:   [4, 5, 9],
    set:       [6, 10, 14],
    highlight: [17],
  })
)

const DUTCH_FLAG_PY = template('python',
`def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums`,
  (s) => arrayStepToLines(s, {
    pointer:   [0, 2],
    swap:      [4, 9],
    compare:   [3, 5, 8],
    set:       [5, 9],
    highlight: [12],
  })
)

const MOORES_VOTING_PY = template('python',
`def majority_element(nums):
    candidate = nums[0]
    count = 1
    for i in range(1, len(nums)):
        if count == 0:
            candidate = nums[i]
            count = 1
        elif nums[i] == candidate:
            count += 1
        else:
            count -= 1
    return candidate`,
  (s) => arrayStepToLines(s, {
    pointer:   [3],
    compare:   [4, 7, 9],
    set:       [5, 8, 10],
    highlight: [12],
  })
)

const STOCK_BUY_SELL_PY = template('python',
`def max_profit(prices):
    min_price = prices[0]
    max_profit = 0
    for i in range(1, len(prices)):
        if prices[i] < min_price:
            min_price = prices[i]
        else:
            max_profit = max(max_profit, prices[i] - min_price)
    return max_profit`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4],
    compare:   [4],
    set:       [5, 7],
    highlight: [9],
  })
)

const CYCLIC_SORT_PY = template('python',
`def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if 1 <= nums[i] <= len(nums) and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    return nums`,
  (s) => arrayStepToLines(s, {
    swap:      [5],
    pointer:   [1, 2],
    compare:   [3, 4],
    set:       [6],
    highlight: [8],
  })
)

const NGE_STACK_PY = template('python',
`def next_greater_element(arr):
    stack = []
    result = [-1] * len(arr)
    for i in range(len(arr) - 1, -1, -1):
        while stack and stack[-1] <= arr[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(arr[i])
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [3],
    compare:   [4],
    pop:       [5],
    set:       [6, 7],
    push:      [8],
    highlight: [10],
  })
)

const MERGE_INTERVALS_PY = template('python',
`def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for i in range(1, len(intervals)):
        if intervals[i][0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], intervals[i][1])
        else:
            merged.append(intervals[i])
    return merged`,
  (s) => arrayStepToLines(s, {
    set:       [1, 2, 6],
    pointer:   [3, 4],
    compare:   [4],
    highlight: [8],
  })
)

const MOVE_ZEROS_PY = template('python',
`def move_zeroes(nums):
    non_zero = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[non_zero], nums[i] = nums[i], nums[non_zero]
            non_zero += 1
    return nums`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    swap:      [4],
    compare:   [3],
    set:       [5],
    highlight: [7],
  })
)

const PRODUCT_EXCEPT_SELF_PY = template('python',
`def product_except_self(nums):
    n = len(nums)
    prefix = [1] * n
    for i in range(1, n):
        prefix[i] = prefix[i-1] * nums[i-1]
    suffix = 1
    for i in range(n-1, -1, -1):
        prefix[i] = prefix[i] * suffix
        suffix *= nums[i]
    return prefix`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 6],
    set:       [4, 7],
    compare:   [3, 6],
    highlight: [10],
  })
)

// ═══════════════════════════════════════════════════════════════
//  2. STRINGS — KMP / Rabin-Karp / Palindrome / LCS / Edit Distance
// ═══════════════════════════════════════════════════════════════

const KMP_PY = template('python',
`def kmp_search(text, pattern):
    # Build LPS array
    lps = [0] * len(pattern)
    j = 0
    for i in range(1, len(pattern)):
        while j > 0 and pattern[i] != pattern[j]:
            j = lps[j-1]
        if pattern[i] == pattern[j]:
            j += 1
            lps[i] = j
    # Pattern search using LPS
    i = j = 0
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1; j += 1
        if j == len(pattern):
            return i - j  # Found at index
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0: j = lps[j-1]
            else: i += 1
    return -1`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4, 13],
    compare:   [4, 5, 7, 14, 17],
    set:       [2, 8, 9],
    highlight: [15, 20],
  })
)

const PALINDROME_CHECK_PY = template('python',
`def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 2],
    compare:   [3],
    set:       [5, 6],
    highlight: [7],
  })
)

const LONGEST_PAL_SUBSTR_PY = template('python',
`def longest_palindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l+1:r]
    result = ""
    for i in range(len(s)):
        odd = expand(i, i)
        even = expand(i, i+1)
        result = max(result, odd, even, key=len)
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [6, 7],
    compare:   [2, 3],
    set:       [4, 8, 9],
    highlight: [11],
  })
)

const ANAGRAM_CHECK_PY = template('python',
`def is_anagram(s, t):
    if len(s) != len(t): return False
    freq = {}
    for c in s: freq[c] = freq.get(c, 0) + 1
    for c in t:
        if c not in freq: return False
        freq[c] -= 1
        if freq[c] == 0: del freq[c]
    return len(freq) == 0`,
  (s) => arrayStepToLines(s, {
    set:       [2, 3],
    compare:   [1, 4, 5],
    pointer:   [3, 4],
    highlight: [8],
  })
)

const VALID_PARENS_PY = template('python',
`def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs:
            if not stack or stack[-1] != pairs[c]:
                return False
            stack.pop()
        else:
            stack.append(c)
    return len(stack) == 0`,
  (s) => arrayStepToLines(s, {
    push:      [8],
    pop:       [6],
    compare:   [4, 5],
    pointer:   [3],
    set:       [1, 2],
    highlight: [10],
  })
)

const LCS_PY = template('python',
`def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4],
    compare:   [5],
    set:       [6, 8],
    highlight: [10],
  })
)

const EDIT_DISTANCE_PY = template('python',
`def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`,
  (s) => arrayStepToLines(s, {
    pointer:   [5, 6],
    compare:   [7],
    set:       [8, 10],
    highlight: [12],
  })
)

// ═══════════════════════════════════════════════════════════════
//  3. LINKED LIST
// ═══════════════════════════════════════════════════════════════

const DETECT_CYCLE_PY = template('python',
`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 2],
    compare:   [5],
    set:       [3, 4],
    highlight: [7],
  })
)

const REVERSE_LL_PY = template('python',
`def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 3],
    swap:      [5],
    set:       [6, 7],
    compare:   [4],
    highlight: [9],
  })
)

const MERGE_SORTED_LL_PY = template('python',
`def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val < l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 2],
    compare:   [4, 5],
    set:       [6, 9, 11],
    highlight: [12],
  })
)

// ═══════════════════════════════════════════════════════════════
//  4. TREES — DFS / BFS / LCA / BST / Segment Tree
// ═══════════════════════════════════════════════════════════════

const TREE_INORDER_PY = template('python',
`def inorder(root):
    if not root: return
    inorder(root.left)
    print(root.val)
    inorder(root.right)`,
  (s) => arrayStepToLines(s, {
    visit:     [3],
    recurse:   [2, 4],
    return:    [1],
    compare:   [1],
    highlight: [3],
  })
)

const TREE_PREORDER_PY = template('python',
`def preorder(root):
    if not root: return
    print(root.val)
    preorder(root.left)
    preorder(root.right)`,
  (s) => arrayStepToLines(s, {
    visit:     [2],
    recurse:   [3, 4],
    return:    [1],
    compare:   [1],
    highlight: [2],
  })
)

const TREE_POSTORDER_PY = template('python',
`def postorder(root):
    if not root: return
    postorder(root.left)
    postorder(root.right)
    print(root.val)`,
  (s) => arrayStepToLines(s, {
    visit:     [4],
    recurse:   [2, 3],
    return:    [1],
    compare:   [1],
    highlight: [4],
  })
)

const LEVEL_ORDER_PY = template('python',
`def level_order(root):
    if not root: return []
    result = []
    queue = [root]
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
  (s) => arrayStepToLines(s, {
    visit:     [6, 7],
    recurse:   [0, 3],
    compare:   [0, 3, 8, 9],
    set:       [7, 8, 9],
    pointer:   [4, 5],
    highlight: [11],
  })
)

const BST_SEARCH_PY = template('python',
`def search_bst(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)`,
  (s) => arrayStepToLines(s, {
    visit:     [1, 2],
    compare:   [1, 3],
    recurse:   [4, 5],
    set:       [2],
    highlight: [2],
  })
)

const TREE_HEIGHT_PY = template('python',
`def height(root):
    if not root: return 0
    left = height(root.left)
    right = height(root.right)
    return 1 + max(left, right)`,
  (s) => arrayStepToLines(s, {
    visit:     [4],
    recurse:   [2, 3],
    compare:   [1],
    set:       [4],
    highlight: [4],
  })
)

const TREE_DIAMETER_PY = template('python',
`def diameter(root):
    res = 0
    def dfs(node):
        nonlocal res
        if not node: return 0
        left = dfs(node.left)
        right = dfs(node.right)
        res = max(res, left + right)
        return 1 + max(left, right)
    dfs(root)
    return res`,
  (s) => arrayStepToLines(s, {
    visit:     [7],
    recurse:   [6, 7],
    compare:   [5],
    set:       [8],
    highlight: [10],
  })
)

const LCA_PY = template('python',
`def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root
    return left or right`,
  (s) => arrayStepToLines(s, {
    visit:     [1, 2],
    recurse:   [3, 4],
    compare:   [1, 5],
    set:       [5, 6],
    highlight: [5, 6],
  })
)

const BST_INSERT_PY = template('python',
`def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)
    return root`,
  (s) => arrayStepToLines(s, {
    set:       [2, 4, 6],
    compare:   [1, 3],
    recurse:   [4, 6],
    visit:     [1, 3],
    highlight: [2, 4, 6],
  })
)

// ═══════════════════════════════════════════════════════════════
//  5. GRAPHS — BFS / DFS / Dijkstra / Topo / Kruskal
// ═══════════════════════════════════════════════════════════════

const BFS_PY = template('python',
`def bfs(graph, start):
    visited = set([start])
    queue = [start]
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return visited`,
  (s) => arrayStepToLines(s, {
    visit:     [3, 4],
    traverse:  [5],
    compare:   [6],
    set:       [7, 8],
    pointer:   [2, 4],
    highlight: [10],
  })
)

const DFS_PY = template('python',
`def dfs(graph, node, visited):
    if node in visited: return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)
    return visited`,
  (s) => arrayStepToLines(s, {
    visit:     [2],
    traverse:  [3],
    compare:   [1],
    set:       [2],
    recurse:   [4],
    highlight: [6],
  })
)

const DIJKSTRA_PY = template('python',
`def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]: continue
        for neighbor, weight in graph[node]:
            new_dist = dist[node] + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    return dist`,
  (s) => arrayStepToLines(s, {
    visit:     [3, 5],
    traverse:  [7],
    compare:   [6, 9],
    set:       [10],
    pointer:   [4, 5],
    highlight: [13],
  })
)

const TOPO_SORT_PY = template('python',
`def topological_sort(graph):
    indegree = {u: 0 for u in graph}
    for u in graph:
        for v in graph[u]:
            indegree[v] += 1
    queue = [u for u in graph if indegree[u] == 0]
    result = []
    while queue:
        u = queue.pop(0)
        result.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return result if len(result) == len(graph) else []`,
  (s) => arrayStepToLines(s, {
    visit:     [6, 7],
    traverse:  [9],
    compare:   [10],
    set:       [11, 12],
    pointer:   [5, 8],
    highlight: [14],
  })
)

const KRUSKAL_PY = template('python',
`def kruskal(edges, n):
    parent = list(range(n))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        px, py = find(x), find(y)
        if px == py: return False
        parent[py] = px
        return True
    edges.sort(key=lambda e: e[2])
    mst = []
    for u, v, w in edges:
        if union(u, v):
            mst.append((u, v, w))
    return mst`,
  (s) => arrayStepToLines(s, {
    visit:     [11, 13],
    traverse:  [14],
    compare:   [8, 9],
    set:       [10, 2, 3],
    pointer:   [12, 13],
    highlight: [15],
  })
)

// ═══════════════════════════════════════════════════════════════
//  6. RECURSION & BACKTRACKING
// ═══════════════════════════════════════════════════════════════

const SUBSETS_PY = template('python',
`def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`,
  (s) => arrayStepToLines(s, {
    recurse:   [3, 6, 8],
    return:    [3, 8],
    set:       [4, 5],
    pointer:   [4],
    highlight: [8, 9],
  })
)

const PERMUTATIONS_PY = template('python',
`def permute(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack(path, used)
                path.pop()
                used[i] = False
    backtrack([], [False] * len(nums))
    return result`,
  (s) => arrayStepToLines(s, {
    recurse:   [3, 10, 13],
    return:    [4, 5, 13],
    set:       [8, 9, 11, 12],
    pointer:   [6],
    highlight: [4, 5],
  })
)

const N_QUEENS_PY = template('python',
`def solve_n_queens(n):
    cols, diag1, diag2 = set(), set(), set()
    result = []
    board = [['.'] * n for _ in range(n)]
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            board[row][col] = 'Q'
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            backtrack(row + 1)
            board[row][col] = '.'
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)
    backtrack(0)
    return result`,
  (s) => arrayStepToLines(s, {
    recurse:   [6, 14, 16],
    return:    [7, 8, 16],
    set:       [11, 12, 15],
    pointer:   [9],
    compare:   [10],
    highlight: [7, 8],
  })
)

// ═══════════════════════════════════════════════════════════════
//  7. SORTING & SEARCHING
// ═══════════════════════════════════════════════════════════════

const BINARY_SEARCH_PY = template('python',
`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 2, 3],
    compare:   [4, 5, 7],
    set:       [6, 8, 10],
    highlight: [6, 11],
  })
)

const MERGE_SORT_PY = template('python',
`def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 10],
    compare:   [1, 10, 11],
    set:       [3, 4, 5, 8, 12, 14],
    swap:      [12, 14],
    highlight: [6, 15],
  })
)

const QUICK_SORT_PY = template('python',
`def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
  (s) => arrayStepToLines(s, {
    pointer:   [6, 8],
    compare:   [9],
    set:       [7, 10],
    swap:      [11, 12],
    recurse:   [2, 3],
    highlight: [4, 13],
  })
)

const COUNTING_SORT_PY = template('python',
`def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for num in arr: count[num] += 1
    for i in range(1, len(count)): count[i] += count[i-1]
    output = [0] * len(arr)
    for num in reversed(arr):
        output[count[num] - 1] = num
        count[num] -= 1
    return output`,
  (s) => arrayStepToLines(s, {
    set:       [2, 3, 4, 5, 7],
    pointer:   [3, 6],
    compare:   [3, 4],
    highlight: [9],
  })
)

// ═══════════════════════════════════════════════════════════════
//  8. HASHING
// ═══════════════════════════════════════════════════════════════

const TWO_SUM_HASH_PY = template('python',
`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    compare:   [4],
    set:       [6],
    highlight: [5, 7],
  })
)

const SUBARRAY_SUM_K_PY = template('python',
`def subarray_sum(nums, k):
    count = pref = 0
    map = {0: 1}
    for num in nums:
        pref += num
        if pref - k in map:
            count += map[pref - k]
        map[pref] = map.get(pref, 0) + 1
    return count`,
  (s) => arrayStepToLines(s, {
    pointer:   [3],
    compare:   [5],
    set:       [6, 7],
    highlight: [8],
  })
)

const LONGEST_CONSECUTIVE_PY = template('python',
`def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    for n in num_set:
        if n - 1 not in num_set:
            length = 1
            while n + length in num_set:
                length += 1
            longest = max(longest, length)
    return longest`,
  (s) => arrayStepToLines(s, {
    pointer:   [3],
    compare:   [4],
    set:       [5, 6, 8],
    highlight: [9],
  })
)

// ═══════════════════════════════════════════════════════════════
//  9. HEAP / PRIORITY QUEUE
// ═══════════════════════════════════════════════════════════════

const KTH_LARGEST_HEAP_PY = template('python',
`def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    return heap[0]`,
  (s) => arrayStepToLines(s, {
    set:       [1, 2],
    pointer:   [3],
    compare:   [4],
    push:      [5],
    pop:       [5],
    highlight: [6],
  })
)

const MEDIAN_HEAP_PY = template('python',
`def median_of_stream(nums):
    max_heap = []  # store smaller half (negated)
    min_heap = []  # store larger half
    for num in nums:
        heapq.heappush(max_heap, -num)
        if max_heap and min_heap and -max_heap[0] > min_heap[0]:
            val = -heapq.heappop(max_heap)
            heapq.heappush(min_heap, val)
        if len(max_heap) > len(min_heap) + 1:
            val = -heapq.heappop(max_heap)
            heapq.heappush(min_heap, val)
        elif len(min_heap) > len(max_heap):
            val = heapq.heappop(min_heap)
            heapq.heappush(max_heap, -val)
        median = -max_heap[0] if len(max_heap) > len(min_heap) else \
                 (min_heap[0] + (-max_heap[0])) / 2
    return median`,
  (s) => arrayStepToLines(s, {
    set:     [3, 4],
    pointer: [5],
    push:    [5, 8, 11],
    pop:     [7, 10, 13],
    compare: [6, 9, 12],
    highlight: [14],
  })
)

// ═══════════════════════════════════════════════════════════════
//  10. STACKS / QUEUES
// ═══════════════════════════════════════════════════════════════

const INFIX_TO_POSTFIX_PY = template('python',
`def infix_to_postfix(expr):
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    stack = []
    output = []
    for c in expr:
        if c.isalnum():
            output.append(c)
        elif c == '(':
            stack.append(c)
        elif c == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()
        else:
            while stack and stack[-1] != '(' and precedence[c] <= precedence.get(stack[-1], 0):
                output.append(stack.pop())
            stack.append(c)
    while stack: output.append(stack.pop())
    return ''.join(output)`,
  (s) => arrayStepToLines(s, {
    push:      [5, 7, 17],
    pop:       [11, 15, 18],
    compare:   [10, 14],
    set:       [6],
    pointer:   [4],
    highlight: [19],
  })
)

const POSTFIX_EVAL_PY = template('python',
`def evaluate_postfix(expr):
    stack = []
    for c in expr:
        if c.isdigit():
            stack.append(int(c))
        else:
            b = stack.pop()
            a = stack.pop()
            if c == '+': stack.append(a + b)
            elif c == '-': stack.append(a - b)
            elif c == '*': stack.append(a * b)
            elif c == '/': stack.append(a // b)
    return stack[0]`,
  (s) => arrayStepToLines(s, {
    push:      [3],
    pop:       [6, 7],
    set:       [8, 9, 10, 11],
    compare:   [5, 6],
    pointer:   [1],
    highlight: [13],
  })
)

// ═══════════════════════════════════════════════════════════════
//  11. DYNAMIC PROGRAMMING
// ═══════════════════════════════════════════════════════════════

const FIBONACCI_DP_PY = template('python',
`def fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
  (s) => arrayStepToLines(s, {
    set:       [2, 3, 5],
    pointer:   [4],
    compare:   [1],
    highlight: [6],
  })
)

const KNAPSACK_DP_PY = template('python',
`def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4],
    compare:   [5],
    set:       [6, 8],
    highlight: [9],
  })
)

const UNIQUE_PATHS_DP_PY = template('python',
`def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 3],
    set:       [4],
    compare:   [2, 3],
    highlight: [5],
  })
)

const LIS_DP_PY = template('python',
`def length_of_lis(nums):
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 3],
    compare:   [4],
    set:       [5],
    highlight: [6],
  })
)

const COIN_CHANGE_PY = template('python',
`def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], 1 + dp[i - coin])
    return dp[amount] if dp[amount] != float('inf') else -1`,
  (s) => arrayStepToLines(s, {
    pointer:   [3, 4],
    compare:   [5],
    set:       [6],
    highlight: [7],
  })
)

// ═══════════════════════════════════════════════════════════════
//  12. GREEDY
// ═══════════════════════════════════════════════════════════════

const JUMP_GAME_PY = template('python',
`def can_jump(nums):
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach: return False
        max_reach = max(max_reach, i + nums[i])
    return True`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    compare:   [3],
    set:       [4],
    highlight: [5],
  })
)

const JUMP_GAME_2_PY = template('python',
`def jump(nums):
    jumps = curr_end = curr_farthest = 0
    for i in range(len(nums) - 1):
        curr_farthest = max(curr_farthest, i + nums[i])
        if i == curr_end:
            jumps += 1
            curr_end = curr_farthest
    return jumps`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    compare:   [4],
    set:       [3, 5, 6],
    highlight: [7],
  })
)

const INTERVAL_SCHEDULING_PY = template('python',
`def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])
    count, end = 1, intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end:
            count += 1
            end = intervals[i][1]
    return count`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 3],
    compare:   [4],
    set:       [5, 6],
    highlight: [7],
  })
)

// ═══════════════════════════════════════════════════════════════
//  13. BIT MANIPULATION
// ═══════════════════════════════════════════════════════════════

const SINGLE_NUMBER_PY = template('python',
`def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    set:       [3],
    compare:   [1],
    highlight: [4],
  })
)

const COUNT_SET_BITS_PY = template('python',
`def count_set_bits(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    set:       [3, 4],
    compare:   [2],
    highlight: [5],
  })
)

const FAST_POWER_PY = template('python',
`def fast_power(a, b):
    result = 1
    while b > 0:
        if b & 1:
            result *= a
        a *= a
        b >>= 1
    return result`,
  (s) => arrayStepToLines(s, {
    pointer:   [2],
    compare:   [2],
    set:       [1, 4, 5, 6],
    highlight: [7],
  })
)

// ═══════════════════════════════════════════════════════════════
//  14. MATH & NUMBER THEORY
// ═══════════════════════════════════════════════════════════════

const GCD_PY = template('python',
`def gcd(a, b):
    while b:
        a, b = b, a % b
    return a`,
  (s) => arrayStepToLines(s, {
    set:       [2],
    compare:   [1],
    pointer:   [1],
    highlight: [3],
  })
)

const SIEVE_PY = template('python',
`def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return [i for i in range(2, n + 1) if is_prime[i]]`,
  (s) => arrayStepToLines(s, {
    pointer:   [3],
    compare:   [4],
    set:       [1, 2, 6],
    highlight: [7],
  })
)

const PASCAL_TRIANGLE_PY = template('python',
`def pascal_triangle(n):
    triangle = []
    for i in range(n):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        triangle.append(row)
    return triangle`,
  (s) => arrayStepToLines(s, {
    pointer:   [2, 4],
    set:       [3, 5, 6],
    compare:   [4],
    highlight: [7],
  })
)

// ═══════════════════════════════════════════════════════════════
//  15. TRIE
// ═══════════════════════════════════════════════════════════════

const TRIE_INSERT_PY = template('python',
`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
class Trie:
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True`,
  (s) => arrayStepToLines(s, {
    set:       [7, 8, 9, 11],
    pointer:   [7, 8],
    compare:   [9],
    highlight: [11],
  })
)

const TRIE_SEARCH_PY = template('python',
`def search(self, word):
    node = self.root
    for c in word:
        if c not in node.children:
            return False
        node = node.children[c]
    return node.is_end`,
  (s) => arrayStepToLines(s, {
    pointer:   [1, 2],
    compare:   [3],
    set:       [5],
    highlight: [6],
  })
)

// ═══════════════════════════════════════════════════════════════
//  16. DSU (DISJOINT SET UNION)
// ═══════════════════════════════════════════════════════════════

const DSU_PY = template('python',
`class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        return True`,
  (s) => arrayStepToLines(s, {
    set:       [2, 3, 6, 11, 12, 14, 16],
    pointer:   [5, 10],
    compare:   [6, 11, 12],
    recurse:   [6],
    highlight: [7, 17],
  })
)

// ═══════════════════════════════════════════════════════════════
//  17. SEGMENT TREE
// ═══════════════════════════════════════════════════════════════

const SEGMENT_TREE_PY = template('python',
`class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)
    def _build(self, arr, node, l, r):
        if l == r:
            self.tree[node] = arr[l]
            return
        mid = (l + r) // 2
        self._build(arr, node*2, l, mid)
        self._build(arr, node*2+1, mid+1, r)
        self.tree[node] = self.tree[node*2] + self.tree[node*2+1]`,
  (s) => arrayStepToLines(s, {
    set:       [6, 12],
    pointer:   [4, 5],
    recurse:   [9, 10],
    compare:   [6],
    highlight: [12],
  })
)

// ═══════════════════════════════════════════════════════════════
//  EXPORT — Map pattern IDs to their code template
// ═══════════════════════════════════════════════════════════════

// Map pattern ID patterns (prefixes/regex) to templates
const TEMPLATE_MAP = [
  // Arrays
  { pattern: /1dPrefixSum|2dPrefixSum|suffixSum|prefixXor|prefixProduct|runningSum|differenceArray/, tpl: PREFIX_SUM_PY },
  { pattern: /oppositeTwoPointer|sameDirectionPointer|mergeSortedInplace|inplaceReversal/, tpl: TWO_POINTER_PY },
  { pattern: /fixedSlidingWindow|variableLongest|variableShortest|slidingWindowFreq|slidingWindowDeque/, tpl: SLIDING_WINDOW_PY },
  { pattern: /maxSubarraySum|maxCircularSubarray|minSubarraySum/, tpl: KADANE_PY },
  { pattern: /maxSubarrayProduct|maxProductSubarray/, tpl: KADANE_PY },
  { pattern: /threeSum|fourSum/, tpl: THREE_SUM_PY },
  { pattern: /containerMostWater/, tpl: CONTAINER_WATER_PY },
  { pattern: /trappingRainWater2Ptr/, tpl: TRAPPING_RAIN_WATER_PY },
  { pattern: /threeWayPartition|segregateEvenOdd|segregatePosNeg|segregateCustom|sortColors/, tpl: DUTCH_FLAG_PY },
  { pattern: /majorityN2|majorityN3|kMajority/, tpl: MOORES_VOTING_PY },
  { pattern: /stock1Transaction|stockUnlimited|stockKTransactions|stockAtMostK|stockCooldown|stockWithFee/, tpl: STOCK_BUY_SELL_PY },
  { pattern: /stock1TransactionSM|stockUnlimitedSM|stockKTransactionsSM|stockCooldownSM|stockFeeSM/, tpl: STOCK_BUY_SELL_PY },
  { pattern: /findMissingNumber|findDuplicateNumber|findAllMissing|findAllDuplicates/, tpl: CYCLIC_SORT_PY },
  { pattern: /firstMissingPositive/, tpl: CYCLIC_SORT_PY },
  { pattern: /nextGreaterElement|nextSmallerElement|prevGreaterElement|prevSmallerElement|sumSubarrayMins|sumSubarrayMaxs|maxWidthRamp/, tpl: NGE_STACK_PY },
  { pattern: /largestRectangleHistogram|trappingRainStack|sumSubarrayMinMax|maxWidthRamp2/, tpl: NGE_STACK_PY },
  { pattern: /mergeOverlapping|insertInterval|nonOverlapping|intervalIntersection|employeeFreeTime/, tpl: MERGE_INTERVALS_PY },
  { pattern: /alternatePosNeg|moveZerosEnd|rearrangeBySign|shuffleInterleave/, tpl: MOVE_ZEROS_PY },
  { pattern: /removeDuplicatesInplace|removeElementInplace|dedupSortedInplace|dedupUnsortedInplace/, tpl: TWO_POINTER_PY },
  { pattern: /productExceptSelf/, tpl: PRODUCT_EXCEPT_SELF_PY },
  { pattern: /countSubarraySumK|longestSubarraySumK|subarrayEqual01|smallestSubarraySumS|countSubarrayProductK/, tpl: SUBARRAY_SUM_K_PY },

  // Strings
  { pattern: /kmpSearch|countPatternKMP|repeatedStringMatch|shortestPalindromeKMP/, tpl: KMP_PY },
  { pattern: /lpsArray|zPatternMatch|zCountOccurrences|zConcatTrick/, tpl: KMP_PY },
  { pattern: /rkSinglePattern|rkMultiPattern|rkPatternMatch|repeatedDna|repeatedDna2/, tpl: KMP_PY },
  { pattern: /checkPalindrome|validPalindrome2/, tpl: PALINDROME_CHECK_PY },
  { pattern: /longestPalSubstrExpand|countPalSubstrings|manacherLongest|manacherCount/, tpl: LONGEST_PAL_SUBSTR_PY },
  { pattern: /checkAnagram|findAnagramPositions|minWindowAnagram|rotationCheck|isomorphic/, tpl: ANAGRAM_CHECK_PY },
  { pattern: /groupAnagrams|palindromePairs|wordPattern|replaceWords/, tpl: ANAGRAM_CHECK_PY },
  { pattern: /validParens|minAddValid|longestValidParens|removeInvalidParens|scoreOfParens|validParensCheck|minRemoveValid|longestValidParenSubstr/, tpl: VALID_PARENS_PY },
  { pattern: /lcs|printLCS|longestCommonSubstr|shortestCommonSupersequence|longestPalSubseq|longestPalSubstrDP|countPalSubstrDP/, tpl: LCS_PY },
  { pattern: /minEditDistance|oneEditDistance|deleteTwoStrings|minAsciiDelete|levenshteinDist|oneEditDistCheck|deleteOpsTwoStrings|minAsciiDeleteSum|minInsertPalindrome/, tpl: EDIT_DISTANCE_PY },
  { pattern: /runLengthEncode|decodeEncode|compressInplace/, tpl: VALID_PARENS_PY },
  { pattern: /wildcardMatch|regexMatch/, tpl: EDIT_DISTANCE_PY },

  // Linked List
  { pattern: /detectCycle|findCycleStart|happyNumber|palindromeLL|reorderListLL/, tpl: DETECT_CYCLE_PY },
  { pattern: /reverseEntireLL|reverseKGroup|reverseBetween|reverseAlternateK|cloneHashMap|cloneInplaceWeave|lruCacheDL|flattenDoublyLL|flattenNestedLL/, tpl: REVERSE_LL_PY },
  { pattern: /mergeTwoSortedLL|mergeKSortedHeap|mergeKSortedDC|intersectionTwoPointer|intersectionHashSet/, tpl: MERGE_SORTED_LL_PY },
  { pattern: /findMiddleLL|nthFromEnd|removeNthFromEnd|findMiddleForSort/, tpl: DETECT_CYCLE_PY },
  { pattern: /mergeSortLL|insertionSortLL/, tpl: MERGE_SORT_PY },

  // Trees
  { pattern: /inorderRecursive|inorderIterative|morrisInorder|kthSmallestBST|kthLargestBST|bstIteratorStack/, tpl: TREE_INORDER_PY },
  { pattern: /preorderRecursive|preorderIterative|morrisPreorder|serializeDFS|constructInorderPreorder/, tpl: TREE_PREORDER_PY },
  { pattern: /postorderRecursive|postorderIterative/, tpl: TREE_POSTORDER_PY },
  { pattern: /levelOrderStd|levelAverages|levelSums|zigzagLevelOrder|leftSideView|rightSideView|serializeBFS|constructInorderPostorder|constructLevelOrderBST/, tpl: LEVEL_ORDER_PY },
  { pattern: /heightOfTree|maxWidthTree|minDepthTree|maxPathRootToLeaf/, tpl: TREE_HEIGHT_PY },
  { pattern: /diameterOfTree|maxPathAnyToAny|treeDiameterDP|binaryTreeCameras|heavyLightDecomp/, tpl: TREE_DIAMETER_PY },
  { pattern: /lcaBinaryTree|lcaBST|lcaParentPtrs|lcaBinaryLifting/, tpl: LCA_PY },
  { pattern: /searchBST|deleteBST|validateBSTMinMax|validateBSTInorder/, tpl: BST_SEARCH_PY },
  { pattern: /bstInsertRecursive|bstInsertIterative/, tpl: BST_INSERT_PY },
  { pattern: /buildSegmentTree|segTreePointUpdateRangeSum|segTreeRangeMinMax|segTreeLazyProp/, tpl: SEGMENT_TREE_PY },
  { pattern: /topView|bottomView|leftView|rightView|verticalOrder/, tpl: LEVEL_ORDER_PY },
  { pattern: /printRootToNode|pathSumHasPath|allPathsTarget|pathSumPrefix/, tpl: TREE_INORDER_PY },

  // Graphs
  { pattern: /shortestPathUnweighted|rottenOranges|zeroOneMatrix|multiSourceRotten|wallsAndGates|bipartiteBFS|numIslands/, tpl: BFS_PY },
  { pattern: /pathFindingDFS|connectedComponents|floodFill/, tpl: DFS_PY },
  { pattern: /dijkstraStd|dijkstraGrid|networkDelayTime|cheapestFlightsK/, tpl: DIJKSTRA_PY },
  { pattern: /topoSortDFS|kahnTopoSort|courseSchedule1|courseSchedule2|cycleKahn|reconstructItinerary/, tpl: TOPO_SORT_PY },
  { pattern: /bellmanFordStd|negCycleDetection|fordFulkerson|kruskalSortDSU|minCostConnectPoints|kruskalDSU/, tpl: KRUSKAL_PY },
  { pattern: /cycleDFS|cycleDSU|cycleDSU2/, tpl: DFS_PY },
  { pattern: /kosarajuSCC|tarjanSCC|tarjanBridges|articulationPoints/, tpl: DFS_PY },
  { pattern: /eulerPath|convexHullGraham|convexHullJarvis/, tpl: KRUSKAL_PY },

  // Recursion & Backtracking
  { pattern: /allSubsets|subsetsWithDups|subsetGivenSum|beautifulSubsets/, tpl: SUBSETS_PY },
  { pattern: /allPermutations|permutationsWithDups|letterCombos/, tpl: PERMUTATIONS_PY },
  { pattern: /combinationsNCR|comboSumUnlimited|comboSumUnique|comboSumExactK/, tpl: SUBSETS_PY },
  { pattern: /nQueensAll|nQueensCount|solveSudoku|validSudoku/, tpl: N_QUEENS_PY },
  { pattern: /ratInMaze|wordSearch|knightsTour|uniquePathsObstaclesBT/, tpl: N_QUEENS_PY },
  { pattern: /allPalPartitions|minCutsDP|addOpsToTarget/, tpl: PERMUTATIONS_PY },

  // Sorting & Searching
  { pattern: /stdBinarySearch|firstOccurrence|lastOccurrence|countOccurrences|floorCeiling|sqrtInt/, tpl: BINARY_SEARCH_PY },
  { pattern: /findPeakElement|lowerBound|upperBound|countRange/, tpl: BINARY_SEARCH_PY },
  { pattern: /searchRotated|minRotated|searchRotatedDups/, tpl: BINARY_SEARCH_PY },
  { pattern: /mergeSort2|countInversions|inversionCountMerge/, tpl: MERGE_SORT_PY },
  { pattern: /stdQuickSort|randomizedQuickSort|threeWayQuickSort|quickSelect|kthLargestQS|kthSmallest/, tpl: QUICK_SORT_PY },
  { pattern: /countingSort|radixSortLSD|bucketSort/, tpl: COUNTING_SORT_PY },

  // Hashing
  { pattern: /twoSumHash|fourSumHash|twoSumClassic/, tpl: TWO_SUM_HASH_PY },
  { pattern: /subarrayZeroSum|subarraySumK|countSubarraysK|longestSubarrayK|countSubarraysXOR/, tpl: SUBARRAY_SUM_K_PY },
  { pattern: /longestConsecutiveHashSet|longestConsecutiveHashMap/, tpl: LONGEST_CONSECUTIVE_PY },
  { pattern: /charFreq|wordFreq|countPairsCondition/, tpl: TWO_SUM_HASH_PY },

  // Heap
  { pattern: /kthLargestMinHeap|kthSmallestMaxHeap|kClosestPoints|kthLargestStream|mergeKSortedHeaps|smallestRangeKLists|buildHuffmanTree|assignHuffmanCodes/, tpl: KTH_LARGEST_HEAP_PY },
  { pattern: /topKFreqElements|topKFreqWords|sortCharsByFreq/, tpl: KTH_LARGEST_HEAP_PY },
  { pattern: /medianTwoHeaps|slidingWindowMedian/, tpl: MEDIAN_HEAP_PY },
  { pattern: /cpuScheduling|taskScheduler2|meetingRoomsHeap|reorganizeString|taskSchedulerGreedy/, tpl: KTH_LARGEST_HEAP_PY },

  // DP
  { pattern: /fibonacciDP|climbingStairs|frogJumpMinCost|integerBreak|perfectSquares|decodeWays/, tpl: FIBONACCI_DP_PY },
  { pattern: /houseRobber1|houseRobberCircular/, tpl: KADANE_PY },
  { pattern: /coinChangeMin|coinChangeWays/, tpl: COIN_CHANGE_PY },
  { pattern: /knapsack01Std|unboundedKnapsack|rodCutting/, tpl: KNAPSACK_DP_PY },
  { pattern: /subsetSum|equalPartitionSum|countSubsetsSumK|minSubsetDiff|targetSumAssign/, tpl: KNAPSACK_DP_PY },
  { pattern: /uniquePaths|uniquePathsObstacles|minPathSum|dungeonGame|triangleMinPath|goldMine/, tpl: UNIQUE_PATHS_DP_PY },
  { pattern: /lisOn2|lisOnLogN|numberOfLIS|longestBitonic/, tpl: LIS_DP_PY },
  { pattern: /matrixChainMult|booleanParenthesization|burstBalloons|minCostCutStick|optimalBST/, tpl: KNAPSACK_DP_PY },

  // Greedy
  { pattern: /jumpGame1|jumpGame3/, tpl: JUMP_GAME_PY },
  { pattern: /jumpGame2/, tpl: JUMP_GAME_2_PY },
  { pattern: /maxNonOverlapIntervals|meetingRooms1|jobSequencingDSU|jobSequencingGreedy|candyDistribution|gasStation/, tpl: INTERVAL_SCHEDULING_PY },
  { pattern: /minPlatforms|meetingRooms2/, tpl: INTERVAL_SCHEDULING_PY },
  { pattern: /removeKDigits|removeDuplicateLetters/, tpl: NGE_STACK_PY },

  // Bit Manipulation
  { pattern: /singleNumber|singleNumberThrice|twoNonRepeating|missingAndRepeating|xor1toN/, tpl: SINGLE_NUMBER_PY },
  { pattern: /countSetBits|isolateRightmostSet|swapWithoutTemp/, tpl: COUNT_SET_BITS_PY },
  { pattern: /fastPower|fastPowerMod|modularInverseFermat/, tpl: FAST_POWER_PY },
  { pattern: /setIthBit|unsetIthBit|toggleIthBit|checkIthBit|reverseBits32|grayCodeGen/, tpl: COUNT_SET_BITS_PY },

  // Math
  { pattern: /euclideanGCD|extendedEuclidean|lcmFromGCD|modularInverseEEA/, tpl: GCD_PY },
  { pattern: /stdSieve|segmentedSieve|sieveSPF/, tpl: SIEVE_PY },
  { pattern: /trialDivision|spfFactorization/, tpl: SIEVE_PY },
  { pattern: /pascalTriangle2|nCrDP|pascalTriangle/, tpl: PASCAL_TRIANGLE_PY },
  { pattern: /catalanNumber|catalanBST|nCrModInv/, tpl: FIBONACCI_DP_PY },
  { pattern: /fibonacciLogN|solveLinearRecurrence/, tpl: FAST_POWER_PY },
  { pattern: /countDivisors|sumDivisors/, tpl: SIEVE_PY },

  // Trie
  { pattern: /trieInsert|buildFailureLinks/, tpl: TRIE_INSERT_PY },
  { pattern: /trieSearch|trieDelete|autocompleteSystem/, tpl: TRIE_SEARCH_PY },
  { pattern: /triePrefix|searchSuggestions|longestCommonPrefixAll/, tpl: TRIE_SEARCH_PY },
  { pattern: /maxXorTwoNumbers|maxXorSubarray/, tpl: TRIE_INSERT_PY },

  // DSU
  { pattern: /dsuFindPathCompression|dsuUnionRank|dsuUnionSize|dsuComponents|kruskalDSU|accountsMerge2|redundantConnection2|numProvinces/, tpl: DSU_PY },

  // Segment Tree & Advanced
  { pattern: /buildSegTree2|segTreePointSum|segTreeRangeMin|segTreeLazyRange/, tpl: SEGMENT_TREE_PY },
  { pattern: /bitPointUpdatePrefixSum|bitRangeUpdatePoint|bitRangeUpdateRange|bit2D|fenwickPointUpdatePrefixSum|fenwickRangeUpdatePointQuery/, tpl: SEGMENT_TREE_PY },
  { pattern: /buildSparseTable|rmqSparseTable|rangeGCDSparse/, tpl: SEGMENT_TREE_PY },

  // Divide & Conquer
  { pattern: /karatsubaMult|masterTheorem/, tpl: MERGE_SORT_PY },
  { pattern: /closestPairPoints/, tpl: MERGE_SORT_PY },

  // Misc
  { pattern: /fisherYatesShuffle/, tpl: COUNTING_SORT_PY },
  { pattern: /mergeKSortedArrays|smallestRangeKWay|reservoirSampleList|reservoirSampleStream/, tpl: KTH_LARGEST_HEAP_PY },
  { pattern: /bidirectionalBFS|meetInMiddleSubset/, tpl: BFS_PY },
  { pattern: /coordEvents|sweepLineEvents/, tpl: INTERVAL_SCHEDULING_PY },

  // Fallback / Stack-specific
  { pattern: /infixToPostfix|infixToPrefix|basicCalc1|basicCalc2|basicCalc3/, tpl: INFIX_TO_POSTFIX_PY },
  { pattern: /postfixEval/, tpl: POSTFIX_EVAL_PY },
  { pattern: /minStack|maxStack|minMaxDeleteStack|decodeKEncoded|nestedDecoding/, tpl: POSTFIX_EVAL_PY },
  { pattern: /stockSpan|dailyTemps2|onlineStockSpan|dailyTemps/, tpl: NGE_STACK_PY },
  { pattern: /nextGreater1|nextGreater2/, tpl: NGE_STACK_PY },
  { pattern: /largestRectHist|trappingRainStack2/, tpl: NGE_STACK_PY },
  { pattern: /windowMaxK|windowMinK|implCircularQueue|implCircularDeque|firstNonRepeatQueue/, tpl: SLIDING_WINDOW_PY },

  // lcs2 / lcs DP category
  { pattern: /lcs2/, tpl: LCS_PY },
]

// ─── Fallback generic templates by visualizer type ─────────
const GENERIC_ARRAY_PY = template('python',
`def visualize(arr):
    n = len(arr)
    for i in range(n):
        # Process element at index i
        process(arr[i])
    return result`,
  (s) => arrayStepToLines(s, {
    pointer: [1, 2],
    set:     [3],
    compare: [3],
    highlight: [5],
  })
)

const GENERIC_GRAPH_PY = template('python',
`def traverse(graph, start):
    visited = set()
    def dfs(node):
        if node in visited: return
        visited.add(node)
        for neighbor in graph.get(node, []):
            dfs(neighbor)
    dfs(start)
    return visited`,
  (s) => arrayStepToLines(s, {
    visit:    [4],
    traverse: [6],
    compare:  [3],
    set:      [4],
    recurse:  [6],
    highlight: [8],
  })
)

const GENERIC_TREE_PY = template('python',
`def traverse(root):
    if not root: return
    # Visit node
    print(root.val)
    traverse(root.left)
    traverse(root.right)`,
  (s) => arrayStepToLines(s, {
    visit:    [2, 3],
    recurse:  [4, 5],
    compare:  [1],
    highlight: [3],
  })
)

const GENERIC_LL_PY = template('python',
`def process_linked_list(head):
    curr = head
    while curr:
        # Process current node
        curr.val
        curr = curr.next
    return`,
  (s) => arrayStepToLines(s, {
    pointer: [1, 2],
    set:     [4],
    compare: [2],
    highlight: [6],
  })
)

const GENERIC_MATRIX_PY = template('python',
`def process_matrix(matrix):
    m, n = len(matrix), len(matrix[0])
    for i in range(m):
        for j in range(n):
            # Process cell (i, j)
            process(matrix[i][j])
    return`,
  (s) => arrayStepToLines(s, {
    pointer: [2, 3],
    set:     [4],
    compare: [2, 3],
    highlight: [6],
  })
)

const GENERIC_RECURSION_PY = template('python',
`def backtrack(path, options):
    if is_complete(path):
        result.append(path[:])
        return
    for option in options:
        path.append(option)
        backtrack(path, options)
        path.pop()`,
  (s) => arrayStepToLines(s, {
    recurse:  [1, 6],
    return:   [2, 3, 7],
    set:      [5, 7],
    pointer:  [4],
    compare:  [1],
    highlight: [2, 3],
  })
)

const GENERIC_STACK_PY = template('python',
`def stack_operation(items):
    stack = []
    for item in items:
        # Process with stack
        if condition(item):
            stack.append(item)
        else:
            stack.pop()
    return stack`,
  (s) => arrayStepToLines(s, {
    push:     [5],
    pop:      [7],
    pointer:  [2],
    compare:  [4],
    set:      [8],
    highlight: [8],
  })
)

const GENERIC_HEAP_PY = template('python',
`def heap_operation(items):
    heap = []
    for item in items:
        heapq.heappush(heap, item)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap`,
  (s) => arrayStepToLines(s, {
    push:     [3],
    pop:      [5],
    pointer:  [2],
    compare:  [4],
    set:      [6],
    highlight: [6],
  })
)

// ─── Get template for a pattern ID ─────────────────────────
export function getCodeTemplate(patternId, visualizerType = 'array') {
  for (const { pattern, tpl } of TEMPLATE_MAP) {
    if (pattern.test(patternId)) {
      return tpl
    }
  }
  // Fallback by visualizer type
  switch (visualizerType) {
    case 'array':   return GENERIC_ARRAY_PY
    case 'tree':    return GENERIC_TREE_PY
    case 'graph':   return GENERIC_GRAPH_PY
    case 'linkedlist': return GENERIC_LL_PY
    case 'matrix':  return GENERIC_MATRIX_PY
    case 'recursion': return GENERIC_RECURSION_PY
    case 'stack':   return GENERIC_STACK_PY
    case 'queue':   return GENERIC_STACK_PY
    case 'string':  return GENERIC_ARRAY_PY
    case 'dp':      return GENERIC_ARRAY_PY
    case 'heap':    return GENERIC_HEAP_PY
    default:        return GENERIC_ARRAY_PY
  }
}

export function getHighlightedLines(patternId, step, visualizerType = 'array') {
  const template = getCodeTemplate(patternId, visualizerType)
  return template.getHighlightedLines(step)
}

export default { getCodeTemplate, getHighlightedLines }
