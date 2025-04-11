"use client"

import { useState } from "react"
import { Box, Paper } from "@mui/material"
import { H1, H3, Paragraphe } from "../../components/ui/TypographyVariants"

// Import des composants extraits
import LoginForm from "./auth/LoginForm"
import ForgotPasswordPage from "./auth/ForgotPasswordPage"
import VerificationPage from "./auth/VerificationPage"
import ResetPasswordPage from "./auth/ResetPasswordPage"
import BackgroundElements from "./background/BackgroundElements"

export default function Login() {
  // État pour gérer les différentes vues
  const [currentView, setCurrentView] = useState("login") // login, forgotPassword, verification, resetPassword

  // Fonction pour rendre la vue appropriée
  const renderView = () => {
    switch (currentView) {
      case "forgotPassword":
        return <ForgotPasswordPage onNavigate={(view) => setCurrentView(view)} />

      case "verification":
        return <VerificationPage onNavigate={(view) => setCurrentView(view)} />

      case "resetPassword":
        return <ResetPasswordPage onNavigate={(view) => setCurrentView(view)} />

      default: // login
        return <LoginForm onNavigate={(view) => setCurrentView(view)} />
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
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
            xs: '100%',
            sm: '500px',
            md: '100%',
          },
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          zIndex: 1,
          position: "relative",
          height: { xs: "auto", md: "450px" },
          boxShadow: 'none !important',
          opacity: '.8'
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
            borderRight: "1px solid rgba(252, 210, 72, 0.60)",
          }}
        >
          <Box
            component="img"
            src="../../assets/background/logo.png"
            alt="Centre Vonjy Logo"
            sx={{ maxWidth: 130 }}
          />
          <H1 sx={{ textAlign: "center", my: 1, mb: 2 }}>Projet Centre Vonjy</H1>
          <Paragraphe sx={{ textAlign: "center" }}>Bienvenue dans la plateforme!</Paragraphe>
        </Box>

        {/* Partie droite avec formulaire */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            padding: 7,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: 'center'
          }}
        >
          {renderView()}
        </Box>
      </Paper>
    </Box>
  )
}