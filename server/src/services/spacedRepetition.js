/**
 * Spaced Repetition Engine — FSRS-based Algorithm
 *
 * Calculates next review interval based on:
 * - Verdict (Accepted = success, WrongAnswer = failure)
 * - Time taken to solve (faster = stronger memory)
 * - Previous stability & difficulty
 *
 * Grade mapping (from verdict + time):
 *   5 = Perfect  — First AC, fast solve (< 30% of time limit)
 *   4 = Good     — Accepted, reasonable time
 *   3 = Hard     — Accepted but took long (> 80% of time limit)
 *   2 = Pass     — Manual "I know this" skip
 *   1 = Again    — Wrong answer / failed
 */

const GRADE = {
  PERFECT: 5,
  GOOD: 4,
  HARD: 3,
  PASS: 2,
  AGAIN: 1,
}

/**
 * Calculate grade from verdict + time taken + time limit
 */
export function calculateGrade(verdict, timeTakenMs, timeLimitMs) {
  if (verdict !== 'Accepted') return GRADE.AGAIN

  const ratio = timeTakenMs / (timeLimitMs || 300000) // default 5min limit
  if (ratio < 0.3) return GRADE.PERFECT   // Fast solve
  if (ratio < 0.8) return GRADE.GOOD      // Normal solve
  return GRADE.HARD                         // Slow solve
}

/**
 * Convert grade to a retention multiplier
 */
function gradeToRetention(grade) {
  switch (grade) {
    case GRADE.PERFECT: return 0.95
    case GRADE.GOOD:    return 0.85
    case GRADE.HARD:    return 0.70
    case GRADE.PASS:    return 0.60
    case GRADE.AGAIN:   return 0.00
    default:            return 0.50
  }
}

/**
 * Update difficulty based on grade
 * D' = D + ΔD where ΔD depends on grade vs expected
 */
function updateDifficulty(difficulty, grade) {
  const expectedGrade = 3.5 // Average expected grade
  const delta = -0.04 * (grade - expectedGrade)

  // Clamp difficulty between 1 and 10
  return Math.max(1, Math.min(10, difficulty + delta))
}

/**
 * Calculate new stability based on previous stability, difficulty, and grade
 *
 * Uses a simplified FSRS-5 formula:
 * S' = S × e^(ln(1.1) × (grade - 3) × (1 + 0.1 × (difficulty - 5)))
 */
function calculateStability(prevStability, difficulty, grade, repetitions) {
  if (grade === GRADE.AGAIN) {
    // On failure: reset stability to a fraction of previous
    // But keep some memory trace
    return Math.max(1, prevStability * 0.3)
  }

  if (repetitions === 0 || prevStability === 0) {
    // First successful review
    // Base stability depends on grade
    const base = [0, 0.5, 1.0, 2.0, 3.0, 5.0]
    return base[grade] || 1.0
  }

  // Subsequent reviews: exponential growth modulated by difficulty
  const retentionFactor = gradeToRetention(grade)
  const diffFactor = 1 + 0.1 * (difficulty - 5)
  const gradeBoost = grade - 3

  // More reviews → larger intervals
  const repsFactor = 1 + Math.log(repetitions + 1) * 0.3

  const multiplier = Math.exp(Math.log(1.1) * gradeBoost * diffFactor) * repsFactor * retentionFactor
  return Math.max(1, prevStability * multiplier)
}

/**
 * Main function: given current card state + new result, return updated state
 *
 * @param {Object} card — Current revision card state
 * @param {string} card.verdict — 'Accepted' | 'WrongAnswer' | ...
 * @param {number} card.timeTakenMs — Time taken to solve in ms
 * @param {number} card.timeLimitMs — Problem time limit in ms
 * @param {Object} card.previousState — { stability, difficulty, repetitions, lapses }
 * @returns {Object} — { stability, difficulty, dueDate, interval, repetitions, lapses }
 */
export function calculateNextReview({
  verdict,
  timeTakenMs = 0,
  timeLimitMs = 5000,
  previousStability = 0,
  previousDifficulty = 5,
  previousRepetitions = 0,
  previousLapses = 0,
}) {
  const grade = calculateGrade(verdict, timeTakenMs, timeLimitMs)

  // Update difficulty
  const newDifficulty = updateDifficulty(previousDifficulty, grade)

  // Update repetitions & lapses
  const newRepetitions = grade >= GRADE.PASS
    ? previousRepetitions + 1
    : 0 // Reset on failure

  const newLapses = grade === GRADE.AGAIN
    ? previousLapses + 1
    : previousLapses

  // Calculate new stability
  const newStability = calculateStability(
    previousStability,
    newDifficulty,
    grade,
    newRepetitions
  )

  // Due date = now + stability (rounded to hours for precision)
  const intervalMs = newStability * 24 * 60 * 60 * 1000
  const dueDate = new Date(Date.now() + intervalMs)

  return {
    stability: Math.round(newStability * 10) / 10,
    difficulty: Math.round(newDifficulty * 10) / 10,
    dueDate,
    interval: Math.round(newStability * 10) / 10,
    repetitions: newRepetitions,
    lapses: newLapses,
    grade,
  }
}

/**
 * Get retention estimate for a card at a given point in time
 * Returns probability (0-1) that the user still remembers
 */
export function getRetentionProbability(stability, daysSinceLastReview) {
  if (stability <= 0) return 0
  // Exponential forgetting curve: R = e^(-t/S)
  return Math.exp(-daysSinceLastReview / stability)
}

/**
 * Get the initial revision card state after first AC
 */
export function getInitialState(verdict, timeTakenMs, timeLimitMs) {
  return calculateNextReview({
    verdict,
    timeTakenMs,
    timeLimitMs,
    previousStability: 0,
    previousDifficulty: 5,
    previousRepetitions: 0,
    previousLapses: 0,
  })
}

export { GRADE }
