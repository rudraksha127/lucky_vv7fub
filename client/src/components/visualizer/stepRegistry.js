/**
 * stepRegistry.js — Maps every pattern ID to its step generator function.
 *
 * Generator signature: (input) => steps[]
 *   - input: parsed value from the input field (auto-parsed by visualizer type)
 *   - returns: array of step objects matching STEP_TYPES
 */

// ─── Import all category generators ─────────────────────────
import * as arraysSteps from './arraysSteps'
import * as treesSteps from './treesSteps'
import * as graphsSteps from './graphsSteps'
import * as stringsSteps from './stringsSteps'
import * as linkedListSteps from './linkedListSteps'
import * as stacksSteps from './stacksSteps'
import * as recursionSteps from './recursionSteps'
import * as sortingSearchingSteps from './sortingSearchingSteps'
import * as hashingSteps from './hashingSteps'
import * as heapSteps from './heapSteps'
import * as dpSteps from './dpSteps'
import * as greedySteps from './greedySteps'
import * as bitManipSteps from './bitManipSteps'
import * as mathSteps from './mathSteps'
import * as trieSteps from './trieSteps'
import * as dsuSteps from './dsuSteps'
import * as segmentAdvSteps from './segmentAdvSteps'
import * as divideConquerSteps from './divideConquerSteps'
import * as miscSteps from './miscSteps'

// ─── The registry ───────────────────────────────────────────
const REGISTRY = {}

function register(patternId, generatorFn) {
  REGISTRY[patternId] = generatorFn
}

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 1: ARRAYS  (1–106)
// ═══════════════════════════════════════════════════════════════

// Prefix Sum / Difference Array
register('1dPrefixSum',             (i) => arraysSteps.generatePrefixSumSteps(i))
register('2dPrefixSum',             (i) => arraysSteps.generatePrefixSumSteps(i))
register('suffixSum',               (i) => arraysSteps.generateSuffixSumSteps(i))
register('prefixXor',               (i) => arraysSteps.generatePrefixSumSteps(i))
register('prefixProduct',           (i) => arraysSteps.generatePrefixSumSteps(i))
register('differenceArray',         (i) => arraysSteps.generateDifferenceArraySteps(i))
register('runningSum',              (i) => arraysSteps.generateRunningSumSteps(i))

// Two Pointer
register('oppositeTwoPointer',      (i) => arraysSteps.generateOppositeTwoPointerSteps(i))
register('sameDirectionPointer',    (i) => arraysSteps.generateOppositeTwoPointerSteps(i))
register('threeSum',                (i) => arraysSteps.generateThreeSumSteps(i))
register('fourSum',                 (i) => arraysSteps.generateThreeSumSteps(i))
register('containerMostWater',      (i) => arraysSteps.generateContainerMostWaterSteps(i))
register('trappingRainWater2Ptr',   (i) => arraysSteps.generateTrappingRainWater2PtrSteps(i))
register('removeDuplicatesInplace', (i) => arraysSteps.generateRemoveDuplicatesInplaceSteps(i))
register('mergeSortedInplace',      (i) => arraysSteps.generateOppositeTwoPointerSteps(i))

// Sliding Window
register('fixedSlidingWindow',      (i) => arraysSteps.generateFixedSlidingWindowSteps(i))
register('variableLongest',         (i) => arraysSteps.generateVariableLongestWindowSteps(i))
register('variableShortest',        (i) => arraysSteps.generateVariableShortestWindowSteps(i))
register('slidingWindowFreq',       (i) => arraysSteps.generateFixedSlidingWindowSteps(i))
register('slidingWindowDeque',      (i) => arraysSteps.generateFixedSlidingWindowSteps(i))

// Kadane
register('maxSubarraySum',          (i) => arraysSteps.generateMaxSubarraySumSteps(i))
register('maxSubarrayProduct',      (i) => arraysSteps.generateMaxSubarrayProductSteps(i))
register('maxCircularSubarray',     (i) => arraysSteps.generateMaxSubarraySumSteps(i))
register('minSubarraySum',          (i) => arraysSteps.generateMaxSubarraySumSteps(i))

// Dutch National Flag
register('threeWayPartition',       (i) => arraysSteps.generateThreeWayPartitionSteps(i))
register('segregateEvenOdd',        (i) => arraysSteps.generateSegregateEvenOddSteps(i))
register('segregatePosNeg',         (i) => arraysSteps.generateSegregateEvenOddSteps(i))
register('segregateCustom',         (i) => arraysSteps.generateThreeWayPartitionSteps(i))

// Sorting-based
register('customComparator',        (i) => arraysSteps.generateWiggleSortSteps(i))
register('sortByFrequency',         (i) => arraysSteps.generateWiggleSortSteps(i))
register('sortMultiKey',            (i) => arraysSteps.generateWiggleSortSteps(i))
register('wiggleSort',              (i) => arraysSteps.generateWiggleSortSteps(i))
register('pancakeSort',             (i) => arraysSteps.generatePancakeSortSteps(i))
register('sortColors',              (i) => arraysSteps.generateSortColorsSteps(i))

// Binary Search on Answer
register('minimizeMax',             (i) => arraysSteps.generateBookAllocationSteps(i))
register('maximizeMin',             (i) => arraysSteps.generateBookAllocationSteps(i))
register('kthMissingPositive',      (i) => arraysSteps.generateBookAllocationSteps(i))
register('shipPackages',            (i) => arraysSteps.generateBookAllocationSteps(i))
register('splitArrayLargest',       (i) => arraysSteps.generateBookAllocationSteps(i))
register('bookAllocation',          (i) => arraysSteps.generateBookAllocationSteps(i))
register('aggressiveCows',          (i) => arraysSteps.generateBookAllocationSteps(i))

// Matrix / 2D Array
register('rowColTraversal',         (i) => arraysSteps.generatePrefixSumSteps(i))
register('transpose',               (i) => arraysSteps.generatePrefixSumSteps(i))
register('rotateMatrix',            (i) => arraysSteps.generatePrefixSumSteps(i))
register('searchSortedMatrix',      (i) => arraysSteps.generatePrefixSumSteps(i))
register('setMatrixZeroes',         (i) => arraysSteps.generatePrefixSumSteps(i))
register('pascalTriangle',          (i) => arraysSteps.generatePrefixSumSteps(i))

// Spiral / Diagonal
register('spiralOrder',             (i) => arraysSteps.generatePrefixSumSteps(i))
register('diagonalTraversal',       (i) => arraysSteps.generatePrefixSumSteps(i))
register('antiDiagonal',            (i) => arraysSteps.generatePrefixSumSteps(i))
register('layerTraversal',          (i) => arraysSteps.generatePrefixSumSteps(i))

// Array Rotation
register('leftRotation',            (i) => arraysSteps.generateLeftRotationSteps(i))
register('rightRotation',           (i) => arraysSteps.generateLeftRotationSteps(i))
register('blockReverse',            (i) => arraysSteps.generateBlockReverseSteps(i))
register('jugglingAlgo',            (i) => arraysSteps.generateBlockReverseSteps(i))
register('cyclicReplacement',       (i) => arraysSteps.generateBlockReverseSteps(i))

