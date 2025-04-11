import { Box, IconButton } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { H3, Paragraphe } from '../../../components/ui/TypographyVariants'
import CustomButton from '../../../components/ui/CustomButton'
import OTPInputs from './OTPInputs'

function VerificationPage({ onNavigate }) {
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0) 

  // Auto focus on mount
  useEffect(() => {
    const input = document.querySelector('[aria-label="Digit 1 of OTP"]')
    if (input) input.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ajouter cette ligne pour afficher l'OTP dans la console
    console.log("Code OTP saisi :", otp);
    
    // onNavigate("resetPassword");
  };
  
  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    try {
      console.log("Resending verification code")
      setResendCooldown(60)
    } catch (error) {
      console.error("Failed to resend code:", error)
      alert("Échec de l'envoi du code. Veuillez réessayer.")
    }
  }

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => prev - 1)
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
        <H3 className="m-0 p-0">Vérification</H3>
      </Box>

      <Paragraphe sx={{ mx: 1, textAlign: "center", mb: 3 }}>
        Entrez le code de vérification que nous avons envoyé à votre email
      </Paragraphe>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 3 }}>
        <OTPInputs value={otp} onChange={setOtp} length={6} />
        <span>{otp}</span>
      </Box>

      <Box sx={{ textAlign: "start", m: 2, ml: 0 }}>
        <Paragraphe
          component="button"
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0}
          sx={{
            fontSize: "0.75rem",
            color: resendCooldown > 0 ? "text.disabled" : "#1677FF",
            textDecoration: "none",
            background: "none",
            border: "none",
            cursor: resendCooldown > 0 ? "default" : "pointer",
            padding: 0,
            fontFamily: "inherit",
            "&:hover": {
              textDecoration: resendCooldown > 0 ? "none" : "underline",
            },
          }}
        >
          {resendCooldown > 0 
            ? `Renvoyer le code (${resendCooldown}s)` 
            : "Renvoyer le code ?"}
        </Paragraphe>
      </Box>

      <CustomButton 
        size="medium"
        type="submit"
        fullWidth
        color="warning"
      >
        {isSubmitting ? "Vérification..." : "Vérifier le code"}
      </CustomButton>
    </Box>
  )
}

export default VerificationPage
