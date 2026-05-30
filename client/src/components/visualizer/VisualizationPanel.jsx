import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, PanelLeft,
  AlertCircle, BarChart3, GitBranch, Layers, Share2,
  Hash, Text, Link2, Grid3x3, Triangle,
} from 'lucide-react'
import clsx from 'clsx'
import CategoryBrowser from './CategoryBrowser'
import ArrayVisualizer from './ArrayVisualizer'
import TreeVisualizer from './TreeVisualizer'
import GraphVisualizer from './GraphVisualizer'
import StackQueueVisualizer from './StackQueueVisualizer'
import RecursionTreeVisualizer from './RecursionTreeVisualizer'
import LinkedListVisualizer from './LinkedListVisualizer'
import StringVisualizer from './StringVisualizer'
import MatrixVisualizer from './MatrixVisualizer'
import StepTracePanel from './StepTracePanel'
import CodePanel from './CodePanel'
import QuizPanel from './QuizPanel'
import AlgoGuruQuickActions from './AlgoGuruQuickActions'
import { PATTERN_LOOKUP } from './patternsData'
import { getStepGenerator } from './stepRegistry'
import { parseArrayInput, parseAdjList, parseTreeInput } from './visualizersData'

const VISUALIZER_ICONS = {
  array: BarChart3,
  tree: GitBranch,
  graph: Share2,
  stack: Layers,
  recursion: Hash,
  string: Text,
  linkedlist: Link2,
  matrix: Grid3x3,
  dp: Grid3x3,
  heap: Triangle,
}

const SPEEDS = [0.25, 0.5, 1, 2, 4]

// ─── Visualizer Renderer ─────────────────────────────────
function VisualizerContent({ selectedPattern, currentStepData, inputValue, steps, currentStep, error }) {
  if (steps.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-slate-600 gap-3">
        <AlertCircle className="w-8 h-8 text-slate-600" />
        <p className="text-xs text-center">Select a pattern and enter input to visualize</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-red-400 gap-3">
        <AlertCircle className="w-8 h-8" />
        <p className="text-xs text-center">{error}</p>
      </div>
    )
  }
  if (!selectedPattern) return null

  switch (selectedPattern.visualizer) {
    case 'array':
      return <ArrayVisualizer array={parseArrayInput(inputValue)} step={currentStepData} />
    case 'tree':
      return <TreeVisualizer root={parseTreeInput(inputValue)} step={currentStepData} />
    case 'graph':
      return (
        <GraphVisualizer
          adjList={parseAdjList(inputValue)}
          steps={steps}
          currentStep={currentStep}
        />
      )
    case 'stack':
      return <StackQueueVisualizer items={parseArrayInput(inputValue) || [10,20,30,40,50]} mode="stack" />
    case 'queue':
      return <StackQueueVisualizer items={parseArrayInput(inputValue) || [10,20,30,40,50]} mode="queue" />
    case 'recursion':
      return <RecursionTreeVisualizer steps={steps} />
    case 'string':
      return <StringVisualizer text={inputValue} step={currentStepData} />
    case 'matrix':
      return <MatrixVisualizer matrix={(() => { try { return inputValue ? JSON.parse(inputValue) : [[]] } catch { return [[]] } })()} step={currentStepData} />
    case 'linkedlist':
      return <LinkedListVisualizer array={parseArrayInput(inputValue)} step={currentStepData} />
    default:
      return (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500 gap-2">
          <BarChart3 className="w-8 h-8" />
          <p className="text-xs">{selectedPattern.label}</p>
        </div>
      )
  }
}