// Merge Intervals
register('mergeOverlapping',        (i) => arraysSteps.generateMergeIntervalsSteps(i))
register('insertInterval',          (i) => arraysSteps.generateMergeIntervalsSteps(i))
register('nonOverlapping',          (i) => arraysSteps.generateMergeIntervalsSteps(i))
register('intervalIntersection',    (i) => arraysSteps.generateMergeIntervalsSteps(i))
register('employeeFreeTime',        (i) => arraysSteps.generateMergeIntervalsSteps(i))

// Rearrangement
register('alternatePosNeg',         (i) => arraysSteps.generateMoveZerosToEndSteps(i))
register('moveZerosEnd',            (i) => arraysSteps.generateMoveZerosToEndSteps(i))
register('rearrangeBySign',         (i) => arraysSteps.generateMoveZerosToEndSteps(i))
register('shuffleInterleave',       (i) => arraysSteps.generateMoveZerosToEndSteps(i))

// In-place Manipulation
register('inplaceReversal',         (i) => arraysSteps.generateOppositeTwoPointerSteps(i))
register('removeElementInplace',    (i) => arraysSteps.generateRemoveDuplicatesInplaceSteps(i))
register('dedupSortedInplace',      (i) => arraysSteps.generateRemoveDuplicatesInplaceSteps(i))
register('dedupUnsortedInplace',    (i) => arraysSteps.generateRemoveDuplicatesInplaceSteps(i))

// Moore's Voting
register('majorityN2',              (i) => arraysSteps.generateMajorityElementN2Steps(i))
register('majorityN3',              (i) => arraysSteps.generateMajorityElementN2Steps(i))
register('kMajority',               (i) => arraysSteps.generateMajorityElementN2Steps(i))

