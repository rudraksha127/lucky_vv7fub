import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Loader2, MessageSquare, BookOpen, Lightbulb, Eye,
  ChevronDown, ChevronUp, Sparkles, Zap, Search, X, Bot,
  User, Clock, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import clsx from 'clsx'
import api from '@/lib/api'

// ─── Concept Library Browser Data ──────────────────────────
const CONCEPT_TOPICS = [
  { id: 'arrays', label: 'Arrays', icon: '📊' },
  { id: 'strings', label: 'Strings', icon: '📝' },
  { id: 'stack', label: 'Stack', icon: '📚' },
  { id: 'queue', label: 'Queue', icon: '🚶' },
  { id: 'trees', label: 'Trees', icon: '🌳' },
  { id: 'graphs', label: 'Graphs', icon: '🔗' },
  { id: 'dp', label: 'Dynamic Programming', icon: '🧩' },
  { id: 'recursion', label: 'Recursion', icon: '🔄' },
  { id: 'hashing', label: 'Hashing', icon: '🔑' },
  { id: 'sorting', label: 'Sorting', icon: '📋' },
  { id: 'searching', label: 'Binary Search', icon: '🔍' },
  { id: 'greedy', label: 'Greedy', icon: '🎯' },
  { id: 'backtracking', label: 'Backtracking', icon: '🔄' },
  { id: 'heap', label: 'Heap / Priority Queue', icon: '⛰️' },
  { id: 'trie', label: 'Trie', icon: '🌲' },
  { id: 'unionfind', label: 'Union-Find', icon: '🔗' },
]

const QUICK_PROMPTS = [
  { label: 'Explain Arrays', prompt: 'Explain arrays with a real-world analogy' },
  { label: 'DP vs Greedy', prompt: 'What is the difference between dynamic programming and greedy algorithms? When should I use each?' },
  { label: 'Time Complexity', prompt: 'How do I calculate time complexity? Give examples of O(1), O(n), O(n²), O(log n), O(n log n)' },
  { label: 'Two Pointers', prompt: 'Explain the two-pointer technique with examples' },
  { label: 'BFS vs DFS', prompt: 'What is the difference between BFS and DFS? When to use each?' },
  { label: 'Practice Path', prompt: 'I am a beginner. Suggest a DSA learning path with topics in order' },
]

