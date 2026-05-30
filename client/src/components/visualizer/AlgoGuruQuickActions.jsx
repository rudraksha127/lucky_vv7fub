import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Lightbulb, BarChart3, GitBranch, X, Loader2, MessageSquare, Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import api from '@/lib/api'

const QUICK_ACTIONS = [
  {
    id: 'explain',
    label: 'Explain This Algorithm',
    icon: Lightbulb,
    description: 'Step-by-step explanation of how this algorithm works',
    getPrompt: (patternLabel, code) =>
      `Explain the "${patternLabel}" algorithm step-by-step. ${code ? `Here is the code:\n\`\`\`\n${code}\n\`\`\`` : 'Explain the general approach, time complexity, and use cases.'}`,
  },
  {
    id: 'complexity',
    label: 'Time & Space Complexity',
    icon: BarChart3,
    description: 'Analyze time and space complexity in detail',
    getPrompt: (patternLabel, code) =>
      `What is the time and space complexity of "${patternLabel}"? ${code ? `Analyze this code:\n\`\`\`\n${code}\n\`\`\`` : 'Explain best, average, and worst-case complexity.'} Break it down step by step.`,
  },
  {
    id: 'variations',
    label: 'Similar Problems',
    icon: GitBranch,
    description: 'Find related problems and variations',
    getPrompt: (patternLabel) =>
      `What are some common variations and related problems for the "${patternLabel}" pattern? Give me 3-4 problems with brief hints on how to solve each.`,
  },
  {
    id: 'deep-dive',
    label: 'Deep Dive',
    icon: Sparkles,
    description: 'In-depth analysis with analogies and examples',
    getPrompt: (patternLabel) =>
      `Give me a deep dive into "${patternLabel}". Include: real-world analogies (especially Indian/Hinglish ones), common pitfalls, edge cases, and how to recognize this pattern in new problems.`,
  },
]

export default function AlgoGuruQuickActions({ patternId, patternLabel, code, visualizerType }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingAction, setLoadingAction] = useState(null)
  const [responses, setResponses] = useState({})

  const handleAction = useCallback(async (action) => {
    if (loadingAction) return
    setLoadingAction(action.id)
    setResponses(prev => ({ ...prev, [action.id]: null }))

    try {
      const prompt = action.getPrompt(patternLabel || patternId || 'this algorithm', code)

      const { data } = await api.post('/ai/algoguru/chat', {
        message: prompt,
        hintLevel: 2,
      })

      setResponses(prev => ({
        ...prev,
        [action.id]: {
          answer: data.answer || 'No response generated.',
          confidence: data.confidence ?? 0.7,
          evidenceMap: data.evidenceMap ?? [],
          nextBestAction: data.nextBestAction ?? '',
        },
      }))
    } catch (err) {
      // Show a friendly fallback
      setResponses(prev => ({
        ...prev,
        [action.id]: {
          answer: '🤖 AlgoGuru is thinking... (AI service not available — configure GROQ_API_KEY to enable full responses)',
          confidence: 0,
          evidenceMap: [],
          nextBestAction: 'Set up GROQ_API_KEY',
        },
      }))
    } finally {
      setLoadingAction(null)
    }
  }, [patternId, patternLabel, code, loadingAction])

  if (!patternId) return null

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={clsx(
          'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all border',
          isOpen
            ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
            : 'bg-dark-700/50 text-slate-400 border-dark-600 hover:border-purple-500/30 hover:text-purple-400'
        )}
        title="Ask AlgoGuru AI"
      >
        <Brain className="w-3 h-3" />
        <span>Ask AI</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 z-50 w-72 rounded-xl border border-dark-500 bg-dark-800 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-dark-600 bg-dark-800/80">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-white">AlgoGuru</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-0.5 rounded text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-2 space-y-1">
              {QUICK_ACTIONS.map(action => {
                const Icon = action.icon
                const response = responses[action.id]
                const isLoading = loadingAction === action.id

                return (
                  <div key={action.id}>
                    <button
                      onClick={() => handleAction(action)}
                      disabled={!!loadingAction}
                      className={clsx(
                        'flex items-start gap-2 w-full px-2.5 py-2 rounded-lg text-left transition-all',
                        response
                          ? 'bg-purple-500/10 border border-purple-500/20'
                          : 'hover:bg-dark-700 border border-transparent',
                        isLoading && 'animate-pulse'
                      )}
                    >
                      <div className={clsx(
                        'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0',
                        response ? 'bg-purple-500/20' : 'bg-dark-700'
                      )}>
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                        ) : (
                          <Icon className={clsx(
                            'w-3 h-3',
                            response ? 'text-purple-400' : 'text-slate-400'
                          )} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={clsx(
                          'text-[11px] font-medium',
                          response ? 'text-purple-300' : 'text-slate-300'
                        )}>
                          {action.label}
                        </p>
                        <p className="text-[9px] text-slate-500 leading-tight">
                          {action.description}
                        </p>
                      </div>
                    </button>

                    {/* Response */}
                    {response && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <div className="px-2.5 pb-2 ml-8">
                          <div className="rounded-lg bg-dark-900/60 border border-dark-600/50 p-2.5">
                            <p className="text-[10px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {response.answer}
                            </p>
                            {response.confidence > 0 && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={clsx(
                                  'text-[8px] font-mono px-1 py-0.5 rounded',
                                  response.confidence >= 0.9
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : response.confidence >= 0.6
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-red-500/20 text-red-400'
                                )}>
                                  {Math.round(response.confidence * 100)}% confident
                                </span>
                                {response.nextBestAction && (
                                  <span className="text-[8px] text-primary-400 truncate">
                                    → {response.nextBestAction}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-dark-600/50 px-3 py-1.5 bg-dark-900/30">
              <p className="text-[8px] text-slate-600 text-center">
                Powered by ATLAS RAG — Grounded &amp; Cited
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