// Stock Buy-Sell
register('stock1Transaction',       (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockUnlimited',          (i) => arraysSteps.generateStockUnlimitedSteps(i))
register('stockKTransactions',      (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockAtMostK',            (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockCooldown',           (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockWithFee',            (i) => arraysSteps.generateStock1TransactionSteps(i))

// Subarray Problems
register('countSubarraySumK',       (i) => arraysSteps.generateCountSubarraySumKSteps(i))
register('longestSubarraySumK',     (i) => arraysSteps.generateCountSubarraySumKSteps(i))
register('subarrayEqual01',         (i) => arraysSteps.generateCountSubarraySumKSteps(i))
register('smallestSubarraySumS',    (i) => arraysSteps.generateCountSubarraySumKSteps(i))
register('productExceptSelf',       (i) => arraysSteps.generateProductExceptSelfSteps(i))
register('maxProductSubarray',      (i) => arraysSteps.generateMaxSubarrayProductSteps(i))
register('countSubarrayProductK',   (i) => arraysSteps.generateCountSubarraySumKSteps(i))

// Monotonic Stack
register('nextGreaterElement',      (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('nextSmallerElement',      (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('prevGreaterElement',      (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('prevSmallerElement',      (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('largestRectangleHistogram', (i) => arraysSteps.generateLargestRectangleHistogramSteps(i))
register('trappingRainStack',       (i) => arraysSteps.generateLargestRectangleHistogramSteps(i))
register('sumSubarrayMins',         (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('sumSubarrayMaxs',         (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('maxWidthRamp',            (i) => arraysSteps.generateNextGreaterElementSteps(i))

// Cyclic Sort
register('findMissingNumber',       (i) => arraysSteps.generateCyclicSortSteps(i))
register('findDuplicateNumber',     (i) => arraysSteps.generateCyclicSortSteps(i))
register('findAllMissing',          (i) => arraysSteps.generateCyclicSortSteps(i))
register('findAllDuplicates',       (i) => arraysSteps.generateCyclicSortSteps(i))
register('firstMissingPositive',    (i) => arraysSteps.generateFirstMissingPositiveSteps(i))

// Contribution Technique
register('sumSubarrayMinsContrib',  (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('sumSubarrayMaxsContrib',  (i) => arraysSteps.generateNextGreaterElementSteps(i))
register('sumSubarrayRanges',       (i) => arraysSteps.generateNextGreaterElementSteps(i))

// Sweep Line
register('countEvents',             (i) => arraysSteps.generateIntervalSchedulingSteps(i))
register('unionRectangles',         (i) => arraysSteps.generateIntervalSchedulingSteps(i))
register('intervalScheduling',      (i) => arraysSteps.generateIntervalSchedulingSteps(i))
register('coveredPoints',           (i) => arraysSteps.generateIntervalSchedulingSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 2: STRINGS  (107–170)
// ═══════════════════════════════════════════════════════════════

// KMP
register('kmpSearch',              (i) => stringsSteps.generateKMPSearchSteps(i, ''))
register('lpsArray',               (i) => stringsSteps.generateLPSArraySteps(i))
register('countPatternKMP',        (i) => stringsSteps.generateKMPSearchSteps(i, ''))
register('repeatedStringMatch',    (i) => stringsSteps.generateKMPSearchSteps(i, ''))
register('shortestPalindromeKMP',  (i) => stringsSteps.generateKMPSearchSteps(i, ''))

// Rabin-Karp
register('rkSinglePattern',        (i) => stringsSteps.generateRKSinglePatternSteps(i, ''))
register('rkMultiPattern',         (i) => stringsSteps.generateRKSinglePatternSteps(i, ''))
register('repeatedDna',            (i) => stringsSteps.generateRepeatedDNASteps(i))
register('longestDuplicateSubstr', (i) => stringsSteps.generateBuildSuffixArraySteps(i))

// Z-Algorithm
register('zPatternMatch',          (i) => stringsSteps.generateLPSArraySteps(i))
register('zCountOccurrences',      (i) => stringsSteps.generateLPSArraySteps(i))
register('zConcatTrick',           (i) => stringsSteps.generateLPSArraySteps(i))

// Anagram / Permutation
register('checkAnagram',           (i) => stringsSteps.generateCheckAnagramSteps(i, ''))
register('groupAnagrams',          (i) => stringsSteps.generateGroupAnagramsSteps(i))
register('findAnagramPositions',   (i) => stringsSteps.generateCheckAnagramSteps(i, ''))
register('minWindowAnagram',       (i) => stringsSteps.generateCheckAnagramSteps(i, ''))

// Palindrome
register('checkPalindrome',        (i) => stringsSteps.generatePalindromeCheckSteps(i))
register('longestPalSubstrExpand', (i) => stringsSteps.generateLongestPalSubstrExpandSteps(i))
register('countPalSubstrings',     (i) => stringsSteps.generateLongestPalSubstrExpandSteps(i))
register('validPalindrome2',       (i) => stringsSteps.generatePalindromeCheckSteps(i))
register('palindromePairs',        (i) => stringsSteps.generateGroupAnagramsSteps(i))

// Manacher
register('manacherLongest',        (i) => stringsSteps.generateLongestPalSubstrExpandSteps(i))
register('manacherCount',          (i) => stringsSteps.generateLongestPalSubstrExpandSteps(i))

// String Hashing
register('polyHash',               (i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('doubleHash',             (i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('hashEqualSubstrings',    (i) => stringsSteps.generateBuildSuffixArraySteps(i))

// String Compression
register('runLengthEncode',        (i) => stringsSteps.generateRunLengthEncodingSteps(i))
register('decodeEncode',           (i) => stacksSteps.generateDecodeKEncodedSteps ? stacksSteps.generateDecodeKEncodedSteps(i) : stringsSteps.generateRunLengthEncodingSteps(i))
register('compressInplace',        (i) => stringsSteps.generateRunLengthEncodingSteps(i))

// Parentheses
register('validParens',            (i) => stringsSteps.generateValidParenthesesSteps(i))
register('minAddValid',            (i) => stringsSteps.generateValidParenthesesSteps(i))
register('longestValidParens',     (i) => stringsSteps.generateValidParenthesesSteps(i))
register('removeInvalidParens',    (i) => stringsSteps.generateValidParenthesesSteps(i))
register('scoreOfParens',          (i) => stringsSteps.generateValidParenthesesSteps(i))

// LCS
register('lcs',                    (i) => stringsSteps.generateLCSSteps(i, ''))
register('printLCS',               (i) => stringsSteps.generateLCSSteps(i, ''))
register('longestCommonSubstr',    (i) => stringsSteps.generateLCSSteps(i, ''))
register('shortestCommonSupersequence', (i) => stringsSteps.generateLCSSteps(i, ''))

// Edit Distance
register('minEditDistance',        (i) => stringsSteps.generateMinEditDistanceSteps(i, ''))
register('oneEditDistance',        (i) => stringsSteps.generateMinEditDistanceSteps(i, ''))
register('deleteTwoStrings',       (i) => stringsSteps.generateMinEditDistanceSteps(i, ''))
register('minAsciiDelete',         (i) => stringsSteps.generateMinEditDistanceSteps(i, ''))

// Trie-based String (via stringsSteps — generateGroupAnagramsSteps as fallback)
register('wordSearch2',            (i) => trieSteps.generateTrieInsertSteps(i))
register('replaceWords',           (i) => stringsSteps.generateGroupAnagramsSteps(i))
register('autocompleteSystem',     (i) => trieSteps.generateTrieInsertSteps(i))

// Suffix Array
register('buildSuffixArray',       (i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('lcpArray',               (i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('longestRepeatedSubstr',  (i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('countDistinctSubstr',    (i) => stringsSteps.generateBuildSuffixArraySteps(i))

// String Rotation / Isomorphism
register('rotationCheck',          (i) => stringsSteps.generateCheckAnagramSteps(i, ''))
register('isomorphic',             (i) => stringsSteps.generateCheckAnagramSteps(i, ''))
register('wordPattern',            (i) => stringsSteps.generateGroupAnagramsSteps(i))
register('repeatedSubstrPattern',  (i) => stringsSteps.generateBuildSuffixArraySteps(i))

// Lexicographic
register('kthPermutation',         (i) => arraysSteps.generateWiggleSortSteps(i))
register('smallestStringSwaps',    (i) => arraysSteps.generateProductExceptSelfSteps(i))
register('alienDictionary',        (i) => stringsSteps.generateAlienDictionaryOrderSteps(i))
register('largestNumber',          (i) => arraysSteps.generateWiggleSortSteps(i))

// Wildcard / Regex
register('wildcardMatch',          (i) => stringsSteps.generateWildcardMatchSteps(i, ''))
register('regexMatch',             (i) => stringsSteps.generateWildcardMatchSteps(i, ''))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 3: LINKED LIST  (171–196)
// ═══════════════════════════════════════════════════════════════

// Fast & Slow Pointer
register('detectCycle',            (i) => linkedListSteps.generateDetectCycleSteps(i))
register('findCycleStart',         (i) => linkedListSteps.generateDetectCycleSteps(i))
register('findMiddleLL',           (i) => linkedListSteps.generateFindMiddleLLSteps(i))
register('happyNumber',            (i) => linkedListSteps.generateDetectCycleSteps([i]))
register('palindromeLL',           (i) => linkedListSteps.generatePalindromeLLSteps(i))
register('reorderListLL',          (i) => linkedListSteps.generateFindMiddleLLSteps(i))

// Reversal
register('reverseEntireLL',        (i) => linkedListSteps.generateReverseEntireLLSteps(i))
register('reverseKGroup',          (i) => linkedListSteps.generateReverseKGroupSteps(i))
register('reverseBetween',         (i) => linkedListSteps.generateReverseEntireLLSteps(i))
register('reverseAlternateK',      (i) => linkedListSteps.generateReverseKGroupSteps(i))

// Merge Sorted Lists
register('mergeTwoSortedLL',       (i) => linkedListSteps.generateMergeTwoSortedLLSteps(i, []))
register('mergeKSortedHeap',       (i) => linkedListSteps.generateMergeTwoSortedLLSteps(i, []))
register('mergeKSortedDC',         (i) => linkedListSteps.generateMergeTwoSortedLLSteps(i, []))

// Two Pointer on LL
register('nthFromEnd',             (i) => linkedListSteps.generateNthFromEndSteps(i))
register('removeNthFromEnd',       (i) => linkedListSteps.generateNthFromEndSteps(i))
register('findMiddleForSort',      (i) => linkedListSteps.generateFindMiddleLLSteps(i))

// Intersection
register('intersectionTwoPointer', (i) => linkedListSteps.generateMergeTwoSortedLLSteps(i, []))
register('intersectionHashSet',    (i) => linkedListSteps.generateMergeTwoSortedLLSteps(i, []))

// Clone with Random Pointer
register('cloneHashMap',           (i) => linkedListSteps.generateReverseEntireLLSteps(i))
register('cloneInplaceWeave',      (i) => linkedListSteps.generateReverseEntireLLSteps(i))

// LRU Cache
register('lruCacheDL',             (i) => linkedListSteps.generateReverseEntireLLSteps(i))

// Flatten Multi-level
register('flattenDoublyLL',        (i) => linkedListSteps.generateReverseEntireLLSteps(i))
register('flattenNestedLL',        (i) => linkedListSteps.generateReverseEntireLLSteps(i))

// Sort Linked List
register('mergeSortLL',            (i) => linkedListSteps.generateMergeSortLLSteps(i))
register('insertionSortLL',        (i) => linkedListSteps.generateMergeSortLLSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 4: STACKS  (197–220)
// ═══════════════════════════════════════════════════════════════

// Monotonic Stack
register('nextGreater1',           (i) => stacksSteps.generateNextGreater1Steps(i, []))
register('nextGreater2',           (i) => stacksSteps.generateNextGreater2Steps(i))
register('largestRectHist',        (i) => stacksSteps.generateLargestRectHistSteps(i))
register('trappingRainStack2',     (i) => stacksSteps.generateLargestRectHistSteps(i))
register('sumSubarrayMinMax',      (i) => stacksSteps.generateLargestRectHistSteps(i))
register('maxWidthRamp2',          (i) => stacksSteps.generateLargestRectHistSteps(i))

// Expression Evaluation
register('infixToPostfix',         (i) => stacksSteps.generateInfixToPostfixSteps(i))
register('postfixEval',            (i) => stacksSteps.generatePostfixEvalSteps(i))
register('infixToPrefix',          (i) => stacksSteps.generateInfixToPostfixSteps(i))
register('basicCalc1',             (i) => stacksSteps.generateBasicCalc1Steps(i))
register('basicCalc2',             (i) => stacksSteps.generateBasicCalc1Steps(i))
register('basicCalc3',             (i) => stacksSteps.generateInfixToPostfixSteps(i))

// Balanced Parentheses
register('validParensCheck',       (i) => stacksSteps.generateValidParenthesesSteps(i))
register('minRemoveValid',         (i) => stacksSteps.generateValidParenthesesSteps(i))
register('longestValidParenSubstr',(i) => stacksSteps.generateValidParenthesesSteps(i))

// Min / Max Stack
register('minStack',               (i) => stacksSteps.generateMinStackSteps(i))
register('maxStack',               (i) => stacksSteps.generateMinStackSteps(i))
register('minMaxDeleteStack',      (i) => stacksSteps.generateMinStackSteps(i))

// Decode Strings
register('decodeKEncoded',         (i) => stacksSteps.generateDecodeKEncodedSteps(i))
register('nestedDecoding',         (i) => stacksSteps.generateDecodeKEncodedSteps(i))

// Daily Temperatures / Span
register('stockSpan',              (i) => stacksSteps.generateStockSpanSteps(i))
register('dailyTemps2',            (i) => stacksSteps.generateDailyTempsSteps(i))
register('onlineStockSpan',        (i) => stacksSteps.generateStockSpanSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 5: QUEUES  (221–225)
// ═══════════════════════════════════════════════════════════════

register('windowMaxK',             (i) => arraysSteps.generateFixedSlidingWindowSteps(i))
register('windowMinK',             (i) => arraysSteps.generateFixedSlidingWindowSteps(i))
register('implCircularQueue',      (i) => stacksSteps.generateMinStackSteps(i))
register('implCircularDeque',      (i) => stacksSteps.generateMinStackSteps(i))
register('firstNonRepeatQueue',    (i) => stringsSteps.generateValidParenthesesSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 6: RECURSION & BACKTRACKING  (226–251)
// ═══════════════════════════════════════════════════════════════

// Subsets
register('allSubsets',             (i) => recursionSteps.generateAllSubsetsSteps(i))
register('subsetsWithDups',        (i) => recursionSteps.generateSubsetsWithDupsSteps(i))
register('subsetGivenSum',         (i) => recursionSteps.generateAllSubsetsSteps(i))
register('beautifulSubsets',       (i) => recursionSteps.generateAllSubsetsSteps(i))

// Permutations
register('allPermutations',        (i) => recursionSteps.generateAllPermutationsSteps(i))
register('permutationsWithDups',   (i) => recursionSteps.generateAllPermutationsSteps(i))
register('nextPermutation',        (i) => arraysSteps.generateWiggleSortSteps(i))
register('prevPermutation',        (i) => arraysSteps.generateWiggleSortSteps(i))
register('kthPermutation2',        (i) => recursionSteps.generateAllPermutationsSteps(i))

// Combinations
register('combinationsNCR',        (i) => recursionSteps.generateCombinationsNCRSteps(i, 2))
register('comboSumUnlimited',      (i) => recursionSteps.generateComboSumUnlimitedSteps(i, 7))
register('comboSumUnique',         (i) => recursionSteps.generateComboSumUnlimitedSteps(i, 7))
register('comboSumExactK',         (i) => recursionSteps.generateCombinationsNCRSteps(i, 3))
register('letterCombos',           (i) => recursionSteps.generateAllPermutationsSteps(i))

// N-Queens
register('nQueensAll',             (i) => recursionSteps.generateNQueensSteps(i))
register('nQueensCount',           (i) => recursionSteps.generateNQueensSteps(i))

// Sudoku
register('solveSudoku',            (i) => recursionSteps.generateNQueensSteps(i))
register('validSudoku',            (i) => recursionSteps.generateNQueensSteps(i))

// Grid Path
register('ratInMaze',              (i) => recursionSteps.generateRatInMazeSteps(i))
register('wordSearch',             (i) => recursionSteps.generateWordSearchSteps(i, ''))
register('knightsTour',            (i) => recursionSteps.generateRatInMazeSteps(i))
register('uniquePathsObstaclesBT', (i) => recursionSteps.generateRatInMazeSteps(i))

// Palindrome Partitioning
register('allPalPartitions',       (i) => recursionSteps.generateAllPalPartitionsSteps(i))
register('minCutsDP',              (i) => recursionSteps.generateAllPalPartitionsSteps(i))

// Expression Operators
register('addOpsToTarget',         (i) => recursionSteps.generateAllPalPartitionsSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 7: SORTING & SEARCHING  (252–283)
// ═══════════════════════════════════════════════════════════════

// Binary Search Classic
register('stdBinarySearch',        (i) => sortingSearchingSteps.generateStdBinarySearchSteps(i))
register('firstOccurrence',        (i) => sortingSearchingSteps.generateFirstOccurrenceSteps(i))
register('lastOccurrence',         (i) => sortingSearchingSteps.generateLastOccurrenceSteps(i))
register('countOccurrences',       (i) => sortingSearchingSteps.generateLastOccurrenceSteps(i))
register('floorCeiling',           (i) => sortingSearchingSteps.generateLowerBoundSteps(i))
register('sqrtInt',                (i) => sortingSearchingSteps.generateStdBinarySearchSteps(Array.from({length:20},(_,k)=>k), 5))
register('findPeakElement',        (i) => sortingSearchingSteps.generateFindPeakElementSteps(i))

// Rotated Array
register('searchRotated',          (i) => sortingSearchingSteps.generateSearchRotatedSteps(i))
register('minRotated',             (i) => sortingSearchingSteps.generateMinRotatedSteps(i))
register('searchRotatedDups',      (i) => sortingSearchingSteps.generateSearchRotatedSteps(i))

// Lower / Upper Bound
register('lowerBound',             (i) => sortingSearchingSteps.generateLowerBoundSteps(i))
register('upperBound',             (i) => sortingSearchingSteps.generateUpperBoundSteps(i))
register('countRange',             (i) => sortingSearchingSteps.generateLowerBoundSteps(i))

// Search 2D
register('searchFullSorted',       (i) => sortingSearchingSteps.generateStdBinarySearchSteps([1,3,5,7,10,11,16,20,23,30,34,60]))
register('searchRowColSorted',     (i) => sortingSearchingSteps.generateStdBinarySearchSteps([1,4,7,11,2,5,8,12,3,6,9,16]))
register('binarySearchRows',       (i) => sortingSearchingSteps.generateStdBinarySearchSteps([1,3,5,7,10,11,16,20,23,30,34,60]))

// Merge Sort
register('mergeSort2',             (i) => sortingSearchingSteps.generateMergeSort2Steps(i))
register('countInversions',        (i) => sortingSearchingSteps.generateCountInversionsSteps(i))
register('mergeSortLL2',           (i) => linkedListSteps.generateMergeSortLLSteps(i))

// Quick Sort
register('stdQuickSort',           (i) => sortingSearchingSteps.generateStdQuickSortSteps(i))
register('randomizedQuickSort',    (i) => sortingSearchingSteps.generateStdQuickSortSteps(i))
register('threeWayQuickSort',      (i) => sortingSearchingSteps.generateStdQuickSortSteps(i))
register('quickSelect',            (i) => sortingSearchingSteps.generateQuickSelectSteps(i))

// Counting / Radix / Bucket Sort
register('countingSort',           (i) => sortingSearchingSteps.generateCountingSortSteps(i))
register('radixSortLSD',           (i) => sortingSearchingSteps.generateRadixSortLSDSteps(i))
register('bucketSort',             (i) => sortingSearchingSteps.generateCountingSortSteps(i))

// Order Statistics
register('kthLargestQS',           (i) => sortingSearchingSteps.generateKthLargestQSSteps(i))
register('kthSmallest',            (i) => sortingSearchingSteps.generateKthSmallestSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 8: HASHING  (284–303)
// ═══════════════════════════════════════════════════════════════

register('charFreq',               (i) => hashingSteps.generateCharFreqSteps(i))
register('wordFreq',               (i) => hashingSteps.generateWordFreqSteps(i))
register('countPairsCondition',    (i) => hashingSteps.generateTwoSumHashSteps(i))
register('twoSumHash',             (i) => hashingSteps.generateTwoSumHashSteps(i))
register('fourSumHash',            (i) => hashingSteps.generateTwoSumHashSteps(i))
register('subarrayZeroSum',        (i) => hashingSteps.generateSubarraySumKSteps(i))
register('twoSumClassic',          (i) => hashingSteps.generateTwoSumHashSteps(i))
register('subarraySumK',           (i) => hashingSteps.generateSubarraySumKSteps(i))
register('countSubarraysK',        (i) => hashingSteps.generateSubarraySumKSteps(i))
register('longestSubarrayK',       (i) => hashingSteps.generateSubarraySumKSteps(i))
register('countSubarraysXOR',      (i) => hashingSteps.generateSubarraySumKSteps(i))
register('longestConsecutiveHashSet', (i) => hashingSteps.generateLongestConsecutiveHashSetSteps(i))
register('longestConsecutiveHashMap', (i) => hashingSteps.generateLongestConsecutiveHashSetSteps(i))
register('rkPatternMatch',         (i) => stringsSteps.generateRKSinglePatternSteps(i, ''))
register('repeatedDna2',           (i) => stringsSteps.generateRepeatedDNASteps(i))
register('longestDuplicateSubstr2',(i) => stringsSteps.generateBuildSuffixArraySteps(i))
register('coordCompress1D',        (i) => hashingSteps.generateCoordCompress1DSteps(i))
register('coordCompress2D',        (i) => hashingSteps.generateCoordCompress1DSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 9: TREES  (304–370)
// ═══════════════════════════════════════════════════════════════

// DFS Traversals
register('inorderRecursive',       (i) => treesSteps.generateInorderSteps(i))
register('inorderIterative',       (i) => treesSteps.generateInorderSteps(i))
register('preorderRecursive',      (i) => treesSteps.generatePreorderSteps(i))
register('preorderIterative',      (i) => treesSteps.generatePreorderSteps(i))
register('postorderRecursive',     (i) => treesSteps.generatePostorderSteps(i))
register('postorderIterative',     (i) => treesSteps.generatePostorderSteps(i))

// BFS / Level Order
register('levelOrderStd',          (i) => treesSteps.generateLevelOrderSteps(i))
register('levelAverages',          (i) => treesSteps.generateLevelOrderSteps(i))
register('levelSums',              (i) => treesSteps.generateLevelOrderSteps(i))
register('zigzagLevelOrder',       (i) => treesSteps.generateZigzagLevelOrderSteps(i))
register('leftSideView',           (i) => treesSteps.generateLevelOrderSteps(i))
register('rightSideView',          (i) => treesSteps.generateRightSideViewSteps(i))

// Morris Traversal
register('morrisInorder',          (i) => treesSteps.generateInorderSteps(i))
register('morrisPreorder',         (i) => treesSteps.generatePreorderSteps(i))

// Diameter / Height / Width
register('heightOfTree',           (i) => treesSteps.generateHeightSteps(i))
register('diameterOfTree',         (i) => treesSteps.generateDiameterSteps(i))
register('maxWidthTree',           (i) => treesSteps.generateHeightSteps(i))
register('minDepthTree',           (i) => treesSteps.generateHeightSteps(i))

// LCA
register('lcaBinaryTree',          (i) => treesSteps.generateLCASteps(i, 5, 1))
register('lcaBST',                 (i) => treesSteps.generateLCASteps(i, 5, 1))
register('lcaParentPtrs',          (i) => treesSteps.generateLCASteps(i, 5, 1))
register('lcaBinaryLifting',       (i) => treesSteps.generateLCASteps(i, 5, 1))

// Root to Node Path
register('printRootToNode',        (i) => treesSteps.generatePathSumSteps(i, 22))
register('pathSumHasPath',         (i) => treesSteps.generatePathSumSteps(i, 22))
register('allPathsTarget',         (i) => treesSteps.generatePathSumSteps(i, 22))
register('pathSumPrefix',          (i) => treesSteps.generatePathSumSteps(i, 22))

// Maximum Path Sum
register('maxPathRootToLeaf',      (i) => treesSteps.generateHeightSteps(i))
register('maxPathAnyToAny',        (i) => treesSteps.generateDiameterSteps(i))

// Serialize / Deserialize
register('serializeBFS',           (i) => treesSteps.generateLevelOrderSteps(i))
register('serializeDFS',           (i) => treesSteps.generatePreorderSteps(i))

// Tree Views
register('topView',                (i) => treesSteps.generateTopViewSteps(i))
register('bottomView',             (i) => treesSteps.generateBottomViewSteps(i))
register('leftView',               (i) => treesSteps.generateTopViewSteps(i))
register('rightView',              (i) => treesSteps.generateRightSideViewSteps(i))
register('verticalOrder',          (i) => treesSteps.generateVerticalOrderSteps(i))

// BST Insert / Search / Delete
register('bstInsertRecursive',     (i) => treesSteps.generateBSTInsertSteps(i, 5))
register('bstInsertIterative',     (i) => treesSteps.generateBSTInsertSteps(i, 5))
register('searchBST',              (i) => treesSteps.generateBSTSearchSteps(i, 5))
register('deleteBST',              (i) => treesSteps.generateBSTSearchSteps(i, 7))

// Validate BST
register('validateBSTMinMax',      (i) => treesSteps.generateValidateBSTMinMaxSteps(i))
register('validateBSTInorder',     (i) => treesSteps.generateValidateBSTMinMaxSteps(i))

// Kth in BST
register('kthSmallestBST',         (i) => treesSteps.generateInorderSteps(i))
register('kthLargestBST',          (i) => treesSteps.generateInorderSteps(i))

// Construct Tree from Traversals
register('constructInorderPreorder', (i) => treesSteps.generateLevelOrderSteps(i))
register('constructInorderPostorder',(i) => treesSteps.generateLevelOrderSteps(i))
register('constructLevelOrderBST',   (i) => treesSteps.generateLevelOrderSteps(i))

// BST Iterator
register('bstIteratorStack',       (i) => treesSteps.generateInorderSteps(i))

// Segment Tree (sub)
register('buildSegmentTree',       (i) => treesSteps.generateBuildSegmentTreeSteps(i))
register('segTreePointUpdateRangeSum', (i) => treesSteps.generateBuildSegmentTreeSteps(i))
register('segTreeRangeMinMax',     (i) => treesSteps.generateBuildSegmentTreeSteps(i))
register('segTreeLazyProp',        (i) => treesSteps.generateBuildSegmentTreeSteps(i))

// Fenwick / BIT
register('fenwickPointUpdatePrefixSum', (i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))
register('fenwickRangeUpdatePointQuery',(i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 10: HEAP  (371–387)
// ═══════════════════════════════════════════════════════════════

register('kthLargestMinHeap',      (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('kthSmallestMaxHeap',     (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('kClosestPoints',         (i) => heapSteps.generateKClosestPointsSteps(i))
register('kthLargestStream',       (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('mergeKSortedHeaps',      (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('smallestRangeKLists',    (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('topKFreqElements',       (i) => heapSteps.generateTopKFreqElementsSteps(i))
register('topKFreqWords',          (i) => heapSteps.generateTopKFreqElementsSteps(i))
register('sortCharsByFreq',        (i) => heapSteps.generateTopKFreqElementsSteps(i))
register('medianTwoHeaps',         (i) => heapSteps.generateMedianTwoHeapsSteps(i))
register('slidingWindowMedian',    (i) => heapSteps.generateMedianTwoHeapsSteps(i))
register('cpuScheduling',          (i) => heapSteps.generateTaskSchedulerSteps(i))
register('taskScheduler2',         (i) => heapSteps.generateTaskSchedulerSteps(i))
register('meetingRoomsHeap',       (i) => heapSteps.generateTaskSchedulerSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 11: GRAPHS  (388–453)
// ═══════════════════════════════════════════════════════════════

// BFS
register('shortestPathUnweighted', (i) => graphsSteps.generateShortestPathUnweightedSteps(i))
register('bipartiteBFS',           (i) => graphsSteps.generateBipartiteBFSSteps(i))
register('rottenOranges',          (i) => graphsSteps.generateConnectedComponentsSteps(i))
register('zeroOneMatrix',          (i) => graphsSteps.generateConnectedComponentsSteps(i))

// DFS
register('pathFindingDFS',         (i) => graphsSteps.generateConnectedComponentsSteps(i))
register('connectedComponents',    (i) => graphsSteps.generateConnectedComponentsSteps(i))
register('floodFill',              (i) => graphsSteps.generateConnectedComponentsSteps(i))
register('numIslands',             (i) => graphsSteps.generateConnectedComponentsSteps(i))

// Multi-source BFS
register('multiSourceRotten',      (i) => graphsSteps.generateConnectedComponentsSteps(i))
register('wallsAndGates',          (i) => graphsSteps.generateConnectedComponentsSteps(i))

// Dijkstra
register('dijkstraStd',            (i) => graphsSteps.generateDijkstraSteps(i))
register('dijkstraGrid',           (i) => graphsSteps.generateDijkstraSteps(i))
register('networkDelayTime',       (i) => graphsSteps.generateDijkstraSteps(i))
register('cheapestFlightsK',       (i) => graphsSteps.generateDijkstraSteps(i))

// Bellman-Ford
register('bellmanFordStd',         (i) => graphsSteps.generateKruskalSteps(i))
register('negCycleDetection',      (i) => graphsSteps.generateKruskalSteps(i))

// Kruskal's MST
register('kruskalSortDSU',         (i) => graphsSteps.generateKruskalSteps(i))
register('minCostConnectPoints',   (i) => graphsSteps.generateKruskalSteps(i))

// Topological Sort
register('topoSortDFS',            (i) => graphsSteps.generateKahnTopoSteps(i))
register('kahnTopoSort',           (i) => graphsSteps.generateKahnTopoSteps(i))
register('courseSchedule1',        (i) => graphsSteps.generateKahnTopoSteps(i))
register('courseSchedule2',        (i) => graphsSteps.generateKahnTopoSteps(i))

// Cycle Detection
register('cycleDFS',               (i) => graphsSteps.generateCycleDetectionDFSSteps(i))
register('cycleKahn',              (i) => graphsSteps.generateKahnTopoSteps(i))
register('cycleDSU',               (i) => graphsSteps.generateCycleDetectionDFSSteps(i))

// SCC
register('kosarajuSCC',            (i) => graphsSteps.generateKosarajuSteps(i))
register('tarjanSCC',              (i) => graphsSteps.generateKosarajuSteps(i))

// Bridges & Articulation
register('tarjanBridges',          (i) => graphsSteps.generateKosarajuSteps(i))
register('articulationPoints',     (i) => graphsSteps.generateKosarajuSteps(i))

// Network Flow
register('fordFulkerson',          (i) => graphsSteps.generateKruskalSteps(i))

// Euler / Hamiltonian
register('eulerPath',              (i) => graphsSteps.generateKruskalSteps(i))
register('reconstructItinerary',   (i) => graphsSteps.generateKahnTopoSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 12: DYNAMIC PROGRAMMING  (454–547)
// ═══════════════════════════════════════════════════════════════

// 1D DP
register('fibonacciDP',            (i) => dpSteps.generateFibonacciSteps(i))
register('climbingStairs',         (i) => dpSteps.generateClimbingStairsSteps(i))
register('houseRobber1',           (i) => dpSteps.generateHouseRobber1Steps(i))
register('decodeWays',             (i) => dpSteps.generateFibonacciSteps(i))
register('coinChangeMin',          (i) => dpSteps.generateCoinChangeMinSteps(i, 11))
register('coinChangeWays',         (i) => dpSteps.generateCoinChangeMinSteps(i, 11))
register('frogJumpMinCost',        (i) => dpSteps.generateClimbingStairsSteps(i))

// House Robber Pattern
register('houseRobberCircular',    (i) => dpSteps.generateHouseRobberCircularSteps(i))
register('houseRobberTree',        (i) => treesSteps.generateDiameterSteps(i)) // tree DP approximation

// Grid DP
register('uniquePaths',            (i) => dpSteps.generateUniquePathsSteps(i, 7))
register('uniquePathsObstacles',   (i) => dpSteps.generateMinPathSumSteps(i))
register('minPathSum',             (i) => dpSteps.generateMinPathSumSteps(i))
register('dungeonGame',            (i) => dpSteps.generateMinPathSumSteps(i))
register('triangleMinPath',        (i) => dpSteps.generateMinPathSumSteps(i))
register('goldMine',               (i) => dpSteps.generateMinPathSumSteps(i))

// LCS DP
register('lcs2',                   (i) => dpSteps.generateLCS2Steps(i, ''))
register('printLCS',               (i) => dpSteps.generateLCS2Steps(i, ''))
register('longestCommonSubstr2',   (i) => dpSteps.generateLCS2Steps(i, ''))
register('shortestCommonSuper',    (i) => dpSteps.generateLCS2Steps(i, ''))
register('minInsertDeleteConvert', (i) => dpSteps.generateLCS2Steps(i, ''))

// LIS DP
register('lisOn2',                 (i) => dpSteps.generateLISOn2Steps(i))
register('lisOnLogN',              (i) => dpSteps.generateLISOnLogNSteps(i))
register('numberOfLIS',            (i) => dpSteps.generateLISOn2Steps(i))
register('longestBitonic',         (i) => dpSteps.generateLISOn2Steps(i))

// Palindromic DP
register('longestPalSubseq',       (i) => dpSteps.generateLCS2Steps(i, ''))
register('longestPalSubstrDP',     (i) => dpSteps.generateLCS2Steps(i, ''))
register('countPalSubstrDP',       (i) => dpSteps.generateLCS2Steps(i, ''))
register('minInsertPalindrome',    (i) => dpSteps.generateLCS2Steps(i, ''))

// Edit Distance DP
register('levenshteinDist',        (i) => dpSteps.generateLCS2Steps(i, ''))
register('oneEditDistCheck',       (i) => stringsSteps.generateMinEditDistanceSteps(i, ''))
register('deleteOpsTwoStrings',    (i) => dpSteps.generateLCS2Steps(i, ''))
register('minAsciiDeleteSum',      (i) => dpSteps.generateLCS2Steps(i, ''))

// Interval DP
register('matrixChainMult',        (i) => dpSteps.generateMatrixChainMultSteps(i))
register('booleanParenthesization',(i) => dpSteps.generateMatrixChainMultSteps(i))
register('burstBalloons',          (i) => dpSteps.generateBurstBalloonsSteps(i))
register('minCostCutStick',        (i) => dpSteps.generateMatrixChainMultSteps(i))
register('optimalBST',             (i) => dpSteps.generateMatrixChainMultSteps(i))

// 0/1 Knapsack
register('knapsack01Std',          (i) => dpSteps.generateKnapsack01StdSteps(i, [], 6))
register('subsetSum',              (i) => dpSteps.generateSubsetSumSteps(i))
register('equalPartitionSum',      (i) => dpSteps.generateSubsetSumSteps(i))
register('countSubsetsSumK',       (i) => dpSteps.generateSubsetSumSteps(i))
register('minSubsetDiff',          (i) => dpSteps.generateSubsetSumSteps(i))
register('targetSumAssign',        (i) => dpSteps.generateTargetSumAssignSteps(i))

// Unbounded Knapsack
register('unboundedKnapsack',      (i) => dpSteps.generateKnapsack01StdSteps(i, [], 100))
register('rodCutting',             (i) => dpSteps.generateKnapsack01StdSteps(i, [], 8))
register('integerBreak',           (i) => dpSteps.generateClimbingStairsSteps(i))
register('perfectSquares',         (i) => dpSteps.generateClimbingStairsSteps(i))

// DP on Trees
register('treeDiameterDP',         (i) => treesSteps.generateDiameterSteps(i))
register('maxIndependentSetTree',  (i) => treesSteps.generateHeightSteps(i))
register('binaryTreeCameras',      (i) => treesSteps.generateDiameterSteps(i)) // tree DP approximation

// Bitmask DP
register('travellingSalesman',     (i) => graphsSteps.generateDijkstraSteps(i))
register('minCostVisitAllNodes',   (i) => graphsSteps.generateDijkstraSteps(i))
register('matchingBitmask',        (i) => arraysSteps.generateWiggleSortSteps(i))

// Digit DP
register('countNumbersRange',      (i) => arraysSteps.generatePrefixSumSteps(i))
register('numbersNoConsecutive1s', (i) => arraysSteps.generatePrefixSumSteps(i))
register('digitSumEqualsK',        (i) => arraysSteps.generatePrefixSumSteps(i))

// Stock State Machine DP
register('stock1TransactionSM',    (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockUnlimitedSM',       (i) => arraysSteps.generateStockUnlimitedSteps(i))
register('stockKTransactionsSM',   (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockCooldownSM',        (i) => arraysSteps.generateStock1TransactionSteps(i))
register('stockFeeSM',             (i) => arraysSteps.generateStock1TransactionSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 13: GREEDY  (548–573)
// ═══════════════════════════════════════════════════════════════

register('maxNonOverlapIntervals', (i) => greedySteps.generateMaxNonOverlapIntervalsSteps(i))
register('minPlatforms',           (i) => greedySteps.generateMinPlatformsSteps(i))
register('meetingRooms1',          (i) => greedySteps.generateMaxNonOverlapIntervalsSteps(i))
register('meetingRooms2',          (i) => greedySteps.generateMinPlatformsSteps(i))
register('jobSequencingDSU',       (i) => greedySteps.generateMaxNonOverlapIntervalsSteps(i))
register('jobSequencingGreedy',    (i) => greedySteps.generateMaxNonOverlapIntervalsSteps(i))
register('buildHuffmanTree',       (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('assignHuffmanCodes',     (i) => heapSteps.generateKthLargestMinHeapSteps(i))
register('jumpGame1',              (i) => greedySteps.generateJumpGame1Steps(i))
register('jumpGame2',              (i) => greedySteps.generateJumpGame2Steps(i))
register('jumpGame3',              (i) => greedySteps.generateJumpGame1Steps(i))
register('removeKDigits',          (i) => greedySteps.generateRemoveKDigitsSteps(i, 3))
register('removeDuplicateLetters', (i) => greedySteps.generateRemoveKDigitsSteps(i, 0))
register('reorganizeString',       (i) => heapSteps.generateTaskSchedulerSteps(i))
register('taskSchedulerGreedy',    (i) => heapSteps.generateTaskSchedulerSteps(i))
register('candyDistribution',      (i) => greedySteps.generateCandyDistributionSteps(i))
register('gasStation',             (i) => greedySteps.generateGasStationSteps(i, []))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 14: BIT MANIPULATION  (574–602)
// ═══════════════════════════════════════════════════════════════

// Bit Ops
register('setIthBit',              (i) => bitManipSteps.generateSetIthBitSteps(i, 1))
register('unsetIthBit',            (i) => bitManipSteps.generateUnsetIthBitSteps(i, 1))
register('toggleIthBit',           (i) => bitManipSteps.generateToggleIthBitSteps(i, 1))
register('checkIthBit',            (i) => bitManipSteps.generateCheckIthBitSteps(i, 2))
register('countSetBits',           (i) => bitManipSteps.generateCountSetBitsSteps(i))
register('isolateRightmostSet',    (i) => bitManipSteps.generateCountSetBitsSteps(i))

// XOR Tricks
register('singleNumber',           (i) => bitManipSteps.generateSingleNumberSteps(i))
register('singleNumberThrice',     (i) => bitManipSteps.generateSingleNumberSteps(i))
register('twoNonRepeating',        (i) => bitManipSteps.generateTwoNonRepeatingSteps(i))
register('missingAndRepeating',    (i) => bitManipSteps.generateTwoNonRepeatingSteps(i))
register('xor1toN',                (i) => bitManipSteps.generateSingleNumberSteps([i]))
register('swapWithoutTemp',        (i) => bitManipSteps.generateSetIthBitSteps(i, 0))

// Binary Exponentiation
register('fastPower',              (i) => bitManipSteps.generateFastPowerSteps(i, 5))
register('fastPowerMod',           (i) => bitManipSteps.generateFastPowerSteps(i, 5))
register('matrixExponentiation',   (i) => arraysSteps.generatePrefixSumSteps(i))

// Reverse Bits / Gray Code
register('reverseBits32',          (i) => bitManipSteps.generateReverseBits32Steps(i))
register('grayCodeGen',            (i) => bitManipSteps.generateGrayCodeGenSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 15: MATH & NUMBER THEORY  (603–651)
// ═══════════════════════════════════════════════════════════════

register('euclideanGCD',           (i) => mathSteps.generateEuclideanGCDSteps(i, 18))
register('extendedEuclidean',      (i) => mathSteps.generateEuclideanGCDSteps(i, 20))
register('lcmFromGCD',             (i) => mathSteps.generateEuclideanGCDSteps(i, 18))
register('stdSieve',               (i) => mathSteps.generateStdSieveSteps(i))
register('segmentedSieve',         (i) => mathSteps.generateSegmentedSieveSteps(i, 150))
register('sieveSPF',               (i) => mathSteps.generateSieveSPFSteps(i))
register('trialDivision',          (i) => mathSteps.generateTrialDivisionSteps(i))
register('spfFactorization',       (i) => mathSteps.generateTrialDivisionSteps(i))
register('modularInverseFermat',   (i) => bitManipSteps.generateFastPowerSteps(i, 5))
register('modularInverseEEA',      (i) => mathSteps.generateEuclideanGCDSteps(i, 7))
register('pascalTriangle2',        (i) => mathSteps.generatePascalTriangle2Steps(i))
register('nCrDP',                  (i) => mathSteps.generatePascalTriangle2Steps(i))
register('nCrModInv',              (i) => mathSteps.generatePascalTriangle2Steps(i))
register('catalanNumber',          (i) => mathSteps.generateCatalanNumberSteps(i))
register('catalanBST',             (i) => mathSteps.generateCatalanNumberSteps(i))
register('fibonacciLogN',          (i) => mathSteps.generateFibonacciLogNSteps(i))
register('solveLinearRecurrence',  (i) => mathSteps.generateFibonacciLogNSteps(i))
register('countDivisors',          (i) => mathSteps.generateCountDivisorsSteps(i))
register('sumDivisors',            (i) => mathSteps.generateCountDivisorsSteps(i))
register('convexHullGraham',       (i) => graphsSteps.generateKruskalSteps(i))
register('convexHullJarvis',       (i) => graphsSteps.generateKruskalSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 16: TRIE  (652–666)
// ═══════════════════════════════════════════════════════════════

register('trieInsert',             (i) => trieSteps.generateTrieInsertSteps(i))
register('trieSearch',             (i) => trieSteps.generateTrieSearchSteps(i))
register('triePrefix',             (i) => trieSteps.generateTriePrefixSteps(i))
register('trieDelete',             (i) => trieSteps.generateTrieSearchSteps(i))
register('searchSuggestions',      (i) => trieSteps.generateTriePrefixSteps(i))
register('longestCommonPrefixAll', (i) => trieSteps.generateLongestCommonPrefixAllSteps(i))
register('maxXorTwoNumbers',       (i) => trieSteps.generateMaxXorTwoNumbersSteps(i))
register('maxXorSubarray',         (i) => trieSteps.generateMaxXorTwoNumbersSteps(i))
register('buildFailureLinks',      (i) => trieSteps.generateTrieInsertSteps(i))
register('multiPatternSearch',     (i) => stringsSteps.generateKMPSearchSteps(i, ''))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 17: DSU  (667–680)
// ═══════════════════════════════════════════════════════════════

register('dsuFindPathCompression', (i) => dsuSteps.generateDSUFindSteps(i))
register('dsuUnionRank',           (i) => dsuSteps.generateDSUFindSteps(i))
register('dsuUnionSize',           (i) => dsuSteps.generateDSUFindSteps(i))
register('dsuComponents',          (i) => dsuSteps.generateDSUComponentsSteps(i))
register('cycleDSU2',              (i) => dsuSteps.generateCycleDSU2Steps(i))
register('kruskalDSU',             (i) => dsuSteps.generateDSUFindSteps(i))
register('accountsMerge2',         (i) => dsuSteps.generateDSUFindSteps(i))
register('redundantConnection2',   (i) => dsuSteps.generateCycleDSU2Steps(i))
register('numProvinces',           (i) => dsuSteps.generateNumProvincesSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 18: SEGMENT TREE & ADVANCED DS  (681–709)
// ═══════════════════════════════════════════════════════════════

register('buildSegTree2',          (i) => segmentAdvSteps.generateBuildSegTree2Steps(i))
register('segTreePointSum',        (i) => segmentAdvSteps.generateSegTreePointUpdateRangeSumSteps(i))
register('segTreeRangeMin',        (i) => segmentAdvSteps.generateBuildSegTree2Steps(i))
register('segTreeLazyRange',       (i) => segmentAdvSteps.generateBuildSegTree2Steps(i))
register('bitPointUpdatePrefixSum',(i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))
register('bitRangeUpdatePoint',    (i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))
register('bitRangeUpdateRange',    (i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))
register('bit2D',                  (i) => segmentAdvSteps.generateBITPointUpdatePrefixSumSteps(i))
register('buildSparseTable',       (i) => segmentAdvSteps.generateBuildSparseTableSteps(i))
register('rmqSparseTable',         (i) => segmentAdvSteps.generateBuildSparseTableSteps(i))
register('rangeGCDSparse',         (i) => segmentAdvSteps.generateBuildSparseTableSteps(i))
register('mosOffline',             (i) => segmentAdvSteps.generateBlockDecompSumSteps(i))
register('mosWithUpdates',         (i) => segmentAdvSteps.generateBlockDecompSumSteps(i))
register('blockDecompSum',         (i) => segmentAdvSteps.generateBlockDecompSumSteps(i))
register('heavyLightDecomp',       (i) => treesSteps.generateDiameterSteps(i)) // HLD approximation via tree traversal

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 19: DIVIDE & CONQUER  (710–717)
// ═══════════════════════════════════════════════════════════════

register('masterTheorem',          (i) => divideConquerSteps.generateKaratsubaMultSteps(i, 1))
register('karatsubaMult',          (i) => divideConquerSteps.generateKaratsubaMultSteps(i, 5678))
register('closestPairPoints',      (i) => divideConquerSteps.generateClosestPairPointsSteps(i))
register('inversionCountMerge',    (i) => divideConquerSteps.generateInversionCountMergeSteps(i))

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 20: MISCELLANEOUS  (718–738)
// ═══════════════════════════════════════════════════════════════

register('meetInMiddleSubset',     (i) => divideConquerSteps.generateInversionCountMergeSteps(i))
register('bidirectionalBFS',       (i) => miscSteps.generateBidirectionalBFSSteps(i))
register('mergeKSortedArrays',     (i) => miscSteps.generateMergeKSortedArraysSteps(i))
register('smallestRangeKWay',      (i) => miscSteps.generateMergeKSortedArraysSteps(i))
register('reservoirSampleList',    (i) => miscSteps.generateReservoirSampleStreamSteps(i))
register('reservoirSampleStream',  (i) => miscSteps.generateReservoirSampleStreamSteps(i))
register('fisherYatesShuffle',     (i) => miscSteps.generateFisherYatesShuffleSteps(i))
register('coordEvents',            (i) => miscSteps.generateCoordEventsSteps(i))
register('sweepLineEvents',        (i) => miscSteps.generateCoordEventsSteps(i))

// ═══════════════════════════════════════════════════════════════
//  GENERIC FALLBACK
// ═══════════════════════════════════════════════════════════════

register('__fallback__', (input) => {
  return [{
    type: 'info',
    label: `Visualization for this pattern is in development.\nInput: ${JSON.stringify(input)}`,
  }]
})

// ─── Public API ────────────────────────────────────────────
export function getStepGenerator(patternId) {
  return REGISTRY[patternId] || REGISTRY['__fallback__']
}

export function hasStepGenerator(patternId) {
  return patternId in REGISTRY && REGISTRY[patternId] !== REGISTRY['__fallback__']
}

export default REGISTRY
