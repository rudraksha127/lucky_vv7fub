/**
 * patternsData.js — Master hierarchical database of all 738 DSA patterns.
 *
 * Structure:
 *   CATEGORY → subCategories[] → patterns[]
 *   Each pattern: { id, label, generator, parser, visualizer, defaultInput, description }
 *
 * visualizer types: 'array', 'tree', 'graph', 'stack', 'recursion', 'string', 'linkedlist', 'matrix', 'dp', 'heap'
 */

const ICONS = {
  arrays: 'BarChart3',
  strings: 'Text',
  linkedlist: 'Link',
  stacks: 'Layers',
  queues: 'ListOrdered',
  recursion: 'Hash',
  sorting: 'ArrowUpDown',
  hashing: 'Search',
  trees: 'GitBranch',
  heap: 'Triangle',
  graphs: 'Share2',
  dp: 'Grid3x3',
  greedy: 'Zap',
  bitmanip: 'Binary',
  math: 'Sigma',
  trie: 'Type',
  dsu: 'Share2',
  segmenttree: 'Building2',
  divideconquer: 'Split',
  misc: 'Box',
}

// ─── CATEGORY 1: ARRAYS (106 patterns) ─────────────────────
const ARRAYS = {
  id: 'arrays',
  label: 'Arrays',
  icon: ICONS.arrays,
  subCategories: [
    {
      id: 'prefixSum',
      label: 'Prefix Sum / Difference Array',
      patterns: [
        { id: '1dPrefixSum', label: '1D Prefix Sum', visualizer: 'array', defaultInput: '[1, 2, 3, 4, 5, 6]' },
        { id: '2dPrefixSum', label: '2D Prefix Sum (Matrix)', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'suffixSum', label: 'Suffix Sum', visualizer: 'array', defaultInput: '[1, 2, 3, 4, 5]' },
        { id: 'prefixXor', label: 'Prefix XOR', visualizer: 'array', defaultInput: '[1, 2, 3, 4, 5]' },
        { id: 'prefixProduct', label: 'Prefix Product', visualizer: 'array', defaultInput: '[1, 2, 3, 4]' },
        { id: 'differenceArray', label: 'Difference Array (Range update)', visualizer: 'array', defaultInput: '[0,0,0,0,0]' },
        { id: 'runningSum', label: 'Running / Cumulative Sum', visualizer: 'array', defaultInput: '[1, 2, 3, 4, 5]' },
      ],
    },
    {
      id: 'twoPointer',
      label: 'Two Pointer',
      patterns: [
        { id: 'oppositeTwoPointer', label: 'Opposite-end Two Pointer', visualizer: 'array', defaultInput: '[1, 2, 3, 4, 5, 6, 7, 8]' },
        { id: 'sameDirectionPointer', label: 'Same-direction Two Pointer', visualizer: 'array', defaultInput: '[1, 3, 5, 7, 2, 4, 6, 8]' },
        { id: 'threeSum', label: '3Sum (Three pointer)', visualizer: 'array', defaultInput: '[-1,0,1,2,-1,-4]' },
        { id: 'fourSum', label: '4Sum / K-Sum', visualizer: 'array', defaultInput: '[1,0,-1,0,-2,2]' },
        { id: 'containerMostWater', label: 'Container with Most Water', visualizer: 'array', defaultInput: '[1,8,6,2,5,4,8,3,7]' },
        { id: 'trappingRainWater2Ptr', label: 'Trapping Rain Water (Two pointer)', visualizer: 'array', defaultInput: '[0,1,0,2,1,0,1,3,2,1,2,1]' },
        { id: 'removeDuplicatesInplace', label: 'Remove Duplicates In-place', visualizer: 'array', defaultInput: '[1,1,2,2,3,3,4]' },
        { id: 'mergeSortedInplace', label: 'Merge Two Sorted Arrays In-place', visualizer: 'array', defaultInput: '[1,3,5,0,0,0], [2,4,6]' },
      ],
    },
    {
      id: 'slidingWindow',
      label: 'Sliding Window',
      patterns: [
        { id: 'fixedSlidingWindow', label: 'Fixed-size Sliding Window', visualizer: 'array', defaultInput: '[1,3,2,6,1,4,1,8,2]' },
        { id: 'variableLongest', label: 'Variable-size (Longest subarray)', visualizer: 'array', defaultInput: '[2,5,1,7,3,9,2,5,1]' },
        { id: 'variableShortest', label: 'Variable-size (Smallest subarray)', visualizer: 'array', defaultInput: '[2,3,1,2,4,3]' },
        { id: 'slidingWindowFreq', label: 'Sliding Window with Frequency Map', visualizer: 'array', defaultInput: '[a,b,c,a,b,c,b,b]' },
        { id: 'slidingWindowDeque', label: 'Sliding Window with Deque', visualizer: 'array', defaultInput: '[1,3,-1,-3,5,3,6,7]' },
      ],
    },
    {
      id: 'kadane',
      label: "Kadane's Algorithm",
      patterns: [
        { id: 'maxSubarraySum', label: 'Maximum Subarray Sum', visualizer: 'array', defaultInput: '[-2,1,-3,4,-1,2,1,-5,4]' },
        { id: 'maxSubarrayProduct', label: 'Maximum Subarray Product', visualizer: 'array', defaultInput: '[2,3,-2,4]' },
        { id: 'maxCircularSubarray', label: 'Maximum Circular Subarray Sum', visualizer: 'array', defaultInput: '[1,-2,3,-2]' },
        { id: 'minSubarraySum', label: 'Minimum Subarray Sum', visualizer: 'array', defaultInput: '[1,2,-3,4,-1,2,-5,3]' },
      ],
    },
    {
      id: 'dutchFlag',
      label: 'Dutch National Flag',
      patterns: [
        { id: 'threeWayPartition', label: '3-way Partition (0s, 1s, 2s)', visualizer: 'array', defaultInput: '[2,0,2,1,1,0]' },
        { id: 'segregateEvenOdd', label: 'Segregate Even / Odd', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8]' },
        { id: 'segregatePosNeg', label: 'Segregate Positive / Negative', visualizer: 'array', defaultInput: '[-1,2,-3,4,-5,6]' },
        { id: 'segregateCustom', label: 'Segregate based on Custom Condition', visualizer: 'array', defaultInput: '[3,1,4,1,5,9,2,6]' },
      ],
    },
    {
      id: 'sortingBased',
      label: 'Sorting-based',
      patterns: [
        { id: 'customComparator', label: 'Custom Comparator Sort', visualizer: 'array', defaultInput: '[3,1,4,1,5,9,2,6]' },
        { id: 'sortByFrequency', label: 'Sort by Frequency', visualizer: 'array', defaultInput: '[4,3,1,6,3,4,4,6]' },
        { id: 'sortMultiKey', label: 'Sort by Multiple Keys', visualizer: 'array', defaultInput: '[2,1,2,3,1,3,2]' },
        { id: 'wiggleSort', label: 'Wiggle Sort', visualizer: 'array', defaultInput: '[3,5,2,1,6,4]' },
        { id: 'pancakeSort', label: 'Pancake Sorting', visualizer: 'array', defaultInput: '[3,2,4,1]' },
        { id: 'sortColors', label: 'Sort Colors', visualizer: 'array', defaultInput: '[2,0,2,1,1,0]' },
      ],
    },
    {
      id: 'binarySearchAnswer',
      label: 'Binary Search on Answer',
      patterns: [
        { id: 'minimizeMax', label: 'Minimize the Maximum', visualizer: 'array', defaultInput: '[10,20,30,40,50]' },
        { id: 'maximizeMin', label: 'Maximize the Minimum', visualizer: 'array', defaultInput: '[1,2,4,8,9]' },
        { id: 'kthMissingPositive', label: 'Kth Missing Positive Number', visualizer: 'array', defaultInput: '[2,3,4,7,11]' },
        { id: 'shipPackages', label: 'Capacity to Ship Packages', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8,9,10]' },
        { id: 'splitArrayLargest', label: 'Split Array Largest Sum', visualizer: 'array', defaultInput: '[7,2,5,10,8]' },
        { id: 'bookAllocation', label: 'Book Allocation Problem', visualizer: 'array', defaultInput: '[12,34,67,90]' },
        { id: 'aggressiveCows', label: 'Aggressive Cows', visualizer: 'array', defaultInput: '[1,2,8,4,9]' },
      ],
    },
    {
      id: 'matrix',
      label: 'Matrix / 2D Array',
      patterns: [
        { id: 'rowColTraversal', label: 'Row-wise / Column-wise Traversal', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'transpose', label: 'Transpose of Matrix', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'rotateMatrix', label: 'Rotate Matrix 90° / 180° / 270°', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'searchSortedMatrix', label: 'Search in Row-Column Sorted Matrix', visualizer: 'matrix', defaultInput: '[[1,4,7],[2,5,8],[3,6,9]]' },
        { id: 'setMatrixZeroes', label: 'Set Matrix Zeroes', visualizer: 'matrix', defaultInput: '[[1,1,1],[1,0,1],[1,1,1]]' },
        { id: 'pascalTriangle', label: "Pascal's Triangle (Matrix DP)", visualizer: 'matrix', defaultInput: '5' },
      ],
    },
    {
      id: 'spiralDiagonal',
      label: 'Spiral / Diagonal Traversal',
      patterns: [
        { id: 'spiralOrder', label: 'Spiral Order Traversal', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'diagonalTraversal', label: 'Diagonal Traversal', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'antiDiagonal', label: 'Anti-diagonal Traversal', visualizer: 'matrix', defaultInput: '[[1,2,3],[4,5,6],[7,8,9]]' },
        { id: 'layerTraversal', label: 'Layer-by-layer / Ring-wise Traversal', visualizer: 'matrix', defaultInput: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]' },
      ],
    },
    {
      id: 'arrayRotation',
      label: 'Array Rotation',
      patterns: [
        { id: 'leftRotation', label: 'Left Rotation by K', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'rightRotation', label: 'Right Rotation by K', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'blockReverse', label: 'Block Reverse Method', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'jugglingAlgo', label: 'Juggling Algorithm', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'cyclicReplacement', label: 'Cyclic Replacement Method', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
      ],
    },
    {
      id: 'mergeIntervals',
      label: 'Merge Intervals',
      patterns: [
        { id: 'mergeOverlapping', label: 'Merge Overlapping Intervals', visualizer: 'array', defaultInput: '[[1,3],[2,6],[8,10],[15,18]]' },
        { id: 'insertInterval', label: 'Insert Interval', visualizer: 'array', defaultInput: '[[1,3],[6,9]]' },
        { id: 'nonOverlapping', label: 'Non-overlapping Intervals (Min removal)', visualizer: 'array', defaultInput: '[[1,2],[2,3],[3,4],[1,3]]' },
        { id: 'intervalIntersection', label: 'Interval List Intersection', visualizer: 'array', defaultInput: '[[0,2],[5,10],[13,23]]' },
        { id: 'employeeFreeTime', label: 'Employee Free Time', visualizer: 'array', defaultInput: '[[[1,2],[5,6]],[[1,3]],[[4,10]]]' },
      ],
    },
    {
      id: 'rearrangement',
      label: 'Rearrangement',
      patterns: [
        { id: 'alternatePosNeg', label: 'Alternate Positive-Negative', visualizer: 'array', defaultInput: '[-1,2,-3,4,-5,6]' },
        { id: 'moveZerosEnd', label: 'Move Zeros to End', visualizer: 'array', defaultInput: '[0,1,0,3,12]' },
        { id: 'rearrangeBySign', label: 'Rearrange Array by Sign', visualizer: 'array', defaultInput: '[3,1,-2,-5,2,-4]' },
        { id: 'shuffleInterleave', label: 'Shuffle Array (Interleave halves)', visualizer: 'array', defaultInput: '[1,2,3,4,5,6]' },
      ],
    },
    {
      id: 'inplaceManipulation',
      label: 'In-place Manipulation',
      patterns: [
        { id: 'inplaceReversal', label: 'In-place Reversal', visualizer: 'array', defaultInput: '[1,2,3,4,5]' },
        { id: 'removeElementInplace', label: 'Remove Element In-place', visualizer: 'array', defaultInput: '[3,2,2,3]' },
        { id: 'dedupSortedInplace', label: 'Deduplication In-place (Sorted)', visualizer: 'array', defaultInput: '[1,1,2,2,3,3,4]' },
        { id: 'dedupUnsortedInplace', label: 'Deduplication In-place (Unsorted)', visualizer: 'array', defaultInput: '[4,2,4,3,2,1]' },
      ],
    },
    {
      id: 'mooresVoting',
      label: "Moore's Voting",
      patterns: [
        { id: 'majorityN2', label: 'Majority Element (> n/2)', visualizer: 'array', defaultInput: '[2,2,1,1,1,2,2]' },
        { id: 'majorityN3', label: 'Majority Element (> n/3)', visualizer: 'array', defaultInput: '[1,2,1,2,1,3,3]' },
        { id: 'kMajority', label: 'K Majority Elements', visualizer: 'array', defaultInput: '[1,1,2,2,3,3,4,4]' },
      ],
    },
    {
      id: 'stockBuySell',
      label: 'Stock Buy-Sell',
      patterns: [
        { id: 'stock1Transaction', label: '1 Transaction (Max profit)', visualizer: 'array', defaultInput: '[7,1,5,3,6,4]' },
        { id: 'stockUnlimited', label: 'Unlimited Transactions', visualizer: 'array', defaultInput: '[7,1,5,3,6,4]' },
        { id: 'stockKTransactions', label: 'Exactly K Transactions', visualizer: 'array', defaultInput: '[3,2,6,5,0,3]' },
        { id: 'stockAtMostK', label: 'At most K Transactions', visualizer: 'array', defaultInput: '[3,2,6,5,0,3]' },
        { id: 'stockCooldown', label: 'With Cooldown', visualizer: 'array', defaultInput: '[1,2,3,0,2]' },
        { id: 'stockWithFee', label: 'With Transaction Fee', visualizer: 'array', defaultInput: '[1,3,2,8,4,9]' },
      ],
    },
    {
      id: 'subarrayProblems',
      label: 'Subarray Problems',
      patterns: [
        { id: 'countSubarraySumK', label: 'Count Subarrays with Sum K', visualizer: 'array', defaultInput: '[1,1,1]' },
        { id: 'longestSubarraySumK', label: 'Longest Subarray with Sum K', visualizer: 'array', defaultInput: '[1,2,3,1,1,1]' },
        { id: 'subarrayEqual01', label: 'Subarray with Equal 0s and 1s', visualizer: 'array', defaultInput: '[0,1,0,1,0,1,1,0]' },
        { id: 'smallestSubarraySumS', label: 'Smallest Subarray with Sum ≥ S', visualizer: 'array', defaultInput: '[2,3,1,2,4,3]' },
        { id: 'productExceptSelf', label: 'Product of Array Except Self', visualizer: 'array', defaultInput: '[1,2,3,4]' },
        { id: 'maxProductSubarray', label: 'Maximum Product Subarray', visualizer: 'array', defaultInput: '[2,3,-2,4]' },
        { id: 'countSubarrayProductK', label: 'Count Subarrays with Product < K', visualizer: 'array', defaultInput: '[10,5,2,6]' },
      ],
    },
    {
      id: 'monotonicStack',
      label: 'Monotonic Stack (NGE/NSE)',
      patterns: [
        { id: 'nextGreaterElement', label: 'Next Greater Element (NGE)', visualizer: 'array', defaultInput: '[4,5,2,25]' },
        { id: 'nextSmallerElement', label: 'Next Smaller Element (NSE)', visualizer: 'array', defaultInput: '[4,5,2,25]' },
        { id: 'prevGreaterElement', label: 'Previous Greater Element (PGE)', visualizer: 'array', defaultInput: '[4,5,2,25]' },
        { id: 'prevSmallerElement', label: 'Previous Smaller Element (PSE)', visualizer: 'array', defaultInput: '[4,5,2,25]' },
        { id: 'largestRectangleHistogram', label: 'Largest Rectangle in Histogram', visualizer: 'array', defaultInput: '[2,1,5,6,2,3]' },
        { id: 'trappingRainStack', label: 'Trapping Rain Water (Stack)', visualizer: 'array', defaultInput: '[0,1,0,2,1,0,1,3,2,1,2,1]' },
        { id: 'sumSubarrayMins', label: 'Sum of Subarray Minimums', visualizer: 'array', defaultInput: '[3,1,2,4]' },
        { id: 'sumSubarrayMaxs', label: 'Sum of Subarray Maximums', visualizer: 'array', defaultInput: '[3,1,2,4]' },
        { id: 'maxWidthRamp', label: 'Maximum Width Ramp', visualizer: 'array', defaultInput: '[6,0,8,2,1,5]' },
      ],
    },
    {
      id: 'cyclicSort',
      label: 'Cyclic Sort',
      patterns: [
        { id: 'findMissingNumber', label: 'Find Missing Number (0 to n)', visualizer: 'array', defaultInput: '[3,0,1]' },
        { id: 'findDuplicateNumber', label: 'Find Duplicate Number', visualizer: 'array', defaultInput: '[1,3,4,2,2]' },
        { id: 'findAllMissing', label: 'Find All Missing Numbers', visualizer: 'array', defaultInput: '[4,3,2,7,8,2,3,1]' },
        { id: 'findAllDuplicates', label: 'Find All Duplicates', visualizer: 'array', defaultInput: '[4,3,2,7,8,2,3,1]' },
        { id: 'firstMissingPositive', label: 'First Missing Positive', visualizer: 'array', defaultInput: '[3,4,-1,1]' },
      ],
    },
    {
      id: 'contributionTechnique',
      label: 'Contribution Technique',
      patterns: [
        { id: 'sumSubarrayMinsContrib', label: 'Sum of All Subarray Minimums', visualizer: 'array', defaultInput: '[3,1,2,4]' },
        { id: 'sumSubarrayMaxsContrib', label: 'Sum of All Subarray Maximums', visualizer: 'array', defaultInput: '[3,1,2,4]' },
        { id: 'sumSubarrayRanges', label: 'Sum of Subarray Ranges', visualizer: 'array', defaultInput: '[1,2,3]' },
      ],
    },
    {
      id: 'sweepLine',
      label: 'Sweep Line',
      patterns: [
        { id: 'countEvents', label: 'Count Events at Time T', visualizer: 'array', defaultInput: '[[1,3],[2,5],[3,6]]' },
        { id: 'unionRectangles', label: 'Area of Union of Rectangles', visualizer: 'array', defaultInput: '[[0,0,2,2],[1,1,3,3]]' },
        { id: 'intervalScheduling', label: 'Interval Scheduling (Sweep)', visualizer: 'array', defaultInput: '[[1,2],[2,3],[3,4]]' },
        { id: 'coveredPoints', label: 'Covered Points on Line', visualizer: 'array', defaultInput: '[[1,3],[2,5],[4,6]]' },
      ],
    },
  ],
}

// ─── CATEGORY 2: STRINGS (64 patterns) ─────────────────────
const STRINGS = {
  id: 'strings',
  label: 'Strings',
  icon: ICONS.strings,
  subCategories: [
    {
      id: 'kmp',
      label: 'KMP Algorithm',
      patterns: [
        { id: 'kmpSearch', label: 'Standard Pattern Search', visualizer: 'string', defaultInput: '"ABABDABACDABABCABAB", "ABABCABAB"' },
        { id: 'lpsArray', label: 'Build Failure (LPS) Function', visualizer: 'string', defaultInput: '"AAACAAAAAC"' },
        { id: 'countPatternKMP', label: 'Count Pattern Occurrences', visualizer: 'string', defaultInput: '"AABAACAADAABAABA", "AABA"' },
        { id: 'repeatedStringMatch', label: 'Repeated String Match', visualizer: 'string', defaultInput: '"abcd", "cdabcdab"' },
        { id: 'shortestPalindromeKMP', label: 'Shortest Palindrome (KMP)', visualizer: 'string', defaultInput: '"aacecaaa"' },
      ],
    },
    {
      id: 'rabinKarp',
      label: 'Rabin-Karp',
      patterns: [
        { id: 'rkSinglePattern', label: 'Single Pattern Search', visualizer: 'string', defaultInput: '"ABABDABACDABABCABAB", "ABABCABAB"' },
        { id: 'rkMultiPattern', label: 'Multiple Pattern Search', visualizer: 'string', defaultInput: '"THIS IS A TEST TEXT", ["TEST", "IS"]' },
        { id: 'repeatedDna', label: 'Repeated DNA Sequences', visualizer: 'string', defaultInput: '"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"' },
        { id: 'longestDuplicateSubstr', label: 'Longest Duplicate Substring', visualizer: 'string', defaultInput: '"banana"' },
      ],
    },
    {
      id: 'zAlgorithm',
      label: 'Z-Algorithm',
      patterns: [
        { id: 'zPatternMatch', label: 'Pattern Matching using Z-array', visualizer: 'string', defaultInput: '"aaabcxyzaaaabczaaczabbaaaaaabc"' },
        { id: 'zCountOccurrences', label: 'Count Occurrences using Z', visualizer: 'string', defaultInput: '"aaabcxyzaaaabczaaczabbaaaaaabc"' },
        { id: 'zConcatTrick', label: 'Concatenate Pattern + Text trick', visualizer: 'string', defaultInput: '"abc", "abcpqrabcabc"' },
      ],
    },
    {
      id: 'anagramPermutation',
      label: 'Anagram / Permutation',
      patterns: [
        { id: 'checkAnagram', label: 'Check if Two Strings are Anagram', visualizer: 'string', defaultInput: '"listen", "silent"' },
        { id: 'groupAnagrams', label: 'Group Anagrams', visualizer: 'string', defaultInput: '["eat","tea","tan","ate","nat","bat"]' },
        { id: 'findAnagramPositions', label: 'Find All Anagram Positions in String', visualizer: 'string', defaultInput: '"cbaebabacd", "abc"' },
        { id: 'minWindowAnagram', label: 'Minimum Window Containing Anagram', visualizer: 'string', defaultInput: '"ADOBECODEBANC", "ABC"' },
      ],
    },
    {
      id: 'palindromeString',
      label: 'Palindrome',
      patterns: [
        { id: 'checkPalindrome', label: 'Check Palindrome (Two pointer)', visualizer: 'string', defaultInput: '"racecar"' },
        { id: 'longestPalSubstrExpand', label: 'Longest Palindromic Substring (Expand)', visualizer: 'string', defaultInput: '"babad"' },
        { id: 'countPalSubstrings', label: 'Count Palindromic Substrings', visualizer: 'string', defaultInput: '"abc"' },
        { id: 'validPalindrome2', label: 'Valid Palindrome II (One deletion)', visualizer: 'string', defaultInput: '"abca"' },
        { id: 'palindromePairs', label: 'Palindrome Pairs', visualizer: 'string', defaultInput: '["abcd","dcba","lls","s","sssll"]' },
      ],
    },
    {
      id: 'manacher',
      label: "Manacher's Algorithm",
      patterns: [
        { id: 'manacherLongest', label: "Longest Palindromic Substring O(n)", visualizer: 'string', defaultInput: '"babad"' },
        { id: 'manacherCount', label: "Count All Palindromic Substrings O(n)", visualizer: 'string', defaultInput: '"abc"' },
      ],
    },
    {
      id: 'stringHashing',
      label: 'String Hashing',
      patterns: [
        { id: 'polyHash', label: 'Polynomial Hashing', visualizer: 'string', defaultInput: '"abcdefgh"' },
        { id: 'doubleHash', label: 'Double Hashing (Reduce collision)', visualizer: 'string', defaultInput: '"abcdefgh"' },
        { id: 'hashEqualSubstrings', label: 'Check Equal Substrings using Hash', visualizer: 'string', defaultInput: '"abcabc"' },
      ],
    },
    {
      id: 'stringCompression',
      label: 'String Compression / RLE',
      patterns: [
        { id: 'runLengthEncode', label: 'Run Length Encoding', visualizer: 'string', defaultInput: '"AAABBBCCCDDD"' },
        { id: 'decodeEncode', label: 'Decode / Encode String', visualizer: 'string', defaultInput: '"3[a]2[bc]"' },
        { id: 'compressInplace', label: 'String Compression (In-place)', visualizer: 'string', defaultInput: '["a","a","b","b","c","c","c"]' },
      ],
    },
    {
      id: 'parentheses',
      label: 'Parentheses Matching',
      patterns: [
        { id: 'validParens', label: 'Valid Parentheses', visualizer: 'stack', defaultInput: '"()[]{}"' },
        { id: 'minAddValid', label: 'Minimum Additions to Make Valid', visualizer: 'stack', defaultInput: '"()))(("' },
        { id: 'longestValidParens', label: 'Longest Valid Parentheses Substring', visualizer: 'stack', defaultInput: '"(()())"' },
        { id: 'removeInvalidParens', label: 'Remove Invalid Parentheses', visualizer: 'stack', defaultInput: '"()())()"' },
        { id: 'scoreOfParens', label: 'Score of Parentheses', visualizer: 'stack', defaultInput: '"(()(()))"' },
      ],
    },
    {
      id: 'lcsString',
      label: 'LCS (String DP)',
      patterns: [
        { id: 'lcs', label: 'Longest Common Subsequence', visualizer: 'dp', defaultInput: '"abcde", "ace"' },
        { id: 'printLCS', label: 'Print LCS', visualizer: 'dp', defaultInput: '"abcdef", "acdf"' },
        { id: 'longestCommonSubstr', label: 'Longest Common Substring', visualizer: 'dp', defaultInput: '"GeeksforGeeks", "GeeksQuiz"' },
        { id: 'shortestCommonSupersequence', label: 'Shortest Common Supersequence', visualizer: 'dp', defaultInput: '"geek", "eke"' },
      ],
    },
    {
      id: 'editDistance',
      label: 'Edit Distance',
      patterns: [
        { id: 'minEditDistance', label: 'Minimum Edit Distance (Levenshtein)', visualizer: 'dp', defaultInput: '"horse", "ros"' },
        { id: 'oneEditDistance', label: 'One Edit Distance Check', visualizer: 'string', defaultInput: '"ab", "acb"' },
        { id: 'deleteTwoStrings', label: 'Delete Operations for Two Strings', visualizer: 'dp', defaultInput: '"sea", "eat"' },
        { id: 'minAsciiDelete', label: 'Minimum ASCII Delete Sum', visualizer: 'dp', defaultInput: '"delete", "leet"' },
      ],
    },
    {
      id: 'trieString',
      label: 'Trie-based String',
      patterns: [
        { id: 'wordSearch2', label: 'Word Search II (Trie + Backtracking)', visualizer: 'trie', defaultInput: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]' },
        { id: 'replaceWords', label: 'Replace Words (with root)', visualizer: 'trie', defaultInput: '["cat","bat","rat"], "the cattle was rattled"' },
        { id: 'autocompleteSystem', label: 'Design Search Autocomplete System', visualizer: 'trie', defaultInput: '["i love you","island"]' },
      ],
    },
    {
      id: 'suffixArray',
      label: 'Suffix Array / Automaton',
      patterns: [
        { id: 'buildSuffixArray', label: 'Build Suffix Array', visualizer: 'string', defaultInput: '"banana"' },
        { id: 'lcpArray', label: 'LCP (Longest Common Prefix) Array', visualizer: 'string', defaultInput: '"banana"' },
        { id: 'longestRepeatedSubstr', label: 'Longest Repeated Substring', visualizer: 'string', defaultInput: '"banana"' },
        { id: 'countDistinctSubstr', label: 'Count Distinct Substrings', visualizer: 'string', defaultInput: '"ababa"' },
      ],
    },
    {
      id: 'stringRotation',
      label: 'String Rotation / Isomorphism',
      patterns: [
        { id: 'rotationCheck', label: 'Check if One String is Rotation of Another', visualizer: 'string', defaultInput: '"abcde", "cdeab"' },
        { id: 'isomorphic', label: 'Isomorphic Strings', visualizer: 'string', defaultInput: '"egg", "add"' },
        { id: 'wordPattern', label: 'Word Pattern Matching', visualizer: 'string', defaultInput: '"abba", "dog cat cat dog"' },
        { id: 'repeatedSubstrPattern', label: 'Repeated Substring Pattern', visualizer: 'string', defaultInput: '"abab"' },
      ],
    },
    {
      id: 'lexicographic',
      label: 'Lexicographic Ordering',
      patterns: [
        { id: 'kthPermutation', label: 'Kth Lexicographic Permutation', visualizer: 'array', defaultInput: '3, 3' },
        { id: 'smallestStringSwaps', label: 'Smallest String with Swaps', visualizer: 'string', defaultInput: '"dcab", [[0,3],[1,2]]' },
        { id: 'alienDictionary', label: 'Alien Dictionary Order', visualizer: 'graph', defaultInput: '["wrt","wrf","er","ett","rftt"]' },
        { id: 'largestNumber', label: 'Largest Number from Array', visualizer: 'array', defaultInput: '[3,30,34,5,9]' },
      ],
    },
    {
      id: 'wildcardRegex',
      label: 'Wildcard / Regex Matching',
      patterns: [
        { id: 'wildcardMatch', label: 'Wildcard Matching (* and ?)', visualizer: 'dp', defaultInput: '"adceb", "*a*b"' },
        { id: 'regexMatch', label: 'Regular Expression Matching (. and *)', visualizer: 'dp', defaultInput: '"aab", "c*a*b"' },
      ],
    },
  ],
}

// ─── CATEGORY 3: LINKED LIST (26 patterns) ─────────────────
const LINKED_LIST = {
  id: 'linkedlist',
  label: 'Linked List',
  icon: ICONS.linkedlist,
  subCategories: [
    {
      id: 'fastSlowPointer',
      label: 'Fast & Slow Pointer',
      patterns: [
        { id: 'detectCycle', label: 'Detect Cycle (Floyd\'s)', visualizer: 'linkedlist', defaultInput: '[3,2,0,-4]' },
        { id: 'findCycleStart', label: 'Find Cycle Start Node', visualizer: 'linkedlist', defaultInput: '[3,2,0,-4]' },
        { id: 'findMiddleLL', label: 'Find Middle of Linked List', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'happyNumber', label: 'Happy Number', visualizer: 'linkedlist', defaultInput: '19' },
        { id: 'palindromeLL', label: 'Palindrome Linked List', visualizer: 'linkedlist', defaultInput: '[1,2,2,1]' },
        { id: 'reorderListLL', label: 'Reorder List (LL)', visualizer: 'linkedlist', defaultInput: '[1,2,3,4]' },
      ],
    },
    {
      id: 'reversalLL',
      label: 'Reversal',
      patterns: [
        { id: 'reverseEntireLL', label: 'Reverse Entire Linked List', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'reverseKGroup', label: 'Reverse in Groups of K', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'reverseBetween', label: 'Reverse Between Two Positions', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'reverseAlternateK', label: 'Reverse Alternate K Nodes', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5,6,7,8]' },
      ],
    },
    {
      id: 'mergeSortedLL',
      label: 'Merge Sorted Lists',
      patterns: [
        { id: 'mergeTwoSortedLL', label: 'Merge Two Sorted Lists', visualizer: 'linkedlist', defaultInput: '[1,2,4], [1,3,4]' },
        { id: 'mergeKSortedHeap', label: 'Merge K Sorted Lists (Heap)', visualizer: 'linkedlist', defaultInput: '[[1,4,5],[1,3,4],[2,6]]' },
        { id: 'mergeKSortedDC', label: 'Merge K Sorted Lists (D&C)', visualizer: 'linkedlist', defaultInput: '[[1,4,5],[1,3,4],[2,6]]' },
      ],
    },
    {
      id: 'twoPointerLL',
      label: 'Two Pointer on LL',
      patterns: [
        { id: 'nthFromEnd', label: 'Find Nth Node from End', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'removeNthFromEnd', label: 'Remove Nth Node from End', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'findMiddleForSort', label: 'Find Middle (for sort)', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
      ],
    },
    {
      id: 'intersectionLL',
      label: 'Intersection',
      patterns: [
        { id: 'intersectionTwoPointer', label: 'Find Intersection Node (Two pointer)', visualizer: 'linkedlist', defaultInput: '[4,1,8,4,5], [5,0,1,8,4,5]' },
        { id: 'intersectionHashSet', label: 'Intersection using HashSet', visualizer: 'linkedlist', defaultInput: '[4,1,8,4,5], [5,0,1,8,4,5]' },
      ],
    },
    {
      id: 'cloneRandomPointer',
      label: 'Clone with Random Pointer',
      patterns: [
        { id: 'cloneHashMap', label: 'HashMap Approach', visualizer: 'linkedlist', defaultInput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
        { id: 'cloneInplaceWeave', label: 'In-place Weaving Approach', visualizer: 'linkedlist', defaultInput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
      ],
    },
    {
      id: 'lruCache',
      label: 'LRU Cache',
      patterns: [
        { id: 'lruCacheDL', label: 'Doubly LL + HashMap (O(1) all ops)', visualizer: 'linkedlist', defaultInput: '[[1,1],[2,2],[3,3]]' },
      ],
    },
    {
      id: 'flattenMultiLevel',
      label: 'Flatten Multi-level LL',
      patterns: [
        { id: 'flattenDoublyLL', label: 'Flatten Doubly LL (Multi-level)', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5,6]' },
        { id: 'flattenNestedLL', label: 'Flatten Nested LL (Iterator)', visualizer: 'linkedlist', defaultInput: '[[1,1],2,[1,1]]' },
      ],
    },
    {
      id: 'sortLinkedList',
      label: 'Sort Linked List',
      patterns: [
        { id: 'mergeSortLL', label: 'Merge Sort on LL', visualizer: 'linkedlist', defaultInput: '[4,2,1,3]' },
        { id: 'insertionSortLL', label: 'Insertion Sort on LL', visualizer: 'linkedlist', defaultInput: '[4,2,1,3]' },
      ],
    },
  ],
}

// ─── CATEGORY 4: STACKS (24 patterns) ──────────────────────
const STACKS = {
  id: 'stacks',
  label: 'Stacks',
  icon: ICONS.stacks,
  subCategories: [
    {
      id: 'monotonicStackSub',
      label: 'Monotonic Stack',
      patterns: [
        { id: 'nextGreater1', label: 'Next Greater Element I', visualizer: 'array', defaultInput: '[4,1,2], [1,3,4,2]' },
        { id: 'nextGreater2', label: 'Next Greater Element II (Circular)', visualizer: 'array', defaultInput: '[1,2,1]' },
        { id: 'largestRectHist', label: 'Largest Rectangle in Histogram', visualizer: 'array', defaultInput: '[2,1,5,6,2,3]' },
        { id: 'trappingRainStack2', label: 'Trapping Rain Water (Stack)', visualizer: 'array', defaultInput: '[0,1,0,2,1,0,1,3,2,1,2,1]' },
        { id: 'sumSubarrayMinMax', label: 'Sum of Subarray Min / Max', visualizer: 'array', defaultInput: '[3,1,2,4]' },
        { id: 'maxWidthRamp2', label: 'Maximum Width Ramp', visualizer: 'array', defaultInput: '[6,0,8,2,1,5]' },
      ],
    },
    {
      id: 'expressionEval',
      label: 'Expression Evaluation',
      patterns: [
        { id: 'infixToPostfix', label: 'Infix to Postfix Conversion', visualizer: 'stack', defaultInput: '"a+b*(c^d-e)^(f+g*h)-i"' },
        { id: 'postfixEval', label: 'Postfix Evaluation', visualizer: 'stack', defaultInput: '"231*+9-"' },
        { id: 'infixToPrefix', label: 'Infix to Prefix Conversion', visualizer: 'stack', defaultInput: '"a+b*c"' },
        { id: 'basicCalc1', label: 'Basic Calculator I (+ and -)', visualizer: 'stack', defaultInput: '"1 + 2 - 3 + 4"' },
        { id: 'basicCalc2', label: 'Basic Calculator II (+ - * /)', visualizer: 'stack', defaultInput: '"3+2*2"' },
        { id: 'basicCalc3', label: 'Basic Calculator III (with parentheses)', visualizer: 'stack', defaultInput: '"2*(5+5*2)/3+(6/2+8)"' },
      ],
    },
    {
      id: 'balancedParens',
      label: 'Balanced Parentheses',
      patterns: [
        { id: 'validParensCheck', label: 'Valid Parentheses Check', visualizer: 'stack', defaultInput: '"()[]{}"' },
        { id: 'minRemoveValid', label: 'Minimum Remove to Make Valid', visualizer: 'stack', defaultInput: '"a)b(c)d"' },
        { id: 'longestValidParenSubstr', label: 'Longest Valid Parentheses Substring', visualizer: 'stack', defaultInput: '"(()())"' },
      ],
    },
    {
      id: 'minMaxStack',
      label: 'Min / Max Stack',
      patterns: [
        { id: 'minStack', label: 'Min Stack O(1)', visualizer: 'stack', defaultInput: '[1,2,0,3]' },
        { id: 'maxStack', label: 'Max Stack O(1)', visualizer: 'stack', defaultInput: '[1,2,0,3]' },
        { id: 'minMaxDeleteStack', label: 'Min/Max Stack with Delete', visualizer: 'stack', defaultInput: '[1,2,0,3]' },
      ],
    },
    {
      id: 'decodeStrings',
      label: 'Decode Strings',
      patterns: [
        { id: 'decodeKEncoded', label: 'Decode String (k[encoded])', visualizer: 'stack', defaultInput: '"3[a]2[bc]"' },
        { id: 'nestedDecoding', label: 'Nested Decoding', visualizer: 'stack', defaultInput: '"3[a2[c]]"' },
      ],
    },
    {
      id: 'dailyTemps',
      label: 'Daily Temperatures / Span',
      patterns: [
        { id: 'stockSpan', label: 'Stock Span Problem', visualizer: 'array', defaultInput: '[100,80,60,70,60,75,85]' },
        { id: 'dailyTemps2', label: 'Daily Temperatures', visualizer: 'array', defaultInput: '[73,74,75,71,69,72,76,73]' },
        { id: 'onlineStockSpan', label: 'Online Stock Span', visualizer: 'array', defaultInput: '[100,80,60,70,60,75,85]' },
      ],
    },
  ],
}

// ─── CATEGORY 5: QUEUES / DEQUE (5 patterns) ──────────────
const QUEUES = {
  id: 'queues',
  label: 'Queues / Deque',
  icon: ICONS.queues,
  subCategories: [
    {
      id: 'slidingWindowMax',
      label: 'Sliding Window Maximum (Deque)',
      patterns: [
        { id: 'windowMaxK', label: 'Maximum in Every Window of Size K', visualizer: 'array', defaultInput: '[1,3,-1,-3,5,3,6,7]' },
        { id: 'windowMinK', label: 'Minimum in Every Window of Size K', visualizer: 'array', defaultInput: '[1,3,-1,-3,5,3,6,7]' },
      ],
    },
    {
      id: 'circularQueue',
      label: 'Circular Queue',
      patterns: [
        { id: 'implCircularQueue', label: 'Implement Circular Queue', visualizer: 'stack', defaultInput: '[1,2,3,4,5]' },
        { id: 'implCircularDeque', label: 'Design Circular Deque', visualizer: 'stack', defaultInput: '[1,2,3,4]' },
      ],
    },
    {
      id: 'firstNonRepeating',
      label: 'First Non-repeating in Stream',
      patterns: [
        { id: 'firstNonRepeatQueue', label: 'Using Queue + Frequency Map', visualizer: 'stack', defaultInput: '"aabc"', description: 'Stream: a a b c → Output: a -1 b b' },
      ],
    },
  ],
}

// ─── CATEGORY 6: RECURSION & BACKTRACKING (26 patterns) ───
const RECURSION_BT = {
  id: 'recursion_bt',
  label: 'Recursion & Backtracking',
  icon: ICONS.recursion,
  subCategories: [
    {
      id: 'subsets',
      label: 'Subsets / Power Set',
      patterns: [
        { id: 'allSubsets', label: 'All Subsets (no duplicates)', visualizer: 'recursion', defaultInput: '[1,2,3]' },
        { id: 'subsetsWithDups', label: 'All Subsets (with duplicates)', visualizer: 'recursion', defaultInput: '[1,2,2]' },
        { id: 'subsetGivenSum', label: 'Subsets with Given Sum', visualizer: 'recursion', defaultInput: '[1,2,3,4,5]' },
        { id: 'beautifulSubsets', label: 'Beautiful Subsets', visualizer: 'recursion', defaultInput: '[2,4,6]' },
      ],
    },
    {
      id: 'permutations',
      label: 'Permutations',
      patterns: [
        { id: 'allPermutations', label: 'All Permutations (no duplicates)', visualizer: 'recursion', defaultInput: '[1,2,3]' },
        { id: 'permutationsWithDups', label: 'All Permutations (with duplicates)', visualizer: 'recursion', defaultInput: '[1,1,2]' },
        { id: 'nextPermutation', label: 'Next Permutation', visualizer: 'array', defaultInput: '[1,2,3]' },
        { id: 'prevPermutation', label: 'Previous Permutation', visualizer: 'array', defaultInput: '[3,2,1]' },
        { id: 'kthPermutation2', label: 'Kth Permutation', visualizer: 'array', defaultInput: '[1,2,3]' },
      ],
    },
    {
      id: 'combinations',
      label: 'Combinations',
      patterns: [
        { id: 'combinationsNCR', label: 'Combinations nCr', visualizer: 'recursion', defaultInput: '4, 2' },
        { id: 'comboSumUnlimited', label: 'Combination Sum I (Unlimited use)', visualizer: 'recursion', defaultInput: '[2,3,6,7]' },
        { id: 'comboSumUnique', label: 'Combination Sum II (Unique elements)', visualizer: 'recursion', defaultInput: '[10,1,2,7,6,1,5]' },
        { id: 'comboSumExactK', label: 'Combination Sum III (Exact k numbers)', visualizer: 'recursion', defaultInput: '3, 7' },
        { id: 'letterCombos', label: 'Letter Combinations (Phone Number)', visualizer: 'recursion', defaultInput: '"23"' },
      ],
    },
    {
      id: 'nQueens',
      label: 'N-Queens',
      patterns: [
        { id: 'nQueensAll', label: 'N-Queens Placement (All solutions)', visualizer: 'recursion', defaultInput: '4' },
        { id: 'nQueensCount', label: 'N-Queens II (Count solutions)', visualizer: 'recursion', defaultInput: '4' },
      ],
    },
    {
      id: 'sudoku',
      label: 'Sudoku Solver',
      patterns: [
        { id: 'solveSudoku', label: 'Solve Sudoku', visualizer: 'recursion', defaultInput: '[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0]]' },
        { id: 'validSudoku', label: 'Valid Sudoku Check', visualizer: 'recursion', defaultInput: '[[5,3,0,0,7],[6,0,0,1,9]]' },
      ],
    },
    {
      id: 'gridPath',
      label: 'Grid Path',
      patterns: [
        { id: 'ratInMaze', label: 'Rat in a Maze', visualizer: 'recursion', defaultInput: '[[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]]' },
        { id: 'wordSearch', label: 'Word Search in Grid', visualizer: 'recursion', defaultInput: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]' },
        { id: 'knightsTour', label: "Knight's Tour", visualizer: 'recursion', defaultInput: '5' },
        { id: 'uniquePathsObstaclesBT', label: 'Unique Paths with Obstacles (Backtracking view)', visualizer: 'recursion', defaultInput: '[[0,0,0],[0,1,0],[0,0,0]]' },
      ],
    },
    {
      id: 'palPartitionBT',
      label: 'Palindrome Partitioning (Backtracking)',
      patterns: [
        { id: 'allPalPartitions', label: 'All Palindrome Partitions', visualizer: 'recursion', defaultInput: '"aab"' },
        { id: 'minCutsDP', label: 'Minimum Cuts (DP view)', visualizer: 'recursion', defaultInput: '"aab"' },
      ],
    },
    {
      id: 'expressionOps',
      label: 'Expression Add Operators',
      patterns: [
        { id: 'addOpsToTarget', label: 'Add +, -, * Between Digits to Reach Target', visualizer: 'recursion', defaultInput: '"123", 6' },
      ],
    },
  ],
}

// ─── CATEGORY 7: SORTING & SEARCHING (32 patterns) ────────
const SORTING_SEARCHING = {
  id: 'sorting_searching',
  label: 'Sorting & Searching',
  icon: ICONS.sorting,
  subCategories: [
    {
      id: 'binarySearchClassic',
      label: 'Binary Search Classic',
      patterns: [
        { id: 'stdBinarySearch', label: 'Standard Binary Search', visualizer: 'array', defaultInput: '[-1,0,3,5,9,12]' },
        { id: 'firstOccurrence', label: 'First Occurrence', visualizer: 'array', defaultInput: '[1,2,2,2,3,4]' },
        { id: 'lastOccurrence', label: 'Last Occurrence', visualizer: 'array', defaultInput: '[1,2,2,2,3,4]' },
        { id: 'countOccurrences', label: 'Count Occurrences', visualizer: 'array', defaultInput: '[1,2,2,2,3,4]' },
        { id: 'floorCeiling', label: 'Floor and Ceiling', visualizer: 'array', defaultInput: '[1,3,5,7,9]' },
        { id: 'sqrtInt', label: 'Square Root (Integer Sqrt)', visualizer: 'array', defaultInput: '16' },
        { id: 'findPeakElement', label: 'Find Peak Element', visualizer: 'array', defaultInput: '[1,2,3,1]' },
      ],
    },
    {
      id: 'rotatedArray',
      label: 'Binary Search on Rotated Array',
      patterns: [
        { id: 'searchRotated', label: 'Search in Rotated Sorted Array', visualizer: 'array', defaultInput: '[4,5,6,7,0,1,2]' },
        { id: 'minRotated', label: 'Find Minimum in Rotated Array', visualizer: 'array', defaultInput: '[3,4,5,1,2]' },
        { id: 'searchRotatedDups', label: 'Search with Duplicates in Rotated', visualizer: 'array', defaultInput: '[2,5,6,0,0,1,2]' },
      ],
    },
    {
      id: 'lowerUpperBound',
      label: 'Lower / Upper Bound',
      patterns: [
        { id: 'lowerBound', label: 'Lower Bound (first ≥ target)', visualizer: 'array', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'upperBound', label: 'Upper Bound (first > target)', visualizer: 'array', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'countRange', label: 'Count Elements in Range [a, b]', visualizer: 'array', defaultInput: '[1,3,5,7,9,11]' },
      ],
    },
    {
      id: 'search2D',
      label: 'Search in 2D Matrix',
      patterns: [
        { id: 'searchFullSorted', label: 'Search in Fully Sorted Matrix', visualizer: 'matrix', defaultInput: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]' },
        { id: 'searchRowColSorted', label: 'Search in Row-wise + Col-wise Sorted Matrix', visualizer: 'matrix', defaultInput: '[[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]]' },
        { id: 'binarySearchRows', label: 'Search with Binary Search on rows', visualizer: 'matrix', defaultInput: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]' },
      ],
    },
    {
      id: 'mergeSort',
      label: 'Merge Sort',
      patterns: [
        { id: 'mergeSort2', label: 'Standard Merge Sort', visualizer: 'array', defaultInput: '[38,27,43,3,9,82,10]' },
        { id: 'countInversions', label: 'Count Inversions (Modified Merge Sort)', visualizer: 'array', defaultInput: '[1,20,6,4,5]' },
        { id: 'mergeSortLL2', label: 'Sort Linked List (Merge Sort)', visualizer: 'linkedlist', defaultInput: '[4,2,1,3]' },
      ],
    },
    {
      id: 'quickSort',
      label: 'Quick Sort',
      patterns: [
        { id: 'stdQuickSort', label: 'Standard Quick Sort', visualizer: 'array', defaultInput: '[3,7,8,5,2,1,9,5,4]' },
        { id: 'randomizedQuickSort', label: 'Randomized Quick Sort', visualizer: 'array', defaultInput: '[3,7,8,5,2,1,9,5,4]' },
        { id: 'threeWayQuickSort', label: '3-way Quick Sort (Duplicates)', visualizer: 'array', defaultInput: '[2,1,2,3,1,2,3]' },
        { id: 'quickSelect', label: 'Quick Select (Kth Element)', visualizer: 'array', defaultInput: '[3,2,1,5,6,4]' },
      ],
    },
    {
      id: 'countingRadixBucket',
      label: 'Counting / Radix / Bucket Sort',
      patterns: [
        { id: 'countingSort', label: 'Counting Sort', visualizer: 'array', defaultInput: '[4,2,2,8,3,3,1]' },
        { id: 'radixSortLSD', label: 'Radix Sort (LSD)', visualizer: 'array', defaultInput: '[170,45,75,90,802,24,2,66]' },
        { id: 'bucketSort', label: 'Bucket Sort', visualizer: 'array', defaultInput: '[0.78,0.17,0.39,0.26,0.72,0.94,0.21,0.12,0.23,0.68]' },
      ],
    },
    {
      id: 'orderStats',
      label: 'Order Statistics',
      patterns: [
        { id: 'kthLargestQS', label: 'Kth Largest (QuickSelect)', visualizer: 'array', defaultInput: '[3,2,1,5,6,4]' },
        { id: 'kthSmallest', label: 'Kth Smallest', visualizer: 'array', defaultInput: '[7,10,4,3,20,15]' },
      ],
    },
  ],
}

// ─── HASHING (20 patterns) ─────────────────────────────────
const HASHING = {
  id: 'hashing',
  label: 'Hashing',
  icon: ICONS.hashing,
  subCategories: [
    {
      id: 'frequencyMap',
      label: 'Frequency Map',
      patterns: [
        { id: 'charFreq', label: 'Character Frequency Count', visualizer: 'array', defaultInput: '"hello world"' },
        { id: 'wordFreq', label: 'Word Frequency Count', visualizer: 'array', defaultInput: '"the quick brown fox jumps over the lazy dog"' },
        { id: 'countPairsCondition', label: 'Count Pairs with Condition', visualizer: 'array', defaultInput: '[1,2,3,4,5]' },
      ],
    },
    {
      id: 'hashmapLookup',
      label: 'HashMap O(1) Lookup',
      patterns: [
        { id: 'twoSumHash', label: 'Two Sum', visualizer: 'array', defaultInput: '[2,7,11,15]' },
        { id: 'fourSumHash', label: 'Four Sum using Hashing', visualizer: 'array', defaultInput: '[1,0,-1,0,-2,2]' },
        { id: 'subarrayZeroSum', label: 'Subarray with Zero Sum', visualizer: 'array', defaultInput: '[4,2,-3,1,6]' },
      ],
    },
    {
      id: 'twoSumSubarray',
      label: 'Two Sum / Subarray Sum',
      patterns: [
        { id: 'twoSumClassic', label: 'Two Sum (Classic)', visualizer: 'array', defaultInput: '[2,7,11,15]' },
        { id: 'subarraySumK', label: 'Subarray Sum Equals K', visualizer: 'array', defaultInput: '[1,1,1]' },
        { id: 'countSubarraysK', label: 'Count Subarrays with Sum K', visualizer: 'array', defaultInput: '[1,2,3]' },
        { id: 'longestSubarrayK', label: 'Longest Subarray with Sum K', visualizer: 'array', defaultInput: '[1,-1,5,-2,3]' },
        { id: 'countSubarraysXOR', label: 'Count Subarrays with Given XOR', visualizer: 'array', defaultInput: '[4,2,2,6,4]' },
      ],
    },
    {
      id: 'longestConsecutive',
      label: 'Longest Consecutive Sequence',
      patterns: [
        { id: 'longestConsecutiveHashSet', label: 'Using HashSet (O(n))', visualizer: 'array', defaultInput: '[100,4,200,1,3,2]' },
        { id: 'longestConsecutiveHashMap', label: 'Using HashMap', visualizer: 'array', defaultInput: '[100,4,200,1,3,2]' },
      ],
    },
    {
      id: 'rollingHash',
      label: 'Rolling Hash',
      patterns: [
        { id: 'rkPatternMatch', label: 'Rabin-Karp Pattern Match', visualizer: 'string', defaultInput: '"ABABDABACDABABCABAB", "ABABCABAB"' },
        { id: 'repeatedDna2', label: 'Repeated DNA Sequences', visualizer: 'string', defaultInput: '"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"' },
        { id: 'longestDuplicateSubstr2', label: 'Longest Duplicate Substring', visualizer: 'string', defaultInput: '"banana"' },
      ],
    },
    {
      id: 'coordCompression',
      label: 'Coordinate Compression',
      patterns: [
        { id: 'coordCompress1D', label: '1D Coordinate Compression', visualizer: 'array', defaultInput: '[100, 200, 50, 150, 300]' },
        { id: 'coordCompress2D', label: '2D Coordinate Compression', visualizer: 'array', defaultInput: '[[1,1],[3,2],[5,3]]' },
      ],
    },
  ],
}

// ─── CATEGORY 9: TREES (67 patterns) ───────────────────────
const TREES = {
  id: 'trees',
  label: 'Trees',
  icon: ICONS.trees,
  subCategories: [
    {
      id: 'dfsTraversals',
      label: 'DFS Traversals',
      patterns: [
        { id: 'inorderRecursive', label: 'Inorder (Recursive)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'inorderIterative', label: 'Inorder (Iterative — Stack)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'preorderRecursive', label: 'Preorder (Recursive)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'preorderIterative', label: 'Preorder (Iterative)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'postorderRecursive', label: 'Postorder (Recursive)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'postorderIterative', label: 'Postorder (Iterative)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
      ],
    },
    {
      id: 'bfsLevelOrder',
      label: 'BFS / Level Order',
      patterns: [
        { id: 'levelOrderStd', label: 'Standard Level Order', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
        { id: 'levelAverages', label: 'Level-wise Averages', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
        { id: 'levelSums', label: 'Level-wise Sums', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
        { id: 'zigzagLevelOrder', label: 'Zigzag / Spiral Level Order', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
        { id: 'leftSideView', label: 'Left Side View', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'rightSideView', label: 'Right Side View', visualizer: 'tree', defaultInput: '[1,2,3,null,5,null,4]' },
      ],
    },
    {
      id: 'morrisTraversal',
      label: 'Morris Traversal',
      patterns: [
        { id: 'morrisInorder', label: 'Morris Inorder (O(1) space)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'morrisPreorder', label: 'Morris Preorder (O(1) space)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
      ],
    },
    {
      id: 'diameterHeight',
      label: 'Diameter / Height / Width',
      patterns: [
        { id: 'heightOfTree', label: 'Height of Binary Tree', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
        { id: 'diameterOfTree', label: 'Diameter of Binary Tree', visualizer: 'tree', defaultInput: '[1,2,3,4,5]' },
        { id: 'maxWidthTree', label: 'Maximum Width of Binary Tree', visualizer: 'tree', defaultInput: '[1,3,2,5,3,null,9]' },
        { id: 'minDepthTree', label: 'Minimum Depth', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
      ],
    },
    {
      id: 'lca',
      label: 'Lowest Common Ancestor (LCA)',
      patterns: [
        { id: 'lcaBinaryTree', label: 'LCA in Binary Tree (DFS)', visualizer: 'tree', defaultInput: '[3,5,1,6,2,0,8,null,null,7,4]' },
        { id: 'lcaBST', label: 'LCA in BST', visualizer: 'tree', defaultInput: '[6,2,8,0,4,7,9,null,null,3,5]' },
        { id: 'lcaParentPtrs', label: 'LCA with Parent Pointers', visualizer: 'tree', defaultInput: '[3,5,1,6,2,0,8]' },
        { id: 'lcaBinaryLifting', label: 'LCA using Binary Lifting (O(log n))', visualizer: 'tree', defaultInput: '[3,5,1,6,2,0,8]' },
      ],
    },
    {
      id: 'rootToNode',
      label: 'Root to Node Path',
      patterns: [
        { id: 'printRootToNode', label: 'Print Path from Root to Node', visualizer: 'tree', defaultInput: '[1,2,3,4,5]' },
        { id: 'pathSumHasPath', label: 'Path Sum — Has Path?', visualizer: 'tree', defaultInput: '[5,4,8,11,null,13,4,7,2,null,null,null,1]' },
        { id: 'allPathsTarget', label: 'All Root-to-Leaf Paths with Target Sum', visualizer: 'tree', defaultInput: '[5,4,8,11,null,13,4,7,2,null,null,5,1]' },
        { id: 'pathSumPrefix', label: 'Path Sum III (Any to Any — prefix sum)', visualizer: 'tree', defaultInput: '[10,5,-3,3,2,null,11,3,-2,null,1]' },
      ],
    },
    {
      id: 'maxPathSum',
      label: 'Maximum Path Sum',
      patterns: [
        { id: 'maxPathRootToLeaf', label: 'Max Path Sum (Root to Leaf)', visualizer: 'tree', defaultInput: '[1,2,3]' },
        { id: 'maxPathAnyToAny', label: 'Max Path Sum (Any node to Any node)', visualizer: 'tree', defaultInput: '[-10,9,20,null,null,15,7]' },
      ],
    },
    {
      id: 'serializeTree',
      label: 'Serialize / Deserialize',
      patterns: [
        { id: 'serializeBFS', label: 'BFS-based Serialization', visualizer: 'tree', defaultInput: '[1,2,3,null,null,4,5]' },
        { id: 'serializeDFS', label: 'DFS Preorder Serialization', visualizer: 'tree', defaultInput: '[1,2,3,null,null,4,5]' },
      ],
    },
    {
      id: 'treeViews',
      label: 'Tree Views',
      patterns: [
        { id: 'topView', label: 'Top View', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'bottomView', label: 'Bottom View', visualizer: 'tree', defaultInput: '[20,8,22,5,3,null,25,null,null,10,14]' },
        { id: 'leftView', label: 'Left View', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
        { id: 'rightView', label: 'Right View', visualizer: 'tree', defaultInput: '[1,2,3,null,5,null,4]' },
        { id: 'verticalOrder', label: 'Vertical Order Traversal', visualizer: 'tree', defaultInput: '[3,9,20,null,null,15,7]' },
      ],
    },
    {
      id: 'bstInsertSearchDelete',
      label: 'BST Insert / Search / Delete',
      patterns: [
        { id: 'bstInsertRecursive', label: 'Recursive Insert', visualizer: 'tree', defaultInput: '[4,2,7,1,3]' },
        { id: 'bstInsertIterative', label: 'Iterative Insert', visualizer: 'tree', defaultInput: '[4,2,7,1,3]' },
        { id: 'searchBST', label: 'Search BST', visualizer: 'tree', defaultInput: '[4,2,7,1,3]' },
        { id: 'deleteBST', label: 'Delete BST node (3 cases)', visualizer: 'tree', defaultInput: '[5,3,6,2,4,null,7]' },
      ],
    },
    {
      id: 'validateBST',
      label: 'Validate BST',
      patterns: [
        { id: 'validateBSTMinMax', label: 'Min-Max Range Approach', visualizer: 'tree', defaultInput: '[2,1,3]' },
        { id: 'validateBSTInorder', label: 'Inorder Check (Sorted = valid)', visualizer: 'tree', defaultInput: '[5,1,4,null,null,3,6]' },
      ],
    },
    {
      id: 'kthBST',
      label: 'Kth in BST',
      patterns: [
        { id: 'kthSmallestBST', label: 'Kth Smallest (Inorder)', visualizer: 'tree', defaultInput: '[3,1,4,null,2]' },
        { id: 'kthLargestBST', label: 'Kth Largest (Reverse inorder)', visualizer: 'tree', defaultInput: '[3,1,4,null,2]' },
      ],
    },
    {
      id: 'constructTree',
      label: 'Construct Tree from Traversals',
      patterns: [
        { id: 'constructInorderPreorder', label: 'Inorder + Preorder', visualizer: 'tree', defaultInput: '[3,9,20,15,7]' },
        { id: 'constructInorderPostorder', label: 'Inorder + Postorder', visualizer: 'tree', defaultInput: '[9,3,15,20,7]' },
        { id: 'constructLevelOrderBST', label: 'Level Order to BST', visualizer: 'tree', defaultInput: '[7,4,12,3,6,8,1,5,10]' },
      ],
    },
    {
      id: 'bstIterator',
      label: 'BST Iterator',
      patterns: [
        { id: 'bstIteratorStack', label: 'Stack-based Inorder Iterator O(h)', visualizer: 'tree', defaultInput: '[7,3,15,null,null,9,20]' },
      ],
    },
    {
      id: 'segmentTreeSub',
      label: 'Segment Tree',
      patterns: [
        { id: 'buildSegmentTree', label: 'Build Segment Tree', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreePointUpdateRangeSum', label: 'Point Update, Range Sum Query', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreeRangeMinMax', label: 'Point Update, Range Min/Max Query', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreeLazyProp', label: 'Range Update, Range Query (Lazy)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6]' },
      ],
    },
    {
      id: 'fenwickTree',
      label: 'Fenwick Tree / BIT',
      patterns: [
        { id: 'fenwickPointUpdatePrefixSum', label: 'Point Update, Prefix Sum Query', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8]' },
        { id: 'fenwickRangeUpdatePointQuery', label: 'Range Update, Point Query', visualizer: 'array', defaultInput: '[0,0,0,0,0]' },
      ],
    },
  ],
}

// ─── HEAP / PRIORITY QUEUE (17 patterns) ───────────────────
const HEAP = {
  id: 'heap',
  label: 'Heap / Priority Queue',
  icon: ICONS.heap,
  subCategories: [
    {
      id: 'kthLargestSmallest',
      label: 'Kth Largest / Smallest',
      patterns: [
        { id: 'kthLargestMinHeap', label: 'Kth Largest using Min-Heap', visualizer: 'array', defaultInput: '[3,2,1,5,6,4]' },
        { id: 'kthSmallestMaxHeap', label: 'Kth Smallest using Max-Heap', visualizer: 'array', defaultInput: '[7,10,4,3,20,15]' },
        { id: 'kClosestPoints', label: 'K Closest Points to Origin', visualizer: 'array', defaultInput: '[[1,3],[-2,2]]' },
        { id: 'kthLargestStream', label: 'Kth Largest in Stream', visualizer: 'array', defaultInput: '[4,5,8,2]' },
      ],
    },
    {
      id: 'mergeKSorted',
      label: 'Merge K Sorted',
      patterns: [
        { id: 'mergeKSortedHeaps', label: 'Merge K Sorted Lists (Min-Heap)', visualizer: 'array', defaultInput: '[[1,4,5],[1,3,4],[2,6]]' },
        { id: 'smallestRangeKLists', label: 'Smallest Range Covering K Lists', visualizer: 'array', defaultInput: '[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]' },
      ],
    },
    {
      id: 'topKFrequent',
      label: 'Top K Frequent',
      patterns: [
        { id: 'topKFreqElements', label: 'Top K Frequent Elements', visualizer: 'array', defaultInput: '[1,1,1,2,2,3]' },
        { id: 'topKFreqWords', label: 'Top K Frequent Words', visualizer: 'array', defaultInput: '["i","love","leetcode","i","love","coding"]' },
      ],
    },
    {
      id: 'medianDataStream',
      label: 'Median from Data Stream',
      patterns: [
        { id: 'medianTwoHeaps', label: 'Two Heaps (Max + Min Heap)', visualizer: 'array', defaultInput: '[2,3,4,5,6,1]' },
        { id: 'slidingWindowMedian', label: 'Sliding Window Median', visualizer: 'array', defaultInput: '[1,3,-1,-3,5,3,6,7]' },
      ],
    },
    {
      id: 'taskScheduling',
      label: 'Task Scheduling',
      patterns: [
        { id: 'cpuScheduling', label: 'CPU Scheduling (Cooldown)', visualizer: 'array', defaultInput: '[A,A,A,B,B,B]' },
        { id: 'taskScheduler2', label: 'Task Scheduler', visualizer: 'array', defaultInput: '["A","A","A","B","B","B"]' },
        { id: 'meetingRoomsHeap', label: 'Meeting Rooms II (Min Heap)', visualizer: 'array', defaultInput: '[[0,30],[5,10],[15,20]]' },
      ],
    },
  ],
}

// ─── GRAPHS (66 patterns) ──────────────────────────────────
const GRAPHS = {
  id: 'graphs',
  label: 'Graphs',
  icon: ICONS.graphs,
  subCategories: [
    {
      id: 'bfsGraph',
      label: 'BFS',
      patterns: [
        { id: 'shortestPathUnweighted', label: 'Shortest Path in Unweighted Graph', visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[4],"3":[5],"4":[],"5":[]}' },
        { id: 'bipartiteBFS', label: 'Bipartite Check (BFS coloring)', visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[1,4],"3":[1],"4":[2]}' },
        { id: 'rottenOranges', label: 'Rotten Oranges', visualizer: 'graph', defaultInput: '[[2,1,1],[1,1,0],[0,1,1]]' },
        { id: 'zeroOneMatrix', label: '0-1 Matrix (Distance from 0)', visualizer: 'graph', defaultInput: '[[0,0,0],[0,1,0],[1,1,1]]' },
      ],
    },
    {
      id: 'dfsGraph',
      label: 'DFS',
      patterns: [
        { id: 'pathFindingDFS', label: 'Path Finding (DFS)', visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[4],"3":[5],"4":[],"5":[]}' },
        { id: 'connectedComponents', label: 'Connected Components Count', visualizer: 'graph', defaultInput: '{"1":[2],"2":[1],"3":[4],"4":[3],"5":[]}' },
        { id: 'floodFill', label: 'Flood Fill', visualizer: 'graph', defaultInput: '[[1,1,1],[1,1,0],[1,0,1]]' },
        { id: 'numIslands', label: 'Number of Islands', visualizer: 'graph', defaultInput: '[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]]' },
      ],
    },
    {
      id: 'multiSourceBFS',
      label: 'Multi-source BFS',
      patterns: [
        { id: 'multiSourceRotten', label: 'Multi-source Rotten Oranges', visualizer: 'graph', defaultInput: '[[2,1,1],[1,1,0],[0,1,1]]' },
        { id: 'wallsAndGates', label: 'Walls and Gates', visualizer: 'graph', defaultInput: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1]]' },
      ],
    },
    {
      id: 'dijkstra',
      label: "Dijkstra's",
      patterns: [
        { id: 'dijkstraStd', label: 'Standard Dijkstra (Min-Heap)', visualizer: 'graph', defaultInput: '{"1":[{"v":2,"w":2},{"v":3,"w":4}],"2":[{"v":3,"w":1},{"v":4,"w":7}],"3":[{"v":4,"w":3}],"4":[]}' },
        { id: 'dijkstraGrid', label: 'Dijkstra on Grid', visualizer: 'graph', defaultInput: '[[0,4,0],[0,0,1],[0,0,0]]' },
        { id: 'networkDelayTime', label: 'Network Delay Time', visualizer: 'graph', defaultInput: '{"1":[{"v":2,"w":1}],"2":[{"v":3,"w":2}],"3":[]}' },
        { id: 'cheapestFlightsK', label: 'Cheapest Flight within K Stops', visualizer: 'graph', defaultInput: '{"0":[{"v":1,"w":100}],"1":[{"v":2,"w":100}],"2":[]}' },
      ],
    },
    {
      id: 'bellmanFord',
      label: 'Bellman-Ford',
      patterns: [
        { id: 'bellmanFordStd', label: 'Standard Bellman-Ford', visualizer: 'graph', defaultInput: '[[0,1,5],[1,2,3],[0,2,10]]' },
        { id: 'negCycleDetection', label: 'Negative Cycle Detection', visualizer: 'graph', defaultInput: '[[0,1,-1],[1,2,-2],[2,0,-3]]' },
      ],
    },
    {
      id: 'kruskalsMST',
      label: "Kruskal's MST",
      patterns: [
        { id: 'kruskalSortDSU', label: 'Sort Edges + DSU', visualizer: 'graph', defaultInput: '[[0,1,4],[0,2,3],[1,2,1],[1,3,2],[2,3,5]]' },
        { id: 'minCostConnectPoints', label: 'Minimum Cost to Connect All Points', visualizer: 'graph', defaultInput: '[[0,0],[2,2],[3,10],[5,2],[7,0]]' },
      ],
    },
    {
      id: 'topologicalSort',
      label: 'Topological Sort',
      patterns: [
        { id: 'topoSortDFS', label: 'DFS Post-order Stack', visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[4],"3":[4],"4":[]}' },
        { id: 'kahnTopoSort', label: 'Indegree-based BFS Topo Sort', visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[4],"3":[4],"4":[]}' },
        { id: 'courseSchedule1', label: 'Course Schedule I', visualizer: 'graph', defaultInput: '[[1,0],[0,1]]' },
        { id: 'courseSchedule2', label: 'Course Schedule II', visualizer: 'graph', defaultInput: '[[1,0],[2,0],[3,1],[3,2]]' },
      ],
    },
    {
      id: 'cycleDetection',
      label: 'Cycle Detection',
      patterns: [
        { id: 'cycleDFS', label: 'DFS with 3-color', visualizer: 'graph', defaultInput: '{"1":[2],"2":[3],"3":[1]}' },
        { id: 'cycleKahn', label: 'Kahn\'s Algorithm (No topo = cycle)', visualizer: 'graph', defaultInput: '[[1,0],[0,1]]' },
        { id: 'cycleDSU', label: 'DSU Approach', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[2,0]]' },
      ],
    },
    {
      id: 'scc',
      label: 'SCC',
      patterns: [
        { id: 'kosarajuSCC', label: "Kosaraju's Algorithm", visualizer: 'graph', defaultInput: '{"1":[2],"2":[3],"3":[1],"3":[4],"4":[5],"5":[6],"6":[4]}' },
        { id: 'tarjanSCC', label: "Tarjan's Algorithm (SCC)", visualizer: 'graph', defaultInput: '{"1":[2],"2":[3],"3":[1],"4":[5],"5":[6],"6":[4]}' },
      ],
    },
    {
      id: 'bridgesArticulation',
      label: 'Bridges & Articulation Points',
      patterns: [
        { id: 'tarjanBridges', label: "Tarjan's Bridge Finding", visualizer: 'graph', defaultInput: '{"0":[1,2],"1":[0,2],"2":[1,0,3],"3":[2,4],"4":[3]}' },
        { id: 'articulationPoints', label: 'Articulation Points Finding', visualizer: 'graph', defaultInput: '{"0":[1,2],"1":[0,2],"2":[1,0,3],"3":[2,4],"4":[3]}' },
      ],
    },
    {
      id: 'dsuGraph',
      label: 'DSU',
      patterns: [
        { id: 'unionByRank', label: 'Union by Rank', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[3,4]]' },
        { id: 'accountsMerge', label: 'Accounts Merge', visualizer: 'graph', defaultInput: '[["John","john1","john2"],["John","john3"],["Mary","mary1"]]' },
        { id: 'redundantConnection', label: 'Redundant Connection', visualizer: 'graph', defaultInput: '[[1,2],[1,3],[2,3]]' },
      ],
    },
    {
      id: 'networkFlow',
      label: 'Network Flow',
      patterns: [
        { id: 'fordFulkerson', label: 'Ford-Fulkerson (DFS)', visualizer: 'graph', defaultInput: '{"s":[{"v":1,"c":10},{"v":2,"c":5}],"1":[{"v":2,"c":15},{"v":3,"c":10}],"2":[{"v":3,"c":10}],"3":[]}' },
      ],
    },
    {
      id: 'eulerHamiltonian',
      label: 'Euler / Hamiltonian',
      patterns: [
        { id: 'eulerPath', label: "Euler Path (Hierholzer's)", visualizer: 'graph', defaultInput: '{"1":[2,3],"2":[1,3],"3":[1,2,4],"4":[3]}' },
        { id: 'reconstructItinerary', label: 'Reconstruct Itinerary', visualizer: 'graph', defaultInput: '[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]' },
      ],
    },
  ],
}

// ─── Placeholder exports for remaining categories ──────────
const DP = {
  id: 'dp',
  label: 'Dynamic Programming',
  icon: ICONS.dp,
  subCategories: [
    {
      id: 'dp1d',
      label: '1D DP',
      patterns: [
        { id: 'fibonacciDP', label: 'Fibonacci (Memoization / Tabulation)', visualizer: 'array', defaultInput: '10' },
        { id: 'climbingStairs', label: 'Climbing Stairs', visualizer: 'array', defaultInput: '5' },
        { id: 'houseRobber1', label: 'House Robber I (Linear)', visualizer: 'array', defaultInput: '[1,2,3,1]' },
        { id: 'decodeWays', label: 'Decode Ways', visualizer: 'array', defaultInput: '"226"' },
        { id: 'coinChangeMin', label: 'Coin Change — Minimum Coins', visualizer: 'array', defaultInput: '[1,2,5], 11' },
        { id: 'coinChangeWays', label: 'Coin Change — Count Ways', visualizer: 'array', defaultInput: '[1,2,5], 11' },
        { id: 'frogJumpMinCost', label: 'Frog Jump (Min cost)', visualizer: 'array', defaultInput: '[10,15,20]' },
      ],
    },
    {
      id: 'houseRobberPattern',
      label: 'House Robber Pattern',
      patterns: [
        { id: 'houseRobberCircular', label: 'House Robber II (Circular)', visualizer: 'array', defaultInput: '[2,3,2]' },
        { id: 'houseRobberTree', label: 'House Robber III (On Tree)', visualizer: 'tree', defaultInput: '[3,2,3,null,3,null,1]' },
      ],
    },
    {
      id: 'gridDP',
      label: '2D / Grid DP',
      patterns: [
        { id: 'uniquePaths', label: 'Unique Paths', visualizer: 'matrix', defaultInput: '3, 7' },
        { id: 'uniquePathsObstacles', label: 'Unique Paths II (With Obstacles)', visualizer: 'matrix', defaultInput: '[[0,0,0],[0,1,0],[0,0,0]]' },
        { id: 'minPathSum', label: 'Minimum Path Sum', visualizer: 'matrix', defaultInput: '[[1,3,1],[1,5,1],[4,2,1]]' },
        { id: 'dungeonGame', label: 'Dungeon Game', visualizer: 'matrix', defaultInput: '[[-2,-3,3],[-5,-10,1],[10,30,-5]]' },
        { id: 'triangleMinPath', label: 'Triangle (Min path)', visualizer: 'matrix', defaultInput: '[[2],[3,4],[6,5,7],[4,1,8,3]]' },
        { id: 'goldMine', label: 'Gold Mine Problem', visualizer: 'matrix', defaultInput: '[[1,3,3],[2,1,4],[0,6,4]]' },
      ],
    },
    {
      id: 'lcsDP',
      label: 'LCS DP',
      patterns: [
        { id: 'lcs2', label: 'Longest Common Subsequence', visualizer: 'dp', defaultInput: '"abcde", "ace"' },
        { id: 'printLCS', label: 'Print LCS', visualizer: 'dp', defaultInput: '"abcdef", "acdf"' },
        { id: 'longestCommonSubstr2', label: 'Longest Common Substring', visualizer: 'dp', defaultInput: '"GeeksforGeeks", "GeeksQuiz"' },
        { id: 'shortestCommonSuper', label: 'Shortest Common Supersequence', visualizer: 'dp', defaultInput: '"geek", "eke"' },
        { id: 'minInsertDeleteConvert', label: 'Minimum Insertions / Deletions to convert A to B', visualizer: 'dp', defaultInput: '"heap", "pea"' },
      ],
    },
    {
      id: 'lisDP',
      label: 'LIS DP',
      patterns: [
        { id: 'lisOn2', label: 'LIS — O(n²) DP', visualizer: 'array', defaultInput: '[10,9,2,5,3,7,101,18]' },
        { id: 'lisOnLogN', label: 'LIS — O(n log n) Patience Sorting', visualizer: 'array', defaultInput: '[10,9,2,5,3,7,101,18]' },
        { id: 'numberOfLIS', label: 'Number of LIS', visualizer: 'array', defaultInput: '[1,3,5,4,7]' },
        { id: 'longestBitonic', label: 'Longest Bitonic Subsequence', visualizer: 'array', defaultInput: '[1,11,2,10,4,5,2,1]' },
      ],
    },
    {
      id: 'palindromicDP',
      label: 'Longest Palindromic Subseq / Substr',
      patterns: [
        { id: 'longestPalSubseq', label: 'Longest Palindromic Subsequence', visualizer: 'dp', defaultInput: '"bbbab"' },
        { id: 'longestPalSubstrDP', label: 'Longest Palindromic Substring (DP)', visualizer: 'dp', defaultInput: '"babad"' },
        { id: 'countPalSubstrDP', label: 'Count Palindromic Substrings (DP)', visualizer: 'dp', defaultInput: '"abc"' },
        { id: 'minInsertPalindrome', label: 'Minimum Insertions to Make Palindrome', visualizer: 'dp', defaultInput: '"mbadm"' },
      ],
    },
    {
      id: 'editDistanceDP',
      label: 'Edit Distance',
      patterns: [
        { id: 'levenshteinDist', label: 'Levenshtein Distance', visualizer: 'dp', defaultInput: '"horse", "ros"' },
        { id: 'oneEditDistCheck', label: 'One Edit Distance Check', visualizer: 'string', defaultInput: '"ab", "acb"' },
        { id: 'deleteOpsTwoStrings', label: 'Delete Operations for Two Strings', visualizer: 'dp', defaultInput: '"sea", "eat"' },
        { id: 'minAsciiDeleteSum', label: 'Minimum ASCII Delete Sum', visualizer: 'dp', defaultInput: '"delete", "leet"' },
      ],
    },
    {
      id: 'intervalDP',
      label: 'Matrix Chain / Interval DP',
      patterns: [
        { id: 'matrixChainMult', label: 'Matrix Chain Multiplication', visualizer: 'dp', defaultInput: '[10,20,30,40]' },
        { id: 'booleanParenthesization', label: 'Boolean Parenthesization', visualizer: 'dp', defaultInput: '"T|F&T^F"' },
        { id: 'burstBalloons', label: 'Burst Balloons', visualizer: 'dp', defaultInput: '[3,1,5,8]' },
        { id: 'minCostCutStick', label: 'Minimum Cost to Cut a Stick', visualizer: 'dp', defaultInput: '[1,3,4,5]' },
        { id: 'optimalBST', label: 'Optimal BST', visualizer: 'dp', defaultInput: '[10,12,20]' },
      ],
    },
    {
      id: 'knapsack01',
      label: '0/1 Knapsack',
      patterns: [
        { id: 'knapsack01Std', label: 'Standard 0/1 Knapsack', visualizer: 'dp', defaultInput: '[1,2,3], [10,15,40], 6' },
        { id: 'subsetSum', label: 'Subset Sum', visualizer: 'dp', defaultInput: '[3,34,4,12,5,2], 9' },
        { id: 'equalPartitionSum', label: 'Equal Partition Sum', visualizer: 'dp', defaultInput: '[1,5,11,5]' },
        { id: 'countSubsetsSumK', label: 'Count Subsets with Sum K', visualizer: 'dp', defaultInput: '[1,2,3,3], 6' },
        { id: 'minSubsetDiff', label: 'Minimum Subset Sum Difference', visualizer: 'dp', defaultInput: '[1,6,11,5]' },
        { id: 'targetSumAssign', label: 'Target Sum (+ and -)', visualizer: 'dp', defaultInput: '[1,1,1,1,1], 3' },
      ],
    },
    {
      id: 'unboundedKnapsack',
      label: 'Unbounded Knapsack',
      patterns: [
        { id: 'unboundedKnapsack', label: 'Unbounded Knapsack', visualizer: 'dp', defaultInput: '[1,50], [1,30], 100' },
        { id: 'rodCutting', label: 'Rod Cutting', visualizer: 'dp', defaultInput: '[1,5,8,9,10,17,17,20]' },
        { id: 'integerBreak', label: 'Integer Break', visualizer: 'dp', defaultInput: '10' },
        { id: 'perfectSquares', label: 'Perfect Squares', visualizer: 'dp', defaultInput: '12' },
      ],
    },
    {
      id: 'dpOnTrees',
      label: 'DP on Trees',
      patterns: [
        { id: 'treeDiameterDP', label: 'Tree Diameter (DP)', visualizer: 'tree', defaultInput: '[1,2,3,4,5]' },
        { id: 'maxIndependentSetTree', label: 'Maximum Independent Set on Tree', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6]' },
        { id: 'binaryTreeCameras', label: 'Binary Tree Cameras', visualizer: 'tree', defaultInput: '[0,0,null,0,0]' },
      ],
    },
    {
      id: 'bitmaskDP',
      label: 'Bitmask DP',
      patterns: [
        { id: 'travellingSalesman', label: 'Travelling Salesman Problem (TSP)', visualizer: 'graph', defaultInput: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]' },
        { id: 'minCostVisitAllNodes', label: 'Minimum Cost to Visit All Nodes', visualizer: 'graph', defaultInput: '[[0,1,2],[0,2,4],[1,2,1]]' },
        { id: 'matchingBitmask', label: 'Matching with Bitmask', visualizer: 'array', defaultInput: '[[1,1,0],[1,0,1],[0,1,1]]' },
      ],
    },
    {
      id: 'digitDP',
      label: 'Digit DP',
      patterns: [
        { id: 'countNumbersRange', label: 'Count Numbers in [L, R] with Property', visualizer: 'array', defaultInput: '1, 100' },
        { id: 'numbersNoConsecutive1s', label: 'Numbers without Consecutive 1s', visualizer: 'array', defaultInput: '5' },
        { id: 'digitSumEqualsK', label: 'Digit Sum Equals K', visualizer: 'array', defaultInput: '1, 1000, 7' },
      ],
    },
    {
      id: 'stockStateMachine',
      label: 'Stock Problems (State Machine DP)',
      patterns: [
        { id: 'stock1TransactionSM', label: 'Buy-Sell 1 Transaction', visualizer: 'array', defaultInput: '[7,1,5,3,6,4]' },
        { id: 'stockUnlimitedSM', label: 'Buy-Sell Unlimited Transactions', visualizer: 'array', defaultInput: '[7,1,5,3,6,4]' },
        { id: 'stockKTransactionsSM', label: 'Buy-Sell Exactly K Transactions', visualizer: 'array', defaultInput: '[3,2,6,5,0,3], 2' },
        { id: 'stockCooldownSM', label: 'With Cooldown', visualizer: 'array', defaultInput: '[1,2,3,0,2]' },
        { id: 'stockFeeSM', label: 'With Transaction Fee', visualizer: 'array', defaultInput: '[1,3,2,8,4,9], 2' },
      ],
    },
  ],
}
const GREEDY = {
  id: 'greedy',
  label: 'Greedy',
  icon: ICONS.greedy,
  subCategories: [
    {
      id: 'activitySelection',
      label: 'Activity Selection / Interval Scheduling',
      patterns: [
        { id: 'maxNonOverlapIntervals', label: 'Maximum Non-overlapping Intervals', visualizer: 'array', defaultInput: '[[1,2],[2,3],[3,4],[1,3]]' },
        { id: 'minPlatforms', label: 'Minimum Number of Platforms', visualizer: 'array', defaultInput: '[[900,910],[940,1200],[950,1120],[1100,1130],[1500,1900],[1800,2000]]' },
        { id: 'meetingRooms1', label: 'Meeting Rooms I (Can attend all?)', visualizer: 'array', defaultInput: '[[0,30],[5,10],[15,20]]' },
        { id: 'meetingRooms2', label: 'Meeting Rooms II (Min rooms)', visualizer: 'array', defaultInput: '[[0,30],[5,10],[15,20]]' },
      ],
    },
    {
      id: 'jobSequencing',
      label: 'Job Sequencing with Deadline',
      patterns: [
        { id: 'jobSequencingDSU', label: 'DSU-based Approach', visualizer: 'array', defaultInput: '[[4,20],[1,10],[1,40],[1,30]]' },
        { id: 'jobSequencingGreedy', label: 'Greedy Sort + Array Approach', visualizer: 'array', defaultInput: '[[4,20],[1,10],[1,40],[1,30]]' },
      ],
    },
    {
      id: 'huffmanEncoding',
      label: 'Huffman Encoding',
      patterns: [
        { id: 'buildHuffmanTree', label: 'Build Huffman Tree (Min Heap)', visualizer: 'tree', defaultInput: '[a:5,b:9,c:12,d:13,e:16,f:45]' },
        { id: 'assignHuffmanCodes', label: 'Assign Codes', visualizer: 'tree', defaultInput: '[a:5,b:9,c:12,d:13,e:16,f:45]' },
      ],
    },
    {
      id: 'jumpGame',
      label: 'Jump Game',
      patterns: [
        { id: 'jumpGame1', label: 'Jump Game I (Can reach end?)', visualizer: 'array', defaultInput: '[2,3,1,1,4]' },
        { id: 'jumpGame2', label: 'Jump Game II (Min jumps)', visualizer: 'array', defaultInput: '[2,3,1,1,4]' },
        { id: 'jumpGame3', label: 'Jump Game III (From any index)', visualizer: 'array', defaultInput: '[4,2,3,0,3,1,2], 5' },
      ],
    },
    {
      id: 'greedyOnStrings',
      label: 'Greedy on Strings',
      patterns: [
        { id: 'removeKDigits', label: 'Remove K Digits (Min number)', visualizer: 'array', defaultInput: '"1432219", 3' },
        { id: 'removeDuplicateLetters', label: 'Remove Duplicate Letters (Lexicographically smallest)', visualizer: 'string', defaultInput: '"bcabc"' },
        { id: 'reorganizeString', label: 'Reorganize String (No two adjacent same)', visualizer: 'string', defaultInput: '"aab"' },
        { id: 'taskSchedulerGreedy', label: 'Task Scheduler (Greedy)', visualizer: 'array', defaultInput: '["A","A","A","B","B","B"], 2' },
      ],
    },
    {
      id: 'regretBasedGreedy',
      label: 'Regret-based Greedy',
      patterns: [
        { id: 'candyDistribution', label: 'Candy Distribution', visualizer: 'array', defaultInput: '[1,0,2]' },
        { id: 'gasStation', label: 'Gas Station', visualizer: 'array', defaultInput: '[1,2,3,4,5], [3,4,5,1,2]' },
      ],
    },
  ],
}
const BIT_MANIP = {
  id: 'bitmanip',
  label: 'Bit Manipulation',
  icon: ICONS.bitmanip,
  subCategories: [
    {
      id: 'bitOps',
      label: 'Bit Set / Unset / Toggle / Check',
      patterns: [
        { id: 'setIthBit', label: 'Set ith Bit', visualizer: 'array', defaultInput: '[5, 1]' },
        { id: 'unsetIthBit', label: 'Unset ith Bit', visualizer: 'array', defaultInput: '[5, 1]' },
        { id: 'toggleIthBit', label: 'Toggle ith Bit', visualizer: 'array', defaultInput: '[5, 1]' },
        { id: 'checkIthBit', label: 'Check ith Bit', visualizer: 'array', defaultInput: '[5, 2]' },
        { id: 'countSetBits', label: 'Count Set Bits (Brian Kernighan)', visualizer: 'array', defaultInput: '29' },
        { id: 'isolateRightmostSet', label: 'Isolate Rightmost Set Bit', visualizer: 'array', defaultInput: '12' },
      ],
    },
    {
      id: 'xorTricks',
      label: 'XOR Tricks',
      patterns: [
        { id: 'singleNumber', label: 'Find Single Number (Others appear twice)', visualizer: 'array', defaultInput: '[4,1,2,1,2]' },
        { id: 'singleNumberThrice', label: 'Find Single Number (Others appear thrice)', visualizer: 'array', defaultInput: '[2,2,3,2]' },
        { id: 'twoNonRepeating', label: 'Find Two Non-repeating Numbers', visualizer: 'array', defaultInput: '[1,2,1,3,2,5]' },
        { id: 'missingAndRepeating', label: 'Missing and Repeating Number', visualizer: 'array', defaultInput: '[3,1,3]' },
        { id: 'xor1toN', label: 'XOR from 1 to N', visualizer: 'array', defaultInput: '5' },
        { id: 'swapWithoutTemp', label: 'Swap Without Temp Variable', visualizer: 'array', defaultInput: '[5, 3]' },
      ],
    },
    {
      id: 'binaryExponentiation',
      label: 'Binary Exponentiation',
      patterns: [
        { id: 'fastPower', label: 'Fast Power a^b', visualizer: 'array', defaultInput: '3, 5' },
        { id: 'fastPowerMod', label: 'Fast Power a^b mod m', visualizer: 'array', defaultInput: '3, 5, 7' },
        { id: 'matrixExponentiation', label: 'Matrix Exponentiation', visualizer: 'matrix', defaultInput: '[[1,1],[1,0]], 5' },
      ],
    },
    {
      id: 'reverseBitsGray',
      label: 'Reverse Bits / Gray Code',
      patterns: [
        { id: 'reverseBits32', label: 'Reverse 32-bit Integer', visualizer: 'array', defaultInput: '43261596' },
        { id: 'grayCodeGen', label: 'Generate N-bit Gray Code Sequence', visualizer: 'array', defaultInput: '3' },
      ],
    },
  ],
}
const MATH_NUMBER = {
  id: 'math',
  label: 'Math & Number Theory',
  icon: ICONS.math,
  subCategories: [
    {
      id: 'gcdLcm',
      label: 'GCD / LCM',
      patterns: [
        { id: 'euclideanGCD', label: 'Euclidean GCD (Recursive)', visualizer: 'recursion', defaultInput: '48, 18' },
        { id: 'extendedEuclidean', label: 'Extended Euclidean Algorithm', visualizer: 'recursion', defaultInput: '30, 20' },
        { id: 'lcmFromGCD', label: 'LCM using GCD', visualizer: 'array', defaultInput: '12, 18' },
      ],
    },
    {
      id: 'sieve',
      label: 'Sieve of Eratosthenes',
      patterns: [
        { id: 'stdSieve', label: 'Standard Sieve (Find all primes ≤ N)', visualizer: 'array', defaultInput: '30' },
        { id: 'segmentedSieve', label: 'Segmented Sieve (Large range)', visualizer: 'array', defaultInput: '100, 150' },
        { id: 'sieveSPF', label: 'Sieve for Smallest Prime Factor (SPF)', visualizer: 'array', defaultInput: '30' },
      ],
    },
    {
      id: 'primeFactorization',
      label: 'Prime Factorization',
      patterns: [
        { id: 'trialDivision', label: 'Trial Division O(√n)', visualizer: 'array', defaultInput: '84' },
        { id: 'spfFactorization', label: 'Using SPF Sieve O(log n)', visualizer: 'array', defaultInput: '84' },
      ],
    },
    {
      id: 'modularArithmetic',
      label: 'Modular Arithmetic',
      patterns: [
        { id: 'modularInverseFermat', label: "Fermat's Little Theorem (p is prime)", visualizer: 'array', defaultInput: '3, 7' },
        { id: 'modularInverseEEA', label: 'Extended Euclidean Approach', visualizer: 'recursion', defaultInput: '3, 7' },
      ],
    },
    {
      id: 'combinatorics',
      label: 'Combinatorics',
      patterns: [
        { id: 'pascalTriangle2', label: "Pascal's Triangle", visualizer: 'matrix', defaultInput: '5' },
        { id: 'nCrDP', label: 'nCr using DP (Pascal)', visualizer: 'matrix', defaultInput: '5, 2' },
        { id: 'nCrModInv', label: 'nCr using Modular Inverse', visualizer: 'array', defaultInput: '10, 3, 13' },
      ],
    },
    {
      id: 'catalanNumbers',
      label: 'Catalan Numbers',
      patterns: [
        { id: 'catalanNumber', label: 'Count Valid Parentheses (Catalan)', visualizer: 'array', defaultInput: '3' },
        { id: 'catalanBST', label: 'Count BSTs with N nodes', visualizer: 'array', defaultInput: '3' },
      ],
    },
    {
      id: 'matrixExponentiationMath',
      label: 'Matrix Exponentiation',
      patterns: [
        { id: 'fibonacciLogN', label: 'Fibonacci in O(log n)', visualizer: 'matrix', defaultInput: '10' },
        { id: 'solveLinearRecurrence', label: 'Solving Linear Recurrences', visualizer: 'matrix', defaultInput: '3, [1,1], [1,0]' },
      ],
    },
    {
      id: 'numberOfDivisors',
      label: 'Number of Divisors',
      patterns: [
        { id: 'countDivisors', label: 'Count Divisors of N', visualizer: 'array', defaultInput: '36' },
        { id: 'sumDivisors', label: 'Sum of Divisors', visualizer: 'array', defaultInput: '36' },
      ],
    },
    {
      id: 'convexHull',
      label: 'Geometry / Convex Hull',
      patterns: [
        { id: 'convexHullGraham', label: 'Convex Hull — Graham Scan', visualizer: 'graph', defaultInput: '[[0,0],[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]' },
        { id: 'convexHullJarvis', label: 'Convex Hull — Jarvis March', visualizer: 'graph', defaultInput: '[[0,0],[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]' },
      ],
    },
  ],
}
const TRIE = {
  id: 'trie',
  label: 'Trie',
  icon: ICONS.trie,
  subCategories: [
    {
      id: 'trieInsertSearch',
      label: 'Trie Insert / Search / Delete',
      patterns: [
        { id: 'trieInsert', label: 'Insert Word', visualizer: 'tree', defaultInput: '["apple", "app", "apricot"]' },
        { id: 'trieSearch', label: 'Search Word (Exact)', visualizer: 'tree', defaultInput: '["apple", "app"]' },
        { id: 'triePrefix', label: 'Count Words with Prefix', visualizer: 'tree', defaultInput: '["apple", "app", "apricot"]' },
        { id: 'trieDelete', label: 'Delete Word', visualizer: 'tree', defaultInput: '["apple", "app"]' },
      ],
    },
    {
      id: 'autocomplete',
      label: 'Autocomplete / Prefix Search',
      patterns: [
        { id: 'searchSuggestions', label: 'Search Suggestions System', visualizer: 'tree', defaultInput: '["mobile","mouse","moneypot","monitor","mousepad"]' },
        { id: 'longestCommonPrefixAll', label: 'Longest Common Prefix of All Words', visualizer: 'tree', defaultInput: '["flower","flow","flight"]' },
      ],
    },
    {
      id: 'xorBinaryTrie',
      label: 'XOR Maximization (Binary Trie)',
      patterns: [
        { id: 'maxXorTwoNumbers', label: 'Maximum XOR of Two Numbers in Array', visualizer: 'tree', defaultInput: '[3,10,5,25,2,8]' },
        { id: 'maxXorSubarray', label: 'Maximum XOR Subarray', visualizer: 'tree', defaultInput: '[8,1,2,12,7,6]' },
      ],
    },
    {
      id: 'ahoCorasick',
      label: 'Aho-Corasick',
      patterns: [
        { id: 'buildFailureLinks', label: 'Build Failure Links', visualizer: 'tree', defaultInput: '["he","she","his","hers"]' },
        { id: 'multiPatternSearch', label: 'Multi-pattern Search in Text', visualizer: 'string', defaultInput: '"ushers", ["he","she","his","hers"]' },
      ],
    },
  ],
}
const DSU = {
  id: 'dsu',
  label: 'Disjoint Set Union',
  icon: ICONS.dsu,
  subCategories: [
    {
      id: 'dsuCore',
      label: 'DSU Core',
      patterns: [
        { id: 'dsuFindPathCompression', label: 'Find with Path Compression', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[3,4]]' },
        { id: 'dsuUnionRank', label: 'Union by Rank', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[3,4]]' },
        { id: 'dsuUnionSize', label: 'Union by Size', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[3,4]]' },
        { id: 'dsuComponents', label: 'Count Connected Components', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[3,4]]' },
      ],
    },
    {
      id: 'dsuApplications',
      label: 'DSU Applications',
      patterns: [
        { id: 'cycleDSU2', label: 'Cycle Detection in Undirected Graph', visualizer: 'graph', defaultInput: '[[0,1],[1,2],[2,0]]' },
        { id: 'kruskalDSU', label: "Kruskal's MST", visualizer: 'graph', defaultInput: '[[0,1,4],[0,2,3],[1,2,1],[1,3,2],[2,3,5]]' },
        { id: 'accountsMerge2', label: 'Accounts Merge', visualizer: 'graph', defaultInput: '[["John","john1","john2"],["John","john3"]]' },
        { id: 'redundantConnection2', label: 'Redundant Connection', visualizer: 'graph', defaultInput: '[[1,2],[1,3],[2,3]]' },
        { id: 'numProvinces', label: 'Number of Provinces', visualizer: 'graph', defaultInput: '[[1,1,0],[1,1,0],[0,0,1]]' },
      ],
    },
  ],
}
const SEGMENT_ADV = {
  id: 'segmentAdv',
  label: 'Segment Tree & Advanced DS',
  icon: ICONS.segmenttree,
  subCategories: [
    {
      id: 'segmentTreeSub2',
      label: 'Segment Tree',
      patterns: [
        { id: 'buildSegTree2', label: 'Build Segment Tree', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreePointSum', label: 'Point Update, Range Sum', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreeRangeMin', label: 'Point Update, Range Min', visualizer: 'tree', defaultInput: '[1,3,5,7,9,11]' },
        { id: 'segTreeLazyRange', label: 'Range Update + Range Query (Lazy)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6]' },
      ],
    },
    {
      id: 'fenwickTreeBIT',
      label: 'Fenwick Tree / BIT',
      patterns: [
        { id: 'bitPointUpdatePrefixSum', label: 'Point Update, Prefix Sum', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8]' },
        { id: 'bitRangeUpdatePoint', label: 'Range Update, Point Query', visualizer: 'array', defaultInput: '[0,0,0,0,0]' },
        { id: 'bitRangeUpdateRange', label: 'Range Update, Range Query', visualizer: 'array', defaultInput: '[0,0,0,0,0]' },
        { id: 'bit2D', label: '2D Binary Indexed Tree', visualizer: 'matrix', defaultInput: '[[1,2],[3,4]]' },
      ],
    },
    {
      id: 'sparseTable',
      label: 'Sparse Table',
      patterns: [
        { id: 'buildSparseTable', label: 'Build Sparse Table O(n log n)', visualizer: 'array', defaultInput: '[4,2,3,7,1,5,3]' },
        { id: 'rmqSparseTable', label: 'RMQ (Range Min Query) O(1)', visualizer: 'array', defaultInput: '[4,2,3,7,1,5,3]' },
        { id: 'rangeGCDSparse', label: 'Range GCD, OR, AND Query', visualizer: 'array', defaultInput: '[4,2,3,7,1,5,3]' },
      ],
    },
    {
      id: 'mosAlgorithm',
      label: "Mo's Algorithm",
      patterns: [
        { id: 'mosOffline', label: "Offline Range Queries (Mo's)", visualizer: 'array', defaultInput: '[1,3,5,2,7,4,6]' },
        { id: 'mosWithUpdates', label: "Mo's Algorithm with Updates", visualizer: 'array', defaultInput: '[1,2,3,4,5]' },
      ],
    },
    {
      id: 'sqrtDecomposition',
      label: 'Sqrt Decomposition',
      patterns: [
        { id: 'blockDecompSum', label: 'Block Decomposition (Range Sum)', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8,9]' },
        { id: 'heavyLightDecomp', label: 'Heavy-Light Decomposition (HLD)', visualizer: 'tree', defaultInput: '[1,2,3,4,5,6,7]' },
      ],
    },
  ],
}
const DIVIDE_CONQUER = {
  id: 'divideConquer',
  label: 'Divide & Conquer',
  icon: ICONS.divideconquer,
  subCategories: [
    {
      id: 'dcGeneral',
      label: 'Divide & Conquer General',
      patterns: [
        { id: 'masterTheorem', label: 'Master Theorem (Analyze recurrences)', visualizer: 'array', defaultInput: '"T(n)=2T(n/2)+O(n)"' },
        { id: 'karatsubaMult', label: 'Karatsuba Multiplication O(n^1.58)', visualizer: 'array', defaultInput: '1234, 5678' },
      ],
    },
    {
      id: 'closestPair',
      label: 'Closest Pair of Points',
      patterns: [
        { id: 'closestPairPoints', label: 'Closest Pair of Points (Divide by X)', visualizer: 'graph', defaultInput: '[[2,3],[12,30],[40,50],[5,1],[12,10],[3,4]]' },
      ],
    },
    {
      id: 'inversionCountDC',
      label: 'Inversion Count',
      patterns: [
        { id: 'inversionCountMerge', label: 'Modified Merge Sort', visualizer: 'array', defaultInput: '[1,20,6,4,5]' },
      ],
    },
  ],
}
const MISC = {
  id: 'misc',
  label: 'Miscellaneous',
  icon: ICONS.misc,
  subCategories: [
    {
      id: 'meetInMiddle',
      label: 'Meet in the Middle',
      patterns: [
        { id: 'meetInMiddleSubset', label: 'Subset Sum (Large n ~ 40)', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8,9,10]' },
        { id: 'bidirectionalBFS', label: 'Bidirectional BFS', visualizer: 'graph', defaultInput: '{"start":["A","B"],"A":["C"],"B":["C"],"C":["goal"]}' },
      ],
    },
    {
      id: 'kWayMerge',
      label: 'K-way Merge Pattern',
      patterns: [
        { id: 'mergeKSortedArrays', label: 'Merge K Sorted Arrays', visualizer: 'array', defaultInput: '[[1,4,7],[2,5,8],[3,6,9]]' },
        { id: 'smallestRangeKWay', label: 'Smallest Range Covering K Lists', visualizer: 'array', defaultInput: '[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]' },
      ],
    },
    {
      id: 'reservoirSampling',
      label: 'Reservoir Sampling',
      patterns: [
        { id: 'reservoirSampleList', label: 'Random Node in Linked List', visualizer: 'linkedlist', defaultInput: '[1,2,3,4,5]' },
        { id: 'reservoirSampleStream', label: 'Sample K Elements from Stream', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7,8,9,10]' },
      ],
    },
    {
      id: 'fisherYates',
      label: 'Fisher-Yates Shuffle',
      patterns: [
        { id: 'fisherYatesShuffle', label: 'Random Shuffle in O(n)', visualizer: 'array', defaultInput: '[1,2,3,4,5,6,7]' },
      ],
    },
    {
      id: 'eventBased',
      label: 'Event-based Processing',
      patterns: [
        { id: 'coordEvents', label: 'Coordinate-based Events (Start/End)', visualizer: 'array', defaultInput: '[[1,3],[2,5],[3,6]]' },
        { id: 'sweepLineEvents', label: 'Sweep Line Events (Add/Remove)', visualizer: 'array', defaultInput: '[[1,3,1],[2,5,1],[3,6,-1]]' },
      ],
    },
  ],
}

// ─── Flat lookup by ID ─────────────────────────────────────
function buildFlatLookup() {
  const lookup = {}
  const all = [
    ARRAYS, STRINGS, LINKED_LIST, STACKS, QUEUES,
    RECURSION_BT, SORTING_SEARCHING, HASHING,
    TREES, HEAP, GRAPHS, DP, GREEDY, BIT_MANIP,
    MATH_NUMBER, TRIE, DSU, SEGMENT_ADV, DIVIDE_CONQUER, MISC,
  ]
  all.forEach(cat => {
    cat.subCategories.forEach(sub => {
      sub.patterns.forEach(p => {
        lookup[p.id] = { ...p, categoryId: cat.id, categoryLabel: cat.label, subCategoryId: sub.id, subCategoryLabel: sub.label }
      })
    })
  })
  return lookup
}

export const PATTERN_LOOKUP = buildFlatLookup()

export const ALL_CATEGORIES = [
  ARRAYS, STRINGS, LINKED_LIST, STACKS, QUEUES,
  RECURSION_BT, SORTING_SEARCHING, HASHING,
  TREES, HEAP, GRAPHS, DP, GREEDY, BIT_MANIP,
  MATH_NUMBER, TRIE, DSU, SEGMENT_ADV, DIVIDE_CONQUER, MISC,
]

/**
 * Get pattern metadata by its unique ID.
 */
export function getPattern(id) {
  return PATTERN_LOOKUP[id] || null
}

export default ALL_CATEGORIES
