"use client"

import { Box, IconButton, Alert } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import InputField from "../../../components/ui/form/InputField"
import CustomButton from "../../../components/ui/CustomButton"
import { z } from "zod"
import usePasswordResetStore from "../../../store/passwordResetStore"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
})

function ForgotPasswordPage({ onNavigate }) {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  })
  const [errors, setErrors] = useState({})

  // Store Zustand
  const { 
    loading, 
    error, 
    success, 
    requestReset, 
    clearError, 
    clearSuccess 
  } = usePasswordResetStore()

  // Nettoyer les messages lors du montage du composant
  useEffect(() => {
    clearError()
    clearSuccess()
  }, [clearError, clearSuccess])

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    // Nettoyer les erreurs du store quand l'utilisateur tape
    if (error) clearError()
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    const result = forgotPasswordSchema.safeParse(forgotPasswordData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    // Appel de l'API
    const response = await requestReset(forgotPasswordData.email)
    
    if (response.success) {
      // Navigation vers la page de vérification
      onNavigate("verification")
    }
  }

  // Fonction pour déterminer le message d'erreur approprié
  const getErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error
    }
    
    // Si c'est une erreur 500, afficher un message générique
    if (error?.status === 500 || error?.message?.includes('500')) {
      return "Erreur du serveur. Veuillez réessayer plus tard."
    }
    
    // Si c'est une erreur 404, l'utilisateur n'existe pas
    if (error?.status === 404 || error?.message?.includes('404')) {
      return "Utilisateur introuvable"
    }
    
    // Message par défaut
    return error?.message || "Une erreur est survenue. Veuillez réessayer."
  }

  return (
    <Box component="form" onSubmit={handleForgotPasswordSubmit}>
      <Box sx={{ textAlign: "center", position: "relative", mb: 1 }} className="d-flex align-items-center">
        <IconButton onClick={() => onNavigate("login")} sx={{ position: "relative", left: "-6px" }}>
          <ArrowLeft size={18} />
        </IconButton>
        <h3 className="m-0 p-0">Mot de passe oublié ?</h3>
      </Box>
      <p className="mb-3 mt-2 text-center" style={{color: '#616161'}}>
        Entrez votre adresse e-mail pour recevoir un code de réinitialisation
      </p>

      {/* Affichage des messages d'erreur/succès */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <InputField
          label="Email"
          name="email"
          value={forgotPasswordData.email}
          onChange={handleForgotPasswordChange}
          fullWidth
          required
          InputProps={{
            sx: { bgcolor: "white" },
          }}
          size="small"
          InputLabelProps={{ shrink: true }}
          error={Boolean(errors.email)}
          helperText={errors.email}
          disabled={loading}
        />
      </Box>

      <CustomButton 
        size="medium" 
        type="submit" 
        fullWidth 
        color="warning"
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "Envoyer le code"}
      </CustomButton>
    </Box>
  )
}

export default ForgotPasswordPage