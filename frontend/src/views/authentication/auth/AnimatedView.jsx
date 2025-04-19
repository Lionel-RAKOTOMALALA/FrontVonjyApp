"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

// Animation variants
export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

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
