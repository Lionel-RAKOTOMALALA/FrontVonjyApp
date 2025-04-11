// In ForgotPasswordPage.jsx
import { Box, IconButton } from '@mui/material' // Note: Box should be imported from MUI, not Lucide
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { H3, Paragraphe } from '../../../components/ui/TypographyVariants'
import InputField from '../../../components/ui/form/InputField'
import CustomButton from '../../../components/ui/CustomButton'

function ForgotPasswordPage({ onNavigate }) {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  })

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault()
    console.log("Forgot password submitted:", forgotPasswordData)
    // Now use the passed prop to navigate
    onNavigate("verification")
  }

  return (
    <Box component="form" onSubmit={handleForgotPasswordSubmit}>
      <Box sx={{ textAlign: "center", position: "relative", mb: 1 }} className="d-flex align-items-center">
        <IconButton
          onClick={() => onNavigate("login")}
          sx={{ position: 'relative', left: '-6px' }}
        >
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
          type="email"
          InputProps={{
            sx: { bgcolor: "white" },
          }}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <CustomButton
        size="medium"
        type="submit"
        fullWidth
        color="warning"
      >
        Envoyer le code
      </CustomButton>
    </Box>
  )
}

export default ForgotPasswordPage