import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ConfidenceBadge,
  FeedbackButtons,
  AiHintsTab,
} from '@/components/ai/AiComponents'

// ─── ConfidenceBadge ──────────────────────────────────────────────

describe('ConfidenceBadge', () => {
  it('renders high confidence with emerald color', () => {
    render(<ConfidenceBadge confidence={0.95} />)
    expect(screen.getByText('95% Confident')).toBeInTheDocument()
    const shield = document.querySelector('.text-emerald-400')
    expect(shield).toBeInTheDocument()
  })

  it('renders medium confidence with yellow color', () => {
    render(<ConfidenceBadge confidence={0.7} />)
    expect(screen.getByText('70% Confident')).toBeInTheDocument()
    const shield = document.querySelector('.text-yellow-400')
    expect(shield).toBeInTheDocument()
  })

  it('renders low confidence with red color', () => {
    render(<ConfidenceBadge confidence={0.3} />)
    expect(screen.getByText('30% Confident')).toBeInTheDocument()
    const shield = document.querySelector('.text-red-400')
    expect(shield).toBeInTheDocument()
  })

  it('handles missing confidence value gracefully', () => {
    render(<ConfidenceBadge confidence={null} />)
    expect(screen.getByText('0% Confident')).toBeInTheDocument()
  })

  it('renders progress bar with correct width', () => {
    render(<ConfidenceBadge confidence={0.85} />)
    const bar = document.querySelector('[style*="width: 85%"]')
    expect(bar).toBeInTheDocument()
  })

  it('rounds confidence percentage correctly', () => {
    render(<ConfidenceBadge confidence={0.6667} />)
    expect(screen.getByText('67% Confident')).toBeInTheDocument()
  })
})

// ─── FeedbackButtons ──────────────────────────────────────────────

