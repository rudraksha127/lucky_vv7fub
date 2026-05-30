import { useState, useMemo } from 'react'
import { Play, RotateCcw, Beaker, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Pattern-specific practice suggestions
const PATTERN_PRACTICE = {
  // Arrays
  '1dPrefixSum': {
    description: 'Compute prefix sum where each element at index i stores sum of arr[0..i]',
    testCases: ['[1,2,3,4,5]', '[0,0,0,0]', '[5]', '[1,-2,3,-4,5]'],
    questions: [
      'How would you query sum of subarray arr[L..R] in O(1)?',
      'What if the array has negative numbers?',
      'How does prefix sum allow O(1) range queries?',
    ],
  },
  'oppositeTwoPointer': {
    description: 'Two pointers start from opposite ends and move toward each other',
    testCases: ['[1,2,3,4,5,6]', '[1,3,5,7,9]', '[2,4,6,8,10]'],
    questions: [
      'When would you use opposite-end vs same-direction pointers?',
      'What is the time complexity?',
      'Can you find a pair with sum = target?',
    ],
  },
  'maxSubarraySum': {
    description: "Kadane's algorithm finds contiguous subarray with maximum sum",
    testCases: ['[-2,1,-3,4,-1,2,1,-5,4]', '[-1,-2,-3]', '[1,2,3,4]'],
    questions: [
      'Why does Kadane work with negative numbers?',
      'How would you modify it to return the subarray indices?',
      'What is the space complexity?',
    ],
  },
  'threeSum': {
    description: 'Find all unique triplets that sum to zero',
    testCases: ['[-1,0,1,2,-1,-4]', '[0,0,0]', '[1,2,-2,-1]'],
    questions: [
      'Why do we sort first?',
      'How do we avoid duplicate triplets?',
      'What is the time complexity?',
    ],
  },
  'containerMostWater': {
    description: 'Find two lines that form container holding maximum water',
    testCases: ['[1,8,6,2,5,4,8,3,7]', '[1,1]', '[4,3,2,1,4]'],
    questions: [
      'Why does the two-pointer approach work?',
      'What is the time complexity?',
      'When do we move left vs right pointer?',
    ],
  },
  'trappingRainWater2Ptr': {
    description: 'Calculate water trapped between bars (two-pointer method)',
    testCases: ['[0,1,0,2,1,0,1,3,2,1,2,1]', '[4,2,0,3,2,5]', '[1,0,2]'],
    questions: [
      'How does the two-pointer approach differ from the stack approach?',
      'Why do we track left_max and right_max?',
      'What is the space complexity?',
    ],
  },
  'sortColors': {
    description: 'Sort array of 0s, 1s, and 2s in-place (Dutch National Flag)',
    testCases: ['[2,0,2,1,1,0]', '[0,1,2]', '[2,2,1,1,0,0]'],
    questions: [
      'How is this different from counting sort?',
      'What are the three pointers tracking?',
      'Why is it O(n) time and O(1) space?',
    ],
  },
  'mergeOverlapping': {
    description: 'Merge all overlapping intervals',
    testCases: ['[[1,3],[2,6],[8,10],[15,18]]', '[[1,4],[4,5]]', '[[1,4],[2,3]]'],
    questions: [
      'Why do we sort by start time first?',
      'How do we detect overlapping intervals?',
      'What is the time complexity?',
    ],
  },
  'nextGreaterElement': {
    description: 'Find the next greater element for each array element',
    testCases: ['[4,5,2,25]', '[13,7,6,12]', '[1,2,3,4]'],
    questions: [
      'How does the monotonic stack achieve O(n)?',
      'What changes for Next Smaller Element?',
      'How would you handle circular arrays?',
    ],
  },
  'majorityN2': {
    description: "Find element appearing more than n/2 times using Moore's Voting",
    testCases: ['[2,2,1,1,1,2,2]', '[1,1,1,2,2,2,2]', '[3,3,4,2,4,4,2,4,4]'],
    questions: [
      "Why does Moore's Voting guarantee a correct candidate?",
      'What if no majority exists?',
      'Can you extend this to find elements > n/3?',
    ],
  },
  'moveZerosEnd': {
    description: 'Move all zeros to the end while maintaining relative order',
    testCases: ['[0,1,0,3,12]', '[0,0,1]', '[1,0,2,0,3,0]'],
    questions: [
      'What is the in-place technique used?',
      'How does this maintain relative order?',
      'What if we want zeros at the beginning?',
    ],
  },
  'stock1Transaction': {
    description: 'Find max profit from one buy and one sell transaction',
    testCases: ['[7,1,5,3,6,4]', '[7,6,4,3,1]', '[1,2,3,4,5]'],
    questions: [
      'Why do we track min_price so far?',
      'What changes for unlimited transactions?',
      'How would you handle cooldown?',
    ],
  },
  'reverseEntireLL': {
    description: 'Reverse a singly linked list iteratively',
    testCases: ['[1,2,3,4,5]', '[1]', '[1,2]'],
    questions: [
      'What are the three pointers used?',
      'How would you reverse recursively?',
      'How do you reverse in groups of K?',
    ],
  },
  'binarySearch': {
    description: 'Binary search finds target in sorted array in O(log n)',
    testCases: ['[-1,0,3,5,9,12]', '[1,2,3,4,5]', '[5]'],
    questions: [
      'Why does binary search need sorted input?',
      'How do you find first/last occurrence?',
      'How would you handle duplicates?',
    ],
  },
  'mergeSort2': {
    description: 'Sort array using divide-and-conquer merge sort algorithm',
    testCases: ['[38,27,43,3,9,82,10]', '[1,2,3,4]', '[4,3,2,1]'],
    questions: [
      'What is the recurrence relation for merge sort?',
      'Why is merge sort stable?',
      'How does it compare to quicksort?',
    ],
  },
  'stdQuickSort': {
    description: 'Sort array using partitioning-based quick sort',
    testCases: ['[3,7,8,5,2,1,9,5,4]', '[1,2,3,4]', '[4,3,2,1]'],
    questions: [
      'What is the worst-case time complexity and why?',
      'How does the partition step work?',
      'How would you choose a pivot?',
    ],
  },
  'kmpSearch': {
    description: 'Efficient pattern matching using KMP algorithm with LPS array',
    testCases: ['"ABABDABACDABABCABAB", "ABABCABAB"', '"AAAA", "AA"', '"ABC", "ABC"'],
    questions: [
      'How does the LPS array help?',
      'What is the time complexity?',
      'How is KMP better than naive search?',
    ],
  },
  'checkPalindrome': {
    description: 'Check if a string reads the same forwards and backwards',
    testCases: ['"racecar"', '"hello"', '"A man, a plan, a canal: Panama"'],
    questions: [
      'How would you handle spaces and punctuation?',
      'What if we allow at most one deletion?',
      'What is the space complexity?',
    ],
  },
  'lcs': {
    description: 'Find the length of longest common subsequence between two strings',
    testCases: ['"abcde", "ace"', '"abc", "abc"', '"abc", "def"'],
    questions: [
      'What is the recurrence for LCS?',
      'How would you print the actual subsequence?',
      'What is the difference between substring and subsequence?',
    ],
  },
  'subsetSum': {
    description: 'Determine if there exists a subset with sum equal to target',
    testCases: ['[3,34,4,12,5,2], 9', '[1,2,3,4], 20', '[1,1,1,1], 2'],
    questions: [
      'What is the DP recurrence?',
      'How would you reconstruct the subset?',
      'Can space complexity be optimized?',
    ],
  },
  'twoSumHash': {
    description: 'Find two numbers that add up to target using hash map',
    testCases: ['[2,7,11,15], 9', '[3,2,4], 6', '[1,1,1], 2'],
    questions: [
      'Why use hash map instead of brute force?',
      'How do you handle duplicates?',
      'What about finding three numbers (3Sum)?',
    ],
  },
  'dijkstraStd': {
    description: "Find shortest paths from source using Dijkstra's algorithm",
    testCases: ['{"1":[{"v":2,"w":2},{"v":3,"w":4}],"2":[{"v":3,"w":1},{"v":4,"w":7}],"3":[{"v":4,"w":3}],"4":[]}'],
    questions: [
      'Why does Dijkstra fail with negative edges?',
      'What data structure gives O(E log V) complexity?',
      'How is it different from BFS?',
    ],
  },
  'bfs': {
    description: 'Breadth-First Search traverses graph level by level',
    testCases: ['{"1":[2,3],"2":[4],"3":[5],"4":[],"5":[]}'],
    questions: [
      'Why is BFS used for shortest path in unweighted graphs?',
      'What is the space complexity?',
      'How would you detect cycles using BFS?',
    ],
  },
  'inorderRecursive': {
    description: 'Inorder traversal visits left → root → right',
    testCases: ['[1,2,3,4,5,6,7]', '[1,null,2,null,3]', '[5,3,7,2,4,6,8]'],
    questions: [
      'Why does inorder traversal of BST give sorted order?',
      'What is the space complexity of recursive vs iterative?',
      'How would you implement Morris traversal?',
    ],
  },
  'levelOrderStd': {
    description: 'Level order traversal visits nodes level by level (BFS on tree)',
    testCases: ['[3,9,20,null,null,15,7]', '[1,2,3,4,5,6,7]'],
    questions: [
      'What data structure is used for BFS?',
      'How would you implement zigzag level order?',
      'What is the space complexity?',
    ],
  },
  'buildSegmentTree': {
    description: 'Build a segment tree for range queries',
    testCases: ['[1,3,5,7,9,11]', '[1,2,3,4]', '[5]'],
    questions: [
      'Why is the tree size 4*n?',
      'What is the time complexity for range query?',
      'How does lazy propagation work?',
    ],
  },
  'coinChangeMin': {
    description: 'Find the minimum number of coins to make a target amount',
    testCases: ['[1,2,5], 11', '[2], 3', '[1,2,5], 100'],
    questions: [
      'What is the DP recurrence?',
      'How does this differ from coin change (ways)?',
      'What if coins can be used unlimited times?',
    ],
  },
  'fibonacciDP': {
    description: 'Compute nth Fibonacci number using dynamic programming',
    testCases: ['10', '1', '2', '30'],
    questions: [
      'What is the difference between memoization and tabulation?',
      'Can you optimize space to O(1)?',
      'How would you compute Fibonacci in O(log n)?',
    ],
  },
  'lisOn2': {
    description: 'Find length of longest increasing subsequence (O(n²) DP)',
    testCases: ['[10,9,2,5,3,7,101,18]', '[1,2,3,4]', '[4,3,2,1]'],
    questions: [
      'What is the DP recurrence?',
      'How can this be optimized to O(n log n)?',
      'How would you print the LIS?',
    ],
  },
  'nQueensAll': {
    description: 'Place N queens on an N×N board such that none attack each other',
    testCases: ['4', '1', '8'],
    questions: [
      'How does backtracking explore the solution space?',
      'How do you check if a position is under attack?',
      'What is the time complexity?',
    ],
  },
  'kthLargestMinHeap': {
    description: 'Find Kth largest element using a min-heap of size K',
    testCases: ['[3,2,1,5,6,4], 2', '[1,2,3,4,5], 1', '[5,5,5,5], 2'],
    questions: [
      'Why use a min-heap instead of max-heap?',
      'What is the time complexity?',
      'How would you find Kth smallest?',
    ],
  },
  'singleNumber': {
    description: 'Find the element that appears only once (others appear twice)',
    testCases: ['[4,1,2,1,2]', '[1,0,1]', '[7,3,5,3,5]'],
    questions: [
      'Why does XOR work for this problem?',
      'How does XOR handle duplicates?',
      'What changes if others appear thrice?',
    ],
  },
  'euclideanGCD': {
    description: 'Find GCD using Euclidean algorithm (recursive)',
    testCases: ['48, 18', '12, 8', '17, 5'],
    questions: [
      'Why does the Euclidean algorithm work?',
      'What is the time complexity?',
      'How do you extend this to LCM?',
    ],
  },
  'stdSieve': {
    description: 'Sieve of Eratosthenes finds all primes up to N',
    testCases: ['30', '10', '2'],
    questions: [
      'What is the time complexity of the Sieve?',
      'How would you find primes in a range [L, R]?',
      'What is the SPF (Smallest Prime Factor) variation?',
    ],
  },
  'trieInsert': {
    description: 'Insert words into a Trie data structure',
    testCases: ['["apple", "app", "apricot"]', '["a", "ab", "abc"]', '["hello", "world"]'],
    questions: [
      'What is the space complexity of a Trie?',
      'How would you implement deletion?',
      'How does a Trie compare to a hash set?',
    ],
  },
  'validParens': {
    description: 'Check if string of brackets is valid and properly closed',
    testCases: ['"()[]{}"', '"([)]"', '"{[]}"'],
    questions: [
      'How does the stack help in this problem?',
      'What is the time complexity?',
      'How would you generate all valid parentheses?',
    ],
  },
  'jumpGame1': {
    description: 'Determine if you can reach the last index (greedy)',
    testCases: ['[2,3,1,1,4]', '[3,2,1,0,4]', '[0]'],
    questions: [
      'How does the greedy approach work?',
      'What is the time complexity?',
      'How is Jump Game II different?',
    ],
  },
  'maxNonOverlapIntervals': {
    description: 'Find maximum number of non-overlapping intervals',
    testCases: ['[[1,2],[2,3],[3,4],[1,3]]', '[[1,2],[1,2],[1,2]]', '[[1,4],[2,3]]'],
    questions: [
      'Why do we sort by end time?',
      'What is the greedy choice?',
      'How is this related to minimum platforms?',
    ],
  },
  'infixToPostfix': {
    description: 'Convert infix expression to postfix notation',
    testCases: ['"a+b*(c^d-e)^(f+g*h)-i"', '"A*B+C"', '"a+b*c"'],
    questions: [
      'What role does the operator stack play?',
      'How do you handle parentheses?',
      'How would you evaluate the postfix expression?',
    ],
  },
  'detectCycle': {
    description: "Floyd's Cycle Detection (Tortoise and Hare) in linked list",
    testCases: ['[3,2,0,-4]', '[1,2]', '[1]'],
    questions: [
      'Why does Floyd cycle detection work?',
      'How do you find the start of cycle?',
      'What is the space complexity?',
    ],
  },
}

// Default practice data for patterns without specific entries
const DEFAULT_PRACTICE = {
  description: 'Experiment with different inputs to see how the algorithm behaves.',
  testCases: ['[1,2,3,4,5]', '[5,4,3,2,1]', '[1,3,2,5,4]'],
  questions: [
    'Try different input sizes to observe the algorithm behavior.',
    'Check how the algorithm handles edge cases.',
    'Compare best vs worst case inputs.',
  ],
}

/**
 * Convert a Judge0-format test input (e.g. "4\n2 7 11 15\n9") into a
 * visualizer-friendly format based on the pattern.
 *
 * Judge0 format: first line = size (number), rest = actual data lines.
 * - Single data line (array only) → [1,2,3,4]
 * - Two data lines (array + target) → [1,2,3,4], 9
 * - Sub-second-line data must contain only numbers/spaces/dashes (not commands like "push")
 *
 * NOTE: At runtime the string contains actual \n newline chars (0x0A),
 * not literal backslash+n. This is because seed.js uses \n in JS string
 * literals, and JSON.stringify/JSON.parse preserves them as actual newlines.
 */
function parseJudge0Input(input) {
  // Must contain literal \n (from seed's '4\n2 7 11 15\n9' format)
  // In JS source, '\\n' means backslash + n (two characters)
  if (!input || !input.includes('\n')) return input

  const lines = input.split('\n').filter(Boolean)
  if (lines.length < 2) return input

  // Judge0 heuristic: first line is a pure number (array size)
  const firstIsNumber = /^\d+$/.test(lines[0].trim())
  if (!firstIsNumber) return input

  // Second line must contain only numeric/space/dash/comma chars (not letters like "push")
  const secondLineNumeric = /^[\d\s\-.,]+$/.test(lines[1].trim())
  if (!secondLineNumeric) return input

  const dataLines = lines.slice(1)

  if (dataLines.length === 1) {
    // Single data line: convert "2 7 11 15" → [2,7,11,15]
    const data = dataLines[0]
    if (data.includes(' ') || data.includes(',')) {
      return `[${data.trim().split(/[,\s]+/).join(',')}]`
    }
    return data
  }

  if (dataLines.length === 2) {
    // Two data lines: array and target (Two Sum, Coin Change, etc.)
    // "1 5 11" + "15" → [1,5,11], 15
    const data1 = dataLines[0].includes(' ') || dataLines[0].includes(',')
      ? `[${dataLines[0].trim().split(/[,\s]+/).join(',')}]`
      : dataLines[0]
    const data2 = dataLines[1]
    return `${data1}, ${data2}`
  }

  // 3+ data lines (matrix rows, etc.): convert each space-separated line to array format
  return dataLines.map(line => {
    if (line.includes(' ') || line.includes(',')) {
      return `[${line.trim().split(/[,\s]+/).join(',')}]`
    }
    return line
  }).join(', ')
}

export default function QuizPanel({ patternId, patternMeta, inputValue, setInputValue, onGenerate, problem }) {
  const [showQuestions, setShowQuestions] = useState(false)
  const [showProblemExamples, setShowProblemExamples] = useState(false)

  // Extract problem examples as visualizer-friendly test cases
  const problemTestCases = useMemo(() => {
    if (!problem) return null
    const cases = []
    // Add examples in visualizer format
    if (problem.examples?.length) {
      for (const ex of problem.examples) {
        cases.push({
          input: parseJudge0Input(ex.input),
          output: ex.output,
          explanation: ex.explanation,
        })
      }
    }
    // Add hidden test cases from problem
    if (problem.testCases?.length) {
      for (const tc of problem.testCases) {
        cases.push({
          input: parseJudge0Input(tc.input),
          output: tc.output,
        })
      }
    }
    return cases.length > 0 ? cases : null
  }, [problem])

  const practice = useMemo(() => {
    // When a real problem with examples is available, blend problem test cases with pattern practice
    if (problemTestCases) {
      const base = PATTERN_PRACTICE[patternId]
      const testCaseInputs = problemTestCases.map(tc => tc.input)
      return {
        description: base?.description || `Practice with real test cases from ${problem?.title || 'this problem'}.`,
        testCases: [...new Set([...testCaseInputs, ...(base?.testCases || [])])].slice(0, 6),
        questions: base?.questions || [
          'What is the time complexity of this algorithm?',
          'What kind of input would cause worst-case behavior?',
          'How would you modify this for related problems?',
        ],
      }
    }
    const base = PATTERN_PRACTICE[patternId]
    if (base) return base
    // Generate generic practice data from pattern metadata
    if (patternMeta) {
      return {
        description: patternMeta.description || `Explore the ${patternMeta.label || 'selected'} algorithm pattern.`,
        testCases: patternMeta.defaultInput ? [patternMeta.defaultInput.startsWith('[') ? [patternMeta.defaultInput] : ['[1,2,3,4,5]']] : ['[1,2,3,4,5]'],
        questions: [
          'What is the time complexity of this algorithm?',
          'What kind of input would cause worst-case behavior?',
          'How would you modify this for related problems?',
        ],
      }
    }
    return DEFAULT_PRACTICE
  }, [patternId, patternMeta, problemTestCases, problem])

  const activePractice = practice || DEFAULT_PRACTICE

  if (!patternId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 p-4">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
          <span className="text-xs">?</span>
        </div>
        <p className="text-[10px] text-center">Select a pattern and enter custom input to experiment</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-dark-600 bg-dark-800/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Beaker className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Practice Lab</span>
        </div>
        {patternMeta && (
          <span className="text-[9px] text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded font-mono truncate max-w-[100px]">
            {patternMeta.label}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500 p-3 space-y-3">
        {/* Description */}
        {activePractice.description && (
          <div className="bg-dark-800/40 rounded-lg border border-dark-600 p-2.5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">{activePractice.description}</p>
            </div>
          </div>
        )}

        {/* Input field */}
        <div>
          <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1 block">Custom Input</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter input data..."
              aria-label="Custom input for algorithm visualization"
              className="flex-1 min-w-0 rounded-md border border-dark-600 bg-dark-700 px-2 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
            />
            <button
              onClick={onGenerate}
              className="flex-shrink-0 px-2 py-1.5 rounded-md bg-primary-600 hover:bg-primary-500 text-white transition-colors flex items-center gap-1"
              aria-label="Run visualization with current input"
              title="Run with current input"
            >
              <Play className="w-3 h-3" />
              <span className="text-[9px] font-medium">Run</span>
            </button>
          </div>
        </div>

        {/* Quick Test Cases */}
        <div>
          <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5 block">Quick Test Cases</label>
          <div className="flex flex-wrap gap-1">
            {activePractice.testCases.map((tc, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(tc)}
                aria-label={`Test case ${idx + 1}: ${tc.length > 25 ? tc.slice(0, 25) + '…' : tc}`}
                className={`
                  text-[9px] font-mono px-2 py-1 rounded-md border transition-all duration-150
                  ${inputValue === tc
                    ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                    : 'bg-dark-700/50 border-dark-600 text-slate-400 hover:border-dark-500 hover:text-slate-300'
                  }
                `}
              >
                {tc.length > 25 ? tc.slice(0, 25) + '…' : tc}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        {activePractice.questions && activePractice.questions.length > 0 && (
          <div>
            <button
              onClick={() => setShowQuestions(v => !v)}
              aria-label={showQuestions ? 'Hide thought-provoking questions' : 'Show thought-provoking questions'}
              className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5 hover:text-slate-400 transition-colors"
            >
              <Lightbulb className="w-3 h-3" />
              Think About
              {showQuestions ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
            <AnimatePresence>
              {showQuestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5">
                    {activePractice.questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-dark-800/30 rounded border border-dark-600/50 px-2.5 py-2 text-[10px] text-slate-400 leading-relaxed"
                      >
                        <span className="text-primary-400 font-mono mr-1">Q{idx + 1}:</span>
                        {q}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Problem Examples */}
        {problemTestCases?.length > 0 && (
          <div>
            <button
              onClick={() => setShowProblemExamples(v => !v)}
              aria-label={showProblemExamples ? 'Hide problem examples' : 'Show problem examples'}
              className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5 hover:text-slate-400 transition-colors"
            >
              <Beaker className="w-3 h-3" />
              Problem Examples ({problemTestCases.length})
              {showProblemExamples ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
            <AnimatePresence>
              {showProblemExamples && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5">
                    {problemTestCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="bg-dark-800/30 rounded border border-dark-600/50 px-2.5 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-semibold text-slate-500">Example {idx + 1}</span>
                          <code className="text-[9px] text-emerald-400 font-mono">{tc.output}</code>
                        </div>
                        <pre className="text-[9px] text-slate-300 font-mono whitespace-pre-wrap break-all">{tc.input}</pre>
                        {tc.explanation && (
                          <p className="text-[8px] text-slate-500 mt-1 italic">{tc.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tips */}
        <div className="bg-dark-800/20 rounded-lg border border-dashed border-dark-600 p-2.5">
          <p className="text-[9px] text-slate-600 leading-relaxed">
            💡 <span className="font-semibold">Tip:</span> Click any test case to auto-fill the input, then press <span className="text-primary-400">Run</span> to see the visualization update.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-dark-600 bg-dark-800/30 flex-shrink-0">
        <button
          onClick={() => {
            if (patternMeta?.defaultInput) {
              setInputValue(patternMeta.defaultInput.replace(/^"(.*)"$/, '$1'))
            }
          }}
          aria-label="Reset input to default value"
          className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          Reset Input
        </button>
      </div>
    </div>
  )
}
