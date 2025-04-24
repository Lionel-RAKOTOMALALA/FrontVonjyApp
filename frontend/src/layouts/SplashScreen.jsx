"use client"

import { motion } from "framer-motion"
import VonjyLogo from '../assets/VonjyLogo.svg';

function SplashScreen() {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
                className="d-flex align-items-center mt-n5 justify-content-center "
                style={{position:'relative',top:'-50px'}}
            >
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{
                        height: "8rem",
                        width: "8rem",
                        background: "linear-gradient(to right, rgb(255, 255, 255), rgba(239, 233, 68, 0.52))",
                    }}
                >
                    <img src={VonjyLogo} alt="Vonjy Logo" style={{ maxWidth: "80%", maxHeight: "80%" }} />
                </div>
            </motion.div>
        </div>
    )
}

export default SplashScreen
