import VisualizationPanel from '@/components/visualizer/VisualizationPanel'

const MOCK_PROBLEM = {
  _id: 'test-000',
  title: 'DSA Visualizer Studio — 738 Patterns',
  difficulty: 'Warrior',
  patternId: 'maxSubarraySum',
  supportedLanguages: ['python', 'javascript'],
  examples: [
    { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6' },
    { input: '[1,2,3,4]', output: '10' },
  ],
  testCases: [
    { input: '9\n-2 1 -3 4 -1 2 1 -5 4\n', output: '6' },
    { input: '1\n1\n', output: '1' },
  ],
  starterCode: {
    python: `def max_subarray_sum(nums):\n    max_sum = float('-inf')\n    curr_sum = 0\n    for num in nums:\n        curr_sum += num\n        max_sum = max(max_sum, curr_sum)\n        if curr_sum < 0:\n            curr_sum = 0\n    return max_sum`,
  },
}

export default function VisualizerTestPage() {
  return (
    <div className="flex flex-col h-screen bg-dark-900 overflow-hidden">
      <header className="flex items-center justify-between border-b border-dark-600 bg-dark-800 px-4 py-2 flex-shrink-0 h-12">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            AlgoZen
          </span>
          <span className="text-dark-500 text-sm">|</span>
          <h1 className="text-slate-300 font-medium text-sm">Visualizer Studio</h1>
          <span className="rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 text-[10px] font-bold">
            Linked List / String / Matrix
          </span>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <VisualizationPanel
          problem={MOCK_PROBLEM}
          code="# Write your solution here"
          language="python"
          testInput="[1,2,3,4,5]"
        />
      </main>
    </div>
  )
}
