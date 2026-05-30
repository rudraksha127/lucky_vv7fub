/**
 * timeComplexity.js — Time & Space complexity for all 738 DSA patterns.
 *
 * Each entry: { best, avg, worst, space }
 */

const _ = (best, avg, worst, space) => ({ best, avg, worst, space })

// Helper: generate same complexity for multiple pattern IDs
const SAME = (ids, complexity) => {
  const result = {}
  for (const id of ids) result[id] = complexity
  return result
}

const TIME_COMPLEXITY = {
  // ═══ ARRAYS (1-106) ═══
  // Prefix Sum
  ...SAME(['1dPrefixSum', '2dPrefixSum', 'suffixSum', 'prefixXor', 'prefixProduct', 'runningSum', 'differenceArray'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Two Pointer
  ...SAME(['oppositeTwoPointer', 'sameDirectionPointer', 'inplaceReversal', 'removeElementInplace', 'mergeSortedInplace'],
    _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['threeSum', 'fourSum'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(1)')),
  ...SAME(['containerMostWater'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['trappingRainWater2Ptr'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['removeDuplicatesInplace', 'dedupSortedInplace'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Sliding Window
  ...SAME(['fixedSlidingWindow'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['variableLongest', 'variableShortest'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['slidingWindowFreq'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),
  ...SAME(['slidingWindowDeque'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),

  // Kadane
  ...SAME(['maxSubarraySum', 'maxCircularSubarray', 'minSubarraySum'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['maxSubarrayProduct'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Dutch National Flag
  ...SAME(['threeWayPartition', 'segregateEvenOdd', 'segregatePosNeg', 'segregateCustom', 'sortColors'],
    _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Sorting-based
  ...SAME(['customComparator', 'sortByFrequency', 'sortMultiKey'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['wiggleSort'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['pancakeSort'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(1)')),

  // Binary Search on Answer
  ...SAME(['minimizeMax', 'maximizeMin', 'kthMissingPositive', 'shipPackages', 'splitArrayLargest',
           'bookAllocation', 'aggressiveCows'], _('O(n log m)', 'O(n log m)', 'O(n log m)', 'O(1)')),

  // Matrix
  ...SAME(['rowColTraversal', 'transpose', 'rotateMatrix', 'setMatrixZeroes', 'pascalTriangle'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(1)')),
  ...SAME(['searchSortedMatrix'], _('O(m+n)', 'O(m+n)', 'O(m+n)', 'O(1)')),

  // Spiral / Diagonal
  ...SAME(['spiralOrder', 'diagonalTraversal', 'antiDiagonal', 'layerTraversal'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(1)')),

  // Array Rotation
  ...SAME(['leftRotation', 'rightRotation', 'blockReverse', 'jugglingAlgo', 'cyclicReplacement'],
    _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Merge Intervals
  ...SAME(['mergeOverlapping', 'insertInterval', 'nonOverlapping', 'intervalIntersection', 'employeeFreeTime'],
    _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // Rearrangement
  ...SAME(['alternatePosNeg', 'moveZerosEnd', 'rearrangeBySign', 'shuffleInterleave'],
    _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // In-place Manipulation
  ...SAME(['dedupUnsortedInplace'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)')),

  // Moore's Voting
  ...SAME(['majorityN2', 'majorityN3', 'kMajority'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Stock Buy-Sell
  ...SAME(['stock1Transaction'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['stockUnlimited'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['stockKTransactions', 'stockAtMostK'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(n×k)')),
  ...SAME(['stockCooldown', 'stockWithFee'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Subarray
  ...SAME(['countSubarraySumK', 'longestSubarraySumK', 'subarrayEqual01', 'smallestSubarraySumS', 'countSubarrayProductK'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['productExceptSelf'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Monotonic Stack
  ...SAME(['nextGreaterElement', 'nextSmallerElement', 'prevGreaterElement', 'prevSmallerElement',
           'sumSubarrayMins', 'sumSubarrayMaxs', 'maxWidthRamp'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['largestRectangleHistogram', 'trappingRainStack'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Cyclic Sort
  ...SAME(['findMissingNumber', 'findDuplicateNumber', 'findAllMissing', 'findAllDuplicates'],
    _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['firstMissingPositive'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // Contribution Technique
  ...SAME(['sumSubarrayMinsContrib', 'sumSubarrayMaxsContrib', 'sumSubarrayRanges'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Sweep Line
  ...SAME(['countEvents', 'intervalScheduling', 'coveredPoints'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['unionRectangles'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n)')),

  // ═══ STRINGS (107-170) ═══
  // KMP
  ...SAME(['kmpSearch', 'countPatternKMP', 'repeatedStringMatch', 'shortestPalindromeKMP'],
    _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(m)')),
  ...SAME(['lpsArray'], _('O(m)', 'O(m)', 'O(m)', 'O(m)')),

  // Rabin-Karp
  ...SAME(['rkSinglePattern', 'rkMultiPattern'], _('O(n+m)', 'O(n+m)', 'O(n×m)', 'O(1)')),
  ...SAME(['repeatedDna'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['longestDuplicateSubstr'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n²)')),

  // Z-Algorithm
  ...SAME(['zPatternMatch', 'zCountOccurrences', 'zConcatTrick'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(n+m)')),

  // Anagram / Permutation
  ...SAME(['checkAnagram', 'minWindowAnagram'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(1)')),
  ...SAME(['groupAnagrams'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(n×k)')),
  ...SAME(['findAnagramPositions'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(1)')),

  // Palindrome
  ...SAME(['checkPalindrome', 'validPalindrome2'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['longestPalSubstrExpand', 'countPalSubstrings'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(1)')),
  ...SAME(['palindromePairs'], _('O(n²×k)', 'O(n²×k)', 'O(n²×k)', 'O(n×k)')),

  // Manacher
  ...SAME(['manacherLongest', 'manacherCount'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // String Hashing
  ...SAME(['polyHash', 'doubleHash', 'hashEqualSubstrings'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // String Compression
  ...SAME(['runLengthEncode', 'decodeEncode', 'compressInplace'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Parentheses
  ...SAME(['validParens', 'minAddValid', 'longestValidParens', 'removeInvalidParens', 'scoreOfParens'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // LCS
  ...SAME(['lcs', 'printLCS', 'longestCommonSubstr', 'shortestCommonSupersequence'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),

  // Edit Distance
  ...SAME(['minEditDistance', 'oneEditDistance', 'deleteTwoStrings', 'minAsciiDelete'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),

  // Trie-based
  ...SAME(['wordSearch2'], _('O(m×n×4^k)', 'O(m×n×4^k)', 'O(m×n×4^k)', 'O(k)')),
  ...SAME(['replaceWords', 'autocompleteSystem'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(n×k)')),

  // Suffix Array
  ...SAME(['buildSuffixArray', 'lcpArray', 'longestRepeatedSubstr', 'countDistinctSubstr'],
    _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // String Rotation / Isomorphism
  ...SAME(['rotationCheck', 'isomorphic', 'wordPattern', 'repeatedSubstrPattern'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // Lexicographic
  ...SAME(['kthPermutation'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n)')),
  ...SAME(['alienDictionary'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(1)')),
  ...SAME(['largestNumber'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // Wildcard / Regex
  ...SAME(['wildcardMatch', 'regexMatch'], _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),

  // ═══ LINKED LIST (171-196) ═══
  ...SAME(['detectCycle', 'findCycleStart'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['findMiddleLL', 'findMiddleForSort'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['happyNumber'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['palindromeLL'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['reorderListLL'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['reverseEntireLL', 'reverseBetween'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['reverseKGroup', 'reverseAlternateK'], _('O(n)', 'O(n)', 'O(n)', 'O(n/k)')),
  ...SAME(['mergeTwoSortedLL'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(1)')),
  ...SAME(['mergeKSortedHeap', 'mergeKSortedDC'], _('O(n log k)', 'O(n log k)', 'O(n log k)', 'O(k)')),
  ...SAME(['nthFromEnd', 'removeNthFromEnd'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['intersectionTwoPointer', 'intersectionHashSet'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(1)')),
  ...SAME(['cloneHashMap', 'cloneInplaceWeave'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['lruCacheDL'], _('O(1)', 'O(1)', 'O(1)', 'O(n)')),
  ...SAME(['flattenDoublyLL', 'flattenNestedLL'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['mergeSortLL'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(log n)')),
  ...SAME(['insertionSortLL'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(1)')),

  // ═══ STACKS (197-220) ═══
  ...SAME(['nextGreater1', 'nextGreater2'], _('O(n+m)', 'O(n+m)', 'O(n+m)', 'O(n)')),
  ...SAME(['largestRectHist', 'trappingRainStack2', 'sumSubarrayMinMax', 'maxWidthRamp2'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['infixToPostfix', 'infixToPrefix'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['postfixEval'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['basicCalc1', 'basicCalc2', 'basicCalc3'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['validParensCheck', 'minRemoveValid', 'longestValidParenSubstr'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['minStack', 'maxStack', 'minMaxDeleteStack'], _('O(1)', 'O(1)', 'O(1)', 'O(n)')),
  ...SAME(['decodeKEncoded', 'nestedDecoding'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['stockSpan', 'dailyTemps2', 'onlineStockSpan'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // ═══ QUEUES (221-225) ═══
  ...SAME(['windowMaxK', 'windowMinK'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),
  ...SAME(['implCircularQueue', 'implCircularDeque'], _('O(1)', 'O(1)', 'O(1)', 'O(n)')),
  ...SAME(['firstNonRepeatQueue'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),

  // ═══ RECURSION & BACKTRACKING (226-251) ═══
  ...SAME(['allSubsets', 'subsetsWithDups'], _('O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)')),
  ...SAME(['subsetGivenSum', 'beautifulSubsets'], _('O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)')),
  ...SAME(['allPermutations', 'permutationsWithDups', 'kthPermutation2'], _('O(n!)', 'O(n!)', 'O(n!)', 'O(n!)')),
  ...SAME(['nextPermutation', 'prevPermutation'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['combinationsNCR'], _('O(C(n,k))', 'O(C(n,k))', 'O(C(n,k))', 'O(k)')),
  ...SAME(['comboSumUnlimited', 'comboSumUnique'], _('O(2^t)', 'O(2^t)', 'O(2^t)', 'O(t)')),
  ...SAME(['comboSumExactK'], _('O(C(9,k))', 'O(C(9,k))', 'O(C(9,k))', 'O(k)')),
  ...SAME(['letterCombos'], _('O(4ⁿ)', 'O(4ⁿ)', 'O(4ⁿ)', 'O(4ⁿ)')),
  ...SAME(['nQueensAll', 'nQueensCount'], _('O(n!)', 'O(n!)', 'O(n!)', 'O(n²)')),
  ...SAME(['solveSudoku'], _('O(9^(81))', 'O(9^(81))', 'O(9^(81))', 'O(1)')),
  ...SAME(['validSudoku'], _('O(9²)', 'O(9²)', 'O(9²)', 'O(1)')),
  ...SAME(['ratInMaze', 'wordSearch', 'knightsTour', 'uniquePathsObstaclesBT'], _('O(4^(m×n))', 'O(4^(m×n))', 'O(4^(m×n))', 'O(m×n)')),
  ...SAME(['allPalPartitions', 'minCutsDP'], _('O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(n²)')),
  ...SAME(['addOpsToTarget'], _('O(4ⁿ)', 'O(4ⁿ)', 'O(4ⁿ)', 'O(4ⁿ)')),

  // ═══ SORTING & SEARCHING (252-283) ═══
  ...SAME(['stdBinarySearch', 'firstOccurrence', 'lastOccurrence', 'countOccurrences', 'floorCeiling'],
    _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['sqrtInt'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['findPeakElement'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['searchRotated', 'minRotated', 'searchRotatedDups'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['lowerBound', 'upperBound', 'countRange'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['searchFullSorted', 'binarySearchRows'], _('O(log(m×n))', 'O(log(m×n))', 'O(log(m×n))', 'O(1)')),
  ...SAME(['searchRowColSorted'], _('O(m+n)', 'O(m+n)', 'O(m+n)', 'O(1)')),
  ...SAME(['mergeSort2', 'countInversions'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['stdQuickSort', 'randomizedQuickSort', 'threeWayQuickSort'],
    _('O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)')),
  ...SAME(['quickSelect'], _('O(n)', 'O(n)', 'O(n²)', 'O(1)')),
  ...SAME(['countingSort'], _('O(n+k)', 'O(n+k)', 'O(n+k)', 'O(k)')),
  ...SAME(['radixSortLSD'], _('O(d×(n+k))', 'O(d×(n+k))', 'O(d×(n+k))', 'O(n+k)')),
  ...SAME(['bucketSort'], _('O(n+k)', 'O(n+k)', 'O(n²)', 'O(n)')),
  ...SAME(['kthLargestQS', 'kthSmallest'], _('O(n)', 'O(n)', 'O(n²)', 'O(1)')),

  // ═══ HASHING (284-303) ═══
  ...SAME(['charFreq', 'wordFreq'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),
  ...SAME(['twoSumHash', 'fourSumHash', 'twoSumClassic'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['subarrayZeroSum', 'subarraySumK', 'countSubarraysK', 'longestSubarrayK', 'countSubarraysXOR'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['longestConsecutiveHashSet', 'longestConsecutiveHashMap'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['countPairsCondition'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['coordCompress1D', 'coordCompress2D'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // ═══ TREES (304-370) ═══
  ...SAME(['inorderRecursive', 'inorderIterative', 'preorderRecursive', 'preorderIterative',
           'postorderRecursive', 'postorderIterative'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['morrisInorder', 'morrisPreorder'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['levelOrderStd', 'levelAverages', 'levelSums', 'zigzagLevelOrder', 'leftSideView',
           'rightSideView'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['heightOfTree', 'minDepthTree', 'maxWidthTree'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['diameterOfTree'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['lcaBinaryTree', 'lcaBST', 'lcaParentPtrs'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['lcaBinaryLifting'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(n log n)')),
  ...SAME(['printRootToNode', 'pathSumHasPath', 'allPathsTarget', 'pathSumPrefix'],
    _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['maxPathRootToLeaf', 'maxPathAnyToAny'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['serializeBFS', 'serializeDFS'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['topView', 'bottomView', 'leftView', 'rightView', 'verticalOrder'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['bstInsertRecursive', 'bstInsertIterative', 'searchBST', 'deleteBST'],
    _('O(log n)', 'O(log n)', 'O(n)', 'O(h)')),
  ...SAME(['validateBSTMinMax', 'validateBSTInorder'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['kthSmallestBST', 'kthLargestBST'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['constructInorderPreorder', 'constructInorderPostorder', 'constructLevelOrderBST'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['bstIteratorStack'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['buildSegmentTree', 'segTreePointUpdateRangeSum', 'segTreeRangeMinMax', 'segTreeLazyProp',
           'buildSegTree2', 'segTreePointSum', 'segTreeRangeMin', 'segTreeLazyRange'],
    _('O(log n)', 'O(log n)', 'O(log n)', 'O(n)')),
  ...SAME(['fenwickPointUpdatePrefixSum', 'fenwickRangeUpdatePointQuery',
           'bitPointUpdatePrefixSum', 'bitRangeUpdatePoint', 'bitRangeUpdateRange', 'bit2D'],
    _('O(log n)', 'O(log n)', 'O(log n)', 'O(n)')),

  // ═══ HEAP (371-387) ═══
  ...SAME(['kthLargestMinHeap', 'kthSmallestMaxHeap', 'kClosestPoints', 'kthLargestStream'],
    _('O(n log k)', 'O(n log k)', 'O(n log k)', 'O(k)')),
  ...SAME(['mergeKSortedHeaps', 'smallestRangeKLists'], _('O(n log k)', 'O(n log k)', 'O(n log k)', 'O(k)')),
  ...SAME(['topKFreqElements', 'topKFreqWords', 'sortCharsByFreq'], _('O(n log k)', 'O(n log k)', 'O(n log k)', 'O(n)')),
  ...SAME(['medianTwoHeaps', 'slidingWindowMedian'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(n)')),
  ...SAME(['cpuScheduling', 'taskScheduler2', 'meetingRoomsHeap'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // ═══ GRAPHS (388-453) ═══
  ...SAME(['shortestPathUnweighted', 'bipartiteBFS', 'rottenOranges', 'zeroOneMatrix',
           'multiSourceRotten', 'wallsAndGates'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['pathFindingDFS', 'connectedComponents', 'floodFill', 'numIslands'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['dijkstraStd', 'dijkstraGrid', 'networkDelayTime', 'cheapestFlightsK'],
    _('O((V+E) log V)', 'O((V+E) log V)', 'O((V+E) log V)', 'O(V)')),
  ...SAME(['bellmanFordStd', 'negCycleDetection'], _('O(V×E)', 'O(V×E)', 'O(V×E)', 'O(V)')),
  ...SAME(['kruskalSortDSU', 'minCostConnectPoints'], _('O(E log E)', 'O(E log E)', 'O(E log E)', 'O(V+E)')),
  ...SAME(['topoSortDFS', 'kahnTopoSort', 'courseSchedule1', 'courseSchedule2',
           'cycleKahn'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['cycleDFS', 'cycleDSU'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['kosarajuSCC', 'tarjanSCC'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['tarjanBridges', 'articulationPoints'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['fordFulkerson'], _('O(E×f)', 'O(E×f)', 'O(E×f)', 'O(V)')),
  ...SAME(['eulerPath', 'reconstructItinerary'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(E)')),

  // ═══ DP (454-547) ═══
  ...SAME(['fibonacciDP', 'climbingStairs', 'decodeWays', 'frogJumpMinCost', 'integerBreak', 'perfectSquares'],
    _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['houseRobber1'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['houseRobberCircular'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['houseRobberTree'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['uniquePaths', 'uniquePathsObstacles', 'minPathSum', 'dungeonGame', 'triangleMinPath', 'goldMine'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),
  ...SAME(['lcs2', 'printLCS', 'longestCommonSubstr2', 'shortestCommonSuper', 'minInsertDeleteConvert'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),
  ...SAME(['lisOn2', 'numberOfLIS', 'longestBitonic'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n)')),
  ...SAME(['lisOnLogN'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['longestPalSubseq', 'longestPalSubstrDP', 'countPalSubstrDP', 'minInsertPalindrome'],
    _('O(n²)', 'O(n²)', 'O(n²)', 'O(n²)')),
  ...SAME(['levenshteinDist', 'oneEditDistCheck', 'deleteOpsTwoStrings', 'minAsciiDeleteSum'],
    _('O(m×n)', 'O(m×n)', 'O(m×n)', 'O(m×n)')),
  ...SAME(['matrixChainMult', 'booleanParenthesization', 'burstBalloons', 'minCostCutStick', 'optimalBST'],
    _('O(n³)', 'O(n³)', 'O(n³)', 'O(n²)')),
  ...SAME(['knapsack01Std'], _('O(n×W)', 'O(n×W)', 'O(n×W)', 'O(n×W)')),
  ...SAME(['subsetSum', 'equalPartitionSum', 'countSubsetsSumK', 'minSubsetDiff', 'targetSumAssign'],
    _('O(n×sum)', 'O(n×sum)', 'O(n×sum)', 'O(n×sum)')),
  ...SAME(['unboundedKnapsack', 'rodCutting'], _('O(n×W)', 'O(n×W)', 'O(n×W)', 'O(n×W)')),
  ...SAME(['coinChangeMin', 'coinChangeWays'], _('O(n×amount)', 'O(n×amount)', 'O(n×amount)', 'O(amount)')),
  ...SAME(['travellingSalesman', 'minCostVisitAllNodes'], _('O(n²×2ⁿ)', 'O(n²×2ⁿ)', 'O(n²×2ⁿ)', 'O(2ⁿ)')),
  ...SAME(['treeDiameterDP', 'maxIndependentSetTree', 'binaryTreeCameras'], _('O(n)', 'O(n)', 'O(n)', 'O(h)')),
  ...SAME(['countNumbersRange', 'numbersNoConsecutive1s', 'digitSumEqualsK'], _('O(d×2)', 'O(d×2)', 'O(d×2)', 'O(d×2)')),

  // ═══ GREEDY (548-573) ═══
  ...SAME(['maxNonOverlapIntervals', 'meetingRooms1', 'jobSequencingDSU', 'jobSequencingGreedy'],
    _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['minPlatforms', 'meetingRooms2'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['buildHuffmanTree', 'assignHuffmanCodes'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['jumpGame1', 'jumpGame3'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['jumpGame2'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['removeKDigits'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['removeDuplicateLetters'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),
  ...SAME(['reorganizeString', 'taskSchedulerGreedy'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['candyDistribution'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['gasStation'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),

  // ═══ BIT MANIPULATION (574-602) ═══
  ...SAME(['setIthBit', 'unsetIthBit', 'toggleIthBit', 'checkIthBit'], _('O(1)', 'O(1)', 'O(1)', 'O(1)')),
  ...SAME(['countSetBits', 'isolateRightmostSet'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['singleNumber', 'xor1toN', 'swapWithoutTemp'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['singleNumberThrice'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['twoNonRepeating', 'missingAndRepeating'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['fastPower', 'fastPowerMod'], _('O(log n)', 'O(log n)', 'O(log n)', 'O(1)')),
  ...SAME(['matrixExponentiation', 'fibonacciLogN', 'solveLinearRecurrence'], _('O(k³ log n)', 'O(k³ log n)', 'O(k³ log n)', 'O(k²)')),
  ...SAME(['reverseBits32'], _('O(1)', 'O(1)', 'O(1)', 'O(1)')),
  ...SAME(['grayCodeGen'], _('O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)')),

  // ═══ MATH & NUMBER THEORY (603-651) ═══
  ...SAME(['euclideanGCD', 'lcmFromGCD'], _('O(log min(a,b))', 'O(log min(a,b))', 'O(log min(a,b))', 'O(1)')),
  ...SAME(['extendedEuclidean'], _('O(log min(a,b))', 'O(log min(a,b))', 'O(log min(a,b))', 'O(1)')),
  ...SAME(['stdSieve', 'sieveSPF'], _('O(n log log n)', 'O(n log log n)', 'O(n log log n)', 'O(n)')),
  ...SAME(['segmentedSieve'], _('O(n log log n)', 'O(n log log n)', 'O(n log log n)', 'O(√n)')),
  ...SAME(['trialDivision', 'spfFactorization'], _('O(√n)', 'O(√n)', 'O(√n)', 'O(1)')),
  ...SAME(['modularInverseFermat', 'modularInverseEEA'], _('O(log m)', 'O(log m)', 'O(log m)', 'O(1)')),
  ...SAME(['pascalTriangle2', 'nCrDP'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n²)')),
  ...SAME(['nCrModInv'], _('O(n)', 'O(n)', 'O(n)', 'O(n)')),
  ...SAME(['catalanNumber', 'catalanBST'], _('O(n²)', 'O(n²)', 'O(n²)', 'O(n)')),
  ...SAME(['countDivisors', 'sumDivisors'], _('O(√n)', 'O(√n)', 'O(√n)', 'O(1)')),
  ...SAME(['convexHullGraham', 'convexHullJarvis'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // ═══ TRIE (652-666) ═══
  ...SAME(['trieInsert'], _('O(k)', 'O(k)', 'O(k)', 'O(n×k)')),
  ...SAME(['trieSearch', 'trieDelete', 'triePrefix'], _('O(k)', 'O(k)', 'O(k)', 'O(1)')),
  ...SAME(['searchSuggestions'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(n×k)')),
  ...SAME(['longestCommonPrefixAll'], _('O(n×k)', 'O(n×k)', 'O(n×k)', 'O(n×k)')),
  ...SAME(['maxXorTwoNumbers', 'maxXorSubarray'], _('O(n×b)', 'O(n×b)', 'O(n×b)', 'O(n×b)')),
  ...SAME(['buildFailureLinks', 'multiPatternSearch'], _('O(n×k + m)', 'O(n×k + m)', 'O(n×k + m)', 'O(n×k)')),

  // ═══ DSU (667-680) ═══
  ...SAME(['dsuFindPathCompression', 'dsuUnionRank', 'dsuUnionSize', 'dsuComponents',
           'cycleDSU2', 'kruskalDSU', 'accountsMerge2', 'redundantConnection2', 'numProvinces'],
    _('O(α(n))', 'O(α(n))', 'O(α(n))', 'O(n)')),

  // ═══ SEGMENT TREE & ADVANCED DS (681-709) ═══
  ...SAME(['buildSparseTable'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n log n)')),
  ...SAME(['rmqSparseTable', 'rangeGCDSparse'], _('O(1)', 'O(1)', 'O(1)', 'O(n log n)')),
  ...SAME(['mosOffline', 'mosWithUpdates'], _('O((n+q)√n)', 'O((n+q)√n)', 'O((n+q)√n)', 'O(√n)')),
  ...SAME(['blockDecompSum'], _('O(√n)', 'O(√n)', 'O(√n)', 'O(√n)')),
  ...SAME(['heavyLightDecomp'], _('O(log² n)', 'O(log² n)', 'O(log² n)', 'O(n)')),

  // ═══ DIVIDE & CONQUER (710-717) ═══
  ...SAME(['masterTheorem'], _('O(1)', 'O(1)', 'O(1)', 'O(1)')),
  ...SAME(['karatsubaMult'], _('O(n^1.58)', 'O(n^1.58)', 'O(n^1.58)', 'O(n)')),
  ...SAME(['closestPairPoints'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
  ...SAME(['inversionCountMerge'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),

  // ═══ MISCELLANEOUS (718-738) ═══
  ...SAME(['meetInMiddleSubset'], _('O(2^(n/2))', 'O(2^(n/2))', 'O(2^(n/2))', 'O(2^(n/2))')),
  ...SAME(['bidirectionalBFS'], _('O(V+E)', 'O(V+E)', 'O(V+E)', 'O(V)')),
  ...SAME(['mergeKSortedArrays', 'smallestRangeKWay'], _('O(n log k)', 'O(n log k)', 'O(n log k)', 'O(k)')),
  ...SAME(['reservoirSampleList', 'reservoirSampleStream'], _('O(n)', 'O(n)', 'O(n)', 'O(k)')),
  ...SAME(['fisherYatesShuffle'], _('O(n)', 'O(n)', 'O(n)', 'O(1)')),
  ...SAME(['coordEvents', 'sweepLineEvents'], _('O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)')),
}

export function getComplexity(patternId) {
  return TIME_COMPLEXITY[patternId] || _('—', '—', '—', '—')
}

export default TIME_COMPLEXITY
