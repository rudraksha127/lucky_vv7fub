import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Text, Link2, Layers, ListOrdered, Hash,
  ArrowUpDown, Search, GitBranch, Triangle, Share2,
  Grid3x3, Zap, Binary, Sigma, Type, Network, Building2,
  Split, Box, ChevronRight, ChevronDown, Search as SearchIcon,
} from 'lucide-react'
import clsx from 'clsx'
import ALL_CATEGORIES from './patternsData'

const ICON_MAP = {
  BarChart3, Text, Link2, Layers, ListOrdered, Hash,
  ArrowUpDown, Search, GitBranch, Triangle, Share2,
  Grid3x3, Zap, Binary, Sigma, Type, Network, Building2,
  Split, Box,
}

function getIcon(iconName) {
  const Icon = ICON_MAP[iconName]
  return Icon || Box
}

export default function CategoryBrowser({
  selectedPatternId,
  onSelectPattern,
  onBack,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [expandedSubCategories, setExpandedSubCategories] = useState({})

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  const toggleSubCategory = (subId) => {
    setExpandedSubCategories(prev => ({ ...prev, [subId]: !prev[subId] }))
  }

  // Filter patterns by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ALL_CATEGORIES

    const q = searchQuery.toLowerCase()
    return ALL_CATEGORIES.map(cat => ({
      ...cat,
      subCategories: cat.subCategories
        .map(sub => ({
          ...sub,
          patterns: sub.patterns.filter(p =>
            p.label.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            sub.label.toLowerCase().includes(q)
          ),
        }))
        .filter(sub => sub.patterns.length > 0),
    })).filter(cat => cat.subCategories.length > 0)
  }, [searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-dark-600 bg-dark-800/50">
        {onBack && (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search 738+ patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-dark-600 bg-dark-700 pl-7 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-500">
        {filteredCategories.map((cat) => {
          const CatIcon = getIcon(cat.icon)
          const isExpanded = expandedCategories[cat.id]

          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={clsx(
                  'flex items-center gap-2 w-full px-3 py-2 text-left transition-colors text-xs font-medium',
                  isExpanded
                    ? 'bg-dark-700 text-white border-l-2 border-primary-500'
                    : 'text-slate-400 hover:text-white hover:bg-dark-700/50 border-l-2 border-transparent'
                )}
              >
                <CatIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-1 truncate">{cat.label}</span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {cat.subCategories.reduce((s, sub) => s + sub.patterns.length, 0)}
                </span>
                <ChevronDown className={clsx(
                  'w-3 h-3 text-slate-500 transition-transform',
                  isExpanded && 'rotate-180'
                )} />
              </button>

              {/* Sub-categories */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {cat.subCategories.map((sub) => {
                      const isSubExpanded = expandedSubCategories[sub.id]

                      return (
                        <div key={sub.id}>
                          {/* Sub-category header */}
                          <button
                            onClick={() => toggleSubCategory(sub.id)}
                            className={clsx(
                              'flex items-center gap-2 w-full pl-8 pr-3 py-1.5 text-left transition-colors text-[11px]',
                              isSubExpanded
                                ? 'text-slate-300 bg-dark-700/50'
                                : 'text-slate-500 hover:text-slate-300'
                            )}
                          >
                            <ChevronRight className={clsx(
                              'w-2.5 h-2.5 transition-transform',
                              isSubExpanded && 'rotate-90'
                            )} />
                            <span className="flex-1 truncate">{sub.label}</span>
                            <span className="text-[9px] text-slate-600">{sub.patterns.length}</span>
                          </button>

                          {/* Pattern list */}
                          <AnimatePresence>
                            {isSubExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                {sub.patterns.map((p) => {
                                  const isSelected = selectedPatternId === p.id

                                  return (
                                    <button
                                      key={p.id}
                                      onClick={() => onSelectPattern(p.id, cat.id)}
                                      className={clsx(
                                        'flex items-center gap-2 w-full pl-12 pr-3 py-1 text-left transition-colors text-[11px]',
                                        isSelected
                                          ? 'text-primary-400 bg-primary-500/10 border-l-2 border-primary-500'
                                          : 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent'
                                      )}
                                    >
                                      <span className={clsx(
                                        'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                        isSelected ? 'bg-primary-500' : 'bg-slate-600'
                                      )} />
                                      <span className="truncate">{p.label}</span>
                                    </button>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {filteredCategories.every(cat => cat.subCategories.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs gap-2">
            <SearchIcon className="w-6 h-6" />
            <p>No patterns found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
