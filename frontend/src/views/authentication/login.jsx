"use client"

import { useState } from "react"
import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Paper } from "@mui/material"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { H1, H3, Paragraphe } from "../../components/ui/TypographyVariants"
import CustomButton from "../../components/ui/CustomButton"
import InputField from "../../components/ui/form/InputField"

export default function Login() {
  // États pour gérer les différentes vues
  const [currentView, setCurrentView] = useState("login") // login, forgotPassword, verification, resetPassword
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // États pour les formulaires
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  })

  const [verificationData, setVerificationData] = useState({
    code: ["", "", "", "", "", ""],
  })

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Gestionnaires d'événements pour les formulaires
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }))
  }

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleVerificationChange = (index, value) => {
    // Limiter à un seul caractère
    if (value.length > 1) value = value.charAt(0)

    // Mettre à jour le code
    const newCode = [...verificationData.code]
    newCode[index] = value
    setVerificationData({ code: newCode })

    // Focus automatique sur le champ suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target
    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Gestionnaires de soumission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Logique de connexion ici
  }

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault()
    console.log("Forgot password submitted:", forgotPasswordData)
    // Simuler l'envoi d'un code de vérification
    setCurrentView("verification")
  }

  const handleVerificationSubmit = (e) => {
    e.preventDefault()
    console.log("Verification submitted:", verificationData)
    // Vérifier le code et passer à la réinitialisation du mot de passe
    setCurrentView("resetPassword")
  }

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault()
    console.log("Reset password submitted:", resetPasswordData)
    // Réinitialiser le mot de passe et revenir à la page de connexion
    if (resetPasswordData.newPassword === resetPasswordData.confirmPassword) {
      alert("Mot de passe réinitialisé avec succès!")
      setCurrentView("login")
    } else {
      alert("Les mots de passe ne correspondent pas.")
    }
  }

  // Style commun pour le conteneur de formulaire pour maintenir une hauteur cohérente
  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",   
  }/* Group 20 */
 


  // Fonction pour rendre la vue appropriée
  const renderView = () => {
    switch (currentView) {
      case "forgotPassword":
        return (
          <Box component="form" onSubmit={handleForgotPasswordSubmit} sx={formContainerStyle}>
            <Box sx={{ textAlign: "center", position: "relative", mb: 2 }}>
              <IconButton
                onClick={() => setCurrentView("login")}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowLeft size={18} />
              </IconButton>
              <H3>Mot de passe oublié ?</H3>
            </Box>
            <Paragraphe sx={{ mb: 4, textAlign: "center" }}>
              Entrez votre adresse e-mail pour recevoir un code de réinitialisation
            </Paragraphe>

            <Box sx={{ mb: 4 }}>
              <InputField
                label="Email"
                name="email"
                placeholder="nom@email.com"
                value={forgotPasswordData.email}
                onChange={handleForgotPasswordChange}
                fullWidth
                required
                type="email"
                InputProps={{
                  sx: { bgcolor: "white" },
                }}
              />
            </Box>

            <CustomButton
              type="submit"
              fullWidth
              color="warning"
              sx={{
                py: 1.5,
                bgcolor: "#FEC91F",
                "&:hover": {
                  bgcolor: "#FEC91F",
                  opacity: 0.9,
                },
              }}
            >
              Envoyer le code
            </CustomButton>
          </Box>
        )

      case "verification":
        return (
          <Box component="form" onSubmit={handleVerificationSubmit} sx={formContainerStyle}>
            <Box sx={{ textAlign: "center", position: "relative", mb: 2 }}>
              <IconButton
                onClick={() => setCurrentView("forgotPassword")}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowLeft size={18} />
              </IconButton>
              <H3>Vérification</H3>
            </Box>
            <Paragraphe sx={{ mb: 4, textAlign: "center" }}>
              Entrez le code de vérification que nous avons envoyé dans votre boîte email
            </Paragraphe>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
              {verificationData.code.map((digit, index) => (
                <InputField
                  key={index}
                  id={`verification-${index}`}
                  value={digit}
                  onChange={(e) => handleVerificationChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.2rem", padding: "10px" },
                  }}
                  sx={{ width: "40px" }}
                />
              ))}
            </Box>

            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Paragraphe
                component="a"
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  console.log("Renvoyer le code")
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
                Renvoie code ?
              </Paragraphe>
            </Box>

            <CustomButton
              type="submit"
              fullWidth
              color="warning"
              sx={{
                py: 1.5,
                bgcolor: "#FEC91F",
                "&:hover": {
                  bgcolor: "#FEC91F",
                  opacity: 0.9,
                },
              }}
            >
              Vérification code
            </CustomButton>
          </Box>
        )

      case "resetPassword":
        return (
          <Box component="form" onSubmit={handleResetPasswordSubmit} sx={formContainerStyle}>
            <Box sx={{ textAlign: "center", position: "relative", mb: 2 }}>
              <IconButton
                onClick={() => setCurrentView("verification")}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowLeft size={18} />
              </IconButton>
              <H3>Réinitialiser votre mot de passe</H3>
            </Box>
            <Paragraphe sx={{ mb: 4, textAlign: "center" }}>
              Entrez votre nouveau mot de passe et confirmez-le pour sécuriser votre compte
            </Paragraphe>

            <Box sx={{ mb: 3 }}>
              <InputField
                label="Nouveau mot de passe"
                name="newPassword"
                placeholder="••••••••"
                value={resetPasswordData.newPassword}
                onChange={handleResetPasswordChange}
                fullWidth
                required
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

            <Box sx={{ mb: 4 }}>
              <InputField
                label="Confirmer mot de passe"
                name="confirmPassword"
                placeholder="••••••••"
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

            <CustomButton
              type="submit"
              fullWidth
              color="warning"
              sx={{
                py: 1.5,
                bgcolor: "#FEC91F",
                "&:hover": {
                  bgcolor: "#FEC91F",
                  opacity: 0.9,
                },
              }}
            >
              Réinitialiser mon mot de passe
            </CustomButton>
          </Box>
        )

      default: // login
        return (
          <Box component="form" onSubmit={handleSubmit} sx={{formContainerStyle}}>
            <H3 sx={{ textAlign: "center", m: 1 }}>Connexion</H3>
            <Paragraphe sx={{ textAlign: "center", mb: 2 }}>
              Connectez-vous pour commencer votre mission de collecte
            </Paragraphe>

            <Box sx={{ mb: 3 }}>
              <InputField
                label="Email"
                name="email"
                placeholder="nom@email.com"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                InputProps={{
                  sx: { bgcolor: "white" },
                }}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
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
                size="small"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
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
                  setCurrentView("forgotPassword")
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
              sx={{
                py: 1.5,
                bgcolor: "#FEC91F",
                "&:hover": {
                  bgcolor: "#FEC91F",
                  opacity: 0.9,
                },
              }}
            >
              Se Connecter
            </CustomButton>
          </Box>
        )
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
      {/* Formes décoratives */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #FFC107, #FF9800)",
          opacity: 0.7,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #2196F3, #00BCD4)",
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Carte de connexion */}
      <Paper
        elevation={3} 
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          zIndex: 1,
          position: "relative",
          height: { xs: "auto", md: "450px" }, 
          boxShadow:'none !important',
          // backgroundCOlor :'rgba(255,255,255, 10)'
        }}
      > 
        {/* Partie gauche avec logo et titre */}
        <Box
          sx={{
            width: "60%",
            padding: 4,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Box
            component="img"
            src="../../assets/image.png"
            alt="Centre Vonjy Logo"
            sx={{ mb: 3, maxWidth: 150 }}
          />
          <H1 sx={{ textAlign: "center", mb: 1 }}>Projet Centre Vonjy</H1>
          <Paragraphe sx={{ textAlign: "center" }}>Bienvenue dans la plateforme!</Paragraphe>
        </Box>

        {/* Partie droite avec formulaire */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            padding: 8,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {renderView()}
        </Box>
      </Paper>
    </Box>
  )
}
