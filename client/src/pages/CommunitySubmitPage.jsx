import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Send, ArrowLeft, Plus, Trash2, Loader2,
  Lightbulb, FileText, Code2, AlertCircle,
  CheckCircle, XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../lib/api'

const TRACKS = ['DSA', 'RealWorld']
const TOPICS = {
  DSA: ['Arrays', 'Strings', 'LinkedList', 'Stack', 'Queue', 'Trees', 'BST',
        'Graphs', 'DynamicProgramming', 'Recursion', 'Sorting', 'Searching',
        'Hashing', 'Greedy', 'Backtracking', 'Trie', 'Heap'],
  RealWorld: ['SystemDesign', 'DatabaseOptimization', 'APIDesign', 'Scalability', 'Architecture'],
}
const DIFFICULTIES = ['Rookie', 'Warrior', 'Legend']
const LANGUAGES = ['cpp', 'java', 'python', 'javascript']

function ExampleBlock({ example, index, onChange, onRemove }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">Example {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Input</label>
          <textarea
            value={example.input}
            onChange={(e) => onChange(index, 'input', e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
            rows={2}
            placeholder="nums = [1, 2, 3]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Output</label>
          <textarea
            value={example.output}
            onChange={(e) => onChange(index, 'output', e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
            rows={2}
            placeholder="6"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Explanation</label>
          <textarea
            value={example.explanation}
            onChange={(e) => onChange(index, 'explanation', e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
            rows={2}
            placeholder="Optional explanation..."
          />
        </div>
      </div>
    </div>
  )
}

function TestCaseBlock({ tc, index, onChange, onRemove }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">
          Test Case {index + 1}
          {tc.isHidden && <span className="ml-2 text-xs text-amber-400">(Hidden)</span>}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={tc.isHidden}
              onChange={(e) => onChange(index, 'isHidden', e.target.checked)}
              className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
            />
            Hidden
          </label>
          <button onClick={onRemove} className="text-red-400 hover:text-red-300 transition-colors p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Input</label>
          <textarea
            value={tc.input}
            onChange={(e) => onChange(index, 'input', e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
            rows={2}
            placeholder="nums = [1, 2, 3]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Expected Output</label>
          <textarea
            value={tc.output}
            onChange={(e) => onChange(index, 'output', e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-600 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
            rows={2}
            placeholder="6"
          />
        </div>
      </div>
    </div>
  )
}

export default function CommunitySubmitPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    track: 'DSA',
    topic: 'Arrays',
    difficulty: 'Rookie',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', output: '', isHidden: false }],
    hints: [''],
    editorialLink: '',
    xpReward: 50,
  })
  const [starterCode, setStarterCode] = useState({
    cpp: '',
    java: '',
    python: '',
    javascript: '',
  })

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateExample = (index, field, value) => {
    const examples = [...form.examples]
    examples[index] = { ...examples[index], [field]: value }
    updateForm('examples', examples)
  }

  const addExample = () => {
    updateForm('examples', [...form.examples, { input: '', output: '', explanation: '' }])
  }

  const removeExample = (index) => {
    if (form.examples.length <= 1) return
    updateForm('examples', form.examples.filter((_, i) => i !== index))
  }

  const updateTestCase = (index, field, value) => {
    const testCases = [...form.testCases]
    testCases[index] = { ...testCases[index], [field]: value }
    updateForm('testCases', testCases)
  }

  const addTestCase = () => {
    updateForm('testCases', [...form.testCases, { input: '', output: '', isHidden: false }])
  }

  const removeTestCase = (index) => {
    if (form.testCases.length <= 1) return
    updateForm('testCases', form.testCases.filter((_, i) => i !== index))
  }

  const updateHint = (index, value) => {
    const hints = [...form.hints]
    hints[index] = value
    updateForm('hints', hints)
  }

  const addHint = () => {
    updateForm('hints', [...form.hints, ''])
  }

  const removeHint = (index) => {
    if (form.hints.length <= 1) return
    updateForm('hints', form.hints.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required!')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        hints: form.hints.filter(h => h.trim()),
        starterCode,
      }
      await api.post('/community/submit', payload)
      setSubmitted(true)
      toast.success('🎉 Problem submitted for review!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to submit problem')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-white">Submitted Successfully! 🎉</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Your problem is now in the review queue. A professor or admin will review it and 
          if approved, it will be published as a community problem. You'll earn XP for accepted contributions!
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/community')}
            className="px-5 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Browse Community Problems
          </button>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({
                title: '', description: '', track: 'DSA', topic: 'Arrays',
                difficulty: 'Rookie', constraints: '',
                examples: [{ input: '', output: '', explanation: '' }],
                testCases: [{ input: '', output: '', isHidden: false }],
                hints: [''], editorialLink: '', xpReward: 50,
              })
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary-400" />
            Submit a Community Problem
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Contribute to the community! Your problem will be reviewed by a professor before publication.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Basic Info ─────────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" /> Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="e.g. Maximum Subarray Sum"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Markdown) *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
              rows={6}
              placeholder="Describe the problem, input format, output format, and any constraints..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Track *</label>
              <select
                value={form.track}
                onChange={(e) => {
                  const track = e.target.value
                  const topics = TOPICS[track]
                  updateForm('track', track)
                  updateForm('topic', topics[0])
                }}
                className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              >
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Topic *</label>
              <select
                value={form.topic}
                onChange={(e) => updateForm('topic', e.target.value)}
                className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              >
                {TOPICS[form.track].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Difficulty *</label>
              <select
                value={form.difficulty}
                onChange={(e) => updateForm('difficulty', e.target.value)}
                className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Constraints</label>
              <textarea
                value={form.constraints}
                onChange={(e) => updateForm('constraints', e.target.value)}
                className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
                rows={2}
                placeholder="1 <= nums.length <= 10^5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">XP Reward</label>
              <input
                type="number"
                value={form.xpReward}
                onChange={(e) => updateForm('xpReward', Math.min(200, Math.max(10, parseInt(e.target.value) || 10)))}
                className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                min={10}
                max={200}
              />
              <p className="text-xs text-slate-500 mt-1">Max 200 XP per problem</p>
            </div>
          </div>
        </section>

        {/* ── Examples ───────────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> Examples
            </h2>
            <button
              type="button"
              onClick={addExample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Example
            </button>
          </div>
          <div className="space-y-3">
            {form.examples.map((ex, i) => (
              <ExampleBlock
                key={i}
                example={ex}
                index={i}
                onChange={updateExample}
                onRemove={() => removeExample(i)}
              />
            ))}
          </div>
        </section>

        {/* ── Test Cases ─────────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Test Cases
            </h2>
            <button
              type="button"
              onClick={addTestCase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Test Case
            </button>
          </div>
          <div className="space-y-3">
            {form.testCases.map((tc, i) => (
              <TestCaseBlock
                key={i}
                tc={tc}
                index={i}
                onChange={updateTestCase}
                onRemove={() => removeTestCase(i)}
              />
            ))}
          </div>
        </section>

        {/* ── Hints ──────────────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-400" /> Hints
            </h2>
            <button
              type="button"
              onClick={addHint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hint
            </button>
          </div>
          <div className="space-y-2">
            {form.hints.map((hint, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => updateHint(i, e.target.value)}
                  className="flex-1 rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors text-sm"
                  placeholder={`Hint ${i + 1}...`}
                />
                {form.hints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHint(i)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Starter Code ───────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" /> Starter Code (Optional)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LANGUAGES.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">{lang}</label>
                <textarea
                  value={starterCode[lang]}
                  onChange={(e) => setStarterCode(prev => ({ ...prev, [lang]: e.target.value }))}
                  className="w-full rounded-xl bg-dark-900 border border-dark-600 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-mono text-xs"
                  rows={4}
                  placeholder={`// Starter code for ${lang}...`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial Link ─────────────────────────── */}
        <section className="bg-dark-800/50 border border-dark-600/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Editorial / Reference Link
          </h2>
          <input
            type="url"
            value={form.editorialLink}
            onChange={(e) => updateForm('editorialLink', e.target.value)}
            className="w-full rounded-xl bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="https://..."
          />
        </section>

        {/* ── Guidelines Alert ───────────────────────── */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Submission Guidelines</p>
            <ul className="text-xs text-amber-200/70 mt-1 space-y-1 list-disc list-inside">
              <li>Make sure the problem is original or properly attributed</li>
              <li>Test cases should be accurate with correct expected outputs</li>
              <li>Include at least 2 examples to help others understand</li>
              <li>Professionals review each submission before publishing</li>
              <li>You earn XP when your problem gets approved! 🎉</li>
            </ul>
          </div>
        </div>

        {/* ── Submit Button ──────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit for Review</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
