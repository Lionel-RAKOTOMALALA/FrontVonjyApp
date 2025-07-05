"use client"

import { Box, IconButton, InputAdornment, Alert } from "@mui/material"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import InputField from "../../../components/ui/form/InputField"
import CustomButton from "../../../components/ui/CustomButton"
import usePasswordResetStore from '../../../store/passwordResetStore'
import axios from 'axios'

function ResetPasswordPage({ onNavigate, otp }) {
  const [showPasswords, setShowPasswords] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Récupérer email depuis le store Zustand
  const { email } = usePasswordResetStore()

  // Fonction de validation du mot de passe
  const validatePassword = (password) => {
    const minLength = password.length >= 6
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    
    return {
      isValid: minLength && hasSpecialChar && hasLetter,
      minLength,
      hasSpecialChar,
      hasLetter
    }
  }

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target
    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Effacer les messages d'erreur/succès quand l'utilisateur tape
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    
    // Réinitialiser les messages
    setError("")
    setSuccess("")

    // Validation du mot de passe
    const passwordValidation = validatePassword(resetPasswordData.newPassword)
    if (!passwordValidation.isValid) {
      let errorMessage = "Le mot de passe doit contenir :"
      if (!passwordValidation.minLength) errorMessage += "\n• Au moins 6 caractères"
      if (!passwordValidation.hasLetter) errorMessage += "\n• Au moins une lettre"
      if (!passwordValidation.hasSpecialChar) errorMessage += "\n• Au moins un caractère spécial"
      
      setError(errorMessage)
      return
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        email: email,
        code: otp,
        new_password: resetPasswordData.newPassword
      })
      
      setSuccess(response.data.message || "Mot de passe réinitialisé avec succès!")
      
      // Rediriger après un délai pour permettre à l'utilisateur de voir le message
      setTimeout(() => {
        onNavigate("login")
      }, 2000)
      
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur s'est produite, veuillez réessayer.")
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleResetPasswordSubmit}
      sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}
    >
      <Box
        sx={{ textAlign: "center", position: "relative", mb: 1 }}
        className="d-flex align-items-center justify-content-center"
      >
        <IconButton onClick={() => onNavigate("verification")} sx={{ position: "relative", left: "-6px" }}>
          <ArrowLeft size={18} />
        </IconButton>
        <h3 className="m-0 mb-2 p-0">
          Réinitialiser votre <br className="d-none d-lg-block" /> mot de passe
        </h3>
      </Box>
      <p style={{ marginBottom: 3, marginTop: 1, textAlign: "center" }}>
        Entrez votre nouveau mot de passe et confirmez-le pour sécuriser votre compte
      </p>

      {error && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <InputField
          InputLabelProps={{ shrink: true }}
          label="Nouveau mot de passe"
          name="newPassword"
          value={resetPasswordData.newPassword}
          onChange={handleResetPasswordChange}
          fullWidth
          required
          size="small"
          type={showPasswords ? "text" : "password"}
          InputProps={{
            sx: { bgcolor: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPasswords(!showPasswords)} edge="end" size="small">
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <InputField
          InputLabelProps={{ shrink: true }}
          size="small"
          label="Confirmer mot de passe"
          name="confirmPassword"
          value={resetPasswordData.confirmPassword}
          onChange={handleResetPasswordChange}
          fullWidth
          required
          type={showPasswords ? "text" : "password"}
          InputProps={{
            sx: { bgcolor: "white" },
          }}
        />
      </Box>

      <CustomButton 
        size="medium" 
        type="submit" 
        fullWidth 
        color="warning"
        disabled={loading}
      >
        {loading ? "Réinitialisation..." : "Réinitialiser mon mot de passe"}
      </CustomButton>
    </Box>
  )
}

export default ResetPasswordPage