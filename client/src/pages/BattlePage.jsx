import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import {
  Swords,
  Users,
  Clock,
  Trophy,
  Loader2,
  Copy,
  Check,
  Zap,
  Play,
  Send,
  Crosshair,
  LogIn,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '@/lib/api'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DIFFICULTY_STYLES = {
  Rookie: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Warrior: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Legend: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

export default function BattlePage() {
  const [mode, setMode] = useState('menu') // menu | create | join | countdown | live | ended
  const [battle, setBattle] = useState(null)
  const [roomCode, setRoomCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [difficulty, setDifficulty] = useState('Rookie')
  const [countdown, setCountdown] = useState(5)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timer, setTimer] = useState(1800)
  const [players, setPlayers] = useState([])
  const [winner, setWinner] = useState(null)
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [opponentCode, setOpponentCode] = useState('')
  const [opponentLanguage, setOpponentLanguage] = useState('python')
  const [opponentTyping, setOpponentTyping] = useState(false)
  const [splitView, setSplitView] = useState(true)
  const [surrenderConfirm, setSurrenderConfirm] = useState(false)

  // Debounced code streaming ref
  const codeTimerRef = useRef(null)
  const prevCodeRef = useRef('')

  // Connect socket
  useEffect(() => {
    const s = io(SOCKET_URL, { withCredentials: true })
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  // Socket event handlers
  useEffect(() => {
    if (!socket || !battle) return

    const battleId = battle._id || battle.battleId
    socket.emit('join-battle', battleId)

    socket.on('battle-countdown', (data) => {
      setMode('countdown')
      setCountdown(data.seconds)
      setPlayers(data.players)
    })

    socket.on('battle-start', () => {
      setMode('live')
      setTimer(1800)
    })

    socket.on('player-update', (data) => {
      setPlayers(data.players)
    })

    // Opponent code streaming
    socket.on('opponent-code-update', (data) => {
      if (data.code !== undefined) setOpponentCode(data.code)
      if (data.language) setOpponentLanguage(data.language)
    })

    // Opponent typing indicator
    socket.on('opponent-typing', (data) => {
      setOpponentTyping(data.isTyping)
      // Auto-hide typing indicator after 2s
      clearTimeout(window._typingTimeout)
      if (data.isTyping) {
        window._typingTimeout = setTimeout(() => setOpponentTyping(false), 2000)
      }
    })

    socket.on('battle-ended', (data) => {
      setWinner(data)
      setMode('ended')
    })

    return () => {
      socket.emit('leave-battle', battleId)
      socket.off('battle-countdown')
      socket.off('battle-start')
      socket.off('player-update')
      socket.off('opponent-code-update')
      socket.off('opponent-typing')
      socket.off('battle-ended')
      clearTimeout(window._typingTimeout)
    }
  }, [socket, battle])

  // Stream code changes to opponent (debounced: every 1.5s while typing)
  useEffect(() => {
    if (mode !== 'live' || !socket || !battle) return
    const battleId = battle._id || battle.battleId

    // Only emit if code actually changed
    if (code !== prevCodeRef.current) {
      prevCodeRef.current = code

      // Clear previous timer
      if (codeTimerRef.current) clearTimeout(codeTimerRef.current)

      // Debounce: emit after 800ms of no typing
      codeTimerRef.current = setTimeout(() => {
        socket.emit('code-update', { battleId, code, language })
      }, 800)

      // Also emit typing indicator
      socket.emit('opponent-typing', { battleId, isTyping: true })
      clearTimeout(window._typingEmitTimeout)
      window._typingEmitTimeout = setTimeout(() => {
        socket.emit('opponent-typing', { battleId, isTyping: false })
      }, 1500)
    }

    return () => {
      if (codeTimerRef.current) clearTimeout(codeTimerRef.current)
    }
  }, [code, mode, socket, battle, language])

  // Timer countdown during live battle
  useEffect(() => {
    if (mode !== 'live' || timer <= 0) return
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setMode('ended')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, timer])

  // Countdown animation
  useEffect(() => {
    if (mode !== 'countdown' || countdown <= 0) return
    const interval = setInterval(() => {
      setCountdown(c => c - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, countdown])

  const handleCreate = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/battles/create', { difficulty })
      setBattle(data)
      setRoomCode(data.roomCode)
      setPlayers([{ username: 'You', status: 'waiting' }])
      setMode('create')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create battle')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return toast.error('Enter a room code')
    setLoading(true)
    try {
      const { data } = await api.post(`/battles/join/${joinCode.trim().toUpperCase()}`)
      setBattle(data.battle)
      setRoomCode(data.battle.roomCode)
      setCode(data.battle.problemId?.starterCode?.['python'] || '')
      setPlayers(data.battle.players)
      setMode('countdown')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to join battle')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!battle || isSubmitting) return
    setIsSubmitting(true)
    try {
      const { data } = await api.post(`/battles/${roomCode}/submit`, {
        problemId: battle.problemId?._id || battle.problemId,
        source_code: code,
        language,
      })
      setResults(data)
      if (data.passed) {
        toast.success('🎉 You solved it!')
        setWinner({ winnerName: 'You' })
      } else {
        toast.error('Some tests failed. Try again!')
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }, [battle, code, language, roomCode, isSubmitting])

  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode)
    setCopied(true)
    toast.success('Room code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Menu screen
  if (mode === 'menu') {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                <Swords className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">Battle Mode</h1>
            <p className="text-slate-400">Real-time 1v1 coding duels. First to solve wins!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Room */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Swords className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Create Room</h2>
              </div>
              <p className="text-sm text-slate-400">Create a battle room and invite a friend</p>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200"
              >
                <option value="Rookie">Rookie</option>
                <option value="Warrior">Warrior</option>
                <option value="Legend">Legend</option>
              </select>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
                Create Battle Room
              </button>
            </motion.div>

            {/* Join Room */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <LogIn className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Join Room</h2>
              </div>
              <p className="text-sm text-slate-400">Enter a 6-character room code</p>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter code..."
                maxLength={6}
                className="w-full rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 text-center text-lg font-bold tracking-widest uppercase"
              />
              <button
                onClick={handleJoin}
                disabled={loading || !joinCode.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Join Battle
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Room created - waiting for opponent
  if (mode === 'create') {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800 border border-dark-600 rounded-2xl p-8 max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30">
              <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Waiting for Opponent</h2>
          <p className="text-slate-400">Share this code with your friend:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-bold tracking-[0.3em] text-white bg-dark-700 px-6 py-3 rounded-xl border border-dark-600">
              {roomCode}
            </span>
            <button
              onClick={copyCode}
              className="p-3 rounded-xl bg-dark-700 border border-dark-600 hover:border-primary-500/50 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>1/2 players</span>
          </div>
          <button
            onClick={() => setMode('menu')}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    )
  }

  // Countdown
  if (mode === 'countdown') {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6 relative overflow-hidden">
        {/* Intense background pulse */}
        <motion.div
          className="absolute inset-0 bg-red-500/5 mix-blend-overlay pointer-events-none"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8 relative z-10"
        >
          <div className="flex items-center justify-center gap-12 mb-12">
            {players.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ x: i === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 shadow-2xl flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-50" />
                  <span className="text-4xl font-black text-white z-10 drop-shadow-md">
                    {(p.username || '?')[0].toUpperCase()}
                  </span>
                </motion.div>
                <span className="text-lg font-bold text-slate-200 tracking-wide uppercase">
                  {p.username || 'Waiting...'}
                </span>
              </div>
            ))}
            
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.5, bounce: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full" />
                <Swords className="w-16 h-16 text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </div>
            </motion.div>
          </div>

          <div className="h-32 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={clsx(
                  "text-9xl font-black tracking-tighter",
                  countdown <= 3 && countdown > 0 ? "text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" : 
                  countdown === 0 ? "text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]" : 
                  "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                )}
              >
                {countdown > 0 ? countdown : 'FIGHT!'}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    )
  }

  // Live battle
  if (mode === 'live') {
    const problem = battle?.problemId
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Battle Header */}
        <div className="flex items-center justify-between border-b border-dark-600 bg-dark-800 px-4 py-2 flex-shrink-0 h-14">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Swords className="w-4 h-4 text-red-400" />
              Battle
            </span>
            <div className="flex items-center gap-2">
              {players.map((p, i) => (
                <span key={i} className={clsx(
                  'text-sm font-medium',
                  p.status === 'solved' ? 'text-emerald-400' : 'text-slate-300'
                )}>
                  {p.username || 'Player ' + (i + 1)}
                  {p.status === 'solved' && ' ✅'}
                  {i < players.length - 1 && <span className="text-slate-600 mx-1">vs</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={clsx(
              'flex items-center gap-1.5 text-sm font-mono font-bold',
              timer < 300 ? 'text-red-400' : 'text-slate-300'
            )}>
              <Clock className="w-4 h-4" />
              {formatTime(timer)}
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className={clsx(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              DIFFICULTY_STYLES[problem?.difficulty] || 'bg-slate-700 text-slate-300'
            )}>
              {problem?.difficulty}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Problem description */}
          <div className="hidden md:flex flex-col w-1/2 border-r border-dark-600 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <h2 className="text-lg font-bold text-white">{problem?.title}</h2>
              <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {problem?.description}
              </p>
              {problem?.constraints && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Constraints:</p>
                  <pre className="bg-dark-700 rounded p-2 text-sm text-slate-300 whitespace-pre-wrap">{problem?.constraints}</pre>
                </div>
              )}
              {problem?.examples?.map((ex, i) => (
                <div key={i} className="bg-dark-700 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-400">Example {i + 1}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Input:</p>
                    <pre className="bg-dark-800 rounded p-1.5 text-xs text-slate-200 font-mono">{ex.input}</pre>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Output:</p>
                    <pre className="bg-dark-800 rounded p-1.5 text-xs text-slate-200 font-mono">{ex.output}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between border-b border-dark-600 bg-dark-800 px-3 py-1.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value)
                    setCode(problem?.starterCode?.[e.target.value] || '')
                  }}
                  className="rounded-md border border-dark-600 bg-dark-700 px-2 py-1 text-xs text-slate-200"
                >
                  {['python', 'cpp', 'java', 'javascript'].map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
                {/* Split view toggle */}
                <button
                  onClick={() => setSplitView(v => !v)}
                  className={clsx(
                    'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all',
                    splitView
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-dark-700 text-slate-500 border-dark-600 hover:text-slate-300'
                  )}
                  title="Toggle opponent code view"
                >
                  <Users className="w-3 h-3" />
                  Opponent
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* Surrender button */}
                {!surrenderConfirm ? (
                  <button
                    onClick={() => setSurrenderConfirm(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-all"
                  >
                    Give Up
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <span className="text-xs text-red-400">Sure?</span>
                    <button
                      onClick={async () => {
                        try {
                          await api.post(`/battles/${roomCode}/surrender`)
                          toast.success('You surrendered')
                        } catch {
                          toast.error('Failed to surrender')
                        }
                        setSurrenderConfirm(false)
                      }}
                      className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-all"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setSurrenderConfirm(false)}
                      className="px-2 py-1 rounded-md bg-dark-700 text-slate-400 text-xs border border-dark-600 hover:text-slate-200 transition-all"
                    >
                      No
                    </button>
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit
                </button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* User's editor */}
              <div className={clsx('flex flex-col', splitView ? 'w-1/2 border-r border-dark-600' : 'flex-1')}>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'javascript' ? 'javascript' : 'python'}
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    theme="vs-dark"
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>

              {/* Opponent code panel */}
              {splitView && (
                <div className="w-1/2 flex flex-col bg-dark-900/50">
                  <div className="flex items-center justify-between border-b border-dark-600 bg-dark-800/80 px-3 py-1.5 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">Opponent's Code</span>
                      {opponentTyping && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          typing...
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-600 bg-dark-700 px-1.5 py-0.5 rounded">
                      {opponentLanguage}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {opponentCode ? (
                      <Editor
                        height="100%"
                        language={opponentLanguage === 'cpp' ? 'cpp' : opponentLanguage === 'java' ? 'java' : opponentLanguage === 'javascript' ? 'javascript' : 'python'}
                        value={opponentCode}
                        theme="vs-dark"
                        options={{
                          fontSize: 13,
                          minimap: { enabled: false },
                          readOnly: true,
                          wordWrap: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          renderWhitespace: 'all',
                          lineNumbers: 'on',
                          folding: true,
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                          <Loader2 className="w-6 h-6 text-slate-600 animate-spin mx-auto" />
                          <p className="text-xs text-slate-600">Waiting for opponent's code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Typing indicator bottom bar */}
                  {opponentTyping && !opponentCode && (
                    <div className="border-t border-dark-600 bg-dark-800/50 px-3 py-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] text-emerald-400/70 italic">Opponent is typing...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {results && (
              <div className="border-t border-dark-600 bg-dark-800 p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      results.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    )}>
                      {results.passed ? '✅ Accepted' : '❌ Failed'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {results.results?.filter(r => r.passed).length}/{results.results?.length} passed
                    </span>
                  </div>
                  {results.passed && (
                    <span className="text-xs text-emerald-400/70">
                      +200 XP if you're first!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Battle ended
  if (mode === 'ended') {
    const isWinner = winner?.winnerName === 'You'
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800 border border-dark-600 rounded-2xl p-8 max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={clsx(
                'p-4 rounded-2xl',
                isWinner
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-slate-500/20 border border-slate-500/30'
              )}
            >
              {isWinner ? (
                <Trophy className="w-14 h-14 text-yellow-400" />
              ) : (
                <Crosshair className="w-14 h-14 text-slate-400" />
              )}
            </motion.div>
          </div>
          <h2 className={clsx(
            'text-3xl font-bold',
            isWinner ? 'text-yellow-400' : 'text-slate-300'
          )}>
            {isWinner ? 'Victory!' : 'Defeat!'}
          </h2>
          <p className="text-slate-400">
            {isWinner
              ? 'You solved the problem first! +200 XP earned!'
              : `${winner?.winnerName || 'Opponent'} solved the problem first. +50 XP for participation.`}
          </p>
          {winner?.solveTime && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Solved in {Math.floor(winner.solveTime / 60)}m {winner.solveTime % 60}s</span>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setMode('menu')
                setBattle(null)
                setResults(null)
                setWinner(null)
                setRoomCode('')
                setCode('')
              }}
              className="flex-1 py-2.5 rounded-xl bg-dark-700 border border-dark-600 text-slate-300 font-semibold hover:bg-dark-600 transition-colors"
            >
              Back to Menu
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              Rematch
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}
