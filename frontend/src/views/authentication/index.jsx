"use client"

import { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import { H1, Paragraphe } from "../../components/ui/TypographyVariants"
import { AnimatePresence } from "framer-motion"

// Import des composants extraits
import LoginForm from "./auth/LoginForm"
import ForgotPasswordPage from "./auth/ForgotPasswordPage"
import VerificationPage from "./auth/VerificationPage"
import ResetPasswordPage from "./auth/ResetPasswordPage"
import BackgroundElements from "./background/BackgroundElements"
import AnimatedView from "./auth/AnimatedView"

export default function Login() {
  // État pour gérer les différentes vues
  const [currentView, setCurrentView] = useState("login") // login, forgotPassword, verification, resetPassword
  const [previousView, setPreviousView] = useState(null)

  // Fonction pour naviguer entre les vues avec historique
  const navigateTo = (view) => {
    setPreviousView(currentView)
    setCurrentView(view)
  }

  // Fonction pour rendre la vue appropriée
  const renderView = () => {
    return (
      <AnimatePresence mode="wait">
        {currentView === "forgotPassword" && (
          <AnimatedView key="forgotPassword">
            <ForgotPasswordPage onNavigate={navigateTo} />
          </AnimatedView>
        )}

        {currentView === "verification" && (
          <AnimatedView key="verification">
            <VerificationPage onNavigate={navigateTo} />
          </AnimatedView>
        )}

        {currentView === "resetPassword" && (
          <AnimatedView key="resetPassword">
            <ResetPasswordPage onNavigate={navigateTo} />
          </AnimatedView>
        )}

        {currentView === "login" && (
          <AnimatedView key="login">
            <LoginForm onNavigate={navigateTo} />
          </AnimatedView>
        )}
      </AnimatePresence>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: 'linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)), url("/map-background.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundElements />
      <Paper
        elevation={3}
        sx={{
          width: {
            xs: "100%",
            sm: "500px",
            md: "100%",
          },
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          zIndex: 1,
          position: "relative",
          height: { xs: "auto", md: "450px" },
          boxShadow: "none !important",
          opacity: ".8",
        }}
      >
        {/* Partie gauche avec logo et titre */}
        <Box
          sx={{
            width: "50%",
            padding: 4,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid rgba(186, 184, 178, 0.6)",
          }}
        >
          <Box component="img" src="../../assets/background/logo.png" alt="Centre Vonjy Logo" sx={{ maxWidth: 130 }} />
          <H1 sx={{ textAlign: "center", my: 1, mb: 2 }}>Centre Vonjy</H1>
          <Paragraphe sx={{ textAlign: "center" }}>
            Cartographie des services de réponses et de prise en charge disponibles au niveau du district d'Ampanihy
            Ouest
          </Paragraphe>
        </Box>

        {/* Partie droite avec formulaire */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            padding: 7,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            overflow: "hidden", // Important for animations
          }}
        >
          {renderView()}
        </Box>
      </Paper>
      
      {/* Copyright footer */}
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "text.secondary",
          zIndex: 2,
          fontSize: "0.75rem",
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} EducTech Toliara. Tous droits réservés.
      </Typography>
    </Box>
  )
}