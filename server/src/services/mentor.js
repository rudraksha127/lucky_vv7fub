/**
 * AI Mentor Service
 *
 * Smart router that selects the best AI model per task:
 *   - hint / review → Groq (llama-3.3-70b) — fast, cheap
 *   - explain        → Gemini (gemini-1.5-flash) — thorough, free tier
 *
 * Integrates with existing algoguru.js for battle-tested HITL RAG and
 * groq.js for legacy compatibility.
 */

import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { algoguruChat } from './algoguru.js'
import { getHint as groqGetHint, getReview as groqGetReview } from './groq.js'

// ─── AI Clients ────────────────────────────────────────────
const groqApiKey = process.env.GROQ_API_KEY
const geminiApiKey = process.env.GEMINI_API_KEY

const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null

// ─── AlgoGuru Persona (for mentor mode) ────────────────────
const ALGOGURU_SYSTEM = `You are AlgoGuru, a friendly DSA mentor for Indian college students. You are like a knowledgeable senior friend, not a textbook.

PERSONALITY:
- Natural Hinglish: "bhai", "dekho", "basically", "yaar"
- Warm and encouraging, celebrate effort
- Use Indian analogies (cricket, chai, desi life, Bollywood)
- Never condescending

ABSOLUTE RULES:
1. NEVER write the complete solution
2. Hint Level 1 = direction only, NO pseudocode
3. Hint Level 2 = pseudocode steps, NO actual code
4. Hint Level 3 = key algorithmic insight ONLY
5. Always explain WHY, not just HOW
6. End every response with encouragement
7. Max 150 words for hints, 250 for explanations

RESPONSE STYLE:
- Start with empathy: "Achha sawaal hai!" or "Haan, yeh tricky hai"
- Build confidence: "Almost there, bhai!"
- Close with motivation: "Try karo — tum kar sakte ho! 💪"

NEVER say: "The solution is..." or "Here's the code..."
ALWAYS say: "Think about what if..." or "Kya hoga agar..."`

// ─── Hint (Uses Groq — fast) ──────────────────────────────
export const getHint = async ({ problem, code, hintLevel, userMessage }) => {
  // Try algoguru first (has better context retrieval)
  try {
    const result = await algoguruChat({
      problem,
      studentCode: code,
      message: userMessage || 'Give me a hint to solve this problem without revealing the solution.',
      hintLevel: hintLevel || 2,
    })
    if (result.answer && result.confidence >= 0.6) {
      return {
        answer: result.answer,
        confidence: result.confidence,
        evidenceMap: result.evidenceMap,
        humanAction: result.humanAction,
      }
    }
  } catch {
    // Fall through to legacy hint
  }

  // Fallback to legacy groq hint
  const legacyResult = await groqGetHint(problem, code, userMessage)
  return {
    answer: legacyResult,
    confidence: 0.7,
    evidenceMap: [],
    humanAction: 'NONE',
  }
}

// ─── Explain Concept (Uses Gemini — thorough) ─────────────
export const explainConcept = async ({ topic, context, userLevel }) => {
  if (!genAI) {
    return {
      answer: '🤖 Concept explanations are unavailable. Please set GEMINI_API_KEY in .env',
      confidence: 0,
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `${ALGOGURU_SYSTEM}

Explain this DSA concept for a Level ${userLevel || 5} student:
Topic: ${topic}
Context: ${context || 'General explanation'}

Use a real-world Indian analogy. Max 250 words.
Response:`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return {
      answer: text,
      confidence: 0.85,
      model: 'gemini-1.5-flash',
    }
  } catch (err) {
    console.error('❌ Gemini explain error:', err)
    return {
      answer: '😅 Sorry, I hit a snag explaining this concept. Please try again.',
      confidence: 0,
    }
  }
}

// ─── Code Review (Uses Groq — fast) ───────────────────────
export const reviewCode = async ({ problem, code, language, status }) => {
  // Try algoguru first
  try {
    const review = await algoguruChat({
      problem,
      studentCode: { content: code, language },
      message: `Please review my ${language} code for correctness and efficiency. Be constructive.`,
      hintLevel: 3,
    })
    if (review.answer && review.confidence >= 0.6) {
      return {
        answer: review.answer,
        confidence: review.confidence,
        evidenceMap: review.evidenceMap,
        humanAction: review.humanAction,
      }
    }
  } catch {
    // Fall through
  }

  // Fallback to legacy review
  const legacyResult = await groqGetReview(problem, { content: code, language })
  return {
    answer: legacyResult,
    confidence: 0.7,
    evidenceMap: [],
    humanAction: 'NONE',
  }
}

// ─── Smart Router ──────────────────────────────────────────
export const getMentorResponse = async ({ type, ...params }) => {
  switch (type) {
    case 'hint':
      return getHint(params)          // Groq (fast)
    case 'explain':
      return explainConcept(params)   // Gemini (thorough)
    case 'review':
      return reviewCode(params)       // Groq (fast)
    default:
      return getHint(params)
  }
}
