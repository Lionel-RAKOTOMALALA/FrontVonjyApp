"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { fadeInRight, fadeIn } from "./animations"

const AnimatedView = ({ children, animation = "fadeInRight", onAnimationComplete = () => {} }) => {
  const variants = animation === "fadeInRight" ? fadeInRight : fadeIn

  // Focus first input after animation completes
  useEffect(() => {
    const focusFirstInput = () => {
      const firstInput = document.querySelector('input:not([type="hidden"])')
      if (firstInput) firstInput.focus()
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(focusFirstInput, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      onAnimationComplete={() => onAnimationComplete()}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedView