"use client"

import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment } from "@mui/material"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { H3, Paragraphe } from "../../../components/ui/TypographyVariants"
import InputField from "../../../components/ui/form/InputField"
import CustomButton from "../../../components/ui/CustomButton"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useUserStore from "../../../store/userStore" // Utilisation du store utilisateur

function LoginForm({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAccessToken, fetchUser } = useUserStore() // Import des actions du store utilisateur

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", {
        email: formData.email,
        password: formData.password,
      })

      // Stockage du token d'accès dans le store
      setAccessToken(response.data.access)

      // Récupération des informations utilisateur
      await fetchUser()

      // Redirection après connexion réussie en fonction du rôle utilisateur
      const { user } = useUserStore.getState() // Récupération de l'utilisateur depuis le store
      if (user?.role === "simple") {
        navigate("/map")
      } else if (user?.role === "super") {
        navigate("/commune")
      }
      
    } catch (err) {
      if (!err.response) {
        // Erreur réseau ou CORS
        setError("Erreur de connexion. Veuillez vérifier votre réseau ou réessayer plus tard.")
      } else if (err.response.status === 401) {
        // Authentification incorrecte
        setError("Email ou mot de passe incorrect.")
      } else {
        // Autre erreur côté serveur
        setError(err.response.data?.message || "Une erreur est survenue.")
      }
      console.error("Login error:", err)
    }
    
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box>
        <H3 sx={{ textAlign: "center", m: 1, mb: 2 }}>Connexion</H3>
        <Paragraphe sx={{ textAlign: "center", mb: 2 }}>
          Connectez-vous pour commencer votre mission de collecte
        </Paragraphe>

        {/* Affichage des erreurs */}
        {error && (
          <Paragraphe
            sx={{
              color: "#fff",
              textAlign: "center",
              mb: 2,
              bgcolor: "error.light",
              p: 1,
              borderRadius: 1,
            }}
          >
            {error}
          </Paragraphe>
        )}

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
            error={!!error}
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
            error={!!error}
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
          {/* <Paragraphe
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
          </Paragraphe> */}
        </Box>
        <CustomButton type="submit" fullWidth color="warning" size="medium" loading={isLoading} disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se Connecter"}
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LoginForm