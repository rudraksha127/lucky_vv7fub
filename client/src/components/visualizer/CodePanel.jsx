import { useMemo } from 'react'
import { getCodeTemplate, getHighlightedLines } from './patternCodeTemplates'
import { getComplexity } from './timeComplexity'

// Simple syntax highlighting tokens for Python
// Simple tokenizer: classify each line by splitting on whitespace and special chars
function tokenizePython(line) {
  if (!line) return []
  const tokens = []
  // Match tokens: keywords, identifiers, numbers, strings, comments, operators, brackets
  const tokenRe = /(""".*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*'|#[^\n]*|\b\d+\.?\d*\b|\b(?:def|class|if|elif|else|for|while|return|import|from|in|not|and|or|True|False|None|break|continue|try|except|finally|with|as|pass|raise|yield|lambda|self|range|len|print|max|min|sum|abs|sorted|reversed|enumerate|zip|map|filter|int|float|str|list|dict|set|tuple|type|is|del)\b|[(){}\[\]]|\S+)/g

  let match
  while ((match = tokenRe.exec(line)) !== null) {
    const token = match[0]
    if (/^\b(?:def|class|if|elif|else|for|while|return|import|from|in|not|and|or|True|False|None|break|continue|try|except|finally|with|as|pass|raise|yield|lambda|self|range|len|print|max|min|sum|abs|sorted|reversed|enumerate|zip|map|filter|int|float|str|list|dict|set|tuple|type|is|del)\b$/.test(token)) {
      tokens.push({ text: token, type: 'keyword' })
    } else if (/^#/.test(token) || /^"""/.test(token) || /^'''/.test(token)) {
      tokens.push({ text: token, type: 'comment' })
    } else if (/^["']/.test(token)) {
      tokens.push({ text: token, type: 'string' })
    } else if (/^\d+\.?\d*$/.test(token)) {
      tokens.push({ text: token, type: 'number' })
    } else if (/^[(){}\[\]]$/.test(token)) {
      tokens.push({ text: token, type: 'bracket' })
    } else {
      tokens.push({ text: token, type: 'plain' })
    }
  }
  return tokens
}

const TOKEN_COLORS = {
  keyword: 'text-purple-400',
  comment: 'text-slate-500 italic',
  string:  'text-emerald-400',
  number:  'text-orange-400',
  bracket: 'text-slate-400',
  plain:   'text-slate-300',
}

function CodeLine({ lineNum, code, isHighlighted, isActive }) {
  const tokens = useMemo(() => tokenizePython(code), [code])

  return (
    <div
      className={`
        flex items-stretch font-mono text-[11px] leading-6 transition-all duration-150
        ${isActive
          ? 'bg-primary-500/20 border-l-2 border-l-primary-400'
          : isHighlighted
            ? 'bg-primary-500/10 border-l-2 border-l-primary-500/40'
            : 'border-l-2 border-l-transparent hover:bg-dark-800/30'
        }
      `}
    >
      <span className={`
        flex-shrink-0 w-10 text-right pr-3 select-none text-[10px]
        ${isActive ? 'text-primary-300 font-bold' : 'text-slate-600'}
      `}>
        {lineNum}
      </span>
      <div className="flex-1 whitespace-pre px-1 truncate">
        {tokens.map((token, i) => (
          <span key={i} className={TOKEN_COLORS[token.type] || 'text-slate-300'}>
            {token.text}
          </span>
        ))}
      </div>
      {isActive && (
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse mt-2.5 mr-2" />
      )}
    </div>
  )
}

const COMPLEXITY_LABELS = {
  best: { label: 'Best', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  avg:  { label: 'Avg',  color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  worst:{ label: 'Worst',color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  space:{ label: 'Space',color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
}

export default function CodePanel({ patternId, code, currentStep, steps, visualizerType }) {
  // If explicit `code` is provided (e.g. from problem.starterCode), use it
  const displayCode = code || null

  const template = useMemo(() => {
    if (displayCode) return null
    if (!patternId) return null
    return getCodeTemplate(patternId, visualizerType)
  }, [patternId, visualizerType, displayCode])

  const complexity = useMemo(() => {
    if (!patternId) return null
    return getComplexity(patternId)
  }, [patternId])

  const highlightedLines = useMemo(() => {
    if (!patternId || !steps || !steps[currentStep]) return []
    const lines = getHighlightedLines(patternId, steps[currentStep], visualizerType)
    return Array.isArray(lines) ? lines : []
  }, [patternId, currentStep, steps, visualizerType])

  if (!template && !displayCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 p-4">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
          <span className="text-xs">&lt;/&gt;</span>
        </div>
        <p className="text-[10px] text-center">Select a pattern to see the algorithm code</p>
      </div>
    )
  }

  const codeLines = displayCode
    ? displayCode.split('\n')
    : (template.codeLines || template.code.split('\n'))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-dark-600 bg-dark-800/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Code</span>
          <span className="text-[9px] text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded font-mono">
            {displayCode ? 'Problem Code' : template.language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {steps?.length > 0 && (
            <span className="text-[10px] text-slate-500 font-mono">
              Step <span className="text-primary-400">{currentStep + 1}</span>/{steps.length}
            </span>
          )}
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500 bg-dark-950/50">
        <div className="py-1">
          {codeLines.map((line, idx) => (
            <CodeLine
              key={idx}
              lineNum={idx + 1}
              code={line}
              isHighlighted={highlightedLines.includes(idx + 1)}
              isActive={
                steps?.[currentStep] &&
                highlightedLines.includes(idx + 1)
              }
            />
          ))}
        </div>
      </div>

      {/* Complexity badges + step counter footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-dark-600 bg-dark-800/30 flex-shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {complexity && Object.entries(COMPLEXITY_LABELS).map(([key, meta]) => {
            const val = complexity[key]
            if (!val || val === '—') return null
            return (
              <span
                key={key}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${meta.color} ${meta.bg} ${meta.border}`}
                title={`${meta.label}: ${val}`}
              >
                <span className="opacity-70">{meta.label}</span> {val}
              </span>
            )
          })}
        </div>
        {steps?.length > 0 && (
          <div className="flex items-center gap-1 text-[9px] text-slate-600">
            <span className="w-12 h-1.5 rounded-full bg-dark-600 overflow-hidden">
              <span
                className="block h-full rounded-full bg-primary-500/60 transition-all duration-200"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </span>
            <span className="font-mono">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
