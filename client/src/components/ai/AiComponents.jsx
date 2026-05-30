import { useState } from 'react'
import {
  Loader2,
  Lightbulb,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  BookOpen,
  Zap,
  Shield,
  Flag,
  PenTool,
  ChevronDown,
} from 'lucide-react'

// ─── Shared AI Response Components ────────────────────────────────

export function ConfidenceBadge({ confidence }) {
  const pct = Math.round((confidence ?? 0) * 100)
  return (
    <div className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium">
      <Shield className={`h-3 w-3 ${pct >= 90 ? 'text-emerald-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`} />
      <span>{pct}% Confident</span>
      <div className="ml-1 h-1.5 w-10 rounded-full bg-dark-600 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 90 ? 'bg-emerald-400' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function HumanActionBadge({ action, reason }) {
  if (action === 'NONE') return null
  const config = {
    VERIFY: {
      icon: AlertTriangle,
      text: 'Needs Verification',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    ESCALATE: {
      icon: Flag,
      text: 'Escalated to Human',
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  }
  const c = config[action] || config.ESCALATE
  const Icon = c.icon
  return (
    <div className={`rounded-md border px-2 py-1.5 text-xs ${c.color}`}>
      <div className="flex items-center gap-1.5 font-medium">
        <Icon className="h-3 w-3" />
        <span>{c.text}</span>
      </div>
      {reason && <p className="mt-0.5 text-xs opacity-80">{reason}</p>}
    </div>
  )
}

export function EvidenceMap({ evidenceMap }) {
  const [open, setOpen] = useState(false)
  if (!evidenceMap?.length) return null
  return (
    <div className="rounded-md border border-dark-500 bg-dark-700/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3 text-accent-400" />
          Citations ({evidenceMap.length})
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-dark-500 px-2 py-1.5 space-y-1">
          {evidenceMap.map((ev, idx) => (
            <p key={idx} className="text-xs text-slate-400 leading-relaxed">
              • {ev}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function NextBestAction({ action }) {
  if (!action) return null
  return (
    <div className="flex items-start gap-1.5 rounded-md bg-primary-500/10 border border-primary-500/20 px-2 py-1.5">
      <Zap className="h-3 w-3 text-primary-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-primary-300">{action}</p>
    </div>
  )
}

export function FeedbackButtons({ feedbackGiven, onFeedback }) {
  return (
    <div className="flex items-center gap-1 border-t border-dark-600 pt-2 mt-2">
      <span className="text-xs text-slate-500 mr-1">Helpful?</span>
      <button
        onClick={() => onFeedback('helpful')}
        disabled={!!feedbackGiven}
        className={`rounded p-1 transition-colors ${
          feedbackGiven === 'helpful'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'
        } disabled:opacity-50`}
        title="Helpful"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onFeedback('unhelpful')}
        disabled={!!feedbackGiven}
        className={`rounded p-1 transition-colors ${
          feedbackGiven === 'unhelpful'
            ? 'bg-red-500/20 text-red-400'
            : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
        } disabled:opacity-50`}
        title="Not helpful"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onFeedback('needs_correction')}
        disabled={!!feedbackGiven}
        className={`rounded p-1 transition-colors ${
          feedbackGiven === 'needs_correction'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10'
        } disabled:opacity-50`}
        title="Needs correction"
      >
        <PenTool className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── AI Tab Sub-components ────────────────────────────────────────

export function AiHintsTab({ hint, loading, onGetHint, hintTier, onHintTierChange, aiResult, feedbackGiven, onFeedback }) {
  const TIERS = [
    { level: 1, label: 'Subtle', desc: 'Abstract guidance' },
    { level: 2, label: 'Moderate', desc: 'Direction + approach' },
    { level: 3, label: 'Explicit', desc: 'Step-by-step outline' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        Get an AI-generated hint tailored to this problem. Choose your hint depth:
      </p>

      {/* Hint Tier Selector */}
      <div className="grid grid-cols-3 gap-1">
        {TIERS.map((t) => (
          <button
            key={t.level}
            onClick={() => onHintTierChange(t.level)}
            disabled={loading}
            className={`rounded-lg border px-2 py-1.5 text-xs transition-colors ${
              hintTier === t.level
                ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                : 'border-dark-500 text-slate-400 hover:border-dark-400 hover:text-slate-300'
            }`}
          >
            <span className="font-medium">L{t.level}</span>
            <p className="text-[10px] opacity-70">{t.label}</p>
          </button>
        ))}
      </div>

      <button
        onClick={onGetHint}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="h-4 w-4" />
        )}
        Get {TIERS.find((t) => t.level === hintTier)?.label || ''} Hint
      </button>

      {hint && (
        <>
          <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed">
            {hint}
          </div>

          {/* HITL Response Display */}
          {aiResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ConfidenceBadge confidence={aiResult.confidence} />
                <HumanActionBadge action={aiResult.humanAction} reason={aiResult.humanActionReason} />
              </div>
              <EvidenceMap evidenceMap={aiResult.evidenceMap} />
              <NextBestAction action={aiResult.nextBestAction} />
              <FeedbackButtons feedbackGiven={feedbackGiven} onFeedback={onFeedback} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function AiAskTab({ question, setQuestion, answer, loading, onAsk, aiResult, feedbackGiven, onFeedback }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">Ask anything about this problem or DSA concepts.</p>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What data structure should I use?"
        rows={3}
        className="w-full rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-500 resize-none"
      />
      <button
        onClick={onAsk}
        disabled={loading || !question.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        Ask AlgoGuru
      </button>
      {answer && (
        <>
          <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>

          {/* HITL Response Display */}
          {aiResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ConfidenceBadge confidence={aiResult.confidence} />
                <HumanActionBadge action={aiResult.humanAction} reason={aiResult.humanActionReason} />
              </div>
              <EvidenceMap evidenceMap={aiResult.evidenceMap} />
              <NextBestAction action={aiResult.nextBestAction} />
              <FeedbackButtons feedbackGiven={feedbackGiven} onFeedback={onFeedback} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function AiReviewTab({ review, loading, onReview, aiResult, feedbackGiven, onFeedback }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        Get AI feedback on your current code — correctness, efficiency & best practices.
      </p>
      <button
        onClick={onReview}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        Review My Code
      </button>
      {review && (
        <>
          <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {review}
          </div>

          {/* HITL Response Display */}
          {aiResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ConfidenceBadge confidence={aiResult.confidence} />
                <HumanActionBadge action={aiResult.humanAction} reason={aiResult.humanActionReason} />
              </div>
              <EvidenceMap evidenceMap={aiResult.evidenceMap} />
              <NextBestAction action={aiResult.nextBestAction} />
              <FeedbackButtons feedbackGiven={feedbackGiven} onFeedback={onFeedback} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