// ─── Playback Controls ────────────────────────────────────
function PlaybackControls({
  steps, currentStep, isPlaying, speed, setSpeed,
  onPlayPause, onReset, onStepForward, onStepBackward,
}) {
  if (steps.length === 0) return null

  return (
    <div className="flex items-center justify-between px-2 py-1.5 border-t border-dark-600 bg-dark-800/30 flex-shrink-0">
      <div className="flex items-center gap-1">
        <button onClick={onReset} className="p-1 rounded-md hover:bg-dark-600 text-slate-400 hover:text-white transition-colors" title="Reset" aria-label="Reset visualization">
          <RotateCcw className="w-3 h-3" />
        </button>
        <button onClick={onStepBackward} disabled={currentStep <= 0} className="p-1 rounded-md hover:bg-dark-600 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="Step Back" aria-label="Step backward one frame">
          <SkipBack className="w-3 h-3" />
        </button>
        <button onClick={onPlayPause} className="p-1 px-2 rounded-md bg-primary-600 hover:bg-primary-500 text-white transition-colors flex items-center gap-1" title={isPlaying ? 'Pause' : 'Play'} aria-label={isPlaying ? 'Pause playback' : 'Play visualization'}>
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button onClick={onStepForward} disabled={currentStep >= steps.length - 1} className="p-1 rounded-md hover:bg-dark-600 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="Step Forward" aria-label="Step forward one frame">
          <SkipForward className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-mono">
          {currentStep + 1} / {steps.length}
        </span>
        <div className="flex items-center gap-0.5 rounded-md border border-dark-600 bg-dark-700 overflow-hidden">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={clsx(
                'text-[9px] font-mono px-1 py-0.5 transition-colors',
                speed === s ? 'bg-primary-600/30 text-primary-400' : 'text-slate-400/70 hover:text-white'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      {currentStep > 0 && steps[currentStep]?.label && (
        <span className="text-[9px] text-slate-500 truncate max-w-[120px] hidden md:block">
          {steps[currentStep].label}
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function VisualizationPanel({ problem, code, language, testInput, open, onToggle }) {
  const [selectedPatternId, setSelectedPatternId] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showBrowser, setShowBrowser] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  // Auto-populate from test data when available
  useEffect(() => {
    if (testInput && !inputValue && !selectedPatternId) {
      setInputValue(testInput)
    }
  }, [testInput, selectedPatternId])

  // ─── Auto-select pattern from problem.patternId ─────────────────
  useEffect(() => {
    if (problem?.patternId && problem.patternId !== selectedPatternId) {
      handleSelectPattern(problem.patternId)
    }
  }, [problem?.patternId])

  // Handle pattern selection
  function handleSelectPattern(patternId) {
    setSelectedPatternId(patternId)
    setError(null)
    const meta = PATTERN_LOOKUP[patternId]
    if (meta?.defaultInput) {
      setInputValue(meta.defaultInput.replace(/^"(.*)"$/, '$1'))
    }
    setCurrentStep(0)
    setIsPlaying(false)
    setShowBrowser(false)
  }

  // Generate steps when pattern or input changes
  useEffect(() => {
    if (!selectedPatternId) {
      setSteps([])
      return
    }
    try {
      const generator = getStepGenerator(selectedPatternId)
      const meta = PATTERN_LOOKUP[selectedPatternId]
      let parsed = inputValue
      if (meta) {
        switch (meta.visualizer) {
          case 'array': parsed = parseArrayInput(inputValue); break
          case 'tree':  parsed = parseTreeInput(inputValue); break
          case 'graph':  parsed = parseAdjList(inputValue); break
          case 'matrix': parsed = parseArrayInput(inputValue); break
          default:       parsed = inputValue
        }
      }
      const generated = generator(parsed)
      setSteps(generated || [])
      setCurrentStep(0)
      setIsPlaying(false)
      setError(null)
    } catch (err) {
      console.error('Step generation error:', err)
      setError(err.message || 'Failed to generate visualization steps')
      setSteps([])
    }
  }, [selectedPatternId, inputValue])

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(100, 2000 / speed)
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, delay)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, steps.length])

  function handlePlayPause() {
    if (currentStep >= steps.length - 1) setCurrentStep(0)
    setIsPlaying(v => !v)
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setIsPlaying(false)
    setCurrentStep(0)
  }

  function handleStepForward() {
    clearInterval(intervalRef.current)
    setIsPlaying(false)
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  function handleStepBackward() {
    clearInterval(intervalRef.current)
    setIsPlaying(false)
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  function handleStepClick(idx) {
    clearInterval(intervalRef.current)
    setIsPlaying(false)
    setCurrentStep(idx)
  }

  const currentStepData = steps[currentStep] || null
  const selectedPattern = selectedPatternId ? PATTERN_LOOKUP[selectedPatternId] : null
  const VisualizerIcon = selectedPattern ? VISUALIZER_ICONS[selectedPattern.visualizer] || BarChart3 : null

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="flex h-full bg-dark-900">
      {/* Left — Category Browser (collapsible sidebar) */}
      <motion.div
        animate={{ width: showBrowser ? 260 : 0 }}
        className="border-r border-dark-600 overflow-hidden bg-dark-800/50 flex-shrink-0 z-10"
      >
        <div className="w-[260px] h-full">
          <CategoryBrowser
            selectedPatternId={selectedPatternId}
            onSelectPattern={handleSelectPattern}
          />
        </div>
      </motion.div>

      {/* Main area — 2×2 Grid */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ─── Header Bar ───────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-dark-600 bg-dark-800/40 flex-shrink-0 h-10">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowBrowser(v => !v)}
              className="p-1 rounded text-slate-500 hover:text-white hover:bg-dark-600 transition-colors"
              title={showBrowser ? 'Hide browser' : 'Show browser'}
              aria-label={showBrowser ? 'Hide category browser sidebar' : 'Show category browser sidebar'}
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
            {selectedPattern ? (
              <div className="flex items-center gap-2 min-w-0">
                <VisualizerIcon className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-200 truncate">{selectedPattern.label}</span>
                <span className="text-[9px] text-slate-500 px-1.5 py-0.5 rounded bg-dark-600 font-mono hidden sm:inline">
                  {selectedPattern.categoryLabel}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">Select a pattern from the browser</span>
            )}
          </div>

          {/* Right side: AlgoGuru Quick Actions + Step counter */}
          <div className="flex items-center gap-2">
            {selectedPatternId && (
              <AlgoGuruQuickActions
                patternId={selectedPatternId}
                patternLabel={selectedPattern?.label}
                code={code}
                visualizerType={selectedPattern?.visualizer}
              />
            )}
            {steps.length > 0 && (
              <span className="text-[10px] text-slate-500 bg-dark-700 px-2 py-0.5 rounded-full font-mono border border-dark-500">
                {currentStep + 1} / {steps.length} steps
              </span>
            )}
          </div>
        </div>

        {/* ─── 2×2 Grid ──────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 min-h-0 overflow-hidden gap-0" role="group" aria-label="Visualization panels">
          {/* ── Panel 1: Visualization (Top-Left) ────────── */}
          <section className="flex flex-col min-h-0 border-r border-b border-dark-600 overflow-hidden relative" aria-label="Algorithm visualization area">
            {/* Panel label */}
            <div className="absolute top-1.5 left-2 z-10">
              <span className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold bg-dark-900/60 px-1.5 py-0.5 rounded">
                Viz
              </span>
            </div>

            {/* Visualizer content */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col items-center justify-center min-h-0 scrollbar-thin scrollbar-thumb-dark-500">
              <VisualizerContent
                selectedPattern={selectedPattern}
                currentStepData={currentStepData}
                inputValue={inputValue}
                steps={steps}
                currentStep={currentStep}
                error={error}
              />
            </div>

            {/* Playback controls */}
            <PlaybackControls
              steps={steps}
              currentStep={currentStep}
              isPlaying={isPlaying}
              speed={speed}
              setSpeed={setSpeed}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
            />
          </section>

          {/* ── Panel 2: Step Trace (Top-Right) ──────────── */}
          <section className="flex flex-col min-h-0 border-b border-dark-600 overflow-hidden" aria-label="Execution step trace">
            <StepTracePanel
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </section>

          {/* ── Panel 3: Code Panel (Bottom-Left) ────────── */}
          <section className="flex flex-col min-h-0 border-r border-dark-600 overflow-hidden" aria-label="Algorithm code panel">
            <CodePanel
              patternId={selectedPatternId}
              code={code}
              currentStep={currentStep}
              steps={steps}
              visualizerType={selectedPattern?.visualizer}
            />
          </section>

          {/* ── Panel 4: Quiz / Practice Lab (Bottom-Right) ── */}
          <section className="flex flex-col min-h-0 overflow-hidden" aria-label="Practice lab for testing inputs">
            <QuizPanel
              patternId={selectedPatternId}
              patternMeta={selectedPattern}
              problem={problem}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onGenerate={() => {
                // Force regeneration by toggling input (triggers the useEffect)
                setInputValue(prev => prev)
              }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
