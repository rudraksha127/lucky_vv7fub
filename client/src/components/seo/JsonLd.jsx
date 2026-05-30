/**
 * JsonLd - Structured Data Component
 *
 * Injects JSON-LD structured data into <head> for SEO.
 * Supports WebApplication, LearningResource (with rich fields),
 * FAQPage, CollectionPage, and Course schemas.
 *
 * Usage:
 *   <JsonLd type="WebApplication" />
 *   <JsonLd type="LearningResource" name="Two Sum" difficulty="Rookie" topic="Arrays" />
 *   <JsonLd type="CollectionPage" items={problems} />
 */

import { useEffect, useMemo } from 'react'

const DIFFICULTY_MAP = {
  Rookie:  'Beginner',
  Warrior: 'Intermediate',
  Legend:  'Advanced',
}

const SCHEMAS = {
  WebApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AlgoZen',
    description: "India's first gamified DSA learning platform with AI mentorship, real-time battles, and interactive visualizations.",
    url: 'https://algozen.me',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '523',
      bestRating: '5',
    },
    author: {
      '@type': 'Organization',
      name: 'AlgoZen',
    },
  },

  LearningResource: (props) => ({
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: props.name || 'DSA Practice Problem',
    description: props.description
      ? (props.description.length > 300 ? props.description.slice(0, 297) + '...' : props.description)
      : 'Solve DSA problems with guided hints and AI mentorship.',
    learningResourceType: props.learningResourceType || 'Practice Problem',
    educationalLevel: DIFFICULTY_MAP[props.difficulty] || props.difficulty || 'Beginner',

    // Topic & classification
    teaches: props.topic || 'Data Structures & Algorithms',
    about: props.about || props.topic || 'Data Structures & Algorithms',
    assesses: props.topic || 'Data Structures & Algorithms',
    keywords: props.keywords || [props.topic, props.difficulty, 'DSA', 'AlgoZen'].filter(Boolean),

    // Competency & prerequisites
    competencyRequired: props.competencyRequired || (props.difficulty === 'Legend' ? 'Intermediate DSA knowledge' : 'Basic programming concepts'),

    // Time estimate based on difficulty
    timeRequired: props.timeRequired || (() => {
      switch (props.difficulty) {
        case 'Rookie':  return 'PT15M'
        case 'Warrior': return 'PT30M'
        case 'Legend':  return 'PT45M'
        default:        return 'PT20M'
      }
    })(),

    // Educational alignment
    educationalAlignment: props.constraints ? {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: props.topic || 'Data Structures & Algorithms',
    } : undefined,

    // Provider
    provider: {
      '@type': 'Organization',
      name: 'AlgoZen',
      url: 'https://algozen.me',
    },

    // Parts (hints & examples structured in schema)
    ...(props.examples?.length > 0 || props.hints?.length > 0 ? {
      hasPart: [
        ...(props.examples || []).slice(0, 2).map((ex, i) => ({
          '@type': 'LearningResource',
          name: `Example ${i + 1}`,
          description: `Input: ${ex.input}. Output: ${ex.output}.${ex.explanation ? ` Explanation: ${ex.explanation}` : ''}`,
          educationalLevel: DIFFICULTY_MAP[props.difficulty] || 'Beginner',
        })),
        ...(props.hints || []).slice(0, 3).map((hint, i) => ({
          '@type': 'LearningResource',
          name: `Hint ${i + 1}`,
          description: hint,
          educationalLevel: DIFFICULTY_MAP[props.difficulty] || 'Beginner',
        })),
      ],
    } : {}),

    // Suggested number of items
    ...(props.suggestedItems !== undefined ? { suggestedNumberOfItems: props.suggestedItems } : {}),

    // Aggregate rating based on acceptance rate
    ...(props.acceptanceRate !== undefined ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: props.acceptanceRate.toFixed(1),
        bestRating: '100',
        worstRating: '0',
        ratingCount: props.totalSubmissions || 0,
      },
    } : {}),

    // Slug for canonical URL
    ...(props.slug ? {
      url: `https://algozen.me/problems/${props.slug}`,
      mainEntityOfPage: `https://algozen.me/problems/${props.slug}`,
    } : {}),

    // Image from pattern/visualizer
    ...(props.image ? { image: props.image } : {}),
  }),

  FAQPage: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  CollectionPage: (props) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: props.name || 'DSA Problems - AlgoZen',
    description: props.description || 'Browse our collection of DSA and RealWorld coding problems with AI guidance.',
    url: 'https://algozen.me/problems',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (props.items || []).slice(0, 50).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LearningResource',
          name: item.title,
          url: `https://algozen.me/problems/${item.slug}`,
          educationalLevel: DIFFICULTY_MAP[item.difficulty] || 'Beginner',
          teaches: item.topic || 'Data Structures & Algorithms',
        },
      })),
      numberOfItems: props.items?.length || 0,
    },
  }),

  Course: (props) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: props.name || 'DSA Mastery Path',
    description: props.description || 'Master Data Structures & Algorithms with AlgoZen',
    provider: {
      '@type': 'Organization',
      name: 'AlgoZen',
    },
    educationalCredentialAwarded: 'AlgoZen DSA Certificate',
    numberOfCredits: props.problemsCount || 50,
    timeRequired: props.timeRequired || 'P3M',
    ...(props.hasCourseInstance ? {
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        instructor: {
          '@type': 'Person',
          name: 'AlgoGuru AI Mentor',
        },
      },
    } : {}),
  }),
}

export default function JsonLd({ type = 'WebApplication', ...props }) {
  const deps = useMemo(() => JSON.stringify(props), [props])

  useEffect(() => {
    const schema = typeof SCHEMAS[type] === 'function'
      ? SCHEMAS[type](props)
      : SCHEMAS[type]

    if (!schema) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = `json-ld-${type}`
    script.textContent = JSON.stringify(schema, null, 2)

    // Remove existing same-type script
    const existing = document.getElementById(`json-ld-${type}`)
    if (existing) existing.remove()

    document.head.appendChild(script)

    return () => {
      const s = document.getElementById(`json-ld-${type}`)
      if (s) s.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, deps])

  return null
}