describe('FeedbackButtons', () => {
  it('renders three feedback buttons', () => {
    render(<FeedbackButtons feedbackGiven={null} onFeedback={() => {}} />)
    expect(screen.getByTitle('Helpful')).toBeInTheDocument()
    expect(screen.getByTitle('Not helpful')).toBeInTheDocument()
    expect(screen.getByTitle('Needs correction')).toBeInTheDocument()
  })

  it('shows "Helpful?" label', () => {
    render(<FeedbackButtons feedbackGiven={null} onFeedback={() => {}} />)
    expect(screen.getByText('Helpful?')).toBeInTheDocument()
  })

  it('calls onFeedback with "helpful" when thumbs up clicked', () => {
    const onFeedback = vi.fn()
    render(<FeedbackButtons feedbackGiven={null} onFeedback={onFeedback} />)
    fireEvent.click(screen.getByTitle('Helpful'))
    expect(onFeedback).toHaveBeenCalledWith('helpful')
  })

  it('calls onFeedback with "unhelpful" when thumbs down clicked', () => {
    const onFeedback = vi.fn()
    render(<FeedbackButtons feedbackGiven={null} onFeedback={onFeedback} />)
    fireEvent.click(screen.getByTitle('Not helpful'))
    expect(onFeedback).toHaveBeenCalledWith('unhelpful')
  })

  it('calls onFeedback with "needs_correction" when pen tool clicked', () => {
    const onFeedback = vi.fn()
    render(<FeedbackButtons feedbackGiven={null} onFeedback={onFeedback} />)
    fireEvent.click(screen.getByTitle('Needs correction'))
    expect(onFeedback).toHaveBeenCalledWith('needs_correction')
  })

  it('disables all buttons after feedback is given', () => {
    render(<FeedbackButtons feedbackGiven="helpful" onFeedback={() => {}} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('highlights the given feedback button', () => {
    render(<FeedbackButtons feedbackGiven="helpful" onFeedback={() => {}} />)
    const helpfulBtn = screen.getByTitle('Helpful')
    expect(helpfulBtn.className).toContain('bg-emerald-500/20')
  })

  it('does not call onFeedback when already given feedback', () => {
    const onFeedback = vi.fn()
    render(<FeedbackButtons feedbackGiven="unhelpful" onFeedback={onFeedback} />)
    fireEvent.click(screen.getByTitle('Helpful'))
    expect(onFeedback).not.toHaveBeenCalled()
  })
})

// ─── AiHintsTab ───────────────────────────────────────────────────

describe('AiHintsTab', () => {
  const defaultProps = {
    hint: '',
    loading: false,
    onGetHint: vi.fn(),
    hintTier: 2,
    onHintTierChange: vi.fn(),
    aiResult: null,
    feedbackGiven: null,
    onFeedback: vi.fn(),
  }

  it('renders tier selector with 3 levels', () => {
    render(<AiHintsTab {...defaultProps} />)
    expect(screen.getByText('L1')).toBeInTheDocument()
    expect(screen.getByText('L2')).toBeInTheDocument()
    expect(screen.getByText('L3')).toBeInTheDocument()
    expect(screen.getByText('Subtle')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('Explicit')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<AiHintsTab {...defaultProps} />)
    expect(
      screen.getByText(/Get an AI-generated hint tailored to this problem/)
    ).toBeInTheDocument()
  })

  it('renders "Get Moderate Hint" button by default (level 2)', () => {
    render(<AiHintsTab {...defaultProps} />)
    expect(screen.getByText('Get Moderate Hint')).toBeInTheDocument()
  })

  it('shows correct button text for level 1', () => {
    render(<AiHintsTab {...defaultProps} hintTier={1} />)
    expect(screen.getByText('Get Subtle Hint')).toBeInTheDocument()
  })

  it('shows correct button text for level 3', () => {
    render(<AiHintsTab {...defaultProps} hintTier={3} />)
    expect(screen.getByText('Get Explicit Hint')).toBeInTheDocument()
  })

  it('calls onHintTierChange when a tier button is clicked', () => {
    const onHintTierChange = vi.fn()
    render(<AiHintsTab {...defaultProps} onHintTierChange={onHintTierChange} />)
    fireEvent.click(screen.getByText('L1'))
    expect(onHintTierChange).toHaveBeenCalledWith(1)
  })

  it('calls onGetHint when the get hint button is clicked', () => {
    const onGetHint = vi.fn()
    render(<AiHintsTab {...defaultProps} onGetHint={onGetHint} />)
    fireEvent.click(screen.getByText('Get Moderate Hint'))
    expect(onGetHint).toHaveBeenCalled()
  })

  it('shows spinner when loading', () => {
    render(<AiHintsTab {...defaultProps} loading={true} />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('disables buttons when loading', () => {
    render(<AiHintsTab {...defaultProps} loading={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('displays hint text when provided', () => {
    render(<AiHintsTab {...defaultProps} hint="Use a hash map for O(1) lookups" />)
    expect(
      screen.getByText('Use a hash map for O(1) lookups')
    ).toBeInTheDocument()
  })

  it('does not show hint container when hint is empty', () => {
    const { container } = render(<AiHintsTab {...defaultProps} hint="" />)
    const bgDark700Elements = container.querySelectorAll('.bg-dark-700')
    // No hint box should render
    expect(bgDark700Elements.length).toBe(0)
  })

  it('renders ConfidenceBadge when aiResult is provided', () => {
    const aiResult = {
      confidence: 0.9,
      humanAction: 'NONE',
      humanActionReason: '',
      evidenceMap: [],
      gapsOrRisks: [],
      assumptions: [],
      hintLevel: 2,
      nextBestAction: '',
      query: 'test',
    }
    render(
      <AiHintsTab {...defaultProps} hint="Some hint" aiResult={aiResult} />
    )
    expect(screen.getByText('90% Confident')).toBeInTheDocument()
  })

  it('renders FeedbackButtons when hint and aiResult are provided', () => {
    const aiResult = {
      confidence: 0.9,
      humanAction: 'NONE',
      humanActionReason: '',
      evidenceMap: [],
      gapsOrRisks: [],
      assumptions: [],
      hintLevel: 2,
      nextBestAction: '',
      query: 'test',
    }
    render(
      <AiHintsTab
        {...defaultProps}
        hint="Some hint"
        aiResult={aiResult}
      />
    )
    expect(screen.getByText('Helpful?')).toBeInTheDocument()
  })

  it('highlights the selected tier', () => {
    render(<AiHintsTab {...defaultProps} hintTier={3} />)
    const l3Btn = screen.getByText('L3').closest('button')
    expect(l3Btn.className).toContain('border-accent-500')
  })
})
