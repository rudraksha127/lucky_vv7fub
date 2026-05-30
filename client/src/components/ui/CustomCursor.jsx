import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'

const VARIANTS = {
  default: 'default',
  text: 'text',
  button: 'button',
  link: 'link',
}

import useSettingsStore from '../../stores/useSettingsStore'

export default function CustomCursor() {
  const customCursorEnabled = useSettingsStore((s) => s.customCursor)
  const [variant, setVariant] = useState(VARIANTS.default)
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  // Early return if disabled in settings
  if (!customCursorEnabled) return null

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 200, damping: 30 })
  const ringY = useSpring(cursorY, { stiffness: 200, damping: 30 })

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true)
      return
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const handleMouseEnter = () => setVisible(true)
    const handleMouseLeave = () => setVisible(false)

    // Detect interactive elements
    const handleMouseOver = (e) => {
      const target = e.target
      const tag = target.tagName.toLowerCase()

      if (tag === 'a' || tag === 'button' || target.getAttribute('role') === 'button') {
        setVariant(VARIANTS.button)
      } else if (tag === 'input' || tag === 'textarea') {
        setVariant(VARIANTS.text)
      } else {
        setVariant(VARIANTS.default)
      }
    }

    document.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY, visible])

  if (isTouch) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0 w-2 h-2 rounded-full bg-primary-400 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.05 }}
      />
      {/* Ring */}
      <motion.div
        className={clsx(
          'pointer-events-none fixed z-[9998] top-0 left-0 rounded-full border transition-colors duration-200',
          variant === VARIANTS.button
            ? 'w-10 h-10 border-primary-400 bg-primary-400/10'
            : variant === VARIANTS.text
              ? 'w-6 h-6 border-accent-400'
              : 'w-8 h-8 border-primary-400/50'
        )}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  )
}
