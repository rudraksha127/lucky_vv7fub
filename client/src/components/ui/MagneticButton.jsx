/**
 * MagneticButton
 *
 * Premium button effect: button follows cursor slightly on hover,
 * creating a magnetic feel. Falls back to normal button on touch devices.
 *
 * Usage:
 *   <MagneticButton className="btn-primary">
 *     Click Me
 *   </MagneticButton>
 */

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import useSettingsStore from '../../stores/useSettingsStore'

export default function MagneticButton({
  children,
  as: Component = 'button',
  className = '',
  innerClassName = '',
  strength = 0.3,
  ...props
}) {
  const magneticButtonsEnabled = useSettingsStore((s) => s.magneticButtons)

  // If magnetic effect is disabled, render as a normal component
  if (!magneticButtonsEnabled) {
    return (
      <Component className={innerClassName} {...props}>{children}</Component>
    )
  }
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      setPosition({ x, y })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={clsx('inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        x: isHovered ? position.x : 0,
        y: isHovered ? position.y : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      style={{ willChange: 'transform' }}
    >
      <Component className={innerClassName} {...props}>{children}</Component>
    </motion.div>
  )
}
