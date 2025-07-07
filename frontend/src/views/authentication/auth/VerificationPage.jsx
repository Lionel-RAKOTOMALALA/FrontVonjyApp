"use client"

import { Box, IconButton, Alert, Typography } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import CustomButton from "../../../components/ui/CustomButton"
import OTPInput from "./OTPInput"
import usePasswordResetStore from "../../../store/passwordResetStore"

function VerificationPage({ onNavigate }) {
  const [otp, setOtp] = useState("")
  const [newPassword,] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Store Zustand
  const {
    loading,
    error,
    success,
    email,
    verifyCode,
    clearError,
    clearSuccess,
    requestReset
  } = usePasswordResetStore()

  // Auto focus on mount
  useEffect(() => {
    const input = document.querySelector('[aria-label="Digit 1 of OTP"]')
    if (input) input.focus()
  }, [])

  // Nettoyer les messages lors du montage du composant
  useEffect(() => {
    clearError()
    clearSuccess()
  }, [clearError, clearSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation de base - vérifier que tous les champs sont remplis
    if (otp.length !== 6) {
      alert("Veuillez entrer un code à 5 chiffres complet")
      return
    }


    setIsSubmitting(true)

    try {
      // Appel de l'API de vérification
      const response = await verifyCode(email, otp, newPassword)

      if (response.success) {
        // Si la vérification réussit, naviguer vers la page de succès ou login
      await new Promise((resolve) => setTimeout(resolve, 2000));
        onNavigate("resetPassword", { otp })
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    try {
      // Réutiliser l'API de demande de réinitialisation
      const response = await requestReset(email)
      if (response.success) {
        setResendCooldown(60)
      }
    } catch (error) {
      console.error("Failed to resend code:", error)
      alert("Échec de l'envoi du code. Veuillez réessayer.")
    }
  }

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [resendCooldown])

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}
    >
      <Box sx={{ textAlign: "center", position: "relative", mb: 2 }}>
        <IconButton
          onClick={() => onNavigate("forgotPassword")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="Retour"
        >
          <ArrowLeft size={18} />
        </IconButton>
        <h3 className="m-0 p-0">Vérification</h3>
      </Box>

      <p className="mx-1 text-center mb-3">
        Entrez le code de vérification que nous avons envoyé à votre email
      </p>

      {/* Affichage des messages d'erreur/succès */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Code incorrect ou expiré. Veuillez réessayer.
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1, mb: 3 }}
        className="flex flex-row items-center justify-center gap-2"
      >
        <OTPInput
          value={otp}
          onChange={setOtp}
          length={6}
          inputProps={{
            style: {
              width: "40px",
              height: "40px",
              margin: "0 4px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.23)",
              transition: "border-color 0.3s",
            },
          }}
          separator={<span style={{ margin: "0 2px" }}></span>}
          inputClassName="focus:border-[#1677FF] focus:ring-[#1677FF]/20"
          disabled={loading}
        />
      </Box>



      <Box sx={{ textAlign: "start", m: 2, ml: 0 }}>
        <Typography
          variant="paragraph"
          component="button"
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || loading}
          sx={{
            fontSize: "0.75rem",
            color: resendCooldown > 0 || loading ? "text.disabled" : "#1677FF",
            textDecoration: "none",
            background: "none",
            border: "none",
            cursor: resendCooldown > 0 || loading ? "default" : "pointer",
            padding: 0,
            fontFamily: "inherit",
            "&:hover": {
              textDecoration: resendCooldown > 0 || loading ? "none" : "underline",
            },
          }}
        >
          {resendCooldown > 0 ? `Renvoyer le code (${resendCooldown}s)` : "Renvoyer le code ?"}
        </Typography>
      </Box>

      <CustomButton
        size="medium"
        type="submit"
        fullWidth
        color="warning"
        disabled={otp.length !== 6 || isSubmitting || loading} // ← Ajout ici
      >
        {isSubmitting || loading ? "Vérification..." : "Vérifier le code"}
      </CustomButton>

    </Box>
  )
}

export default VerificationPage
