import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { H3, Paragraphe } from '../../../components/ui/TypographyVariants'
import InputField from '../../../components/ui/form/InputField'
import CustomButton from '../../../components/ui/CustomButton'

function LoginForm({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Logique de connexion ici
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box> 
        <H3 sx={{ textAlign: "center", m: 1, mb:2  }}>Connexion</H3>
        <Paragraphe sx={{ textAlign: "center", mb: 2 }}>
          Connectez-vous pour commencer votre mission de collecte
        </Paragraphe>
        <Box sx={{ mb: 3 }}>
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"  
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ mb: 1 }}>
          <InputField
            label="Password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            InputLabelProps={{ shrink: true }}
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
            size="small"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                size="small"
                sx={{
                  color: "rgba(0,0,0,0.5)",
                  "&.Mui-checked": {
                    color: "#1677FF",
                  },
                }}
              />
            }
            label={<Paragraphe sx={{ fontSize: "0.75rem" }}>Se souvenir de moi</Paragraphe>}
          />
          <Paragraphe
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("forgotPassword")
            }}
            sx={{
              fontSize: "0.75rem",
              color: "#1677FF",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Mot de passe oublié?
          </Paragraphe>
        </Box>
        <CustomButton
          type="submit"
          fullWidth
          color="warning" 
          size="medium"
        >
          Se Connecter
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LoginForm