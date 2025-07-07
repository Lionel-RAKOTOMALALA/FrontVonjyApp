"use client"

import { Box, IconButton, InputAdornment } from "@mui/material"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import InputField from "../../../components/ui/form/InputField"
import CustomButton from "../../../components/ui/CustomButton"
import usePasswordResetStore from '../../../store/passwordResetStore'
import axios from 'axios'

function ResetPasswordPage({ onNavigate, otp }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Récupérer email depuis le store Zustand
  const { email } = usePasswordResetStore()

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target
    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        email: email,
        code: otp,
        new_password: resetPasswordData.newPassword
      })
      alert(response.data.message || "Mot de passe réinitialisé avec succès!")
      onNavigate("login")
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.")
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
          type={showPassword ? "text" : "password"}
          InputProps={{
            sx: { bgcolor: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            sx: { bgcolor: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <CustomButton size="medium" type="submit" fullWidth color="warning">
        Réinitialiser mon mot de passe
      </CustomButton>
    </Box>
  )
}

export default ResetPasswordPage