// ─── Chat Message Component ───────────────────────────────
function ChatMessage({ message, isLast }) {
  const isUser = message.role === 'user'
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex gap-3 px-4 py-3',
        isUser ? '' : 'bg-dark-800/30'
      )}
    >
      {/* Avatar */}
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser
          ? 'bg-gradient-to-br from-primary-500 to-accent-500'
          : 'bg-gradient-to-br from-purple-500 to-pink-500'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            {isUser ? 'You' : 'AlgoGuru'}
          </span>
          {!isUser && message.metadata?.confidence !== undefined && (
            <span className={clsx(
              'text-[9px] font-mono px-1.5 py-0.5 rounded-full',
              message.metadata.confidence >= 0.9
                ? 'bg-emerald-500/20 text-emerald-400'
                : message.metadata.confidence >= 0.6
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            )}>
              {Math.round(message.metadata.confidence * 100)}%
            </span>
          )}
          {message.timestamp && (
            <span className="text-[9px] text-slate-600">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Metadata details (evidence, hints, etc.) */}
        {!isUser && message.metadata && (
          <>
            {message.metadata.nextBestAction && (
              <div className="flex items-start gap-1.5 rounded-md bg-primary-500/10 border border-primary-500/20 px-2 py-1.5 mt-2">
                <Zap className="w-3 h-3 text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-primary-300">{message.metadata.nextBestAction}</p>
              </div>
            )}

            {message.metadata.evidenceMap?.length > 0 && (
              <div>
                <button
                  onClick={() => setShowDetails(v => !v)}
                  className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-slate-400 transition-colors mt-1"
                >
                  <BookOpen className="w-2.5 h-2.5" />
                  Citations ({message.metadata.evidenceMap.length})
                  {showDetails ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                </button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 space-y-0.5">
                        {message.metadata.evidenceMap.map((ev, idx) => (
                          <p key={idx} className="text-[9px] text-slate-500 pl-2 border-l border-dark-600">
                            • {ev}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Human action badge */}
            {message.metadata.humanAction && message.metadata.humanAction !== 'NONE' && (
              <div className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium mt-1',
                message.metadata.humanAction === 'VERIFY'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}>
                {message.metadata.humanAction === 'VERIFY' ? '⚠️' : '🚩'} Needs {message.metadata.humanAction === 'VERIFY' ? 'Verification' : 'Escalation'}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Typing Indicator ──────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 bg-dark-800/30">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Brain className="w-4 h-4 text-white animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-[10px] text-slate-500">AlgoGuru is thinking...</span>
      </div>
    </div>
  )
}

// ─── Quick Prompts Grid ────────────────────────────────────
function QuickPrompts({ onSelect, hasMessages }) {
  if (hasMessages) return null
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">AlgoGuru AI Mentor</h2>
          <p className="text-sm text-slate-400">
            Ask anything about DSA — concepts, problem-solving strategies, time complexity, or learning paths.
            <br />
            Powered by <span className="text-purple-400 font-semibold">ATLAS</span> RAG Engine.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold text-center">
            Try these questions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(qp.prompt)}
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-dark-600 bg-dark-800/50 hover:bg-dark-700 hover:border-dark-500 transition-all text-left group"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
                <div>
                  <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{qp.label}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{qp.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Concept Sidebar ───────────────────────────────────────
function ConceptSidebar({ onAsk, isOpen, onToggle }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = CONCEPT_TOPICS.filter(t =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={clsx(
      'border-l border-dark-600 bg-dark-800/50 flex flex-col transition-all duration-200',
      isOpen ? 'w-60' : 'w-0 overflow-hidden'
    )}>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500 p-3 space-y-1.5">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts..."
            className="w-full rounded-md border border-dark-600 bg-dark-700 pl-7 pr-2 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Concept buttons */}
        {filtered.map(concept => (
          <button
            key={concept.id}
            onClick={() => {
              onAsk(`Explain the concept of ${concept.label} in DSA. Include real-world analogies, time/space complexity, and common problem patterns.`)
              onToggle()
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dark-600/50 bg-dark-700/30 hover:bg-dark-700 hover:border-dark-500 text-left transition-all group"
          >
            <span className="text-sm">{concept.icon}</span>
            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{concept.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AIChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hintLevel, setHintLevel] = useState(2)
  const [conceptSidebarOpen, setConceptSidebarOpen] = useState(false)
  const [feedbackMap, setFeedbackMap] = useState({}) // msgId -> rating
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSend(overrideMessage) {
    const msg = (overrideMessage || input).trim()
    if (!msg || loading) return

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Call AlgoGuru chat API
      const { data } = await api.post('/ai/algoguru/chat', {
        message: msg,
        hintLevel,
        history: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content,
        })),
      })

      // Add AI response
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I don't have enough information to answer that confidently.",
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: data.confidence ?? 0.7,
          humanAction: data.humanAction ?? 'NONE',
          humanActionReason: data.humanActionReason ?? '',
          evidenceMap: data.evidenceMap ?? [],
          gapsOrRisks: data.gapsOrRisks ?? [],
          assumptions: data.assumptions ?? [],
          nextBestAction: data.nextBestAction ?? '',
        },
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      // Check if it's an auth error — try without auth for standalone chat
      if (err?.response?.status === 401) {
        // Fallback: show a helpful message about needing auth
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "🤖 AlgoGuru requires authentication. Please sign in first.\n\nIn the meantime, here's what AlgoGuru can help with:\n- **DSA concept explanations** with real-world analogies\n- **Time & space complexity analysis**\n- **Problem-solving strategies** and learning paths\n- **Code review** and optimization suggestions",
          timestamp: new Date().toISOString(),
          metadata: {
            confidence: 0,
            humanAction: 'ESCALATE',
            humanActionReason: 'Authentication required',
          },
        }])
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "😅 AlgoGuru hit a snag! Please try again in a moment.",
          timestamp: new Date().toISOString(),
          metadata: { confidence: 0, humanAction: 'ESCALATE', humanActionReason: err.message },
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleFeedback(messageId, rating) {
    if (feedbackMap[messageId]) return
    setFeedbackMap(prev => ({ ...prev, [messageId]: rating }))

    const msg = messages.find(m => m.id === messageId)
    if (!msg) return

    try {
      await api.post('/ai/feedback', {
        query: 'AlgoGuru AI Chat',
        answer: msg.content,
        rating,
        confidence: msg.metadata?.confidence,
      })
    } catch {
      // Silent fail
    }
  }

  async function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-dark-900">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-dark-600 bg-dark-800 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">AlgoGuru AI Mentor</h1>
            <p className="text-[9px] text-slate-500">Powered by ATLAS RAG Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hint Level Selector */}
          <div className="hidden sm:flex items-center gap-1 rounded-md border border-dark-600 bg-dark-700 overflow-hidden">
            {[1, 2, 3].map(level => (
              <button
                key={level}
                onClick={() => setHintLevel(level)}
                className={clsx(
                  'px-2 py-1 text-[10px] font-medium transition-colors',
                  hintLevel === level
                    ? 'bg-purple-600/30 text-purple-400'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                L{level}
              </button>
            ))}
          </div>

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-2 py-1 text-[10px] text-slate-500 hover:text-white transition-colors rounded-md hover:bg-dark-700"
            >
              Clear
            </button>
          )}

          {/* Concept Sidebar Toggle */}
          <button
            onClick={() => setConceptSidebarOpen(v => !v)}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              conceptSidebarOpen
                ? 'bg-purple-600/20 text-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-dark-700'
            )}
            title="Concept Library"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500">
            {messages.length === 0 ? (
              <QuickPrompts
                hasMessages={messages.length > 0}
                onSelect={(prompt) => handleSend(prompt)}
              />
            ) : (
              <div className="py-2">
                {messages.map((msg, idx) => (
                  <div key={msg.id}>
                    <ChatMessage message={msg} isLast={idx === messages.length - 1} />
                    {/* Feedback buttons for assistant messages */}
                    {msg.role === 'assistant' && msg.metadata?.confidence > 0 && (
                      <div className="flex items-center gap-1 px-4 pb-2 ml-11">
                        <span className="text-[9px] text-slate-600 mr-1">Helpful?</span>
                        <button
                          onClick={() => handleFeedback(msg.id, 'helpful')}
                          disabled={!!feedbackMap[msg.id]}
                          className={clsx(
                            'p-0.5 rounded transition-colors',
                            feedbackMap[msg.id] === 'helpful'
                              ? 'text-emerald-400'
                              : 'text-slate-600 hover:text-emerald-400'
                          )}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'unhelpful')}
                          disabled={!!feedbackMap[msg.id]}
                          className={clsx(
                            'p-0.5 rounded transition-colors',
                            feedbackMap[msg.id] === 'unhelpful'
                              ? 'text-red-400'
                              : 'text-slate-600 hover:text-red-400'
                          )}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input Area ──────────────────────────────────── */}
          <div className="border-t border-dark-600 bg-dark-800/80 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-700/80 px-3 py-2 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about DSA concepts, algorithms, or problems..."
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                {/* Mobile hint level */}
                <select
                  value={hintLevel}
                  onChange={(e) => setHintLevel(Number(e.target.value))}
                  className="sm:hidden rounded border border-dark-600 bg-dark-800 text-[10px] text-slate-400 px-1 py-0.5 focus:outline-none"
                >
                  <option value={1}>Subtle</option>
                  <option value={2}>Moderate</option>
                  <option value={3}>Explicit</option>
                </select>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-purple-600/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-[9px] text-slate-600 text-center mt-1.5">
              AlgoGuru uses the <span className="text-purple-400">ATLAS RAG</span> engine — responses are grounded in retrieved concepts and cited for auditability.
            </p>
          </div>
        </div>

        {/* Concept Sidebar */}
        <ConceptSidebar
          isOpen={conceptSidebarOpen}
          onToggle={() => setConceptSidebarOpen(v => !v)}
          onAsk={(prompt) => handleSend(prompt)}
        />
      </div>
    </div>
  )
}
