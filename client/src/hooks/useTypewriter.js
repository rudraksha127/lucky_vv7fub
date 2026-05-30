/**
 * useTypewriter Hook
 *
 * Reusable typewriter effect with typing, deleting, and cursor blink.
 * Extracted from HeroSection for use across the app (AlgoGuru, CTAs, etc.)
 *
 * Usage:
 *   const { displayed, cursorVisible } = useTypewriter({
 *     words: ['Legendary', 'Unstoppable'],
 *     typeSpeed: 90,
 *     deleteSpeed: 50,
 *     pauseDuration: 1800,
 *   })
 */

import { useState, useEffect, useCallback } from 'react'

export function useTypewriter({
  words = [],
  typeSpeed = 90,
  deleteSpeed = 50,
  pauseDuration = 1800,
  loop = true,
}) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typewriter logic
  useEffect(() => {
    if (!words.length) return

    const word = words[wordIndex]
    let timeout

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        typeSpeed
      )
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), pauseDuration)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        deleteSpeed
      )
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setWordIndex((i) => {
          if (i + 1 >= words.length) {
            return loop ? 0 : i
          }
          return i + 1
        })
      }, deleteSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration, loop])

  const reset = useCallback(() => {
    setWordIndex(0)
    setDisplayed('')
    setDeleting(false)
  }, [])

  return { displayed, cursorVisible, wordIndex, reset }
}

export default useTypewriter
