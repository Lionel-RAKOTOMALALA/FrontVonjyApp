"use client"
import { motion } from "framer-motion"

function BackgroundElements() {
  return (
    <>
      {/* Élément arrière-plan 1 - Floating animation */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{
          y: [-10, 10, -10],
          opacity: 1,
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 6,
            ease: "easeInOut",
          },
          opacity: { duration: 1 },
        }}
        style={{
          position: "absolute",
          top: -150,
          left: 100,
          width: 250,
          height: 400,
          backgroundImage: 'url("/assets/background/2.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Élément arrière-plan 2 - Rotation animation */}
      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        animate={{
          rotate: 360,
          opacity: 1,
        }}
        transition={{
          rotate: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "linear",
          },
          opacity: { duration: 1.5, delay: 0.3 },
        }}
        style={{
          position: "absolute",
          bottom: 50,
          left: -20,
          width: 100,
          height: 100,
          backgroundImage: 'url("/assets/background/1.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Élément arrière-plan 3 - Scale animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: 1,
        }}
        transition={{
          scale: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
            ease: "easeInOut",
          },
          opacity: { duration: 1.5, delay: 0.6 },
        }}
        style={{
          position: "absolute",
          bottom: -100,
          left: 450,
          width: 100,
          height: 250,
          backgroundImage: 'url("/assets/background/3.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Élément arrière-plan 4 - image principale with fade-in and slight movement */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.4,
        }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundImage: 'url("/assets/background/image.png")',
          zIndex: 0,
          width: 500,
          height: 600,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
    </>
  )
}

export default BackgroundElements
