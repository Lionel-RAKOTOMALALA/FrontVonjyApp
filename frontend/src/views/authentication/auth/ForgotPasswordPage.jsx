"use client"

import { Box, IconButton } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { H3, Paragraphe } from "../../../components/ui/TypographyVariants"
import InputField from "../../../components/ui/form/InputField"
import CustomButton from "../../../components/ui/CustomButton"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
})

function ForgotPasswordPage({ onNavigate }) {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  })
  const [errors, setErrors] = useState({})

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleForgotPasswordSubmit = (e) => {
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
    onNavigate("verification")
    console.log("Forgot password submitted:", forgotPasswordData)
  }

  return (
    <Box component="form" onSubmit={handleForgotPasswordSubmit}>
      <Box sx={{ textAlign: "center", position: "relative", mb: 1 }} className="d-flex align-items-center">
        <IconButton onClick={() => onNavigate("login")} sx={{ position: "relative", left: "-6px" }}>
          <ArrowLeft size={18} />
        </IconButton>
        <H3 className="m-0 p-0">Mot de passe oublié ?</H3>
      </Box>
      <Paragraphe sx={{ mb: 3, mt: 2, textAlign: "center" }}>
        Entrez votre adresse e-mail pour recevoir un code de réinitialisation
      </Paragraphe>

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
        />
      </Box>

      <CustomButton size="medium" type="submit" fullWidth color="warning">
        Envoyer le code
      </CustomButton>
    </Box>
  )
}

export default ForgotPasswordPage
